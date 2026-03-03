'use client';

import React from 'react';
import { useCartStore } from '@/store/use-cart-store';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function CartDrawer() {
  const t = useTranslations('HomePage');
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white border-l border-neutral-100">
        <SheetHeader className="p-6 border-b border-neutral-50 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-2xl">
              <ShoppingBag className="w-6 h-6" />
              <span>Mon Panier Pro</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">Votre panier est vide</h3>
                <p className="text-neutral-500 mt-1">Explorez nos collections exclusives pour commencer.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-full px-8"
              >
                Parcourir les Collections
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-24 h-32 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-xs text-neutral-400 font-medium uppercase">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-cloza-gold uppercase tracking-widest mb-1">{item.brand}</p>
                        <h4 className="text-sm font-medium text-neutral-900 leading-tight">{item.name}</h4>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">SKU: {item.sku}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-neutral-500 hover:text-black transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-neutral-500 hover:text-black transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-900">
                        {(item.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-medium">HT</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col p-6 space-y-4 border-t border-neutral-100 bg-neutral-50/30">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Sous-total HT</span>
                <span>{totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Livraison</span>
                <span className="italic">Calculée à l'étape suivante</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="text-lg font-bold text-neutral-900 leading-none">Total HT</p>
                  <p className="text-[10px] text-neutral-400 mt-1">HORS TAXES ET FRAIS DE PORT</p>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
            </div>

            <Button className="w-full h-14 rounded-full bg-black text-white hover:bg-neutral-800 transition-all flex items-center justify-between px-8 text-lg font-medium group">
              <span>Valider la commande</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <p className="text-center text-[10px] text-neutral-400 uppercase tracking-[0.2em]">
              Paiement à 60 jours disponible après vérification KYB
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
