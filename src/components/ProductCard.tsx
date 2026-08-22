'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

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
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <Link href={`/urun/${product.slug || product.id}`} className="block overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {product.category}
          </span>
          <Link href={`/urun/${product.slug || product.id}`}>
            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-neutral-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">Fiyat</span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-amber-700 active:scale-95"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}