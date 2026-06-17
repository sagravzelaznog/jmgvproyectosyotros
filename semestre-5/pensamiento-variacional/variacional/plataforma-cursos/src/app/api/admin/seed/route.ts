import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function GET(request: Request) {
  try {
    const courseId = 'pensamiento-variacional-1';
    
    // 1. Curso
    await adminDb.collection('Courses').doc(courseId).set({
      title: 'Pensamiento Variacional I',
      description: 'De lo constante a lo variable. Un viaje interactivo diseñado para entender la matemática del cambio, modelar tu entorno y dominar el cálculo.',
      price: 99.00,
      isPublished: true,
      createdAt: new Date().toISOString()
    });

    // 2. Módulo 1
    const mod1Id = 'bloque-1';
    await adminDb.collection('Modules').doc(mod1Id).set({
      courseId: courseId,
      title: 'BLOQUE 1: De lo Constante a lo Variable',
      order: 1,
      createdAt: new Date().toISOString()
    });

    // 3. Lección 1
    const lesson1Id = 'sesion-01';
    await adminDb.collection('Lessons').doc(lesson1Id).set({
      moduleId: mod1Id,
      title: 'SESIÓN 01: El Cambio está en Todas Partes',
      order: 1,
      content: `## Introducción a la Variación
El alumno identificará magnitudes constantes y variables en su entorno, comprendiendo que el cambio es la regla natural del universo y la base del pensamiento variacional.

### Conceptos Clave
* **Variable**: Símbolo constituyente de un algoritmo que puede adquirir distintos valores. En tu vida: La temperatura en Torreón a lo largo del mes de mayo.
* **Constante**: Valor fijo que no se modifica dentro de un modelo. En tu vida: El costo de un pasaje de camión "Ruta Norte".`,
      quiz: [
        {
          question: "¿Qué es una variable matemática?",
          options: ["Un valor que cambia siempre.", "Un número que jamás cambia.", "Una regla para no equivocarse.", "Una forma de sumar fracciones."],
          answer: 0,
          color: "bg-pink-500"
        },
        {
          question: "Ejemplo de una constante en tu día:",
          options: ["El nivel de carga del celular.", "La cantidad de horas del día.", "El hambre que sientes a diario.", "Los mensajes en el WhatsApp."],
          answer: 1,
          color: "bg-green-500"
        }
      ]
    });

    // 4. Lección 2
    const lesson2Id = 'sesion-02';
    await adminDb.collection('Lessons').doc(lesson2Id).set({
      moduleId: mod1Id,
      title: 'SESIÓN 02: Relaciones de Dependencia',
      order: 2,
      content: `## ¿Quién manda a quién?
El alumno comprenderá los conceptos de variable independiente y variable dependiente, modelando relaciones causales de su entorno.

### Definiciones Prácticas
* **Variable Independiente (x)**: La "causa". Lo que tú puedes controlar o el tiempo que avanza sin que nadie lo detenga.
* **Variable Dependiente (y)**: El "efecto". Lo que resulta o reacciona a partir de lo que pasó primero.
* *Ejemplo local*: El consumo de energía eléctrica en casa (Dependiente) respecto a las horas que se enciende la refrigeración en julio (Independiente).`,
      quiz: [
        {
          question: "La variable independiente se puede definir como:",
          options: ["La causa de algo que sucederá.", "El resultado final del problema.", "Un número que jamás cambiará.", "El error de cálculo en la hoja."],
          answer: 0,
          color: "bg-blue-500"
        },
        {
          question: "En la relación 'Horas de estudio' y 'Calificación', la calificación es:",
          options: ["La causa inicial del proceso.", "La variable dependiente aquí.", "Un valor constante sin cambio.", "Una variable independiente."],
          answer: 1,
          color: "bg-yellow-500"
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Semilla plantada: Curso 1, Módulo 1 y Sesiones 1 y 2 creadas en Firebase.' 
    });
  } catch (error: any) {
    console.error('Error insertando seed en DB:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
