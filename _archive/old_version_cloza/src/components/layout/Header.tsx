'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        <div className="header-sticky bg-white sticky top-0 z-50 shadow-sm border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-10">
                {/* NAVIGATION BAR (Desktop) */}
                <nav className="header--nav hidden md:block py-4">
                    <ul className="flex justify-center items-center gap-10">
                        <li>
                            <Link href="/new" className="text-black font-bold hover:text-gray-600 text-sm uppercase tracking-wide">
                                New products
                            </Link>
                        </li>
                        <li>
                            <Link href="/collections/beauty" className="text-black font-medium hover:text-gray-600 text-sm uppercase tracking-wide flex items-center gap-1">
                                Beauty & Wellness
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Link>
                        </li>
                        <li>
                            <Link href="/collections/food" className="text-black font-medium hover:text-gray-600 text-sm uppercase tracking-wide flex items-center gap-1">
                                Food & Beverages
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Link>
                        </li>
                        <li>
                            <Link href="/collections/textile" className="text-black font-medium hover:text-gray-600 text-sm uppercase tracking-wide flex items-center gap-1">
                                Textile
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu Toggle (Visible on Mobile Only) */}
                <div className="md:hidden py-4 flex items-center justify-between">
                    <button type="button" className="p-2" aria-label="Menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </button>
                    <Link href="/" className="text-xl font-bold tracking-widest text-black uppercase font-sans">
                        CLOZA
                    </Link>
                    <div className="w-8"></div> {/* Spacer for alignment */}
                </div>
            </div>
        </div>
    );
}
