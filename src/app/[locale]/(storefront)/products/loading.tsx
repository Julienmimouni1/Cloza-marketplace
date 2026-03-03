import { ProductGridSkeleton } from "@/features/catalog/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 hidden lg:block">
           <div className="h-64 w-full animate-pulse bg-muted rounded-md" />
        </aside>
        <div className="flex-1">
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
