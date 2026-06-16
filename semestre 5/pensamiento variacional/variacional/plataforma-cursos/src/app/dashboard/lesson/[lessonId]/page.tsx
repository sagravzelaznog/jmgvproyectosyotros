"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useParams, useRouter } from "next/navigation";

export default function LessonPage() {
  const { lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchLessonAndQuiz = async () => {
      try {
        if (!lessonId) return;
        
        // 1. Cargar la Lección
        const lessonRef = doc(db, "Lessons", lessonId as string);
        const snapshot = await getDoc(lessonRef);
        if (snapshot.exists()) {
          setLesson({ id: snapshot.id, ...snapshot.data() });
        }

        // 2. Cargar el Quiz Independiente
        const quizzesRef = collection(db, "Quizzes");
        const q = query(quizzesRef, where("lessonId", "==", lessonId));
        const quizSnapshot = await getDocs(q);
        
        if (!quizSnapshot.empty) {
          // Asumimos un documento de Quiz por lección
          const quizDoc = quizSnapshot.docs[0].data();
          setQuiz(quizDoc.questions || []);
        }
      } catch (error) {
        console.error("Error loading lesson", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonAndQuiz();
  }, [lessonId]);

  const handleAnswer = (optionIndex: number, correctIndex: number) => {
    if (optionIndex === correctIndex) {
      setScore(score + 1);
    }
    
    if (quiz.length > 0 && currentQuiz + 1 < quiz.length) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-12">Cargando sesión...</div>;
  }

  if (!lesson) {
    return <div className="text-white text-center py-12">Sesión no encontrada.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Botón Volver */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
      >
        <span>&larr;</span> Volver al Dashboard
      </button>

      {/* Encabezado */}
      <div>
        <div className="text-indigo-400 font-bold tracking-widest text-sm mb-2 uppercase">
          Sesión Actual
        </div>
        <h1 className="text-4xl font-extrabold text-white">{lesson.title}</h1>
      </div>

      {/* Contenido Teórico */}
      <div className="prose prose-invert prose-indigo max-w-none bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }} />
      </div>

      {/* Mini-Quiz Interactivo Estilo Kahoot */}
      {quiz && quiz.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            🧠 Refuerzo Rápido
          </h2>
          
          {!quizFinished ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 text-center bg-slate-800 border-b border-slate-700">
                <span className="text-slate-400 text-sm font-semibold tracking-wider">
                  PREGUNTA {currentQuiz + 1} DE {quiz.length}
                </span>
                <h3 className="text-2xl font-bold text-white mt-4">
                  {quiz[currentQuiz].question}
                </h3>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quiz[currentQuiz].options.map((opt: string, index: number) => {
                  const colors = [
                    "bg-rose-500 hover:bg-rose-600 shadow-[0_4px_0_rgb(159,18,57)]",
                    "bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_rgb(30,58,138)]",
                    "bg-amber-500 hover:bg-amber-600 shadow-[0_4px_0_rgb(146,64,14)]",
                    "bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_0_rgb(6,78,59)]"
                  ];
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index, quiz[currentQuiz].answer)}
                      className={`${colors[index % 4]} text-white font-bold p-6 rounded-xl transition-all flex items-center justify-center text-center h-full min-h-[120px] text-lg`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)]">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold mb-2">¡Misión Cumplida!</h3>
              <p className="text-indigo-200 text-lg">
                Acertaste {score} de {quiz.length} preguntas.
              </p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="mt-8 bg-white text-indigo-900 font-bold py-3 px-8 rounded-full hover:bg-indigo-50 transition-colors"
              >
                Volver a mis cursos
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
