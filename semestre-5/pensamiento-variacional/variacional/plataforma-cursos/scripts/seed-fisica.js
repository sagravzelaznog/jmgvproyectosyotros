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
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
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

  const sourceDir = 'C:\\\\Users\\\\admin\\\\Documents\\\\000 A PREPA\\\\planeaciones especialidades\\\\Proyectos y Otros\\\\semestre-5\\\\pensamiento-variacional\\\\cursos\\\\ANALISIS FISICOS';
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
      const c = data.desarrollo_5E;
      
      // Construir extras de "explorar" (simulador)
      let simuladorHTML = '';
      if (c.explorar?.parametros_exactos_simulador) {
          const sim = c.explorar.parametros_exactos_simulador;
          let configHTML = '';
          if (Array.isArray(sim.configuracion_inicial)) {
              configHTML = `<ul class="list-disc pl-5 mt-2 space-y-1 text-slate-300">${sim.configuracion_inicial.map(i => `<li>${i}</li>`).join('')}</ul>`;
          }
          
          let iframeHTML = '';
          if (sim.nombre_simulador && sim.nombre_simulador.toLowerCase().includes('phet')) {
              iframeHTML = `
                <div class="mt-6 aspect-video w-full overflow-hidden rounded-xl border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.2)] relative">
                  <iframe 
                    src="https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_es.html"
                    class="absolute top-0 left-0 w-full h-full border-0"
                    allowfullscreen>
                  </iframe>
                </div>
              `;
          }

          simuladorHTML = `
            <div class="bg-black/40 border border-neon-cyan/30 p-6 rounded-xl mt-6 shadow-inner">
              <h4 class="text-neon-cyan font-bold mb-2 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Entorno Virtual: ${sim.nombre_simulador || 'Simulador'}
              </h4>
              <p class="text-sm text-slate-400 mb-2">Configuración recomendada:</p>
              ${configHTML}
              ${iframeHTML}
            </div>
          `;
      }

      // Construir extras de "explicar" (fórmulas y referencias)
      let formulasHTML = '';
      if (Array.isArray(c.explicar?.modelado_matematico_latex)) {
          formulasHTML = `\n\n**Modelado Matemático:**\n\n${c.explicar.modelado_matematico_latex.join('\n\n')}\n\n`;
      }
      
      let refHTML = '';
      if (c.explicar?.referencia_bibliografica_real) {
          refHTML = `<p class="mt-6 pt-4 border-t border-slate-700/50 text-xs text-slate-500 italic">📚 Fuente: ${c.explicar.referencia_bibliografica_real}</p>`;
      }

      let htmlContent = `
        <div class="mb-10 text-center">
          <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-sm mb-4">${data.titulo_sesion}</h2>
          <div class="inline-block bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 shadow-sm">
            <p class="text-slate-300 text-sm m-0"><strong>Objetivo:</strong> ${data.objetivo_sesion}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
          <!-- ENGANCHAR -->
          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-neon-pink/10 flex items-center justify-center text-neon-pink">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-white m-0">1. Enganchar <span class="text-slate-500 text-sm font-normal">(${c.enganchar?.duracion_min || 0} min)</span></h3>
            </div>
            <div class="text-slate-300 prose-p:my-2">${c.enganchar?.actividad || ''}</div>
          </div>
          
          <!-- EXPLORAR -->
          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-white m-0">2. Explorar <span class="text-slate-500 text-sm font-normal">(${c.explorar?.duracion_min || 0} min)</span></h3>
            </div>
            <div class="text-slate-300 prose-p:my-2">${c.explorar?.actividad_simulador || c.explorar?.actividad || ''}</div>
            ${simuladorHTML}
          </div>
          
          <!-- EXPLICAR -->
          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 class="text-xl font-bold text-white m-0">3. Explicar <span class="text-slate-500 text-sm font-normal">(${c.explicar?.duracion_min || 0} min)</span></h3>
            </div>
            <div class="text-slate-300 space-y-4">
              ${c.explicar?.explicacion_teorica_completa || '<p>Explicación teórica</p>'}
              ${formulasHTML}
              ${refHTML}
            </div>
          </div>
          
          <!-- ELABORAR (Métrica ABP) -->
          <div class="bg-black border-2 border-[#FFD700]/50 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.1)]">
            <div class="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-2xl"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] border border-[#FFD700]/50">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-white m-0 tracking-wide uppercase">4. Elaborar (Proyecto ABP)</h3>
                  <p class="text-[#FFD700] text-sm font-semibold tracking-wider m-0">Fase de Construcción / Modelado</p>
                </div>
              </div>
              
              <div class="bg-[#12131A] border border-slate-800 p-5 rounded-xl mb-6 shadow-inner text-slate-300">
                ${c.elaborar?.practica_aplicada || c.elaborar?.actividad || ''}
              </div>

              <div class="bg-indigo-500/10 border-l-4 border-indigo-500 p-4 rounded-r-xl mt-4">
                <h4 class="text-indigo-400 font-bold mb-1 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Conexión con el Proyecto
                </h4>
                <p class="text-slate-300 text-sm m-0">${data.conexion_abp}</p>
              </div>
            </div>
          </div>
          
          <!-- EVALUAR -->
          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors mt-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-white m-0">5. Evaluar <span class="text-slate-500 text-sm font-normal">(${c.evaluar?.duracion_min || 0} min)</span></h3>
            </div>
            <div class="text-slate-300 prose-p:my-2">${c.evaluar?.cierre_formativo || c.evaluar?.actividad || ''}</div>
          </div>
        </div>
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
          const formattedQuestions = lesson.quizzes.map((q) => ({
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
