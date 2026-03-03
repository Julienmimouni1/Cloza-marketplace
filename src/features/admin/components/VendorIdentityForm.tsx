"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { identitySchema } from "@/features/admin/schemas/vendor-schemas";
import { updateVendorIdentity } from "@/features/admin/actions/vendors";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Props {
  vendorId: string;
  initialData: {
    name: string;
    companyName: string;
    siret?: string;
    vatNumber?: string;
    phone?: string;
    website?: string;
  };
}

export function VendorIdentityForm({ vendorId, initialData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof identitySchema>>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      name: initialData.name,
      companyName: initialData.companyName,
      siret: initialData.siret || "",
      vatNumber: initialData.vatNumber || "",
      phone: initialData.phone || "",
      website: initialData.website || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof identitySchema>) => {
    setIsLoading(true);
    try {
      await updateVendorIdentity(vendorId, data);
      toast.success("Identity updated successfully");
    } catch (error) {
      toast.error("Failed to update identity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Vendor Name (Public)</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Legal Name</Label>
          <Input id="companyName" {...form.register("companyName")} />
          {form.formState.errors.companyName && <p className="text-sm text-red-500">{form.formState.errors.companyName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="siret">SIRET</Label>
          <Input id="siret" {...form.register("siret")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vatNumber">VAT Number</Label>
          <Input id="vatNumber" {...form.register("vatNumber")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" {...form.register("website")} />
          {form.formState.errors.website && <p className="text-sm text-red-500">{form.formState.errors.website.message}</p>}
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Identity"}
      </Button>
    </form>
  );
}
