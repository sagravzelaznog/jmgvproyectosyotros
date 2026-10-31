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
const PUBLIC_MEDIA_DIR = path.join(__dirname, '..', 'public', 'courses', 'fisica');

const MODULE_MAP = [
  { title: 'Módulo 1: Fuerzas y Estática', mcs: [1,2,3,4,5,6,7] },
  { title: 'Módulo 2: Equilibrio y Torque', mcs: [8,9,10,11,12,13] },
  { title: 'Módulo 3: Dinámica Rotacional y Elasticidad', mcs: [14,15,16,17,18,19] },
  { title: 'Módulo 4: Mecánica de Fluidos e Hidráulica', mcs: [20,21,22,23,24,25] },
];

// Obtener URLs públicas de imágenes desde la carpeta /public del proyecto
function getPublicImageURLs(mcNum) {
  const mcPad = String(mcNum).padStart(2, '0');
  const dir = path.join(PUBLIC_MEDIA_DIR, 'mc' + mcPad);
  if (!fs.existsSync(dir)) return { bannerURL: null, slideURLs: [], cropURLs: [] };

  const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  const baseURL = '/courses/fisica/mc' + mcPad;

  const bannerFile = files.find(f => !f.toLowerCase().includes('_slide') && !f.toLowerCase().includes('_crop'));
  const slideFiles = files.filter(f => f.toLowerCase().includes('_slide')).sort();
  const cropFiles  = files.filter(f => f.toLowerCase().includes('_crop')).sort();

  return {
    bannerURL:  bannerFile  ? baseURL + '/' + encodeURIComponent(bannerFile)  : null,
    slideURLs:  slideFiles.map(f => baseURL + '/' + encodeURIComponent(f)),
    cropURLs:   cropFiles.map(f => baseURL + '/' + encodeURIComponent(f)),
  };
}

function inlineMD(s) {
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  s = s.replace(/`(.+?)`/g, '<code class="bg-slate-800 text-neon-cyan px-1 rounded text-sm font-mono">$1</code>');
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-neon-cyan underline" target="_blank">$1</a>');
  return s;
}

function buildMediaHTML(mcNum, bannerURL, slideURLs, cropURLs) {
  let html = '';

  // Banner portada
  if (bannerURL) {
    html += `
      <div class="my-8">
        <img src="${bannerURL}" alt="Portada MC${String(mcNum).padStart(2,'0')}"
          class="w-full rounded-2xl border border-slate-700 shadow-xl object-cover max-h-[360px]"
          loading="lazy" />
      </div>`;
  }

  // Galería de slides — grid responsivo
  if (slideURLs.length > 0) {
    const items = slideURLs.map((url, i) => `
      <div class="group relative overflow-hidden rounded-xl border border-slate-700
                  hover:border-neon-cyan/60 transition-all duration-300 bg-slate-900
                  cursor-zoom-in shadow-lg hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]"
           onclick="var img=this.querySelector('img');img.requestFullscreen?img.requestFullscreen():img.webkitRequestFullscreen?.()">
        <img src="${url}" alt="Diapositiva ${i+1}" loading="lazy"
          class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent
                    px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span class="text-xs text-slate-300 font-mono">📊 Diapositiva ${i+1} / ${slideURLs.length}</span>
        </div>
      </div>`).join('');

    html += `
      <div class="my-8">
        <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <span class="w-2 h-6 rounded-full bg-neon-cyan inline-block"></span>
          Presentación Visual de la Sesión
          <span class="ml-auto text-xs text-slate-500 font-normal bg-slate-800 px-2 py-1 rounded-full">
            ${slideURLs.length} diapositivas
          </span>
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          ${items}
        </div>
      </div>`;
  }

  // Galería de imágenes conceptuales (crops)
  if (cropURLs.length > 0) {
    const items = cropURLs.map((url, i) => `
      <div class="group relative overflow-hidden rounded-xl border border-slate-700
                  hover:border-neon-purple/60 transition-all duration-300 bg-slate-900
                  cursor-zoom-in shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
           onclick="var img=this.querySelector('img');img.requestFullscreen?img.requestFullscreen():img.webkitRequestFullscreen?.()">
        <img src="${url}" alt="Imagen de referencia ${i+1}" loading="lazy"
          class="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 p-1" />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent
                    px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span class="text-xs text-neon-purple font-mono">🔬 Concepto ${i+1}</span>
        </div>
      </div>`).join('');

    html += `
      <div class="my-8">
        <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <span class="w-2 h-6 rounded-full bg-neon-purple inline-block"></span>
          Imágenes de Referencia Conceptual
          <span class="ml-auto text-xs text-slate-500 font-normal bg-slate-800 px-2 py-1 rounded-full">
            ${cropURLs.length} imágenes
          </span>
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${items}
        </div>
      </div>`;
  }

  return html;
}

