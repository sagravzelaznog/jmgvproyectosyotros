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

async function runTest() {
  const modulesRef = db.collection('Modules');
  const modulesSnap = await modulesRef.get();
  
  console.log(`Found ${modulesSnap.docs.length} modules.`);
  
  modulesSnap.docs.forEach(doc => {
    console.log(`- ID: ${doc.id}, courseId: ${doc.data().courseId}`);
  });
}

runTest();
