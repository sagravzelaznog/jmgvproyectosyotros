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
  console.log('🚀 Subiendo lección: Fórmula General...');

  const courseId = 'matematicas-basicas';
  const moduleId = 'mod_aritmetica';
  const lessonId = 'lesson_formula_general';

  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-emerald-700 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h1 class="text-2xl md:text-3xl font-bold mb-3">Ecuaciones Cuadráticas: Fórmula General</h1>
        <p class="text-emerald-50 text-base md:text-lg">Resuelve ecuaciones de la forma ax² + bx + c = 0 con la fórmula general y revisa el desarrollo paso a paso.</p>
    </div>
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe
            src="/courses/matematicas-basicas/FORMULAGRAL/index.html?v=2"
            class="w-full"
            style="min-height: 2800px; border: none;"
            title="Fórmula General"
        ></iframe>
    </div>
</div>
  `;

  await db.collection('Lessons').doc(lessonId).set({
    id: lessonId,
    courseId,
    moduleId,
    title: 'Ecuaciones Cuadráticas: Fórmula General',
    description: 'Practica la resolución de ecuaciones cuadráticas con la fórmula general.',
    content: htmlContent,
    order: 10,
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  console.log('✅ Lección Fórmula General creada (Orden 10).');
}

run().catch(console.error);
