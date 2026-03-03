import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, Package, TrendingUp } from "lucide-react";

interface Props {
  gmv: number;
  orderCount: number;
}

export function FinancialSnapshot({ gmv, orderCount }: Props) {
  const formattedGmv = (gmv / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="rounded-none shadow-none border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales (GMV)</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedGmv}</div>
          <p className="text-xs text-muted-foreground">Lifetime accumulated sales</p>
        </CardContent>
      </Card>
      <Card className="rounded-none shadow-none border-zinc-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Order Count</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderCount}</div>
          <p className="text-xs text-muted-foreground">Total sub-orders fulfilled</p>
        </CardContent>
      </Card>
    </div>
  );
}
