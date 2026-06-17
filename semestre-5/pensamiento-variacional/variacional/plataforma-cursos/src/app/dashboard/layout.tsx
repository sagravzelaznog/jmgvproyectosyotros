"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {/* Simple Dashboard Navbar */}
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="font-bold text-xl text-indigo-400">Variacional.io</div>
              <div className="flex gap-4 items-center">
                {isAdmin && (
                  <Link href="/dashboard/admin" className="text-sm font-bold text-neon-pink border border-neon-pink/50 bg-neon-pink/10 px-3 py-1 rounded hover:bg-neon-pink hover:text-white transition-all">
                    Panel Admin
                  </Link>
                )}
                <span className="text-sm text-slate-400">Área de Estudiantes</span>
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
