"use server";

import { prisma } from "@/lib/prisma";
import { RegisterSchema, RegisterInput, companyInfoSchema, CompanyInfoInput } from "./schemas";
import bcrypt from "bcryptjs";
import { signIn, auth } from "@/lib/auth";
import { AuthError } from "next-auth";
import { fetchCompanyDetails } from "./services/pappers";

type ActionResponse<T> = { success: true; data: T } | { success: false; error: { code: string; message: string } };

export async function registerUser(values: RegisterInput): Promise<ActionResponse<{ message: string; role: string }>> {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: { code: "INVALID_FIELDS", message: "Invalid fields" } };
  }

  const { email, password, name, role, companyName, siret, address, zipCode, city, vatNumber, phoneNumber } = validatedFields.data;
  
  // Security: Enforce allowed roles and validation
  if (role === 'ADMIN') {
    return { success: false, error: { code: "FORBIDDEN", message: "Cannot register as Admin" } };
  }
  
  const finalRole = role === 'VENDOR' ? 'VENDOR' : 'RETAILER';
  
  if (finalRole === 'VENDOR' && !companyName) {
     return { success: false, error: { code: "MISSING_COMPANY", message: "Company name is required for vendors" } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: { code: "USER_EXISTS", message: "Email already in use" } };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
        companyName: companyName,
        siret: siret,
        address: address,
        zipCode: zipCode,
        city: city,
        vatNumber: vatNumber,
        phoneNumber: phoneNumber,
        termsAcceptedAt: new Date(),
      },
    });

    // If it's a vendor, create the Vendor profile automatically
    if (finalRole === "VENDOR" && companyName) {
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 5);
      await prisma.vendor.create({
        data: {
          name: companyName,
          slug: slug,
          userId: user.id,
        }
      });
    }

    // Auto sign-in after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, data: { message: "User created successfully", role: user.role } };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } };
  }
}

export async function lookupSiretPublic(siret: string): Promise<ActionResponse<{
  companyName: string;
  siret: string;
  vatNumber: string;
  address: string;
  zipCode: string;
  city: string;
  status: "ACTIVE" | "CLOSED";
}>> {
  // Public action, no session check needed for basic company info
  const cleanSiret = siret.replace(/\s/g, "");
  if (!/^\d{14}$/.test(cleanSiret)) {
     return { success: false, error: { code: "INVALID_FORMAT", message: "Le SIRET doit comporter 14 chiffres." } };
  }

  try {
      const company = await fetchCompanyDetails(cleanSiret);

      if (!company) {
          return { success: false, error: { code: "NOT_FOUND", message: "Entreprise introuvable." } };
      }

      return {
          success: true,
          data: company
      };
  } catch (error) {
      return { success: false, error: { code: "API_ERROR", message: "Erreur lors de la récupération des données." } };
  }
}

export async function loginUser(values: { email: string; password: string }): Promise<ActionResponse<null>> {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        return { success: true, data: null };
    } catch (error) {
        console.error("Login Error Details:", error);
        if (error instanceof AuthError) {
             switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: { code: "INVALID_CREDENTIALS", message: "Email ou mot de passe incorrect" } };
                default:
                    return { success: false, error: { code: "AUTH_ERROR", message: `Erreur Auth: ${error.message}` } };
             }
        }
        // Pour les erreurs de base de données ou autres
        return { success: false, error: { code: "SERVER_ERROR", message: error instanceof Error ? error.message : "Erreur serveur inconnue" } };
    }
}

export async function lookupSiret(siret: string): Promise<ActionResponse<{
  companyName: string;
  siret: string;
  vatNumber: string;
  address: string;
  zipCode: string;
  city: string;
  status: "ACTIVE" | "CLOSED";
}>> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non autorisé" } };
  }

  const cleanSiret = siret.replace(/\s/g, "");
  if (!/^\d{14}$/.test(cleanSiret)) {
     return { success: false, error: { code: "INVALID_FORMAT", message: "Le SIRET doit comporter 14 chiffres." } };
  }

  try {
      const company = await fetchCompanyDetails(cleanSiret);

      if (!company) {
          return { success: false, error: { code: "NOT_FOUND", message: "Entreprise introuvable." } };
      }

      return {
          success: true,
          data: company
      };
  } catch (error) {
      return { success: false, error: { code: "API_ERROR", message: "Erreur lors de la récupération des données." } };
  }
}

export async function updateCompanyInfo(values: CompanyInfoInput): Promise<ActionResponse<{ message: string }>> {
    const session = await auth();
    if (!session?.user?.email) {
         return { success: false, error: { code: "UNAUTHORIZED", message: "Non autorisé" } };
    }

    const validated = companyInfoSchema.safeParse(values);
    if (!validated.success) {
        return { success: false, error: { code: "INVALID_FIELDS", message: "Champs invalides" } };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { email: session.user.email as string },
                data: {
                    ...validated.data,
                },
                include: { vendor: true }
            });

            // Sync Vendor name if it exists and companyName was updated
            if (user.vendor && validated.data.companyName) {
                await tx.vendor.update({
                    where: { id: user.vendor.id },
                    data: { name: validated.data.companyName }
                });
            }
        });
        return { success: true, data: { message: "Informations mises à jour" } };
    } catch (e) {
        return { success: false, error: { code: "DB_ERROR", message: "Erreur base de données" } };
    }
}
