"use client";

import { useEffect, useState, useRef } from "react";
import { doc, getDoc, collection, query, where, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css"; // Importar CSS de KaTeX
import rehypeInlineMath from "@/lib/rehype-inline-math";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LessonPage() {
  const { lessonId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceQueue = useRef<SpeechSynthesisUtterance[]>([]);

  // Hook para detener TTS si el usuario sale de la página o recarga
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Hook para la barra de progreso
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleAnswer = async (optionIndex: number, correctIndex: number) => {
    let finalScore = score;
    if (optionIndex === correctIndex) {
      finalScore = score + 1;
      setScore(finalScore);
    }
    
    if (quiz.length > 0 && currentQuiz + 1 < quiz.length) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      setQuizFinished(true);
      // Guardar record en Firebase si hay usuario autenticado
      if (user && lessonId) {
        try {
          const progressRef = doc(db, "Users", user.uid, "progress", lessonId as string);
          await setDoc(progressRef, {
            score: finalScore,
            total: quiz.length,
            completedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error saving quiz progress:", error);
        }
      }
    }
  };

  const playTTS = (text: string, startFromPhrase?: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Tu navegador no soporta lectura en voz alta.");
      return;
    }

    // Cancelar cualquier cosa trabada en la cola
    window.speechSynthesis.cancel();
    utteranceQueue.current = [];
    
    // Limpiar HTML y Markdown avanzado
    let cleanText = text
      // 1. Describir la gráfica de Geogebra
      .replace(/<iframe[^>]*geogebra[^>]*>[\\s\\S]*?<\/iframe>/gi, " A continuación se muestra un simulador interactivo de Geogebra en tu pantalla para experimentar con la gráfica. ")
      // Reemplazos matemáticos básicos para que suene mejor
      .replace(/\\cdot/g, " por ")
      .replace(/\\Delta/g, " Delta ")
      // 2. Eliminar imágenes de Markdown
      .replace(/!\[.*?\]\(.*?\)/g, " ")
      // 3. Convertir links de Markdown a texto plano
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // 4. Eliminar todas las etiquetas HTML restantes
      .replace(/<[^>]+>/g, " ")
      // 5. Eliminar símbolos especiales que rompen el motor de voz de Chrome
      .replace(/[*_#$\\|{}[\]^`~]/g, " ")
      // 6. Colapsar múltiples espacios
      .replace(/\s+/g, " ")
      .trim();

    if (startFromPhrase) {
      const cleanSearchPhrase = startFromPhrase
        .replace(/[*_#$\\|{}[\]^`~]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      
      // Buscar los primeros 40 caracteres del bloque para ubicarlo en el texto completo
      const searchSnippet = cleanSearchPhrase.substring(0, 40);
      const index = cleanText.indexOf(searchSnippet);
      
      if (index !== -1) {
         cleanText = cleanText.substring(index);
      } else {
         // Si no lo encuentra exacto por alguna razón, lee solo el bloque que tocó
         cleanText = cleanSearchPhrase;
      }
    }
    
    // Trocear el texto por puntos para evitar el bug de límite de longitud de Chrome
    const chunks = cleanText.split(/(?<=[.!?])\s+/);
    
    const validChunks = chunks.filter((c: string) => c.trim().length > 0);
    
    if (validChunks.length === 0) return;

    validChunks.forEach((chunk: string, index: number) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = 'es-MX';
      utterance.rate = 1.2; // Velocidad de lectura confortable
      
      if (index === validChunks.length - 1) {
        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          utteranceQueue.current = [];
        };
      }
      
      utterance.onerror = (e) => {
        console.error("Speech Synthesis Error en fragmento:", chunk, e);
        if (index === validChunks.length - 1) {
          setIsSpeaking(false);
          setIsPaused(false);
          utteranceQueue.current = [];
        }
      };
      
      utteranceQueue.current.push(utterance);
      window.speechSynthesis.speak(utterance);
    });
    
    setIsSpeaking(true);
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-abismo">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-neon-cyan border-opacity-50"></div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-white text-center py-12 bg-abismo min-h-screen">Sesión no encontrada.</div>;
  }

  return (
    <div className="bg-abismo min-h-screen font-sans selection:bg-neon-pink/30 selection:text-white">
      {/* Barra de progreso interactiva (Sticky Neon Bar) */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-900 z-50">
        <div 
          className="h-full bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple shadow-[0_0_15px_#FF007F]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 pb-32">
        {/* Navegación Superior */}
        <div className="flex justify-between items-center w-full">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-neon-cyan hover:text-white hover:drop-shadow-[0_0_8px_#00FFFF] transition-all flex items-center gap-2 font-bold tracking-wide"
          >
            <span className="text-xl">&larr;</span> ESCAPE TO DASHBOARD
          </button>
          
          {lesson?.order < 64 && (
            <button 
              onClick={() => {
                const match = (lessonId as string).match(/lesson_(\d+)_(.+)/);
                if (match) {
                  const nextNumber = parseInt(match[1], 10) + 1;
                  const courseId = match[2];
                  router.push(`/dashboard/lesson/lesson_${nextNumber}_${courseId}`);
                }
              }}
              className="text-neon-pink hover:text-white hover:drop-shadow-[0_0_8px_#FF007F] transition-all flex items-center gap-2 font-bold tracking-wide text-sm md:text-base"
            >
              SIGUIENTE LECCIÓN <span className="text-xl">&rarr;</span>
            </button>
          )}
        </div>

        {/* Encabezado Principal */}
        <header className="border-b border-neon-purple/30 pb-8 relative">
          <div className="inline-block px-4 py-1 bg-neon-purple/10 border border-neon-purple/50 text-neon-purple font-black tracking-widest text-sm mb-4 rounded-full shadow-[0_0_10px_rgba(138,43,226,0.3)]">
            SESIÓN {lesson.order}
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm leading-tight mb-6">
            {lesson.title.replace(/^SESI[OÓ]N\s+\d+:\s*/i, "")}
          </h1>
              {/* Controles de Lectura en Voz Alta (TTS) */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => {
                if (!window.speechSynthesis) return alert("Tu navegador no soporta lectura en voz alta.");
                
                if (isSpeaking) {
                  if (isPaused) {
                    window.speechSynthesis.resume();
                    setIsPaused(false);
                  } else {
                    window.speechSynthesis.pause();
                    setIsPaused(true);
                  }
                } else {
                  playTTS(lesson.content);
                }
              }}
              className="bg-black/50 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.2)]"
            >
              {!isSpeaking ? "▶️ Escuchar Lección completa" : (isPaused ? "▶️ Reanudar" : "⏸️ Pausar")}
            </button>
            
            {isSpeaking && (
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  utteranceQueue.current = [];
                  setIsSpeaking(false);
                  setIsPaused(false);
                }}
                className="bg-black/50 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white transition-all px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(255,0,127,0.2)]"
              >
                ⏹️ Detener
              </button>
            )}
          </div>
        </header>

        <div className="text-center bg-neon-cyan/5 border border-neon-cyan/20 p-3 rounded-xl mb-4 shadow-[0_0_10px_rgba(0,255,255,0.05)]">
           <p className="text-neon-cyan text-sm tracking-wide font-semibold">💡 Tip: Haz clic en cualquier párrafo, lista o título para que la IA lea solo esa sección.</p>
        </div>

        {/* Contenido Teórico (Masterclass Renderizado con Markdown + HTML) */}
        <article 
          onClick={(e) => {
            const target = e.target as HTMLElement;
            // Buscar el bloque de texto más cercano al que le dieron click
            const block = target.closest('p, li, h1, h2, h3, h4, blockquote');
            if (block && block.textContent) {
              // Leer el documento COMPLETO empezando desde el bloque seleccionado
              playTTS(lesson.content, block.textContent);
            }
          }}
          className="prose prose-invert max-w-none 
            prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-neon-cyan prose-headings:to-neon-purple 
            prose-p:text-slate-300 prose-p:text-lg prose-p:leading-relaxed prose-p:tracking-wide
            prose-strong:text-white prose-strong:font-black prose-strong:tracking-wider
            prose-li:text-slate-300 prose-li:text-lg prose-li:marker:text-neon-pink
            prose-ul:border-l-2 prose-ul:border-slate-800 prose-ul:pl-4
            prose-a:text-neon-cyan hover:prose-a:text-neon-pink prose-a:transition-colors
            prose-code:text-neon-pink prose-code:bg-neon-pink/10 prose-code:px-1 prose-code:rounded
            prose-blockquote:border-l-4 prose-blockquote:border-neon-cyan prose-blockquote:bg-neon-cyan/5 prose-blockquote:not-italic prose-blockquote:p-4 prose-blockquote:rounded-r-xl"
        >
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeRaw, rehypeInlineMath, rehypeKatex]}
          >
            {lesson.content.replace(/^[ \t]+/gm, '')}
          </ReactMarkdown>
        </article>

        {/* Mini-Quiz Interactivo Estilo Cyberpunk */}
        {quiz && quiz.length > 0 && (
          <div className="mt-20 border-t border-neon-green/30 pt-16">
            <h2 className="text-3xl font-black text-neon-green mb-8 flex items-center gap-3 drop-shadow-[0_0_8px_rgba(57,255,20,0.4)] uppercase tracking-wide">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Neural Checkpoint
            </h2>
            
            {!quizFinished ? (
              <div className="bg-[#12131A] border-2 border-neon-green/50 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.15)]">
                <div className="p-8 text-center bg-black/40 border-b border-neon-green/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 bg-neon-green transition-all duration-500 shadow-[0_0_10px_#39FF14]" style={{ width: `${(currentQuiz / quiz.length) * 100}%` }}></div>
                  <span className="text-neon-green text-xs font-black tracking-[0.2em] uppercase bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/30">
                    PREGUNTA {currentQuiz + 1} // {quiz.length}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-6 leading-relaxed">
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeRaw, rehypeInlineMath, rehypeKatex]}
                      components={{ p: 'span' }}
                    >
                      {quiz[currentQuiz].question}
                    </ReactMarkdown>
                  </h3>
                </div>
                
                <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1c23] to-[#0B0C10]">
                  {quiz[currentQuiz].options.map((opt: string, index: number) => {
                    const colors = [
                      "bg-black text-neon-pink border-neon-pink hover:bg-neon-pink hover:text-white shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:shadow-[0_0_25px_rgba(255,0,127,0.8)]",
                      "bg-black text-neon-cyan border-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]",
                      "bg-black text-[#FFD700] border-[#FFD700] hover:bg-[#FFD700] hover:text-black shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.8)]",
                      "bg-black text-neon-green border-neon-green hover:bg-neon-green hover:text-black shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)]"
                    ];
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index, quiz[currentQuiz].answer)}
                        className={`border-2 font-bold p-6 rounded-xl transition-all duration-300 flex items-center justify-center text-center min-h-[100px] text-lg md:text-xl transform hover:-translate-y-1 ${colors[index % 4]}`}
                      >
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeRaw, rehypeInlineMath, rehypeKatex]}
                          components={{ p: 'span' }}
                        >
                          {opt}
                        </ReactMarkdown>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-[#12131A] border-2 border-neon-cyan rounded-3xl p-12 text-center text-white shadow-[0_0_50px_rgba(0,255,255,0.3)] relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/20 blur-[100px] rounded-full"></div>
                <div className="text-7xl mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">🚀</div>
                <h3 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
                  SISTEMA SUPERADO
                </h3>
                <p className="text-slate-300 text-xl font-medium mb-8">
                  Precisión: <span className="text-neon-green font-black">{Math.round((score / quiz.length) * 100)}%</span> ({score}/{quiz.length})
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-transparent border border-neon-cyan text-neon-cyan font-black py-4 px-8 rounded-full hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_30px_#00FFFF] transition-all duration-300 transform hover:scale-105"
                  >
                    VOLVER AL HUB
                  </button>
                  {lesson?.order < 64 && (
                    <button 
                      onClick={() => {
                        const match = (lessonId as string).match(/lesson_(\d+)_(.+)/);
                        if (match) {
                          const nextNumber = parseInt(match[1], 10) + 1;
                          const courseId = match[2];
                          router.push(`/dashboard/lesson/lesson_${nextNumber}_${courseId}`);
                        }
                      }}
                      className="bg-neon-cyan text-black font-black py-4 px-10 rounded-full hover:bg-white hover:shadow-[0_0_30px_#00FFFF] transition-all duration-300 transform hover:scale-105"
                    >
                      SIGUIENTE LECCIÓN &rarr;
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-800/50">
        <p className="text-slate-500 text-xs tracking-widest uppercase">
          &copy; JMGV-PTEL 2026 SESIÓN {lesson.order}. TODOS LOS DERECHOS RESERVADOS.
        </p>
      </footer>
    </div>
  );
}
