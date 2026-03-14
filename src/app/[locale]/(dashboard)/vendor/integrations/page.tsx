import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/navigation";
import { getLocale } from "next-intl/server";
import { IntegrationsList } from "@/features/vendor/components/IntegrationsList";
import { AddIntegrationDialog } from "@/features/vendor/components/AddIntegrationDialog";
import { IntegrationStatusBanner } from "@/components/vendor/integrations/integration-status-banner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const locale = await getLocale();
  if (!session?.user?.id) redirect({ href: "/login", locale });

  // Await searchParams before access
  const params = await searchParams;

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return <div>Vous n'avez pas de profil vendeur.</div>;
  }

  // Fetch integrations for the vendor
  const integrations = await prisma.externalIntegration.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-slate-500">
          <Link href="/vendor">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Intégrations & Connecteurs</h1>
            <p className="text-slate-500 text-sm">Connectez vos boutiques externes pour synchroniser vos produits.</p>
          </div>
          <div className="w-full sm:w-auto">
            <AddIntegrationDialog />
          </div>
        </div>
      </div>

      <IntegrationStatusBanner />
      <IntegrationsList integrations={integrations} />
    </div>
  );
}