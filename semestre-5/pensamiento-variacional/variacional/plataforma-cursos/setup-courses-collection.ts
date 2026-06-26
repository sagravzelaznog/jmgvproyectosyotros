import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
    }),
  });
}

const db = getFirestore();

async function createCoursesCollection() {
  console.log("Configurando colección 'Courses'...");

  try {
    const courses = [
      {
        id: 'pensamiento-variacional-1',
        title: 'Pensamiento Variacional I',
        color: 'indigo', // Base color for Tailwind classes
        order: 1
      },
      {
        id: 'propiedades',
        title: 'Propiedades Matemáticas',
        color: 'pink', 
        order: 2
      }
    ];

    for (const course of courses) {
      await db.collection('Courses').doc(course.id).set(course, { merge: true });
    }
    
    console.log("✅ Colección 'Courses' inicializada correctamente.");
  } catch (error) {
    console.error("Error al configurar los cursos:", error);
  }
}

createCoursesCollection();
