/**
 * Migración: Unificar IDs de Pensamiento Variacional
 * lesson_N  →  lesson_N_pv1
 *
 * Pasos:
 * 1. Leer todos los documentos en "Lessons" sin courseId
 * 2. Crear copia con nuevo ID (lesson_N_pv1)
 * 3. Si existe Quiz con lessonId=lesson_N, actualizarlo a lesson_N_pv1
 * 4. Eliminar el documento original
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

const db = admin.firestore();

async function migrate() {
  console.log('=== MIGRANDO IDs DE PENSAMIENTO VARIACIONAL ===\n');

  // 1. Obtener lecciones sin courseId (Pensamiento Variacional)
  const lessonsSnap = await db.collection('Lessons').get();
  const pvLessons = lessonsSnap.docs.filter(doc => {
    const data = doc.data();
    // Sin courseId → Pensamiento Variacional
    return !data.courseId && /^lesson_\d+$/.test(doc.id);
  });

  console.log(`📋 Encontradas ${pvLessons.length} lecciones de Pensamiento Variacional sin sufijo.\n`);

  let migrated = 0;
  let skipped = 0;

  for (const lessonDoc of pvLessons) {
    const oldId = lessonDoc.id;
    const data = lessonDoc.data();

    // Extraer número
    const match = oldId.match(/^lesson_(\d+)$/);
    if (!match) { skipped++; continue; }
    const num = match[1];
    const newId = `lesson_${num}_pv1`;

    // Verificar que no exista ya
    const existing = await db.collection('Lessons').doc(newId).get();
    if (existing.exists) {
      console.log(`⚠️  ${newId} ya existe. Omitiendo ${oldId}.`);
      skipped++;
      continue;
    }

    // Batch: copiar lección con nuevo ID + actualizar quiz + borrar original
    const batch = db.batch();

    // a) Crear nueva lección
    batch.set(db.collection('Lessons').doc(newId), {
      ...data,
      courseId: 'pv1'  // marcar como Pensamiento Variacional
    });

    // b) Eliminar lección vieja
    batch.delete(db.collection('Lessons').doc(oldId));

    await batch.commit();

    // c) Actualizar Quiz si existe (fuera del batch porque es query)
    const quizSnap = await db.collection('Quizzes').where('lessonId', '==', oldId).get();
    if (!quizSnap.empty) {
      for (const qDoc of quizSnap.docs) {
        await qDoc.ref.update({ lessonId: newId });
      }
      console.log(`  ↳ Quiz actualizado: ${oldId} → ${newId}`);
    }

    console.log(`✅ ${oldId} → ${newId}`);
    migrated++;
  }

  console.log(`\n=== MIGRACIÓN COMPLETA ===`);
  console.log(`✅ Migradas: ${migrated}`);
  console.log(`⚠️  Omitidas: ${skipped}`);
  process.exit(0);
}

migrate().catch(e => {
  console.error('Error en migración:', e);
  process.exit(1);
});
