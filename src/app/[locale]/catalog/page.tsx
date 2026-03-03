import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { CatalogSidebar } from "@/features/catalog/components/CatalogSidebar";
import { MobileCatalogControls } from "@/features/catalog/components/MobileCatalogControls";
import { Prisma } from "@/generated/client/client";
import { Category, ProductStatus } from "@/generated/client";
import { 
  resolveMainCategory, 
  getParentCategory,
  getCategoryDisplayName
} from "@/lib/category-utils";

export const dynamic = 'force-dynamic';

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subCategories?: string;
    sort?: string;
    stock?: string;
    brands?: string;
    minPrice?: string;
    maxPrice?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

import { PaginationControls } from "@/components/shared/PaginationControls";

// ... existing imports

export default async function CatalogPage(props: CatalogPageProps) {
  const searchParams = await props.searchParams;
  const { q: query, category: categoryParam, subCategories, sort, stock, brands, minPrice, maxPrice, limit, page } = searchParams;

  const limitNumber = limit ? parseInt(limit as string) : 24;
  const pageNumber = page ? parseInt(page as string) : 1;
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch vendors for the sidebar filter
  const vendors = await prisma.vendor.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
  };
  const andConditions: Prisma.ProductWhereInput[] = [];

  // Helper to normalize search params that might be string or array
  const normalizeParam = (param: string | string[] | undefined): string[] => {
      if (!param) return [];
      if (Array.isArray(param)) return param;
      return param.split(',');
  };

  const brandsList = normalizeParam(brands);
  let availableSubCategories: string[] = [];
  let initialSelectedSubCategories: string[] = normalizeParam(subCategories);

  // Helper to fetch sub-categories from DB
  const fetchSubCategoriesFromDB = async (cat: Category) => {
    const results = await prisma.product.findMany({
      where: { category: cat },
      select: { subCategory: true },
      distinct: ['subCategory'],
    });
    return results
      .map(r => r.subCategory)
      .filter((s): s is string => s !== null && s.length > 0)
      .sort();
  };

  // 1. Search Query
  if (query) {
    andConditions.push({
      OR: [
        { name: { contains: query as string, mode: 'insensitive' } },
        { description: { contains: query as string, mode: 'insensitive' } },
        { vendor: { name: { contains: query as string, mode: 'insensitive' } } },
      ]
    });
  }

  // 2. Category Logic
  if (categoryParam) {
    const mainCategory = resolveMainCategory(categoryParam as string);

    if (mainCategory) {
      // CASE A: Main Category Selected (e.g. "Food")
      andConditions.push({ category: mainCategory });
      // Fetch actual available sub-categories from DB
      availableSubCategories = await fetchSubCategoriesFromDB(mainCategory);

    } else {
      // CASE B: Sub-Category Selected (e.g. "Alcoholic")
      const parentCategory = getParentCategory(categoryParam as string);
      
      if (parentCategory) {
        // Found parent (e.g. "Food"), fetch its siblings
        availableSubCategories = await fetchSubCategoriesFromDB(parentCategory);
        
        // Add current URL param as "selected"
        if (!initialSelectedSubCategories.includes(categoryParam as string)) {
          initialSelectedSubCategories.push(categoryParam as string);
        }
      }
    }
  }

  // 3. Apply Sub-Category Filters (Unified Logic)
  // This handles both the URL param (Case B) and checkbox selections
  const effectiveSubCats = new Set<string>();
  
  // From URL Path (if it's a sub-cat)
  if (categoryParam && !resolveMainCategory(categoryParam as string)) {
      effectiveSubCats.add(categoryParam as string);
  }
  // From Query Params
  initialSelectedSubCategories.forEach(s => effectiveSubCats.add(s));

  if (effectiveSubCats.size > 0) {
    andConditions.push({
      OR: [
        { subCategory: { in: Array.from(effectiveSubCats), mode: 'insensitive' } },
        { leafCategory: { in: Array.from(effectiveSubCats), mode: 'insensitive' } }
      ]
    });
  }

  // 4. Other Filters
  if (brandsList.length > 0) {
    andConditions.push({ vendorId: { in: brandsList } });
  }

  if (stock === 'in-stock') {
    andConditions.push({ stock: { gt: 0 } });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      priceHt: {
        gte: minPrice ? parseInt(minPrice) * 100 : undefined,
        lte: maxPrice ? parseInt(maxPrice) * 100 : undefined,
      }
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // 5. Sort
  let orderBy: Prisma.ProductOrderByWithRelationInput = { id: 'desc' };
  if (sort === 'price-asc') orderBy = { priceHt: 'asc' };
  else if (sort === 'price-desc') orderBy = { priceHt: 'desc' };
  else if (sort === 'alpha-asc') orderBy = { name: 'asc' };
  else if (sort === 'alpha-desc') orderBy = { name: 'desc' };

  // ... (Total Count)
  const totalCount = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    include: { vendor: true, images: true },
    orderBy,
    take: limitNumber,
    skip: skip,
  });

  const mappedProducts = products.map((p) => ({
    id: p.id,
    title: p.name,
    price: p.priceHt,
    stock: p.stock,
    image: p.image,
    category: p.category,
    slug: p.slug,
    vendorId: p.vendorId,
    vendor: { name: p.vendor.name },
    images: p.images.map(img => ({
      url: img.url,
      isMain: img.isMain
    }))
  }));

  const totalPages = Math.ceil(totalCount / limitNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Mobile Controls (Sticky Header) */}
      <MobileCatalogControls 
          vendors={vendors} 
          subCategories={availableSubCategories}
          defaultSelectedSubCategories={initialSelectedSubCategories}
      />

      <div className="flex flex-col lg:flex-row gap-8 pt-[150px] lg:pt-0">
        <aside className="w-full lg:w-64 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-200">
           <CatalogSidebar 
              vendors={vendors}
              subCategories={availableSubCategories}
              defaultSelectedSubCategories={initialSelectedSubCategories}
              startOpen={false}
           />
        </aside>

        <main className="flex-1">
          <div className="mb-8">
             {/* ... Header Text */}
          </div>
          
          <ProductGrid products={mappedProducts} />
          
          <div className="mt-8">
            <PaginationControls 
                currentPage={pageNumber}
                totalPages={totalPages}
                hasNextPage={pageNumber < totalPages}
                hasPrevPage={pageNumber > 1}
            />
          </div>
        </main>
      </div>
    </div>
  );
}