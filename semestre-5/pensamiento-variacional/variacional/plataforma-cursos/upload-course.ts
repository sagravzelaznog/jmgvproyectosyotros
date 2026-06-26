/**
 * Script Preparatorio para subir el curso: Pensamiento Matemático 1
 * 
 * Uso futuro: 
 * 1. Definir los módulos y lecciones en este archivo.
 * 2. Ejecutar: npx tsx upload-course.ts
 * 
 * Esto inyectará el curso en Firebase con la etiqueta courseId="matematico1",
 * asegurando que no se mezcle con Pensamiento Variacional.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
        : undefined,
    }),
  });
}

const db = getFirestore();

// ==== AQUÍ DEFINIRÁS TU CURSO CUANDO ESTÉ LISTO ====
const COURSE_ID = "matematico1";

const modulesData = [
  {
    id: "mod1_matematico",
    title: "Módulo 1: Introducción a la Probabilidad",
    order: 1,
    courseId: COURSE_ID
  }
];

const lessonsData = [
  {
    id: "lesson1_matematico",
    moduleId: "mod1_matematico",
    title: "SESIÓN 1: Conceptos Básicos",
    order: 1,
    content: "# Bienvenidos a Pensamiento Matemático 1\n\nContenido de prueba.",
    courseId: COURSE_ID
  }
];

async function uploadCourse() {
  console.log(`Iniciando subida de curso: ${COURSE_ID}`);
  
  // 1. Subir Módulos
  for (const mod of modulesData) {
    await db.collection("Modules").doc(mod.id).set(mod);
    console.log(`Módulo subido: ${mod.title}`);
  }

  // 2. Subir Lecciones
  for (const lesson of lessonsData) {
    await db.collection("Lessons").doc(lesson.id).set(lesson);
    console.log(`Lección subida: ${lesson.title}`);
  }

  console.log("¡Curso subido exitosamente!");
}

// Descomentar cuando estés listo para subirlo:
// uploadCourse().catch(console.error);
