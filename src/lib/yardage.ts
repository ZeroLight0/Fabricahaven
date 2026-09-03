import { GarmentCategory } from "@prisma/client";

export interface Measurements {
  bust: number;
  waist: number;
  hips: number;
  shoulder: number;
  length: number;
}

// Reference body (cm) that BASE_YARDAGE below is calibrated against.
const REFERENCE = { bust: 90, waist: 70, hips: 95, length: 100 };

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
  measurements: Measurements
): number {
  const sizeFactor = clamp(
    (measurements.bust / REFERENCE.bust +
      measurements.waist / REFERENCE.waist +
      measurements.hips / REFERENCE.hips) /
      3,
    0.75,
    1.6
  );
  const lengthFactor = clamp(measurements.length / REFERENCE.length, 0.6, 1.8);

  const raw = BASE_YARDAGE[garment] * (0.6 * sizeFactor + 0.4 * lengthFactor);
  const roundedToQuarter = Math.round(raw * 4) / 4;

  return Math.max(roundedToQuarter, MIN_YARDAGE);
}
