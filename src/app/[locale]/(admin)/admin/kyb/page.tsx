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
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-5xl font-black mb-3 text-black tracking-tight">{t("title")}</h1>
          <p className="text-zinc-700 font-bold text-xl">{t("subtitle")}</p>
        </div>
        <div className="bg-amber-50 text-amber-800 px-6 py-4 text-base font-black uppercase tracking-widest border-2 border-amber-200 shadow-sm flex items-center gap-3">
          <Clock className="h-6 w-6" />
          {t("requestsPending", { count: requests.length })}
        </div>
      </div>

      <Card className="rounded-none border-2 border-zinc-200 shadow-xl">
        <CardHeader className="border-b-2 border-zinc-100 bg-zinc-50 p-8">
          <CardTitle className="font-serif text-2xl font-black text-black">{t("queueTitle")}</CardTitle>
          <CardDescription className="text-zinc-600 font-bold text-base mt-1">{t("queuePriority")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
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
        </CardContent>
      </Card>
    </div>
  );
}
