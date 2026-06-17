"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode,
  requireAdmin?: boolean 
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Si no está autenticado, redirigir al login
        router.push("/login");
      } else if (requireAdmin && !isAdmin) {
        // Si la ruta requiere ser admin y no lo es, redirigir al inicio
        router.push("/dashboard");
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null; // Evita destellos de UI mientras redirige
  }

  return <>{children}</>;
}
