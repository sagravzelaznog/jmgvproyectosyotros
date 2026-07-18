import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(request: Request) {
  try {
    const courseId = 'tuto-colab';
    let log = [];

    // Lee el archivo json
    const jsonPath = path.join(process.cwd(), 'scratch', 'colab_firebase_data.json');
    if (!fs.existsSync(jsonPath)) {
        return NextResponse.json({ error: "Archivo JSON no encontrado" }, { status: 404 });
    }
    
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);

    // 1. Curso
    log.push("Creando curso tuto-colab...");
    await adminDb.collection('Courses').doc(courseId).set({
      title: 'Google Colab (Mini-Curso)',
      description: 'Aprende a utilizar cuadernos interactivos, desde Markdown básico hasta Programación Orientada a Objetos en Python.',
      price: 0,
      isPublished: true,
      createdAt: new Date().toISOString()
    });

    // 2. Modulo unico
    const modId = 'mod_colab_1';
    log.push("Creando modulo principal...");
    await adminDb.collection('Modules').doc(modId).set({
      courseId: courseId,
      title: 'Introducción y Prácticas de Google Colab',
      order: 1,
      createdAt: new Date().toISOString()
    });

    // 3. Lessons
    log.push("Insertando lecciones...");
    for (const lesson of data.lessons) {
        const lessonRef = adminDb.collection('Lessons').doc(lesson.id);
        await lessonRef.set({
            moduleId: lesson.moduleId,
            title: lesson.title,
            order: lesson.order,
            content: lesson.content,
            courseId: lesson.courseId
        });
        log.push(`Lección insertada: ${lesson.title}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos de Colab importada con éxito.',
      log
    });
  } catch (error: any) {
    console.error('Error insertando Colab en DB:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
