"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSidebarProps {
    onFilterChange?: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for price inputs
    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

    // Sync state with URL params on initial load or URL change
    useEffect(() => {
        setMinPrice(searchParams.get('min_price') || '');
        setMaxPrice(searchParams.get('max_price') || '');
    }, [searchParams]);

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        if (type === 'min') setMinPrice(value);
        else setMaxPrice(value);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set('min_price', minPrice);
        else params.delete('min_price');

        if (maxPrice) params.set('max_price', maxPrice);
        else params.delete('max_price');

        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Handle Brand and Availability Checkboxes
    const handleCheckboxChange = (group: string, value: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentValues = params.get(group)?.split(',') || [];

        let newValues;
        if (checked) {
            newValues = [...currentValues, value];
        } else {
            newValues = currentValues.filter(v => v !== value);
        }

        if (newValues.length > 0) {
            params.set(group, newValues.join(','));
        } else {
            params.delete(group);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const isChecked = (group: string, value: string) => {
        const currentValues = searchParams.get(group)?.split(',') || [];
        return currentValues.includes(value);
    };

    return (
        <div className="filter-sidebar flex flex-col gap-8">
            {/* Availability Filter */}
            <div className="filter-column-item">
                <h6 className="filter-heading text-lg font-bold font-condensed mb-4">Availability</h6>
                <div className="filter-option-list">
                    <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-3 group cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="availability-in-stock"
                                    checked={isChecked('availability', 'in_stock')}
                                    onChange={(e) => handleCheckboxChange('availability', 'in_stock', e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black transition-all"
                                />
                                <svg
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path
                                        d="M3 8L6 11L11 3.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <label htmlFor="availability-in-stock" className="text-sm text-gray-700 cursor-pointer group-hover:text-black">
                                In stock
                            </label>
                        </li>
                        <li className="flex items-center gap-3 group cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="availability-out-of-stock"
                                    checked={isChecked('availability', 'out_of_stock')}
                                    onChange={(e) => handleCheckboxChange('availability', 'out_of_stock', e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black transition-all"
                                />
                                <svg
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path
                                        d="M3 8L6 11L11 3.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <label htmlFor="availability-out-of-stock" className="text-sm text-gray-700 cursor-pointer group-hover:text-black">
                                Out of stock
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Price Filter */}
            <div className="filter-column-item">
                <h6 className="filter-heading text-lg font-bold font-condensed mb-4">Price</h6>
                <div className="price-inputs flex items-center gap-4">
                    <div className="price-input-item flex-1">
                        <label htmlFor="price-from" className="block text-xs text-gray-500 mb-1">From</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                            <input
                                type="number"
                                id="price-from"
                                value={minPrice}
                                onChange={(e) => handlePriceChange('min', e.target.value)}
                                onBlur={applyPriceFilter}
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black text-sm"
                                placeholder="0"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="price-input-item flex-1">
                        <label htmlFor="price-to" className="block text-xs text-gray-500 mb-1">To</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                            <input
                                type="number"
                                id="price-to"
                                value={maxPrice}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                                onBlur={applyPriceFilter}
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black text-sm"
                                placeholder="1000"
                                min="0"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Brand Filter */}
            <div className="filter-column-item">
                <h6 className="filter-heading text-lg font-bold font-condensed mb-4">Brand</h6>
                <div className="filter-option-list">
                    <ul className="flex flex-col gap-3">
                        {['Brand ABC', 'Brand Name', 'Hero Brand', 'Savana', 'Sleep Company'].map((brand, index) => (
                            <li key={index} className="flex items-center gap-3 group cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`brand-${index}`}
                                        checked={isChecked('brand', brand)}
                                        onChange={(e) => handleCheckboxChange('brand', brand, e.target.checked)}
                                        className="peer h-5 w-5 cursor-pointer appearance-none border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black transition-all"
                                    />
                                    <svg
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                    >
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <label htmlFor={`brand-${index}`} className="text-sm text-gray-700 cursor-pointer group-hover:text-black">
                                    {brand}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
