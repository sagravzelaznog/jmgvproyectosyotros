"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

export default function DashboardPage() {
  const { isAdmin, hasAccess, expiresAt } = useAuth();

  const getRemainingTime = () => {
    if (!expiresAt) return null;
    const diffTime = expiresAt.getTime() - new Date().getTime();
    if (diffTime <= 0) return { expired: true };
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { expired: false, days: diffDays, hours: diffHours };
  };

  const remaining = getRemainingTime();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Mis Cursos</h1>
        <p className="text-slate-400 mt-2">Prepárate para aprender la matemática del cambio y modelar el entorno.</p>
        
        {!isAdmin && hasAccess && remaining && !remaining.expired && (
          <div className="mt-6 flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <div>
              <p className="text-indigo-300 font-medium text-sm">Prueba Gratuita Activa</p>
              <p className="text-white font-bold text-lg">
                Te quedan {(remaining.days ?? 0) > 0 
                  ? `${remaining.days} ${remaining.days === 1 ? 'día' : 'días'} y ${remaining.hours} hrs` 
                  : `${remaining.hours} horas`} de acceso libre
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {([
          { id: "pm1", title: "PM1 (Aritmético)", adminOnly: false, description: "Domina los fundamentos de los números y las operaciones matemáticas. ¡Da el primer paso hacia el pensamiento lógico y descubre el poder de la aritmética!" },
          { id: "pm2", title: "PM2 (Geometría)", adminOnly: false, description: "Explora las propiedades del espacio, las formas y las proporciones. ¡Aprende a diseñar y trazar con precisión geométrica en el mundo real!" },
          { id: "pm3", title: "PM3 (Trazado Urbano)", adminOnly: false, description: "Aplica la matemática en la planificación y estructuración de espacios. ¡Diseña ciudades inteligentes y descubre la geometría detrás del urbanismo!" },
          { id: "pm4", title: "PM4 (Variacional)", adminOnly: false, description: "Analiza el cambio continuo, la acumulación y el modelado del entorno. ¡Prepárate para entender la matemática en movimiento y dominar el cálculo!" },
          { id: "tuto-colab", title: "Google Colab (Mini-Curso)", adminOnly: false, description: "Aprende a utilizar cuadernos interactivos, desde Markdown básico hasta Programación Orientada a Objetos en Python." },
          { id: "pensamiento-variacional-1", title: "Pensamiento Variacional (Plataforma S5)", adminOnly: false, description: "De lo constante a lo variable. ¡Explora el curso original paso a paso y desata todo tu potencial analítico!" },
          { id: "excel-intermedio", title: "Excel Intermedio", adminOnly: false, description: "Domina Excel desde los fundamentos hasta funciones avanzadas. Limpia datos, crea fórmulas y analiza información con eficacia." },
          { id: "probabilidad", title: "Probabilidad y Estadística", adminOnly: false, description: "Aprende a analizar datos, predecir tendencias y tomar decisiones informadas. ¡Domina la incertidumbre y dale sentido a la información!" },
          { id: "inkscape", title: "Diseño Vectorial (Inkscape)", adminOnly: false, description: "Crea gráficos, ilustraciones y trazados escalables con precisión. ¡Desata tu creatividad y domina las herramientas del diseño digital profesional!" },
          { id: "autocad", title: "AutoCAD Profesional", adminOnly: false, description: "Aprende a diseñar y modelar piezas mecánicas en 2D utilizando comandos avanzados, coordenadas polares y matrices." },
          { id: "fisica", title: "Análisis Físicos (Física)", adminOnly: false, description: "Curso intensivo de física (estática, dinámica, rotación, elasticidad, mecánica de fluidos e hidrodinámica) orientado al diseño y construcción de un prototipo mecánico." },
          { id: "archicad", title: "Archicad 27: MEP y Modelado", adminOnly: false, description: "Curso intensivo de modelado de instalaciones MEP y flujo de trabajo BIM con Archicad 27." },
          { id: "campesino-tycoon", title: "Campesino Tycoon (Juego)", adminOnly: false, description: "¡Gestiona tu propia granja, invierte sabiamente y haz crecer tu imperio agrícola en este divertido juego inactivo!", url: "/games/campesino-tycoon/index.html" }
        ] as Array<{ id: string; title: string; adminOnly: boolean; description: string; url?: string }>)
        .filter(course => !course.adminOnly || isAdmin)
        .map(course => (
          <Link 
            href={course.url ? course.url : `/dashboard/course/${course.id}`} 
            key={course.id} 
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-indigo-500/50 transition-all group flex flex-col h-full"
            target={course.url ? "_blank" : undefined}
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <svg className={`w-6 h-6 ${course.id.startsWith('pm') ? 'text-neon-pink' : 'text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {course.url ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  )}
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
              <p className="text-slate-400 text-sm flex-1">{course.description}</p>
              
              <div className="mt-6 flex items-center text-indigo-400 text-sm font-semibold group-hover:text-indigo-300">
                {course.url ? 'Jugar Ahora' : 'Ver Módulos'}
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
