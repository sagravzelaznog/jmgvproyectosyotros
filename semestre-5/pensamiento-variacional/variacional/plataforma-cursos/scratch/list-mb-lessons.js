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

(async () => {
  console.log('Proyecto:', process.env.FIREBASE_PROJECT_ID);
  const course = await db.collection('Courses').doc('matematicas-basicas').get();
  console.log('Curso existe:', course.exists, course.exists ? course.data().title : '');
  const snap = await db.collection('Lessons').where('courseId', '==', 'matematicas-basicas').get();
  const rows = snap.docs.map(d => {
    const x = d.data();
    const m = (x.content || '').match(/src="([^"]+)"/);
    return { id: d.id, module: x.moduleId, order: x.order, published: x.published, title: x.title, src: m ? m[1] : '' };
  }).sort((a, b) => (a.order || 0) - (b.order || 0));
  rows.forEach(r => console.log(JSON.stringify(r)));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
