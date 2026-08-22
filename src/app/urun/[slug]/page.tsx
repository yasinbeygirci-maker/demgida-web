'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { addToCart } = useCart();

  const product = products.find((p) => (p.slug || p.id) === slug);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 dark:bg-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link href="/" className="text-sm font-medium text-amber-600 hover:underline dark:text-amber-400">
            ← Tüm Ürünlere Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-2 md:p-10">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {product.category}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">
                {product.name}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {product.description || 'Yüksek kaliteli hammaddeler ile özenle üretilmiş lezzet.'}
              </p>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-400">Birim Fiyat</span>
                  <p className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                    ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-6 w-full rounded-2xl bg-amber-600 py-3.5 text-center text-base font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.99]"
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}