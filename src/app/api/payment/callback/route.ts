import { NextResponse } from 'next/server';
import { iyzico } from '@/lib/iyzico';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(
        new URL('/odeme/sonuc?status=failure&message=Token+bulunamadi', req.url),
        303
      );
    }

    const paymentResult: any = await new Promise((resolve) => {
      iyzico.checkoutForm.retrieve({ token }, (err: any, result: any) => {
        if (err) {
          return resolve({ status: 'failure', errorMessage: err.message });
        }
        resolve(result);
      });
    });

    if (paymentResult.status === 'success' && paymentResult.paymentStatus === 'SUCCESS') {
      return NextResponse.redirect(
        new URL(
          `/odeme/sonuc?status=success&orderId=${paymentResult.basketId || paymentResult.paymentId}`,
          req.url
        ),
        303
      );
    } else {
      const errorMsg = encodeURIComponent(paymentResult.errorMessage || 'Odeme basarisiz oldu');
      return NextResponse.redirect(
        new URL(`/odeme/sonuc?status=failure&message=${errorMsg}`, req.url),
        303
      );
    }
  } catch (error: any) {
    console.error('Callback hatası:', error);
    return NextResponse.redirect(
      new URL('/odeme/sonuc?status=failure&message=Sunucu+hatasi', req.url),
      303
    );
  }
}