"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface Props {
  rate: number; // bps
}

export function RevenueSimulator({ rate }: Props) {
  const [price, setPrice] = useState<string>("100");
  const priceVal = parseFloat(price) || 0;
  
  const commission = Math.round(priceVal * (rate / 10000) * 100) / 100;
  const net = priceVal - commission;

  return (
    <Card className="rounded-none shadow-none border-zinc-200 bg-zinc-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-sm flex items-center gap-2 text-zinc-500">
            <Calculator className="h-4 w-4" />
            Quick Simulator (Rate: {(rate/100).toFixed(2)}%)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm">
            <div>
                <Label className="text-xs text-zinc-400">Sell Price (€)</Label>
                <Input 
                    type="number" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    className="h-8 w-24 rounded-none bg-white"
                />
            </div>
            <div className="flex-1 pt-4 text-right">
                <div className="text-xs text-red-500 font-medium">- {commission.toFixed(2)}€ Fee</div>
                <div className="text-lg font-bold text-emerald-700">= {net.toFixed(2)}€ Net</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
