import { describe, it, expect } from "vitest";
import { calculateVatNumber } from "../utils/vat-utils";

describe("calculateVatNumber", () => {
  it("should calculate correct VAT number for valid SIRET", () => {
    // Example: LVMH SIREN 775 670 417
    // VAT Key: (12 + 3 * (775670417 % 97)) % 97
    // 775670417 % 97 = 23
    // 12 + 3 * 23 = 12 + 69 = 81
    // 81 % 97 = 81
    // Result: FR81775670417
    // SIRET needs 14 digits, so let's append 00010
    const siret = "77567041700010";
    expect(calculateVatNumber(siret)).toBe("FR81775670417");
  });

  it("should return null for invalid SIRET length", () => {
    expect(calculateVatNumber("123")).toBeNull();
  });

  it("should return null for non-numeric SIRET", () => {
    expect(calculateVatNumber("abcdefghijklmn")).toBeNull();
  });

  it("should handle spaces in SIRET", () => {
    const siret = "775 670 417 00010";
    expect(calculateVatNumber(siret)).toBe("FR81775670417");
  });
});
