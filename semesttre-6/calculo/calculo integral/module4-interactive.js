/**
 * Módulo 4: Aplicaciones de la Integral - Funcionalidad Interactiva
 * Desarrollado por: JMGV-PTEL
 * Fecha: 2025
 */

class Module4Interactive {
    constructor() {
        this.currentSection = 'overview';
        this.currentExercise = 1;
        this.totalExercises = 8;
        this.userProgress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeMathJax();
        this.setupAnimations();
        this.updateProgress();
    }

    setupEventListeners() {
        // Navegación entre secciones
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-tab')) {
                this.showSection(e.target.getAttribute('onclick').match(/'([^']+)'/)[1]);
            }
        });

        // Toggle de soluciones
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('solution-toggle')) {
                this.toggleSolution(e.target.getAttribute('onclick').match(/'([^']+)'/)[1]);
            }
        });

        // Calculadoras interactivas
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calculate-btn')) {
                this.handleCalculatorClick(e.target);
            }
        });

        // Navegación de ejercicios
        document.addEventListener('click', (e) => {
            if (e.target.onclick && e.target.onclick.toString().includes('nextExercise')) {
                this.nextExercise();
            }
            if (e.target.onclick && e.target.onclick.toString().includes('previousExercise')) {
                this.previousExercise();
            }
        });

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Guardar progreso al cambiar de sección
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-tab')) {
                setTimeout(() => this.saveProgress(), 100);
            }
        });
    }

    initializeMathJax() {
        if (window.MathJax) {
            MathJax.typesetPromise().then(() => {
                console.log('MathJax initialized successfully');
            }).catch((err) => {
                console.error('MathJax initialization failed:', err);
            });
        }
    }

    setupAnimations() {
        // Animación de entrada para las secciones
        const sections = document.querySelectorAll('.content-section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
        });

        // Animación de hover para las tarjetas
        const cards = document.querySelectorAll('.exercise-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Navegación entre secciones
    showSection(sectionId) {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Actualizar navegación
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Encontrar y activar el tab correspondiente
        const activeTab = document.querySelector(`[onclick*="${sectionId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Actualizar progreso
        this.updateProgress();
        
        // Scroll suave a la parte superior
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Toggle de soluciones
    toggleSolution(solutionId) {
        const solution = document.getElementById(solutionId);
        if (solution) {
            if (solution.style.display === 'block') {
                solution.style.display = 'none';
                solution.style.animation = 'fadeOut 0.3s ease-out';
            } else {
                solution.style.display = 'block';
                solution.style.animation = 'fadeIn 0.5s ease-in';
                
                // Re-renderizar MathJax si es necesario
                if (window.MathJax) {
                    MathJax.typesetPromise([solution]);
                }
            }
        }
    }

    // Manejo de calculadoras interactivas
    handleCalculatorClick(button) {
        const buttonText = button.textContent.toLowerCase();
        
        if (buttonText.includes('área')) {
            this.calculateArea();
        } else if (buttonText.includes('volumen')) {
            this.calculateVolume();
        } else if (buttonText.includes('trabajo')) {
            this.calculateWork();
        } else if (buttonText.includes('longitud')) {
            this.calculateArcLength();
        }
    }

    // Calculadora de áreas
    calculateArea() {
        const a = parseFloat(document.getElementById('a1')?.value || 1);
        const b = parseFloat(document.getElementById('b1')?.value || 2);
        const c = parseFloat(document.getElementById('c1')?.value || 0);
        const lower = parseFloat(document.getElementById('lower1')?.value || 0);
        const upper = parseFloat(document.getElementById('upper1')?.value || 3);
        
        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(lower) || isNaN(upper)) {
            this.showError('Por favor, ingresa valores numéricos válidos');
            return;
        }
        
        // Calcular la integral de ax² + bx + c
        const area = (a * (upper**3 - lower**3) / 3) + 
                    (b * (upper**2 - lower**2) / 2) + 
                    (c * (upper - lower));
        
        this.showResult('areaResult', `${area.toFixed(4)} unidades cuadradas`);
    }

    // Calculadora de volúmenes
    calculateVolume() {
        // Implementar cálculo de volúmenes según el método seleccionado
        const method = document.getElementById('volumeMethod')?.value || 'discs';
        const lower = parseFloat(document.getElementById('lowerVol')?.value || 0);
        const upper = parseFloat(document.getElementById('upperVol')?.value || 1);
        
        let volume = 0;
        
        switch(method) {
            case 'discs':
                volume = this.calculateVolumeByDiscs(lower, upper);
                break;
            case 'washers':
                volume = this.calculateVolumeByWashers(lower, upper);
                break;
            case 'shells':
                volume = this.calculateVolumeByShells(lower, upper);
                break;
        }
        
        this.showResult('volumeResult', `${volume.toFixed(4)} unidades cúbicas`);
    }

    calculateVolumeByDiscs(lower, upper) {
        // Ejemplo: y = x²
        return Math.PI * (upper**3 - lower**3) / 3;
    }

    calculateVolumeByWashers(lower, upper) {
        // Ejemplo: entre y = x y y = x²
        return Math.PI * ((upper**3 - lower**3) / 3 - (upper**4 - lower**4) / 4);
    }

    calculateVolumeByShells(lower, upper) {
        // Ejemplo: y = x² alrededor del eje y
        return 2 * Math.PI * (upper**4 - lower**4) / 4;
    }

    // Calculadora de trabajo
    calculateWork() {
        const k = parseFloat(document.getElementById('springK')?.value || 100);
        const stretch = parseFloat(document.getElementById('stretch')?.value || 0.5);
        
        if (isNaN(k) || isNaN(stretch)) {
            this.showError('Por favor, ingresa valores numéricos válidos');
            return;
        }
        
        const work = (k * stretch**2) / 2;
        this.showResult('springWorkResult', `${work.toFixed(2)} julios`);
    }

    // Calculadora de longitud de arco
    calculateArcLength() {
        const lower = parseFloat(document.getElementById('arcLower')?.value || 0);
        const upper = parseFloat(document.getElementById('arcUpper')?.value || 1);
        
        if (isNaN(lower) || isNaN(upper)) {
            this.showError('Por favor, ingresa valores numéricos válidos');
            return;
        }
        
        // Ejemplo: y = x^(3/2)
        const arcLength = this.integrateArcLength(lower, upper);
        this.showResult('arcLengthResult', `${arcLength.toFixed(4)} unidades`);
    }

    integrateArcLength(lower, upper) {
        // Integración numérica para √(1 + (3x/2)²)
        const n = 1000;
        const dx = (upper - lower) / n;
        let sum = 0;
        
        for (let i = 0; i < n; i++) {
            const x = lower + i * dx;
            const derivative = (3 * Math.sqrt(x)) / 2;
            const integrand = Math.sqrt(1 + derivative * derivative);
            sum += integrand * dx;
        }
        
        return sum;
    }

    // Navegación de ejercicios
    nextExercise() {
        if (this.currentExercise < this.totalExercises) {
            this.currentExercise++;
            this.updateExerciseDisplay();
        } else {
            this.showCompletionMessage();
        }
    }

    previousExercise() {
        if (this.currentExercise > 1) {
            this.currentExercise--;
            this.updateExerciseDisplay();
        }
    }

    updateExerciseDisplay() {
        // Ocultar todos los ejercicios
        for (let i = 1; i <= this.totalExercises; i++) {
            const exercise = document.getElementById(`exercise${i}`);
            if (exercise) {
                exercise.style.display = 'none';
            }
        }
        
        // Mostrar el ejercicio actual
        const currentExerciseElement = document.getElementById(`exercise${this.currentExercise}`);
        if (currentExerciseElement) {
            currentExerciseElement.style.display = 'block';
            currentExerciseElement.style.animation = 'slideInUp 0.6s ease-out';
        }
        
        // Actualizar indicadores
        const currentExerciseSpan = document.getElementById('currentExercise');
        const totalExercisesSpan = document.getElementById('totalExercises');
        
        if (currentExerciseSpan) currentExerciseSpan.textContent = this.currentExercise;
        if (totalExercisesSpan) totalExercisesSpan.textContent = this.totalExercises;
        
        // Actualizar barra de progreso
        this.updateExerciseProgress();
        
        // Actualizar botones de navegación
        this.updateNavigationButtons();
    }

    updateExerciseProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = (this.currentExercise / this.totalExercises) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentExercise === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentExercise === this.totalExercises;
            if (this.currentExercise === this.totalExercises) {
                nextBtn.innerHTML = '<i class="fas fa-check"></i> Completar';
            } else {
                nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
            }
        }
    }

    // Funciones de demostración
    showDemo() {
        this.showModal('Demostración Interactiva', 
            'Aquí podrías integrar una visualización de GeoGebra o Desmos para mostrar conceptos de manera interactiva.');
    }

    openAreaSimulator() {
        this.showModal('Simulador de Áreas', 
            'Simulador interactivo para visualizar áreas entre curvas. Integración con GeoGebra recomendada.');
    }

    openVolumeViewer() {
        this.showModal('Visualizador 3D', 
            'Visualizador 3D de sólidos de revolución. Recomendado: Three.js o WebGL.');
    }

    openPhysicsSimulator() {
        this.showModal('Simulador Físico', 
            'Demostraciones interactivas de trabajo, resortes y centros de masa.');
    }

    openApplicationsCalculator() {
        this.showModal('Calculadora de Aplicaciones', 
            'Herramienta integral para calcular áreas, volúmenes, trabajo y otras aplicaciones.');
    }

    // Funciones de utilidad
    showResult(resultId, message) {
        const resultElement = document.getElementById(resultId);
        if (resultElement) {
            resultElement.textContent = message;
            const container = resultElement.closest('.result-display');
            if (container) {
                container.style.display = 'block';
                container.style.animation = 'fadeIn 0.5s ease-in';
            }
        }
    }

    showError(message) {
        // Crear o mostrar elemento de error
        let errorElement = document.getElementById('errorMessage');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'errorMessage';
            errorElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            `;
            document.body.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            errorElement.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 300);
        }, 3000);
    }

    showModal(title, content) {
        // Crear modal si no existe
        let modal = document.getElementById('interactiveModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'interactiveModal';
            modal.innerHTML = `
                <div class="modal-overlay" onclick="this.parentElement.style.display='none'">
                    <div class="modal-content" onclick="event.stopPropagation()">
                        <div class="modal-header">
                            <h3 id="modalTitle"></h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').style.display='none'">&times;</button>
                        </div>
                        <div class="modal-body" id="modalBody"></div>
                    </div>
                </div>
            `;
            
            // Agregar estilos del modal
            const style = document.createElement('style');
            style.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: modalSlideIn 0.3s ease-out;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                }
                .modal-body {
                    padding: 20px;
                }
                @keyframes modalSlideIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(modal);
        }
        
        // Configurar contenido
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').textContent = content;
        
        // Mostrar modal
        modal.querySelector('.modal-overlay').style.display = 'flex';
    }

    showCompletionMessage() {
        this.showModal('¡Felicidades!', 
            `Has completado todos los ejercicios del Módulo 4. Tu progreso ha sido guardado. 
            ¡Excelente trabajo aplicando el cálculo integral a problemas reales!`);
    }

    // Manejo de atajos de teclado
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousExercise();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextExercise();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveProgress();
                    break;
                case 'p':
                    e.preventDefault();
                    window.print();
                    break;
            }
        }
    }

    // Gestión de progreso
    updateProgress() {
        const sections = ['overview', 'areas', 'volumes', 'physics', 'other', 'exercises'];
        const currentIndex = sections.indexOf(this.currentSection);
        const progress = ((currentIndex + 1) / sections.length) * 100;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Actualizar progreso del usuario
        this.userProgress.currentSection = this.currentSection;
        this.userProgress.lastAccess = new Date().toISOString();
    }

    saveProgress() {
        this.userProgress.currentSection = this.currentSection;
        this.userProgress.currentExercise = this.currentExercise;
        this.userProgress.lastAccess = new Date().toISOString();
        
        localStorage.setItem('module4_progress', JSON.stringify(this.userProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('module4_progress');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            currentSection: 'overview',
            currentExercise: 1,
            lastAccess: null,
            completedSections: [],
            completedExercises: []
        };
    }

    // Funciones del menú flotante
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    printPage() {
        window.print();
    }
}

