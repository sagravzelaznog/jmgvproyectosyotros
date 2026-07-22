const fs = require('fs');
const path = require('path');

const inputDir = 'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Informatica Programacion y Tecnologia\\informaticas\\informatica 3\\excel intermedio';
const outputJSON = path.join(__dirname, 'excel_firebase_data.json');

const headingStyle = `class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mt-10 mb-6 uppercase tracking-wide"`;
const strongStyle = `class="text-white font-black tracking-wide"`;
const highlightContainerStart = `\n<div class="bg-gradient-to-br from-amber-900/30 to-yellow-900/10 border border-amber-500/50 rounded-xl p-6 my-6 shadow-[0_0_15px_rgba(245,158,11,0.15)] relative overflow-hidden">
<div class="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>\n`;
const highlightContainerEnd = `\n</div>\n`;

function convertHtmlToMarkdown(html) {
    let md = html;
    
    // Convert strong tags
    md = md.replace(/<strong>(.*?)<\/strong>/gs, `<strong ${strongStyle}>$1</strong>`);
    md = md.replace(/<b>(.*?)<\/b>/gs, `<strong ${strongStyle}>$1</strong>`);
    
    // Catch specific headings to highlight
    let inHighlight = false;
    md = md.replace(/<h3>(.*?)<\/h3>([\s\S]*?)(?=<h3>|<\/div>|$)/gi, (match, title, content) => {
        const lowerTitle = title.toLowerCase();
        const isHighlight = lowerTitle.includes('actividad') || lowerTitle.includes('instrucciones') || lowerTitle.includes('reto');
        
        let newHtml = `\n<h3 ${headingStyle}>${title.trim()}</h3>\n${content}`;
        
        if (isHighlight) {
            newHtml = `${highlightContainerStart}<h3 class="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2"><span class="text-2xl">⚡</span> ${title.trim()}</h3>\n${content}${highlightContainerEnd}`;
        }
        
        return newHtml;
    });

    // Convert headings that were not caught
    md = md.replace(/<h3>(.*?)<\/h3>/gs, `\n<h3 ${headingStyle}>$1</h3>\n`);
    md = md.replace(/<h2>([\s\S]*?)<\/h2>/gs, (match, content) => {
        const cleanContent = content.replace(/<[^>]+>/g, '').trim();
        return `\n<h3 ${headingStyle}>${cleanContent}</h3>\n`;
    });

    // Convert lists (Tailwind styling)
    md = md.replace(/<ul>([\s\S]*?)<\/ul>/gs, (match, items) => {
        return `\n<div class="flex flex-col gap-2 my-4">\n` + 
               items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gs, (m, p1) => {
                   return `<div class="bg-[#14161c] border-l-[3px] border-emerald-500/70 pl-4 py-3 text-gray-300 font-sans shadow-sm hover:bg-[#1a1c23] hover:border-emerald-400 transition-colors rounded-r-md">${p1.trim()}</div>\n`;
               }) + 
               `</div>\n`;
    });
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gs, (match, items) => {
        let count = 1;
        return `\n<div class="flex flex-col gap-3 my-5">\n` + 
               items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gs, (m, p1) => {
                   const num = count++;
                   return `<div class="bg-gradient-to-r from-[#101217] to-black border border-gray-800/80 rounded-xl p-4 flex gap-4 items-center shadow-lg hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all transform hover:-translate-y-0.5">
<div class="flex-shrink-0 bg-[#1a2530] text-emerald-400 font-black w-10 h-10 rounded-full flex items-center justify-center border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">${num}</div>
<div class="text-gray-300 font-sans text-base flex-1">${p1.trim()}</div>
</div>\n`;
               }) + 
               `</div>\n`;
    });

    // Clean up empty lines
    md = md.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return md.trim();
}

