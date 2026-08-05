"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const COURSE_INFO: Record<string, { title: string, adminOnly: boolean }> = {
  "pm1": { title: "PM1 (Aritmético)", adminOnly: false },
  "pm2": { title: "PM2 (Geometría)", adminOnly: false },
  "pm3": { title: "PM3 (Trazado Urbano)", adminOnly: false },
  "pm4": { title: "PM4 (Variacional)", adminOnly: false },
  "pensamiento-variacional-1": { title: "Pensamiento Variacional (Plataforma S5)", adminOnly: false },
  "tuto-colab": { title: "Google Colab (Mini-Curso)", adminOnly: false },
  "excel-intermedio": { title: "Excel Intermedio", adminOnly: false },
  "probabilidad": { title: "Probabilidad y Estadística", adminOnly: false },
  "inkscape": { title: "Diseño Vectorial (Inkscape)", adminOnly: false },
  "autocad": { title: "AutoCAD Profesional", adminOnly: false },
  "fisica": { title: "Análisis Físicos", adminOnly: false },
  "archicad": { title: "Archicad 27: MEP y Modelado", adminOnly: false }
};

export default function CoursePage() {
  const { isAdmin, hasAccess, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const courseId = params.courseId as string;
  const courseInfo = COURSE_INFO[courseId];

  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si el usuario no es admin y no tiene acceso, no cargamos los datos
    if (!authLoading && !isAdmin && !hasAccess) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        // Cargar Módulos (en Firebase, los módulos de PM1 a PM4 tienen courseId = pmX)
        // pensamiento-variacional-1 podría no tener courseId, por lo que cargamos todos y filtramos en cliente
        const modulesRef = collection(db, "Modules");
        const modSnap = await getDocs(query(modulesRef, orderBy("order", "asc")));
        const allModules = modSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        
        const courseModules = allModules.filter(m => 
          m.courseId === courseId || (courseId === "pensamiento-variacional-1" && !m.courseId)
        );
        setModules(courseModules);
        
        // Cargar Sesiones (solo las de los módulos de este curso)
        const lessonsRef = collection(db, "Lessons");
        const lesSnap = await getDocs(query(lessonsRef, orderBy("order", "asc")));
        const allLessons = lesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        
        const courseModuleIds = courseModules.map(m => m.id);
        const courseLessons = allLessons.filter(l => courseModuleIds.includes(l.moduleId));
        
        setLessons(courseLessons);
      } catch (error) {
        console.error("Error cargando contenido del curso", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && (!authLoading)) {
      fetchContent();
    }
  }, [courseId, isAdmin, hasAccess, authLoading]);

  // Si la ruta no existe
  if (!courseInfo && !loading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Curso no encontrado</h2>
        <button onClick={() => router.push("/dashboard")} className="text-indigo-400 hover:text-indigo-300">
          Volver a Mis Cursos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Botón de retroceso */}
      <button 
        onClick={() => router.push("/dashboard")}
        className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium mb-6 group"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver a Mis Cursos
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950/30 border-b border-slate-800 flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
            <svg className={`w-8 h-8 ${courseId?.startsWith('pm') ? 'text-neon-pink' : 'text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{courseInfo?.title}</h1>
            <p className="text-slate-400 mt-1">Explora los módulos y masterclasses de este curso.</p>
          </div>
        </div>

        {/* Verificación de Acceso / Expiración */}
        {(!authLoading && !isAdmin && !hasAccess) ? (
          <div className="p-10 text-center bg-slate-900/80">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⏱️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Acceso Expirado</h2>
            <p className="text-slate-300 max-w-md mx-auto text-lg leading-relaxed">
              Tu tiempo de prueba llegó a su fin. No dejes a medias tus proyectos: suscríbete al plan de tu preferencia y sigue aprovechando todas nuestras herramientas.
            </p>
            <button className="mt-8 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all">
              Ver Planes de Suscripción
            </button>
          </div>
        ) : (
          <div className="p-8">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-slate-800 rounded-lg"></div>
                <div className="h-16 bg-slate-800 rounded-lg"></div>
                <div className="h-16 bg-slate-800 rounded-lg"></div>
              </div>
            ) : modules.length > 0 ? (
              <div className="space-y-6">
                {modules.map((mod: any) => {
                  const modLessons = lessons.filter(l => l.moduleId === mod.id);
                  
                  return (
                    <div key={mod.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/20">
                      <div className="bg-slate-800/80 p-5 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-xl text-white">{mod.title}</h3>
                        <span className="text-xs font-medium bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full">
                          {modLessons.length} Sesiones
                        </span>
                      </div>
                      
                      <div className="divide-y divide-slate-800">
                        {modLessons.map((lesson: any) => (
                          <Link 
                            key={lesson.id} 
                            href={`/dashboard/lesson/${lesson.id}`} 
                            className="block p-5 hover:bg-slate-800/50 transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                                {lesson.order}
                              </div>
                              <span className="text-slate-300 group-hover:text-white transition-colors font-medium text-lg">
                                {lesson.title.replace(`SESIÓN ${lesson.order}:`, '').trim()}
                              </span>
                            </div>
                            <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                        {modLessons.length === 0 && (
                          <div className="p-6 text-sm text-slate-500 text-center">No hay sesiones en este módulo todavía.</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-300">Aún no hay contenido disponible</h3>
                <p className="text-slate-500 mt-2">Las sesiones están siendo preparadas y pronto estarán aquí.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