// Funciones globales para compatibilidad con HTML onclick
function showSection(sectionId) {
    if (window.module4Interactive) {
        window.module4Interactive.showSection(sectionId);
    }
}

function toggleSolution(solutionId) {
    if (window.module4Interactive) {
        window.module4Interactive.toggleSolution(solutionId);
    }
}

function nextExercise() {
    if (window.module4Interactive) {
        window.module4Interactive.nextExercise();
    }
}

function previousExercise() {
    if (window.module4Interactive) {
        window.module4Interactive.previousExercise();
    }
}

function calculateArea() {
    if (window.module4Interactive) {
        window.module4Interactive.calculateArea();
    }
}

function calculateSpringWork() {
    if (window.module4Interactive) {
        window.module4Interactive.calculateWork();
    }
}

function showDemo() {
    if (window.module4Interactive) {
        window.module4Interactive.showDemo();
    }
}

function openAreaSimulator() {
    if (window.module4Interactive) {
        window.module4Interactive.openAreaSimulator();
    }
}

function openVolumeViewer() {
    if (window.module4Interactive) {
        window.module4Interactive.openVolumeViewer();
    }
}

function openPhysicsSimulator() {
    if (window.module4Interactive) {
        window.module4Interactive.openPhysicsSimulator();
    }
}

