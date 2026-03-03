import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            borderRadius: {
                'product': '14px',
                'button': '50px',
            },
            fontFamily: {
                sans: ['var(--font-instrument-sans)', 'sans-serif'],
                condensed: ['var(--font-roboto-condensed)', 'sans-serif'],
                serif: ['var(--font-playfair-display)', 'serif'],
            },
        },
    },
    plugins: [],
};
export default config;
