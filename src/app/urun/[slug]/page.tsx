// src/app/urun/[slug]/page.tsx
'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Sadece Türk kahveleri için isteğe bağlı varyant (örnek)
  const isCoffee = product.category === 'kahveler' && !product.slug.includes('sicak-cikolata') && !product.slug.includes('gold');

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb / Navigasyon Yolu */}
        <nav className="flex items-center text-xs text-neutral-400 space-x-2 mb-8">
          <Link href="/" className="hover:text-neutral-700 transition">Ana Sayfa</Link>
          <span>/</span>
          <Link href={`/kategori/${product.category}`} className="hover:text-neutral-700 transition capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-neutral-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Ürün Detay Kartı */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-neutral-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sol Kolon: Ürün Görseli */}
          <div className="lg:col-span-6 bg-[#fdfbf9] rounded-2xl p-8 flex items-center justify-center relative min-h-[380px] border border-neutral-100">
            {product.tag && (
              <span className="absolute top-4 left-4 bg-[#3b2314] text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                {product.tag}
              </span>
            )}
            <div className="w-full h-80 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-72 max-w-full object-contain"
              />
            </div>
          </div>

          {/* Sağ Kolon: Ürün Bilgileri ve Satın Alma */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#8C6D53] block mb-1">
                  {product.weight}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">
                {(product.price * quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed pt-2 border-t border-neutral-100">
                {product.description}
              </p>

              {/* Ürün Özellik Maddeleri */}
              {product.features && product.features.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-2">
                    Öne Çıkan Özellikler
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D53]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Adet Seçimi ve Sepete Ekle */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex gap-4">
                {/* Adet Butonları */}
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-neutral-600 hover:bg-neutral-200 font-bold transition"
                  >
                    -
                  </button>
                  <span className="px-4 font-semibold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-neutral-600 hover:bg-neutral-200 font-bold transition"
                  >
                    +
                  </button>
                </div>

                {/* Sepete Ekle Butonu */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#C49A6C] hover:bg-[#B3895B] text-white py-3.5 px-6 rounded-xl font-medium transition duration-200 cursor-pointer shadow-sm active:scale-95"
                >
                  Sepete Ekle
                </button>
              </div>

              {addedMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-200 text-center animate-fade-in">
                  Ürün başarıyla sepete eklendi!
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2">
                <span>Taze & Orijinal Ürün</span>
                <span>Aynı Gün Kargo</span>
                <span>Güvenli Paketleme</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}