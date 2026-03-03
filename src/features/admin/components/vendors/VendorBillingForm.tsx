"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVendorBilling } from "@/features/admin/actions/vendors";
import { billingSchema } from "@/features/admin/schemas/vendor-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  vendorId: string;
  initialData?: any; // strict typing would be better but Json is loose
}

export function VendorBillingForm({ vendorId, initialData }: Props) {
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

  async function onSubmit(data: z.infer<typeof billingSchema>) {
    try {
      await updateVendorBilling(vendorId, data);
      toast.success("Billing info updated");
    } catch (error) {
      toast.error("Failed to update billing info");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="companyLegalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="iban"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IBAN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BIC</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Billing Info"}
        </Button>
      </form>
    </Form>
  );
}
