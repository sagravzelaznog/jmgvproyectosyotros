import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Configurar dotenv para cargar las variables del .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

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
const PM4_DIR = "c:/Users/admin/Documents/000 A PREPA/planeaciones especialidades/Proyectos y Otros/semestre-5/pensamiento-variacional/cursos/PM4";
const COURSE_ID = 'pm4';

const MODULE_TITLES = [
  "Bloque 1: Geometría Analítica Básica (Sesiones 1 - 10)",
  "Bloque 2: Rectas y Ángulos (Sesiones 11 - 20)",
  "Bloque 3: Circunferencia y Parábola (Sesiones 21 - 30)",
  "Bloque 4: Elipse e Hipérbola (Sesiones 31 - 40)",
  "Bloque 5: Aplicaciones y Cónicas (Sesiones 41 - 50)"
];

async function run() {
  console.log("Iniciando seeder para PM4...");

  // 1. Limpiar sesiones anteriores de PM4 si existieran (opcional, pero recomendado)
  const oldLessons = await db.collection('Lessons').where('courseId', '==', COURSE_ID).get();
  if (!oldLessons.empty) {
    console.log(`Borrando ${oldLessons.size} lecciones antiguas de PM4...`);
    const batch = db.batch();
    oldLessons.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // 2. Crear los 5 Módulos Oficiales
  console.log("Creando módulos de PM4...");
  const moduleIds = [];
  for (let i = 0; i < 5; i++) {
    const modId = `mod_pm4_${i + 1}`;
    moduleIds.push(modId);
    await db.collection('Modules').doc(modId).set({
      courseId: COURSE_ID,
      title: MODULE_TITLES[i],
      order: i + 1,
      createdAt: new Date().toISOString()
    });
  }

  // 3. Leer las carpetas mc01 a mc50
  for (let i = 1; i <= 50; i++) {
    const folderName = `mc${i.toString().padStart(2, '0')}`;
    const folderPath = path.join(PM4_DIR, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.warn(`Carpeta no encontrada: ${folderName}`);
      continue;
    }

    const htmlFile = path.join(folderPath, `MC S${i.toString().padStart(2, '0')}.html`);
    const jsFile = path.join(folderPath, 'questions.js');

    if (!fs.existsSync(htmlFile)) {
      console.warn(`HTML no encontrado: ${htmlFile}`);
      continue;
    }

    // A. Parsear HTML
    const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
    const titleMatch = htmlContent.match(/<h1>(.*?)<\/h1>/);
    const title = titleMatch ? `Sesión ${i}: ${titleMatch[1]}` : `Sesión ${i}`;

    const mainStart = htmlContent.indexOf('<main class="container">');
    const quizStart = htmlContent.indexOf('<section class="quiz-section"');
    
    let content = "";
    if (mainStart !== -1 && quizStart !== -1) {
      content = htmlContent.substring(mainStart + '<main class="container">'.length, quizStart).trim();
    } else {
      console.warn(`No se pudo extraer el content en ${folderName}`);
      content = "<p>Contenido no disponible.</p>";
    }

    // Determinar a qué módulo pertenece
    const moduleNumber = Math.floor((i - 1) / 10);
    const moduleId = moduleIds[moduleNumber];

    // B. Guardar Lección
    const lessonId = `lesson_${i}_pm4`;
    await db.collection('Lessons').doc(lessonId).set({
      courseId: COURSE_ID,
      moduleId: moduleId,
      title: title,
      order: i,
      content: content
    });

    // C. Parsear JS y guardar Quizzes
    if (fs.existsSync(jsFile)) {
      const jsContent = fs.readFileSync(jsFile, 'utf-8');
      try {
        // Extraer el array de JSON
        const jsonMatch = jsContent.match(/const quizData\s*=\s*(\[[\s\S]*?\]);/);
        if (jsonMatch && jsonMatch[1]) {
          const rawJson = jsonMatch[1].replace(/'/g, '"');
          // Evaluarlo de forma segura creando una función
          const getQuizData = new Function(`return ${jsonMatch[1]};`);
          const quizData = getQuizData();

          const formattedQuestions = quizData.map((q: any, idx: number) => ({
            question: q.q,
            options: q.options,
            answer: q.correct,
            color: ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"][idx % 4]
          }));

          await db.collection('Quizzes').doc(`quiz_${lessonId}`).set({
            lessonId: lessonId,
            questions: formattedQuestions,
            createdAt: new Date().toISOString()
          });
          
          console.log(`Lección ${i} guardada con ${formattedQuestions.length} preguntas.`);
        }
      } catch (err) {
        console.error(`Error parseando questions.js en ${folderName}:`, err);
      }
    } else {
      console.log(`Lección ${i} guardada sin quiz.`);
    }
  }

  console.log("¡Seeder finalizado exitosamente!");
}

run().catch(console.error);
