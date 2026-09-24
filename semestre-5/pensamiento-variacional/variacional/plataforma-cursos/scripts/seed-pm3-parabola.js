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
  console.log('🚀 Iniciando subida de la lección: La Parábola y sus Elementos (PM3)...');

  const courseId = 'pm3';
  const moduleId = 'mod_geometria_analitica';
  const lessonId = 'lesson_pm3_parabola';
  
  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">La Parábola y sus Elementos</h1>
        <p class="text-indigo-100 text-lg">Analiza cada ecuación ordinaria dada. Deduce los parámetros algebraicos y calcula el Vértice, Foco, Lado Recto y Directriz.</p>
    </div>
    
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe 
            src="/courses/pm3/parabola/index.html?v=1" 
            class="w-full" 
            style="min-height: 900px; border: none;"
            title="La Parábola y sus Elementos"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'La Parábola y sus Elementos',
    description: 'Aprende a analizar ecuaciones de la parábola y deduce sus elementos principales.',
    content: htmlContent,
    order: 8, // Basado en "Sesión 08" del titulo
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Parábola creada exitosamente (Orden 8).');
}

run().catch(console.error);
