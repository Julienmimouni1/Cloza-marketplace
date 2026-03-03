import type { Metadata } from "next";
import { Playfair_Display, Instrument_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { Providers } from "./providers";
import { ImpersonationBanner } from "@/features/admin/components/ImpersonationBanner";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Cloza | Premium B2B Fashion Marketplace",
  description: "High-end fashion marketplace for retailers and e-tailers.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          playfair.variable,
          instrument.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <ImpersonationBanner />
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <Toaster position="top-center" richColors />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}