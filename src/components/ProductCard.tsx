'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  slug?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-brand-navy/5 bg-white p-3 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-navy/10 hover:-translate-y-1"
    >
      <Link href={`/urun/${product.slug || product.id}`} className="block overflow-hidden rounded-[18px] bg-brand-neutral relative">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        {/* Hızlı Bakış Overlay */}
        <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-md text-brand-navy text-[10px] font-bold py-2 px-4 rounded-full shadow-xl tracking-widest uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            İncele
          </span>
        </div>
      </Link>

      <div className="mt-5 flex flex-1 flex-col justify-between px-1 pb-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-premium-widest text-brand-accent mb-2 block">
            {product.category}
          </span>
          <Link href={`/urun/${product.slug || product.id}`}>
            <h3 className="line-clamp-2 text-base font-bold text-brand-navy leading-tight transition-colors group-hover:text-brand-accent tracking-premium-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-brand-muted uppercase tracking-premium-widest leading-none mb-1">Fiyat</span>
            <span className="text-lg font-black text-brand-navy tracking-premium-tight">
              ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-brand-navy px-4 py-3 text-[10px] font-bold text-brand-neutral shadow-lg shadow-brand-navy/10 transition-all hover:bg-brand-dark uppercase tracking-premium-widest"
          >
            EKLE
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
