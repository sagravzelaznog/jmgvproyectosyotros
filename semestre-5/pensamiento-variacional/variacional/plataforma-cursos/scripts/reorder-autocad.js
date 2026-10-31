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

const lessons = [
  { id: 'lesson_0_autocad', order: 0.01 },
  { id: 'lesson_conceptos_pre', order: 0.02 },
  { id: 'lesson_ver_pre', order: 0.03 },
  { id: 'lesson_precision_pre', order: 0.04 },
  { id: 'lesson_capas_pre', order: 0.05 },
  { id: 'lesson_propiedades_pre', order: 0.06 },
  { id: 'lesson_modificar_pre', order: 0.07 },
  { id: 'lesson_simbolos_pre', order: 0.08 },
  { id: 'lesson_presentacion_pre', order: 0.09 },
  { id: 'lesson_anotar_pre', order: 0.10 },
  { id: 'lesson_cotas_pre', order: 0.11 },
  { id: 'lesson_imprimir_pre', order: 0.12 }
];

async function run() {
  console.log('🚀 Reordenando lecciones preliminares de AutoCAD...');

  const batch = db.batch();

  for (const lesson of lessons) {
    const ref = db.collection('Lessons').doc(lesson.id);
    batch.update(ref, { order: lesson.order });
    console.log(`- Lección ${lesson.id} -> Orden: ${lesson.order}`);
  }

  await batch.commit();
  console.log('✅ Orden de las 12 lecciones actualizado correctamente.');
}

run().catch(console.error);
