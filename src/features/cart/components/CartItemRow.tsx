"use client";

import { useState, useEffect } from "react";
import { CartItem } from "../types";
import { useCart } from "../hooks/useCart";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ImageOff } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "../utils";
import { cn } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [item.image]);

  return (
    <div className="flex gap-4 group py-4 border-b border-neutral-100 last:border-0">
      <div className="relative w-20 h-24 min-w-[5rem] rounded-lg bg-neutral-50 overflow-hidden flex-shrink-0 border border-neutral-100">
        {item.image && !imageError ? (
          <Image
            src={item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/${item.image}`}
            alt={item.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400">
            <ImageOff className="w-5 h-5 mb-1" />
            <span className="text-[9px] uppercase font-medium">No Img</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
        <div>
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <p className="text-[10px] font-bold text-[#C5A028] uppercase tracking-widest mb-0.5">
                {item.vendorId ? item.vendorId.split('-')[0] : "Premium Brand"}
              </p>
              <h4 className="text-sm font-medium text-neutral-900 leading-tight truncate">
                {item.title}
              </h4>
              {item.quantity >= item.stock && (
                <p className="text-[9px] text-red-500 font-bold uppercase mt-1 tracking-tight">
                  Stock Maximum Atteint
                </p>
              )}
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="text-neutral-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center border border-neutral-200 rounded-full px-1.5 py-0.5 bg-white">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1 text-neutral-400 hover:text-black transition-colors disabled:opacity-30"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className={cn(
              "w-8 text-center text-xs font-bold",
              item.quantity >= item.stock && "text-red-600"
            )}>
              {item.quantity}
            </span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="p-1 text-neutral-400 hover:text-black transition-colors disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-neutral-900">
              {formatPrice(item.priceHT * item.quantity)}
            </p>
            <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-tighter">HT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
