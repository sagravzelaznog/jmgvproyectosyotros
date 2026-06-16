import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function GET(request: Request) {
  try {
    const mods = await adminDb.collection('Modules').get();
    const lessons = await adminDb.collection('Lessons').get();
    const quizzes = await adminDb.collection('Quizzes').get();
    
    return NextResponse.json({ 
      modules: mods.size,
      lessons: lessons.size,
      quizzes: quizzes.size,
      sampleLesson: lessons.docs[0]?.data()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
