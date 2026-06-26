import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
        : undefined,
    }),
  });
}

const db = getFirestore();

async function check() {
  const s = await db.collection('Modules').get();
  console.log("Modules found:", s.docs.length);
  s.docs.forEach(doc => {
    console.log(doc.id, doc.data());
  });
}

check().catch(console.error);
