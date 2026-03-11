import { getActivePromotions, getTrendingProducts } from "@/features/catalog/actions";
import { Tag, ArrowRight } from "lucide-react";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

export async function ActiveDeals() {
  const [deals, trendingProducts, t] = await Promise.all([
    getActivePromotions(),
    getTrendingProducts(), 
    getTranslations('ActiveDeals')
  ]);

  if (deals.length === 0 && trendingProducts.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-50/50">
      <div className="container px-4 mx-auto space-y-24">
        
        {/* Active Promotions - Modern Cards */}
        {deals.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 bg-cloza-gold rounded-full" />
                <h2 className="text-3xl font-serif font-bold tracking-tight text-zinc-900">
                  {t('opportunitiesTitle')}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal) => (
                <div 
                  key={deal.id} 
                  className="group relative bg-white p-10 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-cloza-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <span className="inline-block px-4 py-1 rounded-full bg-cloza-gold/10 text-cloza-gold text-xs font-bold tracking-widest uppercase mb-6">
                    Offre Limitée
                  </span>
                  <div className="text-5xl font-serif font-bold text-zinc-900 mb-4">{deal.discount}</div>
                  <h3 className="font-bold text-xl text-zinc-900 mb-3">{deal.title}</h3>
                  <p className="text-zinc-600 font-sans leading-relaxed mb-8">{deal.description}</p>
                  {deal.code && (
                    <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2 rounded-xl text-sm font-mono tracking-wider shadow-md">
                      <Tag className="h-3 w-3 text-cloza-gold" />
                      {deal.code}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Products - Staggered/Organic Grid */}
        {trendingProducts.length > 0 && (
           <div>
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1 bg-zinc-900 rounded-full" />
                  <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-zinc-900">
                    {t('trendingTitle')}
                  </h2>
                </div>
                <Link 
                  href="/catalog" 
                  className="group flex items-center gap-2 text-zinc-900 font-bold hover:text-cloza-gold transition-colors"
                >
                  Découvrir toute la sélection <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {trendingProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`transition-all duration-700 ${
                    index % 4 === 1 ? 'lg:mt-12' : index % 4 === 3 ? 'lg:-mt-6' : ''
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
           </div>
        )}

      </div>
    </section>
  );
}
