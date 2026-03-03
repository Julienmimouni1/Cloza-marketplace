"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MENU_DATA } from "@/lib/menu-data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

// Image mapping for categories and subcategories with updated, reliable Unsplash IDs
const CATEGORY_IMAGES: Record<string, string> = {
  // Top level defaults
  "New products": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
  "Beauty & Wellness": "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop",
  "Food & Beverages": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
  "Textile": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",

  // Beauty Subcategories
  "Facial Care": "/images_produits/facial-care.avif", // Cream jar
  "Body Care": "/images_produits/body-cair.avif", // Lotion application
  "Hair": "/images_produits/hair.avif", // Hair salon/products
  "Makeup": "/images_produits/makeup.avif", // Makeup brushes/palette
  "Fragrance": "/images_produits/fragrance.avif", // Perfume bottle
  "Beauty accessory": "/images_produits/beauty-accesories.avif", // Jade roller/tools
  "Beauty & personnal care": "/images_produits/personal-care.avif", // Soap/Spa
  "Natural & Organic Products": "/images_produits/organic-product.avif", // Green/Natural

  // Food Subcategories
  "Savory Grocery": "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1978&auto=format&fit=crop", // Spices/Pasta
  "Sweet Grocery": "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1978&auto=format&fit=crop", // Chocolate
  "World Food": "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2000&auto=format&fit=crop", // Spices market
  "Salty Snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=2070&auto=format&fit=crop", // Chips/Nuts
  "Sweet Snacks": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=2000&auto=format&fit=crop", // Cookies
  "Energy & Protein Snacks": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2000&auto=format&fit=crop", // Bars
  "Non-Alcoholic": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2000&auto=format&fit=crop", // Juice
  "Alcoholic": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop", // Wine
  "Healthy Drinks": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2000&auto=format&fit=crop", // Kombucha fallback
  "Fine Grocery": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=2000&auto=format&fit=crop", // Truffle/Oil
  "Gift & Seasonal": "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2000&auto=format&fit=crop", // Gift box
  "Bulk Ingredients": "https://images.unsplash.com/photo-1581600140682-e8eab44ee281?q=80&w=2000&auto=format&fit=crop", // Flour sacks
  "Professional Drinks": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop", // Coffee beans
  "Catering Essentials": "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2000&auto=format&fit=crop", // Table setting

  // Textile Subcategories
  "Women": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1935&auto=format&fit=crop", // Woman fashion
  "Men": "https://images.unsplash.com/photo-1687541160824-366bd3581699?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Men fashion
  "Kids": "https://images.unsplash.com/photo-1636905206149-bc3217e6a198?q=80&w=683&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Kids fashion
  "Bags and accessories": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2000&auto=format&fit=crop", // Bag
};

export function ShopByCategory() {
  const t = useTranslations('Categories');
  const [activeCategory, setActiveCategory] = React.useState(MENU_DATA[1].title); // Default to Beauty

  const currentCategory = MENU_DATA.find((c) => c.title === activeCategory);

  // If the category has children, use them. If not (like New Products), maybe show itself or specific items.
  const displayItems = currentCategory?.children || [];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">
            {t('ShopBy')}
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 border-b border-zinc-200 pb-4">
            {MENU_DATA.map((category) => (
              <button
                key={category.title}
                onClick={() => setActiveCategory(category.title)}
                className={cn(
                  "text-lg md:text-xl font-medium pb-4 transition-all relative",
                  activeCategory === category.title
                    ? "text-cloza-black font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cloza-black"
                    : "text-muted-foreground hover:text-cloza-black"
                )}
              >
                {t(category.title as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          {displayItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {displayItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative h-80 w-full overflow-hidden rounded-lg bg-zinc-100 block"
                >
                  <Image
                    src={CATEGORY_IMAGES[item.title] || CATEGORY_IMAGES[activeCategory] || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                  <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center pb-12">
                    <h3 className="font-serif text-2xl font-bold text-white mb-2 tracking-wide drop-shadow-md">
                      {item.title}
                    </h3>
                    <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span className="inline-flex items-center text-sm font-bold text-white uppercase tracking-widest border-b border-white pb-1">
                        {t('Explore')} <ArrowRight className="ml-2 h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Fallback for categories without children (like New Products)
            <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="relative w-full max-w-4xl h-96 rounded-2xl overflow-hidden mb-8 group">
                <Image
                  src={CATEGORY_IMAGES[activeCategory] || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"}
                  alt={activeCategory}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="font-serif text-4xl md:text-6xl font-bold text-white">
                    {t(activeCategory as any)}
                  </h3>
                </div>
              </div>
              <Link href={currentCategory?.href || "/catalog"}>
                <Button size="lg" className="rounded-none px-8 py-6 text-lg">
                  {t('ViewAll')} {t(activeCategory as any)}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
