import { NextResponse } from 'next/server';
import { adminAuth, adminDb, initError } from '@/lib/firebase/firebase-admin';

// Función para generar contraseña aleatoria
function generateRandomPassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password + "A1!";
}

export async function POST(request: Request) {
  try {
    if (initError) {
      return NextResponse.json({ error: `Fallo Crítico SDK: ${initError}. Revisa las variables en Vercel.` }, { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
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
      // 1. Crear el usuario en Firebase Auth
      const userRecord = await adminAuth.createUser({
        email: email,
        password: generatedPassword,
      });
      newUid = userRecord.uid;
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        // Si el usuario ya existe, tal vez queramos solo darle acceso y generar una nueva contraseña?
        // O mejor retornamos error para que el admin sepa.
        return NextResponse.json({ error: 'Este correo ya tiene una cuenta en el sistema.' }, { status: 400 });
      }
      throw authError;
    }

    // 2. Registrar en Firestore
    await adminDb.collection('Users').doc(newUid).set({
      email: email,
      role: 'student',
      status: 'active',
      hasAccess: true, // Membresía gratuita
      temporaryPassword: generatedPassword, // Guardamos la contraseña temporal
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    if (initError) {
      return NextResponse.json({ error: `Fallo Crítico SDK: ${initError}. Revisa las variables en Vercel.` }, { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verificar token con Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Verificar si es el Admin configurado
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

    // Ordenar por fecha descendente
    users.sort((a: any, b: any) => {
      const dateA = new Date(a.grantedAt || 0).getTime();
      const dateB = new Date(b.grantedAt || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, users });

  } catch (error: any) {
    console.error('Error fetching granted users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
