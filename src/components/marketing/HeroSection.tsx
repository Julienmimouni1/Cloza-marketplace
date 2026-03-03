import { Link } from "@/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { marketingConfig } from "@/config/marketing-config";

export function HeroSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={marketingConfig.hero.backgroundImage}
          alt={marketingConfig.hero.altText}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay - Gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-4">
        <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-cloza-gold backdrop-blur-md">
          <span className="mr-2 h-2 w-2 rounded-full bg-cloza-gold animate-pulse"></span>
          {t('newCollections')}
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight drop-shadow-lg">
          {t('heroTitleLine1')} <br />
          <span className="text-cloza-gold italic">{t('heroTitleHighlight')}</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-zinc-200 mb-10 font-sans leading-relaxed drop-shadow-md">
          {t('heroDescription')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            href="/catalog"
            className="bg-cloza-gold text-cloza-black px-10 py-5 font-bold text-sm uppercase tracking-widest flex items-center justify-center transition-all hover:scale-105 hover:bg-yellow-500 shadow-xl shadow-black/20"
          >
            {t('explore')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/register"
            className="group border border-white/30 bg-white/5 backdrop-blur-sm text-white px-10 py-5 font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            {t('apply')}
          </Link>
        </div>
      </div>
    </section>
  );
}
