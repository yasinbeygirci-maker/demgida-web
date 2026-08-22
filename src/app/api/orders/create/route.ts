// src/app/api/orders/create/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { products } from '@/data/products';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buyer, items, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Sepetiniz boş.' }, { status: 400 });
    }

    // GÜVENLİK KONTROLÜ: Fiyatları istemciden değil, doğrudan ürün veritabanından doğrula
    let verifiedTotal = 0;
    const verifiedItems = items.map((item: any) => {
      const dbProduct = products.find((p) => p.id === item.id || p.slug === item.slug);
      const actualPrice = dbProduct ? dbProduct.price : Number(item.price || 0);
      const quantity = Math.max(1, parseInt(item.quantity || 1, 10));

      verifiedTotal += actualPrice * quantity;

      return {
        id: item.id,
        name: dbProduct ? dbProduct.name : item.name,
        price: actualPrice,
        quantity: quantity,
      };
    });

    const orderId = `DEM-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Supabase'e güvenli sunucu istemcisiyle kaydet
    const { error: dbError } = await supabaseServer.from('orders').insert([
      {
        order_number: orderId,
        customer_name: buyer.fullName,
        customer_email: buyer.email,
        customer_phone: buyer.phone,
        shipping_address: `${shippingAddress.address}, ${shippingAddress.district} / ${shippingAddress.city}`,
        total_amount: verifiedTotal, // Doğrulanmış gerçek tutar
        status: 'preparing',
        payment_status: 'paid',
        payment_method: 'credit_card',
        items: verifiedItems,
      },
    ]);

    if (dbError) {
      console.error('Sipariş kayıt hatası:', dbError);
    }

    // 2. Resend E-posta Bildirimi
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
      await fetch(`${appUrl}/api/send-order-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId,
          customer: {
            name: buyer.fullName,
            email: buyer.email,
            phone: buyer.phone,
          },
          shippingAddress: shippingAddress,
          items: verifiedItems,
          totalAmount: verifiedTotal,
        }),
      });
    } catch (emailErr) {
      console.warn('E-posta bildirim hatası:', emailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      totalAmount: verifiedTotal,
    });
  } catch (error: any) {
    console.error('Kritik Sipariş Hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş işlenirken bir güvenlik hatası oluştu.' },
      { status: 500 }
    );
  }
}