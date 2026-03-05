const GEMINI_MODEL = "gemini-2.5-flash";
export const FALLBACK_MODEL = "gemini-2.0-flash";

/**
 * Streaming call: yields raw text chunks from Gemini.
 * The caller is responsible for accumulating and JSON-parsing.
 */
export async function* streamGemini(prompt: string, model: string = GEMINI_MODEL): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  const useThinking = model === GEMINI_MODEL;
  const genConfig: Record<string, unknown> = { temperature: 0.5, maxOutputTokens: 8192 };
  if (useThinking) genConfig.thinkingConfig = { thinkingBudget: 2048 };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: genConfig,
      }),
    }
  );
  clearTimeout(timeout);

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    if (errText.includes("RESOURCE_EXHAUSTED") || errText.includes("quota")) {
      throw new Error("QUOTA_EXHAUSTED");
    }
    throw new Error(`Gemini API error (${res.status})`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // SSE format: lines starting with "data: " followed by JSON
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const chunk = JSON.parse(json);
        const parts = chunk.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.text && !part.text.startsWith("<")) {
            yield part.text;
          }
        }
      } catch { /* skip malformed chunks */ }
    }
  }
}

async function callModel(prompt: string, model: string, useThinking: boolean): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  const genConfig: Record<string, unknown> = { temperature: 0.5, maxOutputTokens: 8192 };
  if (useThinking) genConfig.thinkingConfig = { thinkingBudget: 2048 };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: genConfig,
      }),
    }
  );
  clearTimeout(timeout);

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    if (errText.includes("RESOURCE_EXHAUSTED") || errText.includes("quota")) {
      throw new Error("QUOTA_EXHAUSTED");
    }
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  if (data.error) {
    const msg = data.error.message || "";
    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
      throw new Error("QUOTA_EXHAUSTED");
    }
    throw new Error(msg || "Gemini API error");
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  const textPart = [...parts].reverse().find((p: { text?: string }) => p.text && !p.text.startsWith("<"));
  const text = (textPart?.text || parts[parts.length - 1]?.text || "").trim();
  if (!text) throw new Error("AI returned empty response");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI response format error");

  JSON.parse(jsonMatch[0]); // validate JSON
  return jsonMatch[0];
}

/**
 * Non-streaming call with multi-model fallback:
 * 1. Try primary model (gemini-2.5-flash with thinking)
 * 2. Retry primary once on format error
 * 3. Fallback to secondary model (gemini-2.0-flash, no thinking)
 */
export async function callGemini(prompt: string): Promise<string> {
  // Attempt 1: primary model
  try {
    return await callModel(prompt, GEMINI_MODEL, true);
  } catch (err) {
    if (err instanceof Error && err.message === "QUOTA_EXHAUSTED") throw err;
    // Attempt 2: retry primary
    try {
      return await callModel(prompt, GEMINI_MODEL, true);
    } catch (err2) {
      if (err2 instanceof Error && err2.message === "QUOTA_EXHAUSTED") throw err2;
      // Attempt 3: fallback model
      console.warn(`[gemini] Primary model failed, falling back to ${FALLBACK_MODEL}`);
      return await callModel(prompt, FALLBACK_MODEL, false);
    }
  }
}
