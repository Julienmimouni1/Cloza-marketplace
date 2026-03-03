"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CollectionToolbarProps {
    productCount: number;
}

const CollectionToolbar: React.FC<CollectionToolbarProps> = ({ productCount }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'featured';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium font-sans text-gray-600">{productCount} products</span>

            <select
                value={currentSort}
                onChange={handleSortChange}
                className="border-gray-300 border rounded-none py-2 pl-3 pr-8 text-sm focus:border-black focus:ring-0 cursor-pointer bg-white"
                aria-label="Sort by"
            >
                <option value="featured">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="created-desc">Date, new to old</option>
                <option value="created-asc">Date, old to new</option>
            </select>
        </div>
    );
};

export default CollectionToolbar;
