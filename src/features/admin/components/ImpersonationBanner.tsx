"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Ghost, LogOut, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function ImpersonationBanner() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const t = useTranslations("AdminComponents.impersonation");

  if (!session?.user?.isImpersonating) return null;

  const handleStopImpersonating = async () => {
    try {
      await update({
        isImpersonating: false,
        originalId: undefined,
        originalRole: undefined,
        targetId: session.user.originalId, // Back to admin
      });
      
      toast.success(t("successRevert"));
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      toast.error(t("errorRevert"));
    }
  };

  return (
    <div className="bg-cloza-gold text-black py-2 px-4 flex items-center justify-between sticky top-0 z-[100] shadow-md animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-black/10 p-1 rounded-full">
           <Ghost className="h-4 w-4" />
        </div>
        <div className="text-xs font-bold uppercase tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-3 w-3" />
          {t("active", { name: session.user.name || "N/A", email: session.user.email || "N/A" })}
        </div>
      </div>
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-7 rounded-none bg-black text-white hover:bg-zinc-800 text-[10px] font-bold uppercase"
        onClick={handleStopImpersonating}
      >
        <LogOut className="mr-2 h-3 w-3" />
        {t("exit")}
      </Button>
    </div>
  );
}
