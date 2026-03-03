"use client";

import { useCart } from "../hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
    product: {
        id: string; // Acts as variantId/productId for now
        title: string;
        price: number;
        image: string;
        vendorId: string;
        stock: number;
        vatRate?: number; // Optional, defaults to 20
    };
    variant?: "icon" | "full";
    className?: string;
}

export function AddToCartButton({ product, variant = "icon", className }: AddToCartButtonProps) {
    const { addItem, openDrawer } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        addItem({
            id: product.id,
            variantId: product.id, // Assuming simple products for now
            productId: product.id,
            vendorId: product.vendorId,
            title: product.title,
            priceHT: product.price,
            stock: product.stock,
            vatRate: product.vatRate || 20,
            image: product.image
        });
        openDrawer();
    };

    if (variant === "full") {
        return (
            <Button onClick={handleAdd} className={cn("w-full", className)}>
                Add to Cart
            </Button>
        );
    }

    return (
        <Button 
            onClick={handleAdd} 
            size="icon" 
            variant="secondary" 
            className={cn("rounded-full shadow-md hover:scale-105 transition-transform", className)}
        >
            <ShoppingBag className="h-4 w-4" />
        </Button>
    );
}
