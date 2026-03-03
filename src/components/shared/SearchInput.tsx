"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.HTMLAttributes<HTMLFormElement> {
  placeholder?: string;
  onSearch?: () => void;
}

export function SearchInput({ 
  className, 
  placeholder = "Search for products, brands, or categories...", 
  onSearch,
  ...props 
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
      onSearch?.();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("relative w-full", className)} 
      {...props}
    >
      <div className="relative w-full">
        <Input 
          type="search" 
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-20 h-11 rounded-full border-zinc-300 bg-zinc-50 focus-visible:ring-cloza-gold"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <Button 
        type="submit"
        size="sm" 
        className="absolute right-1.5 top-1.5 h-8 rounded-full bg-cloza-black hover:bg-zinc-800 text-white px-4"
      >
        Search
      </Button>
    </form>
  );
}
