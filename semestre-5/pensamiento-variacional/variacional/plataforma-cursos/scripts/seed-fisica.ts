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
const COURSE_ID = 'fisica';

async function seedFisica() {
  console.log('--- INICIANDO SEED DE FÍSICA ---');

  // 1. Crear el curso
  await db.collection('Courses').doc(COURSE_ID).set({
    title: 'Análisis Físicos',
    description: 'Curso de física, estática, dinámica y cinemática, orientado al ABP de prótesis.',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600',
    published: true,
    order: 5
  }, { merge: true });
  console.log('✅ Curso Física creado/actualizado.');

  const sourceDir = path.join(__dirname, '..', '..', 'cursos', 'ANALISIS FISICOS');
  const files = fs.readdirSync(sourceDir).filter(f => f.startsWith('mc_') && f.endsWith('.json'));
  
  // Mapear unidades a módulos
  let modulesMap = new Map();
  let moduleCounter = 1;
  let allLessons = [];

  for (const file of files) {
      const rawData = fs.readFileSync(path.join(sourceDir, file), 'utf8');
      const data = JSON.parse(rawData);
      
      const unidadName = data.unidad;
      if (!modulesMap.has(unidadName)) {
          const modId = `mod_fisica_${moduleCounter}`;
          modulesMap.set(unidadName, {
              id: modId,
              title: unidadName,
              order: moduleCounter,
              courseId: COURSE_ID
          });
          moduleCounter++;
      }
      
      const mod = modulesMap.get(unidadName);
      
      // Armar contenido HTML 5E
      const c = data.desarrollo_5E;
      let htmlContent = `
        <h2>${data.titulo_sesion}</h2>
        <p><strong>Objetivo:</strong> ${data.objetivo_sesion}</p>
        <div class="alert alert-info" style="padding:10px; background-color:#eef; border-left:4px solid #0066cc;">
          <strong>Conexión ABP:</strong> ${data.conexion_abp}
        </div>
        
        <h3>Enganchar (${c.enganchar?.duracion_min || 0} min)</h3>
        <p>${c.enganchar?.actividad || ''}</p>
        
        <h3>Explorar (${c.explorar?.duracion_min || 0} min)</h3>
        <p>${c.explorar?.actividad_simulador || c.explorar?.actividad || ''}</p>
        
        <h3>Explicar (${c.explicar?.duracion_min || 0} min)</h3>
        ${c.explicar?.explicacion_teorica_completa || '<p>Explicación teórica</p>'}
        
        <h3>Elaborar (${c.elaborar?.duracion_min || 0} min)</h3>
        <p>${c.elaborar?.practica_aplicada || c.elaborar?.actividad || ''}</p>
        
        <h3>Evaluar (${c.evaluar?.duracion_min || 0} min)</h3>
        <p>${c.evaluar?.cierre_formativo || c.evaluar?.actividad || ''}</p>
      `;

      allLessons.push({
          id: `less_fisica_${data.mc_id}`,
          courseId: COURSE_ID,
          moduleId: mod.id,
          order: data.mc_id,
          title: data.titulo_sesion,
          content: htmlContent,
          quizzes: data.quizz_kahoot || []
      });
  }

  // Subir módulos
  console.log('\n--- INSERTANDO MÓDULOS ---');
  for (const [_, mod] of modulesMap) {
      await db.collection('Modules').doc(mod.id).set({
          courseId: mod.courseId,
          order: mod.order,
          title: mod.title
      });
      console.log(`✅ Módulo: ${mod.title}`);
  }

  // Subir lecciones y quizzes
  console.log('\n--- INSERTANDO LECCIONES Y QUIZZES ---');
  for (const lesson of allLessons) {
      await db.collection('Lessons').doc(lesson.id).set({
          courseId: lesson.courseId,
          moduleId: lesson.moduleId,
          order: lesson.order,
          title: lesson.title,
          content: lesson.content
      });

      if (lesson.quizzes && lesson.quizzes.length > 0) {
          const quizId = `quiz_${lesson.id}`;
          const formattedQuestions = lesson.quizzes.map((q: any) => ({
              question: q.pregunta,
              options: q.opciones,
              correctAnswer: q.opciones.indexOf(q.respuesta_correcta) !== -1 ? q.opciones.indexOf(q.respuesta_correcta) : 0,
              explanation: q.justificacion_retroalimentacion
          }));

          await db.collection('Quizzes').doc(quizId).set({
              lessonId: lesson.id,
              courseId: lesson.courseId,
              questions: formattedQuestions
          });
      }
      console.log(`✅ Lección subida: ${lesson.title}`);
  }

  console.log('\n--- SEED DE FÍSICA COMPLETADO EXITOSAMENTE ---');
  process.exit(0);
}

seedFisica().catch(console.error);
