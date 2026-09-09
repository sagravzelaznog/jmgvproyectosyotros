import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth, adminDb, initError } from '@/lib/firebase/firebase-admin';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
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
    const { targetUid } = body;

    if (!targetUid) {
      return NextResponse.json({ error: 'targetUid es requerido' }, { status: 400 });
    }

    if (targetUid === process.env.NEXT_PUBLIC_ADMIN_UID) {
      return NextResponse.json({ error: 'No puedes eliminar la cuenta de administrador principal.' }, { status: 403 });
    }

    // 1. Borrar usuario de Firebase Authentication
    try {
      await adminAuth.deleteUser(targetUid);
    } catch (authError: any) {
      // Ignorar si el usuario ya no existe en Auth, tal vez solo quede en Firestore
      if (authError.code !== 'auth/user-not-found') {
        throw authError;
      }
    }

    // 2. Borrar documento de usuario de Firestore
    await adminDb.collection('Users').doc(targetUid).delete();

    // Nota: Para ser más exhaustivo se podría borrar la subcolección 'progress' 
    // pero Firestore no la borra automáticamente. Si quieres borrar la subcolección:
    const progressSnapshot = await adminDb.collection('Users').doc(targetUid).collection('progress').get();
    const batch = adminDb.batch();
    progressSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return NextResponse.json({ success: true, message: 'Usuario eliminado exitosamente.' });

  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
