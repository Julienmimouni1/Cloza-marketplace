"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "../../../navigation";
import { useCart } from "@/features/cart/hooks/useCart";
import { formatPrice } from "@/features/cart/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  Lock,
  Truck,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, pricing, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wire">("card");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif">Votre panier est vide</h1>
          <p className="text-neutral-500">Ajoutez des produits pour accéder au paiement.</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    // Simulation of payment process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Commande validée avec succès ! (Simulation)");
    setLoading(false);
    // In a real app, we would redirect to a success page or clear cart
    // clearCart();
    // router.push("/success");
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header Minimaliste */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          <div className="font-serif text-xl">Paiement Sécurisé</div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Delivery Address Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-medium">Adresse de livraison</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input placeholder="Sophie" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input placeholder="Martin" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Société</Label>
                  <Input placeholder="Boutique Élégance" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Adresse</Label>
                  <Input placeholder="123 Rue de la Mode" />
                </div>
                <div className="space-y-2">
                  <Label>Code Postal</Label>
                  <Input placeholder="75001" />
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input placeholder="Paris" />
                </div>
              </div>
            </section>

            {/* Delivery Method Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 space-y-4">
               <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                  <Truck className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-medium">Mode de livraison</h2>
              </div>
              
              <div className="p-4 rounded-lg border border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-[5px] border-black bg-white" />
                    <div>
                        <p className="font-medium text-sm">Livraison Standard Pro</p>
                        <p className="text-xs text-neutral-500">3-5 jours ouvrés</p>
                    </div>
                </div>
                <p className="font-medium text-sm">Gratuit</p>
              </div>
            </section>

            {/* Payment Method Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 space-y-4">
               <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-medium">Paiement</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Card Option */}
                <div 
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 hover:border-neutral-300",
                    paymentMethod === "card" ? "border-black bg-neutral-50" : "border-neutral-100 bg-white"
                  )}
                >
                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mt-1", paymentMethod === "card" ? "border-black" : "border-neutral-300")}>
                        {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Carte Bancaire</span>
                            <div className="flex gap-2">
                                <CreditCard className="w-5 h-5 text-neutral-400" />
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">Visa, Mastercard, Amex. Paiement sécurisé par Stripe.</p>
                    </div>
                </div>

                {/* Wire / BNPL Option */}
                <div 
                  onClick={() => setPaymentMethod("wire")}
                  className={cn(
                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 hover:border-neutral-300",
                    paymentMethod === "wire" ? "border-black bg-neutral-50" : "border-neutral-100 bg-white"
                  )}
                >
                   <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mt-1", paymentMethod === "wire" ? "border-black" : "border-neutral-300")}>
                        {paymentMethod === "wire" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Virement Bancaire / 60 Jours</span>
                            <Building2 className="w-5 h-5 text-neutral-400" />
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">Paiement à 60 jours via notre partenaire financier (sous réserve d'éligibilité KYB).</p>
                    </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 sticky top-24">
              <h2 className="text-lg font-medium mb-6">Récapitulatif ({totalItems()})</h2>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-neutral-200">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-neutral-100 rounded-md overflow-hidden relative shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-400">IMG</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title || `Produit ${item.productId}`}</p>
                      <p className="text-xs text-neutral-500">Ref: {item.variantId}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-neutral-500">x{item.quantity}</p>
                        <p className="text-sm font-medium">{formatPrice(item.priceHT * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Sous-total HT</span>
                  <span>{formatPrice(pricing.totalHT + pricing.totalDiscount)}</span>
                </div>
                {pricing.totalDiscount > 0 && (
                   <div className="flex justify-between text-[#C5A028]">
                    <span>Remise Volume</span>
                    <span>-{formatPrice(pricing.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Livraison</span>
                  <span>Gratuit</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>TVA (20%)</span>
                  <span>{formatPrice(pricing.totalHT * 0.2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-lg">Total TTC</span>
                <span className="font-bold text-2xl">{formatPrice(pricing.totalHT * 1.2)}</span>
              </div>

              <Button 
                className="w-full h-12 text-lg rounded-full bg-black hover:bg-neutral-800"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Traitement..." : `Payer ${formatPrice(pricing.totalHT * 1.2)}`}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Transactions cryptées et sécurisées</span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
