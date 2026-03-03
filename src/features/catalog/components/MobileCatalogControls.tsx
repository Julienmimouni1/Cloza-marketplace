"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, User, ShoppingBag } from "lucide-react";
import { CatalogSidebar } from "./CatalogSidebar";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/features/cart/hooks/useCart";

interface MobileCatalogControlsProps {
  vendors: { id: string; name: string }[];
  subCategories: string[];
  defaultSelectedSubCategories: string[];
}

export function MobileCatalogControls({
  vendors,
  subCategories,
  defaultSelectedSubCategories,
}: MobileCatalogControlsProps) {
  const scrollDirection = useScrollDirection();
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const limit = searchParams.get("limit") || "24";
  
  const cartItemsCount = useCart(state => state.totalItems());

  useEffect(() => {
    if (scrollDirection === "down") {
      setIsVisible(false);
    } else if (scrollDirection === "up") {
      setIsVisible(true);
    }
  }, [scrollDirection]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`);
  };
  
  const handleLimitChange = (val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", val);
      router.push(`?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm transition-transform duration-300 ease-in-out lg:hidden",
        !isVisible ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container mx-auto px-4 py-3 space-y-3">
        
        {/* Row 1: Logo & Account/Cart */}
        <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
                <span className="font-serif text-2xl font-bold tracking-tighter text-cloza-black">
                  CLOZA
                </span>
            </Link>

            <div className="flex items-center gap-2">
                <Link href="/dashboard" className="p-2 text-muted-foreground hover:text-foreground">
                    <User className="h-5 w-5" />
                </Link>
                
                <button onClick={() => useCart.getState().openDrawer()} className="p-2 text-muted-foreground hover:text-foreground relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </button>
            </div>
        </div>
            
        {/* Row 2: Search Bar (Full Width) */}
        <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search..." 
                className="pl-9 h-10 bg-muted/50 border-none focus-visible:ring-1 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </form>

        {/* Row 3: Filters & Limit */}
        <div className="flex gap-2">
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 gap-2 h-9 font-normal">
                <SlidersHorizontal className="h-4 w-4" />
                Filters & Categories
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto z-[60]">
                <SheetHeader className="text-left mb-4">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                        Refine your search
                    </SheetDescription>
                </SheetHeader>
                <CatalogSidebar 
                    vendors={vendors}
                    subCategories={subCategories}
                    defaultSelectedSubCategories={defaultSelectedSubCategories}
                    startOpen={false}
                />
            </SheetContent>
            </Sheet>
            
            <Select value={limit} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[110px] h-9 text-xs">
                    <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="24">24 items</SelectItem>
                    <SelectItem value="48">48 items</SelectItem>
                    <SelectItem value="72">72 items</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
    </div>
  );
}