import { auth } from "@/lib/auth";
import { getDashboardData } from "@/features/dashboard/actions/get-dashboard-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, CreditCard, Truck, ChevronRight, Clock, AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData();
  const t = await getTranslations("Dashboard");

  if (!data) return <div>Error loading dashboard</div>;

  const { user, activeOrder, recentOrders } = data;

  return (
    <div className="container py-8 max-w-7xl px-4 md:px-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-zinc-900">
          {t("welcome", { name: session?.user?.name })}
        </h2>
        <p className="text-zinc-500 font-sans mt-1">{t("subtitle")}</p>
      </div>

      {user.isKybPending && (
        <div className="bg-amber-50 border border-amber-200 p-4 mb-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-600 h-5 w-5" />
            <p className="font-sans text-sm font-medium text-amber-900">
              {t("kybRequired")}
            </p>
          </div>
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-none rounded-sm">
            <Link href="/dashboard/kyb">{t("verifyNow")}</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* SHIPMENT TRACKER */}
        <Card className="lg:col-span-2 border-zinc-200 shadow-sm rounded-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-cloza-gold" /> 
                  {activeOrder ? t("activeShipment") : t("noActiveShipments")}
                </CardTitle>
                {activeOrder && (
                   <CardDescription>{t("orderNumber", { id: activeOrder.id.slice(-8) })} • {activeOrder.brand}</CardDescription>
                )}
              </div>
              {activeOrder && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  {activeOrder.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-8 flex-1 flex flex-col justify-center">
            {activeOrder ? (
              <>
                  {/* Timeline Visual */}
                  <div className="relative mb-8 px-4">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 rounded-full" />
                      <div 
                      className="absolute top-1/2 left-0 h-1 bg-cloza-gold -translate-y-1/2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${activeOrder.progress}%` }} 
                      />
                      <div className="relative flex justify-between w-full">
                      {activeOrder.steps.map((step, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 group">
                          <div className={`w-4 h-4 rounded-full border-2 z-10 transition-colors ${
                              step.completed 
                              ? "bg-cloza-gold border-cloza-gold" 
                              : "bg-white border-zinc-300"
                          }`} />
                          <div className="text-center absolute top-6 w-32 -ml-[calc(50%-0.5rem)] md:relative md:top-0 md:ml-0 md:w-auto">
                              <p className={`text-xs font-bold ${step.completed ? "text-zinc-900" : "text-zinc-400"}`}>{step.label}</p>
                              <p className="text-[10px] text-zinc-400">{step.date}</p>
                          </div>
                          </div>
                      ))}
                      </div>
                  </div>
                  
                  <div className="flex justify-between items-end px-4 mt-4">
                      <div>
                      <p className="text-sm text-zinc-500 mb-1">{t("estimatedArrival")}</p>
                      <p className="text-xl font-serif font-bold text-zinc-900">{activeOrder.eta}</p>
                      </div>
                      <Button variant="link" className="text-cloza-gold p-0 h-auto font-medium hover:text-amber-700">
                      {t("viewTracking")} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                  </div>
              </>
            ) : (
              <div className="text-center text-zinc-400 py-8">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>{t("noActiveShipments")}</p>
                  <Button asChild variant="link" className="text-cloza-gold mt-2">
                      <Link href="/catalog">{t("startShopping")}</Link>
                  </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 gap-4">
           <ActionTile icon={<ShoppingBag />} label={t("menu.home")} href="/dashboard" />
           <ActionTile icon={<Clock />} label={t("menu.orders")} href="/dashboard/orders" />
           <ActionTile icon={<CreditCard />} label={t("menu.payments")} href="/dashboard/payments" />
           <ActionTile icon={<Settings />} label={t("menu.settings")} href="/dashboard/settings" />
        </div>
      </div>

      {/* RECENT ORDERS FEED */}
      <Card className="border-zinc-200 shadow-sm rounded-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/30 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-serif text-lg">{t("recentOrders")}</CardTitle>
          </div>
          <Link href="/dashboard/orders" className="text-sm font-medium text-cloza-gold hover:underline">
            {t("viewAll")}
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                <div className="h-12 w-12 rounded-sm flex-shrink-0 relative overflow-hidden bg-zinc-100 border border-zinc-200">
                     {order.img.startsWith('http') ? (
                         <Image src={order.img} alt={order.brand} fill className="object-cover" />
                     ) : (
                         <div className="flex items-center justify-center h-full w-full text-zinc-400">
                             <Package className="h-5 w-5" />
                         </div>
                     )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-zinc-900 truncate">{order.brand}</h4>
                  <p className="text-xs text-zinc-500">
                    {order.date} • {order.items} Items • <span className="font-medium text-zinc-700">{order.total}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                   <Badge variant="outline" className={
                      order.status === 'SHIPPED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                      'bg-zinc-50 text-zinc-600 border-zinc-100'
                   }>
                      {order.status}
                   </Badge>
                   <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <ChevronRight className="h-4 w-4 text-zinc-400" />
                      </Link>
                   </Button>
                </div>
              </div>
            )) : (
                <div className="p-8 text-center text-zinc-400 text-sm">{t("noRecentOrders")}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionTile({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full border-zinc-200 shadow-sm rounded-sm hover:border-cloza-gold hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
          <div className="text-zinc-400 group-hover:text-cloza-gold transition-colors">
            {icon}
          </div>
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-700 group-hover:text-zinc-900">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}






