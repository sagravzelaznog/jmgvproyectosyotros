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

  const getDaysRemaining = () => {
    if (!expiresAt) return null;
    const diffTime = expiresAt.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  const [activeCourse, setActiveCourse] = useState<string | null>(null);

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

  const toggleCourse = (courseId: string) => {
    if (activeCourse === courseId) {
      setActiveCourse(null);
    } else {
      setActiveCourse(courseId);
    }
  };

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

      {/* Curso 1: Pensamiento Variacional I */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl mb-6 overflow-hidden transition-all duration-300">
        <button 
          onClick={() => toggleCourse('variacional')}
          className="w-full flex justify-between items-center p-6 bg-slate-900 hover:bg-slate-800/80 transition-colors text-left focus:outline-none"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Pensamiento Variacional I
          </h2>
          <svg className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 ${activeCourse === 'variacional' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {activeCourse === 'variacional' && (
          <div className="px-6 pb-6 border-t border-slate-800/50 pt-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-slate-800 rounded-lg"></div>
                <div className="h-16 bg-slate-800 rounded-lg"></div>
              </div>
            ) : modules.filter(m => m.courseId === 'variacional').length > 0 ? (
              <div className="space-y-6">
                {modules.filter(m => m.courseId === 'variacional').map((mod: any) => {
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
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50">
                <p className="text-slate-500">No hay contenido de este curso disponible.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Curso 2: Propiedades Matemáticas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        <button 
          onClick={() => toggleCourse('propiedades')}
          className="w-full flex justify-between items-center p-6 bg-slate-900 hover:bg-slate-800/80 transition-colors text-left focus:outline-none"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-neon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            Propiedades Matemáticas
          </h2>
          <svg className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 ${activeCourse === 'propiedades' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {activeCourse === 'propiedades' && (
          <div className="px-6 pb-6 border-t border-slate-800/50 pt-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-slate-800 rounded-lg"></div>
                <div className="h-16 bg-slate-800 rounded-lg"></div>
              </div>
            ) : modules.filter(m => m.courseId === 'propiedades').length > 0 ? (
              <div className="space-y-6">
                {modules.filter(m => m.courseId === 'propiedades').map((mod: any) => {
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
                              <div className="w-8 h-8 rounded-full bg-neon-pink/10 text-neon-pink flex items-center justify-center font-bold text-sm">
                                {lesson.order}
                              </div>
                              <span className="text-slate-300 group-hover:text-neon-pink transition-colors font-medium">
                                {lesson.title.replace(`SESIÓN ${lesson.order}:`, '').trim()}
                              </span>
                            </div>
                            <svg className="w-5 h-5 text-slate-600 group-hover:text-neon-pink transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50">
                <p className="text-slate-500">No hay contenido de este curso disponible.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
