import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

function generateRandomPassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password + "A1!";
}

async function getFirebaseAdmin() {
  try {
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
      initError: null
    };
  } catch (error: any) {
    console.error("DYNAMIC IMPORT ERROR:", error);
    return {
      adminDb: null,
      adminAuth: null,
      initError: error.message || String(error)
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    const { adminAuth, adminDb, initError } = await getFirebaseAdmin();
    if (initError || !adminAuth || !adminDb) {
      return NextResponse.json({ error: `Fallo Crítico SDK: ${initError}` }, { status: 400 });
    }
    
    // Verificar token con Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Verificar si es el Admin configurado
    if (decodedToken.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
      return NextResponse.json({ error: 'Acceso denegado. No eres administrador.' }, { status: 403 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const generatedPassword = generateRandomPassword();
    let newUid = "";

    try {
      const userRecord = await adminAuth.createUser({
        email: email,
        password: generatedPassword,
      });
      newUid = userRecord.uid;
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'Este correo ya tiene una cuenta en el sistema.' }, { status: 400 });
      }
      throw authError;
    }

    await adminDb.collection('Users').doc(newUid).set({
      email: email,
      role: 'student',
      status: 'active',
      hasAccess: true,
      temporaryPassword: generatedPassword,
      grantedAt: new Date().toISOString(),
      grantedByAdmin: true
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      message: 'Membresía otorgada exitosamente.',
      email: email,
      password: generatedPassword
    });

  } catch (error: any) {
    console.error('Error granting access:', error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    const { adminAuth, adminDb, initError } = await getFirebaseAdmin();
    if (initError || !adminAuth || !adminDb) {
      return NextResponse.json({ error: `Fallo Crítico SDK: ${initError}` }, { status: 400 });
    }
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (decodedToken.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
      return NextResponse.json({ error: 'Acceso denegado. No eres administrador.' }, { status: 403 });
    }

    const usersSnapshot = await adminDb.collection('Users')
      .where('grantedByAdmin', '==', true)
      .get();

    const users = usersSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    users.sort((a: any, b: any) => {
      const dateA = new Date(a.grantedAt || 0).getTime();
      const dateB = new Date(b.grantedAt || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, users });

  } catch (error: any) {
    console.error('Error fetching granted users:', error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 400 });
  }
}
