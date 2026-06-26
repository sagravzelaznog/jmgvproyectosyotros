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

async function setCoursesPublished() {
  console.log("Configurando status 'published' en los cursos existentes...");
  try {
    const coursesRef = db.collection('Courses');
    const snap = await coursesRef.get();
    for (const doc of snap.docs) {
      await doc.ref.update({ status: 'published' });
    }
    console.log("✅ Cursos actualizados a 'published'.");
  } catch (error) {
    console.error("Error:", error);
  }
}

setCoursesPublished();
