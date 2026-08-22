// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function HomePage() {
  const featuredCoffees = products.filter((p) => p.category === 'kahveler');
  const featuredSyrups = products.filter((p) => p.category === 'suruplar').slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Banner */}
      <Hero />

      {/* Öne Çıkan Kahveler Bölümü */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8C6D53] block mb-2">
              Özel Seçki
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">
              Desotti Kahve Koleksiyonu
            </h2>
          </div>
          <Link
            href="/kategori/kahveler"
            className="mt-4 md:mt-0 text-sm font-semibold text-[#8C6D53] hover:text-[#3b2314] transition flex items-center gap-1"
          >
            Tüm Kahveleri Gör <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCoffees.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Gurme Şuruplar Bölümü */}
      <section className="bg-white border-y border-neutral-200/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8C6D53] block mb-2">
                Aroma & Lezzet
              </span>
              <h2 className="text-3xl font-serif font-bold text-neutral-900">
                Kahve & Kokteyl Şurupları
              </h2>
            </div>
            <Link
              href="/kategori/suruplar"
              className="mt-4 md:mt-0 text-sm font-semibold text-[#8C6D53] hover:text-[#3b2314] transition flex items-center gap-1"
            >
              Tüm Şurupları Gör <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSyrups.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Kurumsal ve Şirket Bilgileri Bölümü */}
      <section className="bg-white py-12 border-t border-neutral-200/60 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Kurumsal & İletişim Bilgileri</h2>
            <p className="text-xs text-neutral-500 mt-1">Resmi şirket ve yasal ticari bilgilerimiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* 1. Unvan ve Vergi */}
            <div className="bg-[#fcfaf7] p-6 rounded-2xl border border-neutral-200/60 space-y-2">
              <h3 className="font-semibold text-neutral-900 text-base mb-3 border-b pb-2">Ticari Unvan</h3>
              <p className="text-xs text-neutral-700 font-medium">ERZİNCAN DEM GIDA İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ[cite: 1]</p>
              <p className="text-xs text-neutral-600"><strong>Vergi Dairesi:</strong> Fevzipaşa[cite: 1]</p>
              <p className="text-xs text-neutral-600"><strong>Vergi No:</strong> 3770988662[cite: 1]</p>
            </div>

            {/* 2. Adres */}
            <div className="bg-[#fcfaf7] p-6 rounded-2xl border border-neutral-200/60 space-y-2">
              <h3 className="font-semibold text-neutral-900 text-base mb-3 border-b pb-2">Merkez Adres</h3>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Çarşı Mah. Kerkük Cad. No: 19<br />
                Merkez / Erzincan[cite: 1]
              </p>
            </div>

            {/* 3. İletişim & E-posta */}
            <div className="bg-[#fcfaf7] p-6 rounded-2xl border border-neutral-200/60 space-y-2">
              <h3 className="font-semibold text-neutral-900 text-base mb-3 border-b pb-2">İletişim Kanalları</h3>
              <p className="text-xs text-neutral-600"><strong>Destek E-posta:</strong> destek@demgida.com</p>
              <p className="text-xs text-neutral-600"><strong>Müşteri Hattı:</strong> 0533 030 53 24</p>
              <p className="text-xs text-emerald-600 font-medium pt-1">✔ 256-bit SSL & iyzico Güvencesi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}