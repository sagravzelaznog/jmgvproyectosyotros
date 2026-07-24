const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Configurar entorno local
dotenv.config({ path: '.env.local' });

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function seedAutocadCourse() {
  const courseId = 'autocad';
  
  console.log('\n--- INSERTANDO CURSO DE AUTOCAD ---');
  await db.collection('Courses').doc(courseId).set({
    title: 'AutoCAD Profesional',
    description: 'Aprende a diseñar y modelar piezas mecánicas en 2D utilizando comandos avanzados, coordenadas polares y matrices.',
    price: 0,
    isPublished: true,
    createdAt: new Date().toISOString()
  });
  console.log('✅ Curso insertado correctamente.');
  process.exit(0);
}

seedAutocadCourse().catch(console.error);
