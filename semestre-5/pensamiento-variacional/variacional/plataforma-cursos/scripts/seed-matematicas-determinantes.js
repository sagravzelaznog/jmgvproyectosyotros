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
  console.log('🚀 Iniciando subida de la lección: Sistemas de Ecuaciones (Determinantes)...');

  const courseId = 'matematicas-basicas';
  const moduleId = 'mod_aritmetica';
  const lessonId = 'lesson_cramer_2_incognitas';
  
  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">Sistemas de Ecuaciones 2x2: Determinantes (Regla de Cramer)</h1>
        <p class="text-blue-100 text-lg">Resuelve sistemas de dos ecuaciones lineales utilizando la matriz de coeficientes y el método de determinantes.</p>
    </div>
    
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe 
            src="/courses/matematicas-basicas/determinantes-2-incognitas/index.html?v=1" 
            class="w-full" 
            style="min-height: 1200px; border: none;"
            title="Regla de Cramer 2x2"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'Sistemas 2x2: Regla de Cramer (Determinantes)',
    description: 'Aprende y domina la resolución de sistemas de ecuaciones lineales mediante determinantes.',
    content: htmlContent,
    order: 9, // Order follows: Sust, Igual, Elim, Cramer
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Determinantes creada exitosamente (Orden 9).');
}

run().catch(console.error);
