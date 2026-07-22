const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Configurar entorno local
dotenv.config({ path: '.env.local' });

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function seedColab() {
  console.log('--- INICIANDO SEED DE COLAB ---');

  const dataPath = path.join(__dirname, '..', 'scratch', 'colab_firebase_data.json');
  if (!fs.existsSync(dataPath)) {
      console.error(`No se encontró el archivo de datos: ${dataPath}`);
      process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  console.log(`Leídas: ${data.lessons.length} Lecciones`);

  const courseId = 'tuto-colab';
  
  // 1. Curso
  console.log('\\n--- INSERTANDO CURSO ---');
  await db.collection('Courses').doc(courseId).set({
    title: 'Google Colab (Mini-Curso)',
    description: 'Aprende a utilizar cuadernos interactivos, desde Markdown básico hasta Programación Orientada a Objetos en Python.',
    price: 0,
    isPublished: true,
    createdAt: new Date().toISOString()
  });

  // 2. Modulo unico
  console.log('\\n--- INSERTANDO MÓDULO ---');
  const modId = 'mod_colab_1';
  await db.collection('Modules').doc(modId).set({
    courseId: courseId,
    title: 'Introducción y Prácticas de Google Colab',
    order: 1,
    createdAt: new Date().toISOString()
  });

  // 3. Insertar Lecciones
  console.log('\\n--- INSERTANDO LECCIONES ---');
  let lessonCount = 0;
  for (const lesson of data.lessons) {
    const docRef = db.collection('Lessons').doc(lesson.id);
    await docRef.set({
      courseId: lesson.courseId,
      moduleId: lesson.moduleId,
      order: lesson.order,
      title: lesson.title,
      content: lesson.content
    });
    lessonCount++;
    if (lessonCount % 2 === 0) {
        console.log(`✅ ${lessonCount}/${data.lessons.length} Lecciones subidas...`);
    }
  }

  console.log('\\n--- SEED DE COLAB COMPLETADO EXITOSAMENTE ---');
  process.exit(0);
}

seedColab().catch(console.error);
