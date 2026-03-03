"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVendorShipping } from "@/features/admin/actions/vendors";
import { shippingSchema } from "@/features/admin/schemas/vendor-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  vendorId: string;
  initialData?: any;
}

export function VendorShippingForm({ vendorId, initialData }: Props) {
  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema) as any,
    defaultValues: {
      defaultCarrier: initialData?.defaultCarrier || "",
      returnAddress: initialData?.returnAddress || "",
      handlingTime: initialData?.handlingTime || 1,
    },
  });

  async function onSubmit(data: z.infer<typeof shippingSchema>) {
    try {
      await updateVendorShipping(vendorId, data);
      toast.success("Shipping info updated");
    } catch (error) {
      toast.error("Failed to update shipping info");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="defaultCarrier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Carrier</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. DHL, UPS" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="handlingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handling Time (Days)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="returnAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Shipping Info"}
        </Button>
      </form>
    </Form>
  );
}
