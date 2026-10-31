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

async function fixQuizLinking() {
  console.log('--- REPARANDO ENLACES DE QUIZZES DE FISICA ---');
  
  // Find all quizzes for course "fisica"
  const quizzesSnapshot = await db.collection('Quizzes').where('courseId', '==', 'fisica').get();
  
  for (const doc of quizzesSnapshot.docs) {
    const data = doc.data();
    const oldLessonId = data.lessonId; // e.g. "lesson_fisica_mc01"
    
    // Parse the number from oldLessonId
    const match = oldLessonId.match(/mc(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10); // "01" -> 1
      const newLessonId = `lesson_${num}_fisica`;
      
      // Update the lessonId in the Quiz document
      await db.collection('Quizzes').doc(doc.id).update({
        lessonId: newLessonId
      });
      console.log(`✅ Updated quiz ${doc.id}: ${oldLessonId} -> ${newLessonId}`);
    } else {
      console.log(`⚠️ Could not parse number from ${oldLessonId}`);
    }
  }

  console.log('--- ENLACES REPARADOS ---');
  process.exit(0);
}

fixQuizLinking().catch(console.error);
