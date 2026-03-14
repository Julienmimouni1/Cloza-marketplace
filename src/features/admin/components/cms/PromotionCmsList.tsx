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
    <div className="relative w-full">
      <div className="p-4 md:p-6 bg-zinc-100 border-b-2 border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-xs md:text-sm font-black uppercase text-zinc-900 tracking-widest order-2 md:order-1 text-center md:text-left">
          {promotions.length} {t("title")}
        </p>
        <Button 
          size="lg" 
          className="rounded-none bg-black hover:bg-zinc-800 h-14 md:h-12 w-full md:w-auto px-6 font-black text-xs uppercase tracking-widest shadow-lg order-1 md:order-2"
          onClick={openCreate}
        >
          <Plus className="mr-3 h-6 w-6 md:h-5 md:w-5" /> {t("addNew")}
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-auto">
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-zinc-100">
        {promotions.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-bold italic bg-zinc-50">Aucune promotion trouvée.</div>
        ) : (
          promotions.map((promo) => (
            <div key={promo.id} className="p-5 space-y-4 bg-white hover:bg-zinc-50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h3 className="font-black text-black text-lg leading-tight truncate">{promo.title}</h3>
                  <p className="text-xs text-zinc-600 font-bold mt-1 line-clamp-2 italic">{promo.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {loadingId === promo.id && <Loader2 className="h-5 w-5 animate-spin text-black" />}
                  <Switch 
                    checked={promo.isActive} 
                    onCheckedChange={() => handleToggle(promo.id, promo.isActive)}
                    disabled={loadingId !== null}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-100 p-3 border-2 border-zinc-200">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("columns.discount")}</span>
                  <span className="font-mono font-black text-2xl text-black">{promo.discount}</span>
                </div>
                <div className="h-10 w-0.5 bg-zinc-300 mx-2" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("columns.code")}</span>
                  <span className="font-mono font-black text-base text-zinc-900 truncate">{promo.code || "---"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-2">
                <div className="text-zinc-500 uppercase tracking-widest">{t("columns.expires")}</div>
                <div className="text-black font-black uppercase">
                  {promo.expiresAt ? format(new Date(promo.expiresAt), "dd MMM yyyy") : "ILLIMITÉ"}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="h-14 flex-1 font-black text-xs uppercase tracking-widest border-2 border-zinc-200 hover:bg-zinc-100 shadow-sm"
                  onClick={() => openEdit(promo)}
                >
                  <Edit3 className="mr-2 h-5 w-5" /> {tCommon("edit")}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 flex-1 font-black text-xs uppercase tracking-widest text-red-600 border-2 border-red-100 hover:bg-red-50 hover:border-red-600 shadow-sm"
                  onClick={() => setPromotionToDelete(promo.id)}
                  disabled={loadingId === promo.id}
                >
                  <Trash2 className="mr-2 h-5 w-5" /> {tCommon("delete")}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

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