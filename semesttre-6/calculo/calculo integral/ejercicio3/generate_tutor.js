const fs = require('fs');

// Importar los datos de los archivos originales
const ejerciciosIntegrales = require('./integrales.js');
const detailedSolutions = require('./soluciones.js');

// Función para limpiar y formatear la respuesta
const formatAnswer = (answer) => {
    // Asegurarse de que la respuesta no tenga +C al final
    return answer.replace(/\s*\+\s*C\s*$/, '').trim();
};

// Combinar los datos
const combinedData = ejerciciosIntegrales.map(ejercicio => {
    const solution = detailedSolutions.find(sol => sol.id === ejercicio.id) || {};
    
    return {
        id: ejercicio.id,
        q: ejercicio.q,
        a: formatAnswer(ejercicio.a),
        c: ejercicio.c,
        formula: solution.formula || '',
        steps: solution.steps || [],
        explanation: solution.explanation || '',
        result: solution.result || `${ejercicio.a} + C`
    };
});

// Crear el contenido del archivo
const fileContent = `const ejerciciosTutor = ${JSON.stringify(combinedData, null, 2).replace(/"([^"]+)":/g, '$1:')};

// Exportar el arreglo para su uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ejerciciosTutor;
}`;

// Escribir el archivo
fs.writeFileSync('tutor_complete.js', fileContent, 'utf8');
console.log('Archivo tutor_complete.js generado exitosamente!');
