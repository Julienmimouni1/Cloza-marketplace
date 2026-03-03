export function calculateVatNumber(siret: string): string | null {
  const cleanSiret = siret.replace(/\s/g, "");
  if (!/^\d{14}$/.test(cleanSiret)) {
    return null;
  }

  const siren = cleanSiret.substring(0, 9);
  const sirenNum = parseInt(siren, 10);

  if (isNaN(sirenNum)) {
    return null;
  }

  const vatKey = (12 + 3 * (sirenNum % 97)) % 97;
  const vatKeyStr = vatKey.toString().padStart(2, "0");

  return `FR${vatKeyStr}${siren}`;
}
