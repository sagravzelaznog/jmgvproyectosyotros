const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

async function check() {
  const qFisica = await db.collection('Quizzes').where('courseId', '==', 'fisica').limit(1).get();
  console.log('Fisica:', JSON.stringify(qFisica.docs[0].data(), null, 2));

  const qAutocad = await db.collection('Quizzes').where('courseId', '!=', 'fisica').limit(1).get();
  console.log('Other:', JSON.stringify(qAutocad.docs[0].data(), null, 2));
}

check().catch(console.error);
