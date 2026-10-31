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

async function checkFisica() {
  const lessonsRef = db.collection('Lessons');
  const quizzesRef = db.collection('Quizzes');

  const l1 = await lessonsRef.where('courseId', '==', 'fisica').get();
  console.log('Total fisica lessons:', l1.size);
  l1.docs.slice(0, 5).forEach(d => console.log('Lesson ID:', d.id));

  const q1 = await quizzesRef.where('courseId', '==', 'fisica').get();
  console.log('\nTotal fisica quizzes:', q1.size);
  q1.docs.slice(0, 5).forEach(d => console.log('Quiz ID:', d.id, '-> lessonId:', d.data().lessonId));
}

checkFisica().catch(console.error);
