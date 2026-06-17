import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const TXT_DIR = "c:/Users/admin/Documents/000 A PREPA/planeaciones especialidades/Proyectos y Otros/semestre 5/pensamiento variacional/variacional";
const FILES = [
  "planeacion modulos y sesiones 1y2.txt",
  "s03-10.txt",
  "s11-s20.txt",
  "s21-30.txt",
  "s31-40.txt",
  "s41-50.txt"
];

const MODULE_TITLES = [
  "Bloque 1: De lo Constante a lo Variable (Sesiones 1 - 10)",
  "Bloque 2: Modelando el Entorno (Sesiones 11 - 20)",
  "Bloque 3: El Límite de la Intuición (Sesiones 21 - 30)",
  "Bloque 4: La Tasa Instantánea (Sesiones 31 - 40)",
  "Bloque 5: Optimización y Acumulación (Sesiones 41 - 50)"
];

function parseSession(sessionText: string, moduleId: string, orderOffset: number) {
  const titleMatch = sessionText.match(/SESI[OÓ]N\s+\d+:\s*(.*)/i);
  const title = titleMatch ? titleMatch[0].trim() : `Sesión ${orderOffset}`;
  
  const quizSplitRegex = /Quizz estilo Kahoot|Quizz:|Cuestionario:|Preguntas:/i;
  const parts = sessionText.split(quizSplitRegex);
  
  const contentRaw = parts[0].replace(/SESI[OÓ]N\s+\d+:\s*(.*)/i, "").trim();
  const quizRaw = parts[1] || "";

  const content = contentRaw.replace(/-{10,}/g, "").trim();

  const questions = [];
  const questionBlocks = quizRaw.split(/\n\d+\.\s+/);
  
  for (let i = 1; i < questionBlocks.length; i++) {
    const block = questionBlocks[i];
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) continue;

    const questionText = lines[0];
    const options = [];
    let correctIndex = 0;

    for (let j = 1; j < lines.length; j++) {
      const line = lines[j];
      if (line.startsWith('-') || line.startsWith('*')) {
        let optText = line.substring(1).trim();
        optText = optText.replace(/\(Texto Ne[óo]n .*?\)/i, "").trim();
        
        if (optText.includes("(CORRECTA)") || optText.includes("(correcta)")) {
          correctIndex = options.length;
          optText = optText.replace(/\(CORRECTA\)/i, "").trim();
        }
        
        options.push(optText);
      }
    }

    if (options.length > 0) {
      questions.push({
        question: questionText,
        options: options,
        answer: correctIndex,
        color: ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"][i % 4]
      });
    }
  }

  return {
    lesson: {
      moduleId,
      title,
      order: orderOffset,
      content
    },
    quizQuestions: questions
  };
}

async function deleteCollection(collectionPath: string) {
  const snapshot = await adminDb.collection(collectionPath).get();
  const batch = adminDb.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  if (snapshot.size > 0) {
    await batch.commit();
  }
}

export async function GET(request: Request) {
  try {
    const courseId = 'pensamiento-variacional-1';
    let log = [];

    // 1. Limpiar base de datos anterior
    log.push("Limpiando colecciones anteriores...");
    await deleteCollection('Modules');
    await deleteCollection('Lessons');
    await deleteCollection('Quizzes');

    // 2. Crear los 5 Bloques Oficiales
    log.push("Creando 5 módulos oficiales...");
    for (let i = 0; i < 5; i++) {
      const modId = `mod-${i + 1}`;
      await adminDb.collection('Modules').doc(modId).set({
        courseId,
        title: MODULE_TITLES[i],
        order: i + 1,
        createdAt: new Date().toISOString()
      });
    }

    // 3. Extraer todas las sesiones secuencialmente de los archivos
    let globalLessonOrder = 1;
    
    for (const fileName of FILES) {
      const filePath = path.join(TXT_DIR, fileName);
      if (!fs.existsSync(filePath)) {
        log.push("Archivo no encontrado: " + fileName);
        continue;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Separamos por SESIÓN (Ignorando la estructura de BLOQUES que estaba rota)
      const sessionParts = fileContent.split(/SESI[OÓ]N\s+\d+:/i);
      
      // El índice 0 es texto antes de la primera sesión, lo ignoramos.
      for (let s = 1; s < sessionParts.length; s++) {
        // Calcular a qué módulo pertenece esta sesión (1 a 10 = mod-1, 11 a 20 = mod-2, etc.)
        // Math.floor((1 - 1) / 10) + 1 = 1
        // Math.floor((11 - 1) / 10) + 1 = 2
        const moduleNumber = Math.floor((globalLessonOrder - 1) / 10) + 1;
        const modId = `mod-${moduleNumber}`;

        const rawSessionText = "SESIÓN " + globalLessonOrder + ":" + sessionParts[s];
        const parsed = parseSession(rawSessionText, modId, globalLessonOrder);
        
        const lessonRef = await adminDb.collection('Lessons').add(parsed.lesson);
        
        if (parsed.quizQuestions.length > 0) {
          await adminDb.collection('Quizzes').add({
            lessonId: lessonRef.id,
            questions: parsed.quizQuestions,
            createdAt: new Date().toISOString()
          });
        }
        
        globalLessonOrder++;
      }
      
      log.push(`Procesado ${fileName} (Sesiones extraídas hasta la #${globalLessonOrder - 1})`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos reorganizada a 5 bloques de 10 sesiones.',
      log
    });
  } catch (error: any) {
    console.error('Error masivo en Seed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
