import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import type { Lang } from "@/lib/i18n";

// Shared rate limit with generate (uses same IP pool concept)
const rateMap = new Map<string, { count: number; reset: number }>();
function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 3600_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip") || "unknown";
    if (!checkRate(ip)) {
      return NextResponse.json({ error: "rate_limit" }, { status: 429 });
    }

    const { stepTitle, stepDescription, goal, lang = "zh" } = await req.json() as {
      stepTitle: string; stepDescription: string; goal: string; lang?: Lang;
    };

    if (!stepTitle) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const langInst = lang === "zh" ? "請用繁體中文回覆。" : "Please respond in English.";

    const prompt = `${langInst}

You are a workflow expert. The user is working on: "${goal}"

They want more detail on this specific step:
- Step: "${stepTitle}"
- Description: "${stepDescription}"

Break this step down into 3-6 actionable sub-steps. Return ONLY valid JSON:

{
  "subSteps": [
    {
      "title": "sub-step title",
      "description": "what to do",
      "estimatedTime": "1-2 hours",
      "tools": "recommended tools or resources"
    }
  ]
}

Be specific and practical. Return ONLY the JSON.`;

    const raw = await callGemini(prompt);
    const result = JSON.parse(raw);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg === "QUOTA_EXHAUSTED") {
      return NextResponse.json({ error: "quota_exhausted" }, { status: 503 });
    }
    return NextResponse.json({ error: "server_error", message: msg }, { status: 500 });
  }
}
