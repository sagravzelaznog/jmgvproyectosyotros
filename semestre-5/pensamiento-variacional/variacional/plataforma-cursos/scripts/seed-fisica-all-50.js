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

const mcsDir = 'C:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\ANALISIS FISICOS\\mcs';

// Módulos del curso
const modulesData = [
  { id: 'mod_fisica_1', courseId: 'fisica', title: 'Unidad 1: Fuerzas y Equilibrio Traslacional', order: 1 },
  { id: 'mod_fisica_2', courseId: 'fisica', title: 'Unidad 2: Torque y Equilibrio Rotacional', order: 2 },
  { id: 'mod_fisica_3', courseId: 'fisica', title: 'Unidad 3: Elasticidad y Deformación', order: 3 },
  { id: 'mod_fisica_4', courseId: 'fisica', title: 'Unidad 4: Hidrostática y Mecánica de Fluidos', order: 4 },
  { id: 'mod_fisica_5', courseId: 'fisica', title: 'Unidad 5: Hidrodinámica y Ecuación de Bernoulli', order: 5 },
  { id: 'mod_fisica_6', courseId: 'fisica', title: 'Unidad 6: Aplicaciones de Ingeniería y Proyecto ABP', order: 6 },
];

function getModuleForMC(num) {
  if (num <= 8) return 'mod_fisica_1';
  if (num <= 16) return 'mod_fisica_2';
  if (num <= 19) return 'mod_fisica_3';
  if (num <= 26) return 'mod_fisica_4';
  if (num <= 34) return 'mod_fisica_5';
  return 'mod_fisica_6';
}

async function seed() {
  console.log('🚀 Iniciando despliegue de Análisis Físicos (MC01 a MC50)...');

  // 1. Crear / actualizar Curso
  await db.collection('Courses').doc('fisica').set({
    id: 'fisica',
    title: 'Análisis Físicos (Física)',
    description: 'Curso intensivo de física (estática, dinámica, rotación, elasticidad, mecánica de fluidos e hidrodinámica) orientado al diseño y construcción de un prototipo mecánico o grúa hidráulica.',
    published: true,
    category: 'Ciencias Físico-Matemáticas',
    totalLessons: 50,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log('✅ Curso "fisica" publicado en Firebase.');

  // 2. Crear Módulos
  for (const m of modulesData) {
    await db.collection('Modules').doc(m.id).set(m, { merge: true });
  }
  console.log('✅ 6 Módulos creados/actualizados.');

  // 3. Procesar y subir las 50 Lecciones
  for (let i = 1; i <= 50; i++) {
    const mcNum = String(i).padStart(2, '0');
    const mcFolder = `MC${mcNum}`;
    const folderPath = path.join(mcsDir, mcFolder);

    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️ Carpeta ${mcFolder} no existe. Omitiendo.`);
      continue;
    }

    const files = fs.readdirSync(folderPath);
    const htmls = files.filter(f => f.endsWith('.html'));

    // Seleccionar el mejor HTML
    let bestHtmlFile = null;
    let maxImgs = -1;
    let maxBytes = -1;

    htmls.forEach(h => {
      const c = fs.readFileSync(path.join(folderPath, h), 'utf8');
      const imgs = (c.match(/<img/gi) || []).length;
      const vids = (c.match(/<video/gi) || []).length;
      const score = imgs * 1000 + vids * 500 + c.length;

      if (score > (maxImgs * 1000 + maxBytes)) {
        bestHtmlFile = h;
        maxImgs = imgs;
        maxBytes = c.length;
      }
    });

    if (!bestHtmlFile) {
      console.warn(`⚠️ No se encontró HTML en ${mcFolder}`);
      continue;
    }

    const rawHtml = fs.readFileSync(path.join(folderPath, bestHtmlFile), 'utf8');

    // Extraer título
    const titleMatch = rawHtml.match(/<h1[^>]*>(.*?)<\/h1>/i) || rawHtml.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : `Masterclass ${mcNum}`;
    title = title.replace(/\s*\|\s*Análisis Físico.*/i, '').replace(/Masterclass\s*\d+:\s*/i, '').trim();

    // Extraer body
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

    // Eliminar scripts y footers
    bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');
    bodyContent = bodyContent.replace(/<footer[\s\S]*?<\/footer>/gi, '');

    // Reemplazar rutas de imágenes y videos por rutas relativas a /courses/fisica/mcXX/
    // PNG -> JPG (compresion previa)
    bodyContent = bodyContent.replace(/src=["'](\.\/)?([^"']+\.(png|jpg|jpeg|webp))["']/gi, (match, dot, filename) => {
      const baseName = path.parse(filename).name;
      return `src="/courses/fisica/mc${mcNum}/${baseName}.jpg"`;
    });

    bodyContent = bodyContent.replace(/poster=["'](\.\/)?([^"']+\.(png|jpg|jpeg|webp))["']/gi, (match, dot, filename) => {
      const baseName = path.parse(filename).name;
      return `poster="/courses/fisica/mc${mcNum}/${baseName}.jpg"`;
    });

    bodyContent = bodyContent.replace(/src=["'](\.\/)?([^"']+\.(mp4|webm))["']/gi, (match, dot, filename) => {
      const cleanName = filename.replace(/\s+/g, '_');
      return `src="/courses/fisica/mc${mcNum}/${cleanName}"`;
    });

    // Adaptar colores al tema plataforma
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

    const finalHtml = `<div class="mc-lesson-wrapper text-slate-300">${bodyContent.trim()}</div>`;

    const lessonDocId = `lesson_fisica_mc${mcNum}`;
    const moduleId = getModuleForMC(i);

    await db.collection('Lessons').doc(lessonDocId).set({
      id: lessonDocId,
      courseId: 'fisica',
      moduleId: moduleId,
      title: `MC${mcNum}: ${title}`,
      order: i,
      content: finalHtml,
      duration: '45 min',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`  [${i}/50] Subida lección: MC${mcNum}: ${title.substring(0, 40)}...`);
  }

  console.log('\n🎉 ¡Despliegue completo de las 50 lecciones de Análisis Físicos finalizado exitosamente!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error seeding:', err);
  process.exit(1);
});
