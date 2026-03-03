import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Package, ShoppingBag, CreditCard, TrendingUp, Truck, ChevronRight, Clock, AlertCircle, Settings, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getDashboardData } from "@/features/dashboard/actions/get-dashboard-data";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const data = await getDashboardData();
  
  // Fallback if data fetch fails (shouldn't happen for valid user)
  if (!data) return <div>Error loading dashboard</div>;

  const { user, financials, activeOrder, recentOrders } = data;

  return (
    <TooltipProvider>
      <div className="container py-8 md:py-12 max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900">
              Bon retour, <span className="text-cloza-gold">{user.name}</span>
            </h1>
            <p className="text-zinc-500 font-sans mt-1">Here is what's happening with your store today.</p>
          </div>
          <div className="flex gap-2">
             {/* Placeholder for future notifications/settings */}
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant="outline" size="sm" className="border-zinc-200 hover:bg-zinc-50 text-zinc-600">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </form>
          </div>
        </div>

        {user.isKybPending && (
          <div className="bg-amber-50 border border-amber-200 p-4 mb-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-600 h-5 w-5" />
              <p className="font-sans text-sm font-medium text-amber-900">
                Action Required: Complete your Business Verification (KYB) to unlock full purchasing power.
              </p>
            </div>
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-none rounded-sm">
              <Link href="/dashboard/kyb">Verify Now</Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* HERO: SHIPMENT TRACKER (Takes 2 columns) */}
          <Card className="lg:col-span-2 border-zinc-200 shadow-sm rounded-sm overflow-hidden flex flex-col">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-cloza-gold" /> 
                    {activeOrder ? "Active Shipment" : "No Active Shipments"}
                  </CardTitle>
                  {activeOrder && (
                     <CardDescription>Order #{activeOrder.id.slice(-8)} • {activeOrder.brand}</CardDescription>
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
                        <p className="text-sm text-zinc-500 mb-1">Estimated Arrival</p>
                        <p className="text-xl font-serif font-bold text-zinc-900">{activeOrder.eta}</p>
                        </div>
                        <Button variant="link" className="text-cloza-gold p-0 h-auto font-medium hover:text-amber-700">
                        View Tracking Details <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </>
              ) : (
                <div className="text-center text-zinc-400 py-8">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>All clear. No shipments currently in transit.</p>
                    <Button asChild variant="link" className="text-cloza-gold mt-2">
                        <Link href="/catalog">Start Shopping</Link>
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* FINANCIAL HEALTH (Takes 1 column) */}
          <div className="space-y-6">
             {/* Credit Card-style Widget */}
            <Card className="bg-zinc-900 text-white border-zinc-800 shadow-md rounded-lg overflow-hidden relative">
               <div className="absolute top-0 right-0 p-32 bg-cloza-gold/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
               <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <CreditCard className="h-6 w-6 text-cloza-gold" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium tracking-wider opacity-70">BNPL BALANCE</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-zinc-400 hover:text-white cursor-help transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] bg-zinc-800 border-zinc-700 text-zinc-100">
                          <p>Buy Now, Pay Later.</p>
                          <p className="mt-1 text-xs text-zinc-400">Achetez du stock maintenant et payez sous 60 jours pour préserver votre trésorerie.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl font-serif font-bold">€{financials.creditAvailable.toLocaleString()}</p>
                    <p className="text-sm text-zinc-400">Available from €{financials.creditLimit.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-4 overflow-hidden">
                    <div 
                      className="bg-cloza-gold h-full rounded-full" 
                      style={{ width: `${(financials.creditAvailable / financials.creditLimit) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-3">
                     <span>Next Payment</span>
                     <span className="text-white">{financials.nextPaymentDue}</span>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* LOWER SECTION: ORDERS & ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT ORDERS FEED */}
          <Card className="lg:col-span-2 border-zinc-200 shadow-sm rounded-sm">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/30 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg">Recent Orders</CardTitle>
              </div>
              <Link href="/dashboard/orders" className="text-sm font-medium text-cloza-gold hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                    {/* Visual Placeholder for Product/Brand */}
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
                       <span className={`text-xs px-2 py-1 rounded-full border ${
                          order.status === 'SHIPPED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                          'bg-zinc-50 text-zinc-600 border-zinc-100'
                       }`}>
                          {order.status}
                       </span>
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="h-4 w-4 text-zinc-400" />
                       </Button>
                    </div>
                  </div>
                )) : (
                    <div className="p-8 text-center text-zinc-400 text-sm">No recent orders found.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QUICK ACTIONS GRID */}
          <div className="grid grid-cols-2 gap-4">
             <ActionTile icon={<ShoppingBag />} label="New Arrivals" href="/new-arrivals" />
             <ActionTile icon={<Clock />} label="Order History" href="/dashboard/orders" />
             <ActionTile icon={<CreditCard />} label="Payments" href="/dashboard/payments" />
             <ActionTile icon={<Settings />} label="Settings" href="/dashboard/settings" />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function ActionTile({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full border-zinc-200 shadow-sm rounded-sm hover:border-cloza-gold hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
          <div className="text-zinc-400 group-hover:text-cloza-gold transition-colors">
            {icon}
          </div>
          <span className="font-sans text-sm font-medium text-zinc-700 group-hover:text-zinc-900">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}





