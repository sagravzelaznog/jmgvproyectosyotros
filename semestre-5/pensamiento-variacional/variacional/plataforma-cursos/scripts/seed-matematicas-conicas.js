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
  console.log('🚀 Iniciando subida de la lección: Master Cónicas (Geometría Analítica)...');

  const courseId = 'matematicas-basicas';
  const moduleId = 'mod_aritmetica';
  const lessonId = 'lesson_conicas';

  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-indigo-900 to-emerald-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">Master Cónicas: Geometría Analítica</h1>
        <p class="text-indigo-100 text-lg">Domina la circunferencia, la parábola, la elipse y la hipérbola: identifica sus elementos a partir de la ecuación general y practica con ejercicios evaluables.</p>
    </div>

    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe
            src="/courses/matematicas-basicas/conicas/index.html?v=1"
            class="w-full"
            style="min-height: 1200px; border: none;"
            title="Master Cónicas"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'Master Cónicas: Geometría Analítica',
    description: 'Circunferencia, parábola, elipse e hipérbola: teoría, ejemplos y práctica evaluable.',
    content: htmlContent,
    order: 11,
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Cónicas creada exitosamente (Orden 11).');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
