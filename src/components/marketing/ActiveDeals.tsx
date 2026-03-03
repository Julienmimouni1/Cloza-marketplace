import { getActivePromotions, getTrendingProducts } from "@/features/catalog/actions";
import { Tag, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { getTranslations } from "next-intl/server";

export async function ActiveDeals() {
  const [deals, trendingProducts, t] = await Promise.all([
    getActivePromotions(),
    getTrendingProducts(), 
    getTranslations('ActiveDeals')
  ]);

  if (deals.length === 0 && trendingProducts.length === 0) return null;

  return (
    <section className="py-12 bg-zinc-50 border-y border-zinc-200">
      <div className="container px-4 mx-auto space-y-12">
        
        {/* Active Promotions */}
        {deals.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-8 justify-center">
                <Tag className="h-5 w-5 text-cloza-gold" />
                <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">{t('opportunitiesTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <div key={deal.id} className="bg-white p-6 border border-zinc-200 shadow-sm flex flex-col items-center text-center">
                  <span className="text-3xl font-bold text-cloza-gold mb-2">{deal.discount}</span>
                  <h3 className="font-bold text-zinc-900 mb-2">{deal.title}</h3>
                  <p className="text-sm text-zinc-600 mb-4">{deal.description}</p>
                  {deal.code && (
                    <div className="bg-zinc-100 px-3 py-1 rounded-sm text-xs font-mono font-bold text-zinc-500 uppercase">
                      {t('code')}: {deal.code}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
           <div>
             <div className="flex items-center gap-2 mb-8 justify-center">
                <ShoppingBag className="h-5 w-5 text-cloza-gold" />
                <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">{t('trendingTitle')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
           </div>
        )}

      </div>
    </section>
  );
}
