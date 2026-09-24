import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth, adminDb, initError } from '@/lib/firebase/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (initError) {
      return new NextResponse(`Fallo Crítico SDK: ${initError}. Revisa las variables en Vercel.`, { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verificar token con Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Verificar si es el Admin configurado
    if (decodedToken.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
      return new NextResponse('Acceso denegado. No eres administrador.', { status: 403 });
    }

    const targetCourseId = request.nextUrl.searchParams.get('courseId');

    // Fetching Lessons
    const lessonsSnapshot = await adminDb.collection('Lessons').get();
    const lessonToCourseMap: Record<string, string> = {};
    lessonsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.courseId) {
        lessonToCourseMap[doc.id] = data.courseId;
      }
    });

    // Fetching Users
    const usersSnapshot = await adminDb.collection('Users').get();
    
    const csvData: string[] = [];
    csvData.push(["User ID", "Name", "Email", "Role", "Course ID", "Lessons Completed", "Total Score"].join(","));

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const uid = userDoc.id;
      const name = (userData.displayName || userData.name || '').replace(/,/g, '');
      const email = (userData.email || '').replace(/,/g, '');
      const role = userData.role || 'user';

      const progressSnapshot = await adminDb.collection('Users').doc(uid).collection('progress').get();
      
      // Aggregate by course
      const courseStats: Record<string, { completed: number, score: number }> = {};

      progressSnapshot.forEach(progDoc => {
        const lessonId = progDoc.id;
        const progData = progDoc.data();
        const courseId = lessonToCourseMap[lessonId] || 'unknown_course';

        // Si se especificó un curso, ignorar el resto
        if (targetCourseId && courseId !== targetCourseId) return;

        if (!courseStats[courseId]) {
          courseStats[courseId] = { completed: 0, score: 0 };
        }

        courseStats[courseId].completed += 1;
        courseStats[courseId].score += (progData.score || 0);
      });

      if (Object.keys(courseStats).length === 0) {
        // Solo agregar fila vacía si NO hay filtro de curso
        if (!targetCourseId) {
          csvData.push([uid, name, email, role, "N/A", 0, 0].join(","));
        }
      } else {
        for (const [courseId, stats] of Object.entries(courseStats)) {
          csvData.push([uid, name, email, role, courseId, stats.completed, stats.score].join(","));
        }
      }
    }

    const csvString = csvData.join("\n");
    const filename = targetCourseId ? `avance_${targetCourseId}.csv` : 'usuarios_avance.csv';
    
    return new NextResponse(csvString, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    console.error('Error exporting progress:', error);
    return new NextResponse(error.message, { status: 400 });
  }
}
