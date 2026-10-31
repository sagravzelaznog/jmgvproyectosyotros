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

const styledHtmlContent = `
<div class="space-y-12">
    <!-- HEADER / HERO -->
    <header class="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border-b border-sky-800 shadow-xl overflow-hidden relative rounded-2xl">
        <div class="px-6 py-10 sm:px-10 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-8 space-y-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Precisión y Referencias a Objetos
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Aprende a garantizar la exactitud en tus modelos utilizando rastreo polar, bloqueo de ángulos y referencias automáticas a geometría existente (OSNAP).
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/precision/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN A LA PRECISIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 class="text-xl font-bold text-white mb-4">Funciones de Precisión Disponibles</h3>
        <p class="text-slate-300 text-sm mb-4">Existen múltiples herramientas para asegurar que las líneas, círculos y polígonos encajen perfectamente:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <span class="text-sky-400 font-bold block mb-1">Rastreo polar</span>
                <span class="text-slate-400">Fuerza el cursor al ángulo predefinido más cercano.</span>
            </div>
            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <span class="text-sky-400 font-bold block mb-1">Bloqueo de ángulos</span>
                <span class="text-slate-400">Mantiene una dirección estricta mientras se especifica una distancia.</span>
            </div>
            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <span class="text-sky-400 font-bold block mb-1">Referencias a objetos</span>
                <span class="text-slate-400">Atrapa puntos exactos de geometría (punto final, centro, intersección).</span>
            </div>
            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <span class="text-sky-400 font-bold block mb-1">Referencia a rejilla</span>
                <span class="text-slate-400">Fuerza el cursor a incrementos fijos de la cuadrícula.</span>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 1: RASTREO POLAR Y ÁNGULOS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                Rastreo Polar y Bloqueo de Ángulos
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <h3 class="text-lg font-bold text-white">Rastreo Polar</h3>
                <p>Al crear una línea, mueva el cursor a la derecha. Aparecerá una línea de rastreo verde indicando que está perfectamente horizontal.</p>
                <img src="/courses/autocad/precision/img_2.jpeg" alt="Rastreo Polar" class="rounded-xl border border-slate-700 shadow-md bg-white p-2">
                <p class="text-xs text-slate-400">Por defecto, el rastreo polar está activado y guía el cursor en dirección horizontal (0, 180) o vertical (90, 270 grados).</p>
                
                <h3 class="text-lg font-bold text-white mt-6">Bloqueo de Ángulos</h3>
                <p>Para dibujar en un ángulo específico (ej. 45 grados), escriba el símbolo <code class="text-sky-400 font-mono">&lt;</code> seguido del ángulo (<code class="text-sky-400 font-mono">&lt;45</code>) en la ventana de comandos.</p>
                <img src="/courses/autocad/precision/img_3.jpeg" alt="Bloqueo Ángulo" class="rounded-xl border border-slate-700 shadow-md">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: REFERENCIAS A OBJETOS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Referencias a Objetos (OSNAP)
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>Con diferencia, el método más importante para especificar ubicaciones precisas es utilizar las Referencias a objetos. Existen marcadores visuales (cuadrados, cruces, triángulos) que te indican a qué tipo de geometría se adherirá el cursor.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <img src="/courses/autocad/precision/img_4.jpeg" alt="Marcadores de referencia" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain max-h-64">
                
                <div class="space-y-4">
                    <img src="/courses/autocad/precision/img_5.jpeg" alt="Snap Punto Final" class="rounded-xl border border-slate-700 shadow-md bg-white p-2">
                    <p class="text-xs text-slate-400">Cuando AutoCAD pide especificar un punto (ej. inicio de una línea) y el cursor se acerca al final de otra línea, se <em>ajusta automáticamente</em> a ella.</p>
                </div>
            </div>

            <hr class="border-slate-700">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">Definir Referencias por Defecto</h3>
                    <p class="mb-4">Escriba <code class="text-sky-400 font-mono">REFENT</code> para abrir el cuadro de diálogo y configurar las referencias activas continuamente.</p>
                    <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
                        <h4 class="font-bold text-amber-400 text-sm mb-1">Recomendación</h4>
                        <p class="text-amber-200/80 text-xs">Mantenga pulsada la tecla <strong>MAYÚS</strong> y haga <strong>clic derecho</strong> en el área de dibujo para forzar una referencia a objetos temporal de uso único.</p>
                    </div>
                </div>
                <img src="/courses/autocad/precision/img_6.jpeg" alt="Menú Referencias" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 max-h-64 object-contain mx-auto">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: RASTREO Y VERIFICACIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Rastreo y Comprobación (DIST)
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 class="text-xl font-bold text-white mb-3">Rastreo de referencia a objetos</h3>
                    <p>Permite alinear puntos en sentido horizontal y vertical desde ubicaciones base. Simplemente deslice (sin hacer clic) el cursor sobre el punto base para activar el vector de rastreo verde.</p>
                </div>
                <img src="/courses/autocad/precision/img_7.jpeg" alt="Rastreo OSNAP" class="rounded-xl border border-slate-700 shadow-md bg-white p-2">
            </div>
            
            <hr class="border-slate-700">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-white mb-3">Compruebe su trabajo</h3>
                    <p>Vuelva a comprobar la geometría para detectar errores utilizando el comando <code class="text-sky-400 font-mono">DIST</code> (o <code class="text-sky-400 font-mono">DI</code>) para medir distancias precisas.</p>
                    <img src="/courses/autocad/precision/img_9.jpeg" alt="Comando DIST Output" class="rounded-lg shadow-md w-full">
                </div>
                <img src="/courses/autocad/precision/img_8.jpeg" alt="Comando DIST" class="rounded-xl border border-slate-700 shadow-md bg-slate-200 p-2">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 4: TECLAS DE FUNCIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">4</span>
                Referencia de Teclas de Función
            </h2>
        </div>

        <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
            <p>La mayoría de las herramientas de precisión se activan o desactivan rápidamente utilizando las teclas <kbd>F1</kbd> a <kbd>F12</kbd>.</p>
            <div class="flex justify-center">
                <img src="/courses/autocad/precision/img_10.jpeg" alt="Tabla Teclas de Función" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 max-w-full">
            </div>
            <div class="bg-blue-900/30 p-3 rounded-lg border border-blue-800 text-blue-200 text-xs text-center mt-4">
                <strong>Nota:</strong> F8 (Orto) y F10 (Rastreo polar) se excluyen mutuamente. Activar uno, desactiva el otro.
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Precisión...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_precision_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Precisión y Referencias a Objetos',
    description: 'Aprende a usar rastreo polar, bloqueo de ángulos, teclas F1-F12 y Referencias a Objetos (OSNAP) para modelar con medidas exactas.',
    content: styledHtmlContent,
    order: 0.5, // Entre Geometría (0) y lo que siga.
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Precisión publicada con éxito (Orden 0.5).');
  
  console.log('🎉 Terminado!');
}

run().catch(console.error);
