const fs = require('fs');
const path = require('path');

const pm4Dir = 'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\PM4';
const outputJSON = path.join(__dirname, 'pm4_firebase_data.json');

const modules = [
    { id: "mod_pm4_1", courseId: "pm4", order: 1, title: "Bloque 1: Geometría Analítica Básica (Sesiones 1 - 10)" },
    { id: "mod_pm4_2", courseId: "pm4", order: 2, title: "Bloque 2: Rectas y Ángulos (Sesiones 11 - 20)" },
    { id: "mod_pm4_3", courseId: "pm4", order: 3, title: "Bloque 3: Circunferencia y Parábola (Sesiones 21 - 30)" },
    { id: "mod_pm4_4", courseId: "pm4", order: 4, title: "Bloque 4: Elipse e Hipérbola (Sesiones 31 - 40)" },
    { id: "mod_pm4_5", courseId: "pm4", order: 5, title: "Bloque 5: Aplicaciones y Cónicas (Sesiones 41 - 50)" }
];

const lessons = [];
const quizzes = [];

const headingStyle = `class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-6 uppercase tracking-wide"`;
const strongStyle = `class="text-white font-black tracking-wide"`;

function getModuleId(num) {
    if (num <= 10) return "mod_pm4_1";
    if (num <= 20) return "mod_pm4_2";
    if (num <= 30) return "mod_pm4_3";
    if (num <= 40) return "mod_pm4_4";
    return "mod_pm4_5";
}

function convertHtmlToMarkdown(html) {
    let md = html;
    
    // Convert strong tags
    md = md.replace(/<strong>(.*?)<\/strong>/gs, `<strong ${strongStyle}>$1</strong>`);
    md = md.replace(/<b>(.*?)<\/b>/gs, `<strong ${strongStyle}>$1</strong>`);
    
    // Convert headings
    md = md.replace(/<h3>(.*?)<\/h3>/gs, `\n<h3 ${headingStyle}>$1</h3>\n`);
    md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gs, (match, content) => {
        // Extract inner text removing spans
        const cleanContent = content.replace(/<span[^>]*>.*?<\/span>/gs, '').trim();
        if(!cleanContent) {
             const fallback = content.replace(/<[^>]+>/g, '').trim();
             return `\n<h3 ${headingStyle}>${fallback}</h3>\n`;
        }
        return `\n<h3 ${headingStyle}>${cleanContent}</h3>\n`;
    });

    // Convert lists
    md = md.replace(/<ul>([\s\S]*?)<\/ul>/gs, (match, items) => {
        return `\n<div class="flex flex-col gap-2 my-4">\n` + 
               items.replace(/<li>([\s\S]*?)<\/li>/gs, (m, p1) => {
                   return `<div class="bg-[#14161c] border-l-[3px] border-neon-purple/70 pl-4 py-3 text-gray-300 font-sans shadow-sm hover:bg-[#1a1c23] hover:border-neon-purple transition-colors rounded-r-md">${p1.trim()}</div>\n`;
               }) + 
               `</div>\n`;
    });
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gs, (match, items) => {
        let count = 1;
        return `\n<div class="flex flex-col gap-3 my-5">\n` + 
               items.replace(/<li>([\s\S]*?)<\/li>/gs, (m, p1) => {
                   const num = count++;
                   return `<div class="bg-gradient-to-r from-[#101217] to-black border border-gray-800/80 rounded-xl p-4 flex gap-4 items-center shadow-lg hover:border-neon-cyan/60 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-all transform hover:-translate-y-0.5">
<div class="flex-shrink-0 bg-[#1a2530] text-neon-cyan font-black w-10 h-10 rounded-full flex items-center justify-center border border-neon-cyan/40 shadow-[0_0_10px_rgba(0,255,255,0.2)]">${num}</div>
<div class="text-gray-300 font-sans text-base flex-1">${p1.trim()}</div>
</div>\n`;
               }) + 
               `</div>\n`;
    });

    // Convert MathJax to RemarkMath format
    md = md.replace(/\\\((.*?)\\\)/gs, (match, p1) => '$' + p1 + '$');
    md = md.replace(/\\\[(.*?)\\\]/gs, (match, p1) => '$$' + p1 + '$$');

    // Convert math boxes
    md = md.replace(/<div class="math-box">([\s\S]*?)<\/div>/gs, `\n<div class="formula-box">\n<div class="formula">\n$1\n</div>\n</div>\n`);
    
    // Convert alert boxes to insight boxes
    md = md.replace(/<div class="alert-box">([\s\S]*?)<\/div>/gs, `\n<div class="bg-gradient-to-r from-[#1a1c23] to-black border-2 border-neon-purple border-b-[8px] border-r-[8px] p-6 rounded-2xl shadow-[0_10px_30px_rgba(138,43,226,0.2)] my-6 transform hover:scale-[1.02] transition-transform">\n<h4 class="text-neon-purple font-black uppercase mb-3">Nota Importante</h4>\n<p class="text-white text-lg">$1</p>\n</div>\n`);

    // Remove remaining divs but keep content
    // md = md.replace(/<div[^>]*>/gs, '');
    // md = md.replace(/<\/div>/gs, '');
    
    // Convert sections
    md = md.replace(/<section class="section-card">/gs, '');
    md = md.replace(/<\/section>/gs, '');
    
    // Clean up empty lines
    md = md.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return md.trim();
}

