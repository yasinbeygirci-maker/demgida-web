// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  status: 'preparing' | 'shipped' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed';
  tracking_number?: string;
  created_at: string;
  items: OrderItem[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'demgida2026';

  // Giriş oturum kontrolü
  useEffect(() => {
    const authStatus = sessionStorage.getItem('dem_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      sessionStorage.setItem('dem_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError(false);
      fetchOrders();
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dem_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as Order[]) || []);
    } catch (err) {
      console.warn('Veritabanından sipariş çekilemedi, örnek veriler gösteriliyor.');
      // Tablo boş veya henüz hazır değilse örnek veri:
      setOrders([
        {
          id: '1',
          order_number: 'DEM-849201',
          customer_name: 'Yasin Beygirci',
          customer_email: 'yasin@ostlertech.com',
          customer_phone: '05313567796',
          shipping_address: 'Hancı Mahallesi Akasya Sokak No:7, Merkez / Erzincan',
          total_amount: 864,
          status: 'preparing',
          payment_status: 'paid',
          tracking_number: '',
          created_at: new Date().toISOString(),
          items: [
            { id: '1', name: 'Etiyopya Yirgacheffe Filtre Kahve (1000g)', price: 864, quantity: 1 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderNumber: string, newStatus: Order['status'], tracking?: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderNumber,
          status: newStatus,
          trackingNumber: tracking !== undefined ? tracking : undefined,
        }),
      });

      if (!res.ok) throw new Error('Güncelleme başarısız.');

      setOrders((prev) =>
        prev.map((o) =>
          o.order_number === orderNumber
            ? { ...o, status: newStatus, tracking_number: tracking !== undefined ? tracking : o.tracking_number }
            : o
        )
      );

      if (selectedOrder && selectedOrder.order_number === orderNumber) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus, tracking_number: tracking !== undefined ? tracking : prev.tracking_number } : null
        );
      }
    } catch (error) {
      alert('Sipariş güncellenirken hata oluştu.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // İstatistikler
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? Number(o.total_amount) : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'preparing').length;
  const filteredOrders = selectedFilter === 'all' ? orders : orders.filter((o) => o.status === selectedFilter);

  // Şifre Giriş Ekranı
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1c1917] flex items-center justify-center p-4">
        <div className="bg-[#292524] p-8 rounded-2xl w-full max-w-md border border-neutral-800 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-[#fafaf9] tracking-wide">DEM GIDA YÖNETİM</h1>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">Yönetici Giriş Paneli</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-neutral-400 font-semibold mb-2 tracking-wider">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin..."
                  className="w-full bg-[#1c1917] border border-neutral-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#C49A6C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-200 text-xs"
                >
                  {showPassword ? 'Gizle' : 'Göster'}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-red-400 text-xs bg-red-950/40 p-3 rounded-lg border border-red-900/50">
                Hatalı şifre girdiniz.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#C49A6C] hover:bg-[#B3895B] text-white py-3.5 rounded-xl font-medium transition cursor-pointer"
            >
              Panele Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900">
      {/* Üst Bar */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#3b2314] rounded-lg flex items-center justify-center font-serif font-bold text-white">
            D
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight">DEM GIDA & KAHVE</h1>
            <p className="text-xs text-neutral-500">Sipariş & Sevkiyat Kontrol Paneli</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg font-medium transition cursor-pointer"
          >
            Yenile
          </button>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium transition cursor-pointer"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Toplam Sipariş</span>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{orders.length} Adet</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Hazırlanan / Bekleyen</span>
            <p className="text-2xl font-bold text-amber-600 mt-2">{pendingOrders} Sipariş</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Toplam Hacim (Tahsil Edilen)</span>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              {totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </p>
          </div>
        </div>

        {/* Filtre Butonları */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'preparing', label: 'Hazırlanıyor' },
            { key: 'shipped', label: 'Kargoya Verildi' },
            { key: 'completed', label: 'Tamamlandı' },
            { key: 'cancelled', label: 'İptal' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                selectedFilter === tab.key
                  ? 'bg-[#3b2314] text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sipariş Listesi Tablosu */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-neutral-400 text-sm">Siparişler yükleniyor...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-sm">Bu filtreye uygun sipariş bulunamadı.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Sipariş No</th>
                    <th className="py-3 px-4">Müşteri</th>
                    <th className="py-3 px-4">Tutar</th>
                    <th className="py-3 px-4">Ödeme</th>
                    <th className="py-3 px-4">Durum</th>
                    <th className="py-3 px-4">Tarih</th>
                    <th className="py-3 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.order_number} className="hover:bg-neutral-50/50 transition">
                      <td className="py-4 px-4 font-mono font-semibold text-neutral-900">
                        #{order.order_number}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-neutral-900">{order.customer_name}</div>
                        <div className="text-xs text-neutral-400">{order.customer_phone}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-neutral-900">
                        {Number(order.total_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            order.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.payment_status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === 'preparing'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {order.status === 'preparing' && 'Hazırlanıyor'}
                          {order.status === 'shipped' && 'Kargoya Verildi'}
                          {order.status === 'completed' && 'Tamamlandı'}
                          {order.status === 'cancelled' && 'İptal Edildi'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-neutral-500">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingInput(order.tracking_number || '');
                          }}
                          className="bg-[#faf8f5] hover:bg-[#efece6] border border-neutral-200 text-neutral-800 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                          Detay & Yönet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Sipariş Detay Modalı */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="font-bold text-neutral-900 font-mono text-base">#{selectedOrder.order_number}</h3>
                <span className="text-xs text-neutral-500">Sipariş Detayı</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Müşteri ve Teslimat Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#fcfaf7] p-4 rounded-xl border border-neutral-200">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                    Müşteri Bilgileri
                  </span>
                  <p className="font-medium text-neutral-900 text-sm mt-1">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-neutral-600">{selectedOrder.customer_email}</p>
                  <p className="text-xs text-neutral-600">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                    Teslimat Adresi
                  </span>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">{selectedOrder.shipping_address}</p>
                </div>
              </div>

              {/* Ürünler */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                  Sipariş Edilen Ürünler
                </span>
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Ürün</th>
                        <th className="py-2.5 px-3 text-center">Adet</th>
                        <th className="py-2.5 px-3 text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {selectedOrder.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-medium text-neutral-900">{it.name}</td>
                          <td className="py-2.5 px-3 text-center">{it.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-medium">
                            {(Number(it.price) * it.quantity).toFixed(2)} TL
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kargo Takip Numarası & Durum Güncelleme */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Kargo Takip Kodu
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Örn: YK-198472910"
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-[#C49A6C]"
                  />
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_number, selectedOrder.status, trackingInput)}
                    disabled={statusUpdating}
                    className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Kodu Kaydet
                  </button>
                </div>
              </div>

              {/* Sipariş Durum Değiştirme Butonları */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                  Sipariş Durumunu Güncelle
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_number, 'preparing')}
                    disabled={statusUpdating}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      selectedOrder.status === 'preparing'
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    Hazırlanıyor
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_number, 'shipped', trackingInput)}
                    disabled={statusUpdating}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      selectedOrder.status === 'shipped'
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    Kargoya Verildi
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.order_number, 'completed')}
                    disabled={statusUpdating}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      selectedOrder.status === 'completed'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    Tamamlandı
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}