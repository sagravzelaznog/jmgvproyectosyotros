import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function readSession1() {
  const lessonsRef = db.collection('Lessons');
  const snapshot = await lessonsRef.where('order', '==', 1).get();
  
  if (!snapshot.empty) {
    const lesson = snapshot.docs[0];
    console.log("LESSON ID:", lesson.id);
    console.log("LESSON TITLE:", lesson.data().title);
    console.log("LESSON CONTENT:", lesson.data().content);
  } else {
    console.log("Session 1 not found");
  }
}

readSession1().catch(console.error);
