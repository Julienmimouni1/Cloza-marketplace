"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Building, Bell, CheckCircle2, AlertCircle, Info, MapPin, CreditCard, Camera, Calendar } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/features/identity/actions/update-profile";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

interface SettingsFormProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    phoneNumber: string | null;
    companyName: string | null;
    siret: string | null;
    vatNumber: string | null;
    address: string | null;
    city: string | null;
    zipCode: string | null;
    kybStatus: string;
    createdAt: Date;
    creditLimit: number;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const t = useTranslations("Dashboard");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(event.currentTarget);
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      toast.success("Profil mis à jour");
    } else {
      toast.error(result.error);
    }
    setIsUpdating(false);
  };

  const isKybApproved = user.kybStatus === "APPROVED";
  const isKybReview = user.kybStatus === "IN_REVIEW";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* LEFT COLUMN: Profile & Logistics */}
      <div className="lg:col-span-2 space-y-10">
        
        {/* PERSONAL PROFILE */}
        <Card className="border-zinc-300 shadow-md rounded-md overflow-hidden bg-white">
          <CardHeader className="bg-zinc-50 border-b border-zinc-200 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl font-serif text-zinc-900">
                  <User className="h-6 w-6 text-cloza-gold" /> Profil Utilisateur
                </CardTitle>
                <CardDescription className="text-zinc-600 text-base mt-1">Gérez vos informations personnelles et votre image de profil.</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-medium text-zinc-700 border-zinc-300 bg-zinc-100 py-1.5 px-3">
                 <Calendar className="h-4 w-4 mr-2" /> Membre depuis {new Date(user.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Avatar Section - More prominent */}
              <div className="flex items-center gap-8 pb-8 border-b border-zinc-100">
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200 group shadow-sm">
                  {user.image ? (
                    <Image src={user.image} alt={user.name || ""} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-zinc-400 bg-zinc-50">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-zinc-900">Photo de profil</p>
                  <p className="text-sm text-zinc-600">Format JPG ou PNG. Recommandé : 400x400px.</p>
                  <Button type="button" variant="outline" className="mt-2 border-zinc-300 text-zinc-900 font-bold hover:bg-zinc-50">
                    Changer la photo
                  </Button>
                </div>
              </div>

              {/* Form Inputs - High Contrast Labels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-bold text-zinc-900">Nom Complet</Label>
                  <Input id="name" name="name" defaultValue={user.name || ""} placeholder="Ex: Jean Dupont" className="h-12 text-base rounded-md border-zinc-300 focus:border-cloza-gold focus:ring-1 focus:ring-cloza-gold text-zinc-900" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-bold text-zinc-900">Email Professionnel</Label>
                  <div className="flex gap-3">
                    <Input id="email" defaultValue={user.email} disabled className="h-12 text-base bg-zinc-100 rounded-md border-zinc-200 text-zinc-600 font-medium opacity-100 cursor-not-allowed" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button type="button" variant="secondary" className="h-12 px-6 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold">Changer</Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 text-white p-3 text-sm">
                          <p>Nécessite une validation par email de sécurité.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phoneNumber" className="text-base font-bold text-zinc-900">Numéro de Téléphone</Label>
                  <Input id="phoneNumber" name="phoneNumber" defaultValue={user.phoneNumber || ""} placeholder="+33 6 12 34 56 78" className="h-12 text-base rounded-md border-zinc-300 focus:border-cloza-gold focus:ring-1 focus:ring-cloza-gold text-zinc-900" />
                </div>
              </div>

              {/* LOGISTICS - Enhanced Contrast */}
              <div className="space-y-8 pt-10 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-cloza-gold" />
                  <h3 className="text-xl font-serif font-bold text-zinc-900">Adresse de Livraison par Défaut</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-3 space-y-3">
                    <Label htmlFor="address" className="text-base font-bold text-zinc-900">Adresse postale</Label>
                    <Input id="address" name="address" defaultValue={user.address || ""} placeholder="Ex: 15 Boulevard Haussmann" className="h-12 text-base rounded-md border-zinc-300 focus:border-cloza-gold text-zinc-900" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-base font-bold text-zinc-900">Ville</Label>
                    <Input id="city" name="city" defaultValue={user.city || ""} placeholder="Paris" className="h-12 text-base rounded-md border-zinc-300 focus:border-cloza-gold text-zinc-900" />
                  </div>
                  <div className="space-y-3 md:col-span-1">
                    <Label htmlFor="zipCode" className="text-base font-bold text-zinc-900">Code Postal</Label>
                    <Input id="zipCode" name="zipCode" defaultValue={user.zipCode || ""} placeholder="75009" className="h-12 text-base rounded-md border-zinc-300 focus:border-cloza-gold text-zinc-900" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-zinc-200">
                <Button type="submit" disabled={isUpdating} className="h-14 bg-zinc-900 hover:bg-black text-white rounded-md px-12 text-base font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95">
                  {isUpdating ? "Enregistrement en cours..." : "Enregistrer mon profil"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* SECURITY */}
        <Card className="border-zinc-300 shadow-md rounded-md overflow-hidden bg-white">
          <CardHeader className="bg-zinc-50 border-b border-zinc-200 py-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-serif text-zinc-900">
              <Shield className="h-6 w-6 text-cloza-gold" /> Sécurité & Accès
            </CardTitle>
            <CardDescription className="text-zinc-600 text-base mt-1">Gérez la protection de votre compte professionnel.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8 space-y-6">
             <div className="flex justify-between items-center p-6 border-2 border-zinc-100 rounded-md bg-zinc-50/50 hover:border-zinc-200 transition-colors">
                <div>
                  <p className="text-lg font-bold text-zinc-900">Mot de Passe</p>
                  <p className="text-sm text-zinc-700 mt-1">Dernière modification : il y a 3 mois.</p>
                </div>
                <Button variant="outline" className="h-12 px-6 border-zinc-300 text-zinc-900 font-bold hover:bg-white shadow-sm">
                  Modifier le mot de passe
                </Button>
             </div>
             <div className="flex justify-between items-center p-6 border-2 border-zinc-100 rounded-md bg-zinc-50/50">
                <div>
                  <p className="text-lg font-bold text-zinc-900">Double Authentification (2FA)</p>
                  <p className="text-sm text-zinc-700 mt-1">Protégez votre compte avec un code de sécurité temporaire.</p>
                </div>
                <Badge className="bg-zinc-200 text-zinc-800 border-none font-bold text-xs py-2 px-4 uppercase tracking-tighter">
                   Disponible prochainement
                </Badge>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: Business & Financials - Very High Visibility */}
      <div className="space-y-10">
        
        {/* BUSINESS STATUS - High Impact */}
        <Card className="border-zinc-400 shadow-xl rounded-md overflow-hidden bg-white">
          <CardHeader className="bg-zinc-900 text-white py-6">
            <CardTitle className="flex items-center gap-3 text-xl font-serif">
              <Building className="h-6 w-6 text-cloza-gold" /> Votre Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-6 pb-8 space-y-8">
            <div className="flex flex-col items-center justify-center py-6 border-b-2 border-zinc-100 mb-6 bg-zinc-50 rounded-md">
              {isKybApproved ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
                    <CheckCircle2 className="h-10 w-10 text-green-700" />
                  </div>
                  <div className="space-y-1">
                    <Badge className="bg-green-700 text-white border-none font-black tracking-widest text-xs py-1.5 px-4 uppercase">PROFIL VÉRIFIÉ</Badge>
                    <p className="text-sm text-green-700 font-bold mt-2 italic underline underline-offset-4">Éligible au BNPL 60 jours</p>
                  </div>
                </div>
              ) : isKybReview ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                    <Info className="h-10 w-10 text-amber-700 animate-pulse" />
                  </div>
                  <div className="space-y-1 px-4">
                    <Badge className="bg-amber-600 text-white border-none font-black tracking-widest text-xs py-1.5 px-4 uppercase">EXAMEN EN COURS</Badge>
                    <p className="text-sm text-amber-800 font-bold mt-2">Nous vérifions vos documents sous 24h.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200">
                    <AlertCircle className="h-10 w-10 text-red-700" />
                  </div>
                  <div className="space-y-1 px-4">
                    <Badge className="bg-red-700 text-white border-none font-black tracking-widest text-xs py-1.5 px-4 uppercase">ACTION REQUISE</Badge>
                    <p className="text-sm text-red-800 font-bold mt-2">Veuillez envoyer vos justificatifs.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-4 border border-zinc-200 rounded-md">
                <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1 block">Raison Sociale</Label>
                <p className="text-lg font-bold text-zinc-900 leading-tight">{user.companyName || "Non renseigné"}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 border border-zinc-200 rounded-md">
                  <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1 block">Numéro SIRET</Label>
                  <p className="text-lg font-bold text-zinc-900 tabular-nums">{user.siret || "--"}</p>
                </div>
                <div className="bg-white p-4 border border-zinc-200 rounded-md">
                  <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1 block">Numéro de TVA Intracommunautaire</Label>
                  <p className="text-lg font-bold text-zinc-900 tabular-nums">{user.vatNumber || "--"}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t-2 border-zinc-100">
              <p className="text-sm text-zinc-700 font-medium mb-6 leading-relaxed">
                Les informations légales sont verrouillées après validation pour garantir la sécurité des transactions.
              </p>
              <Button variant="outline" className="w-full h-12 rounded-md border-zinc-400 text-zinc-900 font-bold hover:bg-zinc-50 shadow-sm transition-all active:bg-zinc-100">
                Demander une modification
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FINANCIAL TERMS - More Visible */}
        <Card className="border-zinc-300 shadow-md rounded-md overflow-hidden bg-zinc-50">
          <CardHeader className="bg-white border-b border-zinc-200 py-4">
            <CardTitle className="flex items-center gap-3 text-lg font-bold uppercase tracking-widest text-zinc-900">
              <CreditCard className="h-5 w-5 text-cloza-gold" /> Financement BNPL
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-6 pb-8 space-y-6">
             <div className="flex justify-between items-center bg-white p-4 rounded-md border border-zinc-200">
                <span className="text-base font-bold text-zinc-700">Limite de Crédit</span>
                <span className="text-2xl font-serif font-black text-zinc-900">€{(user.creditLimit / 100).toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center bg-cloza-gold/10 p-4 rounded-md border border-cloza-gold/20">
                <span className="text-base font-bold text-zinc-800">Délai de Paiement</span>
                <span className="text-lg font-black text-cloza-gold">60 JOURS</span>
             </div>
             <p className="text-xs text-zinc-600 font-medium mt-4 text-center px-4">
                Votre ligne de crédit est ajustée automatiquement selon votre historique de paiement.
             </p>
          </CardContent>
        </Card>

        {/* NOTIFICATIONS - Simplified and bolder */}
        <Card className="border-zinc-300 shadow-md rounded-md overflow-hidden bg-white">
          <CardHeader className="bg-zinc-50 border-b border-zinc-200 py-4">
            <CardTitle className="flex items-center gap-3 text-lg font-bold uppercase tracking-widest text-zinc-700">
              <Bell className="h-5 w-5" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-8 space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-md transition-colors">
              <span className="text-base font-bold text-zinc-800">Emails de Commandes</span>
              <div className="h-6 w-12 rounded-full bg-green-600 border-2 border-green-700 shadow-inner" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-md transition-colors">
              <span className="text-base font-bold text-zinc-800">Alertes Nouveaux Deals</span>
              <div className="h-6 w-12 rounded-full bg-zinc-300 border-2 border-zinc-400 shadow-inner" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
