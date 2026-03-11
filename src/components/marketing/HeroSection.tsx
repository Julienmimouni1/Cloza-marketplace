import { Link } from "@/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { marketingConfig } from "@/config/marketing-config";

export function HeroSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={marketingConfig.hero.backgroundImage}
          alt={marketingConfig.hero.altText}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay - Modern Subtle Gradient */}
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-brightness-75" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-sm">
          {t('heroTitleLine1')} <br />
          <span className="text-cloza-gold italic">{t('heroTitleHighlight')}</span>
        </h1>
        
        <p className="max-w-xl text-lg md:text-xl text-zinc-100 mb-10 font-sans leading-relaxed drop-shadow-sm">
          {t('heroDescription')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/catalog"
            className="bg-zinc-900 text-white px-8 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center transition-all hover:bg-zinc-800 hover:scale-105 shadow-lg"
          >
            {t('explore')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/register"
            className="group border border-white/40 bg-white/10 backdrop-blur-md text-white px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all shadow-lg"
          >
            {t('apply')}
          </Link>
        </div>
      </div>
    </section>
  );
}
