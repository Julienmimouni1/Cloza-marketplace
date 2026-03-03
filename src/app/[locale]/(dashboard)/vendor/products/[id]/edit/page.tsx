import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/features/vendor/components/ProductForm";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return <div>Profil vendeur introuvable.</div>;
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!product || product.vendorId !== vendor.id) {
    notFound();
  }

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-slate-500">
        <Link href="/vendor/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>
      <div className="bg-white p-6 rounded-lg border">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
