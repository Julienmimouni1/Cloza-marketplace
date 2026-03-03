"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useEffect, useState } from "react";

export function CartIndicator() {
  const { openDrawer, totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const count = isMounted ? totalItems() : 0;

  return (
    <button onClick={openDrawer} className="p-2 hover:bg-muted rounded-full relative transition-all">
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-cloza-gold rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-in zoom-in">
            {count}
        </span>
      )}
    </button>
  );
}
