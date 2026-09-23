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
  console.log('🚀 Iniciando subida de la lección: Tratado Integral de Fracciones...');

  const courseId = 'matematicas-basicas';
  const moduleId = 'mod_aritmetica';
  const lessonId = 'lesson_resta_fracciones_homogeneas';
  
  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-teal-900 to-emerald-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">Resta de Fracciones Homogéneas</h1>
        <p class="text-emerald-100 text-lg">Practica la resta de fracciones con el mismo denominador a través de ejercicios interactivos.</p>
    </div>
    
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe 
            src="/courses/matematicas-basicas/resta-homogeneas/index.html" 
            class="w-full" 
            style="min-height: 900px; border: none;"
            title="Resta de Fracciones Homogéneas"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'Resta de Fracciones Homogéneas',
    description: 'Aprende y practica la resta de fracciones que tienen el mismo denominador.',
    content: htmlContent,
    order: 4,
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Resta de Fracciones Homogéneas creada exitosamente (Orden 4).');
}

run().catch(console.error);
