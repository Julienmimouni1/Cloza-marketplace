import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-zinc-950">
      {/* Cinematic Landscape Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images_produits/cta section.avif"
          alt="High-end fashion showroom panorama"
          fill
          className="object-cover object-center opacity-60 grayscale-[0.3]"
          priority
        />
        {/* Sophisticated dual gradient: Top for depth, Bottom for footer transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60" />
      </div>

      <div className="container relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-3 mb-4">
             
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Sublimez votre <span className="italic font-light text-zinc-100">héritage</span>, <br />
              <span className="text-cloza-gold">propulsez</span> votre futur.
            </h2>
            
            <p className="text-zinc-300 text-lg md:text-xl font-sans max-w-2xl mx-auto leading-relaxed">
              Rejoignez une communauté de marques et de boutiques qui redéfinissent les standards de l'industrie.
            </p>

            <div className="pt-8">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center bg-white text-zinc-900 px-12 py-5 font-bold text-sm uppercase tracking-widest transition-all hover:bg-cloza-gold hover:text-white overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Devenir Partenaire <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
