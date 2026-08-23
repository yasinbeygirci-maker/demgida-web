'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import { Product } from '@/data/products';

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
      className="group flex flex-col justify-between overflow-hidden rounded-[28px] border border-brand-navy/5 bg-white p-3.5 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-navy/10 hover:-translate-y-1.5"
    >
      <Link href={`/urun/${product.slug || product.id}`} className="block overflow-hidden rounded-[20px] bg-brand-neutral relative">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Lüks Rozet (Badge) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy/90 backdrop-blur-md text-brand-neutral text-[10px] font-bold tracking-premium-wide uppercase shadow-lg border border-white/10">
              <Sparkles size={11} className="text-brand-accent" />
              {product.badge}
            </span>
          </div>
        )}

        {/* Hızlı Bakış Overlay */}
        <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/95 backdrop-blur-md text-brand-navy text-[10px] font-bold py-2.5 px-5 rounded-full shadow-2xl tracking-premium-widest uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500 border border-brand-navy/5">
            İncele
          </span>
        </div>
      </Link>

      <div className="mt-5 flex flex-1 flex-col justify-between px-1 pb-1">
        <div>
          {/* Yöre / Rakım Bilgisi */}
          {product.origin && (
            <div className="flex items-center gap-1 text-brand-muted text-[11px] font-medium mb-1">
              <MapPin size={12} className="text-brand-accent flex-shrink-0" />
              <span className="truncate">{product.origin}</span>
              {product.altitude && <span className="text-[10px] opacity-70 ml-1">({product.altitude})</span>}
            </div>
          )}

          <Link href={`/urun/${product.slug || product.id}`}>
            <h3 className="line-clamp-2 text-base font-bold text-brand-navy leading-snug transition-colors group-hover:text-brand-accent tracking-premium-tight">
              {product.name}
            </h3>
          </Link>

          {/* Tadım Notaları (Flavor Pills) */}
          {product.tastingNotes && product.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.tastingNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-brand-neutral text-brand-navy/80 text-[10px] font-medium border border-brand-navy/5"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 pt-3 border-t border-brand-navy/5">
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
