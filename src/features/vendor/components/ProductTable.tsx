"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductActions } from "@/features/vendor/components/ProductActions";
import { ProductStatus } from "@/generated/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bulkUpdateProductStatus, bulkUpdateAllProductStatus, bulkDeleteProducts, bulkDeleteAllProducts } from "../actions";
import { Loader2, CheckCircle2, FileText, Ban, Archive, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

type ProductWithImages = {
  id: string;
  name: string;
  sku: string;
  priceHt: number;
  stock: number;
  status: ProductStatus;
  images: { url: string; isMain: boolean }[];
};

interface ProductTableProps {
  products: ProductWithImages[];
  totalCount: number;
  filters: { q?: string; status?: ProductStatus };
}

export function ProductTable({ products, totalCount, filters }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectAllGlobal, setIsSelectAllGlobal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Vendor.products");
  const tc = useTranslations("Common");

  // Reset selection when products/page changes
  useEffect(() => {
    setSelectedIds(new Set());
    setIsSelectAllGlobal(false);
  }, [products]);

  const toggleSelectAllPage = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
      setIsSelectAllGlobal(false);
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const toggleSelectAllGlobal = () => {
    setIsSelectAllGlobal(true);
    // Visual feedback: select visible rows
    setSelectedIds(new Set(products.map((p) => p.id)));
  };

  const cancelSelectAllGlobal = () => {
    setIsSelectAllGlobal(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    if (isSelectAllGlobal) {
      // If unchecking one item while global select is active, cancel global select
      // and revert to page-level selection (minus the unchecked one)
      setIsSelectAllGlobal(false);
      const newSelected = new Set(products.map((p) => p.id));
      newSelected.delete(id);
      setSelectedIds(newSelected);
      return;
    }

    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (status: ProductStatus) => {
    if (selectedIds.size === 0) return;

    startTransition(async () => {
      let result;
      if (isSelectAllGlobal) {
        result = await bulkUpdateAllProductStatus(filters, status);
      } else {
        result = await bulkUpdateProductStatus(Array.from(selectedIds), status);
      }

      if (result.success) {
        toast.success(
          isSelectAllGlobal 
            ? t("bulkActions.successUpdateAll", { count: totalCount })
            : t("bulkActions.successUpdate", { count: selectedIds.size })
        );
        setSelectedIds(new Set());
        setIsSelectAllGlobal(false);
      } else {
        toast.error(result.error?.message || tc("error"));
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(t("bulkActions.confirmDelete"))) return;

    startTransition(async () => {
      let result;
      if (isSelectAllGlobal) {
        result = await bulkDeleteAllProducts(filters);
      } else {
        result = await bulkDeleteProducts(Array.from(selectedIds));
      }

      if (result.success) {
        toast.success(
          isSelectAllGlobal 
            ? t("bulkActions.successUpdateAll", { count: totalCount }) // Using same for simplicity or add successDeleteAll
            : t("bulkActions.successDelete", { count: selectedIds.size })
        );
        setSelectedIds(new Set());
        setIsSelectAllGlobal(false);
      } else {
        toast.error(result.error?.message || tc("error"));
      }
    });
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
      case ProductStatus.DRAFT:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
      case ProductStatus.OUT_OF_STOCK:
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
      case ProductStatus.ARCHIVED:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return t("statusActive");
      case ProductStatus.DRAFT:
        return t("statusDraft");
      case ProductStatus.OUT_OF_STOCK:
        return t("statusOutOfStock");
      case ProductStatus.ARCHIVED:
        return t("statusArchived");
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Selection Banner */}
      {(selectedIds.size > 0 || isSelectAllGlobal) && (
        <div className="flex flex-col gap-3 p-4 bg-slate-50 border rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700">
              {isSelectAllGlobal 
                ? t("bulkActions.allSelected", { count: totalCount }) 
                : t("bulkActions.selected", { count: selectedIds.size })}
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction(ProductStatus.ACTIVE)}
                disabled={isPending}
                className="flex-1 md:flex-none border-green-200 hover:bg-green-50 text-green-700"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">{t("bulkActions.activate")}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction(ProductStatus.DRAFT)}
                disabled={isPending}
                className="flex-1 md:flex-none border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">{t("bulkActions.draft")}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction(ProductStatus.OUT_OF_STOCK)}
                disabled={isPending}
                className="flex-1 md:flex-none border-red-200 hover:bg-red-50 text-red-700"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">{t("bulkActions.outOfStock")}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction(ProductStatus.ARCHIVED)}
                disabled={isPending}
                className="flex-1 md:flex-none border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">{t("bulkActions.archive")}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                disabled={isPending}
                className="flex-1 md:flex-none border-red-200 hover:bg-red-50 text-red-700"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">{t("bulkActions.delete")}</span>
              </Button>
            </div>
          </div>
          
          {/* Global Selection Prompt */}
          {!isSelectAllGlobal && selectedIds.size === products.length && totalCount > products.length && (
            <div className="text-sm text-center border-t border-slate-200 pt-2 mt-2">
              <span className="text-slate-600">
                {t("bulkActions.selected", { count: products.length })}. 
              </span>
              <button 
                onClick={toggleSelectAllGlobal}
                className="ml-2 font-semibold text-blue-600 hover:underline"
              >
                {t("bulkActions.selectAll", { count: totalCount })}
              </button>
            </div>
          )}

          {/* Global Selection Active State */}
          {isSelectAllGlobal && (
             <div className="text-sm text-center border-t border-slate-200 pt-2 mt-2">
               <span className="text-slate-600">
                 {t("bulkActions.allSelected", { count: totalCount })}.
               </span>
               <button 
                 onClick={cancelSelectAllGlobal}
                 className="ml-2 font-semibold text-blue-600 hover:underline"
               >
                 {t("bulkActions.cancelSelection")}
               </button>
             </div>
          )}
        </div>
      )}

      <div className="rounded-md border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={products.length > 0 && selectedIds.size === products.length}
                    onCheckedChange={toggleSelectAllPage}
                    aria-label={tc("all")}
                  />
                </TableHead>
                <TableHead className="w-[80px]">{t("image")}</TableHead>
                <TableHead className="min-w-[150px]">{tc("name")}</TableHead>
                <TableHead className="hidden md:table-cell">{tc("sku")}</TableHead>
                <TableHead>{tc("priceHt")}</TableHead>
                <TableHead className="hidden sm:table-cell">{tc("stock")}</TableHead>
                <TableHead className="hidden sm:table-cell">{tc("status")}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24 text-gray-500">
                    {t("noProductsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const mainImage = product.images.find((img) => img.isMain) || product.images[0];
                  const isSelected = selectedIds.has(product.id);

                  return (
                    <TableRow key={product.id} data-state={isSelected ? "selected" : undefined}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(product.id)}
                          aria-label={`Sélectionner ${product.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage src={mainImage?.url || ""} alt={product.name} />
                          <AvatarFallback className="rounded-lg">
                            {product.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          <span className="text-xs text-slate-500 md:hidden">{product.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm hidden md:table-cell">{product.sku}</TableCell>
                      <TableCell>{(product.priceHt / 100).toFixed(2)} €</TableCell>
                      <TableCell className="hidden sm:table-cell">{product.stock}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className={getStatusColor(product.status)}>
                          {getStatusLabel(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ProductActions productId={product.id} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
