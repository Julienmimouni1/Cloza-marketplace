"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { shippingSchema } from "@/features/admin/schemas/vendor-schemas";
import { updateVendorShipping } from "@/features/admin/actions/vendors";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  vendorId: string;
  initialData: any; 
}

export function VendorShippingForm({ vendorId, initialData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema) as any,
    defaultValues: {
      defaultCarrier: initialData?.defaultCarrier || "DHL",
      returnAddress: initialData?.returnAddress || "",
      handlingTime: initialData?.handlingTime || 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof shippingSchema>) => {
    setIsLoading(true);
    try {
      await updateVendorShipping(vendorId, data);
      toast.success("Shipping info updated");
    } catch (error) {
      toast.error("Failed to update shipping info");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
          <Label htmlFor="defaultCarrier">Default Carrier</Label>
          <Select 
            onValueChange={(val) => form.setValue("defaultCarrier", val)} 
            defaultValue={form.getValues("defaultCarrier")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select carrier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DHL">DHL</SelectItem>
              <SelectItem value="UPS">UPS</SelectItem>
              <SelectItem value="FedEx">FedEx</SelectItem>
              <SelectItem value="La Poste">La Poste</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.defaultCarrier && <p className="text-sm text-red-500">{form.formState.errors.defaultCarrier.message}</p>}
      </div>
       <div className="space-y-2">
          <Label htmlFor="handlingTime">Handling Time (Days)</Label>
          <Input 
            id="handlingTime" 
            type="number" 
            min="0"
            {...form.register("handlingTime")} 
          />
          {form.formState.errors.handlingTime && <p className="text-sm text-red-500">{form.formState.errors.handlingTime.message}</p>}
      </div>
      <div className="space-y-2">
          <Label htmlFor="returnAddress">Return Address</Label>
          <Textarea id="returnAddress" {...form.register("returnAddress")} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Shipping"}
      </Button>
    </form>
  );
}
