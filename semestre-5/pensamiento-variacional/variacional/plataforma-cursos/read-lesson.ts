import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string))
  });
}

const db = getFirestore();

async function run() {
  const doc = await db.collection('Lessons').doc('sesion_1').get();
  console.log(doc.data()?.content.substring(0, 1000));
}

run();
