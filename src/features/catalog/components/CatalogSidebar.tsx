"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RangeSlider } from "@/components/ui/range-slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MENU_DATA, MenuItem } from "@/lib/menu-data";
import { useTranslations } from "next-intl";

interface Vendor {
  id: string;
  name: string;
}

interface CatalogSidebarProps {
  vendors: Vendor[];
  subCategories?: string[];
  defaultSelectedSubCategories?: string[];
  minPrice?: number;
  maxPrice?: number;
  startOpen?: boolean;
}

export function CatalogSidebar({ 
  vendors, 
  subCategories = [], 
  defaultSelectedSubCategories = [],
  minPrice = 0, 
  maxPrice = 1000,
  startOpen = false
}: CatalogSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Catalog");
  const tc = useTranslations("Categories");

  // Derived State (Controlled by URL)
  const categoryParam = searchParams.get("category");
  const sort = searchParams.get("sort") || "newest";
  const inStock = searchParams.get("stock") === "in-stock";
  const brandsParam = searchParams.get("brands")?.split(",") || [];
  const subCatsParam = searchParams.get("subCategories")?.split(",") || [];
  
  const minPriceParam = Number(searchParams.get("minPrice")) || minPrice;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || maxPrice;

  // Local state for Price Range to allow smooth sliding and manual input
  const [priceRange, setPriceRange] = useState([minPriceParam, maxPriceParam]);

  // Sync local state with URL params when they change (e.g. back button)
  useEffect(() => {
    setPriceRange([minPriceParam, maxPriceParam]);
  }, [minPriceParam, maxPriceParam]);

  // Active Filters (URL + Page Context)
  // Note: subCategories prop is now less critical as we use MENU_DATA for navigation, 
  // but might be useful if we wanted to show "count" or availability.
  // For now, we rely on MENU_DATA for the structure.

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
 
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const updateFilter = (key: string, value: string | null) => {
      router.push(`?${createQueryString({ [key]: value })}`);
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const currentBrands = new Set(brandsParam);
    if (checked) {
      currentBrands.add(brandId);
    } else {
      currentBrands.delete(brandId);
    }
    const newBrands = Array.from(currentBrands);
    updateFilter("brands", newBrands.length > 0 ? newBrands.join(",") : null);
  };

  const handleStockChange = (checked: boolean) => {
    updateFilter("stock", checked ? "in-stock" : null);
  };

  const handleSortChange = (value: string) => {
    updateFilter("sort", value);
  };
  
  // Update local state while sliding
  const handlePriceSlide = (value: number[]) => {
    setPriceRange(value);
  };

  // Commit to URL on slider release
  const handlePriceCommit = (value: number[]) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("minPrice", value[0].toString());
      newSearchParams.set("maxPrice", value[1].toString());
      router.push(`?${newSearchParams.toString()}`);
  }

  // Handle manual input changes
  const handleManualPriceChange = (index: 0 | 1, value: string) => {
    const newPrice = [...priceRange];
    const numVal = parseInt(value);
    
    if (!isNaN(numVal)) {
        newPrice[index] = numVal;
        setPriceRange(newPrice);
    } else if (value === "") {
        // Allow empty string while typing, though parseInt handles it poorly (becomes NaN). 
        // We might want to handle this better in a real form, but for now strict number parsing.
    }
  };

  const commitManualPrice = () => {
      // Ensure min <= max
      let [min, max] = priceRange;
      if (min > max) {
          const temp = min;
          min = max;
          max = temp;
          setPriceRange([min, max]);
      }
      handlePriceCommit([min, max]);
  };

  // Determine which Main Category should be open
  const getActiveMainCategory = () => {
    if (!categoryParam) return undefined;
    
    const found = MENU_DATA.find(item => {
      const itemCat = item.href.split('category=')[1]?.split('&')[0];
      if (decodeURIComponent(itemCat || "") === categoryParam) return true;

      if (item.children) {
        const hasChild = (children: MenuItem[]): boolean => {
           return children.some(child => {
              const childCat = child.href.split('category=')[1]?.split('&')[0];
              if (decodeURIComponent(childCat || "") === categoryParam) return true;
              if (child.children) return hasChild(child.children);
              return false;
           });
        }
        return hasChild(item.children);
      }
      return false;
    });

    return found?.title;
  };

  const defaultOpenCategory = getActiveMainCategory();

  return (
    <div className="w-full space-y-6">
      {/* Categories Navigation Section */}
      <div className="space-y-2">
        <h3 className="font-serif text-lg font-medium">{t("sidebar.collections")}</h3>
        <Accordion type="single" collapsible defaultValue={startOpen ? defaultOpenCategory : undefined} className="w-full">
          {MENU_DATA.filter(item => item.children && item.children.length > 0).map((item) => (
            <AccordionItem value={item.title} key={item.title} className="border-none">
              <AccordionTrigger 
                className={cn(
                  "font-serif text-base font-normal hover:no-underline py-2",
                  categoryParam && item.href.includes(encodeURIComponent(categoryParam)) ? "font-medium" : ""
                )}
              >
                <Link 
                  href={item.href} 
                  onClick={(e) => e.stopPropagation()} 
                  className="hover:text-cloza-gold flex-1 text-left"
                >
                  {tc(item.title)}
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-2 border-l border-gray-100 ml-1">
                  {item.children?.map((child) => {
                     const childCat = child.href.split('category=')[1]?.split('&')[0];
                     const isActive = decodeURIComponent(childCat || "") === categoryParam;

                     return (
                      <div key={child.title} className="space-y-1">
                        <Link 
                          href={child.href}
                          className={cn(
                            "block text-sm transition-colors hover:text-cloza-gold",
                            isActive ? "font-medium text-black" : "text-muted-foreground"
                          )}
                        >
                          {tc(child.title)}
                        </Link>
                        {/* Grandchildren (Level 3) */}
                        {child.children && (
                          <div className="pl-3 flex flex-col space-y-1 mt-1 border-l border-gray-100">
                             {child.children.map(grand => {
                                const grandCat = grand.href.split('category=')[1]?.split('&')[0];
                                const isGrandActive = decodeURIComponent(grandCat || "") === categoryParam;
                                return (
                                  <Link
                                    key={grand.title}
                                    href={grand.href}
                                    className={cn(
                                      "block text-xs transition-colors hover:text-cloza-gold",
                                      isGrandActive ? "font-medium text-black" : "text-muted-foreground"
                                    )}
                                  >
                                    {tc(grand.title)}
                                  </Link>
                                );
                             })}
                          </div>
                        )}
                      </div>
                     );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="h-px bg-border" />

      {/* Sort By Section */}
      <div className="space-y-2">
        <h3 className="font-serif text-lg font-medium">{t("sidebar.sortBy")}</h3>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("sidebar.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sort.newest")}</SelectItem>
            <SelectItem value="price-asc">{t("sort.priceAsc")}</SelectItem>
            <SelectItem value="price-desc">{t("sort.priceDesc")}</SelectItem>
            <SelectItem value="alpha-asc">{t("sort.alphaAsc")}</SelectItem>
            <SelectItem value="alpha-desc">{t("sort.alphaDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-border" />

      {/* Availability Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-medium">{t("sidebar.availability")}</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="in-stock" 
            checked={inStock} 
            onCheckedChange={(checked) => handleStockChange(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            {t("sidebar.inStockOnly")}
          </Label>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Brands Section */}
      <Accordion type="single" collapsible defaultValue={startOpen ? "brands" : undefined} className="w-full">
        <AccordionItem value="brands" className="border-none">
          <AccordionTrigger className="font-serif text-lg font-medium hover:no-underline py-2">
            {t("sidebar.brands")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${vendor.id}`} 
                    checked={brandsParam.includes(vendor.id)}
                    onCheckedChange={(checked) => handleBrandChange(vendor.id, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`brand-${vendor.id}`} 
                    className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {vendor.name}
                  </Label>
                </div>
              ))}
              {vendors.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("sidebar.noBrands")}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

       <div className="h-px bg-border" />

      {/* Price Range Section */}
      <Accordion type="single" collapsible defaultValue={startOpen ? "price" : undefined} className="w-full">
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="font-serif text-lg font-medium hover:no-underline py-2">
            {t("sidebar.priceRange")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4 px-1">
              <RangeSlider
                defaultValue={[minPrice, maxPrice]}
                value={priceRange}
                min={0}
                max={2000}
                step={10}
                onValueChange={handlePriceSlide}
                onValueCommit={handlePriceCommit}
                className="my-4"
              />
              <div className="flex justify-between items-center gap-4">
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">€</span>
                    <Input 
                        type="number"
                        min={0}
                        max={2000}
                        value={priceRange[0]}
                        onChange={(e) => handleManualPriceChange(0, e.target.value)}
                        onBlur={commitManualPrice}
                        onKeyDown={(e) => e.key === 'Enter' && commitManualPrice()}
                        className="h-8 w-20 px-2 text-center"
                    />
                 </div>
                 <span className="text-muted-foreground">-</span>
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">€</span>
                    <Input 
                        type="number"
                        min={0}
                        max={2000}
                        value={priceRange[1]}
                        onChange={(e) => handleManualPriceChange(1, e.target.value)}
                        onBlur={commitManualPrice}
                        onKeyDown={(e) => e.key === 'Enter' && commitManualPrice()}
                        className="h-8 w-20 px-2 text-center"
                    />
                 </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}