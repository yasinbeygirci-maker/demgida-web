// src/app/api/send-order-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, customer, items, shippingAddress, totalAmount } = body;

    const formattedTotal = Number(totalAmount).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const itemsHtml = items
      .map(
        (item: any) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px; font-size: 14px; color: #1f2937;">${item.name}</td>
          <td style="padding: 12px 8px; font-size: 14px; text-align: center; color: #4b5563;">${item.quantity}</td>
          <td style="padding: 12px 8px; font-size: 14px; text-align: right; color: #1f2937; font-weight: 500;">
            ${(item.price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </td>
        </tr>
      `
      )
      .join('');

    const emailTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background-color: #3b2314; padding: 24px; text-align: center;">
          <h1 style="color: #f9f5f0; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">DEM GIDA & KAHVE</h1>
        </div>
        
        <div style="padding: 28px;">
          <h2 style="color: #111827; font-size: 18px; margin-top: 0; margin-bottom: 12px;">Siparişiniz Alındı!</h2>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
            Merhaba <strong>${customer.name}</strong>, siparişiniz başarıyla oluşturuldu ve hazırlanmaya başlandı.
          </p>

          <div style="background-color: #f9fafb; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px; font-size: 13px; color: #374151;">
            <p style="margin: 4px 0;"><strong>Sipariş Kodu:</strong> #${orderId}</p>
            <p style="margin: 4px 0;"><strong>Teslimat Adresi:</strong> ${shippingAddress.address}, ${shippingAddress.district} / ${shippingAddress.city}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb; text-align: left;">
                <th style="padding: 8px; font-size: 12px; text-transform: uppercase; color: #6b7280;">Ürün</th>
                <th style="padding: 8px; font-size: 12px; text-transform: uppercase; color: #6b7280; text-align: center;">Adet</th>
                <th style="padding: 8px; font-size: 12px; text-transform: uppercase; color: #6b7280; text-align: right;">Tutar</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; text-align: right;">
            <p style="font-size: 16px; font-weight: 700; color: #111827; margin: 0;">
              Toplam Tutar: <span style="color: #92400e;">${formattedTotal} TL</span>
            </p>
          </div>
        </div>

        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">Dem Gıda & Kahve — Bizi tercih ettiğiniz için teşekkür ederiz.</p>
        </div>
      </div>
    `;

    // 1. Müşteriye Sipariş Onay E-Postası
    const customerEmailPromise = resend.emails.send({
      from: 'Dem Gıda <onboarding@resend.dev>', // Canlıda kendi domaininiz (örn: siparis@demgida.com)
      to: customer.email,
      subject: `Siparişiniz Alındı - #${orderId}`,
      html: emailTemplate,
    });

    // 2. Yöneticiye Yeni Sipariş Bildirimi
    const adminEmailPromise = resend.emails.send({
      from: 'Dem Gıda Sistem <onboarding@resend.dev>',
      to: process.env.ADMIN_NOTIFICATION_EMAIL || 'yasin@ostlertech.com',
      subject: `[YENİ SİPARİŞ] #${orderId} - ${customer.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 16px;">
          <h3 style="color: #92400e;">Yeni Bir Sipariş Oluşturuldu!</h3>
          <p><strong>Müşteri:</strong> ${customer.name} (${customer.email} / ${customer.phone})</p>
          <p><strong>Tutar:</strong> ${formattedTotal} TL</p>
          <p><strong>Adres:</strong> ${shippingAddress.address}, ${shippingAddress.district} / ${shippingAddress.city}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 16px 0;" />
          ${emailTemplate}
        </div>
      `,
    });

    await Promise.all([customerEmailPromise, adminEmailPromise]);

    return NextResponse.json({ success: true, message: 'E-postalar başarıyla iletildi.' });
  } catch (error: any) {
    console.error('Resend E-Posta Hatası:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'E-posta gönderilemedi.' },
      { status: 500 }
    );
  }
}