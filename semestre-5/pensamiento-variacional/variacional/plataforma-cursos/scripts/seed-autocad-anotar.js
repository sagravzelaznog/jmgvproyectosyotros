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
                        Anotar: Textos y Directrices
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Comunica detalles constructivos creando notas, etiquetas, referencias numéricas y llamadas utilizando herramientas de texto y estilos personalizables.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/anotar/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- SECCIÓN 1: TEXTO DE LÍNEAS MÚLTIPLES -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                Textos y Párrafos (TEXTOM)
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Para crear notas generales, utilice el comando <code class="text-sky-400 font-mono">TEXTOM</code> (o escriba <code class="text-sky-400 font-mono">MT</code>), disponible en el grupo Anotación de la ficha Inicio.</p>
                <img src="/courses/autocad/anotar/img_2.jpeg" alt="Grupo Anotacion" class="rounded-xl border border-slate-700 shadow-md">
                
                <h3 class="text-lg font-bold text-white mt-4">Editor In Situ</h3>
                <p>Al iniciar el comando, se le pedirá que dibuje un "cuadro de texto" haciendo clic en dos esquinas. A continuación, se abre un editor interactivo en la pantalla con una regla en la parte superior.</p>
                <div class="bg-blue-900/30 p-4 rounded-xl border border-blue-800 text-blue-200 mt-2 text-xs">
                    <p><strong>Truco:</strong> El tamaño inicial del cuadro no importa mucho, ya que puede usar la regla superior para ajustar la longitud de la nota libremente mientras escribe.</p>
                </div>
            </div>
            
            <div class="flex flex-col gap-4">
                <img src="/courses/autocad/anotar/img_3.jpeg" alt="Crear cuadro de texto" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain">
                <img src="/courses/autocad/anotar/img_4.jpeg" alt="Regla de texto" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: ESTILOS DE TEXTO -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Estilos de Texto
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>Al igual que otros elementos, el texto depende de una serie de parámetros guardados denominados <strong>estilos de texto</strong> (<code class="text-sky-400 font-mono">ESTILO</code>).</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">Aplicar un estilo existente</h3>
                    <p>Puede cambiar el estilo a varias notas usando la Paleta de Propiedades, o bien definiendo el estilo activo en el grupo Anotación antes de escribir.</p>
                    <img src="/courses/autocad/anotar/img_5.jpeg" alt="Cambiar Estilo Paleta" class="rounded-lg shadow-md max-w-full">
                    <div class="flex gap-4 items-center">
                        <img src="/courses/autocad/anotar/img_6.jpeg" alt="Ribbon Anotacion Dropdown" class="rounded-lg shadow-md max-w-[150px]">
                        <img src="/courses/autocad/anotar/img_7.jpeg" alt="Elegir Standard" class="rounded-lg shadow-md max-w-[150px]">
                    </div>
                </div>
                
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">Crear uno Nuevo</h3>
                    <p>El Administrador de Estilos le permite definir fuentes (ej. Arial), altura y otros efectos. Es muy recomendable guardar estos estilos en la <em>plantilla</em> base.</p>
                    <img src="/courses/autocad/anotar/img_8.jpeg" alt="Dialogo Estilo de Texto" class="rounded-lg shadow-md w-full bg-slate-200">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: DIRECTRICES MÚLTIPLES -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Directrices Múltiples (Llamadas)
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <p>Los objetos de directriz múltiple (comando <code class="text-sky-400 font-mono">DIRECTRIZM</code> o <code class="text-sky-400 font-mono">MLD</code>) se utilizan para crear líneas guía hacia texto o bloques (etiquetas, números de detalle).</p>
            
            <div class="flex justify-center mb-6">
                <img src="/courses/autocad/anotar/img_9.jpeg" alt="Ejemplos de Directrices" class="rounded-xl border border-slate-700 shadow-md bg-white p-4 max-w-full">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-lg font-bold text-white mb-2">Partes y Edición por Pinzamientos</h3>
                        <p>Toda directriz tiene un extremo (cabeza de flecha), un segmento de conexión (aterrizaje) y un contenido (texto o bloque). Si hace clic en ella, verá pinzamientos azules especiales que le permiten añadir vértices o líneas de flecha adicionales a la misma nota.</p>
                    </div>
                    <div class="flex gap-4 justify-center">
                        <img src="/courses/autocad/anotar/img_10.jpeg" alt="Partes de directriz" class="rounded-lg shadow-md bg-white p-2">
                        <img src="/courses/autocad/anotar/img_11.jpeg" alt="Pinzamientos añadir" class="rounded-lg shadow-md bg-white p-2">
                    </div>
                </div>

                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">Estilos de Directriz</h3>
                    <p>Al igual que el texto, las directrices tienen su propio administrador (<code class="text-sky-400 font-mono">ESTILDIRECTRIZM</code>). Aquí es donde puedes indicar si quieres que la flecha apunte a un texto simple o a un "Bloque" (como un círculo de llamada de detalle).</p>
                    <div class="flex gap-4">
                        <img src="/courses/autocad/anotar/img_12.jpeg" alt="Dropdown Estilo Directriz" class="rounded-lg shadow-md max-h-32 object-contain">
                        <img src="/courses/autocad/anotar/img_13.jpeg" alt="Dialogo Bloque Detalle" class="rounded-lg shadow-md bg-white p-1 w-full max-w-[250px]">
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Anotar...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_anotar_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Anotar: Textos y Directrices',
    description: 'Genera notas, etiquetas y llamadas con flechas configurando tus propios estilos de texto y directriz.',
    content: styledHtmlContent,
    order: 0.995,
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Anotar publicada con éxito (Orden 0.995).');
}

run().catch(console.error);
