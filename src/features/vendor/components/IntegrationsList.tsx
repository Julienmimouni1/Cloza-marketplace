"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, ExternalLink, ShoppingBag } from "lucide-react";
import { deleteIntegration, syncIntegration } from "../actions";
import { toast } from "sonner";
import { useState } from "react";

// Mock type matching Prisma model
interface Integration {
  id: string;
  type: "SHOPIFY" | "WOOCOMMERCE" | "GENERIC_CSV";
  config: any;
  lastSync: Date | null;
  status: string;
  createdAt: Date;
}

interface IntegrationsListProps {
  integrations: Integration[];
}

export function IntegrationsList({ integrations }: IntegrationsListProps) {
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette connexion ?")) return;
    
    const result = await deleteIntegration(id);
    if (result.success) {
      toast.success("Intégration supprimée");
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSync = async (id: string) => {
    setSyncing(id);
    try {
      // Simulate sync delay
      await new Promise(r => setTimeout(r, 2000));
      const result = await syncIntegration(id);
      if (result.success) {
        toast.success("Synchronisation lancée avec succès");
      } else {
        toast.error("Erreur lors de la synchronisation");
      }
    } finally {
      setSyncing(null);
    }
  };

  if (integrations.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune intégration</h3>
        <p className="mt-1 text-sm text-gray-500">Connectez votre boutique Shopify ou WooCommerce pour synchroniser vos produits.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                {integration.type === "SHOPIFY" ? (
                  <span className="text-[#95BF47]">Shopify</span>
                ) : integration.type === "WOOCOMMERCE" ? (
                  <span className="text-[#96588a]">WooCommerce</span>
                ) : (
                  integration.type
                )}
              </CardTitle>
              <Badge variant={integration.status === "ACTIVE" ? "default" : "destructive"}>
                {integration.status}
              </Badge>
            </div>
            <CardDescription className="truncate">
              {integration.config.shopUrl}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Ajouté le: {new Date(integration.createdAt).toLocaleDateString()}</p>
              <p>Dernière sync: {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : "Jamais"}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" size="sm" asChild>
              <a href={integration.config.shopUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir
              </a>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleSync(integration.id)}
                disabled={syncing === integration.id}
              >
                <RefreshCw className={`h-4 w-4 ${syncing === integration.id ? "animate-spin" : ""}`} />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => handleDelete(integration.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
