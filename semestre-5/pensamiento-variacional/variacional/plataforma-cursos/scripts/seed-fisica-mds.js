const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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
const COURSE_ID = 'fisica';

const MCS_BASE_DIR = 'C:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\ANALISIS FISICOS\\mcs';

const MODULE_MAP = [
  { title: 'Modulo 1: Fuerzas y Estatica', mcs: [1,2,3,4,5,6,7] },
  { title: 'Modulo 2: Equilibrio y Torque', mcs: [8,9,10,11,12,13] },
  { title: 'Modulo 3: Dinamica Rotacional y Elasticidad', mcs: [14,15,16,17,18,19] },
  { title: 'Modulo 4: Mecanica de Fluidos e Hidraulica', mcs: [20,21,22,23,24,25] },
];

function inlineMD(s) {
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  s = s.replace(/`(.+?)`/g, '<code class="bg-slate-800 text-neon-cyan px-1 rounded text-sm font-mono">$1</code>');
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-neon-cyan underline" target="_blank">$1</a>');
  return s;
}

function mdToHTML(md, mcNum) {
  const lines = md.split('\n');
  let html = '';
  let tableBuf = [];
  let inTable = false;

  const flushTable = () => {
    if (!tableBuf.length) return;
    let thtml = '<div class="overflow-x-auto my-4"><table class="w-full text-sm border-collapse">';
    tableBuf.forEach((row, idx) => {
      const tag = idx === 0 ? 'th' : 'td';
      const cls = idx === 0 ? 'bg-slate-800 text-white font-bold px-3 py-2 border border-slate-700' : 'px-3 py-2 border border-slate-700 text-slate-300 align-top';
      thtml += '<tr>' + row.map(c => '<' + tag + ' class="' + cls + '">' + inlineMD(c.trim()) + '</' + tag + '>').join('') + '</tr>';
    });
    thtml += '</table></div>';
    html += thtml;
    tableBuf = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '---') { html += '<hr class="border-slate-700 my-6"/>'; continue; }

    if (line.trim().startsWith('|')) {
      const cells = line.split('|').slice(1, -1);
      if (cells.every(c => /^[\s\-:]+$/.test(c))) continue;
      tableBuf.push(cells); inTable = true; continue;
    } else if (inTable) { flushTable(); inTable = false; }

    if (line.startsWith('> ')) {
      html += '<div class="border-l-4 border-neon-cyan pl-4 my-1 text-slate-300 italic">' + inlineMD(line.replace(/^>\s?/, '')) + '</div>';
      continue;
    }

    if (line.startsWith('##### ')) { html += '<h5 class="text-lg font-bold text-neon-purple mt-6 mb-2">' + inlineMD(line.slice(6)) + '</h5>'; continue; }
    if (line.startsWith('#### '))  { html += '<h4 class="text-xl font-bold text-neon-cyan mt-6 mb-3">' + inlineMD(line.slice(5)) + '</h4>'; continue; }
    if (line.startsWith('### '))   { html += '<h3 class="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-700 pb-2">' + inlineMD(line.slice(4)) + '</h3>'; continue; }
    if (line.startsWith('## '))    { html += '<h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-4">' + inlineMD(line.slice(3)) + '</h2>'; continue; }
    if (line.startsWith('# '))     {
      const text = inlineMD(line.slice(2));
      html += '<div class="mb-10 text-center"><div class="inline-block px-3 py-1 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-black tracking-widest text-xs mb-4 rounded-full">ANALISIS FISICOS · MC ' + String(mcNum).padStart(2,'0') + '</div><h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight mb-2">' + text + '</h1></div>';
      continue;
    }

    if (line.match(/^\*\s+/) && !line.match(/^\*\s+[A-D]\)/)) {
      html += '<li class="mb-1 text-slate-300">' + inlineMD(line.replace(/^\*\s+/, '')) + '</li>';
      continue;
    }
    if (line.match(/^\d+\.\s+/)) {
      html += '<li class="mb-1 text-slate-300">' + inlineMD(line.replace(/^\d+\.\s+/, '')) + '</li>';
      continue;
    }

    if (line.trim() === '') { html += '<p class="mb-2"></p>'; continue; }
    if (line.trim()) { html += '<p class="text-slate-300 leading-relaxed mb-3">' + inlineMD(line) + '</p>'; }
  }
  flushTable();
  return html;
}

