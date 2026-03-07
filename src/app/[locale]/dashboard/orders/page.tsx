import { auth } from "@/lib/auth";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  Truck, 
  MoreHorizontal, 
  Package
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { ExportButton } from "../_components/ExportButton";
import { exportOrdersToCsv } from "@/features/dashboard/actions/export-actions";

export default async function OrdersPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard");

  // MOCK DATA (Could be replaced by real DB call like in DashboardPage)
  const orders = [
    { 
      id: "CLZ-8821", 
      date: "20 Oct 2026", 
      brand: "Lumière Paris", 
      items: 12, 
      total: "€1,240.00", 
      status: "SHIPPED",
      products: ["bg-stone-200", "bg-stone-300", "bg-stone-400"]
    },
    { 
      id: "CLZ-8815", 
      date: "12 Oct 2026", 
      brand: "Nórdic Minimal", 
      items: 8, 
      total: "€850.00", 
      status: "DELIVERED",
      products: ["bg-neutral-200", "bg-neutral-300"] 
    },
    { 
      id: "CLZ-8790", 
      date: "28 Sep 2026", 
      brand: "Silk & Steel", 
      items: 24, 
      total: "€2,100.00", 
      status: "PAID",
      products: ["bg-zinc-200", "bg-zinc-300", "bg-zinc-400", "bg-zinc-500"] 
    },
    { 
      id: "CLZ-8755", 
      date: "15 Sep 2026", 
      brand: "Lumière Paris", 
      items: 5, 
      total: "€420.00", 
      status: "DELIVERED",
      products: ["bg-stone-200"] 
    },
    { 
      id: "CLZ-8720", 
      date: "30 Aoû 2026", 
      brand: "Urban Edge", 
      items: 15, 
      total: "€1,550.00", 
      status: "COMPLETED",
      products: ["bg-slate-200", "bg-slate-300"] 
    },
  ];

  return (
    <div className="container py-8 max-w-7xl px-4 md:px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-zinc-900">{t("menu.orders")}</h2>
          <p className="text-zinc-500 font-sans mt-1">Gérez vos commandes, suivez vos expéditions et téléchargez vos factures.</p>
        </div>
        <ExportButton 
          action={exportOrdersToCsv} 
          label="Exporter l'historique" 
          variant="default"
          className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-none text-xs font-bold uppercase tracking-wider"
        />
      </div>


      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 border border-zinc-100 shadow-sm rounded-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Rechercher par ID ou Marque..." 
            className="pl-9 border-zinc-200 focus:ring-cloza-gold rounded-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] rounded-sm border-zinc-200">
              <div className="flex items-center gap-2 text-zinc-600">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="shipped">Expédié</SelectItem>
              <SelectItem value="delivered">Livré</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-zinc-200 rounded-sm shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="w-[120px]">ID Commande</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Marque & Articles</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-zinc-50/50">
                <TableCell className="font-medium font-sans">{order.id}</TableCell>
                <TableCell className="text-zinc-500">{order.date}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-zinc-900">{order.brand}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.products.slice(0, 3).map((bgClass, i) => (
                          <div key={i} className={`h-8 w-8 rounded-full border-2 border-white ${bgClass} flex items-center justify-center`}>
                          </div>
                        ))}
                        {order.items > 3 && (
                          <div className="h-8 w-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-medium text-zinc-500">
                            +{order.items - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">{order.items} articles</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-serif font-bold">{order.total}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                     <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:text-cloza-gold">
                        <Link href={`/dashboard/orders/${order.id}`}>
                           <Truck className="h-4 w-4" />
                        </Link>
                     </Button>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" /> Télécharger Facture
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RotateCcw className="mr-2 h-4 w-4" /> Recommander
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                           Signaler un problème
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    PAID: "bg-zinc-50 text-zinc-700 border-zinc-200",
    COMPLETED: "bg-zinc-100 text-zinc-500 border-zinc-200",
  };

  const style = styles[status as keyof typeof styles] || styles.PAID;

  return (
    <Badge variant="outline" className={`${style} font-medium`}>
      {status}
    </Badge>
  );
}

