const fs = require('fs');
const path = require('path');

const pm4Dir = 'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\PM4';
const outputJSON = path.join(__dirname, 'pm4_firebase_data.json');

const modules = [
    { id: "pm4-unidad1", courseId: "pm4", order: 1, title: "Unidad I: Conceptos Básicos (Sesiones 1-10)" },
    { id: "pm4-unidad2", courseId: "pm4", order: 2, title: "Unidad II: Trigonometría y Polinomios (Sesiones 11-20)" },
    { id: "pm4-unidad3", courseId: "pm4", order: 3, title: "Unidad III: Funciones Cuadráticas y Parábolas (Sesiones 21-30)" },
    { id: "pm4-unidad4", courseId: "pm4", order: 4, title: "Unidad IV: Secciones Cónicas y Modelado (Sesiones 31-40)" },
    { id: "pm4-unidad5", courseId: "pm4", order: 5, title: "Unidad V: Análisis Urbano y Cierre (Sesiones 41-50)" }
];

const lessons = [];
const quizzes = [];

const headingStyle = `class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-6 uppercase tracking-wide"`;
const strongStyle = `class="text-white font-black tracking-wide"`;

function getModuleId(num) {
    if (num <= 10) return "pm4-unidad1";
    if (num <= 20) return "pm4-unidad2";
    if (num <= 30) return "pm4-unidad3";
    if (num <= 40) return "pm4-unidad4";
    return "pm4-unidad5";
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
        return items.replace(/<li>([\s\S]*?)<\/li>/gs, '- $1\n');
    });
    md = md.replace(/<ol>([\s\S]*?)<\/ol>/gs, (match, items) => {
        let count = 1;
        return items.replace(/<li>([\s\S]*?)<\/li>/gs, () => `${count++}. $1\n`);
    });

    // Convert math boxes
    md = md.replace(/<div class="math-box">([\s\S]*?)<\/div>/gs, `\n<div class="formula-box">\n<div class="formula">\n$1\n</div>\n</div>\n`);
    
    // Convert alert boxes to insight boxes
    md = md.replace(/<div class="alert-box">([\s\S]*?)<\/div>/gs, `\n<div class="bg-gradient-to-r from-[#1a1c23] to-black border-2 border-neon-purple border-b-[8px] border-r-[8px] p-6 rounded-2xl shadow-[0_10px_30px_rgba(138,43,226,0.2)] my-6 transform hover:scale-[1.02] transition-transform">\n<h4 class="text-neon-purple font-black uppercase mb-3">Nota Importante</h4>\n<p class="text-white text-lg">$1</p>\n</div>\n`);

    // Remove remaining divs but keep content
    md = md.replace(/<div[^>]*>/gs, '');
    md = md.replace(/<\/div>/gs, '');
    
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
