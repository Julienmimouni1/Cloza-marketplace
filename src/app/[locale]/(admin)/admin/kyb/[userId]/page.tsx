import { getKybRequestDetails } from "@/features/admin/actions/kyb";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Building2, MapPin, Globe, Fingerprint } from "lucide-react";
import { KybReviewActions } from "@/features/admin/components/kyb/KybReviewActions";

export default async function KybDetailPage({ params }: { params: { userId: string } }) {
  const user = await getKybRequestDetails(params.userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-8">
      <Button asChild variant="link" className="px-0 text-zinc-500 hover:text-black transition-colors mb-4">
        <Link href="/admin/kyb" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back to Queue
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Review Application</h1>
          <p className="text-zinc-500 font-sans uppercase text-[10px] font-bold tracking-widest">
            Retailer Verification Case ID: {user.id.slice(-12).toUpperCase()}
          </p>
        </div>
        <div className="bg-cloza-gold/10 border border-cloza-gold/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cloza-gold">
          Status: {user.kybStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Identity */}
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-none border-zinc-200 shadow-none">
            <CardHeader className="border-b border-zinc-50">
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cloza-gold" />
                Company Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <InfoItem label="Legal Name" value={user.companyName || "N/A"} />
                <InfoItem label="SIRET" value={user.siret || "N/A"} icon={<Fingerprint className="h-3 w-3" />} />
                <InfoItem label="VAT Number" value={user.vatNumber || "N/A"} />
                <InfoItem label="Contact Name" value={user.name || "N/A"} />
                <InfoItem label="Email Address" value={user.email} />
                <div className="sm:col-span-2">
                   <InfoItem 
                    label="Address" 
                    value={`${user.address || ""}, ${user.zipCode || ""} ${user.city || ""}`} 
                    icon={<MapPin className="h-3 w-3" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-zinc-200 shadow-none">
            <CardHeader className="border-b border-zinc-50">
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-cloza-gold" />
                Legal Documents
              </CardTitle>
              <CardDescription>
                Click to decrypt and view original files in a secure tab.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
               <KybReviewActions userId={user.id} documents={user.documents} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <Card className="rounded-none border-zinc-200 shadow-none bg-zinc-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">Retailer Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Account Created</p>
                  <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
               </div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Previous History</p>
                  <p className="text-sm font-medium italic text-zinc-500">New User (0 Orders)</p>
               </div>
            </CardContent>
          </Card>

          <div className="p-4 border border-zinc-200 text-xs text-zinc-500 space-y-3">
             <div className="flex items-start gap-2">
                <ShieldCheck className="h-3 w-3 text-emerald-600 mt-0.5" />
                <p>Documents are encrypted on disk (AES-256). Decryption is logged for audit.</p>
             </div>
             <div className="flex items-start gap-2">
                <ShieldCheck className="h-3 w-3 text-emerald-600 mt-0.5" />
                <p>Approval will grant the user **RETAILER** privileges and BNPL access.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-sm font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
