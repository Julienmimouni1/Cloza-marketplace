"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createUser } from "../../actions/users";
import { toast } from "sonner";
import { Loader2, UserPlus, ShieldCheck, Store, UserCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional().or(z.literal("")),
  role: z.enum(["RETAILER", "VENDOR", "ADMIN"]),
  companyName: z.string().optional(),
});

export function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "RETAILER",
      companyName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const result = await createUser({
        ...values,
        role: values.role as any,
      });
      
      if (result.success) {
        toast.success("Utilisateur créé avec succès !");
        router.push("/admin/users");
        router.refresh();
      }
    } catch (error: any) {
      if (error.message === "USER_ALREADY_EXISTS") {
        toast.error("Cet email est déjà utilisé.");
      } else {
        toast.error("Une erreur est survenue lors de la création.");
      }
    } finally {
      setLoading(false);
    }
  }

  const selectedRole = form.watch("role");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-900 font-bold text-base uppercase tracking-wider">Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" className="h-14 rounded-none border-2 border-zinc-200 focus:ring-black font-bold text-lg" {...field} />
                </FormControl>
                <FormMessage className="font-bold text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-900 font-bold text-base uppercase tracking-wider">Email professionnel</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jean@entreprise.com" className="h-14 rounded-none border-2 border-zinc-200 focus:ring-black font-bold text-lg" {...field} />
                </FormControl>
                <FormMessage className="font-bold text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-900 font-bold text-base uppercase tracking-wider">Type de compte (Rôle)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 rounded-none border-2 border-zinc-200 font-bold text-lg">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none border-2 border-black p-2">
                    <SelectItem value="RETAILER" className="py-4 font-bold text-lg">
                      <div className="flex items-center gap-3">
                        <UserCircle className="h-5 w-5 text-zinc-500" />
                        <span>Retailer / Acheteur</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="VENDOR" className="py-4 font-bold text-lg">
                      <div className="flex items-center gap-3">
                        <Store className="h-5 w-5 text-amber-600" />
                        <span>Brand / Vendeur</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN" className="py-4 font-bold text-lg">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <span>Super Admin</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-900 font-bold text-base uppercase tracking-wider">Mot de passe temporaire</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Min. 8 caractères" className="h-14 rounded-none border-2 border-zinc-200 focus:ring-black font-bold text-lg" {...field} />
                </FormControl>
                <FormDescription className="text-zinc-500 font-medium">L'utilisateur pourra le changer à sa première connexion.</FormDescription>
                <FormMessage className="font-bold text-red-600" />
              </FormItem>
            )}
          />
        </div>

        {selectedRole !== "ADMIN" && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                <FormLabel className="text-zinc-900 font-bold text-base uppercase tracking-wider">Nom de la Compagnie / Boutique</FormLabel>
                <FormControl>
                  <Input placeholder="CLOZA Luxury Shop" className="h-14 rounded-none border-2 border-zinc-200 focus:ring-black font-bold text-lg" {...field} />
                </FormControl>
                <FormMessage className="font-bold text-red-600" />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col-reverse md:flex-row gap-4 pt-6 md:pt-10 border-t border-zinc-200">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-14 md:h-12 flex-1 rounded-none border-2 border-zinc-200 font-bold text-lg text-zinc-500 hover:text-black"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="h-16 md:h-12 flex-1 rounded-none bg-black hover:bg-zinc-800 text-white font-black text-xl md:text-lg uppercase tracking-wider shadow-2xl"
          >
            {loading ? (
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            ) : (
              <UserPlus className="mr-3 h-6 w-6" />
            )}
            Créer le compte
          </Button>
        </div>
      </form>
    </Form>
  );
}
