import { auth } from "@/lib/auth";
import { redirect } from "@/navigation";
import { getLocale } from "next-intl/server";
import { getDashboardData } from "@/features/dashboard/actions/get-dashboard-data";
import { DashboardNav } from "./_components/DashboardNav";
import { CreditCard, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getTranslations } from "next-intl/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const locale = await getLocale(); // ← récupère la locale active

  if (!session?.user) {
    redirect({ href: "/login", locale }); // ← objet avec locale
  }

  const data = await getDashboardData();
  if (!data) return null;

  const { financials } = data;
  const t = await getTranslations("Dashboard");

  return (
    <div className="min-h-screen bg-zinc-50/30">
      {/* Dashboard Sub-Header with Financial Summary */}
      <div className="bg-white border-b border-zinc-100 py-6 md:py-8">
        <div className="container max-w-7xl px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-zinc-900">
              {t("title")}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{t("subtitle")}</p>
          </div>

          {/* Persistent BNPL Balance Widget - Refocused on Used Amount */}
          <div className="flex items-center gap-4 bg-zinc-900 text-white p-4 rounded-lg shadow-sm min-w-[300px] relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
             <div className="absolute top-0 right-0 p-16 bg-cloza-gold/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-cloza-gold/20 transition-colors" />
             
             <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-cloza-gold transition-colors">
                <CreditCard className="h-5 w-5 text-cloza-gold" />
             </div>

             <div className="flex-1 relative z-10">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{t("bnplBalance")}</span>
                   <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-zinc-500 hover:text-white cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-800 border-zinc-700 text-zinc-100 text-[11px] p-2">
                        <p>Buy Now, Pay Later (60 days).</p>
                      </TooltipContent>
                    </Tooltip>
                   </TooltipProvider>
                </div>
                <div className="flex items-baseline gap-2">
                   <p className="text-xl font-serif font-bold text-white">
                      €{financials.creditUsed.toLocaleString()}
                   </p>
                   <p className="text-[10px] text-zinc-500 font-medium">
                      {t("usedAmount")}
                   </p>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                   <div 
                      className="bg-cloza-gold h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${(financials.creditUsed / financials.creditLimit) * 100}%` }}
                   />
                </div>
                <p className="text-[9px] text-zinc-500 mt-1.5 flex justify-between">
                   <span>{t("availableFrom", { total: `€${financials.creditLimit.toLocaleString()}` })}</span>
                   <span className="text-zinc-400">Next: {financials.nextPaymentDue}</span>
                </p>
             </div>
          </div>
        </div>
      </div>

      <DashboardNav />

      <main className="pb-20">
        {children}
      </main>
    </div>
  );
}
