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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Propiedades de los Objetos
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Descubre cómo asignar y modificar propiedades individuales como color, grosor y tipo de línea, y cómo igualar las propiedades entre diferentes elementos.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/propiedades/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Puede asignar propiedades (color, tipo de línea, grosor) a objetos individuales o asignar propiedades por defecto a las capas.</p>
                <p>En el ejemplo visual, diferentes elementos del plano como muros, superficie exterior, instalaciones y mobiliario se han creado mediante distintos colores para diferenciar unos elementos de otros rápidamente.</p>
                <div class="bg-blue-900/30 p-4 rounded-xl border border-blue-800 text-blue-200 mt-4">
                    <p class="text-xs"><strong>Norma General:</strong> La mejor práctica es dejar las propiedades de los objetos en "PorCapa" (ByLayer). De esta forma, si cambias el color de la capa, todos los objetos de esa capa cambiarán automáticamente.</p>
                </div>
            </div>
            <div class="flex justify-center">
                <img src="/courses/autocad/propiedades/img_2.jpeg" alt="Plano con colores" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 1: PALETA DE PROPIEDADES -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                La Paleta Propiedades
            </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>La paleta Propiedades es una herramienta fundamental. Para abrirla:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Utilice el comando <code class="text-sky-400 font-mono">PROPIEDADES</code> (o <code class="text-sky-400 font-mono">PR</code>).</li>
                    <li>Pulse <kbd class="px-2 py-1 bg-slate-900 border border-slate-600 rounded">Ctrl+1</kbd>.</li>
                    <li>Haga clic en la pequeña flecha del grupo Propiedades de la cinta de opciones.</li>
                </ul>
                <img src="/courses/autocad/propiedades/img_3.jpeg" alt="Abrir Paleta" class="rounded-lg shadow-md max-w-full">
            </div>
            <div class="flex flex-col space-y-4">
                <div class="flex items-center gap-4">
                    <img src="/courses/autocad/propiedades/img_4.jpeg" alt="Propiedades" class="rounded-lg border border-slate-700 shadow-md h-32 object-contain bg-slate-200">
                    <p class="text-xs text-slate-400">Si no hay ningún objeto seleccionado, el color actual o cualquier otro parámetro que modifique se aplicará a todos los objetos creados <em>posteriormente</em>.</p>
                </div>
            </div>
        </div>

        <hr class="border-slate-700 my-8">

        <h3 class="text-xl font-bold text-white mb-4">Comprobar y Cambiar un Objeto Existente</h3>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 flex justify-center">
                <img src="/courses/autocad/propiedades/img_6.jpeg" alt="Línea seleccionada" class="rounded-xl border border-slate-700 shadow-md bg-white p-2">
            </div>
            <div class="lg:col-span-7 space-y-4 text-slate-300 text-sm">
                <p>Si hace clic en un objeto para seleccionarlo, la paleta se actualizará para mostrar todas sus propiedades actuales.</p>
                <img src="/courses/autocad/propiedades/img_7.jpeg" alt="Paleta actualizada" class="rounded-lg border border-slate-700 shadow-md">
                <p class="text-xs text-slate-400">Puede cambiar cualquiera de estas propiedades haciendo clic y modificando la configuración. Si se seleccionan varios objetos, solo se mostrarán las propiedades comunes. Para quitar la selección, pulse <kbd>Esc</kbd>.</p>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: ACCESO RÁPIDO E IGUALAR -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Acceso Rápido e Igualar Propiedades
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4 text-slate-300 text-sm">
                <h3 class="text-lg font-bold text-white">Grupo Propiedades</h3>
                <p>La paleta Propiedades ocupa mucho espacio. Para acceder rápidamente, utilice el grupo Propiedades en la ficha Inicio de la cinta de opciones.</p>
                <img src="/courses/autocad/propiedades/img_8.jpeg" alt="Acceso Rápido Ribbon" class="rounded-lg shadow-md max-w-full">
            </div>

            <div class="space-y-4 text-slate-300 text-sm">
                <h3 class="text-lg font-bold text-white">Igualar Propiedades (MA)</h3>
                <p>Para copiar rápidamente las propiedades de un objeto a otro, utilice la herramienta <strong>Igualar propiedades</strong> o escriba <code class="text-sky-400 font-mono">MA</code> (Match Properties).</p>
                <img src="/courses/autocad/propiedades/img_9.jpeg" alt="Igualar propiedades" class="rounded-lg shadow-md">
                <p class="text-xs text-slate-400 mt-2">Haga clic en la herramienta, seleccione el objeto de origen (del que quiere copiar) y luego todos los objetos de destino.</p>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: LÍNEAS Y GROSOR -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Tipos y Grosor de Línea
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div>
                <h3 class="text-xl font-bold text-white mb-3">Tipos de Línea</h3>
                <p class="mb-4">Trazos y líneas discontinuas se asignan aquí. Primero debe <strong>Cargar</strong> un tipo de línea antes de asignarlo.</p>
                <div class="flex flex-wrap items-start gap-4">
                    <img src="/courses/autocad/propiedades/img_10.jpeg" alt="Tipos de linea desplegable" class="rounded-lg shadow-md h-32 object-contain">
                    <img src="/courses/autocad/propiedades/img_11.jpeg" alt="Administrador tipos linea" class="rounded-lg shadow-md bg-white p-2 object-contain max-w-full lg:max-w-md">
                </div>
            </div>

            <hr class="border-slate-700">

            <div>
                <h3 class="text-xl font-bold text-white mb-3">Grosor de Línea</h3>
                <p class="mb-4">Muestra grosores distintos para objetos seleccionados. Puede dejar el grosor en <code class="text-sky-400 font-mono">PorCapa</code> o reemplazarlo explícitamente.</p>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <img src="/courses/autocad/propiedades/img_12.jpeg" alt="Grosor de linea" class="rounded-lg shadow-md object-contain">
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <h4 class="font-bold text-sky-400 mb-2">Consejo Práctico</h4>
                        <p class="text-xs text-slate-400">Por lo general, es recomendable dejar la visualización de los grosores de línea desactivada en pantalla mientras se trabaja, ya que líneas gruesas pueden enmascarar detalles y entorpecer el uso de Referencias a Objetos (OSNAP). Actívelos solo para comprobar antes de imprimir.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Propiedades...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_propiedades_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Propiedades de los Objetos',
    description: 'Comprende el uso de colores, grosores y tipos de línea a través de la Paleta de Propiedades.',
    content: styledHtmlContent,
    order: 0.8,
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Propiedades publicada con éxito (Orden 0.8).');
}

run().catch(console.error);
