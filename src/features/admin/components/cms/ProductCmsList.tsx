"use client";

import { useState } from "react";
import { toggleProductTrending } from "@/features/admin/actions/cms";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Product {
  id: string;
  name: string;
  image: string;
  isTrending: boolean;
}

interface VendorWithProducts {
  id: string;
  name: string;
  products: Product[];
}

export function ProductCmsList({ vendors }: { vendors: VendorWithProducts[] }) {
  const t = useTranslations("Admin.cms.products");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (productId: string, currentStatus: boolean) => {
    setLoadingId(productId);
    try {
      const result = await toggleProductTrending(productId, !currentStatus);
      if (result.success) {
        toast.success(t("successToggle"));
      } else {
        toast.error(result.error.message || t("errorToggle"));
      }
    } catch (error) {
      toast.error(t("errorToggle"));
    } finally {
      setLoadingId(null);
    }
  };

  const totalTrending = vendors.reduce(
    (acc, vendor) => acc + vendor.products.filter((p) => p.isTrending).length,
    0
  );

  return (
    <div className="w-full">
      <div className="p-4 md:p-6 bg-zinc-100 border-b-2 border-zinc-200 flex items-center justify-between">
        <p className="text-xs md:text-sm font-black uppercase text-zinc-900 tracking-widest">
          {t("selected", { count: totalTrending })}
        </p>
      </div>

      <Accordion type="multiple" className="w-full divide-y-2 divide-zinc-100">
        {vendors.map((vendor) => {
          const trendingCount = vendor.products.filter(p => p.isTrending).length;
          
          return (
            <AccordionItem key={vendor.id} value={vendor.id} className="border-b border-zinc-200 px-4 md:px-6 hover:bg-zinc-50 transition-colors">
              <AccordionTrigger className="hover:no-underline py-4 md:py-6">
                <div className="flex items-center gap-3 md:gap-4 text-left">
                  <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-none bg-zinc-200 border-2 border-zinc-300 flex items-center justify-center text-black">
                    <Package className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-lg md:text-xl text-black truncate">{vendor.name}</div>
                    <div className="text-xs md:text-sm text-zinc-600 font-bold mt-0.5">
                      {vendor.products.length} produits • <span className="text-black font-black">{trendingCount} tendance(s)</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 md:px-2">
                <div className="space-y-1 pb-4 md:pb-6">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <table className="w-full text-base">
                      <thead>
                        <tr className="text-black text-xs uppercase font-black tracking-widest border-b-2 border-zinc-100 bg-zinc-50">
                          <th className="text-left py-4 px-4">{t("columns.product")}</th>
                          <th className="text-right py-4 px-4">{t("columns.trending")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendor.products.map((product) => (
                          <tr key={product.id} className="group hover:bg-white transition-colors border-b border-zinc-100 last:border-0">
                            <td className="py-5 px-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={product.image}
                                  alt=""
                                  className="h-14 w-14 object-cover border-2 border-zinc-200 rounded-none shadow-sm"
                                />
                                <span className="font-bold text-black text-lg">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-5 px-4 text-right">
                              <div className="flex items-center justify-end gap-4">
                                {loadingId === product.id && (
                                  <Loader2 className="h-6 w-6 animate-spin text-black" />
                                )}
                                <Switch
                                  checked={product.isTrending}
                                  onCheckedChange={() =>
                                    handleToggle(product.id, product.isTrending)
                                  }
                                  disabled={loadingId !== null}
                                  className="data-[state=checked]:bg-black scale-125"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Grid View */}
                  <div className="md:hidden divide-y divide-zinc-100 bg-white">
                    {vendor.products.map((product) => (
                      <div key={product.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.image}
                            alt=""
                            className="h-12 w-12 shrink-0 object-cover border-2 border-zinc-200 shadow-sm"
                          />
                          <span className="font-black text-black text-sm truncate leading-tight">{product.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {loadingId === product.id && (
                            <Loader2 className="h-5 w-5 animate-spin text-black" />
                          )}
                          <Switch
                            checked={product.isTrending}
                            onCheckedChange={() =>
                              handleToggle(product.id, product.isTrending)
                            }
                            disabled={loadingId !== null}
                            className="data-[state=checked]:bg-black scale-110"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {vendor.products.length === 0 && (
                    <div className="py-8 md:py-12 text-center text-zinc-500 font-bold text-sm md:text-base italic">
                      Aucun produit pour ce vendeur
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}