"use client";

import { useTransition } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PayoutStatus } from "@/generated/client";
import { markSubOrderAsPaid, markSubOrderAsUnpaid } from "../actions/finance";
import { toast } from "sonner";
import { Link } from "@/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InfoIcon } from "lucide-react";

export type SubOrderWithRelations = {
  id: string;
  parentOrderId: string;
  vendorId: string;
  status: string;
  totalAmount: number;
  commissionAmount: number;
  payoutStatus: PayoutStatus;
  payoutDate: Date | null;
  vendor: {
    id: string;
    name: string;
  };
  parentOrder: {
    id: string;
    currency: string;
    paymentMethod: string;
  };
};

interface FinanceTableProps {
  data: SubOrderWithRelations[];
  showActions?: boolean;
}

export function FinanceTable({ data, showActions = true }: FinanceTableProps) {
  const [isPending, startTransition] = useTransition();
  const format = useFormatter();
  const locale = useLocale();
  const t = useTranslations("Admin.finance");

  const handleMarkAsPaid = (id: string) => {
    startTransition(async () => {
      try {
        await markSubOrderAsPaid(id);
        toast.success(t("notifications.markedPaid"));
      } catch (error) {
        toast.error(t("notifications.error"));
      }
    });
  };

  const handleMarkAsUnpaid = (id: string) => {
    startTransition(async () => {
      try {
        await markSubOrderAsUnpaid(id);
        toast.success(t("notifications.paymentCancelled"));
      } catch (error) {
        toast.error(t("notifications.error"));
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 border-b-2 border-zinc-200">
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm">{t("columns.date")}</TableHead>
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm">{t("columns.vendor")}</TableHead>
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm">{t("columns.order")}</TableHead>
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm text-right">{t("columns.totalAmount")}</TableHead>
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm text-right">{t("columns.commission")}</TableHead>
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm text-right">{t("columns.netPayout")}</TableHead>
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm">{t("columns.payment")}</TableHead>
              <TableHead className="py-4 text-zinc-900 font-extrabold text-sm">{t("columns.status")}</TableHead>
              {showActions && <TableHead className="py-4 text-zinc-900 font-extrabold text-sm text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 9 : 8} className="h-32 text-center text-zinc-500 font-medium">
                  {t("noData")}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-zinc-50 border-b border-zinc-100 transition-colors">
                  <TableCell className="py-5 font-bold text-zinc-700">
                    {item.payoutDate 
                      ? format.dateTime(new Date(item.payoutDate), { dateStyle: "medium" })
                      : "---"}
                  </TableCell>
                  <TableCell className="py-5 font-black text-black text-base">{item.vendor.name}</TableCell>
                  <TableCell className="py-5">
                    <Link 
                      href={`/admin/orders/${item.parentOrderId}`}
                      className="text-primary hover:underline font-mono text-sm font-bold bg-zinc-100 px-2 py-1 rounded"
                      title={item.parentOrderId}
                    >
                      #{item.parentOrderId.slice(-8)}
                    </Link>
                  </TableCell>
                  <TableCell className="py-5 text-right font-bold text-base">
                    {format.number(item.totalAmount / 100, { 
                      style: "currency", 
                      currency: item.parentOrder.currency 
                    })}
                  </TableCell>
                  <TableCell className="py-5 text-right text-zinc-600 font-bold text-sm">
                    {format.number(item.commissionAmount / 100, { 
                      style: "currency", 
                      currency: item.parentOrder.currency 
                    })}
                  </TableCell>
                  <TableCell className="py-5 text-right font-black text-lg text-green-700 dark:text-green-400">
                    {format.number((item.totalAmount - item.commissionAmount) / 100, { 
                      style: "currency", 
                      currency: item.parentOrder.currency 
                    })}
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge variant="outline" className="text-xs font-black uppercase border-zinc-300 px-2 py-1">
                      {item.parentOrder.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge 
                      className={`font-bold px-3 py-1 ${
                        item.payoutStatus === PayoutStatus.PAID 
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" 
                          : "bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                      }`}
                      variant="outline"
                    >
                      {item.payoutStatus === PayoutStatus.PAID ? t("status.paid") : t("status.pending")}
                    </Badge>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right py-5">
                      {item.payoutStatus === PayoutStatus.PENDING ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" disabled={isPending} className="font-black text-xs uppercase tracking-wider h-10 px-4">
                              {t("actions.markPaid")}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="sm:max-w-[500px] border-4 border-black p-8">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black text-black mb-4 uppercase tracking-tight">{t("dialog.title")}</AlertDialogTitle>
                              <AlertDialogDescription className="text-lg font-bold text-zinc-700 leading-relaxed">
                                {t("dialog.description", { vendor: item.vendor.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-8 gap-4">
                              <AlertDialogCancel className="h-14 font-black text-base uppercase border-2 border-zinc-200 hover:bg-zinc-100">{t("dialog.cancel")}</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleMarkAsPaid(item.id)}
                                className="h-14 font-black text-base uppercase bg-black hover:bg-zinc-800 text-white"
                              >
                                {t("dialog.confirm")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleMarkAsUnpaid(item.id)}
                          disabled={isPending}
                          className="font-bold text-zinc-500 hover:text-red-700"
                        >
                          {t("actions.undo")}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.length === 0 ? (
          <div className="h-32 flex items-center justify-center border rounded-lg text-zinc-500 font-medium bg-zinc-50">
            {t("noData")}
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="border-2 border-zinc-100 rounded-xl p-5 space-y-4 bg-white shadow-sm">
              <div className="flex justify-between items-start border-b border-zinc-100 pb-4">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{t("columns.vendor")}</p>
                  <h3 className="text-lg font-black text-zinc-900 leading-tight">{item.vendor.name}</h3>
                </div>
                <Badge 
                  className={`font-black px-3 py-1 uppercase text-[10px] ${
                    item.payoutStatus === PayoutStatus.PAID 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-zinc-100 text-zinc-800 border-zinc-200"
                  }`}
                  variant="outline"
                >
                  {item.payoutStatus === PayoutStatus.PAID ? t("status.paid") : t("status.pending")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t("columns.date")}</p>
                  <p className="text-sm font-bold text-zinc-800">
                    {item.payoutDate 
                      ? format.dateTime(new Date(item.payoutDate), { dateStyle: "medium" })
                      : "---"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t("columns.order")}</p>
                  <Link 
                    href={`/admin/orders/${item.parentOrderId}`}
                    className="text-primary hover:underline font-mono text-xs font-black bg-zinc-100 px-2 py-0.5 rounded"
                  >
                    #{item.parentOrderId.slice(-8)}
                  </Link>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-500 uppercase tracking-widest">{t("columns.totalAmount")}</span>
                  <span className="font-bold text-zinc-900">
                    {format.number(item.totalAmount / 100, { style: "currency", currency: item.parentOrder.currency })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-500 uppercase tracking-widest">{t("columns.commission")}</span>
                  <span className="font-bold text-red-600">
                    -{format.number(item.commissionAmount / 100, { style: "currency", currency: item.parentOrder.currency })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                  <span className="font-black text-zinc-900 uppercase tracking-widest text-sm">{t("columns.netPayout")}</span>
                  <span className="font-black text-xl text-green-700">
                    {format.number((item.totalAmount - item.commissionAmount) / 100, { style: "currency", currency: item.parentOrder.currency })}
                  </span>
                </div>
              </div>

              {showActions && (
                <div className="pt-2">
                  {item.payoutStatus === PayoutStatus.PENDING ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button disabled={isPending} className="w-full h-14 font-black text-base uppercase bg-black hover:bg-zinc-800 text-white shadow-xl">
                          {t("actions.markPaid")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[90%] rounded-2xl border-4 border-black p-6">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black text-black mb-2 uppercase tracking-tight">{t("dialog.title")}</AlertDialogTitle>
                          <AlertDialogDescription className="text-base font-bold text-zinc-700 leading-relaxed">
                            {t("dialog.description", { vendor: item.vendor.name })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-3">
                          <AlertDialogCancel className="h-12 font-black text-sm uppercase border-2 border-zinc-200">{t("dialog.cancel")}</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleMarkAsPaid(item.id)}
                            className="h-12 font-black text-sm uppercase bg-black text-white"
                          >
                            {t("dialog.confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button 
                      variant="ghost"
                      onClick={() => handleMarkAsUnpaid(item.id)}
                      disabled={isPending}
                      className="w-full h-12 font-black text-zinc-500 hover:text-red-700 uppercase text-xs"
                    >
                      {t("actions.undo")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {data.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <InfoIcon className="h-3 w-3" />
          {t("limitNotice", { count: 50 })}
        </div>
      )}
    </div>
  );
}
