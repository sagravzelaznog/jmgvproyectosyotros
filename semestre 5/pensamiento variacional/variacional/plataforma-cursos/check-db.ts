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

async function check() {
  const mods = await db.collection('Modules').get();
  console.log(`Modules count: ${mods.size}`);
  if (mods.size > 0) {
    console.log(`Module 1 ID: ${mods.docs[0].id}`);
  }

  const lessons = await db.collection('Lessons').get();
  console.log(`Lessons count: ${lessons.size}`);
  if (lessons.size > 0) {
    const data = lessons.docs[0].data();
    console.log(`Sample Lesson - Title: ${data.title}, ModuleId: ${data.moduleId}, Order: ${data.order}`);
  }
}

check().catch(console.error);
