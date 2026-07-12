document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const logoutBtn = document.getElementById('logout-btn');
    const btnRegister = document.getElementById('btn-register');
    const userEmailDisplay = document.getElementById('user-email-display');
    const dynamicDashboardContent = document.getElementById('dynamic-dashboard-content');

    // Datos estructurados de los proyectos (simulando una BD o API)
    const projectCategories = [
        {
            title: "Plataforma Unificada (Semestres 1, 2, 3 y 5)",
            projects: [
                {
                    link: "semestre-5/pensamiento-variacional/index.html",
                    tag: "Portal Maestro",
                    title: "Pensamiento Variacional (S5)",
                    description: "Curso principal de 50 sesiones gamificadas. Incluye acceso a los módulos de semestres anteriores.",
                    icon: "fa-mobile-screen-button"
                },
                {
                    link: "semestre-5/pensamiento-variacional/cursos/PM1/index.html",
                    tag: "Módulo Consolidado",
                    title: "PM1 (Álgebra Base)",
                    description: "Fundamentos de ecuaciones y el lenguaje del dinero.",
                    icon: "fa-calculator"
                },
                {
                    link: "semestre-5/pensamiento-variacional/cursos/PM2/index.html",
                    tag: "Módulo Consolidado",
                    title: "PM2 (Geometría)",
                    description: "Diseño y trazo geométrico aplicado al urbanismo.",
                    icon: "fa-shapes"
                },
                {
                    link: "semestre-5/pensamiento-variacional/cursos/PM3/index.html",
                    tag: "Módulo Consolidado",
                    title: "PM3 (Trazado Urbano)",
                    description: "Estadística, parábolas y construcción avanzada.",
                    icon: "fa-city"
                }
            ]
        },
        {
            title: "Semestre 6",
            projects: [
                {
                    link: "semesttre 6/calculo/index.html",
                    tag: "Curso",
                    title: "Cálculo",
                    description: "Portal principal del curso de cálculo diferencial e integral.",
                    icon: "fa-calculator"
                },
                {
                    link: "semesttre 6/calculo/cursoci/index.html",
                    tag: "Módulo",
                    title: "Curso CI (Interactividad)",
                    description: "Sesiones de cálculo con interactividad web.",
                    icon: "fa-laptop-code"
                },
                {
                    link: "semesttre 6/calculo/cursoci1/index.html",
                    tag: "Módulo",
                    title: "Cálculo (Curso CI 1)",
                    description: "Hub secundario del curso de cálculo diferencial.",
                    icon: "fa-cubes"
                },
                {
                    link: "semesttre 6/electricidad/index.html",
                    tag: "Especialidad",
                    title: "Electricidad",
                    description: "Módulo de electricidad para Semestre 6.",
                    icon: "fa-bolt"
                },
                {
                    link: "semesttre 6/calculadora.html",
                    tag: "Herramienta",
                    title: "Calculadora Web",
                    description: "Herramienta interactiva para resolución de problemas.",
                    icon: "fa-square-root-variable"
                },
                {
                    link: "semesttre 6/masterclass04/masterclass_sesion04.html",
                    tag: "Masterclass",
                    title: "Sesión 04",
                    description: "Presentación de Masterclass especial.",
                    icon: "fa-chalkboard-user"
                }
            ]
        },
        {
            title: "Trabajos Externos y Otros Proyectos",
            projects: [
                {
                    link: "trabajosexternos/APLICACION PARA CONVERTIR IMAGENES A DXF/INDEX.HTML",
                    tag: "App de Utilidad",
                    title: "Conversor a DXF",
                    description: "Aplicación web para convertir imágenes al formato vectorial DXF.",
                    icon: "fa-vector-square"
                },
                {
                    link: "trabajosexternos/CHECK LIS PLANOS/CHECLISTPLANOS.HTML",
                    tag: "Herramienta",
                    title: "Checklist de Planos",
                    description: "Sistema de revisión y validación de planos.",
                    icon: "fa-list-check"
                },
                {
                    link: "trabajosexternos/dialux/index.html",
                    tag: "Curso",
                    title: "Curso DIALux",
                    description: "Sesiones de aprendizaje para software de iluminación DIALux.",
                    icon: "fa-lightbulb"
                },
                {
                    link: "market/templates/index.html",
                    tag: "Proyecto",
                    title: "Market / Trading",
                    description: "Análisis y gráficas de mercado financiero.",
                    icon: "fa-chart-line"
                },
                {
                    link: "quiz-kahoot/index.html",
                    tag: "Gamificación",
                    title: "Módulo Quiz Kahoot",
                    description: "Evaluación interactiva y dinámica estilo Kahoot.",
                    icon: "fa-gamepad"
                }
            ]
        }
    ];

    // Renderizar dinámicamente el contenido del Dashboard
    function renderDashboard() {
        dynamicDashboardContent.innerHTML = '';

        projectCategories.forEach((category, catIndex) => {
            // Título de la categoría
            const catTitle = document.createElement('h2');
            catTitle.className = 'category-title';
            catTitle.textContent = category.title;
            dynamicDashboardContent.appendChild(catTitle);

            // Contenedor Grid
            const grid = document.createElement('div');
            grid.className = 'courses-grid';

            category.projects.forEach((proj, projIndex) => {
                const card = document.createElement('a');
                card.href = proj.link;
                card.className = 'course-card';

                // Efecto escalonado de aparición
                card.style.animation = `fadeUp 0.5s ease-out ${(projIndex + catIndex) * 0.1}s forwards`;
                card.style.opacity = '0';

                card.innerHTML = `
                    <span class="card-tag">${proj.tag}</span>
                    <div class="course-icon">
                        <i class="fa-solid ${proj.icon || 'fa-folder'}"></i>
                    </div>
                    <h3>${proj.title}</h3>
                    <p>${proj.description}</p>
                    <div class="course-action">
                        Abrir Proyecto <i class="fa-solid fa-arrow-right"></i>
                    </div>
                `;

                grid.appendChild(card);
            });

            dynamicDashboardContent.appendChild(grid);
        });
    }

    // Configuración Firebase
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

    // Auth State
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            showDashboard();
            if (userEmailDisplay) userEmailDisplay.textContent = user.email;
        } else {
            showLogin();
        }
    });

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            try {
                errorMessage.classList.add('hidden-screen');
                await firebase.auth().signInWithEmailAndPassword(email, password);
                emailInput.value = '';
                passwordInput.value = '';
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    // Register Button
    if (btnRegister) {
        btnRegister.addEventListener('click', async () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                showError("Por favor ingresa correo y contraseña para registrarte.");
                return;
            }

            try {
                errorMessage.classList.add('hidden-screen');
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                emailInput.value = '';
                passwordInput.value = '';
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut();
        });
    }

    // Manejo de errores Firebase
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
        errorMessage.classList.remove('hidden-screen');
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
    }

    function showDashboard() {
        if (loginScreen) {
            loginScreen.classList.remove('active-screen');
            loginScreen.classList.add('hidden-screen');
        }
        if (dashboardScreen) {
            dashboardScreen.classList.remove('hidden-screen');
            dashboardScreen.classList.add('active-screen');
            renderDashboard(); // Renderizar dinámicamente cuando entramos al panel
        }
    }

    function showLogin() {
        if (dashboardScreen) {
            dashboardScreen.classList.remove('active-screen');
            dashboardScreen.classList.add('hidden-screen');
        }
        if (loginScreen) {
            loginScreen.classList.remove('hidden-screen');
            loginScreen.classList.add('active-screen');
        }
    }
});
