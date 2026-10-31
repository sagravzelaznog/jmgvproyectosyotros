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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Imprimir y Exportar a PDF
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Concluye el flujo de trabajo en AutoCAD aprendiendo a generar salidas impresas (trazados), crear archivos PDF monocromáticos y configurar estilos de impresión (plumillas).
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/imprimir/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- SECCIÓN 1: EL COMANDO TRAZAR -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                El Comando TRAZAR (Plot)
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>En AutoCAD, "imprimir" texto en impresoras o "trazar" dibujos en plóteres se unifica bajo el comando <code class="text-sky-400 font-mono">TRAZAR</code>. Puede acceder a él desde la barra de herramientas de acceso rápido en la esquina superior izquierda.</p>
                <img src="/courses/autocad/imprimir/img_2.jpeg" alt="Trazar Icono" class="rounded-lg shadow-md bg-white p-1 max-w-[200px]">
                
                <h3 class="text-lg font-bold text-white mt-6">Cuadro de diálogo expandido</h3>
                <p>Al abrir el comando por primera vez, es probable que no vea todas las opciones avanzadas (como los estilos de plumilla). Para expandir la ventana, haga clic en el botón con la flecha ubicado en la esquina inferior derecha.</p>
                <img src="/courses/autocad/imprimir/img_3.jpeg" alt="Botón Más Opciones" class="rounded-lg shadow-md max-w-full">
            </div>
            <div class="lg:col-span-5">
                <img src="/courses/autocad/imprimir/img_4.jpeg" alt="Dialogo Trazar" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: SALIDA A PDF Y MONOCROMÁTICO -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Crear Archivos PDF y Estilos (CTB)
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h3 class="text-lg font-bold text-sky-400 mb-3">Paso 1: Seleccionar el Trazador PDF</h3>
                    <p class="mb-4">Para generar un documento PDF de alta calidad, despliegue la lista de impresoras y seleccione <code>AutoCAD PDF (General Documentation).pc3</code>.</p>
                    <img src="/courses/autocad/imprimir/img_8.jpeg" alt="Lista Impresoras PDF" class="rounded-lg shadow-md bg-white p-2 max-w-full">
                    <p class="text-xs text-slate-400 mt-2">A continuación, seleccione el tamaño de papel (ej. ISO A3, ANSI A) y el área de trazado (Presentación, Pantalla o Ventana manual).</p>
                </div>
                
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h3 class="text-lg font-bold text-sky-400 mb-3">Paso 2: Estilos de Trazado (Plumillas)</h3>
                    <p class="mb-4">Los colores del monitor suelen ser brillantes (rojo, cian, amarillo), pero en impresión profesional se requiere tinta negra y escala de grises. Despliegue la "Tabla de estilos de trazado" y elija <code>monochrome.ctb</code>.</p>
                    <img src="/courses/autocad/imprimir/img_9.jpeg" alt="Estilo Monochrome" class="rounded-lg shadow-md bg-white p-2 max-w-full">
                    <p class="text-xs text-slate-400 mt-2">Al seleccionar <code>monochrome.ctb</code>, todas las líneas de colores se imprimirán en color negro sólido, respetando únicamente los grosores de línea.</p>
                </div>
            </div>

            <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 flex items-center gap-4">
                <div class="shrink-0 flex flex-col gap-2">
                    <img src="/courses/autocad/imprimir/img_10.jpeg" alt="Vista preliminar" class="rounded bg-white p-1 max-w-[120px]">
                </div>
                <div>
                    <h4 class="font-bold text-amber-400 mb-1">Regla de Oro: Vista Preliminar</h4>
                    <p class="text-amber-200/80">Revise <strong>siempre</strong> los parámetros con el botón <em>Vista preliminar</em> antes de trazar para evitar desperdicio de papel y errores en el PDF final. Una vez en la vista previa, puede hacer clic derecho o usar la barra de herramientas para "Trazar" o "Cerrar".</p>
                    <img src="/courses/autocad/imprimir/img_11.jpeg" alt="Toolbar preliminar" class="rounded bg-white p-1 max-w-[150px] mt-2">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: CONFIGURACIONES GUARDADAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Guardar Configuraciones de Página
            </h2>
        </div>

        <div class="space-y-4 text-slate-300 text-sm">
            <p>Configurar impresora, papel, escala y estilo cada vez que se va a imprimir es muy tedioso. El comando <code class="text-sky-400 font-mono">PREPPAGINA</code> abre el Administrador de configuraciones de página.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <img src="/courses/autocad/imprimir/img_5.jpeg" alt="Administrador Preppagina" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full">
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">Flujo de Trabajo Ideal</h3>
                    <ol class="list-decimal list-inside space-y-2 text-slate-400">
                        <li>Haga clic en <strong>Nuevo</strong>.</li>
                        <li>Nómbrela descriptivamente (ej. <code class="text-sky-300">PDF-A3-Monocromo</code>).</li>
                        <img src="/courses/autocad/imprimir/img_6.jpeg" alt="Nombrar Config" class="rounded bg-slate-200 p-1 my-2 max-w-[200px]">
                        <li>Configure todos los parámetros de trazado.</li>
                        <li>Al momento de imprimir, simplemente seleccione este nombre desde la lista desplegable superior.</li>
                        <img src="/courses/autocad/imprimir/img_7.jpeg" alt="Aplicar Config" class="rounded bg-slate-200 p-1 my-2 max-w-full">
                    </ol>
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Imprimir...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_imprimir_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Imprimir y Exportar a PDF',
    description: 'Aprende a configurar estilos de trazado (plumillas monocromáticas), opciones de impresora y archivos PDF listos para entrega.',
    content: styledHtmlContent,
    order: 0.999,
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Imprimir publicada con éxito (Orden 0.999).');
}

run().catch(console.error);
