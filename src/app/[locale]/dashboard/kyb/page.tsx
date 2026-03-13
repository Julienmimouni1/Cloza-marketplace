import { auth } from "@/lib/auth";
import { redirect } from "@/navigation";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { DocumentUploadZone } from "@/features/identity/components/DocumentUploadZone";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function KybPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user) {
    redirect({ href: "/login", locale });
  }

  const documents = await prisma.kybDocument.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      status: true,
      originalName: true,
      createdAt: true
    }
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { kybStatus: true }
  });

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Account Verification</h1>
        <p className="text-gray-500 mt-2">To comply with regulations and ensure trust, we need to verify your business identity.</p>
      </div>

      <Card className="rounded-none border-zinc-200 shadow-sm bg-white">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
             <CardTitle className="font-serif text-xl">Upload Documents</CardTitle>
             <CardDescription>
                Please provide your Company Registration (K-bis) and a Proof of Identity.
                <br/>Files are encrypted and stored securely.
             </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
             <DocumentUploadZone 
                documents={documents} 
                kybStatus={user?.kybStatus || 'PENDING'} 
             />
        </CardContent>
      </Card>
    </div>
  );
}
