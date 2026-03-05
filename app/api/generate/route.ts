import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import type { Lang, Strategy } from "@/lib/i18n";

// Simple in-memory rate limit: 10 req / hour / IP
const rateMap = new Map<string, { count: number; reset: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 3600_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// Result cache: hash → { data, ts }  TTL = 30 min
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 30 * 60 * 1000;

function cacheKey(goal: string, strategy: string, lang: string): string {
  return `${goal.toLowerCase().trim()}::${strategy}::${lang}`;
}

function getMethodInstruction(strategy: Strategy, lang: Lang): string {
  const instructions: Record<Strategy, string> = {
    auto: lang === "zh"
      ? "分析目標後，自動從 WBS、User Story、SIPOC、5W1H 中選擇最適合的方法來拆解。在回應中說明你選擇了哪個方法。"
      : "Analyze the goal and automatically select the MOST APPROPRIATE method among WBS, User Story, SIPOC, 5W1H. Mention which method you chose.",
    wbs: lang === "zh"
      ? "使用 WBS（Work Breakdown Structure）工作分解結構來拆解。聚焦於「階段 > 里程碑 > 可交付成果」的層級拆解。"
      : "Use WBS (Work Breakdown Structure). Focus on Phase > Milestone > Deliverable hierarchy.",
    userStory: lang === "zh"
      ? "使用 User Story Map（使用者故事地圖）來拆解。從使用者旅程出發，聚焦功能如何為用戶創造價值。"
      : "Use User Story Map. Focus on user journey and how features create value for users.",
    sipoc: lang === "zh"
      ? "使用 SIPOC 流程模型來拆解。釐清每個階段的供應商、輸入、流程、輸出和客戶。"
      : "Use SIPOC model. Clarify Supplier, Input, Process, Output, Customer for each phase.",
    fiveW: lang === "zh"
      ? "使用 5W1H 分析法來拆解。透過 Who, What, When, Where, Why, How 進行全方位掃描。"
      : "Use 5W1H analysis. Cover Who, What, When, Where, Why, How comprehensively.",
  };
  return instructions[strategy];
}

function buildPrompt(goal: string, context: string, lang: Lang, strategy: Strategy): string {
  const langInstruction = lang === "zh" ? "請用繁體中文回覆。" : "Please respond in English.";
  const methodInstruction = getMethodInstruction(strategy, lang);

  return `You are a professional Workflow Architect and project planner.

${langInstruction}

Decomposition Method: ${methodInstruction}

The user has a goal: "${goal}"
${context ? `Additional context: "${context}"` : ""}

Break this goal down into a structured workflow. Return ONLY valid JSON (no markdown, no explanation) with this exact structure:

{
  "goal": "the goal restated clearly",
  "method": "${strategy === "auto" ? "the method you chose (wbs/userStory/sipoc/fiveW)" : strategy}",
  "phases": [
    {
      "name": "${lang === "zh" ? "Phase 1: 階段名稱" : "Phase 1: Phase Name"}",
      "duration": "${lang === "zh" ? "2 週" : "2 weeks"}",
      "steps": [
        {
          "title": "${lang === "zh" ? "步驟標題" : "Step title"}",
          "description": "${lang === "zh" ? "詳細說明這一步要做什麼" : "Detailed description of what to do"}",
          "deliverable": "${lang === "zh" ? "這步的產出物" : "Output of this step"}",
          "estimatedTime": "${lang === "zh" ? "2-3 天" : "2-3 days"}",
          "dependencies": [],
          "tips": "${lang === "zh" ? "實用建議或工具推薦" : "Practical tips or tool recommendations"}"
        }
      ]
    }
  ],
  "totalEstimatedTime": "${lang === "zh" ? "12 週" : "12 weeks"}",
  "criticalPath": ["${lang === "zh" ? "最重要的步驟名稱" : "Most critical step names"}"],
  "risks": ["${lang === "zh" ? "可能的風險" : "Possible risks"}"]
}

Rules:
- Create 3-6 phases with 2-5 steps each
- Be specific and actionable, not generic
- Include realistic time estimates
- Dependencies should reference step titles from earlier phases
- Tips should include specific tools, methods, or resources
- Risks should be specific to this goal
- Return ONLY the JSON object, nothing else`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip") || "unknown";

    if (!checkRate(ip)) {
      return NextResponse.json({ error: "rate_limit", message: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();
    const { goal, context = "", lang = "zh", strategy = "auto" } = body as {
      goal: string; context?: string; lang?: Lang; strategy?: Strategy;
    };

    if (!goal || goal.trim().length < 2) {
      return NextResponse.json({ error: "invalid_input", message: "Goal is required" }, { status: 400 });
    }

    const validStrategies: Strategy[] = ["auto", "wbs", "userStory", "sipoc", "fiveW"];
    const safeStrategy = validStrategies.includes(strategy as Strategy) ? strategy as Strategy : "auto";

    // Check cache (only for same goal+strategy+lang, ignoring context for broader hits)
    const key = cacheKey(goal.trim(), safeStrategy, lang as string);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL && !context.trim()) {
      return NextResponse.json({ success: true, data: cached.data, cached: true });
    }

    const prompt = buildPrompt(goal.trim(), context.trim(), lang as Lang, safeStrategy);
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    // Store in cache
    if (!context.trim()) {
      cache.set(key, { data: result, ts: Date.now() });
      // Clean old entries
      if (cache.size > 100) {
        const now = Date.now();
        for (const [k, v] of cache) { if (now - v.ts > CACHE_TTL) cache.delete(k); }
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg === "QUOTA_EXHAUSTED") {
      return NextResponse.json({ error: "quota_exhausted", message: "API quota exhausted" }, { status: 503 });
    }
    console.error("[generate] Error:", msg);
    return NextResponse.json({ error: "server_error", message: msg }, { status: 500 });
  }
}
