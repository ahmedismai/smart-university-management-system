/** Minimal Google Gemini client (REST). The key is read from GEMINI_API_KEY and never logged. */
// Model name comes from AI_MODEL_NAME in .env.local (falls back to GEMINI_MODEL, then gemini-2.5-flash)
const modelName = () => (process.env.AI_MODEL_NAME || process.env.GEMINI_MODEL || "gemini-2.5-flash").replace(/^models\//, "");

type Turn = { role: "user" | "assistant"; content: string };

export class GeminiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export async function askGemini(system: string, messages: Turn[]): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError("GEMINI_API_KEY is not set");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName()}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    // keep the provider's message (it never contains the key) but not the request
    let detail = "";
    try {
      detail = (await res.json())?.error?.message || "";
    } catch {}
    throw new GeminiError(`Gemini ${res.status}: ${detail.slice(0, 200)}`, res.status);
  }

  const json = await res.json();
  if (json.promptFeedback?.blockReason) throw new GeminiError(`Blocked: ${json.promptFeedback.blockReason}`);
  const text = (json.candidates?.[0]?.content?.parts || [])
    .map((p: any) => p.text || "")
    .join("")
    .trim();
  if (!text) throw new GeminiError("Empty answer");
  return text;
}
