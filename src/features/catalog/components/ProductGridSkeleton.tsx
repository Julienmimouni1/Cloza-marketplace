import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[3/4] w-full rounded-sm" />
          <div className="space-y-1">
            <Skeleton className="mx-auto h-4 w-3/4" />
            <Skeleton className="mx-auto h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
