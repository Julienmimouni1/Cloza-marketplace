"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Store, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { connectShopifyManually } from "@/features/vendor/integrations/shopify/actions";

export function ShopifyConnector() {
  const [shopUrl, setShopUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; error?: string }>({});

  const handleOAuthConnect = () => {
    if (!shopUrl) return;
    let shopName = shopUrl.trim();
    shopName = shopName.replace(/^https?:\/\//, "");
    shopName = shopName.replace(/\.myshopify\.com.*$/, "");
    shopName = shopName.replace(/\/$/, "");
    const fullShopDomain = `${shopName}.myshopify.com`;
    window.location.href = `/api/integrations/shopify/auth?shop=${fullShopDomain}`;
  };

  const handleManualConnect = async (formData: FormData) => {
    startTransition(async () => {
      const result = await connectShopifyManually({}, formData);
      setState(result);
    });
  };

  if (state.success) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900">Connexion Réussie !</h3>
          <p className="text-green-700">Votre boutique Shopify a été connectée. L&apos;importation de vos produits a commencé en arrière-plan.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Voir mes produits
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Store className="h-5 w-5 text-cloza-gold" />
          Connecter ma boutique Shopify
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Synchronisez vos produits et vos stocks automatiquement avec Cloza.
        </p>
      </div>
      
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="flex flex-col sm:flex-row h-auto w-full bg-zinc-100 p-1 rounded-md mb-6 gap-1">
          <TabsTrigger value="manual" className="flex-1 py-3 text-xs sm:text-sm">Connexion Manuelle (Recommandé)</TabsTrigger>
          <TabsTrigger value="oauth" className="flex-1 py-3 text-xs sm:text-sm">Connexion Automatique</TabsTrigger>
        </TabsList>

        <TabsContent value="oauth" className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm mb-4 border border-blue-100">
            La connexion automatique vous redirigera vers Shopify pour approuver l&apos;application.
            Si vous rencontrez des erreurs de redirection, utilisez l&apos;onglet <strong>Connexion Manuelle</strong>.
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de la boutique</label>
            <Input
              placeholder="ma-boutique"
              className="h-12"
              value={shopUrl}
              onChange={(e) => setShopUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOAuthConnect()}
            />
            <p className="text-xs text-muted-foreground">Ex: &quot;ma-marque&quot; pour ma-marque.myshopify.com</p>
          </div>
          <Button onClick={handleOAuthConnect} disabled={!shopUrl} className="w-full h-12 bg-zinc-900 text-white hover:bg-zinc-800">
            Connecter via Shopify
          </Button>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6 animate-in fade-in duration-300">
          <form action={handleManualConnect} className="space-y-4">
            {state.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">URL de la boutique (.myshopify.com)</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 bg-zinc-50 px-3 h-12 rounded-md border border-zinc-200 text-muted-foreground shrink-0">
                  <span className="text-sm">https://</span>
                </div>
                <Input 
                  name="shopUrl" 
                  placeholder="ma-boutique.myshopify.com" 
                  className="h-12 flex-1"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jeton d&apos;accès API (Access Token)</label>
              <Input 
                name="accessToken" 
                type="password" 
                placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                className="h-12"
                required 
              />
              <p className="text-xs text-muted-foreground">Commence par <code>shpat_</code></p>
            </div>

            <Button type="submit" className="w-full h-12 bg-cloza-gold text-zinc-900 font-bold" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Valider la connexion
                </>
              )}
            </Button>
          </form>

          <Accordion type="single" collapsible className="w-full border rounded-md px-4 bg-white shadow-sm">
            <AccordionItem value="guide" className="border-b-0">
              <AccordionTrigger className="text-sm font-medium text-primary hover:no-underline">
                ❓ Comment obtenir mon Jeton d&apos;accès ?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground space-y-3 pt-2">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Connectez-vous à votre admin Shopify.</li>
                  <li>Allez dans <strong>Paramètres</strong> &rarr; <strong>Applications et canaux de vente</strong>.</li>
                  <li>Cliquez sur <strong>Développer des applications</strong>.</li>
                  <li>Cliquez sur <strong>Créer une application</strong>, nommez-la &quot;Cloza&quot;.</li>
                  <li>Configurez les accès (scopes) :
                    <ul className="list-disc pl-5 mt-1 font-mono text-[10px] text-foreground bg-zinc-50 p-2 rounded">
                      <li>read_products, read_inventory</li>
                      <li>write_inventory (optionnel)</li>
                    </ul>
                  </li>
                  <li>Cliquez sur <strong>Installer l&apos;application</strong> et copiez le jeton commençant par <code>shpat_</code>.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}