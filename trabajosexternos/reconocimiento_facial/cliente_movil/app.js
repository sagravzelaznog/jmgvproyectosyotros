const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvasElement');
const btnIniciar = document.getElementById('btn_iniciar');
const relojFalso = document.getElementById('reloj_falso');

// URL pública segura vía túnel para evitar bloqueos del navegador móvil
const SERVIDOR_URL = "https://solid-plums-roll.loca.lt/analizar_rostro";

let ubicacionActual = "Desconocida";
let enviandoDatos = false;

// Actualiza el reloj falso para disimular
setInterval(() => {
    const ahora = new Date();
    relojFalso.innerText = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');
}, 1000);

// 1. Cargar los modelos ligeros de Face-API.js
async function cargarModelos() {
    try {
        console.log("Cargando modelos locales para detección rápida...");
        // Asumiendo que has descargado los pesos a la carpeta /models
        await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
        console.log("Modelos cargados.");
    } catch (error) {
        console.error("Error cargando modelos de IA:", error);
    }
}

// 2. Obtener Ubicación (Silencioso)
function obtenerUbicacionSilenciosa() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                ubicacionActual = `Lat: ${position.coords.latitude.toFixed(5)}, Lon: ${position.coords.longitude.toFixed(5)}`;
            },
            (error) => { console.log("Error de GPS:", error); },
            { enableHighAccuracy: false, maximumAge: 60000, timeout: 5000 }
        );
    }
}

// 3. Iniciar Cámara
async function iniciarCamara() {
    try {
        // En móviles, 'environment' es la cámara trasera
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }, 
            audio: false 
        });
        video.srcObject = stream;
        
        // Es necesario forzar el play en algunos móviles
        video.onloadedmetadata = () => {
            video.play().catch(e => console.error("Error al reproducir video:", e));
        };
        
        // Cambiar la UI
        btnIniciar.style.display = 'none';
        relojFalso.style.display = 'block';
        
        // Hacemos el video ligeramente visible como una cámara de seguridad pequeña en la esquina 
        // para que sepas a dónde estás apuntando y confirmar que no está congelado.
        video.style.opacity = "0.5";
        video.style.width = "100px";
        video.style.height = "150px";
        video.style.position = "absolute";
        video.style.top = "10px";
        video.style.right = "10px";
        video.style.zIndex = "100";
        
        obtenerUbicacionSilenciosa();
        
        // Iniciar el rastreo de alta velocidad
        rastrearRostros();
        
    } catch (err) {
        console.error("Error accediendo a la cámara:", err);
        alert("Error de cámara: " + err.message + "\nSi estás en HTTP, el navegador podría bloquear la cámara por seguridad.");
    }
}

// 4. Bucle principal de análisis de alta velocidad
async function rastrearRostros() {
    if(video.paused || video.ended) {
        setTimeout(rastrearRostros, 100);
        return;
    }

    try {
        // Detectar si hay una cara con sensibilidad EXTREMA (scoreThreshold 0.05)
        // inputSize: 512 hace que procese la imagen a mayor resolución, encontrando caras muy lejanas o pequeñas en cámaras de baja calidad
        const detecciones = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.05 }));

        if (detecciones.length > 0 && !enviandoDatos) {
            // Se detectó una cara y el canal está libre, enviar captura inmediatamente
            await enviarAlServidor();
        }
    } catch (e) {
        console.error("Error en deteccion local:", e);
    }
    
    // Volver a analizar el siguiente fotograma lo más rápido posible sin pausas artificiales
    requestAnimationFrame(rastrearRostros);
}

// 5. Enviar frame al servidor
async function enviarAlServidor() {
    enviandoDatos = true;
    
    // Dibujar el fotograma actual del video en el canvas invisible
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // Convertir a base64 (calidad reducida para enviar rápido por 4G/Wifi)
    const base64Image = canvas.toDataURL('image/jpeg', 0.5);

    try {
        const respuesta = await fetch(SERVIDOR_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'true'
            },
            body: JSON.stringify({
                image: base64Image,
                ubicacion: ubicacionActual
            })
        });

        const data = await respuesta.json();
        if (data.error) {
            console.error("Error del servidor central:", data.error);
        } else {
            console.log("Respuesta del servidor:", data.mensaje);
        }

    } catch (error) {
        console.error("Error contactando al servidor central:", error);
    } finally {
        enviandoDatos = false; // Liberar para el siguiente ciclo
    }
}

// Iniciar al tocar el botón (los navegadores obligan a que el usuario interactúe antes de encender la cámara)
btnIniciar.addEventListener('click', async () => {
    btnIniciar.innerText = "Cargando Modelos IA...";
    await cargarModelos();
    btnIniciar.innerText = "Iniciando Cámara...";
    await iniciarCamara();
});
