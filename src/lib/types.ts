export type OccasionValue = "CASUAL" | "OFFICIAL" | "TRADITIONAL" | "WEDDING" | "PARTY";

export const OCCASIONS: { value: OccasionValue; label: string }[] = [
  { value: "CASUAL", label: "Casual" },
  { value: "OFFICIAL", label: "Official" },
  { value: "TRADITIONAL", label: "Traditional" },
  { value: "WEDDING", label: "Wedding" },
  { value: "PARTY", label: "Party" },
];

export type GenderValue = "MALE" | "FEMALE";

export const GENDERS: { value: GenderValue; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export interface MeasurementsInput {
  bust: string;
  waist: string;
  hips: string;
  shoulder: string;
  length: string;
  neck: string;
  sleeveLength: string;
}

export interface FabricSuggestion {
  likelyType: string;
  colorway: string;
  patternDescription: string;
  confidence: number;
}

export const COMMISSION_NOTICE =
  "Tailor commission will be sent after confirmation by the tailor.";

export const STYLE_DISCLAIMER =
  "Style suggestions are a starting recommendation — your tailor can advise on the best fit for your fabric.";

export const NDPA_NOTICE =
  "We collect your name, email, phone, and address to process this order and share it with your chosen tailor — see our privacy notice for details.";
