const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional';
const pm4Dir = path.join(rootDir, 'cursos', 'PM4');
const topicsPath = path.join(pm4Dir, 'mc_topics.json');

const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

let htmlCards = {
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
};

function getUnit(num) {
    if (num <= 10) return 1;
    if (num <= 20) return 2;
    if (num <= 30) return 3;
    if (num <= 40) return 4;
    return 5;
}

topics.forEach(t => {
    const num = parseInt(t.mc_num, 10);
    const unit = getUnit(num);
    const title = t.topic.replace(/\[cite:\s*\d+\]/g, '').replace(/\n\s+/g, ' ').substring(0, 70) + "...";
    
    htmlCards[unit] += `
                <a href="mc${t.mc_num}/MC_S${t.mc_num}.html" class="menu-card">
                    <span class="mc-number">MC ${t.mc_num}</span>
                    <h3>${title}</h3>
                    <p>Resolver Masterclass</p>
                </a>`;
});

const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pensamiento Matemático IV - ABP</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../PM3/assets/css/styles.css">
    <style>
        .dashboard-link {
            display: inline-block;
            margin: 20px;
            padding: 10px 20px;
            background: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <header class="main-header">
        <h1>Pensamiento Matemático IV (Variacional)</h1>
        <h2>Proyecto: Electrificación Subterránea y Planimetría Urbana</h2>
        <p>Aplica álgebra, sistemas de ecuaciones, parábolas y geometría euclidiana para diseñar la infraestructura de un fraccionamiento y su maqueta en MDF.</p>
        <a href="../../index.html" class="dashboard-link">Volver al Dashboard Principal</a>
    </header>

    <main class="dashboard">
        <section class="unit-section">
            <h2 class="unit-title" style="background-color: #3b82f6; padding: 10px; border-radius: 10px; color: white;">Unidad I: Conceptos Básicos (Sesiones 1-10)</h2>
            <div class="menu-grid">${htmlCards[1]}</div>
        </section>
        <section class="unit-section">
            <h2 class="unit-title" style="background-color: #10b981; padding: 10px; border-radius: 10px; color: white;">Unidad II: Trigonometría y Polinomios (Sesiones 11-20)</h2>
            <div class="menu-grid">${htmlCards[2]}</div>
        </section>
        <section class="unit-section">
            <h2 class="unit-title" style="background-color: #f59e0b; padding: 10px; border-radius: 10px; color: white;">Unidad III: Funciones Cuadráticas y Parábolas (Sesiones 21-30)</h2>
            <div class="menu-grid">${htmlCards[3]}</div>
        </section>
        <section class="unit-section">
            <h2 class="unit-title" style="background-color: #ef4444; padding: 10px; border-radius: 10px; color: white;">Unidad IV: Secciones Cónicas y Modelado (Sesiones 31-40)</h2>
            <div class="menu-grid">${htmlCards[4]}</div>
        </section>
        <section class="unit-section">
            <h2 class="unit-title" style="background-color: #8b5cf6; padding: 10px; border-radius: 10px; color: white;">Unidad V: Análisis Urbano y Cierre (Sesiones 41-50)</h2>
            <div class="menu-grid">${htmlCards[5]}</div>
        </section>
    </main>

    <footer>
        &copy; JMGV-PTEL 2026 PM4 - Todos los derechos reservados.
    </footer>
</body>
</html>`;

fs.writeFileSync(path.join(pm4Dir, 'index.html'), indexHtml);
console.log("PM4 index.html generated!");
