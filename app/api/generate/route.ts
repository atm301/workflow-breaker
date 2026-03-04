import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import type { Lang } from "@/lib/i18n";

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

function buildPrompt(goal: string, context: string, lang: Lang): string {
  const langInstruction = lang === "zh"
    ? "請用繁體中文回覆。"
    : "Please respond in English.";

  return `You are a professional project planner and workflow decomposition expert.

${langInstruction}

The user has a goal: "${goal}"
${context ? `Additional context: "${context}"` : ""}

Break this goal down into a structured workflow. Return ONLY valid JSON (no markdown, no explanation) with this exact structure:

{
  "goal": "the goal restated clearly",
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
      || req.headers.get("x-real-ip")
      || "unknown";

    if (!checkRate(ip)) {
      return NextResponse.json(
        { error: "rate_limit", message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { goal, context = "", lang = "zh" } = body as {
      goal: string;
      context?: string;
      lang?: Lang;
    };

    if (!goal || goal.trim().length < 2) {
      return NextResponse.json(
        { error: "invalid_input", message: "Goal is required" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(goal.trim(), context.trim(), lang as Lang);
    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";

    if (msg === "QUOTA_EXHAUSTED") {
      return NextResponse.json(
        { error: "quota_exhausted", message: "API quota exhausted" },
        { status: 503 }
      );
    }

    console.error("[generate] Error:", msg);
    return NextResponse.json(
      { error: "server_error", message: msg },
      { status: 500 }
    );
  }
}
