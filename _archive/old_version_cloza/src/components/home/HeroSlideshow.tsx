'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../../styles/components/slideshow.css';

const HeroSlideshow = () => {
    return (
        <section className="shopify-section section-slideshow">
            <div className="section-wrapper">
                <div className="slideshow--outer">
                    <Swiper
                        modules={[Autoplay, Pagination, EffectFade]}
                        effect="fade"
                        loop={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        className="slideshow--wrapper"
                    >
                        {/* Slide 1 */}
                        <SwiperSlide className="slideshow--item">
                            <div className="slideshow--content-wrapper">
                                <div className="slideshow--image absolute inset-0 w-full h-full">
                                    <Image
                                        src="https://clozastore.com/cdn/shop/files/4.png?v=1762584102"
                                        alt="Discover our Universe"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}
                                </div>
                                <div className="slideshow--content d-center-left m-center-center text-left m-text-center absolute top-1/2 left-4 md:left-16 transform -translate-y-1/2 z-10 text-white max-w-xl p-4">
                                    <h2 className="slideshow--heading h2 text-5xl md:text-7xl font-bold mb-6">
                                        <span className="slideshow--heading-animate block">
                                            Discover our Universe
                                        </span>
                                    </h2>
                                    <div className="slideshow--button-box mt-8">
                                        <Link href="/collections/all" className="button button--primary bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors uppercase tracking-wide">
                                            DISCOVER
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Can add more slides here if needed, legacy HTML showed one main active slide in the snippet but implies a slideshow */}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default HeroSlideshow;
