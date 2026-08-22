import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
const Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = formData.get('token');

  // İyzico'dan ödeme sonucunu doğrula
  const request = {
    locale: 'tr',
    conversationId: '123456789', // İsteğe bağlı
    token: token,
  };

  const result: any = await new Promise((resolve) => {
    iyzipay.checkoutFormAuth.retrieve(request, (err: any, result: any) => {
      resolve(result);
    });
  });

  if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
    // 1. Ödeme Başarılı: Veritabanında siparişi 'paid' olarak güncelle
    await supabase
      .from('orders')
      .update({ status: 'paid', iyzico_transaction_id: result.paymentId })
      .eq('id', result.basketId);

    // 2. Kullanıcıyı başarı sayfasına yönlendir
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/odeme-basarili`, 302);
  } else {
    // Ödeme başarısız
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/odeme-basarisiz`, 302);
  }
}