function openApplicationsCalculator() {
    if (window.module4Interactive) {
        window.module4Interactive.openApplicationsCalculator();
    }
}

function scrollToTop() {
    if (window.module4Interactive) {
        window.module4Interactive.scrollToTop();
    }
}

function toggleFullscreen() {
    if (window.module4Interactive) {
        window.module4Interactive.toggleFullscreen();
    }
}

function toggleDarkMode() {
    if (window.module4Interactive) {
        window.module4Interactive.toggleDarkMode();
    }
}

function printPage() {
    if (window.module4Interactive) {
        window.module4Interactive.printPage();
    }
}

function goToModule() {
    window.location.href = 'modulo4_aplicaciones.html';
}

function generateRandomExercise() {
    const exercises = [
        'Calcula el área bajo y = x² desde x = 0 hasta x = 3',
        'Encuentra el volumen al rotar y = √x alrededor del eje x desde x = 0 hasta x = 4',
        'Calcula el trabajo para estirar un resorte con k = 80 N/m de 0 a 0.2 m',
        'Encuentra la longitud de arco de y = x³/2 desde x = 0 hasta x = 2',
        'Calcula el centro de masa de la región bajo y = 4 - x² desde x = -2 hasta x = 2',
        'Encuentra el área entre y = x³ y y = x',
        'Calcula el volumen por método de arandelas entre y = x y y = x²',
        'Determina el trabajo para bombear agua desde un tanque cilíndrico'
    ];
    
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    if (window.module4Interactive) {
        window.module4Interactive.showModal('Ejercicio Aleatorio', randomExercise);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar modo oscuro si está guardado
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Inicializar la funcionalidad interactiva
    window.module4Interactive = new Module4Interactive();
    
    console.log('Módulo 4: Aplicaciones de la Integral - Cargado exitosamente');
});
