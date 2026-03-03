'use client';

import { useState, useTransition } from 'react';
import { uploadDocument, deleteDocument } from '../actions/upload-kyb';
import { toast } from 'sonner';
import { Loader2, Trash2, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define types locally or import from shared location. 
// Using local definition for component decoupling.
type KybDocument = {
  id: string;
  type: 'KBIS' | 'IDENTITY';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  originalName: string;
  createdAt: Date;
};

type Props = {
  documents: KybDocument[];
  kybStatus: string;
};

export function DocumentUploadZone({ documents, kybStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [uploadingType, setUploadingType] = useState<'KBIS' | 'IDENTITY' | null>(null);

  const kbisDoc = documents.find((d) => d.type === 'KBIS');
  const identityDoc = documents.find((d) => d.type === 'IDENTITY');

  const handleUpload = async (type: 'KBIS' | 'IDENTITY', file: File) => {
    if (!file) return;
    
    setUploadingType(type);
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    startTransition(async () => {
      const result = await uploadDocument(formData);
      setUploadingType(null);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
        const result = await deleteDocument(id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error.message);
        }
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
      const styles = {
          PENDING: "bg-yellow-100 text-yellow-800",
          IN_REVIEW: "bg-blue-100 text-blue-800",
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800"
      };
      const label = status.replace('_', ' ');
      return (
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", styles[status as keyof typeof styles] || "bg-gray-100")}>
              {label}
          </span>
      );
  };

  const UploadSection = ({ title, type, doc }: { title: string, type: 'KBIS' | 'IDENTITY', doc?: KybDocument }) => {
    const isUploading = isPending && uploadingType === type;

    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">PDF, JPG or PNG (Max 5MB)</p>
          </div>
          {doc && <StatusBadge status={doc.status} />}
        </div>

        {doc ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-white rounded border">
                    <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-gray-700">{doc.originalName}</p>
                    <p className="text-xs text-gray-400">{new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            
            {doc.status === 'PENDING' && (
                <button 
                    onClick={() => handleDelete(doc.id)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors disabled:opacity-50"
                    title="Delete document"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
            )}
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              id={`upload-${type}`}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(type, file);
                  e.target.value = ''; // Reset
              }}
              disabled={isPending}
            />
            <label 
                htmlFor={`upload-${type}`}
                className={cn(
                    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                    isUploading ? "opacity-50 cursor-not-allowed" : "border-gray-300"
                )}
            >
                {isUploading ? (
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                )}
                <span className="mt-2 text-sm text-gray-500">
                    {isUploading ? "Uploading..." : "Click to upload"}
                </span>
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Verification Documents</h2>
            <StatusBadge status={kybStatus} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
            <UploadSection title="Company Registration (K-bis)" type="KBIS" doc={kbisDoc} />
            <UploadSection title="Identity Proof" type="IDENTITY" doc={identityDoc} />
        </div>

        {kybStatus === 'IN_REVIEW' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="text-sm font-medium text-blue-900">Verification in Progress</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        Your documents have been submitted and are currently being reviewed by our team. 
                        This process typically takes 24-48 hours.
                    </p>
                </div>
            </div>
        )}
    </div>
  );
}
