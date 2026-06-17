import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const newContent = `
<div className="bg-abismo text-white p-6 md:p-10 rounded-3xl shadow-[0_0_20px_#00FFFF] border border-neon-cyan mb-10 relative overflow-hidden">
  <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-cyan/10 blur-[80px] rounded-full pointer-events-none"></div>
  <h2 className="text-neon-cyan font-black text-3xl md:text-5xl uppercase tracking-wider flex items-center gap-4">
    <span className="text-5xl md:text-6xl drop-shadow-[0_0_15px_#00FFFF]">⚡</span> El Cambio es la Única Regla
  </h2>
  <p className="mt-6 text-xl text-slate-200 leading-relaxed font-medium">
    ¡Bienvenidos al Nivel 1! En este universo, todo está en constante movimiento. Tu nivel de energía, la batería de tu celular, los likes en tu última foto... ¡Todo cambia! 
  </p>
  <p className="mt-4 text-xl text-slate-300 leading-relaxed">
    Entender el <strong>Pensamiento Variacional</strong> no se trata de resolver números aburridos, sino de <span className="text-neon-pink font-black drop-shadow-[0_0_5px_#FF007F]">hackear la Matrix</span> para predecir cómo van a evolucionar las cosas a tu alrededor antes de que sucedan.
  </p>
</div>

<div className="my-12 rounded-3xl overflow-hidden border border-neon-purple/50 shadow-[0_0_30px_rgba(138,43,226,0.15)] group relative">
  <div className="absolute inset-0 bg-gradient-to-t from-abismo via-transparent to-transparent z-10"></div>
  <img src="/infographics/variable_vs_constante.png" alt="Constante vs Variable" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
  <div className="absolute bottom-4 left-4 z-20">
    <span className="bg-black/80 backdrop-blur-md text-neon-cyan text-xs font-bold px-3 py-1 rounded-full border border-neon-cyan/50">ARCHIVOS NEURALES RECUPERADOS</span>
  </div>
</div>

<div className="grid md:grid-cols-2 gap-8 my-16">
  <div className="bg-black/40 border-l-4 border-neon-purple p-8 rounded-r-2xl relative overflow-hidden group hover:bg-black/60 transition-all duration-300">
    <div className="absolute top-0 right-0 w-40 h-40 bg-neon-purple/10 blur-3xl group-hover:bg-neon-purple/30 transition-all duration-500"></div>
    <h3 className="text-neon-purple font-black text-3xl mb-3 flex items-center gap-3">
      <span className="text-4xl">💎</span> Constante
    </h3>
    <p className="text-slate-300 text-lg leading-relaxed">
      Una constante es un valor <strong>inmortal e inmutable</strong>. No importa qué pase en el universo, siempre vale lo mismo. 
    </p>
    <div className="mt-6 bg-neon-purple/10 border border-neon-purple/30 p-4 rounded-xl">
      <p className="text-sm text-neon-purple font-bold uppercase tracking-widest mb-1">Ejemplo IRL (In Real Life)</p>
      
El número de horas en un día ($h = 24$) o el costo fijo de tu pasaje de camión.
    </div>
  </div>

  <div className="bg-black/40 border-l-4 border-neon-green p-8 rounded-r-2xl relative overflow-hidden group hover:bg-black/60 transition-all duration-300">
    <div className="absolute top-0 right-0 w-40 h-40 bg-neon-green/10 blur-3xl group-hover:bg-neon-green/30 transition-all duration-500"></div>
    <h3 className="text-neon-green font-black text-3xl mb-3 flex items-center gap-3">
      <span className="text-4xl">🌊</span> Variable
    </h3>
    <p className="text-slate-300 text-lg leading-relaxed">
      Una variable es pura <strong>energía dinámica</strong>. Representa algo que puede cambiar de valor dependiendo de la situación, el entorno o el tiempo.
    </p>
    <div className="mt-6 bg-neon-green/10 border border-neon-green/30 p-4 rounded-xl">
      <p className="text-sm text-neon-green font-bold uppercase tracking-widest mb-1">Ejemplo IRL (In Real Life)</p>
      
El nivel de agua de la presa Zarco o la temperatura de la ciudad a las 3 PM ($T(t)$).
    </div>
  </div>
</div>

<div className="bg-gradient-to-br from-neon-pink/10 to-transparent border border-neon-pink/50 p-10 rounded-3xl my-16 shadow-[0_0_40px_rgba(255,0,127,0.1)] relative">
  <div className="absolute -top-3 -right-3 w-6 h-6 bg-neon-pink rounded-full shadow-[0_0_15px_#FF007F] animate-pulse"></div>
  <h2 className="text-neon-pink font-black text-3xl md:text-4xl mb-6">El Motor del Universo: Las Ecuaciones</h2>
  <p className="text-xl text-slate-200 leading-relaxed mb-8">
    Cuando combinamos variables y constantes, creamos un <strong>modelo matemático</strong>. Un modelo es como el código fuente que dicta cómo se comporta la realidad. Observa esta ecuación renderizada con el poder cuántico de KaTeX:
  </p>
  
  <div className="bg-abismo p-8 rounded-2xl my-8 text-center overflow-x-auto border-2 border-neon-pink/50 shadow-[inset_0_0_20px_rgba(255,0,127,0.1)] text-4xl md:text-5xl text-white drop-shadow-[0_0_8px_#FF007F] flex justify-center">

$$f(x) = m \\cdot x + b$$

  </div>
  
  <ul className="space-y-4 mt-8 text-slate-300 text-lg">
    <li className="flex items-start gap-3">
      <span className="text-neon-green font-black mt-1">▶</span>
      <span><span className="text-neon-green font-bold bg-neon-green/10 px-2 py-0.5 rounded">x</span> es tu <strong>variable de entrada</strong> (ej: los minutos que llevas jugando un videojuego).</span>
    </li>
    <li className="flex items-start gap-3">
      <span className="text-neon-purple font-black mt-1">▶</span>
      <span><span className="text-neon-purple font-bold bg-neon-purple/10 px-2 py-0.5 rounded">m</span> y <span className="text-neon-purple font-bold bg-neon-purple/10 px-2 py-0.5 rounded">b</span> son <strong>constantes</strong> del sistema. Sus valores están fijados.</span>
    </li>
    <li className="flex items-start gap-3">
      <span className="text-neon-cyan font-black mt-1">▶</span>
      <span><span className="text-neon-cyan font-bold bg-neon-cyan/10 px-2 py-0.5 rounded">f(x)</span> es tu <strong>variable de salida</strong> (ej: los puntos totales que has obtenido). Su valor depende totalmente de <span className="text-neon-green">x</span>.</span>
    </li>
  </ul>
</div>

<div className="text-center mt-20 mb-10 relative">
  <div className="inline-block relative">
    <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_#8A2BE2] mb-2 relative z-10">
      Simulador Interactivo
    </h2>
    <div className="absolute -bottom-2 left-0 w-full h-3 bg-neon-purple/30 -skew-x-12 z-0"></div>
  </div>
  <p className="text-slate-300 mt-6 text-xl max-w-2xl mx-auto">
    Juega con este módulo de Geogebra. Observa cómo cambia la gráfica al alterar la variable y cómo hay elementos geométricos que nunca se mueven.
  </p>
</div>

<div className="w-full rounded-3xl overflow-hidden border-4 border-neon-cyan/80 shadow-[0_0_30px_rgba(0,255,255,0.4)] bg-white h-[500px] md:h-[600px] relative group">
  <div className="absolute inset-0 border-4 border-neon-cyan rounded-3xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  <iframe 
    src="https://www.geogebra.org/graphing?embed" 
    width="100%" 
    height="100%" 
    style={{border:0}} 
    allowFullScreen
    className="relative z-0"
  ></iframe>
</div>

<div className="mt-20 p-8 border-t border-dashed border-slate-700 bg-gradient-to-b from-transparent to-neon-green/5 text-center rounded-b-3xl">
  <p className="text-2xl text-slate-300 font-medium">
    ¿Listo para demostrar que has dominado la Matrix? 
  </p>
  <p className="text-xl text-slate-400 mt-2">
    Baja al <span className="text-neon-green font-black drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">Neural Checkpoint</span> y supera el reto.
  </p>
</div>
`;

async function updateSession1() {
  const lessonsRef = db.collection('Lessons');
  const snapshot = await lessonsRef.where('order', '==', 1).get();
  
  if (!snapshot.empty) {
    const lesson = snapshot.docs[0];
    await lesson.ref.update({
      content: newContent
    });
    console.log("Sesión 1 actualizada a Masterclass exitosamente.");
  } else {
    console.log("No se encontró la sesión 1.");
  }
}

updateSession1().catch(console.error);
