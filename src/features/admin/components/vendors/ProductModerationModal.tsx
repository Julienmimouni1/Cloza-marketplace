'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  ExternalLink, 
  Star, 
  EyeOff, 
  Eye,
  Loader2
} from "lucide-react";
import { ProductStatus } from "@/generated/client";
import { updateProductStatus, toggleProductTrending, deleteProductAdmin } from "@/features/admin/actions/products";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  product: {
    id: string;
    name: string;
    image: string;
    sku: string;
    status: ProductStatus;
    isTrending: boolean;
    priceHt: number;
  };
}

export function ProductModerationModal({ product }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ProductStatus>(product.status);
  const [isTrending, setIsTrending] = useState(product.isTrending);

  const handleStatusChange = async (checked: boolean) => {
    const newStatus = checked ? ProductStatus.ACTIVE : ProductStatus.ARCHIVED;
    setIsPending(true);
    try {
      await updateProductStatus(product.id, newStatus);
      setCurrentStatus(newStatus);
      toast.success(`Statut mis à jour : ${newStatus}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsPending(false);
    }
  };

  const handleTrendingToggle = async (checked: boolean) => {
    setIsPending(true);
    try {
      await toggleProductTrending(product.id, checked);
      setIsTrending(checked);
      toast.success(checked ? "Produit mis en avant" : "Mise en avant retirée");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await deleteProductAdmin(product.id);
      toast.success("Produit supprimé définitivement");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-none">
          <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Modérer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-none border-zinc-200 font-sans">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Modération du Produit</DialogTitle>
          <DialogDescription>
            Gérez la visibilité et le statut de ce produit sur la marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 py-4 border-y border-zinc-100 my-2">
          <img src={product.image} alt={product.name} className="h-24 w-24 object-cover border border-zinc-200 bg-zinc-50" />
          <div className="flex flex-col justify-center">
            <h3 className="font-bold text-zinc-900">{product.name}</h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">SKU: {product.sku}</p>
            <p className="text-sm font-bold mt-1">{(product.priceHt / 100).toFixed(2)}€ HT</p>
            <div className="mt-2">
              <Badge variant={currentStatus === "ACTIVE" ? "default" : "secondary"} className="rounded-none text-[10px] uppercase tracking-wider">
                {currentStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                {currentStatus === "ACTIVE" ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-zinc-400" />}
                Visibilité sur le catalogue
              </Label>
              <p className="text-sm text-zinc-500">
                {currentStatus === "ACTIVE" ? "Le produit est visible par les acheteurs." : "Le produit est masqué (archivé)."}
              </p>
            </div>
            <Switch 
              checked={currentStatus === "ACTIVE"} 
              onCheckedChange={handleStatusChange}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Star className={`h-4 w-4 ${isTrending ? "text-amber-500 fill-amber-500" : "text-zinc-400"}`} />
                Mettre en avant (Trending)
              </Label>
              <p className="text-sm text-zinc-500">
                Affiche ce produit dans la section "Produits Tendances" de l'accueil.
              </p>
            </div>
            <Switch 
              checked={isTrending} 
              onCheckedChange={handleTrendingToggle}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="bg-red-50 p-4 border border-red-100 space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" /> Zone de danger
          </div>
          <p className="text-xs text-red-600">
            La suppression est irréversible. Toutes les données associées (images, statistiques) seront effacées du serveur.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="rounded-none w-full bg-red-600 hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer définitivement le produit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-none border-zinc-200">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif">Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le produit <strong>{product.name}</strong> de notre base de données.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-none">Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="rounded-none bg-red-600 hover:bg-red-700">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Oui, supprimer le produit"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <DialogFooter className="border-t border-zinc-100 pt-4 mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-none">
            Fermer
          </Button>
          <Button asChild variant="default" className="rounded-none bg-black">
             <a href={`/catalog/product/${product.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" /> Voir la fiche publique
             </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
