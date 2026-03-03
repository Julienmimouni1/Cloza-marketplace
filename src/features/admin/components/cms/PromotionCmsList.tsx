"use client";

import { useState } from "react";
import { deletePromotion, updatePromotion } from "@/features/admin/actions/cms";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2, Edit3, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { PromotionFormDialog } from "./PromotionFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string | null;
  expiresAt: Date | null;
  isActive: boolean;
}

export function PromotionCmsList({ promotions }: { promotions: Promotion[] }) {
  const t = useTranslations("Admin.cms.promotions");
  const tCommon = useTranslations("Common");
  
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      const result = await updatePromotion(id, { isActive: !currentStatus });
      if (result.success) {
        toast.success(t("form.successUpdate"));
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error(tCommon("error"));
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!promotionToDelete) return;
    
    setLoadingId(promotionToDelete);
    try {
      const result = await deletePromotion(promotionToDelete);
      if (result.success) {
        toast.success(t("form.successDelete"));
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error(tCommon("error"));
    } finally {
      setLoadingId(null);
      setPromotionToDelete(null);
    }
  };

  const openEdit = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setSelectedPromotion(null);
    setIsFormOpen(true);
  };

  return (
    <div className="relative w-full overflow-auto">
      <div className="p-6 bg-zinc-100 border-b-2 border-zinc-200 flex items-center justify-between">
        <p className="text-sm font-black uppercase text-zinc-900 tracking-widest">
          {promotions.length} {t("title")}
        </p>
        <Button 
          size="lg" 
          className="rounded-none bg-black hover:bg-zinc-800 h-12 px-6 font-black text-xs uppercase tracking-widest shadow-lg"
          onClick={openCreate}
        >
          <Plus className="mr-3 h-5 w-5" /> {t("addNew")}
        </Button>
      </div>
      <table className="w-full caption-bottom text-base">
        <thead>
          <tr className="border-b-2 border-zinc-100 bg-zinc-50">
            <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.title")}</th>
            <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.discount")}</th>
            <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.code")}</th>
            <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.expires")}</th>
            <th className="h-16 px-6 text-center align-middle font-black text-black uppercase text-xs tracking-widest">{t("columns.status")}</th>
            <th className="h-16 px-6 text-right align-middle font-black text-black uppercase text-xs tracking-widest">{tCommon("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {promotions.length === 0 ? (
            <tr>
              <td colSpan={6} className="h-40 text-center align-middle text-zinc-500 font-bold italic text-lg">Aucune promotion trouvée.</td>
            </tr>
          ) : (
            promotions.map((promo) => (
              <tr key={promo.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                <td className="p-6 align-middle">
                  <div className="font-black text-black text-lg mb-1">{promo.title}</div>
                  <div className="text-sm text-zinc-700 font-bold max-w-[300px] leading-relaxed italic">{promo.description}</div>
                </td>
                <td className="p-6 align-middle">
                   <span className="font-mono font-black text-2xl text-black bg-zinc-100 px-3 py-1 border-2 border-zinc-200">
                     {promo.discount}
                   </span>
                </td>
                <td className="p-6 align-middle font-mono text-base font-black text-zinc-900 bg-zinc-50/50">{promo.code || "---"}</td>
                <td className="p-6 align-middle text-zinc-800 font-black text-sm">
                  {promo.expiresAt ? format(new Date(promo.expiresAt), "dd MMM yyyy") : "ILLIMITÉ"}
                </td>
                <td className="p-6 align-middle text-center">
                   <div className="flex items-center justify-center">
                    <Switch 
                      checked={promo.isActive} 
                      onCheckedChange={() => handleToggle(promo.id, promo.isActive)}
                      disabled={loadingId !== null}
                      className="data-[state=checked]:bg-black scale-125"
                    />
                   </div>
                </td>
                <td className="p-6 align-middle text-right">
                   <div className="flex items-center justify-end gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 text-black border-2 border-zinc-200 hover:bg-zinc-100 shadow-sm"
                        onClick={() => openEdit(promo)}
                      >
                        <Edit3 className="h-6 w-6" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 text-red-600 border-2 border-red-100 hover:bg-red-50 hover:border-red-600 shadow-sm"
                        onClick={() => setPromotionToDelete(promo.id)}
                        disabled={loadingId === promo.id}
                      >
                        {loadingId === promo.id ? <Loader2 className="h-6 w-6 animate-spin" /> : <Trash2 className="h-6 w-6" />}
                      </Button>
                   </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <PromotionFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        promotion={selectedPromotion} 
      />

      <AlertDialog open={!!promotionToDelete} onOpenChange={(open) => !open && setPromotionToDelete(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-none bg-red-600 text-white hover:bg-red-700"
            >
              {tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}