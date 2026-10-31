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
const COURSE_ID = 'archicad';

async function seedArchicad() {
  console.log('--- INICIANDO SEED DE ARCHICAD 27 ---');

  const dirPath = path.join(__dirname, '..', '..', '..', 'cursos', 'archicad27', 'sesiones_json');
  if (!fs.existsSync(dirPath)) {
      console.error(`No se encontró el directorio de datos: ${dirPath}`);
      process.exit(1);
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
      console.error('No hay archivos JSON en el directorio.');
      process.exit(1);
  }

  // Asegurar curso en base de datos
  await db.collection('Courses').doc(COURSE_ID).set({
      title: 'Archicad 27: MEP y Modelado',
      description: 'Curso intensivo de modelado de instalaciones MEP y flujo de trabajo BIM con Archicad 27.',
      icon: '🏛️'
  });
  console.log('✅ Curso Archicad creado/actualizado.');

  const modulesMap = [
    { id: 'mod_archi_1', title: 'Módulo 1: Fundamentos y Entorno', order: 1, courseId: COURSE_ID },
    { id: 'mod_archi_2', title: 'Módulo 2: Modelado MEP Básico', order: 2, courseId: COURSE_ID },
    { id: 'mod_archi_3', title: 'Módulo 3: Sistemas Avanzados y Coordinación', order: 3, courseId: COURSE_ID },
    { id: 'mod_archi_4', title: 'Módulo 4: Documentación y Proyecto Final', order: 4, courseId: COURSE_ID }
  ];

  let allLessons = [];

  for (const file of files) {
      const rawData = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const data = JSON.parse(rawData);
      
      const sessionNumber = data.mc_id;
      
      // Asignar a módulo (1-6 -> mod 1, 7-12 -> mod 2, etc.)
      const moduleIndex = Math.floor((sessionNumber - 1) / 6);
      const mod = modulesMap[moduleIndex] || modulesMap[3]; // Fallback al último módulo

      // CONSTRUIR HTML CON ESTILO TAILWIND (Cyberpunk / Moderno)
      
      let trucosHTML = '';
      if (data.trucos_y_atajos && data.trucos_y_atajos.length > 0) {
          trucosHTML = data.trucos_y_atajos.map((t) => `
            <div class="bg-black/50 border border-slate-700 p-4 rounded-xl shadow-sm hover:border-neon-cyan/50 transition-colors">
              <div class="text-neon-cyan font-bold mb-1 font-mono text-lg flex items-center gap-2">
                <svg class="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                ${t.atajo_teclado}
              </div>
              <h4 class="text-white font-semibold text-md mb-2">${t.nombre_truco}</h4>
              <p class="text-slate-400 text-sm leading-relaxed">${t.aplicacion_practica}</p>
            </div>
          `).join('');
      }

      let preparacionHTML = '';
      if (data.desarrollo_practico?.preparacion_entorno) {
          preparacionHTML = `
            <div class="mb-8 p-5 bg-black/40 border border-slate-700 rounded-xl">
              <h4 class="text-white font-bold mb-3 border-b border-slate-700 pb-2">1. Preparación del Entorno</h4>
              <ul class="list-disc pl-5 mt-2 space-y-2 text-slate-300">
                ${data.desarrollo_practico.preparacion_entorno.map((p) => `<li>${p}</li>`).join('')}
              </ul>
            </div>
          `;
      }

      let pasosHTML = '';
      if (data.desarrollo_practico?.paso_a_paso_enrutamiento) {
          pasosHTML = `
            <div>
              <h4 class="text-white font-bold mb-6 border-b border-slate-700 pb-2">2. Paso a Paso</h4>
              ${data.desarrollo_practico.paso_a_paso_enrutamiento.map((p) => `
                <div class="flex gap-4 items-start mb-6">
                  <div class="w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple text-neon-purple flex-shrink-0 flex items-center justify-center font-black mt-1 shadow-[0_0_10px_rgba(138,43,226,0.3)]">
                    ${p.paso}
                  </div>
                  <div>
                    <p class="text-slate-200 text-lg mb-1 leading-relaxed">${p.instruccion}</p>
                    <span class="inline-block bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded font-mono border border-slate-700">🛠️ ${p.herramienta_utilizada}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
      } else if (data.desarrollo_practico_paso_a_paso) {
          // NUEVO ESQUEMA
          pasosHTML = data.desarrollo_practico_paso_a_paso.map((p, idx) => {
            const pasosLista = p.instruccion_explicita.split('\n').map(paso => `<li class="mb-2">${paso}</li>`).join('');
            return `
              <div class="mb-8 p-5 bg-black/40 border border-slate-700 rounded-xl">
                <h4 class="text-white font-bold mb-3 border-b border-slate-700 pb-2">${p.fase}</h4>
                <ul class="list-none pl-1 mt-2 text-slate-200 text-lg leading-relaxed">
                  ${pasosLista}
                </ul>
                <div class="mt-4">
                  <span class="inline-block bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded font-mono border border-slate-700">🛠️ ${p.herramienta_oficial}</span>
                </div>
              </div>
            `;
          }).join('');
          
          if (data.actividad_nivel_medio) {
              pasosHTML += `
                <div class="mb-8 p-5 bg-indigo-900/20 border border-indigo-500/50 rounded-xl">
                  <h4 class="text-indigo-300 font-bold mb-3 border-b border-indigo-500/30 pb-2">Actividad Intermedia: ${data.actividad_nivel_medio.titulo_actividad}</h4>
                  <p class="text-slate-300 mb-4">${data.actividad_nivel_medio.descripcion}</p>
                  <ul class="list-disc pl-5 space-y-2 text-slate-300">
                    ${data.actividad_nivel_medio.pasos_actividad.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>
              `;
          }
      }

      let htmlContent = `
        <div class="mb-10 text-center">
          <div class="inline-block px-3 py-1 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-black tracking-widest text-xs mb-4 rounded-full">
            ${data.disciplina_mep.toUpperCase()} • NIVEL ${data.nivel.toUpperCase()}
          </div>
          <h2 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-sm mb-4 leading-tight">${data.titulo}</h2>
          <div class="inline-block bg-slate-800/80 px-5 py-3 rounded-xl border border-slate-700 shadow-sm max-w-3xl text-left">
            <p class="text-slate-300 text-sm m-0 leading-relaxed"><strong class="text-white">Objetivo:</strong> ${data.objetivo_tecnico || data.objetivos?.general}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-8">
          
          <!-- TRUCOS Y ATAJOS -->
          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors">
            <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
               <div class="w-10 h-10 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              Trucos y Atajos
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${trucosHTML}
            </div>
          </div>
          
          <!-- DESARROLLO PRÁCTICO -->
          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-colors">
            <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              Desarrollo Práctico
            </h3>
            
            ${preparacionHTML}
            ${pasosHTML}
          </div>
          
          <!-- DESAFÍO -->
          <div class="bg-black border-2 border-[#FFD700]/50 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.1)]">
            <div class="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-2xl"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] border border-[#FFD700]/50">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h3 class="text-2xl font-black text-white m-0 tracking-wide uppercase">Ejercicio Desafío</h3>
              </div>
              <div class="bg-[#12131A] border border-slate-800 p-5 rounded-xl text-slate-300 text-lg leading-relaxed shadow-inner">
                ${data.ejercicio_desafio}
              </div>
            </div>
          </div>
          
        </div>
      `;

      allLessons.push({
          id: `less_archicad_${data.mc_id}`,
          courseId: COURSE_ID,
          moduleId: mod.id,
          order: data.mc_id,
          title: `S${data.mc_id}: ${data.titulo}`,
          content: htmlContent,
          quizzes: data.evaluacion_rapida || []
      });
  }

  // Subir módulos
  console.log('\n--- INSERTANDO MÓDULOS ---');
  for (const mod of modulesMap) {
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
              // Mapeamos respuesta_correcta a correctAnswer
              correctAnswer: q.opciones.indexOf(q.respuesta_correcta) !== -1 ? q.opciones.indexOf(q.respuesta_correcta) : 0,
              explanation: q.retroalimentacion
          }));

          await db.collection('Quizzes').doc(quizId).set({
              lessonId: lesson.id,
              courseId: lesson.courseId,
              questions: formattedQuestions
          });
      }
      console.log(`✅ Lección subida: ${lesson.title}`);
  }

  console.log('\n--- SEED DE ARCHICAD COMPLETADO EXITOSAMENTE ---');
  process.exit(0);
}

seedArchicad().catch(console.error);
