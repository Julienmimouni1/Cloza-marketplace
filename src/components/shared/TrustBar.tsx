import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const brands = [
  "VOGUE",
  "ELLE",
  "BAZAAR",
  "L'OFFICIEL",
  "WWD",
  "GQ",
  "GLAMOUR",
  "MARIE CLAIRE",
];

export async function TrustBar() {
  const t = await getTranslations('TrustBar');

  return (
    <section className="border-y py-12 bg-white overflow-hidden">
      <div className="container px-4 md:px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
          {t('featuredIn')}
        </p>
        
        <div 
          className="group flex overflow-hidden p-2 [--gap:3rem] [--duration:40s]"
          style={{ gap: "var(--gap)" }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex shrink-0 justify-around gap-[var(--gap)] animate-marquee items-center"
            >
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-foreground/40 hover:text-foreground transition-colors grayscale"
                >
                  {brand}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
