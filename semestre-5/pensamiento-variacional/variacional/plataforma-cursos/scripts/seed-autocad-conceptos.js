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
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Conceptos Básicos de Interfaz
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Revise los controles básicos de AutoCAD y AutoCAD LT. Conoce las fichas de dibujo, la cinta de opciones, la ventana de comandos, el ratón y cómo iniciar tus dibujos con las plantillas correctas.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/conceptos_basicos/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN Y FICHAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                Iniciar AutoCAD y Fichas de Dibujo
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Tras iniciar AutoCAD, haga clic en <strong>Iniciar dibujo</strong> para iniciar un nuevo dibujo.</p>
                <img src="/courses/autocad/conceptos_basicos/img_2.jpeg" alt="Iniciar dibujo" class="rounded-xl border border-slate-700 shadow-md max-h-32 object-contain">
                
                <h4 class="font-bold text-white mt-6">Fichas de dibujos</h4>
                <p>El nuevo dibujo, <code class="text-sky-400">Dibujo1</code>, se inicia en una nueva ficha justo encima del área de dibujo. Puede hacer clic en las fichas para alternar entre varios archivos de dibujo abiertos y la ficha Inicio.</p>
                
                <img src="/courses/autocad/conceptos_basicos/img_3.jpeg" alt="Fichas de dibujos" class="rounded-xl border border-slate-700 shadow-md">
                
                <p class="text-xs text-slate-400 mt-2">Un asterisco (*) junto al nombre del dibujo indica que es necesario guardar el dibujo. Una forma rápida de cerrar un dibujo consiste en hacer clic en el control X de su ficha. Continúe y experimente con el inicio y la apertura de dibujos, y alterne entre las fichas. También puede arrastrar las fichas de dibujo para cambiar su orden.</p>
                
                <div class="bg-blue-900/30 p-3 rounded-lg border border-blue-800 text-blue-200 text-xs">
                    <strong>Nota:</strong> Si la ficha Inicio no es la actual, continúe y haga clic en ella.
                </div>
            </div>
            <div class="space-y-4">
                <h4 class="font-bold text-white">Cinta de Opciones</h4>
                <p class="text-slate-300 text-sm">AutoCAD incluye una cinta de opciones estándar con fichas en la parte superior de la aplicación. Puede acceder a casi todos los comandos desde esta cinta.</p>
                <img src="/courses/autocad/conceptos_basicos/img_4.jpeg" alt="Cinta de opciones" class="rounded-xl border border-slate-700 shadow-md w-full object-cover">
                <p class="text-slate-400 text-xs mt-2">Además, la barra de herramientas de acceso rápido incluye comandos habituales como Nuevo, Abrir, Guardar, Imprimir y Deshacer.</p>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: VENTANA DE COMANDOS Y RATÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Ventana de Comandos y Uso del Ratón
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <h3 class="text-xl font-bold text-white">La Ventana de Comandos</h3>
                <p>El núcleo del programa es la ventana de comandos, que suele estar anclada en la parte inferior de la ventana de la aplicación. Muestra solicitudes, opciones y mensajes.</p>
                
                <img src="/courses/autocad/conceptos_basicos/img_6.jpeg" alt="Ventana de comandos" class="rounded-xl border border-slate-700 shadow-md">
                
                <p>Puede introducir comandos directamente en lugar de utilizar la cinta de opciones. Muchos usuarios experimentados prefieren este método.</p>
                <p class="text-xs text-slate-400">Observe que cuando comienza a escribir, el comando se completa automáticamente. Puede seleccionar la opción haciendo clic o con las flechas de dirección.</p>
                
                <img src="/courses/autocad/conceptos_basicos/img_7.jpeg" alt="Autocompletar comandos" class="rounded-xl border border-slate-700 shadow-md h-40 object-contain">
            </div>
            
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <h3 class="text-xl font-bold text-white">El Ratón</h3>
                <p>La mayoría de usuarios utilizan un ratón como dispositivo señalador. Es vital para encuadre, zoom, designar objetos y precisar ubicaciones.</p>
                
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-center">
                    <img src="/courses/autocad/conceptos_basicos/img_8.jpeg" alt="Uso del ratón" class="mx-auto rounded-xl max-h-56 object-contain filter invert opacity-90">
                </div>
                
                <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
                    <h4 class="font-bold text-amber-400 text-sm mb-1">Consejo: Menú Contextual</h4>
                    <p class="text-amber-200/80 text-xs">Cuando busque una opción, pruebe a hacer <strong>clic con el botón derecho</strong>. En función de dónde coloque el cursor y si está al mando de una herramienta, aparecerá un menú con comandos y opciones pertinentes.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: DIBUJOS Y PLANTILLAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Nuevos Dibujos y Plantillas
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>Puede adaptarse fácilmente a las normas de la empresa especificando parámetros para el texto, los tipos de línea y otras muchas características en archivos de plantilla.</p>
            
            <div class="flex justify-center">
                <img src="/courses/autocad/conceptos_basicos/img_9.jpeg" alt="Cotas" class="rounded-xl border border-slate-700 shadow-md max-h-40 object-contain bg-slate-200 p-2">
            </div>
            
            <p>Todos estos parámetros se pueden guardar en una <em>plantilla de dibujo</em>. Haga clic en Nuevo para elegir entre varios archivos de plantilla de dibujo:</p>
            
            <img src="/courses/autocad/conceptos_basicos/img_10.jpeg" alt="Nuevo dibujo" class="rounded-xl border border-slate-700 shadow-md">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
                <div>
                    <ul class="space-y-3 list-disc list-inside text-slate-300">
                        <li>Para dibujos en <strong class="text-white">unidades imperiales</strong> (pulgadas), utilice la plantilla <code class="text-sky-400">acad.dwt</code> o <code class="text-sky-400">acadlt.dwt</code>.</li>
                        <li>Para dibujos en <strong class="text-white">unidades métricas</strong> (milímetros), utilice la plantilla <code class="text-sky-400">acadiso.dwt</code> o <code class="text-sky-400">acadltiso.dwt</code>.</li>
                    </ul>
                    <p class="mt-4 text-xs text-slate-400">Puede guardar cualquier dibujo (.dwg) como un archivo de plantilla (.dwt) para usarlo en el futuro y estandarizar sus proyectos.</p>
                </div>
                <div>
                    <img src="/courses/autocad/conceptos_basicos/img_11.jpeg" alt="Plantillas" class="rounded-xl border border-slate-700 shadow-md w-full object-cover">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 4: UNIDADES -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">4</span>
                Unidades y Escalas
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Tras iniciar un nuevo dibujo, debe decidir lo que representa la longitud de una unidad (pulgada, centímetro, kilómetro, milímetro). Por ejemplo, un dibujo con 125 unidades podría representar un gran edificio o un pequeño perno mecánico.</p>
                
                <h4 class="font-bold text-white">Parámetros de visualización</h4>
                <p>El comando <code class="text-sky-400 font-mono">UNIDADES</code> permite controlar cómo se visualizan las longitudes:</p>
                <ul class="list-disc list-inside space-y-2">
                    <li><strong>Formato:</strong> Para que 6.5 se muestre como 6-1/2.</li>
                    <li><strong>Precisión:</strong> Para mostrar 6.5 como 6.50 o 6.5000.</li>
                </ul>
                
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mt-4">
                    <h4 class="font-bold text-white mb-2">Escala de Modelo</h4>
                    <p class="text-slate-400 text-xs">Cree siempre los modelos a <strong>tamaño completo (escala 1:1)</strong>. El término <em>modelo</em> hace referencia a la geometría, mientras que el <em>dibujo</em> abarca las cotas y el cuadro de rotulación. La escala de impresión se especifica posteriormente, al crear la presentación (Layout).</p>
                </div>
            </div>
            <div class="lg:col-span-5 flex flex-col justify-center space-y-6">
                <img src="/courses/autocad/conceptos_basicos/img_14.jpeg" alt="Unidades 125" class="rounded-xl border border-slate-700 shadow-md bg-white p-2">
                <div class="bg-slate-700/30 p-5 rounded-xl border border-slate-600 shadow-inner">
                    <h4 class="font-bold text-sky-400 mb-3 text-lg">💡 Recomendaciones Rapidas</h4>
                    <ul class="space-y-3 text-xs text-slate-300">
                        <li class="flex gap-2"><span>•</span> <span>Para abrir la <strong>Ayuda</strong> sobre el comando activo, pulse <kbd class="px-1 py-0.5 bg-slate-800 border border-slate-500 rounded">F1</kbd>.</span></li>
                        <li class="flex gap-2"><span>•</span> <span>Para <strong>repetir</strong> el comando anterior, pulse Intro o Espacio.</span></li>
                        <li class="flex gap-2"><span>•</span> <span>Para <strong>cancelar</strong> un comando en curso o quitar selecciones, pulse repetidamente <kbd class="px-1 py-0.5 bg-slate-800 border border-slate-500 rounded text-red-400">Esc</kbd>.</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Conceptos Básicos...');

  const moduleId = 'mod_autocad_pre';
  
  // Crear la lección
  const lessonId = 'lesson_conceptos_pre';
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Conceptos Básicos de Interfaz',
    description: 'Aprende los conceptos básicos y la interfaz inicial de AutoCAD.',
    content: styledHtmlContent,
    order: -1, // Para que aparezca antes que Geometría (order 0)
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de conceptos básicos publicada con éxito (Orden -1).');
  
  console.log('🎉 Terminado!');
}

run().catch(console.error);