function mdToHTML(md, mcNum, bannerURL, slideURLs, cropURLs) {
  const lines = md.split('\n');
  let html = '';
  let tableBuf = [];
  let inTable = false;
  let mediaInserted = false;

  const mediaHTML = buildMediaHTML(mcNum, bannerURL, slideURLs, cropURLs);

  const flushTable = () => {
    if (!tableBuf.length) return;
    let t = '<div class="overflow-x-auto my-6 rounded-xl border border-slate-700"><table class="w-full text-sm border-collapse">';
    tableBuf.forEach((row, idx) => {
      const tag = idx === 0 ? 'th' : 'td';
      const rowBg = idx === 0 ? '' : (idx % 2 === 0 ? 'bg-slate-900/30' : '');
      const cls = idx === 0
        ? 'bg-slate-800 text-neon-cyan font-bold px-4 py-3 border border-slate-700 text-left text-xs uppercase tracking-wider'
        : 'px-4 py-3 border border-slate-700 text-slate-300 align-top leading-relaxed';
      t += `<tr class="${rowBg}">` + row.map(c => `<${tag} class="${cls}">${inlineMD(c.trim())}</${tag}>`).join('') + '</tr>';
    });
    t += '</table></div>';
    html += t;
    tableBuf = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '---') { html += '<hr class="border-slate-700 my-8"/>'; continue; }

    if (line.trim().startsWith('|')) {
      const cells = line.split('|').slice(1, -1);
      if (cells.every(c => /^[\s\-:]+$/.test(c))) continue;
      tableBuf.push(cells); inTable = true; continue;
    } else if (inTable) { flushTable(); inTable = false; }

    if (line.startsWith('> ')) {
      const content = inlineMD(line.replace(/^>\s?/, ''));
      html += `<div class="border-l-4 border-neon-cyan pl-4 my-3 py-2 text-slate-300 italic bg-neon-cyan/5 rounded-r-lg">${content}</div>`;
      continue;
    }

    if (line.startsWith('##### ')) { html += `<h5 class="text-base font-bold text-neon-purple mt-5 mb-2">${inlineMD(line.slice(6))}</h5>`; continue; }
    if (line.startsWith('#### '))  { html += `<h4 class="text-xl font-bold text-neon-cyan mt-6 mb-3">${inlineMD(line.slice(5))}</h4>`; continue; }
    if (line.startsWith('### '))   {
      html += `<h3 class="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-700 pb-2">${inlineMD(line.slice(4))}</h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      // Insertar media justo antes del primer H2 de contenido
      if (!mediaInserted && mediaHTML) { html += mediaHTML; mediaInserted = true; }
      html += `<h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-5">${inlineMD(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith('# ')) {
      const text = inlineMD(line.slice(2));
      html += `
        <div class="mb-8 text-center">
          <div class="inline-block px-4 py-1 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan font-black tracking-widest text-xs mb-4 rounded-full uppercase">
            Análisis Físicos &nbsp;·&nbsp; MC ${String(mcNum).padStart(2,'0')}
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight mb-2">${text}</h1>
        </div>`;
      continue;
    }

    if (line.match(/^\*\s+/) && !line.match(/^\*\s+[A-D]\)/)) {
      html += `<li class="mb-2 text-slate-300 leading-relaxed ml-4">${inlineMD(line.replace(/^\*\s+/, ''))}</li>`;
      continue;
    }
    if (line.match(/^\d+\.\s+/)) {
      html += `<li class="mb-2 text-slate-300 leading-relaxed ml-4">${inlineMD(line.replace(/^\d+\.\s+/, ''))}</li>`;
      continue;
    }

    if (line.trim() === '') { html += '<div class="mb-3"></div>'; continue; }
    if (line.trim()) { html += `<p class="text-slate-300 leading-relaxed mb-3">${inlineMD(line)}</p>`; }
  }

  flushTable();
  if (!mediaInserted && mediaHTML) html += mediaHTML;
  return html;
}

