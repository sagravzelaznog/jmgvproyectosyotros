import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';

export async function GET(request: Request) {
  try {
    const email = "primomanuelsagrav@gmail.com";
    const password = "2026jmgv1983";
    // Mantenemos el mismo UID que ya tienes configurado en tu .env.local
    const uid = process.env.NEXT_PUBLIC_ADMIN_UID || "Ab8rXaEqFJcdV7ykrlTJWuReS8D2";

    try {
      // Intentar actualizar la contraseña si el usuario ya existe en este proyecto
      await adminAuth.updateUser(uid, {
        email,
        password,
      });
      console.log("Usuario actualizado.");
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        // Crear el usuario si no existe en la base de datos actual
        await adminAuth.createUser({
          uid,
          email,
          password,
        });
        console.log("Usuario creado.");
      } else {
        throw e;
      }
    }

    // Registrar al administrador explícitamente en la colección Users
    await adminDb.collection('Users').doc(uid).set({
      email,
      role: 'admin',
      status: 'active',
      hasAccess: true,
      createdAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      message: 'Cuenta de administrador creada y configurada exitosamente.',
      email,
      uid
    });
  } catch (error: any) {
    console.error('Error creando administrador:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
