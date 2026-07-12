"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isAdmin, hasAccess, expiresAt } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>("pensamiento-variacional-1");

  const getDaysRemaining = () => {
    if (!expiresAt) return null;
    const diffTime = expiresAt.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Cargar Módulos
        const modulesRef = collection(db, "Modules");
        const modSnap = await getDocs(query(modulesRef, orderBy("order", "asc")));
        setModules(modSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        // Cargar Sesiones
        const lessonsRef = collection(db, "Lessons");
        const lesSnap = await getDocs(query(lessonsRef, orderBy("order", "asc")));
        setLessons(lesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error cargando contenido", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mis Cursos</h1>
        <p className="text-slate-400 mt-2">Prepárate para aprender la matemática del cambio y modelar el entorno.</p>
        
        {!isAdmin && hasAccess && daysRemaining !== null && (
          <div className="mt-6 flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <div>
              <p className="text-indigo-300 font-medium text-sm">Suscripción Activa</p>
              <p className="text-white font-bold text-lg">
                Te quedan {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'} de acceso
              </p>
            </div>
            <div className="hidden sm:block text-indigo-400 opacity-50">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-4 inline-flex px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm rounded-md font-medium">
            🛡️ Modo Administrador Activo
          </div>
        )}
      </div>

      <div className="space-y-6">
        {[
          { id: "pensamiento-variacional-1", title: "Pensamiento Variacional (Plataforma S5)", adminOnly: false },
          { id: "pm1", title: "PM1 (Álgebra Base)", adminOnly: false, externalUrl: "/cursos/PM1/index.html", description: "Fundamentos de ecuaciones y el lenguaje del dinero." },
          { id: "pm2", title: "PM2 (Geometría)", adminOnly: false, externalUrl: "/cursos/PM2/index.html", description: "Diseño y trazo geométrico aplicado al urbanismo." },
          { id: "pm3", title: "PM3 (Trazado Urbano)", adminOnly: false, externalUrl: "/cursos/PM3/index.html", description: "Estadística, parábolas y construcción avanzada." },
          { id: "probabilidad", title: "Probabilidad y Estadística", adminOnly: true }
        ]
        .filter(course => !course.adminOnly || isAdmin)
        .map(course => {
          const isExpanded = expandedCourse === course.id;
          
          // Filtrar los módulos de este curso
          const courseModules = modules.filter(m => 
            (course.id === "pensamiento-variacional-1" && !m.courseId) || 
            (m.courseId === course.id)
          );

          if (course.externalUrl) {
            return (
              <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
                <a 
                  href={course.externalUrl}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left group block"
                >
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {course.title}
                      <span className="text-xs bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-full font-medium ml-2">Curso Consolidado</span>
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm ml-9">{course.description}</p>
                  </div>
                  <div className="bg-emerald-500 text-white rounded-full p-2 transform group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </a>
              </div>
            );
          }

          return (
            <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
              {/* Encabezado del Curso (Acordeón) */}
              <button 
                onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors text-left"
              >
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <svg className={`w-6 h-6 ${course.id === 'pensamiento-variacional-1' ? 'text-indigo-500' : 'text-neon-pink'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {course.title}
                  {course.adminOnly && (
                    <span className="text-xs bg-neon-pink/20 text-neon-pink px-2 py-1 rounded-full font-medium ml-2">En Desarrollo</span>
                  )}
                </h2>
                <svg className={`w-6 h-6 text-slate-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Contenido del Curso (Módulos y Sesiones) */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t border-slate-800/50">
                  {loading ? (
                    <div className="animate-pulse space-y-4 mt-6">
                      <div className="h-16 bg-slate-800 rounded-lg"></div>
                      <div className="h-16 bg-slate-800 rounded-lg"></div>
                    </div>
                  ) : courseModules.length > 0 ? (
                    <div className="space-y-6 mt-6">
                      {courseModules.map((mod: any) => {
                        const modLessons = lessons.filter(l => l.moduleId === mod.id);
                        
                        return (
                          <div key={mod.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/20">
                            <div className="bg-slate-800/80 p-4 border-b border-slate-800 flex justify-between items-center">
                              <h3 className="font-bold text-lg text-white">{mod.title}</h3>
                              <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                {modLessons.length} Sesiones
                              </span>
                            </div>
                            
                            <div className="divide-y divide-slate-800">
                              {modLessons.map((lesson: any) => (
                                <Link 
                                  key={lesson.id} 
                                  href={`/dashboard/lesson/${lesson.id}`} 
                                  className="block p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                      {lesson.order}
                                    </div>
                                    <span className="text-slate-300 group-hover:text-indigo-300 transition-colors font-medium">
                                      {lesson.title.replace(`SESIÓN ${lesson.order}:`, '').trim()}
                                    </span>
                                  </div>
                                  <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              ))}
                              {modLessons.length === 0 && (
                                <div className="p-4 text-sm text-slate-500 text-center">No hay sesiones en este módulo.</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50 mt-6">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-slate-300">Aún no hay contenido disponible</h3>
                      <p className="text-slate-500 mt-2">Las sesiones están siendo preparadas y pronto estarán aquí.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
