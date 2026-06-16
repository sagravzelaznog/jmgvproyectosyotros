"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const modulesRef = collection(db, "Modules");
        const q = query(modulesRef, orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        
        const fetchedModules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setModules(fetchedModules);
      } catch (error) {
        console.error("Error cargando módulos", error);
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
        {isAdmin && (
          <div className="mt-4 inline-flex px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm rounded-md font-medium">
            🛡️ Modo Administrador Activo
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6 text-white">Pensamiento Variacional I</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-800 rounded-lg"></div>
            <div className="h-12 bg-slate-800 rounded-lg"></div>
            <div className="h-12 bg-slate-800 rounded-lg"></div>
          </div>
        ) : modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((mod: any) => (
              <div key={mod.id} className="border border-slate-700 rounded-lg p-5 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg text-slate-200 group-hover:text-white transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Haz clic para ver las sesiones</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50">
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
    </div>
  );
}
