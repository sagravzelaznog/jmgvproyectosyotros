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

admin.firestore().collection('Lessons').doc('lesson_2_autocad').get().then(doc => {
  const data = doc.data();
  console.log(data.content.includes("Recorta"));
}).catch(console.error).finally(() => process.exit(0));