for (let i = 1; i <= 50; i++) {
    const numStr = i.toString().padStart(2, '0');
    const folder = path.join(pm4Dir, `mc${numStr}`);
    const file = path.join(folder, `MC_S${numStr}.html`);
    
    if (!fs.existsSync(file)) {
        console.log(`File missing: ${file}`);
        continue;
    }
    
    const html = fs.readFileSync(file, 'utf8');
    
    // Extract Title
    const titleMatch = html.match(/<h1>(.*?)<\/h1>/);
    let title = `Sesión ${i}: MC ${numStr}`;
    if (titleMatch) {
        title = titleMatch[1].trim();
    }
    
    // Extract Content (everything between first section and footer)
    let contentMatch = html.match(/<section class="section-card">([\s\S]*?)<div class="quiz-container"/);
    if (!contentMatch) {
         contentMatch = html.match(/<section class="section-card">([\s\S]*?)<\/section>\s*<footer>/);
    }
    
    let contentHtml = "";
    if (contentMatch) {
        contentHtml = contentMatch[1];
    } else {
        // Fallback: get all sections
        const sections = [...html.matchAll(/<section class="section-card">([\s\S]*?)<\/section>/g)];
        contentHtml = sections.map(s => s[1]).join('\n\n');
    }
    
    const markdownContent = convertHtmlToMarkdown(contentHtml);
    
    const lessonId = `lesson_${i}_pm4`;
    lessons.push({
        id: lessonId,
        courseId: "pm4",
        moduleId: getModuleId(i),
        order: i,
        title: title,
        content: markdownContent
    });
    
    // Extract Quiz Questions
    const quizMatch = html.match(/const questions = (\[[\s\S]*?\]);/);
    if (quizMatch) {
        try {
            // Evaluamos el JS array
            const questionsArray = eval(quizMatch[1]);
            const fbQuestions = questionsArray.map(q => ({
                question: q.q,
                options: q.options,
                answer: q.correct
            }));
            
            quizzes.push({
                lessonId: lessonId,
                courseId: "pm4",
                questions: fbQuestions
            });
        } catch (e) {
            console.error(`Failed to parse quiz for MC_S${numStr}: `, e);
        }
    }
}

const finalData = {
    modules,
    lessons,
    quizzes
};

fs.writeFileSync(outputJSON, JSON.stringify(finalData, null, 2));
console.log(`Successfully processed 50 masterclasses. Data saved to ${outputJSON}`);
