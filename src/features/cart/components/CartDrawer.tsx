"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "../hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { Button } from "@/components/ui/button";
import { formatPrice } from "../utils";
import { ShoppingBag, ChevronRight } from "lucide-react";

import { useRouter } from "../../../navigation";

export function CartDrawer() {
  const { items, isOpen, closeDrawer, totalItems, pricing } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="w-full sm:max-w-[700px] flex flex-col p-0 bg-white border-l border-neutral-100">
        <SheetHeader className="p-8 border-b border-neutral-50 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-2xl">
              <ShoppingBag className="w-6 h-6" />
              <span>Mon Panier Pro ({isMounted ? totalItems() : 0})</span>
            </SheetTitle>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">Votre panier est vide</h3>
                <p className="text-neutral-500 mt-1">Explorez nos collections exclusives pour commencer.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={closeDrawer}
                className="mt-4 rounded-full px-8"
              >
                Parcourir les Collections
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
                {items.map((item) => <CartItemRow key={item.id} item={item} />)}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex flex-col sm:flex-col p-8 space-y-6 border-t border-neutral-100 bg-neutral-50 z-10 relative">
            <div className="w-full space-y-3">
              <div className="flex justify-between text-base text-neutral-600">
                <span>Sous-total HT</span>
                <span className="font-medium">{formatPrice(pricing.totalHT + pricing.totalDiscount)}</span>
              </div>
              {pricing.totalDiscount > 0 && (
                <div className="flex justify-between text-base text-[#C5A028] font-semibold">
                  <span>Remise Volume</span>
                  <span>-{formatPrice(pricing.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-neutral-500 pb-2">
                <span>Livraison</span>
                <span className="italic">Calculée à l'étape suivante</span>
              </div>
              
              <div className="pt-4 border-t border-neutral-200 flex justify-between items-end">
                <div>
                  <p className="text-xl font-bold text-neutral-900 leading-none">Total HT</p>
                  <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-widest">Hors taxes et frais de port</p>
                </div>
                <p className="text-3xl font-bold text-neutral-900">
                  {formatPrice(pricing.totalHT)}
                </p>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              className="w-full h-16 rounded-full bg-black text-white hover:bg-neutral-800 transition-all flex items-center justify-between px-10 text-xl font-medium group mt-4 shadow-xl"
            >
              <span>Valider la commande</span>
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <p className="text-center text-[10px] text-neutral-400 uppercase tracking-[0.2em] mt-2">
              Paiement à 60 jours disponible après vérification KYB
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
