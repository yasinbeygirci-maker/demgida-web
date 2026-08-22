import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Dem Gıda | Taze Kahve & Doğal Ürünler",
  description: "Nitelikli kahveler, gurme şuruplar ve doğal ürünler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="antialiased min-h-screen bg-[#FDFBF7]">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}