"use client";

import { useState, useEffect } from "react";
import { Category } from "@/generated/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface CategoryMapperProps {
  uniqueValues: string[];
  onConfirm: (mapping: Record<string, Category>) => void;
  onCancel: () => void;
}

export function CategoryMapper({ uniqueValues, onConfirm, onCancel }: CategoryMapperProps) {
  const [mapping, setMapping] = useState<Record<string, Category>>({});
  const t = useTranslations("Vendor.products.import.categoryMapping");
  const tc = useTranslations("Common");

  // Auto-mapping heuristics
  useEffect(() => {
    const newMapping: Record<string, Category> = {};
    uniqueValues.forEach(val => {
      const normalized = val.toLowerCase();
      // Heuristic: check if enum value is contained in string as a whole word
      const match = Object.values(Category).find(cat => {
        const catRegex = new RegExp(`\\b${cat.toLowerCase()}\\b`, 'i');
        return catRegex.test(normalized);
      });
      if (match) {
        newMapping[val] = match;
      }
    });
    setMapping(prev => ({ ...prev, ...newMapping }));
  }, [uniqueValues]);

  const handleSelect = (csvValue: string, category: Category) => {
    setMapping(prev => ({ ...prev, [csvValue]: category }));
  };

  const isComplete = uniqueValues.every(val => mapping[val]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
             {t("title")} {/* Or add specific description key if needed */}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4 font-medium text-sm text-muted-foreground mb-2">
            <div>{t("csvCategory")}</div>
            <div>{t("clozaCategory")}</div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {uniqueValues.map((value) => (
              <div key={value} className="grid grid-cols-2 gap-4 items-center">
                <div className="text-sm break-words bg-muted/50 p-2 rounded border">
                  {value || <span className="italic text-muted-foreground">(Vide)</span>}
                </div>
                <div>
                  <Select
                    value={mapping[value] || ""}
                    onValueChange={(val) => handleSelect(value, val as Category)}
                  >
                    <SelectTrigger className={!mapping[value] ? "border-red-200" : ""}>
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Category).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {tc("back")}
        </Button>
        <Button onClick={() => onConfirm(mapping)} disabled={!isComplete}>
          {tc("view")} <ArrowRight className="ml-2 h-4 w-4" /> {/* Or 'Suivant' */}
        </Button>
      </div>
    </div>
  );
}

