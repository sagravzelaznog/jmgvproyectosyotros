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

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Configuración y Geometría -->
        <div class="bg-slate-900 rounded-xl p-6 shadow-md border border-slate-800">
            <h3 class="text-lg font-bold text-neon-green mb-4">⚙️ Configuración del Entorno</h3>
            <ul class="list-disc pl-5 space-y-2 mb-6">
                ${data.configuracion_entorno.map(c => `<li>${c}</li>`).join('')}
            </ul>
            
            <h3 class="text-lg font-bold text-neon-green mb-4">🔬 Análisis Geométrico</h3>
            <div class="space-y-4 text-sm">
                <p><span class="font-bold text-white">Origen:</span> ${data.analisis_geometrico.origen_coordenadas}</p>
                
                <div>
                    <span class="font-bold text-white block mb-2">Figuras Primitivas:</span>
                    <ul class="list-disc pl-5 space-y-1">
                        ${data.analisis_geometrico.figuras_primitivas.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                
                <div>
                    <span class="font-bold text-white block mb-2">Referencias a Objetos (Osnap):</span>
                    <div class="flex flex-wrap gap-2">
                        ${data.analisis_geometrico.osnap_requeridos.map(o => `<span class="bg-slate-800 px-2 py-1 rounded text-xs text-neon-cyan">${o}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- Fases de Dibujo -->
        <div class="bg-slate-900 rounded-xl p-6 shadow-md border border-slate-800">
            <h3 class="text-lg font-bold text-yellow-400 mb-4">🗺️ Fases de Dibujo</h3>
            <div class="space-y-6">
                ${data.fases_dibujo.map(f => `
                    <div class="border-l-2 border-yellow-400/50 pl-4 relative">
                        <div class="absolute -left-2.5 top-0 w-5 h-5 bg-yellow-400 rounded-full text-black flex items-center justify-center font-bold text-xs">${f.orden}</div>
                        <h4 class="font-bold text-white mb-1">${f.nombre_fase}</h4>
                        <p class="text-sm text-slate-400 mb-2">${f.instruccion_visual}</p>
                        <div class="flex flex-wrap gap-2">
                            ${f.comandos_clave.map(cmd => `<span class="bg-black border border-yellow-400/30 px-2 py-1 rounded text-xs font-mono text-yellow-200">${cmd}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <!-- Guía Paso a Paso -->
    <div class="mt-8">
        <h2 class="text-2xl font-black text-white mb-6 border-b border-slate-700 pb-2">👣 Procedimiento Paso a Paso</h2>
        <div class="space-y-4">
            ${data.guia_paso_a_paso.map(p => `
                <div class="bg-slate-900/80 p-5 rounded-lg border-l-4 border-neon-cyan hover:bg-slate-800 transition-colors">
                    <h3 class="font-bold text-lg text-white mb-2">Paso ${p.paso}: ${p.accion}</h3>
                    <ul class="list-decimal pl-6 space-y-1 text-slate-300 font-mono text-sm mb-3">
                        ${p.instrucciones.map(inst => `<li>${inst}</li>`).join('')}
                    </ul>
                    <div class="bg-neon-cyan/10 text-neon-cyan text-sm p-3 rounded flex gap-2 items-start">
                        <span>💡</span>
                        <p>${p.explicacion_didactica}</p>
                    </div>
                </div>
            `).join('')}
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
