"use client";

import { useState } from "react";
import { toggleVendorFeatured } from "@/features/admin/actions/cms";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Vendor {
  id: string;
  name: string;
  slug: string;
  isFeatured: boolean;
  logoUrl: string | null;
}

export function VendorCmsList({ vendors }: { vendors: Vendor[] }) {
  const t = useTranslations("Admin.cms.vendors");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (vendorId: string, currentStatus: boolean) => {
    setLoadingId(vendorId);
    try {
      const result = await toggleVendorFeatured(vendorId, !currentStatus);
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

  const featuredCount = vendors.filter(v => v.isFeatured).length;

  return (
    <div className="relative w-full overflow-auto">
      <div className="p-6 bg-zinc-100 border-b-2 border-zinc-200 flex items-center justify-between">
        <p className="text-sm font-black uppercase text-zinc-900 tracking-widest">
          {t("selected", { count: featuredCount })}
        </p>
        {featuredCount > 8 && (
          <p className="text-xs font-black text-red-600 uppercase bg-red-50 px-3 py-1 border border-red-200">{t("warningLimit")}</p>
        )}
      </div>
      <table className="w-full caption-bottom text-base">
        <thead>
          <tr className="border-b-2 border-zinc-100 bg-zinc-50">
            <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.brand")}</th>
            <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.slug")}</th>
            <th className="h-16 px-6 text-right align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.featured")}</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
              <td className="p-6 align-middle">
                <div className="flex items-center gap-4">
                   {vendor.logoUrl ? (
                     <img src={vendor.logoUrl} alt="" className="h-12 w-12 object-contain border-2 border-zinc-200 bg-white p-1 shadow-sm" />
                   ) : (
                     <div className="h-12 w-12 bg-zinc-200 border-2 border-zinc-300 flex items-center justify-center text-xs font-black text-zinc-600">IMG</div>
                   )}
                   <div className="font-black text-black text-lg">{vendor.name}</div>
                </div>
              </td>
              <td className="p-6 align-middle font-mono text-sm font-bold text-zinc-700">{vendor.slug}</td>
              <td className="p-6 align-middle text-right">
                 <div className="flex items-center justify-end gap-4">
                    {loadingId === vendor.id && <Loader2 className="h-6 w-6 animate-spin text-black" />}
                    <Switch 
                      checked={vendor.isFeatured} 
                      onCheckedChange={() => handleToggle(vendor.id, vendor.isFeatured)}
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
  );
}