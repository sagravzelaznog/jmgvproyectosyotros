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

async function removeStaticQuizzes() {
  console.log('--- REMOVIENDO QUIZZES ESTÁTICOS DE HTML ---');
  
  const lessonsSnapshot = await db.collection('Lessons').where('courseId', '==', 'fisica').get();
  let updatedCount = 0;

  for (const doc of lessonsSnapshot.docs) {
    const data = doc.data();
    let content = data.content || '';
    
    // Remove the comment block if it exists
    content = content.replace(/<!--\s*───\s*SECCIÓN\s*\d+:\s*QUIZ\s*INTERACTIVO[\s\S]*?-->/gi, '');
    
    // Remove the section with id="quiz"
    const originalLength = content.length;
    content = content.replace(/<section\s+id=["']quiz["'][\s\S]*?<\/section>/gi, '');
    
    if (content.length !== originalLength) {
      await db.collection('Lessons').doc(doc.id).update({ content });
      console.log(`✅ Removed static quiz from: ${doc.id}`);
      updatedCount++;
    }
  }

  console.log(`\n--- FINALIZADO. ${updatedCount} LECCIONES ACTUALIZADAS ---`);
  process.exit(0);
}

removeStaticQuizzes().catch(console.error);
