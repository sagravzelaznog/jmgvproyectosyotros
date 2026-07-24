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
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Elige tu plan de estudio</h2>
            <p className="text-slate-400 text-lg">Acceso a las 50 sesiones intensivas, simuladores de GeoGebra y plataforma interactiva.</p>
          </div>

          {/* Banner Promo 24h */}
          <div className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                <span>🎁</span> Empieza Gratis
              </h3>
              <p className="text-indigo-200">Regístrate hoy y obtén 24 horas de acceso total y gratuito a todos los cursos.</p>
            </div>
            <div className="relative z-10">
              <Link href="/login" className="whitespace-nowrap inline-flex justify-center items-center px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)]">
                Reclamar Prueba de 24h
              </Link>
            </div>
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

      {/* Cursos Section */}
      <section id="temario" className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Un universo de conocimiento a tu alcance</h2>
            <p className="text-slate-400 text-lg">Explora nuestra extensa biblioteca de cursos, que abarca desde los fundamentos de la aritmética hasta el diseño vectorial profesional.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔢", title: "Aritmética y Estadística", desc: "Sienta las bases con probabilidad, lógica y operaciones matemáticas esenciales." },
              { icon: "📐", title: "Geometría y Urbanismo", desc: "Diseño y trazo geométrico aplicado al espacio y la planificación de ciudades." },
              { icon: "📈", title: "Pensamiento Variacional", desc: "El corazón del cálculo: modelos, tasas de cambio, optimización y acumulación." },
              { icon: "⚡", title: "Electrificación y Planimetría", desc: "Proyectos avanzados que unen la matemática con la infraestructura." },
              { icon: "💻", title: "Google Colab", desc: "Aprende a utilizar cuadernos interactivos y programación en Python." },
              { icon: "📗", title: "Excel Intermedio", desc: "Domina herramientas, fórmulas avanzadas, y análisis de datos en hojas de cálculo." },
              { icon: "📊", title: "Probabilidad Avanzada", desc: "Toma de decisiones fundamentada en distribuciones y análisis de datos." },
              { icon: "🎨", title: "Diseño Vectorial", desc: "Herramientas de nivel profesional con Inkscape para desatar tu creatividad." },
              { icon: "⚙️", title: "AutoCAD Profesional", desc: "Diseño y modelado de piezas mecánicas en 2D con nivel industrial." }
            ].map((curso, index) => (
              <div key={index} className="bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="text-4xl mb-4 group-hover:scale-110 transform transition-transform duration-300">
                  {curso.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{curso.title}</h3>
                <p className="text-slate-400 leading-relaxed">{curso.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
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
