import type { Metadata } from "next";
import { Instrument_Sans, Roboto_Condensed, Playfair_Display } from "next/font/google";
import "../styles/base.css";
import "../styles/swiper.css";
import "../styles/animate.css";
import "../styles/component.css";
import "../styles/theme.css";
import "../styles/custom.css";
import "./globals.css";
import AnnouncementBar from '../components/layout/AnnouncementBar';
import HeaderTop from '../components/layout/HeaderTop';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "Cloza Marketplace",
  description: "B2B Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${robotoCondensed.variable} ${playfairDisplay.variable}`}>
        <AnnouncementBar />
        <HeaderTop />
        <Header />
        <main id="MainContent" className="content-for-layout focus-none" role="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
