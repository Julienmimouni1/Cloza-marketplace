"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVendorIdentity } from "@/features/admin/actions/vendors";
import { identitySchema } from "@/features/admin/schemas/vendor-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  vendorId: string;
  initialData: {
    name: string;
    companyName: string | null;
    siret: string | null;
    vatNumber: string | null;
  };
}

export function VendorIdentityForm({ vendorId, initialData }: Props) {
  const form = useForm<z.infer<typeof identitySchema>>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      name: initialData.name || "",
      companyName: initialData.companyName || "",
      siret: initialData.siret || "",
      vatNumber: initialData.vatNumber || "",
      phone: "", // to be added to model if needed
      website: "",
    },
  });

  async function onSubmit(data: z.infer<typeof identitySchema>) {
    try {
      await updateVendorIdentity(vendorId, data);
      toast.success("Identity updated");
    } catch (error) {
      toast.error("Failed to update identity");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Legal Company Name</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="siret"
            render={({ field }) => (
                <FormItem>
                <FormLabel>SIRET</FormLabel>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="+33..." />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Identity Changes"}
        </Button>
      </form>
    </Form>
  );
}
