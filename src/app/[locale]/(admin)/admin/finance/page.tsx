import { getGlobalCommissionRate, getFinancialSubOrders } from "@/features/admin/actions/finance";
import { FinanceDashboard } from "@/features/admin/components/FinanceDashboard";
import { PayoutStatus } from "@/generated/client";
import { SubOrderWithRelations } from "@/features/admin/components/FinanceTable";

export default async function FinancePage() {
  const [inProgress, toPay, paid, globalRate] = await Promise.all([
    getFinancialSubOrders(PayoutStatus.PENDING, "NOT_DELIVERED"),
    getFinancialSubOrders(PayoutStatus.PENDING, "DELIVERED"),
    getFinancialSubOrders(PayoutStatus.PAID),
    getGlobalCommissionRate(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Financier</h1>
      </div>
      
      <FinanceDashboard 
        inProgress={inProgress as SubOrderWithRelations[]}
        toPay={toPay as SubOrderWithRelations[]}
        paid={paid as SubOrderWithRelations[]}
        globalCommissionRate={globalRate}
      />
    </div>
  );
}

