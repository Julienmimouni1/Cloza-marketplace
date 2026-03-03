'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-10 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Left Column: Text */}
                    <div className="w-full md:w-1/2 flex flex-col items-start text-left space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
                            Discover our Universe
                        </h1>
                        <p className="text-lg text-gray-600 max-w-lg">
                            The first B2B marketplace dedicated to professionals in the cosmetics and food industries.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <Link
                                href="/suppliers"
                                className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all text-sm uppercase tracking-wide"
                            >
                                Discover The Suppliers
                            </Link>
                            <Link
                                href="/signup"
                                className="px-8 py-3 bg-transparent border-2 border-black text-black rounded-full font-bold hover:bg-black hover:text-white transition-all text-sm uppercase tracking-wide"
                            >
                                Signup for Free
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="w-full md:w-1/2 relative h-[400px] md:h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
                        {/* Placeholder image resembling cosmetics/liquids */}
                        <Image
                            src="https://placehold.co/800x1000/e5e5e5/333333?text=Hero+Image"
                            alt="Cosmetics and Food Products"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* If user has a specific image they can replace the src above */}
                    </div>
                </div>
            </div>
        </section>
    );
}
