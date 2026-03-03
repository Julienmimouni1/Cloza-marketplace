import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: {
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
  }[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="font-serif text-2xl text-foreground">No products found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}