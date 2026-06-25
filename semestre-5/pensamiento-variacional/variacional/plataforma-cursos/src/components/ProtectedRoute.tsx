"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode,
  requireAdmin?: boolean 
}) {
  const { user, loading, isAdmin, hasAccess, expiresAt } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Si no está autenticado, redirigir al login
        router.push("/login");
      } else if (requireAdmin && !isAdmin) {
        // Si la ruta requiere ser admin y no lo es, redirigir al inicio
        router.push("/dashboard");
      } else if (!isAdmin && pathname !== "/dashboard/paywall") {
        // Revisar caducidad si no es admin
        const isExpired = expiresAt ? expiresAt < new Date() : false;
        if (!hasAccess || isExpired) {
          router.push("/dashboard/paywall");
        }
      }
    }
  }, [user, loading, isAdmin, hasAccess, expiresAt, requireAdmin, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Evita destellos de UI mientras redirige
  if (!user || (requireAdmin && !isAdmin)) {
    return null; 
  }

  // Bloqueo visual si está en proceso de redirección al paywall
  if (!isAdmin && pathname !== "/dashboard/paywall") {
    const isExpired = expiresAt ? expiresAt < new Date() : false;
    if (!hasAccess || isExpired) {
      return null;
    }
  }

  return <>{children}</>;
}
