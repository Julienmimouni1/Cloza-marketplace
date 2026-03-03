"use client";

import { useState } from "react";
import { toggleVendorStatus } from "@/features/admin/actions/vendors";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Props {
  vendorId: string;
  isFeatured: boolean;
}

export function VendorStatusSwitch({ vendorId, isFeatured }: Props) {
  const [active, setActive] = useState(isFeatured);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    try {
      await toggleVendorStatus(vendorId, checked);
      setActive(checked);
      toast.success(checked ? "Vendor activated" : "Vendor deactivated");
    } catch (error) {
      toast.error("Failed to change status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-none border-red-100 bg-red-50/30 shadow-none">
      <CardHeader>
        <CardTitle className="font-serif text-red-900 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription className="text-red-700/70">
          Deactivating a vendor will hide their products from the storefront and prevent new orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
            <Switch 
                id="vendor-active" 
                checked={active} 
                onCheckedChange={handleToggle}
                disabled={loading}
            />
            <Label htmlFor="vendor-active" className="font-bold">
                {active ? "Vendor is ACTIVE" : "Vendor is INACTIVE"}
            </Label>
        </div>
      </CardContent>
    </Card>
  );
}
