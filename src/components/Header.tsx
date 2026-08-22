'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Coffee, Menu, X, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { cart, totalItems, totalPrice, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Kahveler', href: '/kategori/kahveler' },
    { name: 'Şuruplar', href: '/kategori/suruplar' },
    { name: 'Süt Ürünleri', href: '/kategori/sut-urunleri' },
    { name: 'Doğal Ürünler', href: '/kategori/dogal-urunler' },
  ];

  return (
    <>
      {/* Üst Bilgi Barı */}
      <div className="bg-[#2B170E] text-[#FAEDCD] text-xs font-medium py-2 px-4 text-center">
        ☕ 500 TL ve üzeri siparişlerde <span className="text-[#D4A373] font-bold">Ücretsiz Kargo!</span>
      </div>

      {/* Ana Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#2B170E]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobil Menü Butonu */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#2B170E] hover:bg-[#FAEDCD]/50 transition"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="w-10 h-10 rounded-full bg-[#2B170E] text-[#D4A373] flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition">
                  D
                </span>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-wider text-[#2B170E] font-serif">DEM</span>
                  <span className="text-[10px] tracking-widest text-[#3A5A40] font-semibold uppercase -mt-1">Gıda & Kahve</span>
                </div>
              </Link>
            </div>

            {/* Masaüstü Menü */}
            <nav className="hidden lg:flex items-center gap-8 font-medium text-[#2B170E] text-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors ${
                      isActive ? 'text-[#D4A373] font-bold' : 'hover:text-[#D4A373]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Sağ Taraf: Sepet Butonu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-[#2B170E] text-[#FAEDCD] hover:bg-[#2B170E]/90 transition shadow-sm"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4A373] text-[#2B170E] font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü Listesi */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-[#2B170E]/10 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium ${
                  pathname === link.href ? 'text-[#D4A373] font-bold' : 'text-[#2B170E]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Sepet Çekmecesi (Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Arka Plan Karartması */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FDFBF7] p-6 shadow-2xl flex flex-col justify-between">
              
              {/* Üst Başlık & Ürünler Listesi */}
              <div>
                <div className="flex items-center justify-between border-b border-[#2B170E]/10 pb-4">
                  <h2 className="text-lg font-bold text-[#2B170E] flex items-center gap-2">
                    <ShoppingBag size={20} /> Sepetiniz ({totalItems})
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-md text-gray-500 hover:text-[#2B170E]"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">Sepetinizde henüz ürün bulunmuyor.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#2B170E]/5 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-[#FAEDCD]/30"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-[#2B170E] truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500">{item.variant || item.category}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-600">Adet: {item.quantity}</span>
                            <span className="font-bold text-sm text-[#2B170E]">{(item.price * item.quantity).toFixed(2)} TL</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Alt Toplam & Ödeme Butonu */}
              {cart.length > 0 && (
                <div className="border-t border-[#2B170E]/10 pt-4 space-y-4">
                  <div className="flex justify-between text-base font-bold text-[#2B170E]">
                    <span>Toplam</span>
                    <span>{totalPrice.toFixed(2)} TL</span>
                  </div>
                  <Link
                    href="/odeme"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-[#D4A373] hover:bg-[#D4A373]/90 text-[#2B170E] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center shadow-lg transition text-center"
                  >
                    Siparişi Tamamla
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}