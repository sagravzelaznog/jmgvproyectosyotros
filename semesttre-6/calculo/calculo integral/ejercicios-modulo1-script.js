// Script para la página de ejercicios del Módulo 1
// Maneja filtros, generación de ejercicios y seguimiento de progreso

class EjerciciosModulo1Manager {
    constructor() {
        this.exercises = [];
        this.completedExercises = new Set();
        this.correctAnswers = new Set();
        this.startTime = Date.now();
        this.filteredExercises = [];
        
        this.init();
    }

    init() {
        this.loadExercises();
        this.setupFilters();
        this.setupExerciseGenerator();
        this.setupProgressTracking();
        this.loadUserProgress();
        this.updateDisplay();
    }

    // Cargar ejercicios desde el DOM
    loadExercises() {
        const exerciseCards = document.querySelectorAll('.exercise-card');
        this.exercises = Array.from(exerciseCards).map((card, index) => ({
            id: index,
            element: card,
            difficulty: card.dataset.difficulty,
            topic: card.closest('.exercise-section').dataset.topic,
            completed: false,
            correct: false
        }));
        
        this.filteredExercises = [...this.exercises];
    }

    // Configurar filtros
    setupFilters() {
        const difficultyFilter = document.getElementById('difficulty-filter');
        const topicFilter = document.getElementById('topic-filter');
        const shuffleBtn = document.getElementById('shuffle-exercises');

        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (topicFilter) {
            topicFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                this.shuffleExercises();
            });
        }

        // Configurar toggles de soluciones
        document.querySelectorAll('.solution-toggle .toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleSolution(e);
            });
        });
    }

    applyFilters() {
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        const topicFilter = document.getElementById('topic-filter').value;

        this.filteredExercises = this.exercises.filter(exercise => {
            const difficultyMatch = difficultyFilter === 'all' || exercise.difficulty === difficultyFilter;
            const topicMatch = topicFilter === 'all' || exercise.topic === topicFilter;
            return difficultyMatch && topicMatch;
        });

        this.updateDisplay();
    }

    shuffleExercises() {
        // Mezclar ejercicios usando algoritmo Fisher-Yates
        for (let i = this.filteredExercises.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredExercises[i], this.filteredExercises[j]] = [this.filteredExercises[j], this.filteredExercises[i]];
        }
        
        this.updateDisplay();
    }

    updateDisplay() {
        // Ocultar todos los ejercicios
        this.exercises.forEach(exercise => {
            exercise.element.style.display = 'none';
        });

        // Mostrar solo los ejercicios filtrados
        this.filteredExercises.forEach(exercise => {
            exercise.element.style.display = 'block';
        });

        // Actualizar contadores
        this.updateCounters();
    }

    updateCounters() {
        const totalCount = document.getElementById('total-count');
        const completedCount = document.getElementById('completed-count');
        const correctCount = document.getElementById('correct-count');
        const accuracy = document.getElementById('accuracy');

        if (totalCount) {
            totalCount.textContent = this.filteredExercises.length;
        }

        if (completedCount) {
            completedCount.textContent = this.completedExercises.size;
        }

        if (correctCount) {
            correctCount.textContent = this.correctAnswers.size;
        }

        if (accuracy) {
            const accuracyValue = this.completedExercises.size > 0 
                ? Math.round((this.correctAnswers.size / this.completedExercises.size) * 100)
                : 0;
            accuracy.textContent = accuracyValue + '%';
        }
    }

    // Toggle de soluciones
    toggleSolution(e) {
        const solution = e.target.nextElementSibling;
        const btn = e.target;
        
        if (solution.classList.contains('hidden')) {
            solution.classList.remove('hidden');
            btn.textContent = 'Ocultar Solución';
            btn.classList.add('active');
            
            // Marcar ejercicio como completado
            const exerciseCard = e.target.closest('.exercise-card');
            const exerciseId = Array.from(document.querySelectorAll('.exercise-card')).indexOf(exerciseCard);
            this.completedExercises.add(exerciseId);
            
            this.updateProgress();
        } else {
            solution.classList.add('hidden');
            btn.textContent = 'Ver Solución';
            btn.classList.remove('active');
        }
    }

    // Generador de ejercicios adicionales
    setupExerciseGenerator() {
        const generateBtn = document.getElementById('generate-new-exercise');
        const difficultySelect = document.getElementById('generator-difficulty');
        const topicSelect = document.getElementById('generator-topic');

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                const difficulty = difficultySelect.value;
                const topic = topicSelect.value;
                this.generateNewExercise(difficulty, topic);
            });
        }
    }

    generateNewExercise(difficulty, topic) {
        const exerciseTemplates = {
            basic: {
                concepto: [
                    {
                        problem: 'Encuentra una antiderivada de $f(x) = 7x^2$',
                        solution: '$\\frac{7x^3}{3} + C$',
                        steps: [
                            'Identificar que necesitamos una función cuya derivada sea $7x^2$',
                            'Aplicar la regla de la potencia: $\\int 7x^2 \\, dx = 7 \\cdot \\frac{x^3}{3} + C$',
                            'Simplificar: $\\frac{7x^3}{3} + C$'
                        ]
                    },
                    {
                        problem: 'Encuentra todas las antiderivadas de $f(x) = 5x - 2$',
                        solution: '$\\frac{5x^2}{2} - 2x + C$',
                        steps: [
                            'Buscar una función cuya derivada sea $5x - 2$',
                            'Aplicar reglas de derivación: $\\frac{d}{dx}[\\frac{5x^2}{2} - 2x] = 5x - 2$',
                            'Agregar constante de integración'
                        ]
                    }
                ],
                inmediatas: [
                    {
                        problem: 'Evalúa $\\int 6x^4 \\, dx$',
                        solution: '$\\frac{6x^5}{5} + C$',
                        steps: [
                            'Aplicar la regla de la potencia: $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$',
                            '$\\int 6x^4 \\, dx = 6 \\cdot \\frac{x^5}{5} + C$',
                            'Simplificar: $\\frac{6x^5}{5} + C$'
                        ]
                    },
                    {
                        problem: 'Evalúa $\\int (x^3 - 2x + 3) \\, dx$',
                        solution: '$\\frac{x^4}{4} - x^2 + 3x + C$',
                        steps: [
                            'Separar términos: $\\int x^3 \\, dx - 2\\int x \\, dx + 3\\int 1 \\, dx$',
                            'Aplicar regla de la potencia: $\\frac{x^4}{4} - 2 \\cdot \\frac{x^2}{2} + 3x + C$',
                            'Simplificar: $\\frac{x^4}{4} - x^2 + 3x + C$'
                        ]
                    }
                ],
                tecnicas: [
                    {
                        problem: 'Evalúa $\\int (x + 3)^2 \\, dx$',
                        solution: '$\\frac{x^3}{3} + 3x^2 + 9x + C$',
                        steps: [
                            'Expandir: $(x + 3)^2 = x^2 + 6x + 9$',
                            'Integrar término por término: $\\int (x^2 + 6x + 9) \\, dx$',
                            'Aplicar regla de la potencia: $\\frac{x^3}{3} + 6 \\cdot \\frac{x^2}{2} + 9x + C$',
                            'Simplificar: $\\frac{x^3}{3} + 3x^2 + 9x + C$'
                        ]
                    }
                ]
            },
            intermediate: {
                concepto: [
                    {
                        problem: 'Si $F(x) = 4x^3 - 3x^2 + 2x - 1$ es una antiderivada de $f(x)$, encuentra $f(x)$',
                        solution: '$12x^2 - 6x + 2$',
                        steps: [
                            'Si $F(x)$ es una antiderivada de $f(x)$, entonces $f(x) = F\'(x)$',
                            'Derivar $F(x) = 4x^3 - 3x^2 + 2x - 1$',
                            '$F\'(x) = 12x^2 - 6x + 2$'
                        ]
                    }
                ],
                inmediatas: [
                    {
                        problem: 'Evalúa $\\int (3x^5 - 4x^3 + 2x - 1) \\, dx$',
                        solution: '$\\frac{x^6}{2} - x^4 + x^2 - x + C$',
                        steps: [
                            'Separar términos: $3\\int x^5 \\, dx - 4\\int x^3 \\, dx + 2\\int x \\, dx - \\int 1 \\, dx$',
                            'Aplicar regla de la potencia: $3 \\cdot \\frac{x^6}{6} - 4 \\cdot \\frac{x^4}{4} + 2 \\cdot \\frac{x^2}{2} - x + C$',
                            'Simplificar: $\\frac{x^6}{2} - x^4 + x^2 - x + C$'
                        ]
                    }
                ],
                tecnicas: [
                    {
                        problem: 'Evalúa $\\int \\frac{x^4 - 3x^2 + 2}{x^2} \\, dx$',
                        solution: '$\\frac{x^3}{3} - 3x - \\frac{2}{x} + C$',
                        steps: [
                            'Dividir término por término: $\\frac{x^4 - 3x^2 + 2}{x^2} = x^2 - 3 + \\frac{2}{x^2}$',
                            'Reescribir: $x^2 - 3 + 2x^{-2}$',
                            'Integrar: $\\frac{x^3}{3} - 3x + 2 \\cdot \\frac{x^{-1}}{-1} + C$',
                            'Simplificar: $\\frac{x^3}{3} - 3x - \\frac{2}{x} + C$'
                        ]
                    }
                ]
            },
            advanced: {
                concepto: [
                    {
                        problem: 'Verifica que $F(x) = \\frac{x^5}{5} - \\frac{2x^3}{3} + x$ es una antiderivada de $f(x) = x^4 - 2x^2 + 1$',
                        solution: 'Verificación correcta',
                        steps: [
                            'Derivar $F(x) = \\frac{x^5}{5} - \\frac{2x^3}{3} + x$',
                            '$F\'(x) = 5 \\cdot \\frac{x^4}{5} - 2 \\cdot \\frac{3x^2}{3} + 1 = x^4 - 2x^2 + 1$',
                            'Comparar con $f(x) = x^4 - 2x^2 + 1$ ✓'
                        ]
                    }
                ],
                inmediatas: [
                    {
                        problem: 'Evalúa $\\int (\\sin x + \\cos x + \\sec^2 x) \\, dx$',
                        solution: '$-\\cos x + \\sin x + \\tan x + C$',
                        steps: [
                            'Separar términos: $\\int \\sin x \\, dx + \\int \\cos x \\, dx + \\int \\sec^2 x \\, dx$',
                            'Aplicar integrales trigonométricas básicas',
                            '$= -\\cos x + \\sin x + \\tan x + C$'
                        ]
                    }
                ],
                tecnicas: [
                    {
                        problem: 'Evalúa $\\int \\sin x \\cos x \\, dx$',
                        solution: '$\\frac{\\sin^2 x}{2} + C$',
                        steps: [
                            'Usar identidad: $\\sin x \\cos x = \\frac{\\sin(2x)}{2}$',
                            'Integrar: $\\int \\frac{\\sin(2x)}{2} \\, dx = \\frac{1}{2} \\cdot \\frac{-\\cos(2x)}{2} + C$',
                            'Simplificar: $-\\frac{\\cos(2x)}{4} + C$',
                            'Alternativamente, usar sustitución: $u = \\sin x$, $du = \\cos x \\, dx$',
                            '$\\int u \\, du = \\frac{u^2}{2} + C = \\frac{\\sin^2 x}{2} + C$'
                        ]
                    }
                ]
            }
        };

        let selectedExercises = [];
        
        if (topic === 'all') {
            // Mezclar ejercicios de todos los temas
            Object.values(exerciseTemplates[difficulty]).forEach(topicExercises => {
                selectedExercises.push(...topicExercises);
            });
        } else {
            selectedExercises = exerciseTemplates[difficulty][topic] || [];
        }

        if (selectedExercises.length === 0) {
            this.showMessage('No hay ejercicios disponibles para la combinación seleccionada.', 'warning');
            return;
        }

        const randomExercise = selectedExercises[Math.floor(Math.random() * selectedExercises.length)];
        this.displayGeneratedExercise(randomExercise);
    }

    displayGeneratedExercise(exercise) {
        const container = document.getElementById('generated-exercise-container');
        
        const exerciseId = 'generated_' + Date.now();
        
        container.innerHTML = `
            <div class="generated-exercise-card">
                <div class="exercise-header">
                    <h3>Ejercicio Generado</h3>
                    <div class="difficulty-badge ${document.getElementById('generator-difficulty').value}">
                        ${document.getElementById('generator-difficulty').value.charAt(0).toUpperCase() + 
                          document.getElementById('generator-difficulty').value.slice(1)}
                    </div>
                </div>
                <div class="exercise-content">
                    <p><strong>Problema:</strong> ${exercise.problem}</p>
                    <div class="solution-toggle">
                        <button class="toggle-btn" data-exercise-id="${exerciseId}">Ver Solución</button>
                        <div class="solution hidden" id="solution-${exerciseId}">
                            <div class="solution-steps">
                                ${exercise.steps.map((step, index) => `
                                    <div class="step">
                                        <h4>Paso ${index + 1}:</h4>
                                        <p>${step}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="final-answer">
                                <p><strong>Respuesta:</strong> ${exercise.solution}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="exercise-actions">
                    <button class="btn-secondary" onclick="this.closest('.generated-exercise-card').remove()">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                    <button class="btn-primary" onclick="ejerciciosManager.generateNewExercise('${document.getElementById('generator-difficulty').value}', '${document.getElementById('generator-topic').value}')">
                        <i class="fas fa-plus"></i> Otro Ejercicio
                    </button>
                </div>
            </div>
        `;

        // Configurar evento para el nuevo toggle
        const toggleBtn = container.querySelector('.toggle-btn');
        toggleBtn.addEventListener('click', (e) => {
            this.toggleSolution(e);
        });
    }

    // Seguimiento de progreso
    setupProgressTracking() {
        // Actualizar tiempo cada minuto
        setInterval(() => {
            this.updateTimeSpent();
        }, 60000);

        // Guardar progreso cada 5 minutos
        setInterval(() => {
            this.saveUserProgress();
        }, 300000);
    }

    updateTimeSpent() {
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000 / 60);
        const timeElement = document.getElementById('time-spent');
        if (timeElement) {
            timeElement.textContent = timeSpent + ' min';
        }
    }

    updateProgress() {
        this.updateCounters();
        this.updateProgressCards();
        this.saveUserProgress();
    }

    updateProgressCards() {
        const completedExercises = document.getElementById('completed-exercises');
        const correctExercises = document.getElementById('correct-exercises');
        const accuracyPercentage = document.getElementById('accuracy-percentage');

        if (completedExercises) {
            completedExercises.textContent = this.completedExercises.size;
        }

        if (correctExercises) {
            correctExercises.textContent = this.correctAnswers.size;
        }

        if (accuracyPercentage) {
            const accuracy = this.completedExercises.size > 0 
                ? Math.round((this.correctAnswers.size / this.completedExercises.size) * 100)
                : 0;
            accuracyPercentage.textContent = accuracy + '%';
        }
    }

    // Gestión de datos del usuario
    loadUserProgress() {
        const savedProgress = localStorage.getItem('ejercicios_modulo1_progress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.completedExercises = new Set(progress.completedExercises || []);
            this.correctAnswers = new Set(progress.correctAnswers || []);
            this.startTime = progress.startTime || Date.now();
            
            this.updateProgress();
        }
    }

    saveUserProgress() {
        const progress = {
            completedExercises: Array.from(this.completedExercises),
            correctAnswers: Array.from(this.correctAnswers),
            startTime: this.startTime,
            lastUpdated: Date.now()
        };
        
        localStorage.setItem('ejercicios_modulo1_progress', JSON.stringify(progress));
        
        // También guardar en Firebase si está disponible
        if (window.authManager && window.authManager.currentUser) {
            window.authManager.updateModuleProgress('modulo1_ejercicios', 
                Math.round((this.completedExercises.size / this.exercises.length) * 100));
        }
    }

    // Utilidades
    showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Agregar al DOM
        document.body.appendChild(messageDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Limpieza
    cleanup() {
        this.saveUserProgress();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.ejerciciosManager = new EjerciciosModulo1Manager();
    
    // Limpiar al salir de la página
    window.addEventListener('beforeunload', () => {
        if (window.ejerciciosManager) {
            window.ejerciciosManager.cleanup();
        }
    });
});

// Funciones auxiliares globales
function toggleSolution(element) {
    const solution = element.nextElementSibling;
    const btn = element;
    
    if (solution.classList.contains('hidden')) {
        solution.classList.remove('hidden');
        btn.textContent = 'Ocultar Solución';
        btn.classList.add('active');
    } else {
        solution.classList.add('hidden');
        btn.textContent = 'Ver Solución';
        btn.classList.remove('active');
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EjerciciosModulo1Manager;
}
