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
    <Tabs defaultValue="to-pay" className="space-y-6">
      <TabsList className="h-14 p-1 bg-zinc-100 rounded-lg">
        <TabsTrigger value="to-pay" className="px-8 py-3 font-extrabold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">À payer ({toPay.length})</TabsTrigger>
        <TabsTrigger value="in-progress" className="px-8 py-3 font-extrabold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">En cours ({inProgress.length})</TabsTrigger>
        <TabsTrigger value="paid" className="px-8 py-3 font-extrabold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Payées ({paid.length})</TabsTrigger>
        <TabsTrigger value="settings" className="px-8 py-3 font-extrabold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Paramètres</TabsTrigger>
      </TabsList>

      <TabsContent value="to-pay" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-black text-black">Paiements en attente</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-base mt-2">
              Commandes livrées prêtes pour le reversement aux vendeurs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceTable data={toPay} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="in-progress" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-black text-black">Transactions en cours</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-base mt-2">
              Commandes non encore livrées. Le reversement sera possible après livraison.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceTable data={inProgress} showActions={false} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="paid" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-black text-black">Paiements effectués</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-base mt-2">
              Historique des reversements vendeurs validés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceTable data={paid} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card className="border-2 border-zinc-100 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-black text-black">Configuration financière</CardTitle>
            <CardDescription className="text-zinc-600 font-bold text-base mt-2">
              Gérez les paramètres globaux de la plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <GlobalCommissionForm currentRate={globalCommissionRate} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
