const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: '.env.local' });
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY||'').replace(/\\n/g,'\n'),
  })});
}
const db = admin.firestore();

const htmlPath = path.join(
  'C:', 'Users', 'admin', 'Documents', '000 A PREPA',
  'planeaciones especialidades', 'Proyectos y Otros', 'semestre-5',
  'pensamiento-variacional', 'cursos', 'ANALISIS FISICOS', 'mcs', 'MC01', 'MC01.html'
);

const rawHtml = fs.readFileSync(htmlPath, 'utf8');
console.log('Archivo leido, longitud:', rawHtml.length);

const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;
console.log('Body encontrado:', !!bodyMatch);

// Eliminar scripts y footer
bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');
bodyContent = bodyContent.replace(/<footer[\s\S]*?<\/footer>/gi, '');

// Adaptar clases de color al tema de la plataforma
bodyContent = bodyContent
  .replace(/\btext-primary\b/g, 'text-cyan-400')
  .replace(/\bborder-primary\b/g, 'border-cyan-400')
  .replace(/\bbg-primary\b/g, 'bg-cyan-600')
  .replace(/\bhover:bg-primary\/80\b/g, 'hover:bg-cyan-500')
  .replace(/\btext-accent\b/g, 'text-purple-400')
  .replace(/\bborder-accent\/50\b/g, 'border-purple-500/50')
  .replace(/\bborder-t-accent\b/g, 'border-t-purple-500')
  .replace(/\bbg-accent\/20\b/g, 'bg-purple-500/20')
  .replace(/\bbg-accent\/90\b/g, 'bg-purple-600/90')
  .replace(/\btext-success\b/g, 'text-emerald-400')
  .replace(/\bbg-success\/20\b/g, 'bg-emerald-500/20')
  .replace(/\bborder-success\/50\b/g, 'border-emerald-400/50')
  .replace(/\bborder-t-success\b/g, 'border-t-emerald-500')
  .replace(/\bfont-display\b/g, 'font-bold tracking-tight')
  .replace(/\bglass-panel\b/g, 'bg-slate-800/60 backdrop-blur-sm border border-slate-700')
  .replace(/\btext-indigo-[0-9]+\b/g, 'text-cyan-200')
  .replace(/\bfrom-indigo-[0-9/]+\b/g, 'from-slate-900/60')
  .replace(/focus:ring-primary/g, 'focus:ring-cyan-400');

const finalHTML = '<div class="mc01-wrapper text-slate-300">' + bodyContent.trim() + '</div>';
console.log('HTML final listo, longitud:', finalHTML.length);

db.collection('Lessons').doc('lesson_fisica_mc01').update({
  content: finalHTML,
  title: 'Masterclass 01: Tipos de Fuerzas — Anatomía de las Interacciones Físicas',
}).then(() => {
  console.log('✅ MC01 reemplazada exitosamente en Firebase.');
  process.exit(0);
}).catch(e => { console.error('Error Firebase:', e.message); process.exit(1); });
