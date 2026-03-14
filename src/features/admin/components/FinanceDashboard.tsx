"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceTable, SubOrderWithRelations } from "./FinanceTable";
import { GlobalCommissionForm } from "./GlobalCommissionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FinanceDashboardProps {
  inProgress: SubOrderWithRelations[];
  toPay: SubOrderWithRelations[];
  paid: SubOrderWithRelations[];
  globalCommissionRate: number;
}

export function FinanceDashboard({
  inProgress,
  toPay,
  paid,
  globalCommissionRate,
}: FinanceDashboardProps) {
  return (
    <Tabs defaultValue="to-pay" className="space-y-4 md:space-y-6">
      <TabsList className="h-14 p-1 bg-zinc-100 rounded-lg w-full justify-start overflow-x-auto overflow-y-hidden flex-nowrap scrollbar-hide">
        <TabsTrigger value="to-pay" className="px-4 md:px-8 py-3 font-extrabold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">À payer ({toPay.length})</TabsTrigger>
        <TabsTrigger value="in-progress" className="px-4 md:px-8 py-3 font-extrabold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">En cours ({inProgress.length})</TabsTrigger>
        <TabsTrigger value="paid" className="px-4 md:px-8 py-3 font-extrabold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Payées ({paid.length})</TabsTrigger>
        <TabsTrigger value="settings" className="px-4 md:px-8 py-3 font-extrabold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Paramètres</TabsTrigger>
      </TabsList>

      <TabsContent value="to-pay" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="p-4 md:p-6 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl font-black text-black">Paiements en attente</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-sm md:text-base mt-1 md:mt-2">
              Commandes livrées prêtes pour le reversement aux vendeurs.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <FinanceTable data={toPay} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="in-progress" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="p-4 md:p-6 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl font-black text-black">Transactions en cours</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-sm md:text-base mt-1 md:mt-2">
              Commandes non encore livrées. Le reversement sera possible après livraison.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <FinanceTable data={inProgress} showActions={false} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="paid" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="p-4 md:p-6 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl font-black text-black">Paiements effectués</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-sm md:text-base mt-1 md:mt-2">
              Historique des reversements vendeurs validés.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <FinanceTable data={paid} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="p-4 md:p-6 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl font-black text-black">Configuration financière</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-sm md:text-base mt-1 md:mt-2">
              Gérez les paramètres globaux de la plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-4 md:pt-4">
            <GlobalCommissionForm currentRate={globalCommissionRate} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
