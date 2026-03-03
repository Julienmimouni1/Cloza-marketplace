"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { getVendorOrdersReport } from "../actions";
import { toast } from "sonner";

interface ExportReportsButtonProps {
  label: string;
}

export function ExportReportsButton({ label }: ExportReportsButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await getVendorOrdersReport();

      if (!response.success) {
        toast.error(response.error.message || "Erreur lors de l'export");
        return;
      }

      if (!response.data || response.data.length === 0) {
        toast.info("Aucune donnée à exporter");
        return;
      }

      // Prepare CSV content
      const headers = [
        "Date",
        "Commande ID",
        "Client",
        "Produit",
        "SKU",
        "Quantité",
        "Prix Unitaire HT (cts)",
        "Total HT (cts)",
        "Commission (cts)",
        "Net Vendeur (cts)",
        "Statut"
      ];

      const csvContent = [
        headers.join(","),
        ...response.data.map((item) => [
          item.date.toISOString().split("T")[0],
          item.orderId,
          `"${item.customer.replace(/"/g, '""')}"`,
          `"${item.productName.replace(/"/g, '""')}"`,
          item.sku,
          item.quantity,
          item.priceAtPurchase,
          item.totalHt,
          item.commissionAmount,
          item.netAmount,
          item.status
        ].join(","))
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `rapport-ventes-${timestamp}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Rapport exporté avec succès");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport} 
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
