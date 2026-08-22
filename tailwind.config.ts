import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        brand: {
          navy: "#0F172A",
          dark: "#1E293B",
          accent: "#38BDF8",
          neutral: "#F8FAFC",
          muted: "#64748B",
        },
      },
      letterSpacing: {
        "premium-tight": "-0.04em",
        "premium-normal": "0",
        "premium-wide": "0.1em",
        "premium-widest": "0.25em",
      },
    },
  },
  plugins: [],
};
export default config;