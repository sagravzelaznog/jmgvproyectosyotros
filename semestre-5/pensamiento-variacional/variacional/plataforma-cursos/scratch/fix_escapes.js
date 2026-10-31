const fs = require('fs');

const filePaths = [
    'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\variacional\\plataforma-cursos\\public\\courses\\matematicas-basicas\\igualacion-2-incognitas\\index.html',
    'c:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\Recursos matematicos basicos\\IGUALACION 2 INCOGNITAS\\IGUALACION 2 INCOGNITAS.HTML'
];

for (const path of filePaths) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/\\`/g, '`');
    content = content.replace(/\\\${/g, '${');
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Fixed ${path}`);
}
