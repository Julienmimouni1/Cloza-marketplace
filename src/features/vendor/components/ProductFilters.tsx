"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductStatus } from "@/generated/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useTranslations } from "next-intl";

export function ProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Vendor.products");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    // Reset page on search
    params.delete("page");
    router.replace(`?${params.toString()}`);
  }, 300);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    // Reset page on filter
    params.delete("page");
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder={t("searchPlaceholder")}
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select
          defaultValue={searchParams.get("status") || "ALL"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("allStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("allStatus")}</SelectItem>
            <SelectItem value={ProductStatus.ACTIVE}>{t("statusActive")}</SelectItem>
            <SelectItem value={ProductStatus.DRAFT}>{t("statusDraft")}</SelectItem>
            <SelectItem value={ProductStatus.OUT_OF_STOCK}>{t("statusOutOfStock")}</SelectItem>
            <SelectItem value={ProductStatus.ARCHIVED}>{t("statusArchived")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

