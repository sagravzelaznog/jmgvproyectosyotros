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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Módulo 0: Conceptos Básicos
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Geometría y Comandos Esenciales
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Aprende a crear objetos geométricos básicos, como líneas, círculos y áreas sombreadas. Conoce los comandos indispensables para la mayoría de los dibujos 2D en AutoCAD.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/preliminares/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN Y CONSEJOS -->
    <div class="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-sm">
        <div class="flex gap-4 items-start">
            <div class="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
                <h3 class="text-lg font-bold text-slate-100 mb-2">Consejo de Interfaz</h3>
                <p class="text-slate-300 text-sm leading-relaxed">
                    Si desea simplificar la visualización al crear objetos geométricos, pulse <kbd class="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sky-400 font-mono text-xs">F12</kbd> para desactivar la entrada dinámica.
                </p>
            </div>
        </div>
    </div>

    <!-- SECCIÓN 1: LÍNEAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                Dibujo de Líneas
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>La línea es el objeto más básico y habitual en los dibujos de AutoCAD. Para dibujar una línea, pulse la herramienta <strong>Línea</strong> en la cinta de opciones, o escriba <code class="text-sky-400 font-mono">LINE</code> (o <code class="text-sky-400 font-mono">L</code>) en la ventana de comandos.</p>
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <p class="font-semibold text-slate-200 mb-2">Pasos para una línea precisa:</p>
                    <ol class="list-decimal list-inside space-y-2">
                        <li>Especifique el punto inicial escribiendo coordenadas cartesianas (ej. <code class="text-sky-400">0,0</code>).</li>
                        <li>Pulse Intro o la barra espaciadora.</li>
                        <li>Especifique el siguiente punto. El comando se repetirá automáticamente.</li>
                        <li>Pulse Intro para finalizar.</li>
                    </ol>
                </div>
            </div>
            <div class="space-y-4">
                <img src="/courses/autocad/preliminares/img_2.jpeg" alt="Herramienta Línea" class="rounded-xl border border-slate-700 shadow-md w-full object-cover">
                <img src="/courses/autocad/preliminares/img_3.jpeg" alt="Comando Línea" class="rounded-xl border border-slate-700 shadow-md w-full object-cover">
            </div>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-5 bg-slate-900/50 rounded-xl border border-slate-700">
                <h4 class="font-bold text-white mb-2">Visualización de la Rejilla</h4>
                <p class="text-slate-400 text-xs">Pulse <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-sky-400 font-mono">F7</kbd> para activar/desactivar la visualización de la rejilla. Utilice <kbd class="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-sky-400 font-mono">F9</kbd> para forzar el cursor a incrementos de rejilla.</p>
            </div>
            <div class="p-5 bg-slate-900/50 rounded-xl border border-slate-700">
                <h4 class="font-bold text-white mb-2">Líneas como Ayudas de Construcción</h4>
                <p class="text-slate-400 text-xs">Las líneas sirven como geometría de referencia: vértices de propiedad, líneas simétricas, separaciones para evitar interferencias y trayectorias de recorrido.</p>
            </div>
        </div>
        <div class="mt-6 flex justify-center">
             <img src="/courses/autocad/preliminares/img_4.jpeg" alt="Ejemplo de Rejilla" class="rounded-xl border border-slate-700 shadow-md max-h-48 object-contain">
        </div>
    </section>

    <!-- SECCIÓN 2: CÍRCULOS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Círculos y Geometría de Referencia
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>La opción por defecto del comando <code class="text-sky-400 font-mono">CIRCULO</code> (o <code class="text-sky-400 font-mono">C</code>) consiste en especificar un punto central y un radio.</p>
                <p>Hay opciones adicionales disponibles en el menú desplegable (Centro-Diámetro, 2 puntos, 3 puntos, Tangente-Tangente-Radio, etc.). Estas herramientas son invaluables no solo para dibujar piezas circulares, sino como geometría de referencia para calcular áreas de interferencia, como el radio de apertura de dos puertas contiguas.</p>
            </div>
            <div class="lg:col-span-5 grid grid-cols-2 gap-4">
                <img src="/courses/autocad/preliminares/img_5.jpeg" alt="Botón Círculo" class="rounded-xl border border-slate-700 shadow-md">
                <img src="/courses/autocad/preliminares/img_6.jpeg" alt="Menú Círculo" class="rounded-xl border border-slate-700 shadow-md">
            </div>
        </div>
        
        <div class="mt-6 flex justify-center gap-6">
            <img src="/courses/autocad/preliminares/img_7.jpeg" alt="Comando Círculo" class="rounded-xl border border-slate-700 shadow-md h-12 object-contain">
            <img src="/courses/autocad/preliminares/img_8.jpeg" alt="Círculos de Interferencia" class="rounded-xl border border-slate-700 shadow-md h-32 object-contain bg-slate-200">
        </div>
    </section>

    <!-- SECCIÓN 3: POLILÍNEAS Y RECTÁNGULOS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Polilíneas y Rectángulos
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>Una <strong>polilínea</strong> es una secuencia de segmentos lineales o de arco conectados que se crea como un único objeto. Utilice el comando <code class="text-sky-400 font-mono">POL</code> para rutas continuas, contornos topográficos o diagramas alámbricos.</p>
            
            <div class="flex flex-wrap md:flex-nowrap gap-6 items-start">
                <div class="w-full md:w-1/3 space-y-4">
                    <img src="/courses/autocad/preliminares/img_9.jpeg" alt="Polilínea" class="rounded-xl border border-slate-700 shadow-md w-full">
                    <img src="/courses/autocad/preliminares/img_10.jpeg" alt="Comando POL" class="rounded-xl border border-slate-700 shadow-md w-full">
                </div>
                <div class="w-full md:w-2/3 bg-slate-900/50 p-5 rounded-xl border border-slate-700 space-y-4">
                    <h4 class="font-bold text-white">Grosores Variables</h4>
                    <p class="text-slate-400 text-xs">Las polilíneas pueden tener una anchura constante o diferentes anchuras iniciales y finales para cada segmento. Esto es ideal para diseñar placas de circuitos impresos o diagramas de tuberías.</p>
                    <div class="flex gap-4 items-center">
                        <img src="/courses/autocad/preliminares/img_11.jpeg" alt="Circuito Impreso" class="rounded-lg h-24 object-cover border border-slate-600">
                        <img src="/courses/autocad/preliminares/img_12.jpeg" alt="Grosor Polilínea" class="rounded-lg h-24 object-cover border border-slate-600 bg-white">
                    </div>
                </div>
            </div>

            <hr class="border-slate-700 my-8">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 class="text-xl font-bold text-white mb-3">Rectángulos y SCP</h3>
                    <p class="mb-4">Una manera rápida de crear polilíneas rectangulares cerradas es usar el comando <code class="text-sky-400 font-mono">RECTANG</code> (o <code class="text-sky-400 font-mono">REC</code>). Solo tiene que hacer clic en dos puntos diagonales.</p>
                    <p class="text-xs text-slate-400">Si reorienta el Sistema de Coordenadas Personales (SCP), los rectángulos se alinearán automáticamente al nuevo eje X.</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <img src="/courses/autocad/preliminares/img_13.jpeg" alt="Rectángulo" class="rounded-xl border border-slate-700 shadow-md">
                    <img src="/courses/autocad/preliminares/img_14.jpeg" alt="Puntos Diagonales" class="rounded-xl border border-slate-700 shadow-md bg-white p-2">
                    <img src="/courses/autocad/preliminares/img_15.jpeg" alt="SCP" class="col-span-2 rounded-xl border border-slate-700 shadow-md bg-white p-2">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 4: SOMBREADOS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">4</span>
                Sombreados y Orden de Objetos
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>El sombreado (<code class="text-sky-400 font-mono">SOMBREA</code>) es un bloque compuesto que cubre un área especificada con un patrón de líneas, puntos, formas o un relleno sólido/degradado.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <img src="/courses/autocad/preliminares/img_16.jpeg" alt="Sombreado Comando" class="rounded-xl border border-slate-700 shadow-md w-full">
                <img src="/courses/autocad/preliminares/img_19.jpeg" alt="Transparencia" class="rounded-xl border border-slate-700 shadow-md w-full">
                <img src="/courses/autocad/preliminares/img_21.jpeg" alt="Orden Objetos" class="rounded-xl border border-slate-700 shadow-md w-full">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-6">
                <div class="space-y-4">
                    <h4 class="font-bold text-white">Aplicación de Sombreados</h4>
                    <p class="text-slate-400">Al iniciar el comando, la cinta de opciones mostrará más de 70 patrones ISO e imperiales. Puede ajustar la escala, la transparencia y el origen del patrón.</p>
                    <img src="/courses/autocad/preliminares/img_17.jpeg" alt="Sombreados Patrón" class="rounded-xl border border-slate-700 shadow-md w-full bg-slate-200">
                </div>
                <div class="space-y-4">
                    <h4 class="font-bold text-white">Orden de Dibujo</h4>
                    <p class="text-slate-400">Utilice el comando <code class="text-sky-400 font-mono">ORDENAOBJETOS</code> para decidir qué elementos se superponen. Por ejemplo, una carretera que cruza un río, o un sombreado sólido con transparencia.</p>
                    <div class="grid grid-cols-2 gap-2">
                        <img src="/courses/autocad/preliminares/img_18.jpeg" alt="Sombreado Sólido" class="rounded-xl border border-slate-700 shadow-md w-full bg-slate-200">
                        <img src="/courses/autocad/preliminares/img_20.jpeg" alt="Orden Objetos Visual" class="rounded-xl border border-slate-700 shadow-md w-full bg-slate-200">
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando actualización de la lección preliminar de AutoCAD con nuevo diseño...');

  // Actualizar la lección
  const lessonId = 'lesson_0_autocad';
  const lessonData = {
    content: styledHtmlContent,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de preliminares rediseñada con éxito.');
  
  console.log('🎉 Terminado!');
}

run().catch(console.error);
