"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function IntegrationStatusBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("integration");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setVisible(true);
      // Optional: Clear the param after some time?
      // For now, let's leave it to show the permanent success state until navigation.
      
      // Force a router refresh to ensure the list is updated
      router.refresh();
      
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        // Clean URL
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("integration");
        router.replace(`?${newParams.toString()}`);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status, router, searchParams]);

  if (!visible) return null;

  return (
    <div className="mb-6 animate-in slide-in-from-top-2 fade-in">
      <Alert className="border-green-500 bg-green-50 text-green-900">
        <div className="flex items-center gap-2">
           <Loader2 className="h-4 w-4 animate-spin text-green-600" />
           <AlertTitle>Synchronization Started</AlertTitle>
        </div>
        <AlertDescription className="ml-6">
          Importing products... Your catalog will appear shortly.
        </AlertDescription>
      </Alert>
    </div>
  );
}
