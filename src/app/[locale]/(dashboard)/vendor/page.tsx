import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/lib/auth';
import { redirect } from '@/navigation';
import { getLocale } from 'next-intl/server';
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
import { Package, Truck, AlertTriangle, Euro, LogOut } from 'lucide-react';
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
  const locale = await getLocale();

  if (!session?.user?.vendorId) {
    redirect({ href: '/register?role=VENDOR', locale });
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
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">{t("title")}</h1>
          <p className="text-slate-500">{t("welcome", { name: vendor.name })}</p>
        </div>
        <div className="flex gap-2">
          <ProductImportModal />
          <ExportReportsButton label={t("exportReports")} />
          <Button variant="outline" asChild>
            <Link href="/vendor/integrations">{t("integrations")}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/vendor/products">{t("manageProducts")}</Link>
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700" asChild>
            <Link href="/vendor/products/new">{t("addProduct")}</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant="ghost" className="text-slate-500 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              {t("signOut")}
            </Button>
          </form>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
            <Euro className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalRevenue / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-slate-500">{t("revenueGrowth", { value: "20.1" })}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingOrders")}</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingOrders}</div>
            <p className="text-xs text-slate-500">{t("requiresAttention")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("shippedOrders")}</CardTitle>
            <Truck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.shippedOrders}</div>
            <p className="text-xs text-slate-500">{t("thisMonth")}</p>
          </CardContent>
        </Card>

        <Card>
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
      <Card>
        <CardHeader>
          <CardTitle>{t("recentOrders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tc("orderId")}</TableHead>
                <TableHead>{tc("date")}</TableHead>
                <TableHead>{tc("customer")}</TableHead>
                <TableHead>{tc("status")}</TableHead>
                <TableHead>{tc("total")}</TableHead>
                <TableHead className="text-right">{tc("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(-8)}</TableCell>
                  <TableCell>{order.parentOrder.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{order.parentOrder.buyer.companyName || 'Unknown Company'}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'PENDING_CONFIRMATION' ? 'default' :
                      order.status === 'SHIPPED' ? 'secondary' : 'outline'
                    } className={
                      order.status === 'PENDING_CONFIRMATION' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 
                      order.status === 'SHIPPED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : ''
                    }>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{(order.totalAmount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/vendor/orders/${order.id}`}>{t("manage")}</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
