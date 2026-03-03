"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyInfoSchema, CompanyInfoInput } from "../schemas";
import { lookupSiret, updateCompanyInfo } from "../actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function CompanyInfoForm() {
  const [isPending, startTransition] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [lookupSuccess, setLookupSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CompanyInfoInput>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      siret: "",
      companyName: "",
      address: "",
      zipCode: "",
      city: "",
      vatNumber: "",
    },
    mode: "onChange",
  });

  const handleSiretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length === 14) {
      setError(null);
      setLookupSuccess(false);
      startTransition(async () => {
        const result = await lookupSiret(value);
        if (result.success) {
          if (result.data.status === "CLOSED") {
             setError("Attention : Cette entreprise est signalée comme fermée (cessation d'activité).");
             // We still populate but show warning
          }
          form.setValue("companyName", result.data.companyName);
          form.setValue("address", result.data.address);
          form.setValue("zipCode", result.data.zipCode);
          form.setValue("city", result.data.city);
          form.setValue("vatNumber", result.data.vatNumber);
          setLookupSuccess(true);
          toast.success("Informations trouvées !");
        } else {
          setError(result.error.message);
          toast.error(result.error.message);
        }
      });
    }
  };

  const onSubmit = (data: CompanyInfoInput) => {
    setError(null);
    startSaving(async () => {
        const result = await updateCompanyInfo(data);
        if (result.success) {
            toast.success(result.data.message);
        } else {
            setError(result.error.message);
            toast.error(result.error.message);
        }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Informations Entreprise</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Renseignez votre SIRET pour remplir automatiquement vos informations.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="siret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro SIRET</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="123 456 789 00012"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleSiretChange(e);
                      }}
                      maxLength={14}
                    />
                  </FormControl>
                  <div className="absolute right-3 top-2.5">
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    ) : lookupSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                </div>
                <FormMessage />
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dénomination Sociale</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'entreprise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="10 Rue de la Mode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Postal</FormLabel>
                  <FormControl>
                    <Input placeholder="75001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de TVA (Optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="FR..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSaving || isPending}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Enregistrer
          </Button>
        </form>
      </Form>
    </div>
  );
}
