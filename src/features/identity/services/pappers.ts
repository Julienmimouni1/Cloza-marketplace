import { calculateVatNumber } from "../utils/vat-utils";

export type CompanyLookupResult = {
  companyName: string;
  siret: string;
  vatNumber: string;
  address: string;
  zipCode: string;
  city: string;
  status: "ACTIVE" | "CLOSED";
};

/**
 * Service to lookup company details from SIRET.
 * Currently uses mocks, but structured to easily swap with Pappers/INSEE API.
 */
export async function fetchCompanyDetails(siret: string): Promise<CompanyLookupResult | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const cleanSiret = siret.replace(/\s/g, "");
  const vat = calculateVatNumber(cleanSiret) || "";

  // Edge Case: Simulate a closed company for a specific SIRET (e.g., ending in 99999)
  if (cleanSiret.endsWith("99999")) {
    return {
      companyName: "ENTREPRISE FERMÉE SAS",
      siret: cleanSiret,
      vatNumber: vat,
      address: "1 Rue de la Fin",
      zipCode: "75000",
      city: "Paris",
      status: "CLOSED",
    };
  }

  // Default Active Mock
  return {
    companyName: "ENTREPRISE DE DEMO SAS",
    siret: cleanSiret,
    vatNumber: vat,
    address: "10 Rue de la Mode",
    zipCode: "75001",
    city: "Paris",
    status: "ACTIVE",
  };
}
