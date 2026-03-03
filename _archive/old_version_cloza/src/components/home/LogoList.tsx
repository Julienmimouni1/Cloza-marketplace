import React from 'react';
import Image from 'next/image';
import '../../styles/components/logo-list.css';

const logos = [
    "https://clozastore.com/cdn/shop/files/63.png?v=1762583962",
    "https://clozastore.com/cdn/shop/files/66.png?v=1762583963",
    "https://clozastore.com/cdn/shop/files/69.png?v=1762583961",
    "https://clozastore.com/cdn/shop/files/68.png?v=1762583961",
    "https://clozastore.com/cdn/shop/files/65.png?v=1762583962",
    "https://clozastore.com/cdn/shop/files/70.png?v=1762583961",
    "https://clozastore.com/cdn/shop/files/72.png?v=1762583962",
    "https://clozastore.com/cdn/shop/files/64.png?v=1762583962",
    "https://clozastore.com/cdn/shop/files/3_9330f11e-735e-4119-a6b1-0eb4860c6efe.png?v=1762583961"
];

const LogoList = () => {
    return (
        <section className="shopify-section section-logo-list">
            <div className="section-wrapper section-spacing scheme-primary section-solid">
                <div className="container-fullwidth">
                    <div className="logo-list--main none-background">
                        {/* 
                            Inline style for custom properties. 
                            Legacy used data-marquee-speed="15", CSS uses var(--animation_speed).
                            We set it to 15s.
                        */}
                        <div
                            className="logo-list--wrapper marquee images-equal-height ltr-direction"
                            style={{ '--animation_speed': '30s' } as React.CSSProperties}
                        >
                            {/* Render twice for infinite loop */}
                            <div className="logo-list--wrapper-inner">
                                {logos.map((src, index) => (
                                    <div className="logo--item" key={`logo-1-${index}`}>
                                        <div className="logo-item--inner">
                                            <Image
                                                src={src}
                                                alt="Brand Logo"
                                                width={250}
                                                height={250}
                                                className="lazyload no-js-hidden"
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="logo-list--wrapper-inner">
                                {logos.map((src, index) => (
                                    <div className="logo--item" key={`logo-2-${index}`}>
                                        <div className="logo-item--inner">
                                            <Image
                                                src={src}
                                                alt="Brand Logo"
                                                width={250}
                                                height={250}
                                                className="lazyload no-js-hidden"
                                                style={{ objectFit: 'contain' }}
                                            />
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
};

export default LogoList;
