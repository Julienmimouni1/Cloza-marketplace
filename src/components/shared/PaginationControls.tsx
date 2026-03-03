"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm text-muted-foreground mx-2">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}