const fs = require('fs');
const path = require('path');

const inputDir = 'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\Autocad';
const outputJSON = path.join(__dirname, 'autocad_firebase_data.json');

const modules = [
    { id: "mod_autocad_1", courseId: "autocad", order: 1, title: "Bloque 1: Fundamentos (Ejercicios 1 - 10)" },
    { id: "mod_autocad_2", courseId: "autocad", order: 2, title: "Bloque 2: Geometría Intermedia (Ejercicios 11 - 20)" },
    { id: "mod_autocad_3", courseId: "autocad", order: 3, title: "Bloque 3: Construcciones Complejas (Ejercicios 21 - 30)" },
    { id: "mod_autocad_4", courseId: "autocad", order: 4, title: "Bloque 4: Dominio Avanzado (Ejercicios 31 - 40)" }
];

const lessons = [];

function getModuleId(num) {
    if (num <= 10) return "mod_autocad_1";
    if (num <= 20) return "mod_autocad_2";
    if (num <= 30) return "mod_autocad_3";
    return "mod_autocad_4";
}

for (let i = 1; i <= 40; i++) {
    const file = path.join(inputDir, `ejercicio_${i}.json`);
    
    if (!fs.existsSync(file)) {
        console.log(`File missing: ${file}`);
        continue;
    }
    
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);
    
    // Construct Markdown Content using Masterclass styling
    
    const configuracionItems = data.configuracion_entorno.map(item => {
        return `<div class="bg-[#14161c] border-l-[3px] border-neon-purple/70 pl-4 py-3 text-gray-300 font-sans shadow-sm hover:bg-[#1a1c23] hover:border-neon-purple transition-colors rounded-r-md">${item}</div>`;
    }).join('\n');
    
    const fasesItems = data.fases_dibujo.map(fase => {
        const commands = fase.comandos_clave ? fase.comandos_clave.join(' | ') : '';
        return `<div class="bg-gradient-to-r from-[#101217] to-black border border-gray-800/80 rounded-xl p-4 flex gap-4 items-center shadow-lg hover:border-neon-cyan/60 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-all transform hover:-translate-y-0.5">
<div class="flex-shrink-0 bg-[#1a2530] text-neon-cyan font-black w-10 h-10 rounded-full flex items-center justify-center border border-neon-cyan/40 shadow-[0_0_10px_rgba(0,255,255,0.2)]">${fase.orden}</div>
<div class="text-gray-300 font-sans text-base flex-1"><strong class="text-white font-black tracking-wide">${fase.nombre_fase}:</strong> ${fase.instruccion_visual}
${commands ? `<br/><span class="text-neon-pink text-sm font-mono mt-2 block">🖥️ ${commands}</span>` : ''}
</div>
</div>`;
    }).join('\n');

    let markdownContent = `
<div class="mb-8 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
    <img src="/autocad/ejercicio_${i}.png" alt="Plano del Ejercicio ${i}" class="w-full object-contain bg-white" />
</div>

<h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-6 uppercase tracking-wide">🎯 Objetivo de la Práctica</h2>

<p><strong class="text-white font-black tracking-wide">Misión:</strong> ${data.objetivo_aprendizaje}</p>

<p><strong class="text-white font-black tracking-wide">Configuración del Entorno Recomendada:</strong></p>
<div class="flex flex-col gap-2 my-4">
${configuracionItems}
</div>

<h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-6 uppercase tracking-wide">🎙️ Guía Rápida</h2>

<p>${data.guion_sintesis_voz}</p>

<h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-6 uppercase tracking-wide">⚙️ Fases de Dibujo</h2>

<div class="flex flex-col gap-3 my-5">
${fasesItems}
</div>
`;

    // Limpiar lineas extra vacias
    markdownContent = markdownContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

    lessons.push({
        id: `lesson_${i}_autocad`,
        courseId: "autocad",
        moduleId: getModuleId(i),
        order: i,
        title: data.titulo,
        content: markdownContent
    });
}

const finalData = {
    modules,
    lessons
};

fs.writeFileSync(outputJSON, JSON.stringify(finalData, null, 2));
console.log(`Successfully processed 40 Autocad exercises. Data saved to ${outputJSON}`);
