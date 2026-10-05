const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\ANALISIS FISICOS';

// Gather questions from mc_08.json to mc_14.json
let allQuestions = [];

for (let i = 8; i <= 14; i++) {
    const fileName = `mc_${i.toString().padStart(2, '0')}.json`;
    const filePath = path.join(basePath, fileName);
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        if (data.quizz_kahoot && Array.isArray(data.quizz_kahoot)) {
            data.quizz_kahoot.forEach((q, idx) => {
                // Determine correct index from string comparison
                const correctIdx = q.opciones.indexOf(q.respuesta_correcta);
                allQuestions.push({
                    id: `mc${i}_q${q.id_pregunta}`,
                    question: q.pregunta,
                    options: q.opciones,
                    correctIndex: correctIdx !== -1 ? correctIdx : 0,
                    feedback: `CORRECTO: ${q.justificacion_retroalimentacion || ''}`
                });
            });
        }
    }
}

// Read the template
const templatePath = path.join(basePath, 'mcs', 'examen_mc01_mc05.html');
let html = fs.readFileSync(templatePath, 'utf8');

// Replace titles
html = html.replace('Examen: Análisis Físicos MC01 - MC05', 'Examen Dinámico: Análisis Físicos MC08 - MC14');
html = html.replace('Examen de 10 aciertos sobre las Masterclasses 01 a 05', 'Examen dinámico de 10 aciertos sobre las Masterclasses 08 a 14');
html = html.replace('Examen Unidad 1', 'Examen (MC08 - MC14)');
html = html.replace('Análisis de Fenómenos Físicos I (Masterclasses 01 - 05)', 'Fuerzas, Equilibrio y Momentos (Masterclasses 08 - 14)');

// Replace the questionsData array
const regex = /const questionsData = \[[\s\S]*?\];/;
const newQuestionsJS = `
        const fullQuestionPool = ${JSON.stringify(allQuestions, null, 4)};
        
        // Shuffle and pick 10
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        const questionsData = shuffleArray([...fullQuestionPool]).slice(0, 10);
`;

html = html.replace(regex, newQuestionsJS.trim());

// Save new HTML
const outPath = path.join(basePath, 'mcs', 'examen_mc08_mc14.html');
fs.writeFileSync(outPath, html, 'utf8');

console.log('✅ Created examen_mc08_mc14.html with pool size: ' + allQuestions.length);
