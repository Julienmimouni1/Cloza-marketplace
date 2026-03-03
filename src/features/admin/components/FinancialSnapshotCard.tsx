import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  gmv: number; // in cents
  totalCommission: number; // in cents
  orderCount: number;
}

export function FinancialSnapshotCard({ gmv, totalCommission, orderCount }: Props) {
  const t = useTranslations("AdminComponents.financial");
  
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalSales")}</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(gmv)}</div>
          <p className="text-xs text-muted-foreground">
            {t("fromOrders", { count: orderCount })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalCommission")}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCommission)}</div>
          <p className="text-xs text-muted-foreground">
            {t("platformRevenue")}
          </p>
        </CardContent>
      </Card>
      {/* 
        Potential third card: Net Payout (GMV - Commission)
        But let's stick to the spec for now.
      */}
    </div>
  );
}
