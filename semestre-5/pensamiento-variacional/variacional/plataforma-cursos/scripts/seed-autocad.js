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

async function seedAutocad() {
  console.log('--- INICIANDO SEED DE AUTOCAD ---');

  const dataPath = path.join(__dirname, '..', '..', '..', 'scratch', 'autocad_firebase_data.json');
  if (!fs.existsSync(dataPath)) {
      console.error(`No se encontró el archivo de datos: ${dataPath}`);
      process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  console.log(`Leídos: ${data.modules.length} Módulos, ${data.lessons.length} Lecciones`);

  // 1. Insertar Módulos
  console.log('\n--- INSERTANDO MÓDULOS ---');
  for (const mod of data.modules) {
    const docRef = db.collection('Modules').doc(mod.id);
    await docRef.set({
      courseId: mod.courseId,
      order: mod.order,
      title: mod.title
    });
    console.log(`✅ Módulo creado: ${mod.id} - ${mod.title}`);
  }

  // 2. Insertar Lecciones
  console.log('\n--- INSERTANDO LECCIONES ---');
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
    if (lessonCount % 10 === 0) {
        console.log(`✅ ${lessonCount}/${data.lessons.length} Lecciones subidas...`);
    }
  }

  // No quizzes para Autocad en base a los JSONs

  console.log('\n--- SEED DE AUTOCAD COMPLETADO EXITOSAMENTE ---');
  process.exit(0);
}

seedAutocad().catch(console.error);
