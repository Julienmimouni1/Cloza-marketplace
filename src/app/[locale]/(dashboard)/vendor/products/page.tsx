import { ProductPagination } from "@/features/vendor/components/ProductPagination";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductStatus } from "@/generated/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { ProductFilters } from "@/features/vendor/components/ProductFilters";
import { ProductImportModal } from "@/features/vendor/components/ProductImportModal";
import { ProductTable } from "@/features/vendor/components/ProductTable";
import { getTranslations } from "next-intl/server";

export default async function VendorProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session?.user?.vendorId) redirect("/register?role=VENDOR");

  const vendorId = session.user.vendorId;

  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? (params.status as ProductStatus) : undefined;
  const page = Number(typeof params.page === "string" ? params.page : "1") || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        vendorId: vendorId,
        name: { contains: q, mode: "insensitive" },
        status: status,
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count({
      where: {
        vendorId: vendorId,
        name: { contains: q, mode: "insensitive" },
        status: status,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  
  const t = await getTranslations("Vendor.products");

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-slate-500">
          <Link href="/vendor">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToDashboard")}
          </Link>
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <div className="flex gap-2">
            <ProductImportModal />
            <Button asChild>
              <Link href="/vendor/products/new">
                <Plus className="mr-2 h-4 w-4" />
                {t("addNew")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <ProductFilters />

      <ProductTable 
        products={products} 
        totalCount={totalCount} 
        filters={{ q, status }} 
      />
      
      <ProductPagination totalPages={totalPages} />
    </div>
  );
}