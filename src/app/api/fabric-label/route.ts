import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateGeminiContent } from "@/lib/gemini";
import { uploadFabricPhoto } from "@/lib/supabase";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const fabricLabelResponseSchema = {
  type: "OBJECT",
  properties: {
    likelyType: { type: "STRING" },
    colorway: { type: "STRING" },
    patternDescription: { type: "STRING" },
    confidence: { type: "STRING" },
  },
  required: ["likelyType", "colorway", "patternDescription", "confidence"],
};

const fabricLabelSchema = z.object({
  likelyType: z.string(),
  colorway: z.string(),
  patternDescription: z.string(),
  confidence: z.coerce.number().min(0).max(1),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Invalid input", fieldErrors: { file: ["Fabric photo file is required"] } },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Invalid input", fieldErrors: { file: ["Must be a JPEG, PNG, or WEBP image"] } },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "Invalid input", fieldErrors: { file: ["File must be under 10MB"] } },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");

  let fabricImageUrl: string;
  try {
    fabricImageUrl = await uploadFabricPhoto(buffer, file.name, file.type);
  } catch (err) {
    console.error("Fabric photo upload failed:", err);
    return NextResponse.json({ error: "Failed to store fabric photo" }, { status: 500 });
  }

  const prompt = `You are looking at a photo of a fabric a customer owns. Identify your best guess at the fabric's likely material type, colorway, and pattern description.

Be honest about uncertainty: this is a visual best-guess from a 2D photo, not a lab-grade material identification. Your confidence score should reflect that limitation — do not report high confidence unless the fabric's material and pattern are visually unambiguous.

Respond with ONLY a JSON object in this exact shape, no other text:
{"likelyType": "...", "colorway": "...", "patternDescription": "...", "confidence": 0.0}

"confidence" is a number between 0 and 1.`;

  let responseText: string;
  try {
    responseText = await generateGeminiContent(
      [
        {
          inline_data: { mime_type: file.type, data: base64 },
        },
        { text: prompt },
      ],
      fabricLabelResponseSchema,
      512
    );
  } catch (err) {
    console.error("Gemini fabric analysis request failed:", err);
    return NextResponse.json({ error: "Fabric analysis failed, please try again" }, { status: 502 });
  }

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Fabric analysis failed, please try again" }, { status: 502 });
  }

  let suggestion;
  try {
    suggestion = fabricLabelSchema.parse(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error("Fabric analysis response parsing failed:", err, responseText);
    return NextResponse.json({ error: "Fabric analysis failed, please try again" }, { status: 502 });
  }

  return NextResponse.json({ fabricImageUrl, suggestion });
}
