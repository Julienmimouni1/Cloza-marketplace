import { z } from "zod";
import { Category } from "@/generated/client";

export const DEFAULT_COMMISSION_BPS = 1500; // 15.00%

export const exceptionSchema = z.object({
  category: z.nativeEnum(Category),
  rate: z.coerce.number().min(0).max(100),
});

export const payoutSettingsSchema = z.object({
  schedule: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  payoutsEnabled: z.boolean(),
  suspensionReason: z.string().optional(),
});

