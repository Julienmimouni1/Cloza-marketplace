import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductStatus, Category } from "@/generated/client";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    vendor: {
      findUnique: vi.fn(),
    },
    product: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    productImage: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn((promises) => Promise.all(promises)),
  },
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Vendor Product Actions", () => {
  const mockUser = { id: "user-1" };
  const mockVendor = { id: "vendor-1", userId: "user-1" };
  const validProductData = {
    name: "Test Product",
    description: "Description longer than 10 chars",
    priceHt: 100,
    stock: 10,
    category: Category.Textile,
    images: [{ url: "https://example.com/image.jpg", isMain: true, order: 0 }],
    tags: ["test"],
    status: ProductStatus.DRAFT,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (auth as any).mockResolvedValue({ user: mockUser });
  });

  describe("createProduct", () => {
    it("should create a product when user is a vendor", async () => {
      (prisma.vendor.findUnique as any).mockResolvedValue(mockVendor);
      (prisma.product.create as any).mockResolvedValue({ id: "prod-1", ...validProductData });

      const result = await createProduct(validProductData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("prod-1");
      }
      expect(prisma.vendor.findUnique).toHaveBeenCalledWith({ where: { userId: "user-1" } });
      expect(prisma.product.create).toHaveBeenCalled();
    });

    it("should fail if user is not authenticated", async () => {
      (auth as any).mockResolvedValue(null);
      const result = await createProduct(validProductData);
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("UNAUTHORIZED");
    });

    it("should fail if user is not a vendor", async () => {
      (prisma.vendor.findUnique as any).mockResolvedValue(null);
      const result = await createProduct(validProductData);
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("FORBIDDEN");
    });
  });

    describe("updateProduct", () => {
    it("should update a product when owned by vendor", async () => {
      (prisma.vendor.findUnique as any).mockResolvedValue(mockVendor);
      (prisma.product.findUnique as any).mockResolvedValue({ id: "prod-1", vendorId: "vendor-1" });
      (prisma.product.update as any).mockResolvedValue({ id: "prod-1", ...validProductData });

      const result = await updateProduct("prod-1", validProductData);

      expect(result.success).toBe(true);
      expect(prisma.product.update).toHaveBeenCalled();
    });

    it("should fail if product does not belong to vendor", async () => {
      (prisma.vendor.findUnique as any).mockResolvedValue(mockVendor);
      (prisma.product.findUnique as any).mockResolvedValue({ id: "prod-1", vendorId: "other-vendor" });

      const result = await updateProduct("prod-1", validProductData);

      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe("FORBIDDEN");
    });
  });

  describe("deleteProduct", () => {
    it("should archive a product when owned by vendor", async () => {
      (prisma.vendor.findUnique as any).mockResolvedValue(mockVendor);
      (prisma.product.findUnique as any).mockResolvedValue({ id: "prod-1", vendorId: "vendor-1" });
      (prisma.product.update as any).mockResolvedValue({ id: "prod-1", status: ProductStatus.ARCHIVED });

      const result = await deleteProduct("prod-1");

      expect(result.success).toBe(true);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: "prod-1" },
        data: { status: ProductStatus.ARCHIVED },
      });
    });
  });
});

