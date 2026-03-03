"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "@/styles/components/testimonials.css";

const TESTIMONIALS = [
    {
        id: 1,
        name: "Lucas Bernard",
        image: "https://clozastore.com/cdn/shop/files/give-image-of-a-european-man.png?v=1764396148",
        title: "Smooth & Hassle-Free Experience",
        quote:
            "Finally, a marketplace where everything just works! From browsing to checkout, the entire process was super smooth. Found exactly what I needed and got it delivered on time. Highly recommended!",
    },
    {
        id: 2,
        name: "Pierre Lambert",
        image: "https://clozastore.com/cdn/shop/files/give-image-of-a-front-facing-european-man.png?v=1764396231",
        title: "Great Variety, Great Prices",
        quote:
            "I now buy almost everything from this marketplace — it’s convenient, affordable, and trustworthy. The deals and offers are a bonus!",
    },
    {
        id: 3,
        name: "Jacques Charpentier",
        image: "https://clozastore.com/cdn/shop/files/generate-an-image-of-a-french-men-with-front-facing-face.png?v=1764396399",
        title: "Trusted Sellers, Quality Products",
        quote:
            "I was initially skeptical about online marketplaces, but this one restored my trust. Verified sellers, genuine reviews, and excellent product quality. I’ve already made three purchases!",
    },
    {
        id: 4,
        name: "Nathan Dupuis",
        image: "https://clozastore.com/cdn/shop/files/give-image-a-of-front-facing-spanish-men.png?v=1764396611",
        title: "Fast Delivery & Excellent Support",
        quote:
            "The delivery was faster than expected, and the support team helped me track my order instantly. Super impressed with the service. Will be shopping again soon!",
    },
    {
        id: 5,
        name: "Camille Moreau",
        image: "https://clozastore.com/cdn/shop/files/woman-applying-lipstick.jpg?v=1763109616",
        title: "Cloza Transformed Our Entire Supply Chain",
        quote:
            "Switching to this Cloza's marketplace has been one of the smartest decisions we’ve made. We now source from verified suppliers in minutes, not weeks. Seamless RFQs, transparent pricing, and reliable logistics have reduced our operational overhead by nearly 40%.",
    },
    {
        id: 6,
        name: "Léa Mercier",
        image: "https://clozastore.com/cdn/shop/files/three-women-discuss-over-coffee-and-laptops.jpg?v=1763109651",
        title: "Amazing Deals & Curated Collections",
        quote:
            "The curated collections make shopping super fun. I always find unique products I wouldn’t have discovered otherwise. Great marketplace for trend lovers!",
    },
];

