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
  console.log('🚀 Iniciando agregación de la app de Divisiones al curso Recursos Matemáticos Básicos...');

  const courseId = 'matematicas-basicas';
  const moduleId = 'mod_aritmetica';
  const lessonId = 'lesson_divisiones';
  
  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">Divisiones Interactivas</h1>
        <p class="text-blue-100 text-lg">Utiliza la siguiente herramienta para practicar divisiones y fortalecer tus habilidades en aritmética básica.</p>
    </div>
    
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe 
            src="/courses/matematicas-basicas/divisiones/index.html" 
            class="w-full" 
            style="min-height: 900px; border: none;"
            title="Herramienta interactiva de Divisiones"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'Divisiones Interactivas',
    description: 'Practica y domina las divisiones.',
    content: htmlContent,
    order: 2, // 1 was tablas de multiplicar
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Divisiones creada exitosamente.');
  process.exit(0);
}

run().catch(console.error);
