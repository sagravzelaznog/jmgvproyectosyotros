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
  console.log('🚀 Iniciando resubida de Análisis Físicos usando archivos sesionXX.html...');

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

    // Extraer título
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

    const lessonId = `lesson_${i}_fisica`;
    const moduleId = getModuleForMC(i);

    const lessonData = {
      id: lessonId,
      courseId: 'fisica',
      moduleId: moduleId,
      title: title,
      description: description,
      content: rawHtml,
      order: i,
      published: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('Lessons').doc(lessonId).set(lessonData, { merge: true });
    console.log(`✅ Lección ${i} publicada con archivo: ${sesionHtmlFile}`);
  }

  console.log('🎉 Terminado!');
}

seed().catch(console.error);
