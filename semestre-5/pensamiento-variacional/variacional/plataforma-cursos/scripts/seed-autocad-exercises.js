const fs = require('fs');
const path = require('path');
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
  console.log('🚀 Iniciando subida de 40 Ejercicios de AutoCAD...');

  const courseId = 'autocad';
  const moduleId = 'mod_ejercicios_2d';
  
  const exercisesDir = "C:\\\\Users\\\\admin\\\\Documents\\\\000 A PREPA\\\\planeaciones especialidades\\\\Proyectos y Otros\\\\semestre-5\\\\pensamiento-variacional\\\\cursos\\\\Autocad";
  
  for (let i = 1; i <= 40; i++) {
    const filePath = path.join(exercisesDir, `ejercicio_${i}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Archivo no encontrado: ejercicio_${i}.json`);
      continue;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const lessonId = `autocad_ejercicio_${i}`;
    
    // Construir HTML Premium a partir del JSON
    let unifiedStepsHtml = '';
    const maxSteps = Math.max(data.fases_dibujo.length, data.guia_paso_a_paso.length);
    for (let j = 0; j < maxSteps; j++) {
        const fase = data.fases_dibujo[j] || {};
        const paso = data.guia_paso_a_paso[j] || {};
        const stepNum = fase.orden || paso.paso || (j + 1);
        const stepTitle = fase.nombre_fase || paso.accion || `Paso ${stepNum}`;
        
        const visualInstruction = fase.instruccion_visual ? `<p class="text-slate-300 text-lg mb-3"><strong>Objetivo de la fase:</strong> ${fase.instruccion_visual}</p>` : '';
        const commands = fase.comandos_clave ? `<div class="flex flex-wrap gap-2 mb-4">${fase.comandos_clave.map(cmd => `<span class="bg-black border border-yellow-400/30 px-3 py-1 rounded text-sm font-mono text-yellow-200 shadow-[0_0_5px_rgba(250,204,21,0.2)]">${cmd}</span>`).join('')}</div>` : '';
        
        // Convert array of instructions into a cohesive paragraph separated by spaces or line breaks
        const instructionsText = paso.instrucciones ? `<div class="bg-black/30 p-4 rounded-md border border-slate-700 font-mono text-sm text-slate-300 leading-relaxed mb-4">${paso.instrucciones.join(' ')}</div>` : '';
        
        const tip = paso.explicacion_didactica ? `<div class="bg-neon-cyan/10 text-neon-cyan text-sm p-4 rounded-lg flex gap-3 items-start border border-neon-cyan/20"><span class="text-xl">💡</span><p class="leading-relaxed">${paso.explicacion_didactica}</p></div>` : '';

        unifiedStepsHtml += `
        <div class="bg-slate-900/80 p-6 md:p-8 rounded-xl border-l-4 border-yellow-400 hover:bg-slate-800 transition-colors relative shadow-lg">
            <div class="absolute -left-4 top-6 w-8 h-8 bg-yellow-400 rounded-full text-black flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(250,204,21,0.6)]">${stepNum}</div>
            <h3 class="font-black text-2xl text-white mb-4 ml-4">${stepTitle}</h3>
            <div class="ml-4">
                ${visualInstruction}
                ${commands}
                ${instructionsText}
                ${tip}
            </div>
        </div>
        `;
    }

    let htmlContent = `
<div class="space-y-8 text-slate-300">
    <!-- Encabezado y Objetivo -->
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 border-l-4 border-neon-cyan p-8 rounded-xl shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -top-10 text-9xl text-white/5 opacity-10">📐</div>
        <h1 class="text-3xl font-black text-white mb-4 drop-shadow-md">${data.titulo}</h1>
        <p class="text-lg text-neon-cyan font-semibold">📍 Objetivo de Aprendizaje:</p>
        <p class="text-slate-300 mt-2">${data.objetivo_aprendizaje}</p>
        <div class="mt-4 inline-block bg-white/10 px-4 py-1 rounded-full text-sm font-mono border border-white/20">
            Referencia PDF: Página ${data.pagina_pdf}
        </div>
    </div>

    <!-- Guión de Síntesis -->
    <div class="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
        <h3 class="text-xl font-bold text-neon-pink mb-3 flex items-center gap-2">
            <span>🎙️</span> Nota del Instructor
        </h3>
        <p class="italic text-slate-400">"${data.guion_sintesis_voz}"</p>
    </div>

    <!-- Configuración y Geometría (Unificado a ancho completo) -->
    <div class="bg-slate-900 rounded-xl p-6 md:p-8 shadow-md border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <h3 class="text-xl font-bold text-neon-green mb-4 flex items-center gap-2"><span>⚙️</span> Configuración del Entorno</h3>
            <ul class="list-disc pl-5 space-y-2 text-slate-300">
                ${data.configuracion_entorno.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>
        
        <div>
            <h3 class="text-xl font-bold text-neon-green mb-4 flex items-center gap-2"><span>🔬</span> Análisis Geométrico</h3>
            <div class="space-y-4 text-sm text-slate-300">
                <p><span class="font-bold text-white text-base">Origen:</span> ${data.analisis_geometrico.origen_coordenadas}</p>
                
                <div>
                    <span class="font-bold text-white block mb-2">Figuras Primitivas:</span>
                    <ul class="list-disc pl-5 space-y-1">
                        ${data.analisis_geometrico.figuras_primitivas.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                
                <div>
                    <span class="font-bold text-white block mb-3">Referencias a Objetos (Osnap):</span>
                    <div class="flex flex-wrap gap-2">
                        ${data.analisis_geometrico.osnap_requeridos.map(o => `<span class="bg-slate-800 px-3 py-1.5 rounded-md text-xs font-medium text-neon-cyan border border-neon-cyan/20">${o}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Desarrollo Unificado del Ejercicio -->
    <div class="mt-12">
        <h2 class="text-3xl font-black text-white mb-8 flex items-center gap-3 border-b border-slate-700 pb-4">
            <span class="text-yellow-400">🚀</span> Desarrollo Detallado del Ejercicio
        </h2>
        <div class="space-y-8">
            ${unifiedStepsHtml}
        </div>
    </div>

    <!-- Código de Verificación -->
    <div class="mt-8 bg-black rounded-xl p-6 border border-slate-800">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💻</span> Código de Verificación
        </h3>
        <p class="text-sm text-slate-400 mb-4">Puedes copiar este script y pegarlo en la línea de comandos de AutoCAD para verificar si tu resultado es idéntico a la plantilla geométrica matemática.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 class="text-sm font-bold text-neon-pink mb-2">AutoLISP</h4>
                <pre class="bg-slate-900 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-300 border border-slate-800"><code>${data.codigo_verificacion.autolisp}</code></pre>
            </div>
            <div>
                <h4 class="text-sm font-bold text-neon-green mb-2">Script (.SCR)</h4>
                <pre class="bg-slate-900 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-300 border border-slate-800"><code>${data.codigo_verificacion.script_scr}</code></pre>
            </div>
        </div>
    </div>
</div>
    `;

    const lessonData = {
      id: lessonId,
      courseId: courseId,
      moduleId: moduleId,
      title: data.titulo,
      description: data.objetivo_aprendizaje,
      content: htmlContent,
      order: i + 1, // Desplazar después de las masterclasses introductorias
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
    console.log(`✅ Ejercicio ${i} subido exitosamente.`);
  }

  console.log('🎉 Subida masiva de ejercicios de AutoCAD completada.');
}

run().catch(console.error);
