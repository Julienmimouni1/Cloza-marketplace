
import React from 'react';

export interface Product {
    id: string | number;
    title: string;
    price: string;
    originalPrice?: string;
    imageSrc: string;
    secondImageSrc?: string;
    brand?: string;
    badge?: string;
    soldOut?: boolean;
    href: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="product-card group relative flex flex-col">
            <div className="product-card-inner relative overflow-hidden rounded-product border-none bg-white">
                {/* Image */}
                <a href={product.href} className="block relative aspect-[3/4] overflow-hidden rounded-product">
                    <img
                        src={product.imageSrc}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${product.secondImageSrc ? 'group-hover:opacity-0' : ''}`}
                        loading="lazy"
                    />
                    {product.secondImageSrc && (
                        <img
                            src={product.secondImageSrc}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            loading="lazy"
                        />
                    )}
                </a>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.soldOut && (
                        <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                            Sold out
                        </span>
                    )}
                    {product.badge && !product.soldOut && (
                        <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                            {product.badge}
                        </span>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="product-card-detail pt-4 flex flex-col flex-grow">
                {product.brand && (
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                        {product.brand}
                    </div>
                )}
                <a href={product.href} className="text-base font-medium text-gray-900 hover:underline mb-1 font-condensed">
                    {product.title}
                </a>
                <div className="price flex items-center gap-2 mb-4">
                    <span className="text-gray-900 font-semibold font-sans">{product.price}</span>
                    {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm font-sans">{product.originalPrice}</span>
                    )}
                </div>

                {/* Quick Add Form Section */}
                <div className="mt-auto">
                    {product.soldOut ? (
                        <button disabled className="w-full py-2.5 px-4 bg-gray-100 text-gray-400 cursor-not-allowed text-sm font-bold uppercase tracking-wide rounded-button">
                            Sold Out
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button className="w-full py-2.5 px-4 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-bold uppercase tracking-wide rounded-button font-condensed">
                                Add to cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
