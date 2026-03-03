import React from 'react';
import CategoryCircle from '@/components/CategoryCircle';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard, { Product } from '@/components/ProductCard';
import CollectionToolbar from '@/components/CollectionToolbar';

// Placeholder data - in a real app this would come from an API/Database based on params.slug
const CATEGORIES = [
    { title: "Beauty & Wellness", imageSrc: "https://clozastore.com/cdn/shop/files/cloza_logo_black.png?v=1764354851&width=500", href: "/collections/beauty-wellness" }, // Using placeholder images
    { title: "Food & Beverages", imageSrc: "https://clozastore.com/cdn/shop/files/cloza_logo_black.png?v=1764354851&width=500", href: "/collections/food-beverages" },
    { title: "Textile", imageSrc: "https://clozastore.com/cdn/shop/files/cloza_logo_black.png?v=1764354851&width=500", href: "/collections/textile" },
    { title: "Electronics", imageSrc: "https://clozastore.com/cdn/shop/files/cloza_logo_black.png?v=1764354851&width=500", href: "/collections/electronics" },
    { title: "Home & Garden", imageSrc: "https://clozastore.com/cdn/shop/files/cloza_logo_black.png?v=1764354851&width=500", href: "/collections/home-garden" },
];

const PRODUCTS: Product[] = [
    {
        id: 1,
        title: "Classic White T-Shirt",
        price: "€29.99",
        originalPrice: "€35.00",
        imageSrc: "https://placehold.co/400x533/f5f5f5/000000?text=Product+1",
        secondImageSrc: "https://placehold.co/400x533/e5e5e5/000000?text=Product+1+Back",
        brand: "Brand ABC",
        badge: "Sale",
        href: "/products/classic-white-t-shirt"
    },
    {
        id: 2,
        title: "Black Denim Jacket",
        price: "€89.99",
        imageSrc: "https://placehold.co/400x533/f5f5f5/000000?text=Product+2",
        secondImageSrc: "https://placehold.co/400x533/e5e5e5/000000?text=Product+2+Back",
        brand: "Brand Name",
        href: "/products/black-denim-jacket"
    },
    {
        id: 3,
        title: "Summer Dress Floral",
        price: "€49.99",
        imageSrc: "https://placehold.co/400x533/f5f5f5/000000?text=Product+3",
        brand: "Hero Brand",
        soldOut: true,
        href: "/products/summer-dress-floral"
    },
    {
        id: 4,
        title: "Leather Boots",
        price: "€120.00",
        imageSrc: "https://placehold.co/400x533/f5f5f5/000000?text=Product+4",
        secondImageSrc: "https://placehold.co/400x533/e5e5e5/000000?text=Product+4+Detail",
        brand: "Savana",
        href: "/products/leather-boots"
    },
    {
        id: 5,
        title: "Running Shoes",
        price: "€75.00",
        imageSrc: "https://placehold.co/400x533/f5f5f5/000000?text=Product+5",
        brand: "Sporty",
        href: "/products/running-shoes"
    },
    {
        id: 6,
        title: "Wool Scarf",
        price: "€25.00",
        imageSrc: "https://placehold.co/400x533/f5f5f5/000000?text=Product+6",
        brand: "Cozy",
        badge: "New",
        href: "/products/wool-scarf"
    },
];


export default async function CollectionPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    // Format slug for title
    const collectionTitle = resolvedParams.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Filter Logic
    let filteredProducts = [...PRODUCTS];

    // 1. Availability
    const availability = resolvedSearchParams.availability?.toString().split(',') || [];
    if (availability.length > 0) {
        if (availability.includes('in_stock') && !availability.includes('out_of_stock')) {
            filteredProducts = filteredProducts.filter(p => !p.soldOut);
        } else if (availability.includes('out_of_stock') && !availability.includes('in_stock')) {
            filteredProducts = filteredProducts.filter(p => p.soldOut);
        }
        // If both, show all (default)
    }

    // 2. Price
    const minPrice = parseFloat(resolvedSearchParams.min_price?.toString() || '0');
    const maxPrice = parseFloat(resolvedSearchParams.max_price?.toString() || '10000'); // High default max

    if (minPrice > 0 || maxPrice < 10000) {
        filteredProducts = filteredProducts.filter(p => {
            // Parse price string "€29.99" -> 29.99
            const priceVal = parseFloat(p.price.replace(/[^0-9.]/g, ''));
            return priceVal >= minPrice && priceVal <= maxPrice;
        });
    }

    // 3. Brand
    const brands = resolvedSearchParams.brand?.toString().split(',') || [];
    if (brands.length > 0) {
        filteredProducts = filteredProducts.filter(p => p.brand && brands.includes(p.brand));
    }

    // 4. Sorting
    const sort = resolvedSearchParams.sort?.toString() || 'featured';
    if (sort) {
        switch (sort) {
            case 'price-asc':
                filteredProducts.sort((a, b) => {
                    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
                    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => {
                    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
                    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
                    return priceB - priceA;
                });
                break;
            case 'created-desc':
                // Mock date sorting - assuming ID implies creation order
                filteredProducts.sort((a, b) => Number(b.id) - Number(a.id));
                break;
            case 'created-asc':
                filteredProducts.sort((a, b) => Number(a.id) - Number(b.id));
                break;
            default:
                // 'featured' or 'best-selling' - default order
                break;
        }
    }

    return (
        <div className="collection-page pb-20">
            {/* Shop by Category Section */}
            <section className="py-10 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-normal text-black">Shop by Category</h2>
                    </div>

                    <div className="relative">
                        {/* Scroll Container */}
                        <div className="flex overflow-x-auto gap-6 pb-4 snap-x justify-start md:justify-center scrollbar-hide">
                            {CATEGORIES.map((category, index) => (
                                <div key={index} className="flex-shrink-0 snap-start">
                                    <CategoryCircle
                                        title={category.title}
                                        imageSrc={category.imageSrc}
                                        href={category.href}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Collection Header & Toolbar */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">{collectionTitle}</h1>

                        <CollectionToolbar productCount={filteredProducts.length} />
                    </div>
                </div>
            </section>

            {/* Main Content: Sidebar & Grid */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Hidden on mobile, typically controlled by a drawer/toggle in real responsive implementation */}
                    <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                No products found matching your filters.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
