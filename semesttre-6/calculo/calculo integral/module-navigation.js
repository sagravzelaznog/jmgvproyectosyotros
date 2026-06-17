// Navegación entre módulos del curso de Cálculo Integral
// Maneja la navegación, progreso y transiciones entre módulos

class ModuleNavigation {
    constructor() {
        this.currentModule = 'modulo1';
        this.modules = [
            {
                id: 'modulo1',
                name: 'Antiderivadas e Integrales Indefinidas',
                url: 'modulo1_antiderivadas.html',
                duration: '2 semanas',
                topics: ['Concepto de Antiderivada', 'Integrales Inmediatas', 'Técnicas Básicas'],
                prerequisites: []
            },
            {
                id: 'modulo2',
                name: 'Sumas de Riemann e Integral Definida',
                url: 'modulo2_integral_definida.html',
                duration: '3 semanas',
                topics: ['Aproximación de Áreas', 'Integral Definida', 'Teorema Fundamental'],
                prerequisites: ['modulo1']
            },
            {
                id: 'modulo3',
                name: 'Técnicas de Integración',
                url: 'modulo3_tecnicas_integracion.html',
                duration: '4 semanas',
                topics: ['Sustitución', 'Integración por Partes', 'Fracciones Parciales'],
                prerequisites: ['modulo1', 'modulo2']
            },
            {
                id: 'modulo4',
                name: 'Aplicaciones de la Integral',
                url: 'modulo4_aplicaciones.html',
                duration: '4 semanas',
                topics: ['Áreas', 'Volúmenes', 'Aplicaciones Físicas'],
                prerequisites: ['modulo1', 'modulo2', 'modulo3']
            },
            {
                id: 'modulo5',
                name: 'Ecuaciones Diferenciales',
                url: 'modulo5_ecuaciones_diferenciales.html',
                duration: '3 semanas',
                topics: ['Introducción', 'Primer Orden', 'Aplicaciones'],
                prerequisites: ['modulo1', 'modulo2', 'modulo3', 'modulo4']
            }
        ];
        
        this.init();
    }

    init() {
        this.detectCurrentModule();
        this.setupNavigation();
        this.updateModuleStatus();
        this.setupProgressTracking();
    }

    detectCurrentModule() {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();
        
        // Detectar módulo actual basado en la URL
        if (currentFile.includes('modulo1')) {
            this.currentModule = 'modulo1';
        } else if (currentFile.includes('modulo2')) {
            this.currentModule = 'modulo2';
        } else if (currentFile.includes('modulo3')) {
            this.currentModule = 'modulo3';
        } else if (currentFile.includes('modulo4')) {
            this.currentModule = 'modulo4';
        } else if (currentFile.includes('modulo5')) {
            this.currentModule = 'modulo5';
        }
    }

    setupNavigation() {
        // Configurar navegación principal
        this.setupMainNavigation();
        
        // Configurar navegación entre módulos
        this.setupModuleNavigation();
        
        // Configurar breadcrumbs
        this.setupBreadcrumbs();
    }

    setupMainNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    this.navigateToModule(href);
                }
            });
        });
    }

    setupModuleNavigation() {
        // Botones de navegación entre módulos
        const prevBtn = document.getElementById('prev-module');
        const nextBtn = document.getElementById('next-module');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateToPreviousModule();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateToNextModule();
            });
        }

        // Actualizar estado de botones
        this.updateNavigationButtons();
    }

    setupBreadcrumbs() {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (breadcrumb) {
            this.updateBreadcrumb();
        }
    }

    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;

        const currentModuleData = this.modules.find(m => m.id === this.currentModule);
        if (!currentModuleData) return;

        breadcrumb.innerHTML = `
            <a href="index.html">Inicio</a>
            <span class="separator">></span>
            <a href="modulo1_antiderivadas.html">Cálculo Integral</a>
            <span class="separator">></span>
            <span>${currentModuleData.name}</span>
        `;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-module');
        const nextBtn = document.getElementById('next-module');
        const currentIndex = this.modules.findIndex(m => m.id === this.currentModule);

        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            if (currentIndex > 0) {
                prevBtn.innerHTML = `<i class="fas fa-arrow-left"></i> ${this.modules[currentIndex - 1].name}`;
            }
        }

        if (nextBtn) {
            const hasAccess = this.checkModuleAccess(this.modules[currentIndex + 1]?.id);
            nextBtn.disabled = currentIndex === this.modules.length - 1 || !hasAccess;
            if (currentIndex < this.modules.length - 1) {
                nextBtn.innerHTML = `${this.modules[currentIndex + 1].name} <i class="fas fa-arrow-right"></i>`;
            }
        }
    }

    checkModuleAccess(moduleId) {
        if (!moduleId) return false;
        
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return false;

        // Verificar prerrequisitos
        return module.prerequisites.every(prereq => {
            return this.isModuleCompleted(prereq);
        });
    }

    isModuleCompleted(moduleId) {
        if (!window.authManager) return false;
        
        const progress = window.authManager.getModuleProgress(moduleId);
        return progress >= 70; // Considerar completado si tiene 70% o más
    }

    navigateToModule(url) {
        // Guardar progreso antes de navegar
        this.saveCurrentProgress();
        
        // Navegar a la nueva página
        window.location.href = url;
    }

    navigateToPreviousModule() {
        const currentIndex = this.modules.findIndex(m => m.id === this.currentModule);
        if (currentIndex > 0) {
            const prevModule = this.modules[currentIndex - 1];
            this.navigateToModule(prevModule.url);
        }
    }

    navigateToNextModule() {
        const currentIndex = this.modules.findIndex(m => m.id === this.currentModule);
        if (currentIndex < this.modules.length - 1) {
            const nextModule = this.modules[currentIndex + 1];
            if (this.checkModuleAccess(nextModule.id)) {
                this.navigateToModule(nextModule.url);
            } else {
                this.showPrerequisitesMessage(nextModule);
            }
        }
    }

    showPrerequisitesMessage(module) {
        const message = `
            <div class="prerequisites-modal">
                <div class="modal-content">
                    <h3><i class="fas fa-lock"></i> Módulo Bloqueado</h3>
                    <p>Para acceder a <strong>${module.name}</strong>, necesitas completar primero:</p>
                    <ul>
                        ${module.prerequisites.map(prereq => {
                            const prereqModule = this.modules.find(m => m.id === prereq);
                            const isCompleted = this.isModuleCompleted(prereq);
                            return `<li class="${isCompleted ? 'completed' : 'pending'}">
                                <i class="fas fa-${isCompleted ? 'check-circle' : 'clock'}"></i>
                                ${prereqModule?.name || prereq}
                            </li>`;
                        }).join('')}
                    </ul>
                    <button class="btn-primary" onclick="this.closest('.prerequisites-modal').remove()">
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', message);
    }

    updateModuleStatus() {
        // Actualizar estado visual de los módulos en la navegación
        const navLinks = document.querySelectorAll('.nav-link[data-module]');
        navLinks.forEach(link => {
            const moduleId = link.dataset.module;
            const progress = window.authManager?.getModuleProgress(moduleId) || 0;
            
            // Remover clases previas
            link.classList.remove('completed', 'in-progress', 'locked');
            
            if (progress >= 70) {
                link.classList.add('completed');
                link.innerHTML += ' <i class="fas fa-check-circle"></i>';
            } else if (progress > 0) {
                link.classList.add('in-progress');
                link.innerHTML += ' <i class="fas fa-clock"></i>';
            } else if (!this.checkModuleAccess(moduleId)) {
                link.classList.add('locked');
                link.innerHTML += ' <i class="fas fa-lock"></i>';
            }
        });
    }

    setupProgressTracking() {
        // Actualizar progreso cada 30 segundos
        setInterval(() => {
            this.updateModuleStatus();
            this.updateNavigationButtons();
        }, 30000);

        // Guardar progreso al salir de la página
        window.addEventListener('beforeunload', () => {
            this.saveCurrentProgress();
        });
    }

    saveCurrentProgress() {
        if (!window.authManager) return;
        
        // Obtener progreso actual del módulo
        const currentProgress = this.calculateCurrentModuleProgress();
        
        // Actualizar en AuthManager
        window.authManager.updateModuleProgress(this.currentModule, currentProgress);
    }

    calculateCurrentModuleProgress() {
        // Calcular progreso basado en actividades completadas
        let progress = 0;
        
        // Verificar secciones visitadas
        const sections = document.querySelectorAll('.content-section');
        const visitedSections = document.querySelectorAll('.content-section.active, .nav-btn.completed').length;
        progress += (visitedSections / sections.length) * 30;
        
        // Verificar ejercicios completados
        const exercises = document.querySelectorAll('.exercise-card');
        const completedExercises = document.querySelectorAll('.solution-toggle .toggle-btn.active').length;
        progress += (completedExercises / exercises.length) * 40;
        
        // Verificar quiz completado
        const quizCompleted = document.querySelector('.quiz-results')?.style.display !== 'none';
        if (quizCompleted) {
            progress += 30;
        }
        
        return Math.min(100, Math.round(progress));
    }

    // Métodos de utilidad
    getModuleInfo(moduleId) {
        return this.modules.find(m => m.id === moduleId);
    }

    getCurrentModuleInfo() {
        return this.getModuleInfo(this.currentModule);
    }

    getAllModules() {
        return this.modules;
    }

    getCompletedModules() {
        return this.modules.filter(m => this.isModuleCompleted(m.id));
    }

    getNextAvailableModule() {
        return this.modules.find(m => !this.isModuleCompleted(m.id) && this.checkModuleAccess(m.id));
    }

    // Generar reporte de progreso
    generateProgressReport() {
        const report = {
            currentModule: this.currentModule,
            overallProgress: window.authManager?.getOverallProgress() || 0,
            modules: this.modules.map(module => ({
                id: module.id,
                name: module.name,
                progress: window.authManager?.getModuleProgress(module.id) || 0,
                completed: this.isModuleCompleted(module.id),
                accessible: this.checkModuleAccess(module.id)
            })),
            timeSpent: window.authManager?.calculateTimeSpent() || 0,
            exercisesCompleted: window.authManager?.countCompletedExercises() || 0
        };
        
        return report;
    }

    // Exportar progreso
    exportProgress() {
        const report = this.generateProgressReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `progreso_calculo_integral_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Inicializar navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.moduleNavigation = new ModuleNavigation();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModuleNavigation;
}
