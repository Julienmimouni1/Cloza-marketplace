import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  const vendor = await prisma.vendor.findUnique({
    where: { id },
    select: { userId: true, name: true }
  });

  if (!vendor) {
    notFound();
  }

  if (vendor.userId) {
    redirect(`/admin/users/${vendor.userId}`);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Legacy Vendor Detected</h1>
      <p className="mt-2">Vendor <strong>{vendor.name}</strong> ({id}) is not linked to a User account.</p>
      <p className="mt-1">Please manually link this vendor to a user in the database or contact support.</p>
    </div>
  );
}
