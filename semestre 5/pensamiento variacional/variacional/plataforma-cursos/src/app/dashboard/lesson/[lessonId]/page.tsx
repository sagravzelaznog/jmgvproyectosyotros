"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useParams, useRouter } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Image from "next/image";
import { ArrowLeft, Target, Trophy, PlayCircle } from "lucide-react";

export default function LessonPage() {
  const { lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Barra de progreso neón (Scroll)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-white text-center py-12">Sesión no encontrada.</div>;
  }

  // Pre-procesamiento ligero para que el texto plano se vea como párrafos en Markdown
  let formattedContent = lesson.content;
  if (!formattedContent.includes('\n\n')) {
    formattedContent = formattedContent.replace(/\n/g, '\n\n');
  }
  // Convertimos funciones comunes a formato matemático de KaTeX automáticamente (Heurística visual)
  formattedContent = formattedContent.replace(/f\(x\)/g, '$f(x)$');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 relative selection:bg-emerald-500/30 font-sans pb-32">
      {/* Barra de Progreso Neón */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 origin-left z-50 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
        style={{ scaleX }}
      />

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Encabezado Masterclass */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-emerald-400 hover:text-amber-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Temario
          </button>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.15)] leading-tight">
            {lesson.title}
          </h1>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
        </motion.div>

        {/* Infografía Neón (Renderizada automáticamente en la primera sesión o dinámicamente) */}
        {lesson.order === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_0_50px_rgba(52,211,153,0.15)] group"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
             <Image 
               src="/images/hero_session_1.png" 
               alt="Conceptos de Cálculo Neón" 
               width={1200} 
               height={600} 
               className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
                <span className="bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold border border-amber-500/50 backdrop-blur-md shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  Módulo 1
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-500/50 backdrop-blur-md shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                  Introducción
                </span>
             </div>
          </motion.div>
        )}

        {/* Contenido Teórico Renderizado con Markdown y KaTeX */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-amber-400 prose-headings:font-bold
            prose-h2:text-3xl prose-h3:text-2xl
            prose-strong:text-emerald-300 prose-strong:font-bold
            prose-a:text-emerald-400 prose-a:underline-offset-4 hover:prose-a:text-amber-400
            prose-blockquote:border-l-amber-500 prose-blockquote:bg-slate-900/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-amber-200
            bg-slate-900/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl"
        >
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {formattedContent}
          </ReactMarkdown>
        </motion.div>

        {/* Laboratorio GeoGebra Integrado (Especialmente relevante para Variacional) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/80 border-2 border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(52,211,153,0.05)] backdrop-blur-xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
           <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 mb-4 flex items-center gap-3">
             <Target className="w-8 h-8 text-emerald-400" /> Laboratorio GeoGebra
           </h3>
           <p className="text-slate-400 mb-8 text-lg font-medium">Experimenta en tiempo real. Mueve los puntos y cambia las variables para visualizar el comportamiento de la función.</p>
           
           <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-white">
             {/* Integración directa de la calculadora gráfica de GeoGebra */}
             <iframe 
               src="https://www.geogebra.org/graphing?embed" 
               width="100%" 
               height="100%" 
               allowFullScreen 
               style={{ border: 0 }} 
             />
           </div>
        </motion.div>

        {/* Cuestionario Masterclass Neón */}
        {quiz && quiz.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-amber-400 mb-8 flex items-center gap-3">
              <PlayCircle className="w-8 h-8" /> Desafío de Conocimiento
            </h2>
            
            {!quizFinished ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Decoración luminosa */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-emerald-400"></div>

                <div className="p-8 text-center bg-slate-900/80 border-b border-slate-800">
                  <div className="inline-block bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-emerald-400 text-sm font-bold tracking-widest uppercase">
                      Pregunta {currentQuiz + 1} de {quiz.length}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                    {quiz[currentQuiz].question}
                  </h3>
                </div>
                
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/50">
                  {quiz[currentQuiz].options.map((opt: string, index: number) => {
                    const colors = [
                      "from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] border-emerald-400/30 text-emerald-50",
                      "from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] border-amber-400/30 text-amber-50",
                      "from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-400/30 text-blue-50",
                      "from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] border-purple-400/30 text-purple-50"
                    ];
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index, quiz[currentQuiz].answer)}
                        className={`bg-gradient-to-br ${colors[index % 4]} font-bold p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex items-center justify-center text-center h-full min-h-[140px] text-lg md:text-xl border`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 rounded-3xl p-12 text-center text-white border border-emerald-500/50 shadow-[0_0_50px_rgba(52,211,153,0.2)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-amber-500/10"></div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                      <Trophy className="w-12 h-12 text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 mb-4">
                    ¡Misión Cumplida!
                  </h3>
                  <p className="text-slate-300 text-xl mb-8 font-medium">
                    Acertaste <span className="text-emerald-400 font-bold text-3xl mx-2">{score}</span> de {quiz.length} preguntas.
                  </p>
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold py-4 px-10 rounded-full hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:scale-105 transition-all duration-300 text-lg"
                  >
                    Regresar al Temario
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
