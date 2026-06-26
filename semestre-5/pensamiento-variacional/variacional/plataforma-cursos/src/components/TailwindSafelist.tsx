// Este archivo existe únicamente para que el compilador JIT de Tailwind
// detecte las clases que inyectamos dinámicamente en Firebase
// y las incluya en el CSS final de producción.

export const TailwindSafelist = () => {
  return (
    <div className="hidden">
      {/* Alertas [!IMPORTANT] */}
      <div className="bg-[#12131A] border-neon-pink p-6 rounded-2xl shadow-[0_0_20px_rgba(255,0,127,0.2)] my-8"></div>
      <div className="text-neon-pink font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2"></div>
      <div className="text-slate-200 text-lg leading-relaxed"></div>
      
      {/* Alertas [!TIP] */}
      <div className="bg-neon-cyan/5 border-l-4 border-neon-cyan p-6 rounded-r-2xl shadow-[0_0_15px_rgba(0,255,255,0.1)] my-6"></div>
      <div className="text-neon-cyan font-bold uppercase mb-2 flex items-center gap-2"></div>
      <div className="text-white italic"></div>
      
      {/* Alertas [!NOTE] y Cajas de Concepto */}
      <div className="bg-gradient-to-r from-[#1a1c23] to-black border-2 border-neon-purple rounded-xl shadow-[0_0_25px_rgba(138,43,226,0.3)] my-6 transform hover:scale-[1.02] transition-transform"></div>
      <div className="text-neon-purple font-black uppercase mb-3"></div>
      <div className="text-white text-lg"></div>

      {/* Cajas 3D */}
      <div className="bg-[#1a1c23] border-2 border-[#2a2d39] border-b-[6px] border-r-[6px] p-6 rounded-2xl my-6 transform transition-all hover:-translate-y-2 hover:border-neon-cyan/50 hover:shadow-[0_15px_30px_rgba(0,255,255,0.15)] group"></div>
      <div className="text-xl font-black text-neon-cyan mb-3 uppercase tracking-wider group-hover:text-white transition-colors"></div>
      <div className="text-slate-300 text-lg leading-relaxed"></div>
      
      {/* Fix extra 3D borders for purple concepts */}
      <div className="border-b-[8px] border-r-[8px] shadow-[0_10px_30px_rgba(138,43,226,0.2)]"></div>

      {/* Títulos y Subtítulos */}
      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-6 uppercase tracking-wide"></h3>
    </div>
  );
};
