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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                        Módulo 0: Preliminares
                    </div>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Cotas y Dimensionamiento
                    </h1>
                    <p class="text-base sm:text-lg text-slate-300 max-w-2xl">
                        Aprende a medir y documentar la geometría de tu modelo con precisión usando los diferentes tipos de cotas y estilos predefinidos.
                    </p>
                </div>
                <div class="lg:col-span-4 flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                        <img src="/courses/autocad/cotas/img_1.jpeg" alt="AutoCAD Logo" class="relative rounded-2xl shadow-2xl bg-white p-2 object-contain w-32 h-32">
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- INTRODUCCIÓN A LAS COTAS -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>Las cotas (dimensions) son elementos dinámicos que muestran las medidas reales de la geometría en AutoCAD.</p>
                <p>Existen varios tipos de cota: lineales (horizontales y verticales), alineadas (diagonales), radiales y angulares. AutoCAD permite crear todos estos tipos y guardar su configuración bajo "nombres de estilo".</p>
                
                <div class="bg-blue-900/30 p-4 rounded-xl border border-blue-800 text-blue-200 mt-4">
                    <p class="text-xs"><strong>Norma General:</strong> Al igual que con los sombreados o los textos, se recomienda encarecidamente crear una capa exclusiva llamada <code>COTAS</code> (o similar) y definirla como la capa actual antes de empezar a acotar tu modelo.</p>
                </div>
            </div>
            <div class="flex justify-center">
                <img src="/courses/autocad/cotas/img_2.jpeg" alt="Ejemplo de Cotas" class="rounded-xl border border-slate-700 shadow-md bg-white p-2 w-full object-contain max-h-64">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 1: CREAR COTAS (ACOTA) -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">1</span>
                El comando ACOTA
            </h2>
        </div>
        
        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <p>Puede crear cotas fácilmente utilizando el comando <code class="text-sky-400 font-mono">ACOTA</code>, disponible en el grupo Anotación de la ficha Inicio.</p>
            <img src="/courses/autocad/cotas/img_3.jpeg" alt="Ribbon Acotar" class="rounded-lg shadow-md max-w-[200px]">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-6">
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h3 class="text-lg font-bold text-sky-400 mb-3">Método: Seleccionar Objeto</h3>
                    <p class="text-xs text-slate-400 mb-4">Después de iniciar el comando ACOTA, haga clic directamente en una línea y desplace el cursor hacia arriba o abajo para ubicar la línea de cota.</p>
                    <img src="/courses/autocad/cotas/img_4.jpeg" alt="Acotar objeto" class="rounded-lg shadow-md bg-white p-2 mx-auto">
                </div>
                
                <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h3 class="text-lg font-bold text-sky-400 mb-3">Método: Seleccionar Puntos</h3>
                    <p class="text-xs text-slate-400 mb-4">Haga clic en un punto inicial (1), luego en un punto final (2) usando Referencias a Objetos (OSNAP), y ubique la cota (3).</p>
                    <img src="/courses/autocad/cotas/img_5.jpeg" alt="Acotar puntos" class="rounded-lg shadow-md bg-white p-2 mx-auto">
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-8">
                    <h3 class="text-lg font-bold text-white mb-2">Cotas Alineadas</h3>
                    <p>Si necesita acotar un objeto que está en ángulo, utilice el comando ACOTA y arrastre la línea en dirección perpendicular al segmento inclinado. Esto forzará una cota alineada.</p>
                </div>
                <div class="lg:col-span-4">
                    <img src="/courses/autocad/cotas/img_6.jpeg" alt="Cota alineada" class="rounded-lg shadow-md bg-white p-2">
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: MODIFICACIÓN -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">2</span>
                Modificar Cotas con Pinzamientos
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-4 text-slate-300 text-sm">
                <p>No hay un método más rápido que los pinzamientos (grips) azules para realizar ajustes sencillos en las cotas después de haberlas creado.</p>
                <p>Simplemente seleccione la cota y haga clic en un pinzamiento. Podrá:</p>
                <ul class="list-disc list-inside space-y-2 text-slate-400">
                    <li>Alargar o acortar la ubicación del extremo.</li>
                    <li>Subir o bajar toda la línea de cota.</li>
                    <li>Mover el texto de la cota independientemente de las líneas.</li>
                </ul>
                <div class="text-xs text-amber-300 mt-4">
                    Consejo: Si el cambio requerido es muy complejo o el dibujo es muy denso, a veces lo más rápido es borrar la cota con la tecla Supr y hacerla de nuevo.
                </div>
            </div>
            <div class="flex justify-center">
                <img src="/courses/autocad/cotas/img_7.jpeg" alt="Pinzamientos de cota" class="rounded-xl border border-slate-700 shadow-md bg-white p-4 w-full">
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: ESTILOS DE COTA -->
    <section class="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="border-b border-slate-700 pb-4 mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm">3</span>
                Estilos de Cota (ACOESTIL)
            </h2>
        </div>

        <div class="space-y-8 text-slate-300 text-sm leading-relaxed">
            <p>Los estilos de cota ayudan a establecer y cumplir estrictas normas de dibujo. Existen cientos de variables (como la forma de las flechas, color de las líneas, posición del texto, escalas) que se controlan desde el comando <code class="text-sky-400 font-mono">ACOESTIL</code>.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">Seleccionar un estilo</h3>
                    <p>El estilo por defecto en AutoCAD suele ser <code>Standard</code> (imperial) o <code>ISO-25</code> (métrico). Puede cambiar el estilo activo desplegando el grupo Anotación.</p>
                    <div class="flex gap-4">
                        <img src="/courses/autocad/cotas/img_8.jpeg" alt="Dropdown Ribbon" class="rounded-lg shadow-md max-h-32 object-contain">
                        <img src="/courses/autocad/cotas/img_9.jpeg" alt="Elegir Estilo" class="rounded-lg shadow-md max-h-32 object-contain">
                    </div>
                </div>

                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-white">El Administrador de Estilos</h3>
                    <p>Al abrir el Administrador de Estilos de Cota y pulsar <strong>Modificar</strong>, se abre un cuadro de diálogo inmenso con pestañas para Líneas, Símbolos y flechas, Texto, Ajustar, etc.</p>
                    <img src="/courses/autocad/cotas/img_10.jpeg" alt="Modificar Estilo" class="rounded-lg border border-slate-700 shadow-md bg-slate-200">
                    <p class="text-xs text-slate-400">Crear un estilo que cumpla una normativa rigurosa lleva tiempo, por lo que es vital guardar los estilos creados dentro de la plantilla base (<code>.dwt</code>) de la empresa.</p>
                </div>
            </div>
        </div>
    </section>
</div>
`;

async function run() {
  console.log('🚀 Iniciando subida de la lección preliminar: Cotas...');

  const moduleId = 'mod_autocad_pre';
  const lessonId = 'lesson_cotas_pre';
  
  const lessonData = {
    id: lessonId,
    courseId: 'autocad',
    moduleId: moduleId,
    title: 'Cotas y Dimensionamiento',
    description: 'Comunica las medidas de tu diseño creando cotas lineales y angulares, y conociendo el uso de Estilos de Cota (ACOESTIL).',
    content: styledHtmlContent,
    order: 0.998,
    published: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
  console.log('✅ Lección de Cotas publicada con éxito (Orden 0.998).');
}

run().catch(console.error);
