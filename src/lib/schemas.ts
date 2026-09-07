import { z } from "zod";

export const occasionEnum = z.enum([
  "CASUAL",
  "OFFICIAL",
  "TRADITIONAL",
  "WEDDING",
  "PARTY",
]);

export const genderEnum = z.enum(["MALE", "FEMALE"]);

export const measurementsSchema = z.object({
  bust: z.number().positive(),
  waist: z.number().positive(),
  hips: z.number().positive(),
  shoulder: z.number().positive(),
  length: z.number().positive(),
  neck: z.number().positive().optional(),
  sleeveLength: z.number().positive().optional(),
});

export const createSubmissionSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string().min(1),
    gender: genderEnum,
    occasion: occasionEnum,
    fabricImageUrl: z.string().min(1),
    fabricLabel: z.string().min(1),
    pricePerYard: z.number().positive(),
    measurements: measurementsSchema,
  })
  .refine(
    (data) =>
      data.gender !== "MALE" ||
      (data.measurements.neck !== undefined && data.measurements.sleeveLength !== undefined),
    {
      message: "neck and sleeveLength are required for male submissions",
      path: ["measurements"],
    }
  );

export const finalizeSubmissionSchema = z.object({
  submissionId: z.string().min(1),
  chosenTemplateId: z.string().min(1),
  tailorId: z.string().min(1),
});

export const initiatePaymentSchema = z.object({
  submissionId: z.string().min(1),
});
