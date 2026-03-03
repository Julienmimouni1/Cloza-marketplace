import React from 'react';
import '../../styles/components/text-with-icon.css';

const TextWithIcon = () => {
    return (
        <section className="shopify-section section-text-with-icon my-10">
            <div className="container mx-auto px-4 md:px-10">
                <div className="text-with-icon--wrapper flex flex-col md:flex-row justify-between items-center gap-6 w-full">
                    {/* Item 1: Order Value */}
                    <div className="text-with-icon--item bg-black text-white rounded-[30px] px-8 py-4 flex items-center gap-4 shadow-lg transition-transform transform hover:-translate-y-1 w-full md:w-auto justify-start md:justify-center">
                        <div className="text-with-icon--icon w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gray-600 rounded-full">
                            <svg width="20" height="20" viewBox="0 0 17 19" fill="none" className="cart--icon text-white">
                                <path d="M13.8624 5.125H3.13686C2.21555 5.125 1.45202 5.83932 1.39074 6.75859L0.749072 16.3836C0.681732 17.3936 1.48288 18.25 2.49519 18.25H14.5041C15.5164 18.25 16.3176 17.3936 16.2502 16.3836L15.6086 6.75859C15.5472 5.83932 14.7837 5.125 13.8624 5.125Z" stroke="currentColor" strokeWidth="1.5"></path>
                                <path d="M12 7.75V4.25C12 2.317 10.433 0.75 8.5 0.75C6.567 0.75 5 2.317 5 4.25V7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"></path>
                            </svg>
                        </div>
                        <div className="text-with-icon--content min-w-max">
                            <h3 className="text-with-icon--heading text-base font-bold font-sans">Order Value</h3>
                            <p className="text-with-icon--desc text-xs text-gray-400 mt-0.5">Minimum order: €100</p>
                        </div>
                    </div>

                    {/* Item 2: Brands */}
                    <div className="text-with-icon--item bg-black text-white rounded-[30px] px-8 py-4 flex items-center gap-4 shadow-lg transition-transform transform hover:-translate-y-1 w-full md:w-auto justify-start md:justify-center">
                        <div className="text-with-icon--icon w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gray-600 rounded-full">
                            <svg width="20" height="20" viewBox="0 0 18 19" fill="none" className="text-white">
                                <path d="M7.96875 15.6875C11.9556 15.6875 15.1875 12.4556 15.1875 8.4688C15.1875 4.48194 11.9556 1.25 7.96875 1.25C3.98194 1.25 0.75 4.48194 0.75 8.4688C0.75 12.4556 3.98194 15.6875 7.96875 15.6875Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M13.0732 13.5742L17.2497 17.7508" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                        <div className="text-with-icon--content min-w-max">
                            <h3 className="text-with-icon--heading text-base font-bold font-sans">Brands</h3>
                            <p className="text-with-icon--desc text-xs text-gray-400 mt-0.5">Discover over 300 brands</p>
                        </div>
                    </div>

                    {/* Item 3: Payments */}
                    <div className="text-with-icon--item bg-black text-white rounded-[30px] px-8 py-4 flex items-center gap-4 shadow-lg transition-transform transform hover:-translate-y-1 w-full md:w-auto justify-start md:justify-center">
                        <div className="text-with-icon--icon w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gray-600 rounded-full">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white overflow-visible">
                                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                        <div className="text-with-icon--content min-w-max">
                            <h3 className="text-with-icon--heading text-base font-bold font-sans">Payments</h3>
                            <p className="text-with-icon--desc text-xs text-gray-400 mt-0.5">Payment in 60 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TextWithIcon;
