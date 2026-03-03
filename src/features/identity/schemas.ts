import { z } from 'zod';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// --- Registration Schemas ---

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirmation must be at least 6 characters"),
  role: z.string(),
  companyName: z.string().min(2, "Company name must be at least 2 characters").optional().or(z.literal('')),
  siret: z.string().optional().refine((val) => !val || val.length === 14, {
    message: "SIRET must be 14 digits",
  }),
  vatNumber: z.string().min(4, "VAT number is required").optional().or(z.literal('')),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const companyInfoSchema = z.object({
  companyName: z.string().optional(),
  siret: z.string().length(14, "SIRET must be 14 digits").optional(),
  vatNumber: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
});

export type CompanyInfoInput = z.infer<typeof companyInfoSchema>;

// --- KYB Upload Schemas ---

// Schema for parsing the fields from FormData
export const UploadKybFieldsSchema = z.object({
  type: z.enum(['KBIS', 'IDENTITY'], {
    message: "Document type must be 'KBIS' or 'IDENTITY'"
  }),
});

export type UploadKybInput = z.infer<typeof UploadKybFieldsSchema>;
