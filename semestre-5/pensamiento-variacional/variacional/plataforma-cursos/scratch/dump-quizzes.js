const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

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

async function dump() {
  const snapshot = await db.collection('Quizzes').where('courseId', '==', 'fisica').get();
  let toProcess = [];
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const lessonId = data.lessonId;
    const match = lessonId.match(/lesson_(\d+)_fisica/);
    if (!match) continue;
    
    const num = parseInt(match[1], 10);
    if (num >= 11 && num <= 50) {
      toProcess.push({
        id: doc.id,
        lessonId: lessonId,
        questions: data.questions
      });
    }
  }
  
  // Sort by lesson num for easy processing
  toProcess.sort((a,b) => {
    return parseInt(a.lessonId.match(/\d+/)[0]) - parseInt(b.lessonId.match(/\d+/)[0]);
  });
  
  fs.writeFileSync('scratch/quizzes_to_fix.json', JSON.stringify(toProcess, null, 2));
  console.log(`Saved ${toProcess.length} quizzes to scratch/quizzes_to_fix.json`);
  process.exit(0);
}

dump().catch(console.error);
