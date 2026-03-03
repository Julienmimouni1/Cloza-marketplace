import { z } from "zod";

export const billingSchema = z.object({
  companyLegalName: z.string().min(1, "Legal name is required"),
  vatNumber: z.string().optional(),
  iban: z.string().min(1, "IBAN is required"),
  bic: z.string().min(1, "BIC is required"),
  bankName: z.string().min(1, "Bank name is required"),
});

export const shippingSchema = z.object({
  defaultCarrier: z.string().min(1, "Carrier is required"),
  returnAddress: z.string().optional(),
  handlingTime: z.coerce.number().min(0).default(1),
});

export const identitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company Name is required"),
  siret: z.string().optional(),
  vatNumber: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
