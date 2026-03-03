"use client";

import { useState } from "react";
import { reviewKybRequest, getDecryptedDocument } from "@/features/admin/actions/kyb";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Download, 
  Eye, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Document {
  id: string;
  type: string;
  originalName: string;
  mimeType: string;
  status: string;
}

export function KybReviewActions({ userId, documents }: { userId: string; documents: Document[] }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const router = useRouter();

  const handleReview = async (status: "APPROVED" | "REJECTED") => {
    setIsReviewing(true);
    try {
      await reviewKybRequest(userId, status, status === "REJECTED" ? rejectionReason : undefined);
      toast.success(`Request ${status.toLowerCase()} successfully`);
      router.push("/admin/kyb");
    } catch (error) {
      toast.error("Failed to update request status");
    } finally {
      setIsReviewing(false);
      setIsRejectDialogOpen(false);
    }
  };

  const handleViewDocument = async (docId: string) => {
    setIsDecrypting(true);
    setViewingDocId(docId);
    try {
      const { content, mimeType, fileName } = await getDecryptedDocument(docId);
      
      // Create a blob from the base64 content
      const byteCharacters = atob(content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      // Create a URL and open in new tab
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      
      // Clean up (optional, might break if tab is still opening)
      // setTimeout(() => URL.revokeObjectURL(url), 10000);
      
    } catch (error) {
      toast.error("Failed to decrypt document");
      setViewingDocId(null);
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-zinc-200 p-4 flex items-center justify-between bg-white group hover:border-cloza-gold transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-50 text-zinc-400 group-hover:text-cloza-gold transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-tight">{doc.type}</p>
                <p className="text-[10px] text-zinc-400 truncate max-w-[150px]">{doc.originalName}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-none h-8"
              onClick={() => handleViewDocument(doc.id)}
              disabled={isDecrypting}
            >
              {isDecrypting && viewingDocId === doc.id ? (
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
              ) : (
                <Eye className="h-3 w-3 mr-2" />
              )}
              View
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-zinc-100">
        <Button 
          className="rounded-none bg-emerald-600 hover:bg-emerald-700 flex-1 h-12"
          onClick={() => handleReview("APPROVED")}
          disabled={isReviewing}
        >
          {isReviewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
          Approve Application
        </Button>
        <Button 
          variant="outline" 
          className="rounded-none border-red-200 text-red-600 hover:bg-red-50 flex-1 h-12"
          onClick={() => setIsRejectDialogOpen(true)}
          disabled={isReviewing}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject Application
        </Button>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="rounded-none border-zinc-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <AlertTriangle className="text-amber-500 h-5 w-5" />
              Reject Application
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for the rejection. This will be sent to the retailer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="e.g., Documents are blurry, SIRET mismatch..." 
              className="rounded-none border-zinc-200 focus-visible:ring-cloza-gold"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              className="rounded-none bg-red-600"
              onClick={() => handleReview("REJECTED")}
              disabled={!rejectionReason || isReviewing}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
