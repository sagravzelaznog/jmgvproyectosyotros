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
  console.log('🚀 Iniciando subida de la lección: Potencia Cero...');

  const courseId = 'matematicas-basicas';
  const moduleId = 'mod_aritmetica';
  const lessonId = 'lesson_potencia_cero';
  
  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-teal-900 to-emerald-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">La Potencia Cero y Exponentes</h1>
        <p class="text-emerald-100 text-lg">Descubre por qué cualquier número elevado a la potencia cero es igual a uno y practica las leyes de los exponentes con esta herramienta.</p>
    </div>
    
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe 
            src="/courses/matematicas-basicas/potencia_cero/index.html" 
            class="w-full" 
            style="min-height: 900px; border: none;"
            title="Herramienta interactiva de la Potencia Cero"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'La Regla de la Potencia Cero',
    description: 'Aprende y demuestra de forma interactiva las leyes de los exponentes.',
    content: htmlContent,
    order: 2,
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Potencia Cero creada exitosamente (Orden 2).');
}

run().catch(console.error);
