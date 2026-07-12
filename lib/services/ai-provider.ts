/**
 * AI provider abstraction.
 *
 * Huntly's agents are written against this interface, never against a
 * specific vendor SDK. In production this calls out to GPT-5.5 (or any
 * OpenAI-compatible chat completions endpoint) using the AI_PROVIDER_*
 * environment variables. When no key is configured -- e.g. running the
 * hackathon demo offline -- callers should fall back to the deterministic
 * mock generators colocated with each agent so the product still feels
 * complete end to end.
 */

export interface StructuredCompletionRequest {
  system: string;
  prompt: string;
  temperature?: number;
}

export function isAIProviderConfigured(): boolean {
  return Boolean(process.env.AI_PROVIDER_API_KEY);
}

/**
 * Requests a JSON object back from the configured LLM. Returns null when no
 * provider is configured, or when the call fails for any reason, so callers
 * can fall back to mock data without the demo ever breaking.
 */
export async function requestStructuredCompletion<T>(
  req: StructuredCompletionRequest
): Promise<T | null> {
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  const baseUrl = process.env.AI_PROVIDER_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_PROVIDER_MODEL ?? "gpt-5.5";

  if (!apiKey) return null;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: req.temperature ?? 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: req.system },
          { role: "user", content: req.prompt },
        ],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/** Deterministic pseudo-random helper so mock output still varies slightly per run. */
export function jitter(base: number, spread: number): number {
  return Math.round(base + (Math.random() * 2 - 1) * spread);
}
