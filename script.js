document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const logoutBtn = document.getElementById('logout-btn');
    const btnRegister = document.getElementById('btn-register');

    const firebaseConfig = {
        apiKey: window.ENV ? window.ENV.FIREBASE_API_KEY : "",
        authDomain: "acceso-a-cursos-4a314.firebaseapp.com",
        projectId: "acceso-a-cursos-4a314",
        storageBucket: "acceso-a-cursos-4a314.firebasestorage.app",
        messagingSenderId: "851856735092",
        appId: "1:851856735092:web:04290714cb63e4244c4a21"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            showDashboard();
            const userEmailDisplay = document.getElementById('user-email-display');
            if (userEmailDisplay) {
                userEmailDisplay.textContent = user.email;
            }
        } else {
            showLogin();
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            try {
                errorMessage.classList.add('hidden');
                await firebase.auth().signInWithEmailAndPassword(email, password);
                emailInput.value = '';
                passwordInput.value = '';
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    if (btnRegister) {
        btnRegister.addEventListener('click', async () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                showError("Por favor ingresa correo y contraseña para registrarte.");
                return;
            }

            try {
                errorMessage.classList.add('hidden');
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                emailInput.value = '';
                passwordInput.value = '';
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut();
        });
    }

    function handleAuthError(error) {
        let msg = "Error de autenticación.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            msg = "Correo o contraseña incorrectos.";
        } else if (error.code === 'auth/too-many-requests') {
            msg = "Demasiados intentos fallidos. Intenta más tarde.";
        } else if (error.code === 'auth/email-already-in-use') {
            msg = "El correo ya está registrado en otra cuenta.";
        } else if (error.code === 'auth/weak-password') {
            msg = "La contraseña debe tener al menos 6 caracteres.";
        } else {
            msg = error.message;
        }
        showError(msg);
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
    }

    function showDashboard() {
        if(loginScreen) loginScreen.style.display = 'none';
        if(dashboardScreen) dashboardScreen.style.display = 'block';
    }

    function showLogin() {
        if(dashboardScreen) dashboardScreen.style.display = 'none';
        if(loginScreen) loginScreen.style.display = 'flex';
    }
});

// Estilo para la animación de shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);
