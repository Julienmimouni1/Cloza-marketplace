import { getUserDetails } from "@/features/admin/actions/users";
import { getVendorStats } from "@/features/admin/actions/vendors";
import { getFinanceData } from "@/features/admin/actions/finance";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VendorCommissionForm } from "@/features/admin/components/VendorCommissionForm";
import { VendorBillingForm } from "@/features/admin/components/vendors/VendorBillingForm";
import { VendorShippingForm } from "@/features/admin/components/vendors/VendorShippingForm";
import { CreateVendorProfile } from "@/features/admin/components/vendors/CreateVendorProfile";
import { VendorIdentityForm } from "@/features/admin/components/vendors/VendorIdentityForm";
import { FinancialSnapshot } from "@/features/admin/components/vendors/FinancialSnapshot";
import { VendorProductsTable } from "@/features/admin/components/vendors/VendorProductsTable";
import { VendorStatusSwitch } from "@/features/admin/components/vendors/VendorStatusSwitch";
import { CommissionExceptionsManager } from "@/features/admin/components/finance/CommissionExceptionsManager";
import { PayoutControlCenter } from "@/features/admin/components/finance/PayoutControlCenter";
import { RevenueSimulator } from "@/features/admin/components/finance/RevenueSimulator";
import { Button } from "@/components/ui/button";
import { ExternalLink, User as UserIcon, Building, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: Props) {
  const { id } = await params;
  const data = await getUserDetails(id);

  if (!data) {
    return notFound();
  }

  const { user, globalRate } = data;
  const hasVendorProfile = !!user.vendor;
  
  // Parallel data fetching for vendor specifics
  const [vendorStats, financeData] = hasVendorProfile && user.vendor 
    ? await Promise.all([
        getVendorStats(user.vendor.id),
        getFinanceData(user.vendor.id)
      ])
    : [null, null];

  const t = await getTranslations("Admin.users.details");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
            <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
            {user.name || "Anonymous"}
            <Badge variant={user.role === "VENDOR" ? "default" : "secondary"}>{user.role}</Badge>
            </h1>
            <p className="text-zinc-500 font-sans">{user.email} • {user.id}</p>
        </div>
        {user.kybStatus === "APPROVED" && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 text-sm font-bold border border-emerald-100">
                <ShieldCheck className="h-4 w-4" /> {t("header.kybApproved")}
            </div>
        )}
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-zinc-200 bg-transparent p-0 h-auto flex-wrap">
          <TabsTrigger 
            value="identity" 
            className="rounded-none border-b-2 border-transparent px-4 py-2 font-serif data-[state=active]:border-black data-[state=active]:bg-transparent"
          >
            {t("tabs.identity")}
          </TabsTrigger>
          <TabsTrigger 
            value="finance" 
            className="rounded-none border-b-2 border-transparent px-4 py-2 font-serif data-[state=active]:border-black data-[state=active]:bg-transparent"
          >
            {t("tabs.finance")}
          </TabsTrigger>
          <TabsTrigger 
            value="logistics" 
            className="rounded-none border-b-2 border-transparent px-4 py-2 font-serif data-[state=active]:border-black data-[state=active]:bg-transparent"
          >
            {t("tabs.logistics")}
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="rounded-none border-b-2 border-transparent px-4 py-2 font-serif data-[state=active]:border-black data-[state=active]:bg-transparent"
          >
            {t("tabs.products")}
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="rounded-none border-b-2 border-transparent px-4 py-2 font-serif data-[state=active]:border-black data-[state=active]:bg-transparent"
          >
            {t("tabs.settings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="pt-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-none shadow-none border-zinc-200 md:col-span-2">
                <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {t("identity.corporateTitle")}
                </CardTitle>
                <CardDescription>{t("identity.corporateDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                {hasVendorProfile ? (
                    <VendorIdentityForm 
                        vendorId={user.vendor!.id}
                        initialData={{
                            name: user.vendor!.name,
                            companyName: user.companyName,
                            siret: user.siret,
                            vatNumber: user.vatNumber
                        }}
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-zinc-500">{t("identity.company")}</span> {user.companyName || "-"}</div>
                            <div><span className="text-zinc-500">{t("identity.siret")}</span> {user.siret || "-"}</div>
                            <div><span className="text-zinc-500">{t("identity.vat")}</span> {user.vatNumber || "-"}</div>
                        </div>
                        <p className="text-xs text-zinc-500 italic">{t("identity.promoteHint")}</p>
                    </div>
                )}
                </CardContent>
            </Card>

            <Card className="rounded-none shadow-none border-zinc-200">
                <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    {t("identity.userTitle")}
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{t("identity.fullName")}</div>
                        <div className="font-medium">{user.name || "-"}</div>
                    </div>
                    <div>
                        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{t("identity.email")}</div>
                        <div className="font-medium">{user.email}</div>
                    </div>
                    <div>
                        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{t("identity.kybStatus")}</div>
                        <Badge variant="outline" className="mt-1">{user.kybStatus}</Badge>
                    </div>
                    <div>
                        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{t("identity.joined")}</div>
                        <div className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="pt-6">
          {hasVendorProfile && user.vendor && financeData ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <FinancialSnapshot gmv={vendorStats?.gmv || 0} orderCount={vendorStats?.orderCount || 0} />
                </div>
                <div className="w-full md:w-80">
                    <RevenueSimulator rate={user.vendor.commissionRate ?? globalRate} />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 h-full">
                 {/* Column 1: Base Settings */}
                 <div className="space-y-6">
                    <Card className="rounded-none shadow-none border-zinc-200 h-full">
                        <CardHeader>
                            <CardTitle className="font-serif">{t("finance.baseCommission")}</CardTitle>
                            <CardDescription>{t("finance.baseCommissionDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <VendorCommissionForm 
                            vendorId={user.vendor.id} 
                            currentRate={user.vendor.commissionRate}
                            globalRate={globalRate}
                            />
                        </CardContent>
                    </Card>
                 </div>

                 {/* Column 2: Exceptions */}
                 <div className="h-full">
                    <CommissionExceptionsManager 
                        vendorId={user.vendor.id} 
                        exceptions={financeData.exceptions} 
                    />
                 </div>

                 {/* Column 3: Payouts */}
                 <div className="h-full">
                    <PayoutControlCenter 
                        vendorId={user.vendor.id} 
                        initialSettings={financeData.payoutSettings}
                    />
                 </div>
              </div>

              {/* Billing Info at the bottom */}
              <Card className="rounded-none shadow-none border-zinc-200">
                  <CardHeader>
                    <CardTitle className="font-serif">{t("finance.bankingTitle")}</CardTitle>
                    <CardDescription>{t("finance.bankingDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VendorBillingForm 
                      vendorId={user.vendor.id} 
                      initialData={user.vendor.billingInfo} 
                    />
                  </CardContent>
                </Card>
            </div>
          ) : (
            <CreateVendorProfile userId={user.id} userName={user.name || "Vendor"} />
          )}
        </TabsContent>

        <TabsContent value="logistics" className="pt-6">
           {hasVendorProfile && user.vendor ? (
               <Card className="rounded-none shadow-none border-zinc-200 max-w-2xl">
                  <CardHeader>
                    <CardTitle className="font-serif">{t("logistics.shippingTitle")}</CardTitle>
                    <CardDescription>{t("logistics.shippingDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VendorShippingForm 
                      vendorId={user.vendor.id} 
                      initialData={user.vendor.shippingInfo} 
                    />
                  </CardContent>
                </Card>
           ) : (
             <CreateVendorProfile userId={user.id} userName={user.name || "Vendor"} />
           )}
        </TabsContent>

        <TabsContent value="products" className="pt-6">
           {hasVendorProfile && user.vendor ? (
               <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-serif font-bold">{t("products.catalogTitle")}</h2>
                        <p className="text-sm text-zinc-500">{t("products.catalogDesc")}</p>
                    </div>
                    <Button asChild variant="outline" className="rounded-none">
                        <Link href={`/admin/products?vendor=${user.vendor.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t("products.advancedManager")}
                        </Link>
                    </Button>
                </div>
                
                <VendorProductsTable vendorId={user.vendor.id} />
               </div>
           ) : (
             <CreateVendorProfile userId={user.id} userName={user.name || "Vendor"} />
           )}
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
           {hasVendorProfile && user.vendor ? (
               <div className="max-w-2xl">
                    <VendorStatusSwitch 
                        vendorId={user.vendor.id} 
                        isFeatured={user.vendor.isFeatured} 
                    />
               </div>
           ) : (
             <Card className="rounded-none shadow-none border-zinc-200">
                <CardHeader>
                    <CardTitle className="font-serif">{t("settings.accountTitle")}</CardTitle>
                    <CardDescription>{t("settings.accountDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-500 italic">{t("settings.comingSoon")}</p>
                </CardContent>
            </Card>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
