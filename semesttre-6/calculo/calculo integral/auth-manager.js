// Gestión de autenticación y usuarios para Cálculo Integral
// Maneja login, registro, progreso y acceso a contenido

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userProgress = {};
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            // Verificar si Firebase está disponible
            if (typeof firebase === 'undefined') {
                console.warn('Firebase no está disponible. Usando modo offline.');
                this.setupOfflineMode();
                return;
            }

            // Configurar listeners de autenticación
            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    this.loadUserProgress();
                } else {
                    this.showLoginForm();
                }
            });

            this.isInitialized = true;
        } catch (error) {
            console.error('Error inicializando AuthManager:', error);
            this.setupOfflineMode();
        }
    }

    setupOfflineMode() {
        // Crear usuario temporal para modo offline
        this.currentUser = {
            uid: 'offline_user',
            email: 'usuario@offline.com',
            displayName: 'Usuario Offline'
        };
        
        this.loadOfflineProgress();
        this.updateUI();
    }

    // Autenticación
    async login(email, password) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            this.currentUser = userCredential.user;
            await this.loadUserProgress();
            this.updateUI();
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: error.message };
        }
    }

    async register(email, password, displayName) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            // Actualizar perfil
            await userCredential.user.updateProfile({
                displayName: displayName
            });

            // Crear documento de usuario en Firestore
            await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                email: email,
                name: displayName,
                role: 'student',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                courseAccess: {
                    calculoIntegral: true
                },
                progress: {
                    modulo1: 0,
                    modulo2: 0,
                    modulo3: 0,
                    modulo4: 0,
                    modulo5: 0
                }
            });

            this.currentUser = userCredential.user;
            await this.loadUserProgress();
            this.updateUI();
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await firebase.auth().signOut();
            this.currentUser = null;
            this.userProgress = {};
            this.showLoginForm();
        } catch (error) {
            console.error('Error en logout:', error);
        }
    }

    async resetPassword(email) {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            return { success: true, message: 'Se ha enviado un email para restablecer la contraseña' };
        } catch (error) {
            console.error('Error enviando email de reset:', error);
            return { success: false, error: error.message };
        }
    }

    // Gestión de progreso
    async loadUserProgress() {
        if (!this.currentUser) return;

        try {
            if (firebase.firestore) {
                const userDoc = await firebase.firestore()
                    .collection('users')
                    .doc(this.currentUser.uid)
                    .get();

                if (userDoc.exists) {
                    this.userProgress = userDoc.data();
                }
            } else {
                this.loadOfflineProgress();
            }
        } catch (error) {
            console.error('Error cargando progreso:', error);
            this.loadOfflineProgress();
        }
    }

    loadOfflineProgress() {
        // Cargar progreso desde localStorage en modo offline
        const savedProgress = localStorage.getItem('calculo_integral_progress');
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
        } else {
            this.userProgress = {
                progress: {
                    modulo1: 0,
                    modulo2: 0,
                    modulo3: 0,
                    modulo4: 0,
                    modulo5: 0
                }
            };
        }
    }

    async updateModuleProgress(moduleId, progress) {
        if (!this.currentUser) return;

        // Actualizar progreso local
        if (!this.userProgress.progress) {
            this.userProgress.progress = {};
        }
        this.userProgress.progress[moduleId] = Math.max(
            this.userProgress.progress[moduleId] || 0, 
            progress
        );

        try {
            if (firebase.firestore) {
                await firebase.firestore()
                    .collection('users')
                    .doc(this.currentUser.uid)
                    .update({
                        [`progress.${moduleId}`]: this.userProgress.progress[moduleId]
                    });
            }
        } catch (error) {
            console.error('Error actualizando progreso:', error);
        }

        // Guardar en localStorage como respaldo
        localStorage.setItem('calculo_integral_progress', JSON.stringify(this.userProgress));
    }

    getModuleProgress(moduleId) {
        return this.userProgress.progress?.[moduleId] || 0;
    }

    getOverallProgress() {
        const modules = ['modulo1', 'modulo2', 'modulo3', 'modulo4', 'modulo5'];
        const totalProgress = modules.reduce((sum, moduleId) => {
            return sum + this.getModuleProgress(moduleId);
        }, 0);
        
        return Math.round(totalProgress / modules.length);
    }

    // UI y formularios
    showLoginForm() {
        // Crear modal de login si no existe
        let loginModal = document.getElementById('login-modal');
        if (!loginModal) {
            loginModal = this.createLoginModal();
            document.body.appendChild(loginModal);
        }
        
        loginModal.style.display = 'flex';
    }

    createLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'login-modal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h2><i class="fas fa-calculator"></i> Cálculo Integral</h2>
                    <p>Accede a tu cuenta para continuar</p>
                </div>
                
                <div class="auth-tabs">
                    <button class="tab-btn active" data-tab="login">Iniciar Sesión</button>
                    <button class="tab-btn" data-tab="register">Registrarse</button>
                </div>

                <!-- Formulario de Login -->
                <form id="login-form" class="auth-form active">
                    <div class="form-group">
                        <label for="login-email">Email:</label>
                        <input type="email" id="login-email" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Contraseña:</label>
                        <input type="password" id="login-password" required>
                    </div>
                    <button type="submit" class="btn-primary">Iniciar Sesión</button>
                    <button type="button" class="btn-link" id="forgot-password">¿Olvidaste tu contraseña?</button>
                </form>

                <!-- Formulario de Registro -->
                <form id="register-form" class="auth-form">
                    <div class="form-group">
                        <label for="register-name">Nombre:</label>
                        <input type="text" id="register-name" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email:</label>
                        <input type="email" id="register-email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Contraseña:</label>
                        <input type="password" id="register-password" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="register-confirm">Confirmar Contraseña:</label>
                        <input type="password" id="register-confirm" required>
                    </div>
                    <button type="submit" class="btn-primary">Registrarse</button>
                </form>

                <div class="auth-footer">
                    <button class="btn-secondary" id="offline-mode">Continuar sin cuenta</button>
                </div>
            </div>
        `;

        this.setupAuthModalEvents(modal);
        return modal;
    }

    setupAuthModalEvents(modal) {
        // Tabs
        const tabBtns = modal.querySelectorAll('.tab-btn');
        const forms = modal.querySelectorAll('.auth-form');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Actualizar tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mostrar formulario correspondiente
                forms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tab}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });

        // Login form
        const loginForm = modal.querySelector('#login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = modal.querySelector('#login-email').value;
            const password = modal.querySelector('#login-password').value;
            
            const result = await this.login(email, password);
            if (result.success) {
                modal.style.display = 'none';
            } else {
                this.showMessage(result.error, 'error');
            }
        });

        // Register form
        const registerForm = modal.querySelector('#register-form');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = modal.querySelector('#register-name').value;
            const email = modal.querySelector('#register-email').value;
            const password = modal.querySelector('#register-password').value;
            const confirm = modal.querySelector('#register-confirm').value;
            
            if (password !== confirm) {
                this.showMessage('Las contraseñas no coinciden', 'error');
                return;
            }
            
            const result = await this.register(email, password, name);
            if (result.success) {
                modal.style.display = 'none';
            } else {
                this.showMessage(result.error, 'error');
            }
        });

        // Forgot password
        const forgotBtn = modal.querySelector('#forgot-password');
        forgotBtn.addEventListener('click', async () => {
            const email = modal.querySelector('#login-email').value;
            if (!email) {
                this.showMessage('Ingresa tu email primero', 'warning');
                return;
            }
            
            const result = await this.resetPassword(email);
            this.showMessage(result.message || result.error, result.success ? 'success' : 'error');
        });

        // Offline mode
        const offlineBtn = modal.querySelector('#offline-mode');
        offlineBtn.addEventListener('click', () => {
            this.setupOfflineMode();
            modal.style.display = 'none';
        });
    }

    updateUI() {
        const userName = document.getElementById('user-name');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (userName) {
            userName.textContent = this.currentUser?.displayName || this.currentUser?.email || 'Usuario';
        }
        
        if (logoutBtn) {
            logoutBtn.style.display = this.currentUser ? 'block' : 'none';
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Verificar acceso a módulos
    hasAccessToModule(moduleId) {
        if (!this.currentUser) return false;
        
        // En modo offline, permitir acceso a todos los módulos
        if (this.currentUser.uid === 'offline_user') return true;
        
        return this.userProgress.courseAccess?.calculoIntegral === true;
    }

    // Obtener estadísticas del usuario
    getUserStats() {
        return {
            overallProgress: this.getOverallProgress(),
            moduleProgress: this.userProgress.progress || {},
            timeSpent: this.calculateTimeSpent(),
            exercisesCompleted: this.countCompletedExercises()
        };
    }

    calculateTimeSpent() {
        // Calcular tiempo total invertido (implementación básica)
        const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
        return sessions.reduce((total, session) => total + session.duration, 0);
    }

    countCompletedExercises() {
        // Contar ejercicios completados (implementación básica)
        const exercises = JSON.parse(localStorage.getItem('completed_exercises') || '[]');
        return exercises.length;
    }
}

// Inicializar AuthManager cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}