"use client";

import { SessionProvider } from "next-auth/react";
import { CartSync } from "@/features/cart/components/CartSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartSync />
      {children}
    </SessionProvider>
  );
}
