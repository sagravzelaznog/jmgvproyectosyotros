import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

async function seedPM4() {
  console.log('--- INICIANDO SEED DE PM4 (PENSAMIENTO MATEMÁTICO 4) ---');

  const dataPath = path.join(__dirname, '..', '..', '..', 'scratch', 'pm4_firebase_data.json');
  if (!fs.existsSync(dataPath)) {
      console.error(`No se encontró el archivo de datos: ${dataPath}`);
      process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  console.log(`Leídos: ${data.modules.length} Módulos, ${data.lessons.length} Lecciones, ${data.quizzes.length} Quizzes`);

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
        console.log(`✅ ${lessonCount}/50 Lecciones subidas...`);
    }
  }

  // 3. Insertar Quizzes
  console.log('\n--- INSERTANDO QUIZZES ---');
  let quizCount = 0;
  for (const quiz of data.quizzes) {
    // Usaremos como ID: quiz_ + lessonId
    const quizId = `quiz_${quiz.lessonId}`;
    const docRef = db.collection('Quizzes').doc(quizId);
    await docRef.set({
      lessonId: quiz.lessonId,
      courseId: quiz.courseId,
      questions: quiz.questions
    });
    quizCount++;
    if (quizCount % 10 === 0) {
        console.log(`✅ ${quizCount}/50 Quizzes subidos...`);
    }
  }

  console.log('\n--- SEED DE PM4 COMPLETADO EXITOSAMENTE ---');
  process.exit(0);
}

seedPM4().catch(console.error);
