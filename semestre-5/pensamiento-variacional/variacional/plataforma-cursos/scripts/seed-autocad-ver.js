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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Ver y Navegar por tus Dibujos
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Aprende a encuadrar distintas vistas de un dibujo y aplicarles zoom. Además, descubre cómo visualizar y editar tus dibujos desde ubicaciones remotas y la nube.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/ver/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- SECCIÓN 1: ENCUADRE Y ZOOM -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                Encuadre y Zoom con el Ratón
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>La forma más fácil de cambiar las vistas guardadas es mediante la <strong>rueda del ratón</strong>.</p>
                <ul class="list-disc list-inside space-y-2 text-slate-300">
                    <li><strong class="text-white">Encuadre:</strong> Mantenga pulsada la rueda del ratón y arrastre para encuadrar una vista en cualquier dirección.</li>
                    <li><strong class="text-white">Zoom:</strong> Gire la rueda del ratón hacia adelante para acercarse (ampliar) y hacia atrás para alejarse (reducir).</li>
                </ul>
                
                <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 mt-4">
                    <h4 class="font-bold text-amber-400 text-sm mb-1">Consejo: Posición del cursor</h4>
                    <p class="text-amber-200/80 text-xs leading-relaxed">Al ampliar o reducir el zoom, la ubicación del cursor es crucial. Puede considerar el cursor como una <em>lupa</em>. Al colocar el cursor sobre un área específica y girar la rueda, se amplía esa zona sin perder la perspectiva.</p>
                </div>
            </div>
            
            <div class="flex justify-center">
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700 w-full text-center shadow-inner">
                    <img src="/courses/autocad/ver/img_2.jpeg" alt="Zoom con el cursor" class="mx-auto rounded-lg bg-slate-200 p-2 object-contain w-full max-h-64 shadow-md">
                    <p class="text-xs text-slate-400 mt-3 font-mono">El cursor actúa como punto focal para el Zoom.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: COMANDO ZOOM -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                El Comando ZOOM
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 flex flex-col items-center space-y-4">
                <img src="/courses/autocad/ver/img_3.jpeg" alt="Comando Zoom" class="rounded-xl border border-slate-700 shadow-md w-full object-cover">
                <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700 w-full text-center">
                    <code class="text-sky-400 font-mono text-sm">ZOOM &gt; Previo</code>
                </div>
            </div>
            <div class="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Puede retroceder a varias vistas anteriores si escribe <code class="text-sky-400 font-mono">ZOOM</code> en la ventana de comandos y, a continuación, especifica la opción <strong>Previo</strong>.</p>
                
                <h4 class="font-bold text-white mt-4">Alias de Comando</h4>
                <p>Una forma rápida de realizar esta acción es introducir un <em>alias de comando</em>. Para el comando ZOOM, el alias es simplemente <strong>Z</strong>.</p>
                
                <ol class="list-decimal list-inside space-y-2 pl-2">
                    <li>Escriba <code class="text-sky-400 font-mono">Z</code> en la ventana de comandos y pulse la barra espaciadora o Intro.</li>
                    <li>A continuación, escriba <code class="text-sky-400 font-mono">P</code> (Previo) y pulse Intro.</li>
                </ol>
                
                <div class="mt-6 space-y-3">
                    <p class="font-bold text-slate-200 border-l-2 border-sky-500 pl-3">Opciones comunes adicionales:</p>
                    <ul class="list-disc list-inside space-y-1 text-slate-400 text-xs pl-3">
                        <li><strong class="text-slate-200">Ventana:</strong> Permite especificar una ventana rectangular en la pantalla y el programa hace zoom sobre esa área.</li>
                        <li><strong class="text-slate-200">Extensión:</strong> Muestra y ajusta la pantalla a todos los objetos dibujados dentro del área de trabajo.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: UBICACIONES REMOTAS Y NUBE -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Ubicaciones Remotas y Almacenamiento en la Nube
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div>
                <h3 class="text-xl font-bold text-white mb-3">Visualizar dibujos desde ubicaciones remotas</h3>
                <p class="mb-4">Puede resultar útil acceder a los archivos de dibujo mientras se encuentra en un emplazamiento diferente, mediante la aplicación web o móvil. Su suscripción incluye el acceso en los siguientes dispositivos:</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <div class="text-sky-400 mb-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <h4 class="font-bold text-slate-200 text-xs">Escritorio Principal</h4>
                        <p class="text-slate-400 text-xs mt-1">Equipo con la app instalada.</p>
                    </div>
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <div class="text-sky-400 mb-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                        </div>
                        <h4 class="font-bold text-slate-200 text-xs">Versión Web</h4>
                        <p class="text-slate-400 text-xs mt-1">Acceso en web.autocad.com</p>
                    </div>
                    <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <div class="text-sky-400 mb-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        </div>
                        <h4 class="font-bold text-slate-200 text-xs">Dispositivos Móviles</h4>
                        <p class="text-slate-400 text-xs mt-1">App móvil de AutoCAD.</p>
                    </div>
                </div>
                
                <p>Para hacer esto posible, utilice los botones <strong>Guardar en la versión web y dispositivos móviles</strong> de la barra de herramientas rápidas.</p>
                <div class="mt-4 flex justify-center">
                    <img src="/courses/autocad/ver/img_4.jpeg" alt="Opciones en Nube" class="rounded-lg shadow-md max-w-full">
                </div>
            </div>

            <hr class="border-slate-700">

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 class="text-xl font-bold text-white mb-3">Acceder a través de la Nube</h3>
                    <p class="mb-4">Si dispone de una cuenta con un proveedor de almacenamiento en la nube, puede añadirla a la barra de ubicaciones de los cuadros de diálogo de selección de archivos en AutoCAD.</p>
                    <p class="text-xs text-slate-400">Los accesos directos de navegación como Microsoft OneDrive, Box, Dropbox y Google Drive se muestran automáticamente en la barra de ubicaciones si dispone de una cuenta instalada y configurada en su equipo.</p>
                </div>
                <div class="flex justify-center">
                    <img src="/courses/autocad/ver/img_6.jpeg" alt="Proveedores de Nube" class="rounded-xl border border-slate-700 shadow-md max-w-full">
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Ver...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_ver_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Visualización y Navegación (Zoom / Encuadre)',
    description: 'Aprende a encuadrar distintas vistas de un dibujo, aplicarles zoom y a ver o editar dibujos desde ubicaciones remotas.',
    content: styledHtmlContent,
    order: -0.5, // Se colocará entre "Conceptos Básicos" (-1) y "Geometría" (0)
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Visualización publicada con éxito (Orden -0.5).');
  
  console.log('🎉 Terminado!');
}

run().catch(console.error);
