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
  console.log('🚀 Iniciando subida del Examen Físico (08 - 14)...');

  const courseId = 'fisica';
  const moduleId = 'mod_fisica_2';
  const lessonId = 'lesson_examen_fisica_08_14';
  
  const htmlContent = `
<div class="space-y-6">
    <div class="w-full bg-slate-900 rounded-2xl shadow-sm border border-slate-700 overflow-hidden">
        <iframe 
            src="/courses/fisica/examen-08-14/index.html?v=1" 
            class="w-full" 
            style="min-height: 1200px; border: none;"
            title="Examen Dinámico: MC08 - MC14"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'Examen Dinámico (MC08 - MC14)',
    description: 'Evaluación formativa dinámica sobre las Masterclasses 08 a la 14.',
    content: htmlContent,
    order: 15,
    published: false, // Hidden
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Examen creado exitosamente (Modo Oculto).');
}

run().catch(console.error);
