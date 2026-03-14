"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Store } from "lucide-react";
import { toast } from "sonner";
import { createIntegration } from "../actions";

import { ShopifyConnector } from "@/components/vendor/integrations/shopify-connector";

export function AddIntegrationDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"SHOPIFY" | "WOOCOMMERCE">("SHOPIFY");
  const [loading, setLoading] = useState(false);

  // Generic form state
  const [shopUrl, setShopUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Legacy/Manual Flow (WooCommerce)
      const result = await createIntegration({
        type,
        config: {
          shopUrl,
          apiKey,
          apiSecret: type === "WOOCOMMERCE" ? apiSecret : undefined,
        }
      });

      if (result.success) {
        toast.success("Intégration ajoutée avec succès");
        setOpen(false);
        setShopUrl("");
        setApiKey("");
        setApiSecret("");
      } else {
        toast.error(result.error?.message || "Erreur lors de l'ajout");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle connexion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connecter une boutique</DialogTitle>
          <DialogDescription>
            Synchronisez vos produits automatiquement depuis votre site e-commerce.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type de plateforme</Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHOPIFY">Shopify</SelectItem>
                <SelectItem value="WOOCOMMERCE">WooCommerce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "SHOPIFY" ? (
             <div className="pt-2">
               <ShopifyConnector />
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>URL de la boutique</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://ma-boutique.com"
                    className="pl-9 h-12"
                    value={shopUrl}
                    onChange={(e) => setShopUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Consumer Key</Label>
                <Input
                  placeholder="ck_..."
                  className="h-12"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Consumer Secret</Label>
                <Input
                  type="password"
                  placeholder="cs_..."
                  className="h-12"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  required
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit" disabled={loading} className="w-full h-12 sm:h-10">
                  {loading ? "Connexion..." : "Connecter WooCommerce"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
