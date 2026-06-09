// firebase-setup.js
// Configuración de Firebase para guardar el progreso del curso

// Importar Firebase (Usaremos modulos desde el CDN oficial para que sea compatible con navegadores)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// IMPORTANTE: REEMPLAZA ESTO CON LOS DATOS DE TU PROYECTO FIREBASE ANTERIOR
const firebaseConfig = {
    apiKey: window.ENV ? window.ENV.FIREBASE_API_KEY : "",
    authDomain: "acceso-a-cursos-4a314.firebaseapp.com",
    projectId: "acceso-a-cursos-4a314",
    storageBucket: "acceso-a-cursos-4a314.firebasestorage.app",
    messagingSenderId: "851856735092",
    appId: "1:851856735092:web:04290714cb63e4244c4a21",
    measurementId: "G-ZG280G922Y"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funciones Auxiliares para exportar y usar en la app

/**
 * Guarda o actualiza el progreso de una sesión específica para un usuario
 * @param {string} userId - Identificador del usuario (ej: matricula o ID de sesión local)
 * @param {string} sessionId - ID de la sesión (ej: "sesion1")
 * @param {number} score - Puntuación obtenida en el quiz
 * @param {boolean} isCompleted - Si terminó la lección
 */
export async function saveProgressToFirebase(userId, sessionId, score, isCompleted) {
    try {
        const userRef = doc(db, "estudiantes_pv", userId);

        // Comprobar si el documento del usuario ya existe
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Actualizar
            await updateDoc(userRef, {
                [`progress.${sessionId}`]: {
                    score: score,
                    completed: isCompleted,
                    timestamp: new Date()
                },
                lastUpdate: new Date()
            });
        } else {
            // Crear nuevo
            await setDoc(userRef, {
                createdAt: new Date(),
                lastUpdate: new Date(),
                progress: {
                    [sessionId]: {
                        score: score,
                        completed: isCompleted,
                        timestamp: new Date()
                    }
                }
            });
        }
        console.log("Progreso guardado en Firebase exitosamente.");
    } catch (e) {
        console.error("Error guardando progreso: ", e);
    }
}
