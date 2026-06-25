"use client";

import Link from "next/link";
import PayPalButton from "@/components/payment/PayPalButton";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* Navbar Minimalista */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Variacional.io
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors py-2 px-4">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Elementos decorativos (Glows) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Inscripciones Abiertas - Generación 2026
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Domina el <br/>
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Pensamiento Variacional
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              De lo constante a lo variable. Un viaje interactivo diseñado para entender la matemática del cambio, modelar tu entorno y dominar el cálculo desde cero.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#comprar" className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
                Empezar a Aprender
              </Link>
              <Link href="#temario" className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all">
                Ver Temario
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="comprar" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Elige tu plan de estudio</h2>
            <p className="text-slate-400 text-lg">Acceso a las 50 sesiones intensivas, simuladores de GeoGebra y plataforma interactiva.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
      </section>

      {/* Temario Section */}
      <section id="temario" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Un plan de estudio estructurado</h2>
            <p className="text-slate-400">Desde los conceptos más intuitivos hasta la optimización y acumulación del cálculo avanzado.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "De lo Constante a lo Variable", desc: "Transición del pensamiento aritmético al variacional." },
              { num: "02", title: "Modelando el Entorno", desc: "Funciones reales, tabulación y graficación de comportamientos." },
              { num: "03", title: "El Límite de la Intuición", desc: "Aproximación sucesiva, noción de límite y asíntotas." },
              { num: "04", title: "La Tasa Instantánea", desc: "De la recta secante a la tangente. Derivada intuitiva." },
              { num: "05", title: "Optimización y Acumulación", desc: "Máximos y mínimos. Introducción intuitiva a la integral." }
            ].map((bloque) => (
              <div key={bloque.num} className="bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                <div className="text-4xl font-bold text-slate-800 mb-4 group-hover:text-indigo-900 transition-colors">
                  {bloque.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{bloque.title}</h3>
                <p className="text-slate-400">{bloque.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; 2026 JMGVptel. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
