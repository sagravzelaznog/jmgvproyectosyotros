// admin-setup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// 1. INICIALIZACIÓN
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgff6aAePcokXYUmissb3tzItNpKzJeEE",
    authDomain: "tienda-sagravzelaznog.firebaseapp.com",
    projectId: "tienda-sagravzelaznog",
    storageBucket: "tienda-sagravzelaznog.firebasestorage.app",
    messagingSenderId: "414938323069",
    appId: "1:414938323069:web:2b166414a337f44f123914",
    measurementId: "G-WHS4B058P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const authOverlay = document.getElementById('authOverlay');
const adminBadge = document.getElementById('adminBadge');
const productForm = document.getElementById('productForm');
const submitBtn = document.getElementById('submitBtn');
const statusBox = document.getElementById('statusBox');

// ============================================================================
// 2. AUDITORÍA DE ACCESO
// ============================================================================
const ADMIN_EMAILS = ["primomanuel@hotmail.com", "primomanuelsagrav@gmail.com"];
const googleLoginBtn = document.getElementById('googleLoginBtn');
const authErrorMsg = document.getElementById('authErrorMsg');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (ADMIN_EMAILS.includes(user.email)) {
            authOverlay.style.opacity = '0';
            setTimeout(() => authOverlay.style.display = 'none', 500);
            adminBadge.style.display = 'flex';
            authErrorMsg.classList.add('hidden');
        } else {
            console.warn("Intento de acceso no autorizado registrado:", user.email);
            authErrorMsg.classList.remove('hidden');
            authErrorMsg.textContent = `Acceso denegado para: ${user.email}`;
            await signOut(auth);
        }
    } else {
        authOverlay.style.display = 'flex';
        authOverlay.style.opacity = '1';
        adminBadge.style.display = 'none';
    }
});

googleLoginBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error en login:", error);
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "/index.html");
});

// ============================================================================
// 3. FLUJO DE SUBIDA SEGURO
// ============================================================================
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Subiendo archivo encriptado...';

    const nombre = document.getElementById('pNombre').value;
    const precio = parseFloat(document.getElementById('pPrecio').value);
    const stock = parseInt(document.getElementById('pStock').value, 10);
    const descripcion = document.getElementById('pDesc').value;
    const file = document.getElementById('pImage').files[0];

    try {
        const fileExt = file.name.split('.').pop();
        const safeFileName = `producto_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const storageRef = ref(storage, `imagenes_catalogo/${safeFileName}`);

        const uploadTask = await uploadBytesResumable(storageRef, file);

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Escribiendo en Firestore...';
        const imageUrl = await getDownloadURL(uploadTask.ref);

        const docRef = await addDoc(collection(db, "productos"), {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            stock: stock,
            imagenUrl: imageUrl,
            activo: true,
            fechaCreacion: serverTimestamp()
        });

        showFeedback(`¡Producto añadido con éxito! ID: ${docRef.id}`, 'success');
        productForm.reset();

    } catch (error) {
        console.error("Fallo en la inyección de datos:", error);
        showFeedback(`Error de Seguridad/Red: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-database mr-2 group-hover:animate-bounce"></i> Inyectar a Firestore';
    }
});

function showFeedback(message, type) {
    statusBox.textContent = message;
    statusBox.className = `col-span-full p-4 rounded-lg font-bold text-center mb-4 transition-all ${type === 'success' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
            : 'bg-rose-100 text-rose-700 border border-rose-300'
        }`;
    statusBox.style.display = 'block';

    setTimeout(() => {
        statusBox.style.display = 'none';
    }, 5000);
}
