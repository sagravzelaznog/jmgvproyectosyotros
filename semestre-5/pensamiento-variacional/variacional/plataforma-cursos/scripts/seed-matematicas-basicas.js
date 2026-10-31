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
  console.log('🚀 Iniciando creación del curso Recursos Matemáticos Básicos...');

  // 1. Crear el Curso
  const courseId = 'matematicas-basicas';
  const courseData = {
    title: 'Recursos Matemáticos Básicos',
    description: 'Colección de temas y ejercicios interactivos para dominar los fundamentos de las matemáticas.',
    thumbnail: 'https://images.unsplash.com/photo-1632516643720-e7f0d7e6a6a4?q=80&w=1000&auto=format&fit=crop', // A math related image
    instructorId: 'profesor-1',
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Courses').doc(courseId).set(courseData, { merge: true });
  console.log('✅ Curso creado.');

  // 2. Crear el Módulo
  const moduleId = 'mod_aritmetica';
  const moduleData = {
    courseId: courseId,
    title: 'Aritmética y Operaciones Básicas',
    description: 'Fundamentos de aritmética.',
    order: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Modules').doc(moduleId).set(moduleData, { merge: true });
  console.log('✅ Módulo creado.');

  // 3. Crear la Lección (Tablas de Multiplicar)
  const lessonId = 'lesson_tablas_multiplicar';
  
  // Utilizaremos un iframe para embeber la aplicación HTML/JS/CSS nativa que hemos colocado en /public
  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">Tablas de Multiplicar Interactivas</h1>
        <p class="text-blue-100 text-lg">Utiliza la siguiente herramienta para visualizar las tablas, practicar tus conocimientos y llevar un registro de tus aciertos.</p>
    </div>
    
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe 
            src="/courses/matematicas-basicas/tablas_multiplicar/index.html" 
            class="w-full" 
            style="min-height: 900px; border: none;"
            title="Herramienta interactiva de Tablas de Multiplicar"
        ></iframe>
    </div>
</div>
  `;

  const lessonData = {
    id: lessonId,
    courseId: courseId,
    moduleId: moduleId,
    title: 'Tablas de Multiplicar Interactivas',
    description: 'Practica y domina las tablas de multiplicar.',
    content: htmlContent,
    order: 1,
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Tablas de Multiplicar creada exitosamente.');
}

run().catch(console.error);
