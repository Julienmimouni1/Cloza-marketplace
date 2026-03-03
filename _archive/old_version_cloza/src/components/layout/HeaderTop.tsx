'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiShoppingBag } from 'react-icons/fi';

export default function HeaderTop() {
    return (
        <div className="bg-white border-b border-[#e5e5e5] py-[15px] hidden md:block">
            <div className="max-w-[1400px] mx-auto px-5 flex items-center justify-between gap-5">

                {/* Left: Logo (Image Restored) */}
                <div className="flex-shrink-0">
                    <Link href="/" className="block">
                        <Image
                            src="https://clozastore.com/cdn/shop/files/cloza_logo_black.png?v=1764354851&width=300"
                            alt="CLOZA"
                            width={120}
                            height={40}
                            className="h-10 w-auto object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Center: Search Bar - Exact Legacy Styling */}
                <div className="flex-1 max-w-[600px] relative">
                    <form action="/search" method="get" className="w-full relative">
                        <input
                            type="search"
                            name="q"
                            placeholder="Search products..."
                            className="w-full px-5 py-3 border border-[#e5e5e5] rounded-[50px] bg-[#f5f5f5] text-black text-sm focus:outline-none focus:border-black transition-colors placeholder-[#999999]"
                            autoComplete="off"
                            aria-label="Search"
                        />
                        <input type="hidden" name="type" value="product" />
                    </form>
                </div>

                {/* Right: Icons */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link href="/account" className="flex items-center justify-center w-10 h-10 text-black hover:text-[#666666] transition-colors" aria-label="Account">
                        <FiUser className="w-6 h-6" />
                    </Link>

                    <Link href="/cart" className="flex items-center justify-center w-10 h-10 text-black hover:text-[#666666] transition-colors relative" aria-label="Cart">
                        <FiShoppingBag className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                            0
                        </span>
                    </Link>
                </div>

            </div>
        </div>
    );
}
