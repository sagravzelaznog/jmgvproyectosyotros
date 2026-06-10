// progress-tracker.js
// Script utilitario para guardar el progreso de los alumnos en Firebase Firestore.
// Instrucciones de uso: 
// 1. Incluye firebase-app, firebase-auth y firebase-firestore en tu HTML de la lección.
// 2. Incluye env.js y este archivo (progress-tracker.js).
// 3. Llama a window.markLessonCompleted('id_del_curso', 'id_de_la_leccion') al final de la página o en un botón de "Completar".

document.addEventListener('DOMContentLoaded', () => {
    if (!firebase.apps.length) {
        console.warn("Firebase no está inicializado. No se podrá guardar el progreso.");
        return;
    }
    
    const db = firebase.firestore();

    /**
     * Marca una lección como completada para el usuario actual.
     * @param {string} courseId - El ID del curso (ej. 'electricidad', 'ecologica', 'taichi')
     * @param {string} lessonId - El ID único de la lección (ej. 'modulo1', 'sesion_1')
     */
    window.markLessonCompleted = async (courseId, lessonId) => {
        // Obtenemos el usuario activo
        const user = firebase.auth().currentUser;
        
        if (user) {
            try {
                const docRef = db.collection('user_progress').doc(user.uid);
                
                // Usamos arrayUnion para añadir la lección sin duplicados y sin borrar otras lecciones
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
});
