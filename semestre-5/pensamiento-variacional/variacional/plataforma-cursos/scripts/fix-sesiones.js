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

function getModuleForMC(num) {
  if (num <= 8) return 'mod_fisica_1';
  if (num <= 16) return 'mod_fisica_2';
  if (num <= 19) return 'mod_fisica_3';
  if (num <= 26) return 'mod_fisica_4';
  if (num <= 34) return 'mod_fisica_5';
  return 'mod_fisica_6';
}

async function run() {
  console.log('🚀 Iniciando script de limpieza y corrección...');

  // 1. Limpieza de base de datos
  console.log('🧹 Limpiando documentos obsoletos (lesson_fisica_mcXX)...');
  const lessonsSnapshot = await db.collection('Lessons').get();
  let deletedCount = 0;
  
  const batchArray = [];
  let currentBatch = db.batch();
  let operationCount = 0;

  lessonsSnapshot.forEach(doc => {
    if (doc.id.startsWith('lesson_fisica_mc')) {
      currentBatch.delete(doc.ref);
      deletedCount++;
      operationCount++;

      if (operationCount === 450) {
        batchArray.push(currentBatch);
        currentBatch = db.batch();
        operationCount = 0;
      }
    }
  });

  if (operationCount > 0) {
    batchArray.push(currentBatch);
  }

  for (const batch of batchArray) {
    await batch.commit();
  }
  console.log(`✅ Eliminados ${deletedCount} documentos obsoletos.`);

  // 2. Transformación y subida
  console.log('🔄 Procesando y re-subiendo las 50 sesiones...');

  for (let i = 1; i <= 50; i++) {
    const mcNum = String(i).padStart(2, '0');
    const mcFolder = `MC${mcNum}`;
    const folderPath = path.join(mcsDir, mcFolder);

    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️ Carpeta ${mcFolder} no existe. Omitiendo.`);
      continue;
    }

    const files = fs.readdirSync(folderPath);
    const sesionHtmlFile = files.find(f => f.startsWith('sesion') && f.endsWith('.html'));

    if (!sesionHtmlFile) {
      console.warn(`⚠️ No se encontró archivo sesionXX.html en ${mcFolder}`);
      continue;
    }

    const rawHtml = fs.readFileSync(path.join(folderPath, sesionHtmlFile), 'utf8');

    // Extraer título original antes de destruir el HTML
    let title = `Masterclass ${i}`;
    const h1Match = rawHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      title = h1Match[1].replace(/<[^>]+>/g, '').trim();
    }

    let description = `Material de la sesión ${i} preparado para el curso.`;
    const pMatch = rawHtml.match(/<p[^>]*>(.*?)<\/p>/i);
    if (pMatch && pMatch[1]) {
      description = pMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 160) + '...';
    }

    // Extraer body o main (evitar el html y head)
    let bodyContent = rawHtml;
    const mainMatch = rawHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    
    if (mainMatch) {
      bodyContent = mainMatch[0]; // Conservar <main> tag por si tiene clases
    } else if (bodyMatch) {
      bodyContent = bodyMatch[0]; // Conservar <body> tag por si tiene clases
    }

    // Adaptar tema oscuro (reemplazos directos)
    bodyContent = bodyContent
      .replace(/\bbg-white\b/g, 'bg-slate-800')
      .replace(/\bbg-slate-50\b/g, 'bg-slate-900/50')
      .replace(/\btext-slate-900\b/g, 'text-white')
      .replace(/\btext-slate-800\b/g, 'text-slate-200')
      .replace(/\btext-slate-700\b/g, 'text-slate-300')
      .replace(/\btext-slate-600\b/g, 'text-slate-400')
      .replace(/\bborder-slate-200\b/g, 'border-slate-700')
      .replace(/\bbg-indigo-50\b/g, 'bg-indigo-900/30')
      .replace(/\btext-indigo-950\b/g, 'text-indigo-200')
      .replace(/\btext-indigo-900\b/g, 'text-indigo-200')
      .replace(/\btext-indigo-800\b/g, 'text-indigo-300')
      .replace(/\btext-indigo-700\b/g, 'text-indigo-300')
      .replace(/\bbg-indigo-100\b/g, 'bg-indigo-800/40')
      .replace(/\bborder-indigo-100\b/g, 'border-indigo-700');

    // Adaptar rutas de imágenes
    // Busca: src="./imagen.png" o src="imagen.jpg" y lo cambia a /courses/fisica/mcXX/imagen.jpg
    bodyContent = bodyContent.replace(/src=["'](?:\.\/)?([^"']+\.(png|jpg|jpeg|webp))["']/gi, (match, filename) => {
      const baseName = path.parse(filename).name;
      return `src="/courses/fisica/mc${mcNum}/${baseName}.jpg"`;
    });

    // Adaptar rutas de videos si los hubiera
    bodyContent = bodyContent.replace(/src=["'](?:\.\/)?([^"']+\.(mp4|webm))["']/gi, (match, filename) => {
      const cleanName = filename.replace(/\s+/g, '_');
      return `src="/courses/fisica/mc${mcNum}/${cleanName}"`;
    });

    // Adaptar pósters de video
    bodyContent = bodyContent.replace(/poster=["'](?:\.\/)?([^"']+\.(png|jpg|jpeg|webp))["']/gi, (match, filename) => {
      const baseName = path.parse(filename).name;
      return `poster="/courses/fisica/mc${mcNum}/${baseName}.jpg"`;
    });

    // Adaptar matemáticas (de \( \) y \[ \] a $ y $$)
    // Inline math: \( f_x \) -> $ f_x $
    bodyContent = bodyContent.replace(/\\\([\s\S]*?\\\)/g, (match) => {
      return '$' + match.slice(2, -2) + '$';
    });
    
    // Display math: \[ f_x \] -> $$ f_x $$
    bodyContent = bodyContent.replace(/\\\[[\s\S]*?\\\]/g, (match) => {
      return '$$' + match.slice(2, -2) + '$$';
    });

    const lessonId = `lesson_${i}_fisica`;
    const moduleId = getModuleForMC(i);

    const lessonData = {
      id: lessonId,
      courseId: 'fisica',
      moduleId: moduleId,
      title: title,
      description: description,
      content: bodyContent,
      order: i,
      published: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
    console.log(`  [${i}/50] Actualizado y adaptado HTML para: ${title.substring(0, 40)}`);
  }

  console.log('🎉 Todas las lecciones procesadas exitosamente!');
}

run().catch(console.error);
