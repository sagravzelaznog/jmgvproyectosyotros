// Navigation component for all modules
class ModuleNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.createNavigation();
        this.setupEventListeners();
        this.checkAuthentication();
    }

    createNavigation() {
        const navigationHTML = `
            <header class="module-header-nav">
                <div class="nav-container">
                    <div class="nav-logo">
                        <i class="fas fa-calculator"></i>
                        <h1>Cálculo Integral</h1>
                    </div>
                    <nav class="nav-links">
                        <a href="index.html" class="nav-link">
                            <i class="fas fa-home"></i> Portal Principal
                        </a>
                        <a href="modulo1_antiderivadas.html" class="nav-link">
                            <i class="fas fa-function"></i> Módulo 1
                        </a>
                        <a href="modulo2_integral_definida.html" class="nav-link">
                            <i class="fas fa-chart-area"></i> Módulo 2
                        </a>
                        <a href="modulo3_interactivo.html" class="nav-link">
                            <i class="fas fa-tools"></i> Módulo 3
                        </a>
                        <a href="index_modulo4.html" class="nav-link">
                            <i class="fas fa-rocket"></i> Módulo 4
                        </a>
                        <a href="modulo5_ecuaciones_diferenciales.html" class="nav-link">
                            <i class="fas fa-infinity"></i> Módulo 5
                        </a>
                    </nav>
                    <div class="user-info">
                        <span class="user-name" id="user-name">Usuario</span>
                        <button class="btn-logout" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>
        `;

        // Add navigation styles
        const navigationStyles = `
            <style>
                .module-header-nav {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 15px 0;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    margin-bottom: 20px;
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .nav-logo i {
                    font-size: 1.8rem;
                    color: #667eea;
                }

                .nav-logo h1 {
                    font-size: 1.5rem;
                    color: #333;
                    font-weight: 700;
                    margin: 0;
                }

                .nav-links {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }

                .nav-link {
                    text-decoration: none;
                    color: #333;
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: 20px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                }

                .nav-link:hover {
                    background: #667eea;
                    color: white;
                    transform: translateY(-2px);
                }

                .nav-link.active {
                    background: #667eea;
                    color: white;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .user-name {
                    color: #333;
                    font-weight: 500;
                    font-size: 0.9rem;
                }

                .btn-logout {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .btn-logout:hover {
                    background: #c82333;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .nav-container {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .nav-links {
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .nav-link {
                        font-size: 0.8rem;
                        padding: 6px 12px;
                    }
                }
            </style>
        `;

        // Insert styles and navigation
        document.head.insertAdjacentHTML('beforeend', navigationStyles);
        document.body.insertAdjacentHTML('afterbegin', navigationHTML);
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    const { cerrarSesion } = await import('./auth-manager.js');
                    const resultado = await cerrarSesion();
                    if (resultado.success) {
                        window.location.href = 'login.html';
                    }
                } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                    window.location.href = 'login.html';
                }
            });
        }
    }

    async checkAuthentication() {
        try {
            const { observarEstadoAuth } = await import('./auth-manager.js');
            observarEstadoAuth((estado) => {
                if (estado.autenticado) {
                    this.updateUserInfo(estado.usuario, estado.datos);
                } else {
                    // Redirigir al login si no está autenticado
                    window.location.href = 'login.html';
                }
            });
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            // Si hay error, permitir acceso (para desarrollo)
        }
    }

    updateUserInfo(usuario, datos) {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = datos?.displayName || usuario.email;
        }

        // Marcar el módulo activo
        this.setActiveModule();
    }

    setActiveModule() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ModuleNavigation();
});

// Export for manual initialization if needed
window.ModuleNavigation = ModuleNavigation;
