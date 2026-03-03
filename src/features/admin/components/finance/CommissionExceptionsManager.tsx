"use client";

import { useState } from "react";
import { addCommissionException, deleteCommissionException } from "@/features/admin/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslations } from "next-intl";

// Hardcoded for now, should come from Prisma enum or centralized config
const CATEGORIES = ["Textile", "Beauty", "Food"]; 

interface Props {
  vendorId: string;
  exceptions: any[]; // Prisma type
}

export function CommissionExceptionsManager({ vendorId, exceptions }: Props) {
  const [category, setCategory] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Admin.finance.exceptions");

  const handleAdd = async () => {
    if (!category || !rate) return toast.error(t("addError"));
    
    setLoading(true);
    try {
      await addCommissionException(vendorId, { 
        category: category as any, 
        rate: parseFloat(rate) 
      });
      toast.success(t("successAdd"));
      setCategory("");
      setRate("");
    } catch (error) {
      toast.error(t("errorAdd"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCommissionException(id);
      toast.success(t("successRemove"));
    } catch (error) {
      toast.error(t("errorRemove"));
    }
  };

  return (
    <Card className="rounded-none shadow-none border-zinc-200 h-full">
      <CardHeader>
        <CardTitle className="font-serif text-lg">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-none">
                        <SelectValue placeholder={t("categoryPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-24 space-y-2">
                <div className="relative">
                    <Input 
                        type="number" 
                        placeholder={t("ratePlaceholder")}
                        value={rate} 
                        onChange={e => setRate(e.target.value)}
                        className="rounded-none pr-6"
                    />
                    <span className="absolute right-2 top-2.5 text-xs text-zinc-400">%</span>
                </div>
            </div>
            <Button onClick={handleAdd} disabled={loading} size="icon" className="rounded-none shrink-0">
                <Plus className="h-4 w-4" />
            </Button>
        </div>

        <div className="border border-zinc-100 rounded-none overflow-hidden">
            <Table>
                <TableHeader className="bg-zinc-50">
                    <TableRow>
                        <TableHead className="h-8">Category</TableHead>
                        <TableHead className="h-8">Rate</TableHead>
                        <TableHead className="h-8 w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {exceptions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-xs text-zinc-500 py-4">{t("noExceptions")}</TableCell>
                        </TableRow>
                    ) : (
                        exceptions.map((ex) => (
                            <TableRow key={ex.id}>
                                <TableCell className="py-2 text-sm font-medium">{ex.category}</TableCell>
                                <TableCell className="py-2 text-sm text-zinc-600">{(ex.rate / 100).toFixed(2)}%</TableCell>
                                <TableCell className="py-2 text-right">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(ex.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
