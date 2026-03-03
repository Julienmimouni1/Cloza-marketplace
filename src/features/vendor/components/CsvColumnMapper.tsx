"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export type ColumnMapping = Record<string, string>; // SchemaField -> CsvHeader

interface CsvColumnMapperProps {
  csvHeaders: string[];
  onConfirm: (mapping: ColumnMapping) => void;
  onCancel: () => void;
}

export function CsvColumnMapper({ csvHeaders, onConfirm, onCancel }: CsvColumnMapperProps) {
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const t = useTranslations("Vendor.products.import.mapping");
  const tc = useTranslations("Common");

  const REQUIRED_FIELDS = [
    { key: "name", label: tc("name") },
    { key: "description", label: tc("description") },
    { key: "priceHt", label: tc("priceHt") },
    { key: "category", label: tc("category") + " (L1)" },
    { key: "subCategory", label: "Sous-catégorie (L2)" },
    { key: "leafCategory", label: "Sous-catégorie (L3)" },
    { key: "sku", label: tc("sku") },
  ];

  const OPTIONAL_FIELDS = [
    { key: "stock", label: tc("stock") },
    { key: "discountPrice", label: "Prix Remisé" },
    { key: "taxRate", label: "Taux TVA" },
    { key: "images", label: "Images (URLs)" },
    { key: "tags", label: "Tags" },
    { key: "material", label: "Matière" },
    { key: "origin", label: "Origine" },
    { key: "weight", label: "Poids" },
  ];

  // Auto-map on load
  useEffect(() => {
    const initialMapping: ColumnMapping = {};
    const normalizedHeaders = csvHeaders.map((h: string) => ({ original: h, normalized: h.toLowerCase().trim() }));

    [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].forEach(field => {
      // Direct match
      let match = normalizedHeaders.find((h: { normalized: string }) => h.normalized === field.key.toLowerCase());
      
      // Fuzzy / Common names match
      if (!match) {
        if (field.key === "priceHt") match = normalizedHeaders.find((h: { normalized: string }) => ["prix", "price", "prix ht", "montant", "variant price"].includes(h.normalized));
        if (field.key === "name") match = normalizedHeaders.find((h: { normalized: string }) => ["nom", "titre", "title", "name", "produit"].includes(h.normalized));
        if (field.key === "description") match = normalizedHeaders.find((h: { normalized: string }) => ["description", "body (html)"].includes(h.normalized));
        if (field.key === "stock") match = normalizedHeaders.find((h: { normalized: string }) => ["qty", "quantité", "quantity", "inventory", "variant inventory qty"].includes(h.normalized));
        if (field.key === "category") match = normalizedHeaders.find((h: { normalized: string }) => ["catégorie", "category", "product category", "type"].includes(h.normalized));
        if (field.key === "subCategory") match = normalizedHeaders.find((h: { normalized: string }) => ["sous-catégorie", "subcategory", "sub-category", "sous catégorie", "product type", "l2"].includes(h.normalized));
        if (field.key === "leafCategory") match = normalizedHeaders.find((h: { normalized: string }) => ["leaf category", "segment", "l3"].includes(h.normalized));
        if (field.key === "images") match = normalizedHeaders.find((h: { normalized: string }) => ["image", "photo", "photos", "urls", "image src"].includes(h.normalized));
        if (field.key === "sku") match = normalizedHeaders.find((h: { normalized: string }) => ["sku", "variant sku"].includes(h.normalized));
        if (field.key === "weight") match = normalizedHeaders.find((h: { normalized: string }) => ["poids", "weight", "variant grams"].includes(h.normalized));
      }

      if (match) {
        initialMapping[field.key] = match.original;
      }
    });
    setMapping(initialMapping);
  }, [csvHeaders]);

  const handleMapChange = (fieldKey: string, header: string) => {
    setMapping(prev => ({ ...prev, [fieldKey]: header }));
  };

  const isFormValid = REQUIRED_FIELDS.every(field => mapping[field.key]);

  const applyShopifyPreset = () => {
    const shopifyMapping: ColumnMapping = {
      name: "Title",
      description: "Body (HTML)",
      priceHt: "Variant Price",
      stock: "Variant Inventory Qty",
      sku: "Variant SKU",
      weight: "Variant Grams",
      images: "Image Src",
      category: "Product Category", // Often needs custom mapping
      subCategory: "Type", // Shopify "Type" often maps to our subCategory
      // Add others as needed
    };
    
    // Merge with existing but prioritize shopify preset if header exists in CSV
    const newMapping = { ...mapping };
    const normalizedHeaders = csvHeaders.map((h: string) => h.toLowerCase().trim());
    
    Object.entries(shopifyMapping).forEach(([key, value]) => {
      // Only apply if the CSV actually has this header
      if (normalizedHeaders.includes(value.toLowerCase().trim())) {
         // Find exact casing from csvHeaders
         const exactHeader = csvHeaders.find((h: string) => h.toLowerCase().trim() === value.toLowerCase().trim());
         if (exactHeader) newMapping[key] = exactHeader;
      }
    });
    setMapping(newMapping);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <Button variant="outline" size="sm" onClick={applyShopifyPreset} className="gap-2">
          <img src="https://cdn.iconscout.com/icon/free/png-256/free-shopify-logo-icon-download-in-svg-png-gif-file-formats--shops-shopping-brand-brands-pack-logos-icons-226579.png" className="w-4 h-4" alt="Shopify" />
          Preset Shopify
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t("requiredFields")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {REQUIRED_FIELDS.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`map-${field.key}`} className="flex items-center gap-2">
                  {field.label} <span className="text-red-500">*</span>
                  {mapping[field.key] && <Check className="h-3 w-3 text-green-500" />}
                </Label>
                <Select
                  value={mapping[field.key] || ""}
                  onValueChange={(val) => handleMapChange(field.key, val)}
                >
                  <SelectTrigger id={`map-${field.key}`} className={!mapping[field.key] ? "border-red-200" : ""}>
                    <SelectValue placeholder={t("selectColumn")} />
                  </SelectTrigger>
                  <SelectContent>
                    {csvHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t("optionalFields")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {OPTIONAL_FIELDS.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`map-${field.key}`}>{field.label}</Label>
                <Select
                  value={mapping[field.key] || "ignore"}
                  onValueChange={(val) => val === "ignore" ? handleMapChange(field.key, "") : handleMapChange(field.key, val)}
                >
                  <SelectTrigger id={`map-${field.key}`}>
                    <SelectValue placeholder={t("ignore")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ignore" className="text-muted-foreground italic">
                      {t("ignore")}
                    </SelectItem>
                    {csvHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          {tc("back")}
        </Button>
        <Button onClick={() => onConfirm(mapping)} disabled={!isFormValid}>
          {t("validate")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
