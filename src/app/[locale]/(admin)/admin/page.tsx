import { getAdminStats } from "@/features/admin/actions/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  ShieldAlert, 
  MessageSquareWarning, 
  Users, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const t = await getTranslations("Admin.dashboard");
  const tc = await getTranslations("Common");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-5xl font-black mb-3 text-black tracking-tight">{t("title")}</h1>
        <p className="text-zinc-700 font-bold text-xl">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KpiCard 
          title={t("stats.totalGmv")} 
          value={formatCurrency(stats.gmv / 100)} 
          description={t("descriptions.gmvGrowth", { value: "12.5" })}
          icon={<TrendingUp className="h-6 w-6 text-emerald-700" />} 
        />
        <KpiCard 
          title={t("stats.commission")} 
          value="Paramètres" 
          description={t("descriptions.manageFees")}
          icon={<Banknote className="h-6 w-6 text-cloza-gold" />} 
          href="/admin/finance"
        />
        <KpiCard 
          title={t("stats.pendingKyb")} 
          value={stats.pendingKyb.toString()} 
          description={t("descriptions.awaitingVerification")}
          icon={<ShieldAlert className={`h-6 w-6 ${stats.pendingKyb > 0 ? "text-amber-600 animate-pulse" : "text-zinc-400"}`} />} 
          href="/admin/kyb"
        />
        <KpiCard 
          title={t("stats.openDisputes")} 
          value={stats.openDisputes.toString()} 
          description={t("descriptions.needsAttention")}
          icon={<MessageSquareWarning className={`h-6 w-6 ${stats.openDisputes > 0 ? "text-red-600" : "text-zinc-400"}`} />} 
          href="/admin/disputes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 rounded-none border-2 border-zinc-200 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b-2 border-zinc-100 p-8">
            <div>
              <CardTitle className="font-serif text-2xl font-black text-black">{t("recentOrders")}</CardTitle>
              <CardDescription className="text-zinc-600 font-bold text-base mt-1">{t("latestTransactions")}</CardDescription>
            </div>
            <Button asChild variant="outline" size="lg" className="rounded-none border-2 border-black font-black uppercase tracking-widest h-12">
              <Link href="/admin/orders">{t("viewAll")}</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-base">
                <thead>
                  <tr className="border-b-2 border-zinc-100 bg-zinc-50">
                    <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{tc("orderId")}</th>
                    <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{tc("customer")}</th>
                    <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{tc("amount")}</th>
                    <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{tc("status")}</th>
                    <th className="h-16 px-6 text-right align-middle font-black text-black uppercase text-xs tracking-widest">{tc("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="h-32 text-center align-middle text-zinc-500 font-bold italic text-lg">{t("noOrders")}</td>
                    </tr>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                        <td className="p-6 align-middle font-mono text-sm font-black text-zinc-900 uppercase tracking-tighter bg-zinc-50/50">#{order.id.slice(-8)}</td>
                        <td className="p-6 align-middle">
                          <div className="font-black text-black text-lg">{order.buyer.companyName || order.buyer.name}</div>
                        </td>
                        <td className="p-6 align-middle font-bold text-black text-lg">{formatCurrency(order.totalAmount / 100)}</td>
                        <td className="p-6 align-middle">
                           <span className={`inline-flex items-center px-4 py-1.5 text-xs font-black uppercase rounded-none border-2 ${
                             order.status === "PAID" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                           }`}>
                             {order.status}
                           </span>
                        </td>
                        <td className="p-6 align-middle text-right">
                          <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-zinc-100 border border-zinc-200 rounded-none">
                            <ArrowUpRight className="h-6 w-6 text-black" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Operational Tasks */}
        <Card className="rounded-none border-2 border-zinc-200 shadow-xl">
          <CardHeader className="border-b-2 border-zinc-100 p-8">
            <CardTitle className="font-serif text-2xl font-black text-black">{t("operationalTasks")}</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-base mt-1">{t("actionsAttention")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              <TaskItem 
                title={t("tasks.verifyKyb")} 
                count={stats.pendingKyb} 
                priority="HIGH" 
                href="/admin/kyb"
                icon={<ShieldAlert className="h-6 w-6" />}
                pendingText={t("itemsPending", { count: stats.pendingKyb })}
              />
              <TaskItem 
                title={t("tasks.resolveDisputes")} 
                count={stats.openDisputes} 
                priority="MEDIUM" 
                href="/admin/disputes"
                icon={<MessageSquareWarning className="h-6 w-6" />}
                pendingText={t("itemsPending", { count: stats.openDisputes })}
              />
              <TaskItem 
                title={t("tasks.updateFeatured")} 
                count={0} 
                priority="LOW" 
                href="/admin/cms"
                icon={<Clock className="h-6 w-6" />}
                pendingText={t("itemsPending", { count: 0 })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, description, icon, href }: { title: string; value: string; description: string; icon: React.ReactNode; href?: string }) {
  const content = (
    <Card className="rounded-none border-2 border-zinc-200 shadow-md hover:border-black transition-all group bg-white p-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 font-sans">{title}</p>
          <div className="p-3 bg-zinc-50 rounded-none group-hover:bg-zinc-100 transition-colors border border-zinc-100">{icon}</div>
        </div>
        <div className="space-y-2">
          <h3 className="text-4xl font-serif font-black tracking-tight text-black">{value}</h3>
          <p className="text-xs text-zinc-800 font-sans uppercase font-black tracking-wider bg-zinc-100 inline-block px-2 py-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function TaskItem({ title, count, priority, href, icon, pendingText }: { title: string; count: number; priority: "HIGH" | "MEDIUM" | "LOW"; href: string; icon: React.ReactNode; pendingText: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-none border shadow-sm ${
          priority === "HIGH" ? "bg-red-50 text-red-700 border-red-100" : 
          priority === "MEDIUM" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100"
        }`}>
          {icon}
        </div>
        <div>
          <p className="text-lg font-black text-black leading-tight mb-1">{title}</p>
          <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">{pendingText}</p>
        </div>
      </div>
      <div className={`text-xs font-black px-3 py-1.5 rounded-none border-2 shadow-sm ${
        priority === "HIGH" ? "border-red-600 text-red-700 bg-red-50" : 
        priority === "MEDIUM" ? "border-amber-600 text-amber-700 bg-amber-50" : "border-blue-600 text-blue-700 bg-blue-50"
      }`}>
        {priority}
      </div>
    </Link>
  );
}
