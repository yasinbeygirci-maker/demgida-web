import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "../components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Dem Gıda | Premium Kahve & Doğal Ürünler",
  description: "Nitelikli kahveler, gurme şuruplar ve doğal ürünler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans min-h-screen bg-brand-neutral selection:bg-brand-accent/20">
        <CartProvider>
          <Header />
          <main>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
