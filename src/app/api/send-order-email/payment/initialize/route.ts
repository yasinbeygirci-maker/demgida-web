import { NextResponse } from 'next/server';
import { iyzico } from '@/lib/iyzico';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buyer, items, shippingAddress, totalPrice } = body;

    // Ad - Soyad ayrıştırma (iyzico zorunlu alanları)
    const nameParts = (buyer?.fullName || 'Misafir Kullanici').trim().split(' ');
    const surname = nameParts.length > 1 ? nameParts.pop() : 'Musteri';
    const name = nameParts.join(' ') || 'Misafir';

    const orderPrice = Number(totalPrice || 0).toFixed(2);
    const conversationId = `order_${Date.now()}`;
    const basketId = `B_${Date.now()}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const requestPayload = {
      locale: 'tr',
      conversationId: conversationId,
      price: orderPrice,
      paidPrice: orderPrice,
      currency: 'TRY',
      basketId: basketId,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${appUrl}/api/payment/callback`,
      enabledInstallments: [1],
      buyer: {
        id: buyer?.email || 'BYR_01',
        name: name,
        surname: surname,
        gsmNumber: buyer?.phone || '+905000000000',
        email: buyer?.email || 'siparis@demgida.com',
        identityNumber: '11111111111',
        registrationAddress: shippingAddress?.address || 'Adres',
        ip: '85.34.78.112',
        city: shippingAddress?.city || 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: buyer?.fullName || 'Alici',
        city: shippingAddress?.city || 'Istanbul',
        country: 'Turkey',
        address: shippingAddress?.address || 'Adres',
      },
      billingAddress: {
        contactName: buyer?.fullName || 'Alici',
        city: shippingAddress?.city || 'Istanbul',
        country: 'Turkey',
        address: shippingAddress?.address || 'Adres',
      },
      basketItems: (items || []).map((item: any) => ({
        id: String(item.id || 'ITEM_1'),
        name: item.name || 'Urun',
        category1: item.category || 'Kahve',
        itemType: 'PHYSICAL',
        price: Number(item.price * (item.quantity || 1)).toFixed(2),
      })),
    };

    return new Promise((resolve) => {
      iyzico.checkoutFormInitialize.create(requestPayload, (err: any, result: any) => {
        if (err) {
          console.error('iyzico SDK Hatası:', err);
          return resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }));
        }

        if (result?.status !== 'success') {
          console.error('iyzico Red Yanıtı:', result?.errorMessage);
          return resolve(
            NextResponse.json(
              { success: false, error: result?.errorMessage || 'iyzico formu oluşturulamadı.' },
              { status: 400 }
            )
          );
        }

        return resolve(
          NextResponse.json({
            success: true,
            checkoutFormContent: result.checkoutFormContent,
            paymentPageUrl: result.paymentPageUrl,
            token: result.token,
          })
        );
      });
    });
  } catch (error: any) {
    console.error('API Sunucu Hatası:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}