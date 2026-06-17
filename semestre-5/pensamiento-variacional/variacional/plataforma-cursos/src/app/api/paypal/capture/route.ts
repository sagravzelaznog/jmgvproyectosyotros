import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Determinamos si usamos el entorno de Sandbox o Live basándonos en una variable o por defecto Live en producción.
// Si no quieres que haya fallos, es mejor configurar explícitamente el entorno de PayPal.
const base = process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
// Si el cliente ID es "test", siempre es sandbox para prevenir cobros reales accidentales con cuentas dev.
const PAYPAL_API_BASE = PAYPAL_CLIENT_ID === "test" || !PAYPAL_CLIENT_ID?.startsWith("A") ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

// Función para obtener el token de acceso de PayPal
async function generateAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error generando Access Token:", data);
      throw new Error("Error autenticando con PayPal");
    }
    
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw error;
  }
}

async function getFirebaseAdmin() {
  const app = await import('firebase-admin/app');
  const auth = await import('firebase-admin/auth');
  const firestore = await import('firebase-admin/firestore');

  if (!app.getApps().length) {
    app.initializeApp({
      credential: app.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
          : undefined,
      }),
    });
  }

  return {
    adminDb: firestore.getFirestore(),
    adminAuth: auth.getAuth(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: "Falta el ID de la orden" }, { status: 400 });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || PAYPAL_CLIENT_ID === "test") {
      return NextResponse.json({ 
        error: "PayPal no está configurado correctamente en el servidor. Faltan llaves en Vercel." 
      }, { status: 500 });
    }

    // 1. Obtener Token
    const accessToken = await generateAccessToken();

    // 2. Capturar la Orden
    const captureUrl = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;
    
    const captureResponse = await fetch(captureUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error("Error al capturar el pago:", captureData);
      return NextResponse.json({ error: "No se pudo capturar el pago en PayPal." }, { status: 400 });
    }

    // 3. Validar Estado de Captura y Otorgar Membresía
    if (captureData.status === "COMPLETED") {
      // Intentar obtener el UID del cliente que enviamos desde el frontend en custom_id
      const purchaseUnits = captureData.purchase_units || [];
      const customId = purchaseUnits.length > 0 ? purchaseUnits[0].custom_id : null;
      
      const payerEmail = captureData.payer?.email_address;
      const payerName = captureData.payer?.name?.given_name || "Alumno";

      // Si tenemos un customId, significa que el usuario estaba logueado
      if (customId && customId !== "guest") {
        try {
          const { adminDb } = await getFirebaseAdmin();
          
          await adminDb.collection('Users').doc(customId).set({
            hasAccess: true,
            role: 'student',
            paymentMethod: 'paypal',
            orderID: orderID,
            paidAt: new Date().toISOString()
          }, { merge: true });
          
          return NextResponse.json({ 
            success: true, 
            message: "Pago capturado y acceso otorgado exitosamente." 
          });
        } catch (dbError) {
          console.error("Error actualizando la BD de Firebase tras un pago exitoso:", dbError);
          // OJO: El pago se cobró, pero no se pudo dar acceso en la BD.
          return NextResponse.json({ 
            success: true, 
            warning: "Pago cobrado pero ocurrió un error al actualizar el acceso. Contactar a soporte.",
            orderID
          });
        }
      } else {
        // Pago exitoso pero el usuario no estaba logueado o era invitado
        // Idealmente en este punto podrías crear un usuario con el correo del pagador
        // Pero para simplificar, asumiremos que ya deben estar logueados.
        return NextResponse.json({ 
          success: true, 
          warning: "Pago exitoso pero no se pudo asociar a una cuenta porque el usuario no estaba autenticado. (Guest)",
          payerEmail
        });
      }
    }

    return NextResponse.json({ error: "El estado de la captura no está COMPLETED" }, { status: 400 });

  } catch (error: any) {
    console.error("Error inesperado en captura PayPal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
