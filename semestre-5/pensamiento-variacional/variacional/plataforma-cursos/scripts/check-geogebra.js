const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../../../../../../../000 A PREPA/planeaciones especialidades/Proyectos y Otros/semestre-5/pensamiento-variacional/variacional/plataforma-cursos/.env.local') });

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
  const courses = await db.collection('Courses').get();
  console.log('=== CURSOS ===');
  courses.docs.forEach(d => console.log(d.id, '|', d.data().title));

  console.log('\n=== LECCIONES CON GEOGEBRA ===');
  const allLessons = await db.collection('Lessons').get();
  const withGeo = allLessons.docs.filter(d => (d.data().content || '').toLowerCase().includes('geogebra'));
  console.log('Total con GeoGebra:', withGeo.length);
  withGeo.slice(0, 5).forEach(d => {
    const content = d.data().content || '';
    const srcMatch = content.match(/src=["']([^"']*geogebra[^"']*)/i);
    console.log('  ID:', d.id, '| courseId:', d.data().courseId, '| src:', srcMatch ? srcMatch[1].substring(0, 100) : 'no src');
  });
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
