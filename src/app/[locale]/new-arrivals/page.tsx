import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { ProductStatus } from "@/generated/client";

export const dynamic = 'force-dynamic';

export default async function NewArrivalsPage() {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE },
    include: { vendor: true, images: true },
    orderBy: { id: 'desc' },
    take: 12,
  });

  const mappedProducts = products.map((p) => ({
    id: p.id,
    title: p.name,
    price: p.priceHt,
    stock: p.stock,
    image: p.image,
    category: p.category,
    slug: p.slug,
    vendorId: p.vendorId,
    vendor: { name: p.vendor.name },
    images: p.images.map(img => ({
      url: img.url,
      isMain: img.isMain
    }))
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-foreground">New Arrivals</h1>
        <p className="text-muted-foreground mt-2">Check out the latest additions.</p>
      </div>
      <ProductGrid products={mappedProducts} />
    </div>
  );
}