export default function Testimonials() {
    return (
        <section
            id="shopify-section-template--26557376495998__testimonial_NpY8Jq"
            className="shopify-section section-testimonial"
        >
            <div className="section-wrapper section-spacing scheme-quaternary section-solid">
                <div className="container-fullwidth">
                    <div className="variety-heading section--header with--arrow text-left">
                        <div className="section--header-inner">
                            <h2 className="section--heading heading-font h2" data-saos="slide-up">
                                HAPPY <span className="markers-text heading-font outline--text">CUSTOMERS</span>
                            </h2>
                            <p className="section--description text-xlarge" data-saos="slide-up">
                                Discover why our customers love shopping with us! Read through genuine reviews and
                                testimonials <br /> from people who have experienced our products and services
                                firsthand.
                            </p>
                        </div>

                        <div className="swiper--custom-buttons d-none d-md-flex">
                            <div
                                className="swiper-button-prev swiper-button-prev-testimonial swiper-button button-square"
                                tabIndex={-1}
                                role="button"
                                aria-label="Previous slide"
                            >
                                <svg width="37" height="14" viewBox="0 0 37 14" fill="none">
                                    <path
                                        d="M16.4075 6.70996L5.02014 6.70996C2.72077 6.70996 0.859376 4.84857 0.859376 2.5492L0.859375 0.789845"
                                        className="st0 draw-arrow"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M10.8398 1.12561L16.4084 6.70978L10.8398 12.2783"
                                        className="st0 tail"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                            </div>
                            <div
                                className="swiper-button-next swiper-button-next-testimonial swiper-button button-square"
                                tabIndex={0}
                                role="button"
                                aria-label="Next slide"
                            >
                                <svg width="37" height="14" viewBox="0 0 37 14" fill="none">
                                    <path
                                        d="M16.4075 6.70996L5.02014 6.70996C2.72077 6.70996 0.859376 4.84857 0.859376 2.5492L0.859375 0.789845"
                                        className="st0 draw-arrow"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M10.8398 1.12561L16.4084 6.70978L10.8398 12.2783"
                                        className="st0 tail"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial--outer">
                        <Swiper
                            modules={[Navigation, Scrollbar]}
                            spaceBetween={20}
                            slidesPerView={1.2}
                            navigation={{
                                nextEl: ".swiper-button-next-testimonial",
                                prevEl: ".swiper-button-prev-testimonial",
                            }}
                            scrollbar={{ draggable: true }}
                            breakpoints={{
                                768: { slidesPerView: 1.5, spaceBetween: 20 },
                                992: { slidesPerView: 2, spaceBetween: 20 },
                            }}
                            className="testimonial--wrapper"
                        >
                            {TESTIMONIALS.map((testimonial) => (
                                <SwiperSlide key={testimonial.id} className="testimonial--item">
                                    <div className="testimonial--item-header border-bottom border-width-1">
                                        <div className="author--image border border-width-2 media-wrapper rounded small-image">
                                            <Image
                                                src={testimonial.image}
                                                alt={`Image of ${testimonial.name}`}
                                                width={250}
                                                height={250}
                                                className="object-cover"
                                                style={{ objectPosition: "50.0% 50.0%" }}
                                            />
                                        </div>

                                        <div className="author--name">
                                            <div className="author-title heading-font h5">{testimonial.name}</div>
                                        </div>

                                        <div className="quote--icon">
                                            <svg width="37" height="24" viewBox="0 0 37 24" fill="none">
                                                <path
                                                    d="M25.8577 23.9951L18.5676 23.9951L25.2882 2.56971e-05L36.793 2.67029e-05L25.8577 23.9951ZM7.29064 23.9951L0.000488281 23.9951L6.7211 2.40739e-05L18.2259 2.50797e-05L7.29064 23.9951Z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="testimonial--item-body">
                                        <div className="testimonial--rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className="icon-star"
                                                    width="16"
                                                    height="15"
                                                    viewBox="0 0 16 15"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M7.50495 0.509591C7.68396 -0.0444845 8.46787 -0.0444602 8.64685 0.509626L10.049 4.85044C10.129 5.09815 10.3596 5.26601 10.6199 5.26601H15.1626C15.7429 5.26601 15.9852 6.0078 15.5167 6.35034L11.8349 9.0427C11.626 9.19551 11.5386 9.46513 11.6182 9.71148L13.0231 14.0602C13.2019 14.6136 12.5676 15.0722 12.098 14.729L8.43011 12.0474C8.21919 11.8932 7.93273 11.8932 7.72183 12.0474L4.05474 14.729C3.58528 15.0723 2.95093 14.6139 3.12959 14.0604L4.53389 9.71005C4.6134 9.46374 4.52599 9.1942 4.31706 9.04142L0.635157 6.34899C0.166743 6.00645 0.409029 5.26467 0.989323 5.26467H5.53202C5.79232 5.26467 6.02294 5.09682 6.10296 4.84912L7.50495 0.509591Z"
                                                        fill="currentColor"
                                                    ></path>
                                                </svg>
                                            ))}
                                        </div>

                                        <div className="testimonial--title heading-font text-xlarge">
                                            {testimonial.title}
                                        </div>

                                        <p className="testimonial--desc text-medium">
                                            “{testimonial.quote}”
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}
