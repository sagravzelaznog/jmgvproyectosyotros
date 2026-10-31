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

async function exportProgress() {
  console.log("Fetching Lessons...");
  const lessonsSnapshot = await db.collection('Lessons').get();
  const lessonToCourseMap = {};
  lessonsSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.courseId) {
      lessonToCourseMap[doc.id] = data.courseId;
    }
  });

  console.log("Fetching Users...");
  const usersSnapshot = await db.collection('Users').get();
  
  const csvData = [];
  csvData.push(["User ID", "Name", "Email", "Role", "Course ID", "Lessons Completed", "Total Score"].join(","));

  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    const uid = userDoc.id;
    const name = (userData.displayName || userData.name || '').replace(/,/g, '');
    const email = (userData.email || '').replace(/,/g, '');
    const role = userData.role || 'user';

    const progressSnapshot = await db.collection('Users').doc(uid).collection('progress').get();
    
    // Aggregate by course
    const courseStats = {};

    progressSnapshot.forEach(progDoc => {
      const lessonId = progDoc.id;
      const progData = progDoc.data();
      const courseId = lessonToCourseMap[lessonId] || 'unknown_course';

      if (!courseStats[courseId]) {
        courseStats[courseId] = { completed: 0, score: 0 };
      }

      courseStats[courseId].completed += 1;
      courseStats[courseId].score += (progData.score || 0);
    });

    if (Object.keys(courseStats).length === 0) {
      // User has no progress
      csvData.push([uid, name, email, role, "N/A", 0, 0].join(","));
    } else {
      for (const [courseId, stats] of Object.entries(courseStats)) {
        csvData.push([uid, name, email, role, courseId, stats.completed, stats.score].join(","));
      }
    }
  }

  const outputPath = path.join(__dirname, '..', '..', '..', 'usuarios_avance.csv');
  fs.writeFileSync(outputPath, csvData.join("\n"), 'utf-8');
  console.log(`Exported successfully to: ${outputPath}`);
  process.exit(0);
}

exportProgress().catch(err => {
  console.error("Error exporting progress:", err);
  process.exit(1);
});
