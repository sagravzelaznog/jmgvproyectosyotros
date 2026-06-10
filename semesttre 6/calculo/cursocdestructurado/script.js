document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const logoutBtn = document.getElementById('logout-btn');
    const coursesContainer = document.getElementById('courses-container');
    const userEmailDisplay = document.getElementById('user-email-display');
    const btnRegister = document.getElementById('btn-register');

    // Array de cursos para inyección dinámica
    const courses = [
        {
            folder: "curso-ejemplo",
            name: "Curso de Ejemplo",
            desc: "Demostración de Hub, sesiones interactivas y progreso.",
            icon: "fa-book-open"
        },
        {
            folder: "CMD CURSO BASICO",
            name: "CMD Básico",
            desc: "Aprende los comandos esenciales de la línea de comandos de Windows.",
            icon: "fa-terminal"
        },
        {
            folder: "TUTORIALES DE INFO",
            name: "Tutoriales de Info",
            desc: "Material de apoyo y tutoriales generales de informática.",
            icon: "fa-desktop"
        },
        {
            folder: "curso Cisco Paket Tracer",
            name: "Cisco Packet Tracer",
            desc: "Simulación de redes, configuración de routers y switches.",
            icon: "fa-network-wired"
        },
        {
            folder: "curso GeoGebra",
            name: "GeoGebra",
            desc: "Matemáticas dinámicas, geometría, álgebra y cálculo.",
            icon: "fa-calculator"
        },
        {
            folder: "curso-javascript",
            name: "JavaScript",
            desc: "Desarrollo web interactivo, lógica de programación y PWA.",
            icon: "fa-js"
        },
        {
            folder: "cursofernandarubi",
            name: "Curso Fernanda Rubi",
            desc: "Materiales y lecciones específicas del curso.",
            icon: "fa-chalkboard-user"
        },
        {
            folder: "ia manuel curso",
            name: "Curso IA Manuel",
            desc: "Inteligencia Artificial y sus aplicaciones prácticas.",
            icon: "fa-robot"
        },
        {
            folder: "quiz-kahoot",
            name: "Modo Prueba: Kahoot!",
            desc: "Módulo especial interactivo y gamificado.",
            icon: "fa-gamepad"
        }
    ];

    // Inicializar Firebase (usando env.js si existe, de lo contrario un mock para UI testing si no hay config real)
    const firebaseConfig = {
        apiKey: window.ENV ? window.ENV.FIREBASE_API_KEY : "AIzaSy_MOCK_KEY",
        authDomain: "portal-cursos-mock.firebaseapp.com",
        projectId: "portal-cursos-mock",
        storageBucket: "portal-cursos-mock.firebasestorage.app",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:mock1234"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Escuchar el estado de autenticación (Persistencia)
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userEmailDisplay.textContent = user.email;
            showDashboard();
        } else {
            showLogin();
        }
    });

    // Manejar el submit de Inicio de Sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            errorMessage.classList.add('hidden');
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            showError("Credenciales incorrectas o usuario no encontrado.");
        }
    });

    // Manejar Registro
    btnRegister.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError("Ingresa correo y contraseña para registrarte.");
            return;
        }

        try {
            errorMessage.classList.add('hidden');
            await firebase.auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
            showError("Error al registrar: " + error.message);
        }
    });

    // Cerrar sesión
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    });

    // Mostrar mensaje de error con animación Shake
    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        loginForm.classList.remove('shake');
        // trigger reflow
        void loginForm.offsetWidth;
        loginForm.classList.add('shake');
    }

    // Transición a Dashboard
    function showDashboard() {
        loginScreen.classList.remove('active-screen');
        loginScreen.classList.add('hidden-screen');
        
        dashboardScreen.classList.remove('hidden-screen');
        dashboardScreen.classList.add('active-screen');
        
        renderCourses();
    }

    // Transición a Login
    function showLogin() {
        dashboardScreen.classList.remove('active-screen');
        dashboardScreen.classList.add('hidden-screen');
        
        loginScreen.classList.remove('hidden-screen');
        loginScreen.classList.add('active-screen');
        
        emailInput.value = '';
        passwordInput.value = '';
    }

    // Renderizado Dinámico (CSS Grid)
    function renderCourses() {
        coursesContainer.innerHTML = '';
        
        courses.forEach((course, index) => {
            const card = document.createElement('a');
            card.href = `${course.folder}/index.html`; 
            card.className = 'course-card';
            
            // Animación en cascada
            card.style.animation = `fadeUp 0.5s ease-out ${index * 0.1}s forwards`;
            
            card.innerHTML = `
                <div class="course-icon">
                    <i class="fa-solid ${course.icon}"></i>
                </div>
                <h3>${course.name}</h3>
                <p>${course.desc}</p>
                <div class="course-action">
                    Ir al módulo <i class="fa-solid fa-arrow-right"></i>
                </div>
            `;
            
            coursesContainer.appendChild(card);
        });
    }
});
