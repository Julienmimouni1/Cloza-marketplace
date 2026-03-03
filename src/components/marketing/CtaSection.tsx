import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export function CtaSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="py-20 bg-cloza-gold text-cloza-black text-center">
      <div className="container px-4">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">{t('readyTitle')}</h2>
        <Link
          href="/register"
          className="inline-block bg-cloza-black text-white px-10 py-5 rounded-none font-bold text-sm uppercase tracking-widest hover:bg-zinc-900 transition-colors"
        >
          {t('applyMembership')}
        </Link>
      </div>
    </section>
  );
}
