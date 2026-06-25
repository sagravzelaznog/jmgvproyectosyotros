"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {/* Simple Dashboard Navbar */}
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/dashboard" className="font-bold text-xl text-indigo-400">Variacional.io</Link>
              <div className="flex gap-4 items-center">
                {isAdmin && (
                  <Link href="/dashboard/admin" className="text-sm font-bold text-neon-pink border border-neon-pink/50 bg-neon-pink/10 px-3 py-1 rounded hover:bg-neon-pink hover:text-white transition-all">
                    Panel Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:block">
                  Cursos
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-red-400 hover:bg-slate-800/80 transition-colors ml-2"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
