import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // PayPal emite este evento cuando un pago es capturado y aprobado exitosamente
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const capture = body.resource;
      // custom_id contiene el UID del usuario que enviamos desde el cliente
      const customId = capture.custom_id; 
      
      if (customId) {
        // 1. Actualizamos el rol del usuario a 'Estudiante Activo'
        await adminDb.collection('Users').doc(customId).set({
          status: 'active',
          role: 'student',
          hasAccess: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // 2. Registramos el recibo de pago en nuestra base de datos
        await adminDb.collection('Payments').doc(capture.id).set({
          userId: customId,
          courseId: 'pensamiento-variacional-1',
          amount: capture.amount.value,
          currency: capture.amount.currency_code,
          status: 'completed',
          createdAt: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error procesando el Webhook de PayPal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
