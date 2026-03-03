"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "@/styles/components/image-with-text.css";

export default function ImageWithText() {
    return (
        <section
            id="shopify-section-template--26557376495998__image_with_text_B7jpzW"
            className="shopify-section section-image-with-text"
        >
            <div className="section-wrapper section-spacing scheme-primary section-solid">
                <div className="container-fullwidth">
                    <div className="image-with-text--outer">
                        <div className="row no-gutters image-with-text--wrapper image--position-right content-background-enabled adapt-to-align">
                            <div className="col-lg-5 col-md-5 col-sm-12 col-12">
                                <div className="image-with-text--image media-wrapper width-100 height-100">
                                    <div className="media d-media-fixed" style={{ "--image_ratio": "99.0%" } as React.CSSProperties}>
                                        <Image
                                            src="https://clozastore.com/cdn/shop/files/Mobile_Become_a_Seller_1080_x_1080_px.png?v=1764060760"
                                            alt="Cloza Marketplace"
                                            width={1080}
                                            height={1080}
                                            className="no-js-hidden lazyautosizes ls-is-cached lazyloaded"
                                            style={{ objectPosition: "50.0% 50.0%" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-7 col-md-7 col-sm-12 col-12">
                                <div className="image-with-text--content small-padding">
                                    <div className="variety-heading">
                                        <h2 className="image-with-text--heading h4" data-saos="slide-up">
                                            About <span className="markers-text accent-font no-markers"><em>Cloza</em></span>
                                        </h2>
                                    </div>

                                    <div className="image-with-text--desc rte text-large" data-saos="slide-up">
                                        <p>
                                            CLOZA is a modern B2B marketplace designed to <strong>simplify wholesale purchasing and connect manufacturers, wholesalers, and retailers</strong> in one transparent and efficient platform.
                                        </p>
                                        <p>
                                            <br />
                                            Our mission is clear: to <strong>streamline and centralize B2B transactions</strong>, making it easier than ever for professionals to buy and sell in bulk with confidence and speed.
                                        </p>
                                    </div>

                                    <div className="image-with-text--button" data-saos="slide-up">
                                        <Link href="/pages/about-us" className="button normal-button animated solid-button">
                                            <span className="btn-icon">
                                                <svg fill="none" viewBox="0 0 100 100" className="w-5 h-5">
                                                    <path
                                                        d="M98.232 53.2256C98.6928 52.304 98.8464 51.2287 98.8464 50.1535C98.8464 50.1535 98.8464 50.1535 98.8464 49.8463C98.8464 49.5391 98.8464 49.6927 98.8464 49.5391C98.8464 48.4639 98.6928 47.3886 98.232 46.467C97.9247 45.5454 97.3103 44.9309 96.6959 44.1629C96.6959 44.0093 96.5423 43.8557 96.3887 43.7021L56.1442 3.45758C52.7649 0.078268 47.2351 0.078268 43.8558 3.45758C40.4765 6.83689 40.4765 12.3667 43.8558 15.746L69.3542 41.2444H9.60188C4.84012 41.2444 1 45.0845 1 49.8463C1 54.6081 4.84012 58.4482 9.60188 58.4482H69.3542L43.8558 83.9466C40.4765 87.3259 40.4765 92.8557 43.8558 96.235C45.5454 97.9247 47.6959 98.6927 50 98.6927C52.3041 98.6927 54.4545 97.9247 56.1442 96.235L96.3887 55.9905C96.3887 55.9905 96.5423 55.6833 96.6959 55.5297C97.3103 54.9153 97.7711 54.1472 98.232 53.2256Z"
                                                        fill="currentColor"
                                                    ></path>
                                                </svg>
                                            </span>

                                            <span className="button--text">Read More</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
