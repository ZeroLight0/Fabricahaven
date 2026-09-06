export const GEMINI_MODEL = "gemini-3.6-flash";

export interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

/** Thrown when Gemini's free-tier daily quota is used up — retrying won't
 * help until the quota resets (or the plan is upgraded), unlike a
 * transient 503/short-lived 429. */
export class GeminiQuotaExhaustedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiQuotaExhaustedError";
  }
}

const RETRYABLE_STATUSES = new Set([429, 503]);
const RETRY_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDailyQuotaExhausted(status: number, body: string): boolean {
  if (status !== 429) return false;
  try {
    const parsed = JSON.parse(body);
    if (parsed?.error?.status !== "RESOURCE_EXHAUSTED") return false;
    const violations = (parsed?.error?.details ?? []).flatMap(
      (d: { violations?: { quotaId?: string }[] }) => d.violations ?? []
    );
    return violations.some(
      (v: { quotaId?: string }) => typeof v.quotaId === "string" && /PerDay/i.test(v.quotaId)
    );
  } catch {
    return false;
  }
}

async function callGemini(
  parts: GeminiPart[],
  responseSchema: object,
  maxOutputTokens: number
): Promise<Response> {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
          maxOutputTokens,
        },
      }),
    }
  );
}

function extractText(data: unknown, maxOutputTokens: number): string {
  const text = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
    ?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    const finishReason = (data as { candidates?: { finishReason?: string }[] })?.candidates?.[0]
      ?.finishReason;
    throw new Error(
      `Gemini response did not contain text content (finishReason: ${finishReason}). ` +
        `If this is MAX_TOKENS, maxOutputTokens (${maxOutputTokens}) was likely exhausted by internal reasoning before an answer was produced.`
    );
  }
  return text;
}

export async function generateGeminiContent(
  parts: GeminiPart[],
  responseSchema: object,
  maxOutputTokens: number
): Promise<string> {
  const MAX_ATTEMPTS = 2;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await callGemini(parts, responseSchema, maxOutputTokens);

    if (res.ok) {
      return extractText(await res.json(), maxOutputTokens);
    }

    const errorBody = await res.text();

    if (isDailyQuotaExhausted(res.status, errorBody)) {
      throw new GeminiQuotaExhaustedError(
        "Gemini's free-tier daily quota has been used up for today. Upgrade the API key's " +
          "billing plan, or wait for the quota to reset — retrying will not help until then."
      );
    }

    const canRetry = attempt < MAX_ATTEMPTS && RETRYABLE_STATUSES.has(res.status);
    if (!canRetry) {
      throw new Error(`Gemini API error (${res.status}): ${errorBody}`);
    }

    console.warn(`Gemini API returned ${res.status}, retrying after ${RETRY_DELAY_MS}ms...`);
    await sleep(RETRY_DELAY_MS);
  }

  throw new Error("Gemini API request failed after retries");
}
