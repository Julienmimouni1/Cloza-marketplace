import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Package, Truck, AlertTriangle, Euro, LogOut, Plus, Store } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { ProductImportModal } from "@/features/vendor/components/ProductImportModal";
import { ExportReportsButton } from "@/features/vendor/components/ExportReportsButton";
import { getTranslations } from "next-intl/server";

async function getVendorStats(vendorId: string) {
  const orders = await prisma.subOrder.findMany({
    where: { vendorId },
    select: { totalAmount: true, status: true }
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING_CONFIRMATION').length;
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length;
  const disputeCount = 0; // Future implementation

  return { totalRevenue, pendingOrders, shippedOrders, disputeCount };
}

async function getRecentOrders(vendorId: string) {
  return await prisma.subOrder.findMany({
    where: { vendorId },
    orderBy: { parentOrder: { createdAt: 'desc' } },
    take: 5,
    include: {
      parentOrder: {
        select: { createdAt: true, buyer: { select: { companyName: true } } }
      },
      items: {
        include: { product: true }
      }
    }
  });
}

export default async function VendorDashboardPage() {
  const session = await auth();

  if (!session?.user?.vendorId) {
    redirect('/register?role=VENDOR');
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: session.user.vendorId }
  });

  if (!vendor) return <div>Vendor profile not found.</div>;

  const stats = await getVendorStats(vendor.id);
  const recentOrders = await getRecentOrders(vendor.id);
  
  const t = await getTranslations("Vendor.dashboard");
  const tc = await getTranslations("Common");

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 min-h-screen pb-20">
      <div className="flex flex-col gap-6">
        {/* Header with Title and Sign Out */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t("title")}</h1>
            <p className="text-slate-500 text-sm md:text-base">{t("welcome", { name: vendor.name })}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 h-8 px-2">
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t("signOut")}</span>
            </Button>
          </form>
        </div>

        {/* Main Actions Group */}
        <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 w-full">
          <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 h-12 px-6 shadow-sm shrink-0" asChild>
            <Link href="/vendor/products/new">
              <Plus className="mr-2 h-5 w-5" />
              {t("addProduct")}
            </Link>
          </Button>
          
          <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
            <Button variant="secondary" asChild className="h-12 flex-1 md:flex-none shrink-0">
              <Link href="/vendor/products">
                <Package className="mr-2 h-4 w-4" />
                {t("manageProducts")}
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-12 flex-1 md:flex-none shrink-0">
              <Link href="/vendor/integrations">
                <Store className="mr-2 h-4 w-4" />
                {t("integrations")}
              </Link>
            </Button>
          </div>

          {/* Utility Actions (Import/Export) */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto md:ml-auto">
            <div className="w-full md:w-auto">
              <ProductImportModal />
            </div>
            <div className="w-full md:w-auto">
              <ExportReportsButton label={t("exportReports")} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
            <Euro className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalRevenue / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-slate-500">{t("revenueGrowth", { value: "20.1" })}</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingOrders")}</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingOrders}</div>
            <p className="text-xs text-slate-500">{t("requiresAttention")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("shippedOrders")}</CardTitle>
            <Truck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.shippedOrders}</div>
            <p className="text-xs text-slate-500">{t("thisMonth")}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activeDisputes")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.disputeCount}</div>
            <p className="text-xs text-slate-500">{t("keepItZero")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-serif">{t("recentOrders")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6">{tc("orderId")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{tc("date")}</TableHead>
                  <TableHead>{tc("customer")}</TableHead>
                  <TableHead>{tc("status")}</TableHead>
                  <TableHead>{tc("total")}</TableHead>
                  <TableHead className="text-right pr-6">{tc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      {t("noRecentOrders")}
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-mono text-xs pl-6">{order.id.slice(-8)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-slate-600">{order.parentOrder.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium text-sm">
                        <div className="flex flex-col">
                          <span>{order.parentOrder.buyer.companyName || 'Unknown Company'}</span>
                          <span className="sm:hidden text-[10px] text-slate-400">{order.parentOrder.createdAt.toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'PENDING_CONFIRMATION' ? 'default' :
                          order.status === 'SHIPPED' ? 'secondary' : 'outline'
                        } className={
                          order.status === 'PENDING_CONFIRMATION' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-none' : 
                          order.status === 'SHIPPED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : ''
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">{(order.totalAmount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button size="sm" variant="ghost" asChild className="h-8 text-cloza-gold hover:text-amber-700 hover:bg-amber-50">
                          <Link href={`/vendor/orders/${order.id}`}>{t("manage")}</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
