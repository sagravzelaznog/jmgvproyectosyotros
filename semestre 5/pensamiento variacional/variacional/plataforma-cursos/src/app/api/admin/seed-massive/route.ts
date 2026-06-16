import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Definimos la ruta donde se encuentran tus archivos .txt localmente
const TXT_DIR = "c:/Users/admin/Documents/000 A PREPA/planeaciones especialidades/Proyectos y Otros/semestre 5/pensamiento variacional/variacional";
const FILES = [
  "planeacion modulos y sesiones 1y2.txt",
  "s03-10.txt",
  "s11-s20.txt",
  "s21-30.txt",
  "s31-40.txt",
  "s41-50.txt"
];

function parseSession(sessionText: string, moduleId: string, orderOffset: number) {
  const titleMatch = sessionText.match(/SESI[OÓ]N\s+\d+:\s*(.*)/i);
  const title = titleMatch ? titleMatch[0].trim() : "Sesión " + orderOffset;
  
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

export async function GET(request: Request) {
  try {
    const courseId = 'pensamiento-variacional-1';
    
    await adminDb.collection('Courses').doc(courseId).set({
      title: 'Pensamiento Variacional I',
      description: 'Curso completo interactivo (Sesiones 1 a 50)',
      price: 99.00,
      isPublished: true,
      createdAt: new Date().toISOString()
    });

    let globalLessonOrder = 1;
    let globalModuleOrder = 1;
    let log = [];

    for (const fileName of FILES) {
      const filePath = path.join(TXT_DIR, fileName);
      if (!fs.existsSync(filePath)) {
        log.push("Archivo no encontrado: " + fileName);
        continue;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      const moduleParts = fileContent.split(/BLOQUE\s+\d+:/i);
      
      if (moduleParts.length > 1) {
        for (let m = 1; m < moduleParts.length; m++) {
          const modText = moduleParts[m];
          const modTitleMatch = modText.match(/(.*)/);
          const modTitle = modTitleMatch ? "Bloque " + globalModuleOrder + ": " + modTitleMatch[1].trim() : "Bloque " + globalModuleOrder;
          
          const modId = "mod-" + globalModuleOrder;
          await adminDb.collection('Modules').doc(modId).set({
            courseId,
            title: modTitle,
            order: globalModuleOrder,
            createdAt: new Date().toISOString()
          });

          const sessionParts = modText.split(/SESI[OÓ]N\s+\d+:/i);
          for (let s = 1; s < sessionParts.length; s++) {
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
          globalModuleOrder++;
        }
      } else {
        const modId = "mod-" + globalModuleOrder;
        await adminDb.collection('Modules').doc(modId).set({
          courseId,
          title: "Módulo " + globalModuleOrder,
          order: globalModuleOrder,
          createdAt: new Date().toISOString()
        });

        const sessionParts = fileContent.split(/SESI[OÓ]N\s+\d+:/i);
        for (let s = 1; s < sessionParts.length; s++) {
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
        globalModuleOrder++;
      }
      
      log.push("Procesado " + fileName);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos poblada masivamente y Quizzes independizados.',
      log
    });
  } catch (error: any) {
    console.error('Error masivo en Seed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
