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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Modificar Dibujos
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Aprende a editar tu trabajo de forma eficiente usando comandos para borrar, desplazar, copiar, recortar, empalmar y aplicar simetría a los objetos geométricos.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/modificar/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN Y SELECCIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                Selección Múltiple y Borrar
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Las herramientas más frecuentes se encuentran en el grupo <strong>Modificar</strong> de la ficha Inicio.</p>
                <img src="/courses/autocad/modificar/img_2.jpeg" alt="Grupo Modificar" class="rounded-xl border border-slate-700 shadow-md">
                
                <h3 class="text-lg font-bold text-white mt-6">Borrar y Seleccionar (B / SUPR)</h3>
                <p>Para borrar un objeto, seleccione el comando <code class="text-sky-400 font-mono">BORRA</code>, o pulse la tecla <kbd>Supr</kbd> después de seleccionarlo.</p>
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <h4 class="font-bold text-sky-400 mb-2">Métodos de Selección:</h4>
                    <ul class="space-y-4">
                        <li class="flex items-center gap-4">
                            <img src="/courses/autocad/modificar/img_3.jpeg" alt="Captura Verde" class="h-16 rounded bg-white p-1">
                            <div>
                                <strong class="text-slate-200">Captura (Verde):</strong> De derecha a izquierda. Selecciona todo lo que toca.
                            </div>
                        </li>
                        <li class="flex items-center gap-4">
                            <img src="/courses/autocad/modificar/img_4.jpeg" alt="Ventana Azul" class="h-16 rounded bg-white p-1">
                            <div>
                                <strong class="text-slate-200">Ventana (Azul):</strong> De izquierda a derecha. Selecciona SOLO lo que engloba por completo.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: MOVER Y COPIAR -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Desplazar y Copiar (CP / M)
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>Utilice <code class="text-sky-400 font-mono">COPIA</code> (CP) o <code class="text-sky-400 font-mono">DESPLAZA</code> (M) de forma eficiente. Hay dos métodos principales:</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700 space-y-4">
                    <h4 class="font-bold text-white text-lg">El método de distancia</h4>
                    <p class="text-xs text-slate-400">Si conoce la distancia exacta. Haga clic en un punto base, apunte con el ratón guiándose por el rastreo polar, y teclee la distancia directamente.</p>
                    <img src="/courses/autocad/modificar/img_6.jpeg" alt="Método distancia" class="rounded-lg shadow-md bg-white p-2">
                </div>
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700 space-y-4">
                    <h4 class="font-bold text-white text-lg">El método de dos puntos</h4>
                    <p class="text-xs text-slate-400">Si se guía por geometría existente (puntos finales, intersecciones), haga clic en el punto base y luego haga clic en el punto de destino.</p>
                    <img src="/courses/autocad/modificar/img_7.jpeg" alt="Método 2 puntos" class="rounded-lg shadow-md bg-white p-2">
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center p-4 bg-slate-900/30 rounded-lg">
                <span class="font-bold text-white">Copias Múltiples:</span>
                <img src="/courses/autocad/modificar/img_10.jpeg" alt="Multiples" class="h-16 rounded bg-white p-1">
                <img src="/courses/autocad/modificar/img_11.jpeg" alt="Lineales" class="h-16 rounded bg-white p-1">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: DESFASAR Y RECORTAR -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Desfasar, Recortar y Alargar
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4 text-slate-300 text-sm">
                <h3 class="text-lg font-bold text-white">Desfasar (Offset / O)</h3>
                <p>Permite crear líneas y curvas paralelas de forma fácil. Es muy común para dibujar muros.</p>
                <img src="/courses/autocad/modificar/img_12.jpeg" alt="Desfasar Ribbon" class="rounded-lg shadow-md max-w-[200px]">
                <img src="/courses/autocad/modificar/img_13.jpeg" alt="Offset Polilinea" class="rounded-lg shadow-md bg-white p-2">
            </div>
            <div class="space-y-4 text-slate-300 text-sm">
                <h3 class="text-lg font-bold text-white">Recortar (TR) y Alargar (EX)</h3>
                <p>Estas son de las operaciones más utilizadas para limpiar intersecciones.</p>
                <div class="flex gap-4 mb-4">
                    <img src="/courses/autocad/modificar/img_15.jpeg" alt="Alargar 1" class="rounded-lg w-1/2 bg-white p-2">
                    <img src="/courses/autocad/modificar/img_16.jpeg" alt="Alargar 2" class="rounded-lg w-1/2 bg-white p-2">
                </div>
                <img src="/courses/autocad/modificar/img_17.jpeg" alt="Recortar" class="rounded-lg shadow-md bg-white p-2 max-w-[200px]">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 4: SIMETRÍA Y ESTIRAMIENTO -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">4</span>
                Simetría, Estiramiento y Empalme
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <h3 class="text-xl font-bold text-white">Simetría (Mirror / MI)</h3>
                    <p>Ahorre la mitad del trabajo modelando solo una mitad y espejeando el resto.</p>
                    <img src="/courses/autocad/modificar/img_19.jpeg" alt="Eje Simetria" class="rounded-lg bg-white p-2 max-w-full">
                    <p class="text-xs text-slate-400">Debe seleccionar los objetos y luego trazar el "Eje de simetría". Posteriormente elija si desea borrar o mantener el objeto original.</p>
                </div>
                <div class="lg:col-span-5">
                    <img src="/courses/autocad/modificar/img_18.jpeg" alt="Simetria Baño" class="rounded-lg bg-white p-2 w-full">
                </div>
            </div>
            
            <hr class="border-slate-700">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-white">Estirar (Stretch / S)</h3>
                    <p>Alarga o acorta partes de un modelo. <strong>Solo funciona con la selección de captura verde</strong> (de derecha a izquierda).</p>
                    <img src="/courses/autocad/modificar/img_22.jpeg" alt="Estirar 50" class="rounded-lg bg-white p-2 max-w-full">
                </div>
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-white">Empalme (Fillet / F)</h3>
                    <p>Crea esquinas redondeadas entre objetos. Si usa un radio de 0, crea esquinas puntiagudas perfectas limpiando el sobrante.</p>
                    <img src="/courses/autocad/modificar/img_23.jpeg" alt="Fillet" class="rounded-lg bg-white p-2 max-w-[150px]">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 5: PINZAMIENTOS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 class="text-xl font-bold text-white mb-4">Edición por Pinzamientos (Grips)</h3>
        <p class="text-slate-300 text-sm mb-4">Si selecciona un objeto sin ejecutar ningún comando, aparecerán cuadros azules (pinzamientos). Haga clic en uno de ellos para Estirar, Mover o cambiar sus dimensiones rápidamente.</p>
        <div class="flex justify-center">
            <img src="/courses/autocad/modificar/img_25.jpeg" alt="Pinzamientos" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 max-w-full">
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Modificar...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_modificar_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Edición y Modificación de Dibujos',
    description: 'Trabaja más rápido modificando geometría existente con herramientas como Copiar, Recortar, Alargar, Desfasar y Simetría.',
    content: styledHtmlContent,
    order: 0.9,
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Modificar publicada con éxito (Orden 0.9).');
}

run().catch(console.error);