function getQuestionsPool() {
    const questions = [];
    const evalPath = path.join(inputDir, 'evaluacion_excel.html');
    if (fs.existsSync(evalPath)) {
        const html = fs.readFileSync(evalPath, 'utf8');
        const matches = [...html.matchAll(/<td class="formula">(.*?)<\/td>\s*<td>(.*?)<\/td>/gs)];
        
        matches.forEach(m => {
            questions.push({
                formula: m[1].replace(/<[^>]+>/g, '').trim(),
                desc: m[2].replace(/<[^>]+>/g, '').trim()
            });
        });
    }
    return questions;
}

const modules = [
    { id: "mod_excel_1", title: "Módulo 1: Fundamentos y Entorno", order: 1, courseId: "excel-intermedio" },
    { id: "mod_excel_2", title: "Módulo 2: Herramientas y Fórmulas", order: 2, courseId: "excel-intermedio" },
    { id: "mod_excel_3", title: "Módulo 3: Análisis y Gráficos", order: 3, courseId: "excel-intermedio" },
    { id: "mod_excel_4", title: "Módulo 4: Automatización y Funciones Avanzadas", order: 4, courseId: "excel-intermedio" }
];

const lessons = [];
const quizzes = [];
const qPool = getQuestionsPool();
let qIndex = 0;

function getRandomWrongFormulas(correctFormula, count) {
    const wrong = qPool.filter(q => q.formula !== correctFormula).map(q => q.formula);
    // Shuffle
    wrong.sort(() => 0.5 - Math.random());
    return wrong.slice(0, count);
}

let globalLessonOrder = 1;

for (let week = 1; week <= 16; week++) {
    const file = path.join(inputDir, `semana${week}.html`);
    if (!fs.existsSync(file)) {
        console.log(`File missing: ${file}`);
        continue;
    }
    
    const html = fs.readFileSync(file, 'utf8');
    const moduleId = `mod_excel_${Math.ceil(week / 4)}`; // 1-4 = mod_excel_1, 5-8 = mod_excel_2, etc.
    
    // Extract sessions
    const sessions = [...html.matchAll(/<div id="[^"]*" class="sesion">\s*<h2>(.*?)<\/h2>\s*<div class="contenido">([\s\S]*?)<\/div>\s*<\/div>/gi)];
    
    let lastLessonId = "";

    sessions.forEach(session => {
        let title = session[1].trim();
        let contentHtml = session[2].trim();
        
        // Remove <h2> tag if present in title
        title = title.replace(/<[^>]+>/g, '');
        
        const markdownContent = convertHtmlToMarkdown(contentHtml);
        const lessonId = `lesson_${globalLessonOrder}_excel`;
        
        lessons.push({
            id: lessonId,
            courseId: "excel-intermedio",
            moduleId: moduleId,
            order: globalLessonOrder,
            title: title,
            content: markdownContent
        });
        
        lastLessonId = lessonId;
        globalLessonOrder++;
    });

    // Add Quizz to the LAST week of each module
    if (week % 4 === 0 && lastLessonId && qPool.length > 0) {
        const quizQuestions = [];
        for (let i = 0; i < 4; i++) {
            if (qIndex >= qPool.length) qIndex = 0; // wrap around just in case
            const q = qPool[qIndex++];
            
            const wrongOptions = getRandomWrongFormulas(q.formula, 3);
            const allOptions = [q.formula, ...wrongOptions];
            // Shuffle allOptions
            allOptions.sort(() => 0.5 - Math.random());
            const correctIdx = allOptions.indexOf(q.formula);

            quizQuestions.push({
                question: `¿Cuál es la fórmula correcta para: "${q.desc}"?`,
                options: allOptions,
                answer: correctIdx,
                color: ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"][i]
            });
        }
        
        quizzes.push({
            lessonId: lastLessonId,
            courseId: "excel-intermedio",
            questions: quizQuestions
        });
    }
}

const finalData = {
    modules,
    lessons,
    quizzes
};

fs.writeFileSync(outputJSON, JSON.stringify(finalData, null, 2));
console.log(`Successfully processed Excel HTMLs. Data saved to ${outputJSON}`);
