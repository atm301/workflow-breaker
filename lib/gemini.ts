const GEMINI_MODEL = "gemini-2.5-flash";

export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90_000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 8192,
              thinkingConfig: { thinkingBudget: 2048 },
            },
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

      // Gemini 2.5 Flash may return thinking + text parts; get the last text part
      const parts = data.candidates?.[0]?.content?.parts || [];
      const textPart = [...parts].reverse().find((p: { text?: string }) => p.text && !p.text.startsWith("<"));
      const text = (textPart?.text || parts[parts.length - 1]?.text || "").trim();
      if (!text) throw new Error("AI returned empty response");

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        if (attempt === 0) continue;
        throw new Error("AI response format error");
      }

      try {
        JSON.parse(jsonMatch[0]);
      } catch {
        if (attempt === 0) continue;
        throw new Error("AI response JSON parse error");
      }

      return jsonMatch[0];
    } catch (err) {
      if (attempt === 1) throw err;
      if (err instanceof Error && err.message === "QUOTA_EXHAUSTED") throw err;
    }
  }

  throw new Error("AI generation failed");
}
