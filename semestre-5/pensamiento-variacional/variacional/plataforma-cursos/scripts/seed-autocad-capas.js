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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Organización con Capas
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Aprende a organizar la complejidad visual de tus dibujos mediante la asignación de objetos a capas, permitiéndote mostrar u ocultar componentes específicos según necesites.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/capas/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN A LAS CAPAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                El Concepto de Capas
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Cuando un dibujo se convierte en un elemento visualmente complejo, puede ocultar los objetos que no necesita ver actualmente organizándolos en <strong>capas asociadas a una función o un objetivo específicos</strong>.</p>
                
                <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
                    <p class="text-amber-200/90 text-sm leading-relaxed"><strong>Importante:</strong> Resista la tentación de crear todos los elementos en una sola capa. Las capas son la función de organización más importante de los dibujos de AutoCAD.</p>
                </div>

                <div class="mt-4">
                    <h4 class="font-bold text-white mb-2">Con las capas, puede:</h4>
                    <ul class="list-disc list-inside space-y-1 text-slate-400">
                        <li>Asociar objetos según su función o ubicación.</li>
                        <li>Mostrar u ocultar todos los objetos relacionados en una única operación.</li>
                        <li>Forzar el tipo de línea, el color y otras normas de propiedades para cada capa.</li>
                    </ul>
                </div>
            </div>
            
            <div class="flex flex-col space-y-4">
                <div class="flex gap-4">
                    <img src="/courses/autocad/capas/img_2.jpeg" alt="Dibujo Completo" class="rounded-xl border border-slate-700 shadow-md w-1/2 object-contain bg-white p-1">
                    <img src="/courses/autocad/capas/img_3.jpeg" alt="Dibujo Simplificado" class="rounded-xl border border-slate-700 shadow-md w-1/2 object-contain bg-white p-1">
                </div>
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700 w-full text-center shadow-inner">
                    <p class="text-xs text-slate-400 mb-3 font-mono">Las capas actúan como hojas de plástico transparentes superpuestas.</p>
                    <img src="/courses/autocad/capas/img_4.jpeg" alt="Hojas Transparentes" class="mx-auto rounded-lg object-contain h-32">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: ADMINISTRADOR DE CAPAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Administrador de Propiedades de Capas
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>Para ver cómo se organiza un dibujo, utilice el comando <code class="text-sky-400 font-mono">CAPA</code> (o el alias <code class="text-sky-400 font-mono">CA</code>) o bien hacer clic en la herramienta correspondiente de la cinta de opciones.</p>
            
            <div class="flex flex-wrap md:flex-nowrap gap-6 items-start">
                <div class="w-full md:w-1/3 space-y-4">
                    <img src="/courses/autocad/capas/img_5.jpeg" alt="Botón Propiedades de capa" class="rounded-xl border border-slate-700 shadow-md w-full">
                    
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mt-4">
                        <h4 class="font-bold text-white mb-2 text-sm">Estados y Parámetros:</h4>
                        <ul class="space-y-4 text-xs text-slate-400">
                            <li class="flex items-center gap-3">
                                <img src="/courses/autocad/capas/img_7.jpeg" class="h-6 w-auto bg-slate-200 rounded px-1">
                                <span><strong>Activar/Desactivar:</strong> Reduce la complejidad visual temporalmente.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <img src="/courses/autocad/capas/img_8.jpeg" class="h-6 w-auto bg-slate-200 rounded px-1">
                                <span><strong>Inutilizar:</strong> Oculta capas que no usará en un tiempo; mejora el rendimiento.</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <img src="/courses/autocad/capas/img_9.jpeg" class="h-6 w-auto bg-slate-200 rounded px-1">
                                <span><strong>Bloquear:</strong> Impide cambios accidentales y difumina los objetos.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="w-full md:w-2/3">
                    <img src="/courses/autocad/capas/img_6.jpeg" alt="Administrador de Capas" class="rounded-xl border border-slate-700 shadow-md w-full">
                    <div class="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg text-xs text-blue-200">
                        <strong>Nomenclatura:</strong> Observe que cada nombre de capa comienza por un número de dos dígitos. Esta convención simplifica el control del orden porque se basa en números y no en el alfabeto.
                    </div>
                </div>
            </div>

            <hr class="border-slate-700 my-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">Crear y Definir Capas</h3>
                    <p class="mb-4">Para crear una nueva capa, o para definir una existente como la capa de trabajo activa, utilice los botones superiores del Administrador de propiedades de capas.</p>
                </div>
                <div class="flex gap-4">
                    <img src="/courses/autocad/capas/img_10.jpeg" alt="Crear capa" class="rounded-xl border border-slate-700 shadow-md object-contain h-16 w-1/2 bg-slate-700 p-1">
                    <img src="/courses/autocad/capas/img_11.jpeg" alt="Definir actual" class="rounded-xl border border-slate-700 shadow-md object-contain h-16 w-1/2 bg-slate-700 p-1">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: ACCESO RÁPIDO Y RECOMENDACIONES -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Acceso Rápido y Recomendaciones
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 class="text-xl font-bold text-white mb-3">Acceso rápido desde la Cinta</h3>
                    <p>El Administrador ocupa espacio y no siempre es necesario. Para cambiar de capa de forma rápida, utilice la lista desplegable en la ficha Inicio de la cinta de opciones.</p>
                    <p class="mt-2 text-xs text-slate-400">Si selecciona un objeto en su dibujo, esta lista cambiará para mostrarle en qué capa se encuentra dicho objeto.</p>
                </div>
                <div class="flex flex-col gap-4">
                    <img src="/courses/autocad/capas/img_12.jpeg" alt="Desplegable Capas Cerrado" class="rounded-xl border border-slate-700 shadow-md">
                    <img src="/courses/autocad/capas/img_13.jpeg" alt="Desplegable Capas Abierto" class="rounded-xl border border-slate-700 shadow-md">
                </div>
            </div>
            
            <hr class="border-slate-700">

            <div>
                <h3 class="text-xl font-bold text-white mb-4">Recomendaciones Prácticas de la Industria</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <h4 class="font-bold text-sky-400 mb-1">Capa 0 y Defpoints</h4>
                        <p class="text-slate-400 text-xs">Evite usar la Capa 0 para trazar. Del mismo modo, no borre la capa <code>Defpoints</code> (se crea automáticamente al acotar y nunca se imprime).</p>
                    </div>
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <h4 class="font-bold text-sky-400 mb-1">Capas de Sombreado</h4>
                        <p class="text-slate-400 text-xs">Cree una capa específica para todos los sombreados (Hatch) y rellenos. De esta forma, puede ocultarlos todos de golpe para aligerar la vista.</p>
                    </div>
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <h4 class="font-bold text-sky-400 mb-1">Líneas Auxiliares</h4>
                        <p class="text-slate-400 text-xs">Mantenga una capa oculta o no imprimible para líneas de construcción, notas de diseño o geometría de referencia.</p>
                    </div>
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <h4 class="font-bold text-sky-400 mb-1">Normas de Empresa</h4>
                        <p class="text-slate-400 text-xs">Establezca y cumpla una norma de nomenclatura estandarizada (ej. <code>01-MUROS</code>, <code>02-PUERTAS</code>) y guárdelas en su archivo plantilla (<code>.dwt</code>).</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Capas...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_capas_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Organización con Capas (Layers)',
    description: 'Aprende a estructurar tus dibujos de AutoCAD asignando objetos a capas y controlando su visibilidad, bloqueo e inutilización.',
    content: styledHtmlContent,
    order: 0.75, // Se colocará entre "Precisión" (0.5) y el resto del curso.
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Capas publicada con éxito (Orden 0.75).');
  
  console.log('🎉 Terminado!');
}

run().catch(console.error);
