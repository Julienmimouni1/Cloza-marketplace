
import React from 'react';

interface CategoryCircleProps {
    title: string;
    imageSrc: string;
    href: string;
}

const CategoryCircle: React.FC<CategoryCircleProps> = ({ title, imageSrc, href }) => {
    return (
        <a href={href} className="shop-by-category-item flex flex-col items-center justify-center gap-3 text-center group">
            <div className="shop-by-category-image-wrapper w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-gray-200 group-hover:border-black transition-colors duration-300">
                <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
            </div>
            <div className="shop-by-category-title text-sm font-bold font-condensed text-gray-900 group-hover:text-black">
                {title}
            </div>
        </a>
    );
};

export default CategoryCircle;
