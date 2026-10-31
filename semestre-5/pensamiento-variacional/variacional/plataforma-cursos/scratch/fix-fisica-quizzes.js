const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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

const sourceDir = 'C:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\ANALISIS FISICOS';

async function fixQuizzes() {
  console.log('--- FIXING FISICA QUIZZES ---');

  const files = fs.readdirSync(sourceDir).filter(f => f.startsWith('mc_') && f.endsWith('.json'));

  for (const file of files) {
      const rawData = fs.readFileSync(path.join(sourceDir, file), 'utf8');
      const data = JSON.parse(rawData);
      
      const mcNum = String(data.mc_id).padStart(2, '0');
      const lessonId = `lesson_fisica_mc${mcNum}`; // This matches the ID from seed-fisica-all-50.js
      const courseId = 'fisica';

      const quizzes = data.quizz_kahoot || [];

      if (quizzes.length > 0) {
          const quizId = `quiz_${lessonId}`;
          const formattedQuestions = quizzes.map((q) => ({
              question: q.pregunta,
              options: q.opciones,
              correctAnswer: q.opciones.indexOf(q.respuesta_correcta) !== -1 ? q.opciones.indexOf(q.respuesta_correcta) : 0,
              explanation: q.justificacion_retroalimentacion
          }));

          await db.collection('Quizzes').doc(quizId).set({
              lessonId: lessonId,
              courseId: courseId,
              questions: formattedQuestions
          });
          console.log(`✅ Quiz for ${lessonId} uploaded. (ID: ${quizId})`);
      } else {
          console.log(`⚠️ No quizzes found in ${file}.`);
      }
  }

  console.log('\n--- QUIZZES FIXED ---');
  process.exit(0);
}

fixQuizzes().catch(console.error);
