import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth, adminDb, initError } from '@/lib/firebase/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (initError) {
      return NextResponse.json({ error: `Fallo Crítico SDK: ${initError}. Revisa las variables en Vercel.` }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const body = await request.json();
    const { lessonId, score, total } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId es requerido' }, { status: 400 });
    }

    // Usar adminDb saltará las reglas de seguridad de Firestore
    await adminDb
      .collection('Users')
      .doc(uid)
      .collection('progress')
      .doc(lessonId)
      .set({
        score: score || 0,
        total: total || 0,
        completedAt: new Date()
      }, { merge: true });

    return NextResponse.json({ success: true, message: 'Progreso guardado exitosamente.' });

  } catch (error: any) {
    console.error('Error guardando progreso:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
