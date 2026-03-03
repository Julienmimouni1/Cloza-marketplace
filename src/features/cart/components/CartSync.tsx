"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/features/cart/hooks/useCart";
import { syncCart, getCart } from "@/features/cart/actions";
import { CartItem } from "@/features/cart/types";

export function CartSync() {
  const { status, data: session } = useSession();
  const { items, setItems, hasHydrated, setHasHydrated, isSynced, setIsSynced } = useCart();
  const isSyncing = useRef(false);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    const performSync = async () => {
      if (status === "authenticated" && hasHydrated && !isSyncing.current) {
        isSyncing.current = true;
        try {
          // Strategy: Only merge (syncCart) if we have items AND we believe they are not yet synced (Guest mode)
          // If we are already synced, we just fetch the latest server state (getCart) to stay up to date.

          if (items.length > 0 && !isSynced) {
            // 1. Merge Guest items to DB
            const result = await syncCart(items);
            if (result.success) {
              // 2. Refresh local state from DB response
              const dbItems = result.data.items.map((item: any) => ({
                id: item.productId,
                variantId: item.productId,
                productId: item.productId,
                vendorId: item.product.vendorId,
                title: item.product.name,
                priceHT: item.product.priceHt,
                vatRate: item.product.vatRate || 20, // Fallback to 20 if missing, but preferably from product
                quantity: item.quantity,
                stock: item.product.stock,
                image: item.product.image,
              }));
              setItems(dbItems);
              setIsSynced(true);
            }
          } else {
            // 2. Already synced or empty, just fetch existing cart from DB (Source of Truth)
            const result = await getCart();
            if (result.success && result.data?.items) {
              const dbItems = result.data.items.map((item: any) => ({
                id: item.productId,
                variantId: item.productId,
                productId: item.productId,
                vendorId: item.product.vendorId,
                title: item.product.name,
                priceHT: item.product.priceHt,
                vatRate: item.product.vatRate || 20,
                quantity: item.quantity,
                stock: item.product.stock,
                image: item.product.image,
              }));
              setItems(dbItems);
              setIsSynced(true);
            }
          }
        } finally {
          isSyncing.current = false;
        }
      }
    };

    performSync();
  }, [status, hasHydrated, setItems, setIsSynced]); // items removed from deps to avoid loop, but captured in closure

  return null;
}
