import { GarmentCategory, Gender } from "@prisma/client";

export interface Measurements {
  bust: number;
  waist: number;
  hips: number;
  shoulder: number;
  length: number;
  neck?: number;
  sleeveLength?: number;
}

// Reference bodies (cm) that BASE_YARDAGE below is calibrated against.
// `bust` doubles as chest circumference for male measurements.
const REFERENCE: Record<Gender, { bust: number; waist: number; hips: number; length: number }> = {
  FEMALE: { bust: 90, waist: 70, hips: 95, length: 100 },
  MALE: { bust: 100, waist: 85, hips: 100, length: 105 },
};

// Base yardage (yards) for the reference body, per garment category.
const BASE_YARDAGE: Record<GarmentCategory, number> = {
  DRESS: 3.5,
  TOP: 1.75,
  TROUSERS: 2.25,
  SKIRT: 1.75,
  AGBADA: 6,
  KAFTAN: 4,
  SUIT: 4.5,
  GOWN: 5,
  JUMPSUIT: 3.75,
  SHORTS: 1.25,
  SET: 3.5,
};

const MIN_YARDAGE = 1.25;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateYardage(
  garment: GarmentCategory,
  measurements: Measurements,
  gender: Gender = Gender.FEMALE
): number {
  const ref = REFERENCE[gender];
  const sizeFactor = clamp(
    (measurements.bust / ref.bust + measurements.waist / ref.waist + measurements.hips / ref.hips) /
      3,
    0.75,
    1.6
  );
  const lengthFactor = clamp(measurements.length / ref.length, 0.6, 1.8);

  const raw = BASE_YARDAGE[garment] * (0.6 * sizeFactor + 0.4 * lengthFactor);
  const roundedToQuarter = Math.round(raw * 4) / 4;

  return Math.max(roundedToQuarter, MIN_YARDAGE);
}
