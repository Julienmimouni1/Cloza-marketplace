'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="shopify-section-sections--26557376790910__footer" className="shopify-section shopify-section-group-footer-group section-footer font-sans">

            {/* How To Order Section */}
            <div className="section-wrapper scheme-quattuordenary section-solid index text-default py-12">
                <div className="container-fullwidth">
                    <div className="footer-top--wrapper text-center mb-10">
                        <h2 className="footer-top--heading font-bold text-3xl mb-12">How to Order</h2>

                        <div className="footer-top--grid grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-20">
                            {/* Step 1 */}
                            <div className="footer-top--item flex flex-col items-center">
                                <div className="footer-top--item-icon mb-4 p-4 bg-gray-50 rounded-full">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21L16.65 16.65"></path></svg>
                                </div>
                                <h3 className="footer-top--item-heading font-bold text-lg mb-2">Step 1</h3>
                                <div className="footer-top--item-text text-gray-600"><p className="font-semibold text-black">Find & Select Products</p><p className="text-sm mt-1">Browse the catalog to find profitable deals and add items to your cart.</p></div>
                            </div>
                            {/* Step 2 */}
                            <div className="footer-top--item flex flex-col items-center">
                                <div className="footer-top--item-icon mb-4 p-4 bg-gray-50 rounded-full">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"></path><path d="M3 6H21"></path><path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"></path></svg>
                                </div>
                                <h3 className="footer-top--item-heading font-bold text-lg mb-2">Step 2</h3>
                                <div className="footer-top--item-text text-gray-600"><p className="font-semibold text-black">Review & Adjust</p><p className="text-sm mt-1">Check your cart, ensure supplier requirements are met, and adjust quantities.</p></div>
                            </div>
                            {/* Step 3 */}
                            <div className="footer-top--item flex flex-col items-center">
                                <div className="footer-top--item-icon mb-4 p-4 bg-gray-50 rounded-full">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                </div>
                                <h3 className="footer-top--item-heading font-bold text-lg mb-2">Step 3</h3>
                                <div className="footer-top--item-text text-gray-600"><p className="font-semibold text-black">Checkout & Payment</p><p className="text-sm mt-1">Verify details and complete your purchase with a credit card or bank transfer.</p></div>
                            </div>
                            {/* Step 4 */}
                            <div className="footer-top--item flex flex-col items-center">
                                <div className="footer-top--item-icon mb-4 p-4 bg-gray-50 rounded-full">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                </div>
                                <h3 className="footer-top--item-heading font-bold text-lg mb-2">Step 4</h3>
                                <div className="footer-top--item-text text-gray-600"><p className="font-semibold text-black">Shipping & Support</p><p className="text-sm mt-1">Orders ship within 3 days. Have an issue? Submit a claim for fast resolution.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Black Footer */}
            <div className="footer--main bg-black text-white rounded-t-[40px] mt-10">
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Col 1: Brand */}
                        <div className="footer--block text-left">
                            <Link href="/" className="footer--logo-link block mb-6">
                                <span className="h3 font-bold uppercase tracking-widest text-white">CLOZA</span>
                            </Link>
                            <p className="footer--text text-gray-400 mb-8 text-sm leading-relaxed">
                                The ecosystem that enables independent brands and retailers to thrive.
                            </p>
                            {/* Social Links */}
                            <div className="social--icons flex gap-3">
                                {[
                                    { icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>, label: "Facebook" },
                                    { icon: <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>, label: "Instagram" }, // Simplified Instagram 
                                    { icon: <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.015 29.015 0 0 0 1 11.75a29.015 29.015 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29.015 29.015 0 0 0 .46-5.33 29.015 29.015 0 0 0-.46-5.33z"></path>, label: "YouTube" }
                                ].map((item, index) => (
                                    <a key={index} href="#" aria-label={item.label} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 text-white hover:bg-white hover:text-black transition-colors">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Col 2: Company */}
                        <div className="footer--block md:pl-8">
                            <h3 className="font-bold text-lg mb-6">Company</h3>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><Link href="/pages/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/pages/careers" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="/pages/legal" className="hover:text-white transition-colors">Legal</Link></li>
                            </ul>
                        </div>

                        {/* Col 3: Programs */}
                        <div className="footer--block">
                            <h3 className="font-bold text-lg mb-6">Programs</h3>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">New Products</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Beauty & Wellness</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Food & Beverages</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Textile</Link></li>
                            </ul>
                        </div>

                        {/* Col 4: Assistance */}
                        <div className="footer--block">
                            <h3 className="font-bold text-lg mb-6">Assistance</h3>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><Link href="/pages/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href="/pages/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                                <li><Link href="/pages/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <button className="flex items-center gap-2 hover:text-white">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                <span>EUR / EN</span>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-6 justify-center md:justify-end">
                            <Link href="/policies/privacy-policy" className="hover:text-white">Privacy policy</Link>
                            <Link href="/policies/refund-policy" className="hover:text-white">Refund policy</Link>
                            <Link href="/policies/terms-of-service" className="hover:text-white">Terms of service</Link>
                            <Link href="/policies/shipping-policy" className="hover:text-white">Shipping policy</Link>
                            <span>Copyright © {new Date().getFullYear()} Cloza Marketplace</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