function parseMC(mdContent, mcNum) {
  const lines = mdContent.split('\n');
  let titulo = 'Masterclass ' + String(mcNum).padStart(2,'0');
  for (const l of lines) { if (l.startsWith('# ')) { titulo = l.replace(/^#\s+/, '').trim(); break; } }

  const quizQuestions = [];
  const preguntaRegex = /^#{4,5}\s+Pregunta\s+\d+/i;
  let inQuestion = false;
  let currentQ = null;
  let currentOptions = [];
  let correctAnswer = null;
  let feedback = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (preguntaRegex.test(line)) {
      if (currentQ && currentOptions.length > 0) {
        quizQuestions.push({ question: currentQ, options: currentOptions, correctAnswer: correctAnswer || currentOptions[0], feedback });
      }
      currentQ = null; currentOptions = []; correctAnswer = null; feedback = ''; inQuestion = true; continue;
    }
    if (inQuestion) {
      if (!currentQ && line.startsWith('**') && line.endsWith('**')) { currentQ = line.replace(/^\*\*/, '').replace(/\*\*$/, '').trim(); continue; }
      const optMatch = line.match(/^\*\s+([A-D])\)\s+(.+)/);
      if (optMatch) { currentOptions.push(optMatch[2].trim()); continue; }
      const corrMatch = line.match(/\*\s+\*\*([A-D])\)\s+CORRECTO.*?:\*\*\s*(.*)/i);
      if (corrMatch) {
        const ltr = line.match(/([A-D])\)/);
        if (ltr) { const idx = ltr[1].charCodeAt(0) - 65; if (currentOptions[idx]) correctAnswer = currentOptions[idx]; }
        feedback = corrMatch[2].trim(); continue;
      }
    }
  }
  if (currentQ && currentOptions.length > 0) {
    quizQuestions.push({ question: currentQ, options: currentOptions, correctAnswer: correctAnswer || currentOptions[0], feedback });
  }

  return { titulo, htmlContent: mdToHTML(mdContent, mcNum), quizQuestions };
}

async function seedFisicaMD() {
  console.log('--- INICIANDO SEED DE ANALISIS FISICOS (MDs MC01-MC25) ---\n');

  await db.collection('Courses').doc(COURSE_ID).set({
    title: 'Analisis Fisicos',
    description: 'Curso de estatica, dinamica, cinematica y termodinamica orientado al ABP.',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600',
    published: true, order: 5,
  }, { merge: true });
  console.log('Curso creado/actualizado.\n');

  console.log('--- MODULOS ---');
  for (let m = 0; m < MODULE_MAP.length; m++) {
    const mod = MODULE_MAP[m];
    const modId = 'mod_fisica_' + (m + 1);
    await db.collection('Modules').doc(modId).set({ courseId: COURSE_ID, title: mod.title, order: m + 1 }, { merge: true });
    console.log('Modulo: ' + mod.title);
  }

  console.log('\n--- LECCIONES ---');
  for (let m = 0; m < MODULE_MAP.length; m++) {
    const mod = MODULE_MAP[m];
    const modId = 'mod_fisica_' + (m + 1);
    for (let idx = 0; idx < mod.mcs.length; idx++) {
      const mcNum = mod.mcs[idx];
      const mcDir = path.join(MCS_BASE_DIR, 'MC' + String(mcNum).padStart(2,'0'));
      const allFiles = fs.readdirSync(mcDir);
      const mdFile = allFiles.find(f => f.endsWith('.md'));
      if (!mdFile) { console.warn('Sin .md en MC' + mcNum); continue; }
      const mdContent = fs.readFileSync(path.join(mcDir, mdFile), 'utf8');
      const { titulo, htmlContent, quizQuestions } = parseMC(mdContent, mcNum);
      const lessonId = 'lesson_fisica_mc' + String(mcNum).padStart(2,'0');
      await db.collection('Lessons').doc(lessonId).set({
        moduleId: modId, courseId: COURSE_ID, title: titulo, content: htmlContent, order: idx + 1, videoUrl: null,
      }, { merge: true });
      if (quizQuestions.length > 0) {
        await db.collection('Quizzes').doc('quiz_' + lessonId).set({
          lessonId,
          questions: quizQuestions.map((q, qi) => ({
            id: 'q' + (qi + 1), question: q.question, options: q.options,
            correctAnswer: q.correctAnswer, answer: q.correctAnswer, feedback: q.feedback,
          })),
        }, { merge: true });
      }
      console.log('MC' + String(mcNum).padStart(2,'0') + ' subida: ' + titulo);
    }
  }
  console.log('\n--- SEED COMPLETADO ---\n');
  process.exit(0);
}

seedFisicaMD().catch(err => { console.error(err); process.exit(1); });
