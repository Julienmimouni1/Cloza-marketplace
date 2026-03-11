import { getFeaturedVendors } from "@/features/catalog/actions";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

export async function FeaturedBrands() {
  const [brands, t] = await Promise.all([
    getFeaturedVendors(),
    getTranslations('FeaturedBrands')
  ]);

  if (brands.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-zinc-100">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-zinc-900">
              {t('title')}
            </h2>
            <p className="text-zinc-600 text-lg font-sans leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
          <Link 
            href="/catalog" 
            className="group text-zinc-900 font-bold border-b-2 border-cloza-gold pb-1 hover:text-cloza-gold transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Voir tout le catalogue <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Circular Brands Grid - Restoring clear profile photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              href={`/catalog?vendorId=${brand.id}`}
              className="group flex flex-col items-center text-center space-y-6"
            >
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center border border-zinc-100 transition-all duration-700 bg-white shadow-sm group-hover:shadow-xl group-hover:scale-110 group-hover:border-cloza-gold/40">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-300 font-serif font-bold text-3xl bg-zinc-50">
                      {brand.name[0]}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg text-zinc-900 group-hover:text-cloza-gold transition-colors duration-300">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
