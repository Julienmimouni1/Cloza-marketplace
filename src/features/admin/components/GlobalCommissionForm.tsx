"use client";

import { useState } from "react";
import { updateGlobalCommissionRate } from "@/features/admin/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface Props {
  currentRate: number; // in bps
}

export function GlobalCommissionForm({ currentRate }: Props) {
  // 1500 bps -> "15.00"
  const [rateStr, setRateStr] = useState((currentRate / 100).toFixed(2));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rateFloat = parseFloat(rateStr);
      if (isNaN(rateFloat) || rateFloat < 0 || rateFloat > 100) {
         toast.error("Please enter a valid percentage (0-100)");
         setIsLoading(false);
         return;
      }
      
      const rateBps = Math.round(rateFloat * 100);
      await updateGlobalCommissionRate(rateBps);
      toast.success("Global commission rate updated");
    } catch (error) {
      toast.error("Failed to update rate");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md py-4">
      <div className="space-y-3">
        <Label htmlFor="global-rate" className="text-lg font-black text-black">Taux de Commission Globale (%)</Label>
        <div className="relative">
          <Input 
            id="global-rate"
            type="number" 
            step="0.01" 
            min="0"
            max="100"
            value={rateStr} 
            onChange={(e) => setRateStr(e.target.value)}
            className="h-14 text-xl font-bold pr-10 border-2 border-zinc-200 focus:border-black transition-all"
          />
          <span className="absolute right-4 top-4 text-zinc-900 font-black text-xl">%</span>
        </div>
        <p className="text-base text-zinc-600 font-bold leading-relaxed">
          Ce taux sera appliqué à tous les vendeurs qui n'ont pas de surcharge spécifique configurée dans leur profil.
        </p>
      </div>
      <Button type="submit" disabled={isLoading} className="h-14 text-base font-black uppercase tracking-widest bg-black hover:bg-zinc-800 text-white transition-all shadow-md">
        {isLoading ? "Enregistrement..." : "Enregistrer la Configuration"}
      </Button>
    </form>
  );
}
