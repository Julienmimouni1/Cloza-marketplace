import { describe, it, expect, vi } from "vitest";

// Mock modules BEFORE importing the SUT
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({ user: { email: "test@example.com" } }),
  signIn: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
      user: {
          findUnique: vi.fn(),
          create: vi.fn(),
          update: vi.fn(),
      }
  }
}));

vi.mock("next-auth", () => ({
  AuthError: class extends Error {
      type: string;
      constructor(type: string) {
          super(type);
          this.type = type;
      }
  },
}));

import { lookupSiret } from "../actions";

describe("lookupSiret", () => {
  it("should return error for invalid format", async () => {
    const result = await lookupSiret("123");
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.code).toBe("INVALID_FORMAT");
    }
  });

  it("should return mock data for valid SIRET (Active)", async () => {
    // 77567041700010 is the LVMH mock or generic mock
    const result = await lookupSiret("77567041700010");
    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data.companyName).toBeDefined();
        expect(result.data.status).toBe("ACTIVE");
    }
  });

  it("should return mock data for CLOSED company (SIRET ending in 99999)", async () => {
    const result = await lookupSiret("12345678999999");
    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data.companyName).toBeDefined();
        expect(result.data.status).toBe("CLOSED");
    }
  });
});
