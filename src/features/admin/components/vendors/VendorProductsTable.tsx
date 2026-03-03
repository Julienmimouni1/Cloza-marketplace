import { getVendorProducts } from "@/features/admin/actions/vendors";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductModerationModal } from "./ProductModerationModal";
import { Star } from "lucide-react";

interface Props {
  vendorId: string;
}

export async function VendorProductsTable({ vendorId }: Props) {
  const products = await getVendorProducts(vendorId);

  if (products.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-zinc-200 bg-zinc-50/50">
        <p className="text-zinc-500 italic font-serif">Aucun produit trouvé pour ce vendeur.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 shadow-sm bg-white overflow-hidden">
      <Table className="font-sans">
        <TableHeader className="bg-zinc-50/80">
          <TableRow className="hover:bg-transparent border-b border-zinc-200">
            <TableHead className="w-[80px] font-bold text-[10px] uppercase tracking-wider text-zinc-500">Image</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-wider text-zinc-500">Nom du produit</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-wider text-zinc-500">SKU / Ref</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-wider text-zinc-500">Prix (HT)</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-wider text-zinc-500">Stock</TableHead>
            <TableHead className="font-bold text-[10px] uppercase tracking-wider text-zinc-500">Statut</TableHead>
            <TableHead className="text-right font-bold text-[10px] uppercase tracking-wider text-zinc-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-zinc-50/30 transition-colors border-b border-zinc-100 last:border-0">
              <TableCell className="py-3">
                <div className="relative group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-12 w-12 object-cover bg-zinc-100 border border-zinc-200 shadow-sm" 
                  />
                  {product.isTrending && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border border-white">
                      <Star className="h-2 w-2 fill-white" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-zinc-900 line-clamp-1">{product.name}</span>
                  {product.isTrending && <span className="text-[9px] text-amber-600 font-bold uppercase tracking-tighter">Mise en avant</span>}
                </div>
              </TableCell>
              <TableCell className="py-3 text-[11px] font-mono text-zinc-500">{product.sku}</TableCell>
              <TableCell className="py-3 font-medium">{(product.priceHt / 100).toFixed(2)}€</TableCell>
              <TableCell className="py-3">
                <span className={`text-[11px] font-bold ${product.stock <= 5 ? "text-red-600" : "text-zinc-600"}`}>
                  {product.stock}
                </span>
              </TableCell>
              <TableCell className="py-3">
                <Badge 
                  variant={product.status === "ACTIVE" ? "default" : "secondary"}
                  className={`rounded-none text-[9px] uppercase font-bold tracking-widest px-1.5 py-0 ${
                    product.status === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-600" : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="py-3 text-right">
                <ProductModerationModal 
                  product={{
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    sku: product.sku,
                    status: product.status,
                    isTrending: product.isTrending,
                    priceHt: product.priceHt
                  }} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
