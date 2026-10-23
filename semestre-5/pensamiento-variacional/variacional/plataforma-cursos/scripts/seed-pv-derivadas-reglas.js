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

async function run() {
  console.log('🚀 Subiendo lección: Reglas de Derivación (Pensamiento Variacional S5)...');

  // Curso "Pensamiento Variacional (Plataforma S5)" -> módulos mod-1..mod-5 (50 sesiones).
  // Bloque 4 "La Tasa Instantánea" (mod-4) agrupa el tema de derivadas.
  const courseId = 'pensamiento-variacional-1';
  const moduleId = 'mod-4';
  const lessonId = 'lesson_derivadas_reglas_practica';

  const htmlContent = `
<div class="space-y-6">
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe
            src="/courses/pensamiento-variacional/derivadas-reglas/index.html?v=1"
            class="w-full"
            style="min-height: 2400px; border: none;"
            title="Reglas de Derivación: Práctica Guiada"
        ></iframe>
    </div>
</div>
  `;

  await db.collection('Lessons').doc(lessonId).set({
    id: lessonId,
    courseId,
    moduleId,
    title: 'Práctica Guiada: Reglas de Derivación',
    description: 'Construye la derivada de funciones con potencia, exponencial, cadena y producto, con desarrollo paso a paso.',
    content: htmlContent,
    // 51 evita chocar con las sesiones 1-50 (la navegación "siguiente" usa order+1)
    order: 51,
    published: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  console.log('✅ Lección publicada en Bloque 4 (orden 51).');
}

run().catch(console.error);
