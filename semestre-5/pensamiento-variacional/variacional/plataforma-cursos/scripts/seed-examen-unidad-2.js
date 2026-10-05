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
  console.log('🚀 Iniciando subida del Examen (Unidad 2)...');

  const courseId = 'matematicas-basicas';
  const moduleId = 'mod_aritmetica';
  const lessonId = 'lesson_examen_unidad_2';
  
  const htmlContent = `
<div class="space-y-6">
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe 
            src="/courses/matematicas-basicas/examen-unidad-2/index.html?v=1" 
            class="w-full" 
            style="min-height: 1400px; border: none;"
            title="Examen: Unidad 2 Completa"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'Examen Global: Unidad 2 (La Recta y la Parábola)',
    description: 'Examen de evaluación de la Unidad 2.',
    content: htmlContent,
    order: 10,
    published: false, // <- THIS MAKES IT HIDDEN FROM STUDENTS
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Examen creado exitosamente (Modo Oculto).');
}

run().catch(console.error);
