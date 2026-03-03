"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { billingSchema } from "@/features/admin/schemas/vendor-schemas";
import { updateVendorBilling } from "@/features/admin/actions/vendors";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Props {
  vendorId: string;
  initialData: any; // typed as Json in prisma, but matches schema
}

export function VendorBillingForm({ vendorId, initialData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof billingSchema>>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      companyLegalName: initialData?.companyLegalName || "",
      vatNumber: initialData?.vatNumber || "",
      iban: initialData?.iban || "",
      bic: initialData?.bic || "",
      bankName: initialData?.bankName || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof billingSchema>) => {
    setIsLoading(true);
    try {
      await updateVendorBilling(vendorId, data);
      toast.success("Billing info updated");
    } catch (error) {
      toast.error("Failed to update billing info");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
          <Label htmlFor="companyLegalName">Billing Name</Label>
          <Input id="companyLegalName" {...form.register("companyLegalName")} />
          {form.formState.errors.companyLegalName && <p className="text-sm text-red-500">{form.formState.errors.companyLegalName.message}</p>}
      </div>
       <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input id="bankName" {...form.register("bankName")} />
          {form.formState.errors.bankName && <p className="text-sm text-red-500">{form.formState.errors.bankName.message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="iban">IBAN</Label>
          <Input id="iban" {...form.register("iban")} />
          {form.formState.errors.iban && <p className="text-sm text-red-500">{form.formState.errors.iban.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bic">BIC/SWIFT</Label>
          <Input id="bic" {...form.register("bic")} />
          {form.formState.errors.bic && <p className="text-sm text-red-500">{form.formState.errors.bic.message}</p>}
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Billing"}
      </Button>
    </form>
  );
}
