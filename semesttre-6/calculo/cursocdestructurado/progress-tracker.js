// progress-tracker.js
// Script utilitario para guardar y leer el progreso de los alumnos en Firebase Firestore.
// Instrucciones de uso: 
// 1. Incluye firebase-app, firebase-auth y firebase-firestore en tu HTML de la lección.
// 2. Incluye env.js y este archivo (progress-tracker.js).
// 3. Llama a window.markLessonCompleted('id_del_curso', 'id_de_la_leccion') al final de la página.
// 4. Llama a window.getUserProgress('id_del_curso') para obtener el progreso del usuario.

// Inicializar Firebase si no está inicializado
(function() {
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        const apiKey = (window.ENV && window.ENV.FIREBASE_API_KEY) || '';
        if (apiKey) {
            firebase.initializeApp({
                apiKey: apiKey,
                authDomain: "cursocalculodiferencial-49648.firebaseapp.com",
                projectId: "cursocalculodiferencial-49648",
                storageBucket: "cursocalculodiferencial-49648.firebasestorage.app",
                messagingSenderId: "617467179231",
                appId: "1:617467179231:web:593e3b771d0d207a87b96a"
            });
            console.log("✅ Firebase inicializado correctamente.");
        } else {
            console.warn("⚠️ No se encontró FIREBASE_API_KEY en window.ENV.");
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.warn("Firebase no está inicializado. No se podrá guardar el progreso.");
        return;
    }
    
    const db = firebase.firestore();

    /**
     * Marca una lección como completada para el usuario actual.
     * @param {string} courseId - El ID del curso (ej. 'calculo_relaciones_funciones')
     * @param {string} lessonId - El ID único de la lección (ej. 'sesion1')
     */
    window.markLessonCompleted = async (courseId, lessonId) => {
        const user = firebase.auth().currentUser;
        
        if (user) {
            try {
                const docRef = db.collection('user_progress').doc(user.uid);
                
                await docRef.set({
                    [courseId]: firebase.firestore.FieldValue.arrayUnion(lessonId),
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                
                console.log(`✅ Lección '${lessonId}' de '${courseId}' guardada con éxito en la nube.`);
            } catch (err) {
                console.error("❌ Error al guardar el progreso en Firestore:", err);
            }
        } else {
            console.log("ℹ️ Progreso no guardado: Usuario no ha iniciado sesión.");
        }
    };

    /**
     * Obtiene el progreso del usuario para un curso dado.
     * Retorna un objeto { sesion1: true, sesion2: true, ... } con las lecciones completadas.
     * @param {string} courseId - El ID del curso
     * @returns {Object} Objeto con las lecciones completadas
     */
    window.getUserProgress = async (courseId) => {
        const user = firebase.auth().currentUser;
        const progress = {};
        
        if (user) {
            try {
                const docRef = db.collection('user_progress').doc(user.uid);
                const doc = await docRef.get();
                
                if (doc.exists) {
                    const data = doc.data();
                    const completedLessons = data[courseId] || [];
                    
                    completedLessons.forEach(lessonId => {
                        progress[lessonId] = true;
                    });
                }
            } catch (err) {
                console.error("❌ Error al leer el progreso de Firestore:", err);
            }
        } else {
            console.log("ℹ️ Progreso no disponible: Usuario no ha iniciado sesión.");
        }
        
        return progress;
    };
});
