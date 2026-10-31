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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Presentación e Impresión
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Aprende la diferencia entre el Espacio Modelo y el Espacio Papel para preparar tus dibujos a escala, configurar hojas de impresión y crear ventanas gráficas.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/presentacion/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- SECCIÓN 1: ESPACIO MODELO VS PAPEL -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                El Espacio Modelo y el Espacio Papel
            </h2>
        </div>
        
        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>En AutoCAD existen dos entornos de trabajo fundamentales: el lugar donde dibujas la geometría a escala real y el lugar donde preparas la hoja de impresión.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h3 class="text-lg font-bold text-sky-400 mb-3">Ficha Modelo (Espacio Modelo)</h3>
                    <p class="mb-4">Es el entorno infinito donde se crea toda la geometría del modelo a tamaño completo (escala 1:1).</p>
                    <img src="/courses/autocad/presentacion/img_5.jpeg" alt="Espacio Modelo" class="rounded-lg shadow-md bg-white p-2 w-full max-w-[200px] mx-auto">
                </div>
                
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h3 class="text-lg font-bold text-sky-400 mb-3">Ficha Presentación (Espacio Papel)</h3>
                    <p class="mb-4">Simula una hoja de papel real. Aquí se añaden notas, membretes (cajetines) y se crean "ventanas" para ver el modelo a una escala específica.</p>
                    <img src="/courses/autocad/presentacion/img_6.jpeg" alt="Espacio Papel" class="rounded-lg shadow-md bg-white p-2 w-full max-w-[200px] mx-auto">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: CONFIGURACIÓN DE PÁGINA -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Configurar el Tamaño de Papel
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5">
                <img src="/courses/autocad/presentacion/img_2.jpeg" alt="Menú Presentación" class="rounded-xl border border-slate-700 shadow-md w-full bg-slate-200">
            </div>
            <div class="lg:col-span-7 space-y-4 text-slate-300 text-sm">
                <p>Lo primero que debe hacer al acceder a una ficha Presentación es hacer clic con el botón derecho en su pestaña y acceder al <strong>Administrador de configuraciones de página</strong>.</p>
                <div class="flex gap-4 items-center">
                    <img src="/courses/autocad/presentacion/img_3.jpeg" alt="Tamaño Papel" class="rounded-lg shadow-md max-w-[200px]">
                    <img src="/courses/autocad/presentacion/img_4.jpeg" alt="Orientación" class="rounded-lg shadow-md max-w-[150px]">
                </div>
                <p class="text-xs text-slate-400 mt-2">Allí podrá especificar el dispositivo de impresión (Plotter), el tamaño de la hoja (ej. ISO A3, Carta) y la orientación (Vertical u Horizontal).</p>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: VENTANAS GRÁFICAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Ventanas Gráficas de Presentación
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <p>Una ventana gráfica de presentación (Viewport) es un objeto que se crea en el Espacio Papel para visualizar una vista a escala del Espacio Modelo. <strong>Considéralo como un monitor de circuito cerrado</strong> que enfoca tu modelo.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">Pinzamientos y Edición</h3>
                    <p>Al seleccionar el borde de una ventana gráfica, aparecen pinzamientos que permiten ajustar el tamaño del marco o cambiar rápidamente la escala de la vista.</p>
                    <div class="mt-4 flex gap-4">
                        <img src="/courses/autocad/presentacion/img_7.jpeg" alt="Pinzamientos Viewport" class="rounded-lg shadow-md bg-white p-2 max-w-[200px]">
                        <img src="/courses/autocad/presentacion/img_11.jpeg" alt="Pinzamiento Escala" class="rounded-lg shadow-md bg-white p-2 max-w-[150px]">
                    </div>
                </div>

                <div class="bg-blue-900/30 p-5 rounded-xl border border-blue-800">
                    <h3 class="text-lg font-bold text-white mb-2">Alternar Espacios</h3>
                    <p>Haga <strong>doble clic dentro</strong> de una ventana gráfica para acceder al espacio modelo desde la hoja de papel. El borde se volverá grueso. Haga <strong>doble clic fuera</strong> para volver al espacio papel.</p>
                    <div class="flex gap-4 mt-3">
                        <img src="/courses/autocad/presentacion/img_8.jpeg" alt="Borde delgado" class="w-1/2 rounded bg-white p-1">
                        <img src="/courses/autocad/presentacion/img_9.jpeg" alt="Borde grueso" class="w-1/2 rounded bg-white p-1 border-2 border-sky-400">
                    </div>
                </div>
            </div>

            <hr class="border-slate-700">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">Crear nuevas ventanas (VMULT)</h3>
                    <p>Para mostrar detalles, puede crear múltiples ventanas gráficas en una sola hoja. Use el comando <code class="text-sky-400 font-mono">VMULT</code> (o desde la cinta de opciones) para definir un área rectangular.</p>
                    <p class="text-xs text-amber-300">Consejo: Se recomienda crear los objetos de ventana gráfica en una capa independiente (ej. <code>Defpoints</code> o una capa que no se imprima), para ocultar los bordes negros al momento de trazar.</p>
                </div>
                <img src="/courses/autocad/presentacion/img_10.jpeg" alt="Flujo VMULT" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 4: ANOTACIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 class="text-xl font-bold text-white mb-4">Anotación Transespacial (Recomendado)</h3>
        <p class="text-slate-300 text-sm mb-4">El método más sencillo y directo para acotar es crear la geometría en el <strong>espacio modelo</strong>, pero colocar todas las cotas, textos y membretes directamente en el <strong>espacio papel</strong> (sobre la ventana gráfica).</p>
        
        <div class="flex justify-center">
            <img src="/courses/autocad/presentacion/img_12.jpeg" alt="Anotacion Transespacial" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 max-w-full">
        </div>
        <p class="text-xs text-slate-400 mt-3 text-center">De esta forma, todas tus cotas siempre imprimirán al tamaño perfecto, sin necesidad de calcular escalas inversas.</p>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Presentación...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_presentacion_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Presentación e Impresión (Layout)',
    description: 'Aprende a configurar el tamaño de hoja, crear ventanas gráficas y utilizar el Espacio Papel para generar planos listos para imprimir.',
    content: styledHtmlContent,
    order: 0.99,
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Presentación publicada con éxito (Orden 0.99).');
}

run().catch(console.error);
