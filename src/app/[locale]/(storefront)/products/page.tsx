import { Suspense } from 'react';
import { Metadata } from 'next';
import { getProducts } from '@/features/catalog/actions';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { FilterSidebar } from '@/features/catalog/components/FilterSidebar';
import { ProductGridSkeleton } from '@/features/catalog/components/ProductGridSkeleton';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: { searchParams: SearchParams }): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const category = searchParams.category as string | undefined;

  const title = category
    ? `${category} Products | Cloza`
    : 'All Products | Cloza';

  return {
    title,
    description: `Browse ${category || 'all'} products from verified vendors.`,
  };
}

export default async function ProductsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  // Pass searchParams directly, getProducts handles validation/safety
  const products = await getProducts(searchParams);

  const categories = [
    { id: 'Textile', name: 'Textile' },
    { id: 'Beauty', name: 'Beauty' },
    { id: 'Food', name: 'Food' },
  ];

  const categoryTitle = typeof searchParams.category === 'string' ? searchParams.category : 'All Products';

  return (

    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-serif text-3xl md:text-4xl text-foreground capitalize">
        {categoryTitle} Collection
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64">
          <FilterSidebar categories={categories} />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
