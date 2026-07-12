const fs = require('fs');
const path = require('path');
const targetDir = 'c:/Users/admin/Documents/000 A PREPA/planeaciones especialidades/Proyectos y Otros/semestre-5/pensamiento-variacional/cursos/PM4';

let links = '';
for(let i=1; i<=50; i++) {
    let mcStr = i.toString().padStart(2, '0');
    if (fs.existsSync(path.join(targetDir, 'mc' + mcStr))) {
        links += `<a href="mc${mcStr}/MC S${mcStr}.html" style="display:block; padding: 10px; margin: 5px; background: #222; color: #fff; text-decoration: none; border-radius: 5px;">Masterclass ${mcStr}</a>\n`;
    }
}

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>PM4 - Índice de Masterclasses</title><style>body{font-family: system-ui, sans-serif; background: #0f172a; color: white; padding: 20px; max-width: 800px; margin: 0 auto;}</style></head><body><h1>Pensamiento Matemático IV</h1><p>Índice de Masterclasses</p><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">${links}</div></body></html>`;

fs.writeFileSync(path.join(targetDir, 'index.html'), html);
console.log('index.html creado');
