import { getFeaturedVendors } from "@/features/catalog/actions";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function FeaturedBrands() {
  const [brands, t] = await Promise.all([
    getFeaturedVendors(),
    getTranslations('FeaturedBrands')
  ]);

  if (brands.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t('title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('subtitle')}
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              href={`/catalog?vendorId=${brand.id}`}
              className="group flex flex-col items-center text-center space-y-4"
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden border border-zinc-100 grayscale hover:grayscale-0 transition-all duration-500 bg-zinc-50">
                {brand.logoUrl ? (
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300 font-bold">
                    {brand.name[0]}
                  </div>
                )}
              </div>
              <h3 className="font-serif font-medium text-lg group-hover:text-cloza-gold transition-colors">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
