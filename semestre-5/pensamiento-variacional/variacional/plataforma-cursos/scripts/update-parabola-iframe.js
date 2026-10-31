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
  const htmlContent = `
<div class="space-y-6">
    <div class="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 class="text-3xl font-bold mb-4">La Parábola y sus Elementos</h1>
        <p class="text-indigo-100 text-lg">Analiza ecuaciones ordinarias, deduce los parámetros y calcula Vértice, Foco, Lado Recto y Directriz de la Parábola.</p>
    </div>
    
    <div class="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <iframe src="/courses/pm3/parabola/index.html" class="w-full" style="min-height: 900px; border: none;" title="La Parábola y sus Elementos"></iframe>
    </div>
</div>
  `;

  await db.collection('Lessons').doc('lesson_pm3_parabola').set({ content: htmlContent }, { merge: true });
  console.log('✅ Lección actualizada con el iframe embebido.');
}

run().catch(console.error);
