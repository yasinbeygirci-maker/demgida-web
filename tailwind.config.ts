import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#2B170E",
          green: "#3A5A40",
          accent: "#D4A373",
          light: "#FAEDCD",
          surface: "#FDFBF7",
        },
      },
    },
  },
  plugins: [],
};
export default config;