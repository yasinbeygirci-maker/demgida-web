// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  created_at: string;
  items: OrderItem[];
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'demgida2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  // Sayfa açıldığında oturumu sessionStorage'dan kontrol et (tarayıcı kapanınca sıfırlanır)
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('demgida_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem('demgida_admin_auth', 'true');
      setIsAuthenticated(true);
      setErrorMsg('');
      fetchOrders();
    } else {
      setErrorMsg('Geçersiz yönetici şifresi.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('demgida_admin_auth');
    setIsAuthenticated(false);
    setInputPassword('');
    setOrders([]);
    setSelectedOrder(null);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Güvenli sunucu API üzerinden siparişleri çek
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Siparişler çekilemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderNumber: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderNumber,
          status: newStatus,
          trackingNumber: trackingInput || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Listeyi güncelle
        setOrders((prev) =>
          prev.map((o) =>
            o.order_number === orderNumber
              ? { ...o, status: newStatus as any, tracking_number: trackingInput || o.tracking_number }
              : o
          )
        );
        if (selectedOrder && selectedOrder.order_number === orderNumber) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, status: newStatus as any, tracking_number: trackingInput || prev.tracking_number } : null
          );
        }
      }
    } catch (err) {
      console.error('Güncelleme hatası:', err);
    } finally {
      setUpdating(false);
    }
  };

  // --- 1. GİRİŞ EKRANI (Giriş Yapılmamışsa Sadece Bu Görünür) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1c1917] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#292524] rounded-3xl p-8 border border-neutral-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#8C6D53] rounded-2xl mx-auto flex items-center justify-center text-white font-serif font-bold text-2xl mb-4 shadow-lg">
              D
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Desotti Yönetim Paneli
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Devam etmek için yönetici şifrenizi girin
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Yönetici Şifresi"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full bg-[#1c1917] border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#8C6D53] transition"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 text-center font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#8C6D53] hover:bg-[#735740] text-white py-3 rounded-xl text-sm font-semibold transition cursor-pointer shadow-md"
            >
              Panele Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. YÖNETİM PANELİ ANA EKRANI ---
  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900">
      {/* Üst Bar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-[#3b2314] text-white rounded-xl flex items-center justify-center font-serif font-bold">
            D
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight">Desotti Coffee Admin</h1>
            <p className="text-[11px] text-neutral-400">Sipariş & Sevkiyat Yönetimi</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={fetchOrders}
            className="text-xs bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-lg font-medium transition"
          >
            Yenile
          </button>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg font-medium transition"
          >
            Güvenli Çıkış
          </button>
        </div>
      </header>

      {/* İçerik Alanı */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol Kolon: Sipariş Listesi */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-base">Gelen Siparişler ({orders.length})</h2>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-neutral-400">Siparişler yükleniyor...</div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-sm text-neutral-400">Henüz kayıtlı sipariş bulunmuyor.</div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.order_number}
                  onClick={() => {
                    setSelectedOrder(order);
                    setTrackingInput(order.tracking_number || '');
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedOrder?.order_number === order.order_number
                      ? 'border-[#8C6D53] bg-[#fdfbf9]'
                      : 'border-neutral-200/70 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs font-mono">{order.order_number}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status === 'preparing'
                          ? 'Hazırlanıyor'
                          : order.status === 'shipped'
                          ? 'Kargoda'
                          : order.status === 'delivered'
                          ? 'Teslim Edildi'
                          : 'İptal'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-neutral-800 mt-1">{order.customer_name}</p>
                    <p className="text-[11px] text-neutral-400">
                      {new Date(order.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-serif block">
                      {order.total_amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {order.items?.length || 0} Kalem Ürün
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Kolon: Seçili Sipariş Detayı */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm">
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <span className="text-[11px] text-neutral-400 font-mono block">Sipariş No</span>
                <h3 className="font-serif font-bold text-xl">{selectedOrder.order_number}</h3>
              </div>

              {/* Müşteri Bilgileri */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-neutral-400 text-[10px]">
                  Müşteri & Teslimat
                </h4>
                <p><strong className="text-neutral-700">İsim:</strong> {selectedOrder.customer_name}</p>
                <p><strong className="text-neutral-700">E-Posta:</strong> {selectedOrder.customer_email}</p>
                <p><strong className="text-neutral-700">Telefon:</strong> {selectedOrder.customer_phone}</p>
                <p><strong className="text-neutral-700">Adres:</strong> {selectedOrder.shipping_address}</p>
              </div>

              {/* Ürünler */}
              <div className="space-y-2 text-xs border-t border-neutral-100 pt-4">
                <h4 className="font-semibold uppercase tracking-wider text-neutral-400 text-[10px]">
                  Sepet İçeriği
                </h4>
                <div className="space-y-1.5">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-neutral-50">
                      <span>{item.name} <strong className="text-neutral-500">x{item.quantity}</strong></span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Durum & Kargo Güncelleme */}
              <div className="space-y-3 border-t border-neutral-100 pt-4">
                <h4 className="font-semibold uppercase tracking-wider text-neutral-400 text-[10px]">
                  Sipariş Durumunu Güncelle
                </h4>

                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Kargo Takip No</label>
                  <input
                    type="text"
                    placeholder="Örn: YK-987654321"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedOrder.order_number, 'preparing')}
                    className="text-[11px] font-semibold py-2 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition"
                  >
                    Hazırlanıyor
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedOrder.order_number, 'shipped')}
                    className="text-[11px] font-semibold py-2 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition"
                  >
                    Kargoya Ver
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedOrder.order_number, 'delivered')}
                    className="text-[11px] font-semibold py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
                  >
                    Teslim Edildi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-32 text-center text-sm text-neutral-400">
              Detayları görmek için soldaki listeden bir sipariş seçin.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}