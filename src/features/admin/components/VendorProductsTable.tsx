"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  priceHt: number;
  stock: number;
  status: string;
  image: string;
  sku: string;
}

interface Props {
  products: Product[];
}

export function VendorProductsTable({ products }: Props) {
  if (products.length === 0) {
    return <div className="text-sm text-zinc-500 italic p-4">No products found.</div>;
  }

  return (
    <div className="rounded-md border border-zinc-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-10 w-10 object-cover rounded-md bg-zinc-100"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-xs text-zinc-500">{product.sku}</TableCell>
              <TableCell>{(product.priceHt / 100).toFixed(2)} €</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
