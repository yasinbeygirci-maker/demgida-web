// src/components/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (addToCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <Link href={`/urun/${product.slug}`} className="block relative bg-[#fdfbf9] p-6 text-center">
        {product.tag && (
          <span className="absolute top-3 left-3 bg-[#3b2314] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider z-10">
            {product.tag}
          </span>
        )}
        {/* Görsel Kutusu */}
        <div className="w-full h-64 flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-56 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('Yüklenemeyen görsel:', product.image);
            }}
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest block mb-1">
            {product.weight}
          </span>
          <Link href={`/urun/${product.slug}`}>
            <h3 className="font-serif font-bold text-neutral-900 text-base leading-snug group-hover:text-[#8C6D53] transition line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block leading-none">Fiyat</span>
            <span className="text-lg font-bold text-neutral-900 font-serif">
              {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="bg-[#C49A6C] hover:bg-[#B3895B] text-white text-xs font-medium px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}