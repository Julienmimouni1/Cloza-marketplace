"use server";

import { prisma } from '@/lib/prisma';
import { ProductFilterSchema } from './schemas';
import { Category, ProductStatus } from '@/generated/client';

export async function getProducts(filters: unknown) {
  const result = ProductFilterSchema.safeParse(filters);
  
  if (!result.success) {
     console.error("Invalid filters:", result.error);
     return [];
  }

  const { category, vendorId } = result.data;

  const categoryMap: Record<string, Category> = {
    'textile': Category.Textile,
    'beauty': Category.Beauty,
    'food': Category.Food,
  };

  const categoryEnum = category 
    ? categoryMap[category.toLowerCase()] 
    : undefined;

  try {
    const products = await prisma.product.findMany({
      where: {
        category: categoryEnum,
        vendorId: vendorId ? vendorId : undefined,
        status: ProductStatus.ACTIVE,
      },
      include: {
        vendor: {
          select: {
            name: true,
          }
        },
        images: true,
      },
      take: 50,
    });

    return products.map(p => ({
      id: p.id,
      title: p.name,
      price: p.priceHt,
      stock: p.stock,
      image: p.image,
      category: p.category,
      slug: p.slug,
      vendorId: p.vendorId,
      vendor: {
        name: p.vendor.name
      },
      images: p.images.map(img => ({
        url: img.url,
        isMain: img.isMain
      }))
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        vendor: {
          select: {
            name: true,
            id: true,
          }
        },
        images: true,
      }
    });

    if (!product || product.status !== ProductStatus.ACTIVE) return null;

    return {
      id: product.id,
      title: product.name,
      description: product.description,
      price: product.priceHt,
      stock: product.stock,
      category: product.category,
      slug: product.slug,
      image: product.image,
      vendorId: product.vendorId,
      vendor: {
        name: product.vendor.name,
        id: product.vendorId
      },
      images: product.images.map(img => ({
        url: product.image,
        isMain: true
      }))
    };
  } catch (error) {
    console.error(`Failed to fetch product by slug ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedVendors() {
  try {
    return await prisma.vendor.findMany({
      where: { isFeatured: true },
      take: 6,
    });
  } catch (error) {
    console.error("Failed to fetch featured vendors:", error);
    return [];
  }
}

export async function getActivePromotions() {
  try {
    return await prisma.promotion.findMany({
      where: { isActive: true },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to fetch active promotions:", error);
    return [];
  }
}

export async function getTrendingProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isTrending: true,
        status: ProductStatus.ACTIVE,
      },
      include: {
        vendor: {
          select: {
            name: true,
          }
        },
        images: true,
      },
      take: 8,
    });

    return products.map(p => ({
      id: p.id,
      title: p.name,
      price: p.priceHt,
      stock: p.stock,
      image: p.image,
      category: p.category,
      slug: p.slug,
      vendorId: p.vendorId,
      vendor: {
        name: p.vendor.name
      },
      images: p.images.map(img => ({
        url: img.url,
        isMain: img.isMain
      }))
    }));
  } catch (error) {
    console.error("Failed to fetch trending products:", error);
    return [];
  }
}