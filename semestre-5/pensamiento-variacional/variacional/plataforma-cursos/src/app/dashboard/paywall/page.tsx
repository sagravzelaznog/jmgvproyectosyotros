"use client";

import PayPalButton from "@/components/payment/PayPalButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaywallPage() {
  const { hasAccess, expiresAt, loading } = useAuth();
  const router = useRouter();

  // Si el usuario ya pagó y tiene acceso válido, devolverlo al dashboard
  useEffect(() => {
    if (!loading && hasAccess) {
      if (!expiresAt || expiresAt > new Date()) {
        router.push("/dashboard");
      }
    }
  }, [hasAccess, expiresAt, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-12">
      <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-4">Acceso Expirado o Restringido</h1>
      <p className="text-slate-400 max-w-xl text-lg mb-12">
        Parece que tu suscripción ha terminado o aún no has adquirido un plan. 
        Elige uno de los planes a continuación para desbloquear o renovar tu acceso a las 50 sesiones de Pensamiento Variacional.
      </p>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        {/* Semanal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-xl">
          <h3 className="text-xl font-bold text-slate-300 mb-2">Acceso Semanal</h3>
          <div className="text-4xl font-black text-white mb-6">$20 <span className="text-lg text-slate-500 font-medium">MXN</span></div>
          <p className="text-slate-400 text-center mb-8 text-sm">Ideal para un repaso rápido antes de tus exámenes.</p>
          <div className="w-full mt-auto">
            <PayPalButton price="20.00" plan="Acceso Semanal" />
          </div>
        </div>

        {/* Mensual */}
        <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 flex flex-col items-center shadow-[0_0_30px_rgba(79,70,229,0.15)] relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            Más Popular
          </div>
          <h3 className="text-xl font-bold text-indigo-400 mb-2">Acceso Mensual</h3>
          <div className="text-5xl font-black text-white mb-6">$30 <span className="text-lg text-slate-500 font-medium">MXN</span></div>
          <p className="text-slate-400 text-center mb-8 text-sm">El ritmo perfecto para dominar el cálculo paso a paso.</p>
          <div className="w-full mt-auto">
            <PayPalButton price="30.00" plan="Acceso Mensual" />
          </div>
        </div>

        {/* Anual */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-xl">
          <h3 className="text-xl font-bold text-slate-300 mb-2">Acceso Anual</h3>
          <div className="text-4xl font-black text-white mb-6">$99 <span className="text-lg text-slate-500 font-medium">MXN</span></div>
          <p className="text-slate-400 text-center mb-8 text-sm">50 sesiones intensivas y soporte continuo todo el ciclo.</p>
          <div className="w-full mt-auto">
            <PayPalButton price="99.00" plan="Acceso Anual" />
          </div>
        </div>
      </div>
    </div>
  );
}
