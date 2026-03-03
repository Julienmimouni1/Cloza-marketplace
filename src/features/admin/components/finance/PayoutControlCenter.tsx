"use client";

import { useState, useEffect } from "react";
import { updatePayoutSettings } from "@/features/admin/actions/finance";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Unlock, CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  vendorId: string;
  initialSettings: any; // PayoutSettings | null
}

export function PayoutControlCenter({ vendorId, initialSettings }: Props) {
  const [schedule, setSchedule] = useState(initialSettings?.schedule || "MONTHLY");
  const [enabled, setEnabled] = useState(initialSettings?.payoutsEnabled ?? true);
  const [reason, setReason] = useState(initialSettings?.suspensionReason || "");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Admin.finance.payouts");

  const handleSave = async () => {
    if (!enabled && !reason) {
        return toast.error(t("reasonError"));
    }

    setLoading(true);
    try {
      await updatePayoutSettings(vendorId, {
        schedule,
        payoutsEnabled: enabled,
        suspensionReason: reason,
      });
      toast.success(t("successUpdate"));
    } catch (error) {
      toast.error(t("errorUpdate"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`rounded-none shadow-none border-zinc-200 h-full ${!enabled ? 'bg-red-50/20 border-red-100' : ''}`}>
      <CardHeader>
        <CardTitle className="font-serif text-lg flex items-center gap-2">
            {enabled ? <Unlock className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-red-600" />}
            {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
            <Label className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-zinc-500" /> 
                {t("scheduleLabel")}
            </Label>
            <Select value={schedule} onValueChange={setSchedule}>
                <SelectTrigger className="rounded-none">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="DAILY">{t("schedules.daily")}</SelectItem>
                    <SelectItem value="WEEKLY">{t("schedules.weekly")}</SelectItem>
                    <SelectItem value="MONTHLY">{t("schedules.monthly")}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="pt-4 border-t border-zinc-100 space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="payout-switch" className={!enabled ? "text-red-700 font-bold" : ""}>
                    {enabled ? t("activeLabel") : t("suspendedLabel")}
                </Label>
                <Switch 
                    id="payout-switch"
                    checked={enabled}
                    onCheckedChange={(c) => {
                        setEnabled(c);
                        if(c) setReason(""); // Clear reason if re-enabling
                    }}
                />
            </div>
            
            {!enabled && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <Textarea 
                        placeholder={t("reasonPlaceholder")}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="rounded-none border-red-200 focus-visible:ring-red-500 text-sm"
                    />
                </div>
            )}
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full rounded-none">
            {loading ? t("saving") : t("saveConfig")}
        </Button>
      </CardContent>
    </Card>
  );
}
