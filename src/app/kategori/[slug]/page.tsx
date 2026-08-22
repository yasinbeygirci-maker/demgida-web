// src/app/kategori/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const categoryMeta: Record<string, { title: string; desc: string }> = {
  kahveler: {
    title: 'Özel Seri Kahveler',
    desc: 'Geleneksel Türk kahvesi, dibek kahvesi ve özel kavrum lezzetler.',
  },
  suruplar: {
    title: 'Kahve & Kokteyl Şurupları',
    desc: 'Kahvelerinize ve içeceklerinize eşsiz lezzet katacak aromatik gurme şuruplar.',
  },
  'dogal-urunler': {
    title: 'Doğal Ürünler',
    desc: 'Yöresel ve katkısız taze doğal lezzetler.',
  },
  'sut-urunleri': {
    title: 'Süt ve Şarküteri Ürünleri',
    desc: 'Yöresel tulum peynirleri, geleneksel tereyağları ve taze mandıra kaşar çeşitleri.',
  },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentCategory = categoryMeta[slug] || {
    title: 'Ürünlerimiz',
    desc: 'Dem Gıda kalitesiyle özenle seçilmiş ürünler.',
  };

  const filteredProducts = products.filter((p) => p.category === slug);

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <nav className="flex justify-center text-xs text-neutral-400 space-x-2">
            <Link href="/" className="hover:text-neutral-700 transition">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium capitalize">{slug.replace('-', ' ')}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
            {currentCategory.title}
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {currentCategory.desc}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200/80">
            <p className="text-neutral-500 text-sm">Bu kategoride henüz listelenen ürün bulunmuyor.</p>
            <Link href="/" className="inline-block mt-4 text-xs font-semibold text-[#8C6D53] hover:underline">
              Tüm Ürünleri Gör →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}