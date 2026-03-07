"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  action: () => Promise<{ csvData?: string; filename?: string; error?: string }>;
  label: string;
  className?: string;
  variant?: "outline" | "default" | "secondary" | "ghost";
}

export function ExportButton({ action, label, className, variant = "outline" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await action();
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.csvData && result.filename) {
        // Create a blob and trigger download
        const blob = new Blob([result.csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", result.filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Fichier exporté avec succès");
      }
    } catch (err) {
      console.error("Export Error:", err);
      toast.error("Une erreur est survenue lors de l'export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleExport} 
      disabled={isExporting}
      className={cn("h-12 px-6 font-bold shadow-sm transition-all flex items-center gap-2", className)}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-cloza-gold" />
          Génération...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
