import { z } from "zod";

export const occasionEnum = z.enum([
  "CASUAL",
  "OFFICIAL",
  "TRADITIONAL",
  "WEDDING",
  "PARTY",
]);

export const measurementsSchema = z.object({
  bust: z.number().positive(),
  waist: z.number().positive(),
  hips: z.number().positive(),
  shoulder: z.number().positive(),
  length: z.number().positive(),
});

export const createSubmissionSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(1),
  occasion: occasionEnum,
  fabricImageUrl: z.string().min(1),
  fabricLabel: z.string().min(1),
  pricePerYard: z.number().positive(),
  measurements: measurementsSchema,
});

export const finalizeSubmissionSchema = z.object({
  submissionId: z.string().min(1),
  chosenTemplateId: z.string().min(1),
  tailorId: z.string().min(1),
});

export const initiatePaymentSchema = z.object({
  submissionId: z.string().min(1),
});
