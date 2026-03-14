import { getPendingKybRequests } from "@/features/admin/actions/kyb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function KybAdminPage() {
  const requests = await getPendingKybRequests();
  const t = await getTranslations("Admin.kyb");
  const tc = await getTranslations("Common");

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-black mb-2 md:mb-3 text-black tracking-tight uppercase">{t("title")}</h1>
          <p className="text-zinc-700 font-bold text-base md:text-xl italic">{t("subtitle")}</p>
        </div>
        <div className="bg-amber-50 text-amber-800 px-4 md:px-6 py-3 md:py-4 text-xs md:text-base font-black uppercase tracking-widest border-2 border-amber-200 shadow-sm flex items-center justify-center gap-2 md:gap-3 w-full md:w-auto">
          <Clock className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
          {t("requestsPending", { count: requests.length })}
        </div>
      </div>

      <Card className="rounded-none border-2 md:border-4 border-zinc-900 shadow-xl md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
        <CardHeader className="border-b-2 md:border-b-4 border-zinc-900 bg-zinc-50 p-6 md:p-8">
          <CardTitle className="font-serif text-xl md:text-2xl font-black text-black uppercase tracking-tight">{t("queueTitle")}</CardTitle>
          <CardDescription className="text-zinc-600 font-bold text-sm md:text-base mt-1 italic">{t("queuePriority")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="relative w-full overflow-auto hidden md:block">
            <table className="w-full caption-bottom text-base">
              <thead>
                <tr className="border-b-2 border-zinc-100 bg-zinc-100">
                  <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{tc("company")}</th>
                  <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">SIRET</th>
                  <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">Email</th>
                  <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{tc("date")}</th>
                  <th className="h-16 px-6 text-right align-middle font-black text-black uppercase text-xs tracking-widest">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-40 text-center align-middle text-zinc-500 font-bold italic text-lg">
                       <div className="flex flex-col items-center gap-3">
                         <ShieldCheck className="h-12 w-12 opacity-30 text-emerald-600" />
                         <p>{t("emptyQueue")}</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="p-6 align-middle">
                        <div className="font-black text-black text-lg mb-1">{request.companyName || "N/A"}</div>
                        <div className="text-xs text-zinc-500 uppercase font-sans font-black tracking-widest bg-zinc-100 inline-block px-2 py-0.5">{request.name}</div>
                      </td>
                      <td className="p-6 align-middle font-mono text-sm font-black text-zinc-900 bg-zinc-50/50">{request.siret || "N/A"}</td>
                      <td className="p-6 align-middle text-zinc-800 font-bold">{request.email}</td>
                      <td className="p-6 align-middle text-zinc-700 font-black">
                        {new Date(request.updatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-6 align-middle text-right">
                        <Button asChild variant="outline" size="lg" className="border-2 border-black hover:bg-black hover:text-white transition-all rounded-none font-black uppercase tracking-widest h-12">
                          <Link href={`/admin/kyb/${request.id}`} className="flex items-center gap-3">
                            {t("review")} <ArrowRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y-2 divide-zinc-100">
            {requests.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 font-bold italic bg-zinc-50">
                <ShieldCheck className="h-12 w-12 mx-auto opacity-30 text-emerald-600 mb-3" />
                {t("emptyQueue")}
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="p-5 space-y-4 bg-white hover:bg-zinc-50 transition-colors">
                  <div className="space-y-1">
                    <div className="text-xs text-zinc-500 font-black uppercase tracking-widest mb-1">{tc("company")}</div>
                    <div className="font-black text-black text-xl leading-tight uppercase">{request.companyName || "N/A"}</div>
                    <div className="text-sm text-zinc-700 font-bold italic">{request.name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 border border-zinc-200">
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">SIRET</div>
                      <div className="font-mono text-xs font-black text-zinc-900 truncate">{request.siret || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{tc("date")}</div>
                      <div className="text-xs font-black text-zinc-800 uppercase">
                        {new Date(request.updatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact Email</div>
                    <div className="text-sm font-bold text-black truncate">{request.email}</div>
                  </div>

                  <Button asChild className="w-full h-14 bg-black hover:bg-zinc-800 text-white rounded-none font-black uppercase tracking-widest text-base shadow-xl mt-2">
                    <Link href={`/admin/kyb/${request.id}`} className="flex items-center justify-center gap-3">
                      {t("review")} <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
