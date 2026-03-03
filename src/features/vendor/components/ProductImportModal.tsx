"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileUp, CheckCircle, AlertCircle, Loader2, Download, ArrowLeft } from "lucide-react";
import { bulkCreateProducts, BulkImportResult } from "../actions";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CsvColumnMapper, ColumnMapping } from "./CsvColumnMapper";
import { CategoryMapper } from "./CategoryMapper";
import { Category } from "@/generated/client";
import { CsvRow } from "../logic/csv-transformer";
import { useTranslations } from "next-intl";

export function ProductImportModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rawParsedData, setRawParsedData] = useState<CsvRow[]>([]);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]); // Transformed data is still mostly CsvRow structure until final submit

  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [step, setStep] = useState<"upload" | "mapping" | "category_mapping" | "preview" | "result">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const router = useRouter();
  
  const t = useTranslations("Vendor.products.import");
  const tc = useTranslations("Common");

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.meta.fields) {
            setCsvHeaders(results.meta.fields);
            setRawParsedData(results.data as CsvRow[]);
            setStep("mapping");
          } else {
            toast.error(tc("error"));
          }
        },
        error: (error) => {
          toast.error(tc("error"));
          console.error(error);
        },
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
  });

  const handleMappingConfirm = (mapping: ColumnMapping) => {
    setColumnMapping(mapping);
    
    // Check for category mapping
    const categoryHeader = mapping["category"];
    if (categoryHeader) {
      const unique = Array.from(new Set(rawParsedData.map(row => row[categoryHeader]).filter(Boolean)));
      setUniqueCategories(unique as string[]);
      setStep("category_mapping");
    } else {
      // If no category mapped, proceed to transform
      transformAndPreview(mapping, {});
    }
  };

  const handleCategoryMappingConfirm = (catMapping: Record<string, Category>) => {
    transformAndPreview(columnMapping, catMapping);
  };

  const transformAndPreview = (colMap: ColumnMapping, catMap: Record<string, Category>) => {
    const categoryHeader = colMap["category"];
    
    // Auto-detect Shopify Variant Columns (heuristics)
    // We look at the FIRST row to find headers like "Option1 Value"
    const sampleRow = rawParsedData[0] || {};
    const variantHeaders = Object.keys(sampleRow).filter(k => /^Option\d+ Value$/.test(k));

    const transformed = rawParsedData.map(row => {
      const newRow: any = {};
      Object.entries(colMap).forEach(([schemaKey, csvHeader]) => {
        if (csvHeader && row[csvHeader] !== undefined) {
          // Special handling for category
          if (schemaKey === "category" && categoryHeader) {
             const csvValue = row[categoryHeader];
             newRow[schemaKey] = catMap[csvValue] || csvValue;
          } else {
             newRow[schemaKey] = row[csvHeader];
          }
        }
      });

      // Append variants to name if mapped name exists and variants detected
      if (newRow.name && variantHeaders.length > 0) {
         const variants = variantHeaders.map(h => row[h]).filter(Boolean);
         if (variants.length > 0) {
             newRow.name = `${newRow.name} - ${variants.join(" / ")}`;
         }
      }

      return newRow;
    });

    setParsedData(transformed);
    setStep("preview");
  };

  const handleImport = async () => {
    if (!parsedData.length) return;

    setIsUploading(true);
    try {
      const response = await bulkCreateProducts(parsedData);
      
      if (response.success) {
        if (response.data) {
          setResult(response.data);
          setStep("result");
          if (response.data.errorCount === 0) {
            toast.success(t("result.imported") + `: ${response.data.successCount}`);
          } else {
            toast.warning(t("result.errors") + `: ${response.data.errorCount}`);
          }
        }
      } else {
        toast.error(response.error?.message || tc("error"));
      }
    } catch (error) {
      toast.error(tc("error"));
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setRawParsedData([]);
    setParsedData([]);
    setCsvHeaders([]);
    setResult(null);
    setStep("upload");
    setColumnMapping({});
    setUniqueCategories([]);
  };

  useEffect(() => {
    console.log("ProductImportModal mounted");
  }, []);

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) reset(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
          <Upload className="h-4 w-4" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {step === "upload" && t("description")}
            {step === "mapping" && t("mappingDescription")}
            {step === "category_mapping" && t("categoryMappingDescription")}
            {step === "preview" && t("previewDescription")}
            {step === "result" && t("resultDescription")}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
                ${file ? "bg-muted/30" : ""}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-muted rounded-full">
                   <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{t("dropzone.title")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("dropzone.subtitle")}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t("dropzone.limits")}</p>
              </div>
            </div>
          </div>
        )}

        {step === "mapping" && (
          <CsvColumnMapper 
            csvHeaders={csvHeaders}
            onConfirm={handleMappingConfirm}
            onCancel={reset}
          />
        )}

        {step === "category_mapping" && (
          <CategoryMapper 
            uniqueValues={uniqueCategories}
            onConfirm={handleCategoryMappingConfirm}
            onCancel={() => setStep("mapping")}
          />
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
              <FileUp className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-muted-foreground">{t("preview.readyToImport", { count: parsedData.length })}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                {tc("cancel")}
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="bg-muted px-4 py-2 text-sm font-medium border-b flex justify-between">
                 <span>{t("preview.previewTitle")}</span>
              </div>
              <div className="p-4 space-y-4">
                {parsedData.slice(0, 3).map((p, i) => (
                  <div key={i} className="text-sm grid grid-cols-2 gap-2 border-b last:border-0 pb-2 last:pb-0">
                    <div><span className="font-semibold">{tc("name")}:</span> {p.name}</div>
                    <div><span className="font-semibold">{tc("price")}:</span> {p.priceHt}€</div>
                    <div><span className="font-semibold">{tc("category")}:</span> {p.category}</div>
                    <div><span className="font-semibold">Sous-catégorie:</span> {p.subCategory || "-"} / {p.leafCategory || "-"}</div>
                    <div className="col-span-2 text-muted-foreground truncate">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "result" && result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-3xl font-bold text-green-700">{result.successCount}</span>
                <span className="text-sm text-green-600 font-medium">{t("result.imported")}</span>
              </div>
              <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
                <span className="text-3xl font-bold text-red-700">{result.errorCount}</span>
                <span className="text-sm text-red-600 font-medium">{t("result.errors")}</span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-red-50 px-4 py-3 text-sm font-medium border-b border-red-100 text-red-800">
                  {t("result.errorReport")}
                </div>
                <ScrollArea className="h-[200px] bg-white">
                  <div className="divide-y">
                    {result.errors.map((err, i) => (
                      <div key={i} className="p-3 text-sm flex gap-3 hover:bg-muted/30">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">{t("result.row", { row: err.row })} {err.sku && `(SKU: ${err.sku})`}</p>
                          <p className="text-muted-foreground mt-0.5">{err.error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {step === "preview" && (
            <>
              <Button variant="ghost" onClick={() => setStep("category_mapping")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {tc("back")}
              </Button>
              <Button onClick={handleImport} disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("preview.launch")}
              </Button>
            </>
          )}
          {step === "result" && (
            <Button onClick={() => { setOpen(false); router.push("/vendor/products"); }}>
              {t("result.viewProducts")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
