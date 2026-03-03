import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    stock: number;
    image: string;
    category: string;
    slug: string;
    vendorId: string;
    vendor: {
      name: string;
    };
    images?: {
      url: string;
      isMain: boolean;
    }[];
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  // Logic to determine which image to display
  // 1. Try to find the main image from the relation
  // 2. Fallback to the first image from the relation
  // 3. Fallback to the legacy image string
  const relationImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url;
  const displayImage = relationImage && !relationImage.includes('placehold.co')
    ? relationImage 
    : (product.image && !product.image.includes('placehold.co') ? product.image : '/images_produits/fallback-product.avif');

  return (
    <div className={cn("group space-y-3", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100">
        <Link href={`/products/${product.category.toLowerCase()}/${product.slug}`} className="block h-full w-full">
          <ProductImage
            src={displayImage}
            alt={product.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm text-black">
            {product.vendor.name}
          </div>
        </Link>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <AddToCartButton product={{ ...product, image: displayImage }} />
        </div>
      </div>
      
      <Link href={`/products/${product.category.toLowerCase()}/${product.slug}`} className="block space-y-1 text-center">
        <h3 className="font-serif text-lg text-foreground group-hover:text-cloza-gold transition-colors">
          {product.title}
        </h3>
        <p className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
          {(product.price / 100).toFixed(2)} € HT
        </p>
      </Link>
    </div>
  );
}