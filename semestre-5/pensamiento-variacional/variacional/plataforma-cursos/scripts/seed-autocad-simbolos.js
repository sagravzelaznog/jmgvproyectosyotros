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
                        Símbolos y Bloques
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Inserta símbolos, detalles y mobiliario de forma inteligente. Aprende qué son los bloques, cómo crear bibliotecas de componentes y las ventajas de trabajar con referencias vinculadas.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/simbolos/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN Y DEFINICIONES -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                ¿Qué es un Bloque?
            </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>En AutoCAD, los símbolos y los detalles que se insertan repetidamente en los dibujos se denominan <strong>bloques</strong>. Un bloque es una colección de geometría combinada en un único objeto guardado.</p>
                
                <h4 class="font-bold text-white">Elementos clave de un bloque:</h4>
                <ul class="list-disc list-inside space-y-2">
                    <li><strong class="text-sky-400">Definición de bloque:</strong> La información "maestra" almacenada en el archivo.</li>
                    <li><strong class="text-sky-400">Referencia a bloque:</strong> Cada una de las "copias" o instancias insertadas en el dibujo que apuntan a la definición.</li>
                    <li><strong class="text-sky-400">Punto base de inserción:</strong> El punto de agarre (pinzamiento) por el cual moverás y rotarás el bloque.</li>
                </ul>

                <div class="bg-blue-900/30 p-4 rounded-xl border border-blue-800 text-blue-200 mt-4 text-xs">
                    <p><strong>Nota:</strong> En el lenguaje común, la palabra "bloque" se usa libremente para referirse tanto a la definición como a la referencia.</p>
                </div>
            </div>
            
            <div class="flex flex-col gap-4">
                <img src="/courses/autocad/simbolos/img_2.jpeg" alt="Ejemplos de símbolos" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain">
                <img src="/courses/autocad/simbolos/img_3.jpeg" alt="Punto de inserción" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: VENTAJAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5">
                <img src="/courses/autocad/simbolos/img_4.jpeg" alt="Cubículos" class="rounded-xl border border-slate-700 shadow-md w-full bg-white p-2">
            </div>
            <div class="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed">
                <h3 class="text-xl font-bold text-white mb-3">¿Por qué usar Bloques en lugar de copiar líneas?</h3>
                <p>Si tienes un plano con 12 sillas de oficina, ¿por qué es mejor usar 12 referencias a bloque en lugar de copiar la geometría 12 veces?</p>
                
                <ul class="space-y-3 mt-4">
                    <li class="flex gap-3">
                        <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        <span><strong>Edición centralizada:</strong> Si actualizas la definición de la silla, <em>todas</em> las sillas del plano se actualizan al instante.</span>
                    </li>
                    <li class="flex gap-3">
                        <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        <span><strong>Tamaño de archivo:</strong> Almacenar 1 definición y 12 coordenadas ocupa dramáticamente menos memoria que almacenar las líneas y arcos de 12 sillas independientes.</span>
                    </li>
                    <li class="flex gap-3">
                        <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        <span><strong>Atributos:</strong> Pueden contener metadatos ocultos (proveedor, costo, modelo) extraíbles en tablas de Excel (cuantificación).</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: INSERCIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Paleta de Bloques y DesignCenter
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">Paleta de Bloques</h3>
                    <p>Inicie el comando <code class="text-sky-400 font-mono">PALETABLOQUES</code> desde la ficha Inicio > Insertar. Le permite arrastrar y soltar bloques desde su dibujo actual, desde bibliotecas externas o desde los utilizados recientemente.</p>
                    <img src="/courses/autocad/simbolos/img_8.jpeg" alt="Ribbon Insert" class="rounded-lg shadow-md max-w-[200px]">
                    <img src="/courses/autocad/simbolos/img_12.jpeg" alt="Paleta de bloques" class="rounded-lg shadow-md bg-white p-2">
                </div>
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">DesignCenter</h3>
                    <p>AutoCAD incluye una carpeta llena de dibujos de ejemplo organizados por disciplinas (HVAC, Arquitectura, Electrónica). Puede acceder a ella para extraer definiciones de bloque pre-hechas de alta calidad.</p>
                    <img src="/courses/autocad/simbolos/img_10.jpeg" alt="DesignCenter" class="rounded-lg shadow-md bg-white p-2 w-full">
                    <img src="/courses/autocad/simbolos/img_13.jpeg" alt="Paleta Design Center" class="rounded-lg shadow-md bg-white p-2 max-w-[250px]">
                </div>
            </div>

            <hr class="border-slate-700">

            <div>
                <h3 class="text-xl font-bold text-white mb-3">Opciones de Inserción</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <p>Antes de arrastrar un bloque al espacio de trabajo, puede ajustar parámetros desde la parte inferior de la paleta. Permite predefinir la <strong>escala</strong>, el <strong>ángulo de rotación</strong> o solicitar especificar el punto de inserción en pantalla.</p>
                    <img src="/courses/autocad/simbolos/img_15.jpeg" alt="Opciones Insercion" class="rounded-lg shadow-md bg-white p-2">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 4: ORGANIZACIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Creación y Administración
            </h2>
        </div>

        <div class="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p><strong>Cualquier archivo <code>.dwg</code> es técnicamente un bloque.</strong> Si arrastras el archivo <code>Silla.dwg</code> dentro de <code>Planta.dwg</code>, la silla se insertará como una referencia a bloque.</p>
            
            <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 mb-6">
                <h4 class="font-bold text-amber-400 mb-2">Consejo para crear tus propios bloques:</h4>
                <p class="text-amber-200/80">Al dibujar una geometría que planeas guardar como bloque externo, <strong>asegúrate de colocarla en el origen (0,0)</strong> de ese archivo. Ese origen (0,0) se convertirá en el punto base de agarre cuando lo insertes en otros proyectos.</p>
                <img src="/courses/autocad/simbolos/img_17.jpeg" alt="Origen 0,0" class="mt-4 rounded-lg shadow-md bg-white p-2 max-w-[150px]">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <h4 class="font-bold text-sky-400 mb-1">Comando LIMPIA (Purge)</h4>
                    <p class="text-xs text-slate-400">Si insertas un bloque y luego lo borras, su definición sigue existiendo en el archivo ocultamente. Utiliza <code>LIMPIA</code> para reducir el peso del archivo eliminando las definiciones que no se están usando.</p>
                </div>
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <h4 class="font-bold text-sky-400 mb-1">Comando DESCOMP (Explode)</h4>
                    <p class="text-xs text-slate-400">Si necesitas modificar un bloque específico sin alterar los demás, puedes "explotarlo" con <code>DESCOMP</code> para devolverlo a sus líneas y arcos originales.</p>
                </div>
                <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <h4 class="font-bold text-sky-400 mb-1">Bibliotecas Dedicadas</h4>
                    <p class="text-xs text-slate-400">Crea carpetas específicas en tu computadora (ej. <code>01-Mobiliario</code>, <code>02-Vegetacion</code>) y guárdalas en tus ubicaciones de Windows/Mac para arrastrar bloques fácilmente.</p>
                    <img src="/courses/autocad/simbolos/img_18.jpeg" alt="Carpetas" class="mt-3 rounded-lg shadow-md max-w-full">
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Símbolos...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_simbolos_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Símbolos y Bloques (Blocks)',
    description: 'Comprende el poder de los Bloques, la Paleta de Bloques y DesignCenter para evitar redibujar componentes repetitivos.',
    content: styledHtmlContent,
    order: 0.95,
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Símbolos publicada con éxito (Orden 0.95).');
}

run().catch(console.error);
