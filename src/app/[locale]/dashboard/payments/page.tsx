import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, History, Calendar, AlertCircle, Download, FileText, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPaymentsData } from "@/features/dashboard/actions/get-payments-data";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ExportButton } from "../_components/ExportButton";
import { exportPaymentsToCsv } from "@/features/dashboard/actions/export-actions";

export default async function PaymentsPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard");
  const data = await getPaymentsData();

  if (!data) return <div>Erreur de chargement des données de paiement.</div>;

  const { creditLimit, outstandingBalance, nextPaymentDueAmount, nextPaymentDueDate, schedule } = data;
  const creditUsagePercent = creditLimit > 0 ? (outstandingBalance / creditLimit) * 100 : 0;

  return (
    <div className="container py-8 max-w-7xl px-4 md:px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-zinc-900">
            {t("menu.payments")}
          </h2>
          <p className="text-zinc-600 font-sans mt-2 text-base">
            Gérez vos échéances de paiement à 60 jours (BNPL) et téléchargez vos factures.
          </p>
        </div>
        <ExportButton 
          action={exportPaymentsToCsv} 
          label="Exporter le relevé" 
          variant="outline"
          className="h-12 px-6 border-zinc-300 text-zinc-900 font-bold hover:bg-zinc-50 shadow-sm"
        />
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <Card className="border-zinc-300 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" /> Prochaine échéance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-black text-zinc-900">
              €{(nextPaymentDueAmount / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-amber-700 font-bold mt-2">
              {nextPaymentDueDate ? `Dû le ${new Date(nextPaymentDueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}` : "Aucune échéance à venir"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-300 shadow-md bg-zinc-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cloza-gold" /> Total en cours (Dette)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-black text-white">
              €{(outstandingBalance / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-zinc-400 font-medium mt-2">
              Somme des factures non payées
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-300 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
              <History className="h-5 w-5 text-zinc-400" /> Ligne de Crédit Utilisée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-black text-zinc-900">
              {creditUsagePercent.toFixed(1)}%
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full mt-3 mb-2 overflow-hidden">
               <div 
                  className={`h-full rounded-full ${creditUsagePercent > 80 ? 'bg-red-500' : 'bg-cloza-gold'}`}
                  style={{ width: `${Math.min(creditUsagePercent, 100)}%` }}
               />
            </div>
            <p className="text-sm text-zinc-600 font-medium">
              Sur une limite de €{(creditLimit / 100).toLocaleString('fr-FR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* PAYMENT SCHEDULE TABLE */}
      <Card className="border-zinc-300 shadow-md bg-white overflow-hidden">
        <CardHeader className="bg-zinc-50 border-b border-zinc-200 py-6 px-8 flex flex-row justify-between items-center">
          <CardTitle className="font-serif text-xl text-zinc-900">Échéancier de Facturation</CardTitle>
          <Badge variant="secondary" className="font-bold uppercase tracking-wider text-xs">BNPL 60 Jours</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {schedule.length > 0 ? (
            <div className="divide-y divide-zinc-200">
              {schedule.map((payment) => (
                <div key={payment.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-zinc-50/50 transition-colors">
                  
                  {/* Status Indicator */}
                  <div className="w-full md:w-48 flex-shrink-0">
                    <PaymentStatusBadge status={payment.status} daysUntilDue={payment.daysUntilDue} />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-zinc-900">{payment.vendorName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-zinc-600 border border-zinc-300 rounded px-2 py-0.5 bg-white">
                        ID: {payment.parentOrderId.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-sm text-zinc-500">
                        Confirmée le {new Date(payment.orderDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="text-left md:text-right">
                    <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Montant Dû</p>
                    <p className="text-xl font-serif font-black text-zinc-900">
                      €{(payment.amount / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm font-medium text-zinc-600 mt-1">
                      Échéance : <span className="font-bold text-zinc-900">{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-auto flex justify-end md:justify-center gap-2 mt-4 md:mt-0 border-t md:border-none border-zinc-100 pt-4 md:pt-0">
                    <Button variant="outline" size="icon" className="h-10 w-10 border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100" title="Télécharger la facture">
                      <FileText className="h-5 w-5" />
                    </Button>
                    <Button asChild variant="secondary" className="h-10 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold px-4">
                      <Link href={`/dashboard/orders/${payment.parentOrderId}`}>
                        Détails <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-zinc-500">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-zinc-300" />
              <p className="text-lg font-medium text-zinc-900 mb-2">Aucune facture en cours.</p>
              <p className="text-base">Vos échéances apparaîtront ici dès l'expédition de vos commandes.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentStatusBadge({ status, daysUntilDue }: { status: string, daysUntilDue: number }) {
  if (status === "PAID") {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border border-green-200 font-black tracking-widest text-xs py-1.5 px-3 uppercase w-full justify-center">PAYÉ</Badge>;
  }
  
  if (status === "OVERDUE") {
    return <Badge className="bg-red-600 text-white hover:bg-red-700 border-none font-black tracking-widest text-xs py-1.5 px-3 uppercase w-full justify-center animate-pulse">EN RETARD</Badge>;
  }

  if (status === "DUE_SOON") {
    return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-300 font-black tracking-widest text-xs py-1.5 px-3 uppercase w-full justify-center">DÛ DANS {daysUntilDue}J</Badge>;
  }

  return <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border border-zinc-300 font-black tracking-widest text-xs py-1.5 px-3 uppercase w-full justify-center">À VENIR</Badge>;
}