function parseMC(mdContent, mcNum) {
  const lines = mdContent.split('\n');
  let titulo = 'Masterclass ' + String(mcNum).padStart(2,'0');
  for (const l of lines) { if (l.startsWith('# ')) { titulo = l.replace(/^#\s+/, '').trim(); break; } }

  const quizQuestions = [];
  const preguntaRegex = /^#{4,5}\s+Pregunta\s+\d+/i;
  let inQ = false, currentQ = null, options = [], correctAnswer = null, feedback = '';

  for (const line of lines) {
    if (preguntaRegex.test(line)) {
      if (currentQ && options.length) quizQuestions.push({ question: currentQ, options, correctAnswer: correctAnswer || options[0], feedback });
      currentQ = null; options = []; correctAnswer = null; feedback = ''; inQ = true; continue;
    }
    if (inQ) {
      if (!currentQ && line.startsWith('**') && line.endsWith('**')) { currentQ = line.replace(/^\*\*|\*\*$/g, '').trim(); continue; }
      const optM = line.match(/^\*\s+([A-D])\)\s+(.+)/);
      if (optM) { options.push(optM[2].trim()); continue; }
      const corrM = line.match(/\*\s+\*\*([A-D])\)\s+CORRECTO.*?:\*\*\s*(.*)/i);
      if (corrM) {
        const ltr = line.match(/([A-D])\)/);
        if (ltr) { const idx2 = ltr[1].charCodeAt(0) - 65; if (options[idx2]) correctAnswer = options[idx2]; }
        feedback = corrM[2].trim();
      }
    }
  }
  if (currentQ && options.length) quizQuestions.push({ question: currentQ, options, correctAnswer: correctAnswer || options[0], feedback });
  return { titulo, quizQuestions };
}

async function seedFisicaConImagenes() {
  console.log('=== SEED FÍSICA + IMÁGENES LOCALES (MC01-MC25) ===\n');

  await db.collection('Courses').doc(COURSE_ID).set({
    title: 'Análisis Físicos',
    description: 'Curso de estática, dinámica, cinemática y mecánica de fluidos. 25 Masterclasses con imágenes, diagramas y quizzes interactivos.',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600',
    published: true, order: 5,
  }, { merge: true });
  console.log('✅ Curso actualizado.\n');

  for (let m = 0; m < MODULE_MAP.length; m++) {
    const mod = MODULE_MAP[m];
    await db.collection('Modules').doc('mod_fisica_' + (m+1)).set({
      courseId: COURSE_ID, title: mod.title, order: m+1,
    }, { merge: true });
    console.log('📦 Módulo: ' + mod.title);
  }
  console.log('');

  for (let m = 0; m < MODULE_MAP.length; m++) {
    const mod = MODULE_MAP[m];
    const modId = 'mod_fisica_' + (m+1);

    for (let idx = 0; idx < mod.mcs.length; idx++) {
      const mcNum = mod.mcs[idx];
      const mcPad = String(mcNum).padStart(2,'0');
      const mcDir = path.join(MCS_BASE_DIR, 'MC' + mcPad);
      const allFiles = fs.readdirSync(mcDir);
      const mdFile = allFiles.find(f => f.endsWith('.md'));
      if (!mdFile) { console.warn('⚠️  Sin .md en MC' + mcPad); continue; }

      const { bannerURL, slideURLs, cropURLs } = getPublicImageURLs(mcNum);
      const mdContent = fs.readFileSync(path.join(mcDir, mdFile), 'utf8');
      const { titulo, quizQuestions } = parseMC(mdContent, mcNum);
      const htmlContent = mdToHTML(mdContent, mcNum, bannerURL, slideURLs, cropURLs);

      const lessonId = 'lesson_fisica_mc' + mcPad;
      await db.collection('Lessons').doc(lessonId).set({
        moduleId: modId, courseId: COURSE_ID, title: titulo,
        content: htmlContent, order: idx + 1,
        thumbnailUrl: bannerURL || null,
        videoUrl: null,
      }, { merge: true });

      if (quizQuestions.length > 0) {
        await db.collection('Quizzes').doc('quiz_' + lessonId).set({
          lessonId,
          questions: quizQuestions.map((q, qi) => ({
            id: 'q' + (qi+1), question: q.question, options: q.options,
            correctAnswer: q.correctAnswer, answer: q.correctAnswer, feedback: q.feedback,
          })),
        }, { merge: true });
      }

      const imgCount = slideURLs.length + cropURLs.length + (bannerURL ? 1 : 0);
      console.log(`✅ MC${mcPad}: ${titulo} [${imgCount} imgs]`);
    }
  }

  console.log('\n=== SEED CON IMÁGENES COMPLETADO ===\n');
  process.exit(0);
}

seedFisicaConImagenes().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
