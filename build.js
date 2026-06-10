const fs = require('fs');

// Obtener la clave desde las variables de entorno de Netlify
const apiKey = process.env.FIREBASE_API_KEY || "AIzaSyC08vUkWdQ9Ad3PaXS0uZ0yu_EWWBaq-aQ";

const envContent = `window.ENV = {
    FIREBASE_API_KEY: "${apiKey}"
};`;

const paths = [
    './env.js',
    './CMD CURSO  BASICO/planeacion y masterclass/js/env.js',
    './curso Cisco Paket Tracer/js/env.js',
    './curso GeoGebra/recursos/js/env.js'
];

paths.forEach(p => {
    try {
        fs.writeFileSync(p, envContent);
        console.log("Generado correctamente: " + p);
    } catch(e) {
        console.log("Error al generar: " + p);
    }
});
