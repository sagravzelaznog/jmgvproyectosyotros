const fs = require('fs');
const path = require('path');

const inputDir = 'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Informatica Programacion y Tecnologia\\informaticas\\informatica 4\\tuto colab';
const outputJSON = path.join(__dirname, 'colab_firebase_data.json');

const headingStyle = `class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mt-10 mb-6 uppercase tracking-wide"`;
const strongStyle = `class="text-white font-black tracking-wide"`;

function convertHtmlToMarkdown(html) {
    let md = html;
    
    // Convert strong tags
    md = md.replace(/<strong>(.*?)<\/strong>/gs, `<strong ${strongStyle}>$1</strong>`);
    md = md.replace(/<b>(.*?)<\/b>/gs, `<strong ${strongStyle}>$1</strong>`);
    
    // Convert headings
    md = md.replace(/<h3>(.*?)<\/h3>/gs, `\n<h3 ${headingStyle}>$1</h3>\n`);
    md = md.replace(/<h2>([\s\S]*?)<\/h2>/gs, (match, content) => {
        const cleanContent = content.replace(/<[^>]+>/g, '').trim();
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

    // Convert code blocks and code tags
    md = md.replace(/<div class="code-markdown">([\s\S]*?)<\/div>/gs, (match, p1) => {
        return `\n<div class="bg-[#0d1117] border border-gray-700/50 rounded-lg p-4 my-4 font-mono text-sm text-gray-300 overflow-x-auto shadow-inner">\n${p1.trim()}\n</div>\n`;
    });
    
    // Convert inline code tags that aren't already wrapped (simple approach)
    md = md.replace(/<code>(.*?)<\/code>/gs, `<code class="bg-gray-800/80 text-neon-cyan px-2 py-0.5 rounded text-sm border border-gray-700/50">$1</code>`);
    
    // Clean up empty lines
    md = md.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove the quizz block from markdown content so it doesn't render as text
    md = md.replace(/<div class="quizz-masterclass">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
    md = md.replace(/<div class="quizz-masterclass">[\s\S]*?(?=<\/div>\s*<\/div>|$)/g, ''); // Fallback
    
    return md.trim();
}

const lessons = [];
const quizzes = [];

for (let i = 1; i <= 9; i++) {
    const file = path.join(inputDir, `S${i}.HTML`);
    if (!fs.existsSync(file)) {
        console.log(`File missing: ${file}`);
        continue;
    }
    
    const html = fs.readFileSync(file, 'utf8');
    
    // Extract Title from h1
    const titleMatch = html.match(/<h1>(.*?)<\/h1>/);
    let title = `Sesión ${i}`;
    if (titleMatch) {
        title = titleMatch[1].trim();
    } else {
        const titleTagMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleTagMatch) {
            title = titleTagMatch[1].trim();
        }
    }
    
    // Extract Content between <header> and </body>
    let contentMatch = html.match(/<\/header>([\s\S]*?)<\/body>/i);
    let contentHtml = "";
    if (contentMatch) {
        contentHtml = contentMatch[1];
    } else {
        // fallback
        contentHtml = html;
    }
    
    const markdownContent = convertHtmlToMarkdown(contentHtml);
    
    // Parse Quiz from the session html directly if exists
    const quizStartIndex = contentHtml.indexOf('<div class="quizz-masterclass">');
    if (quizStartIndex !== -1) {
        const quizHtml = contentHtml.substring(quizStartIndex);
        const questions = [];
        const questionMatches = [...quizHtml.matchAll(/<div class="pregunta" data-respuesta="([^"]+)">([\s\S]*?)<\/ul>\s*<\/div>/gi)];
        
        const colors = ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"];
        
        questionMatches.forEach((qMatch, idx) => {
            const answerIdx = parseInt(qMatch[1], 10);
            const qContent = qMatch[2] + "</ul>"; // Re-add the ul closing tag that was consumed
            const qTitleMatch = qContent.match(/<p>(.*?)<\/p>/i);
            const qTitle = qTitleMatch ? qTitleMatch[1].trim() : "Pregunta";
            
            const options = [];
            const optionMatches = [...qContent.matchAll(/<li>(.*?)<\/li>/gi)];
            optionMatches.forEach(opt => options.push(opt[1].trim()));
            
            if (options.length > 0) {
                questions.push({
                    question: qTitle,
                    options: options,
                    answer: answerIdx,
                    color: colors[idx % 4]
                });
            }
        });
        
        if (questions.length > 0) {
            quizzes.push({
                lessonId: `lesson_${i}_colab`,
                courseId: "tuto-colab",
                questions: questions
            });
        }
    }
    
    lessons.push({
        id: `lesson_${i}_colab`,
        courseId: "tuto-colab",
        moduleId: "mod_colab_1",
        order: i,
        title: title,
        content: markdownContent
    });
}

const finalData = {
    lessons,
    quizzes
};

fs.writeFileSync(outputJSON, JSON.stringify(finalData, null, 2));
console.log(`Successfully processed Colab HTMLs. Data saved to ${outputJSON}`);
