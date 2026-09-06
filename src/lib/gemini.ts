export const GEMINI_MODEL = "gemini-3.6-flash";

export interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

const RETRYABLE_STATUSES = new Set([429, 503]);
const RETRY_DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

export async function generateGeminiContent(
  parts: GeminiPart[],
  responseSchema: object,
  maxOutputTokens: number
): Promise<string> {
  let res = await callGemini(parts, responseSchema, maxOutputTokens);

  if (!res.ok && RETRYABLE_STATUSES.has(res.status)) {
    console.warn(`Gemini API returned ${res.status}, retrying once after ${RETRY_DELAY_MS}ms...`);
    await sleep(RETRY_DELAY_MS);
    res = await callGemini(parts, responseSchema, maxOutputTokens);
  }

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new Error(
      `Gemini response did not contain text content (finishReason: ${finishReason}). ` +
        `If this is MAX_TOKENS, maxOutputTokens (${maxOutputTokens}) was likely exhausted by internal reasoning before an answer was produced.`
    );
  }
  return text;
}
