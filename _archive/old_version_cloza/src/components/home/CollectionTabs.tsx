"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/styles/components/collection-tabs.css";

// Mock Data
const PRODUCTS = [
    {
        id: 1,
        title: "Throw sherpa blanket",
        brand: "Hero Brand",
        price: "€10,00",
        image: "https://clozastore.com/cdn/shop/files/download_1.jpg?v=1764065877",
        link: "/products/blanket",
        soldOut: false
    },
    {
        id: 2,
        title: "Ayesha",
        brand: "Savana",
        price: "€10,00",
        image: "https://clozastore.com/cdn/shop/files/download.jpg?v=1764065767",
        link: "/products/ayesha",
        soldOut: true
    },
    {
        id: 3,
        title: "NOOR",
        brand: "Brand ABC",
        price: "€100,00",
        image: "https://clozastore.com/cdn/shop/files/imgi_405_8509337733bc6fbef52de916ba256a0ac227f640f6b741cadf1bab54c8ba65de.png?v=1763101647",
        link: "/products/noor",
        soldOut: true
    },
    {
        id: 4,
        title: "Dog Days Little Notes",
        brand: "Brand Name",
        price: "€9,83",
        image: "https://clozastore.com/cdn/shop/files/download_1.jpg?v=1764065877",
        link: "/products/notes",
        soldOut: false
    },
];

const TABS = [
    { id: 1, name: "New Products" },
    { id: 2, name: "Beauty & Wellness" },
    { id: 3, name: "Food & Beverages" },
    { id: 4, name: "Textile" },
];

export default function CollectionTabs() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <section
            id="shopify-section-template--26557376495998__collection_tabs_TrqJCh"
            className="shopify-section section-collections-tab my-20"
        >
            <div className="w-full bg-white py-12">
                <div className="container-fullwidth px-4 md:px-10">
                    <div className="section--header text-center mb-10">
                        <div className="section--header-inner">
                            <h2 className="section--heading heading-font text-4xl font-bold" data-saos="slide-up">
                                Shop by Category
                            </h2>
                        </div>
                    </div>

                    <div className="collections-tab--wrapper horizontal-tab">
                        <div data-animation-effect="bounce">
                            <ul className="list-inline collections-tab--menu flex flex-wrap justify-center gap-6 mb-12">
                                {TABS.map((tab) => (
                                    <li
                                        key={tab.id}
                                        className={`collections-tab--menu-item relative pb-1`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <span
                                            className={`collections-tab--menu-item-link cursor-pointer heading-font text-lg font-bold px-2 
                                            ${activeTab === tab.id ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
                                        >
                                            {tab.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="collections-tab--menu-content">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {PRODUCTS.map((product) => (
                                    <div
                                        key={product.id}
                                        className="collections-tab--item-box group"
                                    >
                                        <Link
                                            href={product.link}
                                            className="collections-tab--menu-content-item-inner block"
                                        >
                                            <div className="collections-tab--menu-content-image overflow-hidden rounded-[30px] relative aspect-square mb-4">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="product-info flex flex-col gap-1">
                                                <div className="product-brand heading-font text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                    {product.brand}
                                                </div>

                                                <div className="product-title-row flex justify-between items-start">
                                                    <div className="product-title heading-font font-bold text-base text-black pr-2">
                                                        {product.title}
                                                    </div>
                                                    <div className="product-price heading-font font-bold text-black whitespace-nowrap">
                                                        {product.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Actions Row */}
                                        <div className="product-actions mt-4">
                                            {product.soldOut ? (
                                                <button disabled className="w-full py-3 bg-gray-300 text-white font-bold uppercase rounded-lg cursor-not-allowed">
                                                    Sold out
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    {/* Qty Selector */}
                                                    <div className="qty-selector flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 w-32 bg-white">
                                                        <button className="text-xl font-bold hover:text-gray-600 px-2">-</button>
                                                        <span className="text-sm font-bold">1</span>
                                                        <button className="text-xl font-bold hover:text-gray-600 px-2">+</button>
                                                    </div>
                                                    {/* Add to Cart */}
                                                    <button className="flex-1 py-3 bg-black text-white font-bold uppercase rounded-lg hover:bg-gray-800 transition-colors text-sm">
                                                        Add to cart
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
