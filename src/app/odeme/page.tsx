// src/app/odeme/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function OdemePage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tcNo: '', // iyzico için zorunlu alan
    city: '',
    district: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal =
    cart && cart.length > 0
      ? cart.reduce((acc: number, item: any) => acc + Number(item.price || 0) * (item.quantity || 1), 0)
      : 864;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const orderItems =
        cart && cart.length > 0
          ? cart
          : [
              {
                id: '1',
                name: 'Etiyopya Yirgacheffe Filtre Kahve',
                price: 864,
                quantity: 1,
                category: 'Kahve',
              },
            ];

      // iyzico entegrasyonu için hazırladığımız api/checkout rotasına istek atıyoruz
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: orderItems,
          total: subtotal,
          formData: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            tc_no: formData.tcNo,
            address: `${formData.address}, ${formData.district} / ${formData.city}`,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Ödeme başlatılamadı.');
      }

      // Sepeti temizle
      if (clearCart) clearCart();

      // iyzico ödeme sayfasına (sandbox veya live) yönlendir
      if (data.paymentForm && data.paymentForm.paymentPageUrl) {
        window.location.href = data.paymentForm.paymentPageUrl;
      } else {
        throw new Error('İyzico ödeme sayfası URL alınamadı.');
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'Ödeme işlenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Kolon: Teslimat ve iyzico Bilgileri Formu */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Teslimat & Ödeme Bilgileri</h2>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
              iyzico Sandbox Modu
            </span>
          </div>
          <p className="text-neutral-500 text-sm mb-6">
            Güvenli ödeme için lütfen bilgilerinizi eksiksiz doldurun.
          </p>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" d="M12 8v4m0 4h.01" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Ad Soyad *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ad Soyad"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D53]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  E-Posta Adresi *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@demgida.com"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D53]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05xxxxxxxxx"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D53]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                TC Kimlik Numarası * <span className="text-[10px] text-neutral-400 lowercase">(iyzico doğrulaması için)</span>
              </label>
              <input
                type="text"
                name="tcNo"
                required
                maxLength={11}
                value={formData.tcNo}
                onChange={handleChange}
                placeholder="11 haneli TC Kimlik No"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D53]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  İl / Şehir *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="İl"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D53]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  İlçe *
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="İlçe"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D53]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Açık Adres *
              </label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="Mahalle, Cadde, Sokak, Daire No..."
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8C6D53]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#C49A6C] hover:bg-[#B3895B] text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'iyzico Güvenli Ödeme Sayfasına Yönlendiriliyor...' : 'iyzico ile Güvenli Ödemeye Geç'}
            </button>
          </form>
        </div>

        {/* Sağ Kolon: Sipariş Özeti */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 sticky top-6">
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-6">
              Sipariş Özeti ({cart?.length || 1})
            </h3>

            {cart && cart.length > 0 ? (
              cart.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-neutral-100">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || '/products/yirgacheffe.png'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-neutral-500">Adet: {item.quantity || 1}</p>
                  </div>
                  <span className="font-semibold text-sm text-neutral-900">
                    {(Number(item.price) * (item.quantity || 1)).toFixed(2)} TL
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-4 py-4 border-b border-neutral-100">
                <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src="/products/yirgacheffe.png" alt="Kahve" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 text-sm">Etiyopya Yirgacheffe Filtre Kahve</h4>
                  <p className="text-xs text-neutral-500">1000g · Adet: 1</p>
                </div>
                <span className="font-semibold text-sm text-neutral-900">864.00 TL</span>
              </div>
            )}

            <div className="space-y-3 py-4 border-b border-neutral-100 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Ara Toplam:</span>
                <span className="font-medium text-neutral-900">{subtotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Kargo Ücreti:</span>
                <span className="font-medium text-emerald-600">Ücretsiz</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="text-base font-semibold text-neutral-900">Toplam Ödenecek:</span>
              <span className="text-xl font-bold text-neutral-900">{subtotal.toFixed(2)} TL</span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 pt-4">
              <span>256-bit SSL Koruma</span>
              <span>iyzico Güvencesi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}