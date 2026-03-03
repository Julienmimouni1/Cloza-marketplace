"use client";

import { useState } from "react";
import { updateVendorCommissionRate } from "@/features/admin/actions/vendors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

interface Props {
  vendorId: string;
  currentRate: number | null; // null means global
  globalRate: number; // for display context
}

export function VendorCommissionForm({ vendorId, currentRate, globalRate }: Props) {
  const [isCustom, setIsCustom] = useState(currentRate !== null);
  // Default to global rate if null, or current rate
  const [rateStr, setRateStr] = useState(
    currentRate !== null ? (currentRate / 100).toFixed(2) : (globalRate / 100).toFixed(2)
  );
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Admin.vendors.commissionForm");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let newRateBps: number | null = null;
      
      if (isCustom) {
        const rateFloat = parseFloat(rateStr);
        if (isNaN(rateFloat) || rateFloat < 0 || rateFloat > 100) {
           toast.error(t("validPercentageError"));
           return;
        }
        newRateBps = Math.round(rateFloat * 100);
      }

      await updateVendorCommissionRate(vendorId, newRateBps);
      toast.success(t("successUpdate"));
    } catch (error) {
      toast.error(t("errorUpdate"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
       <div className="flex items-center space-x-2">
        <Switch 
            id="custom-rate" 
            checked={isCustom} 
            onCheckedChange={(checked) => {
                setIsCustom(checked);
                if (!checked) {
                    setRateStr((globalRate / 100).toFixed(2));
                }
            }}
        />
        <Label htmlFor="custom-rate">{t("overrideGlobal")}</Label>
      </div>

      {isCustom && (
          <div className="space-y-2">
            <Label htmlFor="vendor-rate">{t("customRate")}</Label>
            <div className="relative max-w-sm">
              <Input 
                id="vendor-rate"
                type="number" 
                step="0.01" 
                min="0"
                max="100"
                value={rateStr} 
                onChange={(e) => setRateStr(e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">%</span>
            </div>
          </div>
      )}
      
      {!isCustom && (
          <p className="text-sm text-gray-500">
              {t("usingGlobal")} <strong>{(globalRate / 100).toFixed(2)}%</strong>
          </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? t("saving") : t("saveConfig")}
      </Button>
    </form>
  );
}
