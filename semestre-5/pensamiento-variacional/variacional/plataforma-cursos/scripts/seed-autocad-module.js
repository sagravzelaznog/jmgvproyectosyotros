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

async function run() {
  const moduleId = 'mod_ejercicios_2d';
  
  const moduleData = {
    id: moduleId,
    courseId: 'autocad',
    title: 'Maratón de Ejercicios 2D',
    order: 2,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Modules').doc(moduleId).set(moduleData, { merge: true });
  console.log('✅ Módulo mod_ejercicios_2d creado exitosamente.');
}

run().catch(console.error);
