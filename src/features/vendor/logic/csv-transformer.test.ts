import { describe, it, expect } from "vitest";
import { parseLocaleNumber, transformCsvRowToProductInput, CsvRow } from "./csv-transformer";
import { ProductStatus, Category } from "@/generated/client";

describe("CSV Transformer Logic", () => {
  
  describe("parseLocaleNumber", () => {
    it("should parse integer strings", () => {
      expect(parseLocaleNumber("100")).toBe(100);
    });

    it("should parse float strings with dot", () => {
      expect(parseLocaleNumber("10.50")).toBe(10.5);
    });

    it("should parse float strings with comma", () => {
      expect(parseLocaleNumber("10,50")).toBe(10.5);
    });

    it("should parse thousands separator with dot (European)", () => {
      expect(parseLocaleNumber("1.000,50")).toBe(1000.5);
    });

    it("should parse thousands separator with comma (US)", () => {
      expect(parseLocaleNumber("1,000.50")).toBe(1000.5);
    });

    it("should handle spaces", () => {
      expect(parseLocaleNumber("1 000,50")).toBe(1000.5);
    });

    it("should return 0 for invalid input", () => {
      expect(parseLocaleNumber("abc")).toBe(0);
      expect(parseLocaleNumber(null)).toBe(0);
      expect(parseLocaleNumber(undefined)).toBe(0);
    });
  });

  describe("transformCsvRowToProductInput", () => {
    it("should transform valid row correctly", () => {
      const row: CsvRow = {
        name: "Test Product",
        description: "A valid description",
        priceHt: "100",
        stock: "10",
        category: "Textile",
        status: "DRAFT"
      };

      const result = transformCsvRowToProductInput(row, 1);
      
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Test Product");
      expect(result.data.priceHt).toBe(100);
      expect(result.data.category).toBe(Category.Textile);
      expect(result.data.sku).toMatch(/^SKU-/); // Generated SKU
    });

    it("should fail validation for invalid data", () => {
      const row: CsvRow = {
        name: "", // Invalid: min 1 char
        priceHt: "-10", // Invalid: negative
        category: "INVALID" // Invalid Enum
      };

      const result = transformCsvRowToProductInput(row, 1);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain("Validation");
    });

    it("should use provided SKU if present", () => {
      const row: CsvRow = {
        name: "Test",
        sku: "MY-SKU-123",
        priceHt: "10",
        stock: "1",
        category: "Textile"
      };

      const result = transformCsvRowToProductInput(row, 1);
      
      expect(result.success).toBe(true);
      expect(result.data.sku).toBe("MY-SKU-123");
    });

    it("should default stock to 0 if missing", () => {
      const row: CsvRow = {
        name: "No Stock Product",
        priceHt: "50",
        category: "Textile"
        // stock is missing
      };

      const result = transformCsvRowToProductInput(row, 1);
      
      expect(result.success).toBe(true);
      expect(result.data.stock).toBe(0);
    });
  });
});

