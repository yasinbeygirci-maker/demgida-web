import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
const Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

export async function POST(req: Request) {
  try {
    const { cart, total, formData } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Sepetiniz boş' }, { status: 400 });
    }

    // 0. ADIM: Stok Kontrolü (product_variants tablosundaki stock_qua sütunundan)
    for (const item of cart) {
      const { data: variant, error: stockError } = await supabase
        .from('product_variants')
        .select('id, stock_qua')
        .eq('id', item.id)
        .single();

      if (stockError || !variant) {
        return NextResponse.json(
          { error: `"${item.name}" için ürün seçimi (varyant) sistemde bulunamadı.` },
          { status: 400 }
        );
      }

      if (variant.stock_qua !== undefined && variant.stock_qua < item.quantity) {
        return NextResponse.json(
          { error: `Üzgünüz, "${item.name}" için yeterli stok kalmadı. (Kalan Stok: ${variant.stock_qua})` },
          { status: 400 }
        );
      }
    }// 0. ADIM: Stok Kontrolü (product_variants tablosundaki stock_qua sütunundan)
    for (const item of cart) {
      const { data: variant, error: stockError } = await supabase
        .from('product_variants')
        .select('id, stock_qua')
        .eq('id', item.id)
        .single();

      if (stockError || !variant) {
        return NextResponse.json(
          { error: `"${item.name}" için ürün seçimi (varyant) sistemde bulunamadı.` },
          { status: 400 }
        );
      }

      if (variant.stock_qua !== undefined && variant.stock_qua < item.quantity) {
        return NextResponse.json(
          { error: `Üzgünüz, "${item.name}" için yeterli stok kalmadı. (Kalan Stok: ${variant.stock_qua})` },
          { status: 400 }
        );
      }
    }

    // 1. Supabase'e Siparişi Kaydet
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        tc_no: formData.tc_no,
        shipping_address: formData.address,
        total_price: total,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) throw error;

    // 2. Sipariş Kalemlerini Kaydet
    const items = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.id, // varyant id
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    await supabase.from('order_items').insert(items);

    // 3. İyzico Ödeme Formu İsteği Hazırlama
    const request = {
      locale: 'tr',
      conversationId: order.id,
      price: total.toString(),
      paidPrice: total.toString(),
      currency: 'TRY',
      basketId: order.id,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/callback`,
      buyer: {
        id: order.id,
        name: formData.name.split(' ')[0],
        surname: formData.name.split(' ')[1] || 'Müşteri',
        gsmNumber: formData.phone,
        email: formData.email,
        identityNumber: formData.tc_no,
        registrationAddress: formData.address,
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: formData.name,
        city: 'Istanbul',
        address: formData.address,
      },
      basketItems: cart.map((item: any) => ({
        id: item.id,
        name: item.name,
        category1: item.category || 'Genel',
        itemType: 'PHYSICAL',
        price: item.price.toString(),
      })),
    };

    // İyzico'dan token alma
    const paymentForm = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    return NextResponse.json({ success: true, paymentForm });

  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Ödeme başlatılamadı' }, { status: 500 });
  }
}