import { NextResponse } from 'next/server';
import { iyzipay } from '@/lib/iyzico';

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const result = await new Promise<any>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(body, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'failure', errorMessage: error?.message || 'Ödeme başlatılamadı.' },
      { status: 500 }
    );
  }
}