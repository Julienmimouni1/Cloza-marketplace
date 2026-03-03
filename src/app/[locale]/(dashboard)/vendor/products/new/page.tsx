import { ProductForm } from "@/features/vendor/components/ProductForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NewProductPage() {
  const t = await getTranslations("Vendor.products");

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-slate-500">
        <Link href="/vendor/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToList")}
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">{t("addNew")}</h1>
      <div className="bg-white p-6 rounded-lg border">
        <ProductForm />
      </div>
    </div>
  );
}
