// Módulo 1: Antiderivadas e Integrales Indefinidas - JavaScript
// Funcionalidades interactivas y gestión del módulo

class Modulo1Manager {
    constructor() {
        this.currentSection = 'concepto';
        this.moduleProgress = 0;
        this.timeSpent = 0;
        this.startTime = Date.now();
        this.quizData = [];
        this.currentQuizQuestion = 0;
        this.quizAnswers = [];
        this.quizTimer = null;
        this.timeRemaining = 20 * 60; // 20 minutos en segundos
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupInteractiveElements();
        this.setupQuiz();
        this.setupExerciseGenerator();
        this.startTimeTracking();
        this.loadUserProgress();
    }

    // Navegación entre secciones
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn[data-section]');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
                this.updateNavigationButtons();
            });
        });
    }

    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            this.updateProgress();
        }

        // Actualizar botones de navegación
        document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });
    }

    updateNavigationButtons() {
        const sections = ['concepto', 'inmediatas', 'tecnicas', 'ejercicios', 'quiz'];
        const currentIndex = sections.indexOf(this.currentSection);
        
        document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
            const btnIndex = sections.indexOf(btn.dataset.section);
            if (btnIndex <= currentIndex) {
                btn.classList.add('completed');
            } else {
                btn.classList.remove('completed');
            }
        });
    }

    // Elementos interactivos
    setupInteractiveElements() {
        // Botones de opciones en quizzes
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleOptionClick(e);
            });
        });

        // Toggles de soluciones en ejercicios
        document.querySelectorAll('.solution-toggle .toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleSolution(e);
            });
        });

        // Botones de verificación
        document.querySelectorAll('.verify-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.verifyAnswer(e);
            });
        });
    }

    handleOptionClick(e) {
        const btn = e.target;
        const isCorrect = btn.dataset.answer === 'correct';
        const feedback = btn.closest('.question').querySelector('.feedback');
        
        // Remover clases previas
        btn.classList.remove('correct', 'incorrect');
        btn.parentElement.querySelectorAll('.option-btn').forEach(b => {
            b.classList.remove('correct', 'incorrect');
        });

        // Agregar clase apropiada
        btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Mostrar retroalimentación
        if (feedback) {
            if (isCorrect) {
                feedback.innerHTML = '<i class="fas fa-check-circle"></i> ¡Correcto!';
                feedback.className = 'feedback correct';
            } else {
                feedback.innerHTML = '<i class="fas fa-times-circle"></i> Incorrecto. Inténtalo de nuevo.';
                feedback.className = 'feedback incorrect';
            }
        }

        // Deshabilitar otros botones
        btn.parentElement.querySelectorAll('.option-btn').forEach(b => {
            if (b !== btn) b.disabled = true;
        });

        this.updateProgress();
    }

    toggleSolution(e) {
        const solution = e.target.nextElementSibling;
        const btn = e.target;
        
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

    // Generador de ejercicios
    setupExerciseGenerator() {
        const generateBtn = document.getElementById('generate-exercise');
        const difficultySelect = document.getElementById('difficulty-select');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                const difficulty = difficultySelect.value;
                this.generateRandomExercise(difficulty);
            });
        }
    }

    generateRandomExercise(difficulty) {
        const exercises = {
            basic: [
                {
                    problem: 'Evalúa $$\\int 3x^2 \\, dx$$',
                    solution: '$$x^3 + C$$',
                    steps: [
                        'Aplicar la regla de la potencia: $$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$$',
                        '$$\\int 3x^2 \\, dx = 3 \\cdot \\frac{x^3}{3} + C$$',
                        'Simplificar: $$x^3 + C$$'
                    ]
                },
                {
                    problem: 'Evalúa $$\\int (2x + 1) \\, dx$$',
                    solution: '$$x^2 + x + C$$',
                    steps: [
                        'Separar términos: $$\\int 2x \\, dx + \\int 1 \\, dx$$',
                        'Aplicar reglas: $$2 \\cdot \\frac{x^2}{2} + x + C$$',
                        'Simplificar: $$x^2 + x + C$$'
                    ]
                }
            ],
            intermediate: [
                {
                    problem: 'Evalúa $$\\int (x^2 - 3x + 2) \\, dx$$',
                    solution: '$$\\frac{x^3}{3} - \\frac{3x^2}{2} + 2x + C$$',
                    steps: [
                        'Separar términos: $$\\int x^2 \\, dx - 3\\int x \\, dx + 2\\int 1 \\, dx$$',
                        'Aplicar regla de la potencia: $$\\frac{x^3}{3} - 3 \\cdot \\frac{x^2}{2} + 2x + C$$',
                        'Simplificar: $$\\frac{x^3}{3} - \\frac{3x^2}{2} + 2x + C$$'
                    ]
                },
                {
                    problem: 'Evalúa $$\\int \\frac{x^3 + 2x}{x} \\, dx$$',
                    solution: '$$\\frac{x^3}{3} + 2\\ln|x| + C$$',
                    steps: [
                        'Dividir término por término: $$\\frac{x^3}{x} + \\frac{2x}{x} = x^2 + 2$$',
                        'Integrar: $$\\int x^2 \\, dx + \\int 2 \\, dx$$',
                        'Aplicar reglas: $$\\frac{x^3}{3} + 2x + C$$'
                    ]
                }
            ],
            advanced: [
                {
                    problem: 'Evalúa $$\\int (x + 1)^3 \\, dx$$',
                    solution: '$$\\frac{x^4}{4} + x^3 + \\frac{3x^2}{2} + x + C$$',
                    steps: [
                        'Expandir: $$(x + 1)^3 = x^3 + 3x^2 + 3x + 1$$',
                        'Integrar término por término',
                        'Aplicar regla de la potencia a cada término'
                    ]
                },
                {
                    problem: 'Evalúa $$\\int \\sin^2 x \\, dx$$',
                    solution: '$$\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C$$',
                    steps: [
                        'Usar identidad: $$\\sin^2 x = \\frac{1 - \\cos(2x)}{2}$$',
                        'Separar términos: $$\\frac{1}{2}\\int 1 \\, dx - \\frac{1}{2}\\int \\cos(2x) \\, dx$$',
                        'Integrar: $$\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C$$'
                    ]
                }
            ]
        };

        const selectedExercises = exercises[difficulty];
        const randomExercise = selectedExercises[Math.floor(Math.random() * selectedExercises.length)];
        
        this.displayGeneratedExercise(randomExercise);
    }

    displayGeneratedExercise(exercise) {
        const container = document.getElementById('generated-exercise');
        container.innerHTML = `
            <div class="generated-exercise">
                <h4>Ejercicio Generado</h4>
                <div class="problem-statement">
                    <p><strong>Problema:</strong> $${exercise.problem}</p>
                </div>
                <div class="solution-toggle">
                    <button class="toggle-btn">Ver Solución</button>
                    <div class="solution hidden">
                        <div class="solution-steps">
                            $${exercise.steps.map((step, index) => `
                                <div class="step">
                                    <h5>Paso $${index + 1}:</h5>
                                    <p>$${step}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div class="final-answer">
                            <p><strong>Respuesta:</strong> $${exercise.solution}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Reconfigurar eventos para el nuevo ejercicio
        const toggleBtn = container.querySelector('.toggle-btn');
        toggleBtn.addEventListener('click', (e) => {
            this.toggleSolution(e);
        });
    }

    // Sistema de Quiz
    setupQuiz() {
        this.initializeQuizData();
        this.setupQuizNavigation();
        this.setupQuizTimer();
    }

    initializeQuizData() {
        this.quizData = [
            {
                question: '¿Cuál es una antiderivada de $$f(x) = 4x^3$$?',
                options: [
                    { text: '$$x^4 + C$$', correct: true },
                    { text: '$$4x^4 + C$$', correct: false },
                    { text: '$$\\frac{x^4}{4} + C$$', correct: false },
                    { text: '$$12x^2 + C$$', correct: false }
                ],
                explanation: 'Aplicando la regla de la potencia: $$\\int 4x^3 \\, dx = 4 \\cdot \\frac{x^4}{4} + C = x^4 + C$$'
            },
            {
                question: 'Evalúa $$\\int (2x^2 - 3x + 1) \\, dx$$',
                options: [
                    { text: '$$\\frac{2x^3}{3} - \\frac{3x^2}{2} + x + C$$', correct: true },
                    { text: '$$4x - 3 + C$$', correct: false },
                    { text: '$$\\frac{x^3}{3} - \\frac{x^2}{2} + x + C$$', correct: false },
                    { text: '$$2x^3 - 3x^2 + x + C$$', correct: false }
                ],
                explanation: 'Separando términos y aplicando la regla de la potencia a cada uno.'
            },
            {
                question: '¿Cuál es la integral de $$\\int \\frac{1}{x} \\, dx$$?',
                options: [
                    { text: '$$\\ln|x| + C$$', correct: true },
                    { text: '$$\\frac{1}{x^2} + C$$', correct: false },
                    { text: '$$x + C$$', correct: false },
                    { text: '$$\\ln x + C$$', correct: false }
                ],
                explanation: 'La integral de $$\\frac{1}{x}$$ es $$\\ln|x| + C$$. Nota el valor absoluto.'
            },
            {
                question: 'Evalúa $$\\int (\\sin x + \\cos x) \\, dx$$',
                options: [
                    { text: '$$-\\cos x + \\sin x + C$$', correct: true },
                    { text: '$$\\cos x - \\sin x + C$$', correct: false },
                    { text: '$$\\sin x + \\cos x + C$$', correct: false },
                    { text: '$$-\\sin x - \\cos x + C$$', correct: false }
                ],
                explanation: 'Usando las integrales básicas: $$\\int \\sin x \\, dx = -\\cos x$$ y $$\\int \\cos x \\, dx = \\sin x$$'
            },
            {
                question: '¿Cuál es la familia de antiderivadas de $$f(x) = 6x$$?',
                options: [
                    { text: '$$3x^2 + C$$', correct: true },
                    { text: '$$6x^2 + C$$', correct: false },
                    { text: '$$3x + C$$', correct: false },
                    { text: '$$6x + C$$', correct: false }
                ],
                explanation: 'Aplicando la regla de la potencia: $$\\int 6x \\, dx = 6 \\cdot \\frac{x^2}{2} + C = 3x^2 + C$$'
            },
            {
                question: 'Evalúa $$\\int (x + 2)^2 \\, dx$$',
                options: [
                    { text: '$$\\frac{x^3}{3} + 2x^2 + 4x + C$$', correct: true },
                    { text: '$$x^2 + 4x + 4 + C$$', correct: false },
                    { text: '$$\\frac{x^3}{3} + 4x + C$$', correct: false },
                    { text: '$$x^3 + 4x^2 + 4x + C$$', correct: false }
                ],
                explanation: 'Primero expandir: $$(x + 2)^2 = x^2 + 4x + 4$$, luego integrar término por término.'
            },
            {
                question: '¿Cuál es la integral de $$\\int \\sec^2 x \\, dx$$?',
                options: [
                    { text: '$$\\tan x + C$$', correct: true },
                    { text: '$$\\sec x \\tan x + C$$', correct: false },
                    { text: '$$\\cot x + C$$', correct: false },
                    { text: '$$\\csc^2 x + C$$', correct: false }
                ],
                explanation: 'Esta es una integral trigonométrica básica: $$\\int \\sec^2 x \\, dx = \\tan x + C$$'
            },
            {
                question: 'Evalúa $$\\int \\frac{x^2 - 4}{x} \\, dx$$',
                options: [
                    { text: '$$\\frac{x^2}{2} - 4\\ln|x| + C$$', correct: true },
                    { text: '$$x - \\frac{4}{x} + C$$', correct: false },
                    { text: '$$\\frac{x^3}{3} - 4x + C$$', correct: false },
                    { text: '$$2x - \\frac{4}{x^2} + C$$', correct: false }
                ],
                explanation: 'Dividir término por término: $$\\frac{x^2 - 4}{x} = x - \\frac{4}{x}$$, luego integrar.'
            },
            {
                question: '¿Cuál es una antiderivada de $$f(x) = e^x$$?',
                options: [
                    { text: '$$e^x + C$$', correct: true },
                    { text: '$$\\frac{e^x}{x} + C$$', correct: false },
                    { text: '$$xe^x + C$$', correct: false },
                    { text: '$$\\ln(e^x) + C$$', correct: false }
                ],
                explanation: 'La función exponencial es su propia derivada, por lo que también es su propia antiderivada.'
            },
            {
                question: 'Evalúa $$\\int (5x^4 - 2x^3 + 3x - 1) \\, dx$$',
                options: [
                    { text: '$$x^5 - \\frac{x^4}{2} + \\frac{3x^2}{2} - x + C$$', correct: true },
                    { text: '$$20x^3 - 6x^2 + 3 + C$$', correct: false },
                    { text: '$$\\frac{5x^5}{5} - \\frac{2x^4}{4} + \\frac{3x^2}{2} - x + C$$', correct: false },
                    { text: '$$5x^5 - 2x^4 + 3x^2 - x + C$$', correct: false }
                ],
                explanation: 'Aplicar la regla de la potencia a cada término y simplificar las fracciones.'
            }
        ];

        this.quizAnswers = new Array(this.quizData.length).fill(null);
    }

    setupQuizNavigation() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const submitBtn = document.getElementById('submit-quiz');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentQuizQuestion > 0) {
                    this.currentQuizQuestion--;
                    this.displayQuizQuestion();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentQuizQuestion < this.quizData.length - 1) {
                    this.currentQuizQuestion++;
                    this.displayQuizQuestion();
                }
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitQuiz();
            });
        }
    }

    displayQuizQuestion() {
        const question = this.quizData[this.currentQuizQuestion];
        const questionText = document.getElementById('question-text');
        const questionOptions = document.getElementById('question-options');
        const currentQuestionSpan = document.getElementById('current-question');
        const progressFill = document.getElementById('quiz-progress');
        const progressText = document.getElementById('quiz-progress-text');

        // Actualizar número de pregunta
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = this.currentQuizQuestion + 1;
        }

        // Actualizar progreso
        if (progressFill) {
            const progress = ((this.currentQuizQuestion + 1) / this.quizData.length) * 100;
            progressFill.style.width = progress + '%';
        }

        if (progressText) {
            progressText.textContent = `Pregunta $${this.currentQuizQuestion + 1} de $${this.quizData.length}`;
        }

        // Actualizar pregunta
        if (questionText) {
            questionText.innerHTML = question.question;
        }

        // Actualizar opciones
        if (questionOptions) {
            questionOptions.innerHTML = question.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = this.quizAnswers[this.currentQuizQuestion] === index;
                return `
                    <button class="option-btn $${isSelected ? 'selected' : ''}" 
                            data-answer="$${index}" 
                            data-correct="$${option.correct}">
                        $${letter}. $${option.text}
                    </button>
                `;
            }).join('');

            // Agregar event listeners a las nuevas opciones
            questionOptions.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.selectQuizAnswer(e);
                });
            });
        }

        // Actualizar botones de navegación
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const submitBtn = document.getElementById('submit-quiz');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuizQuestion === 0;
        }

        if (nextBtn) {
            nextBtn.style.display = this.currentQuizQuestion === this.quizData.length - 1 ? 'none' : 'inline-block';
        }

        if (submitBtn) {
            submitBtn.style.display = this.currentQuizQuestion === this.quizData.length - 1 ? 'inline-block' : 'none';
        }
    }

    selectQuizAnswer(e) {
        const btn = e.target;
        const answerIndex = parseInt(btn.dataset.answer);
        
        // Remover selección previa
        btn.parentElement.querySelectorAll('.option-btn').forEach(b => {
            b.classList.remove('selected');
        });

        // Marcar nueva selección
        btn.classList.add('selected');
        this.quizAnswers[this.currentQuizQuestion] = answerIndex;

        // Verificar si todas las preguntas están respondidas
        const allAnswered = this.quizAnswers.every(answer => answer !== null);
        const submitBtn = document.getElementById('submit-quiz');
        if (submitBtn && allAnswered) {
            submitBtn.disabled = false;
        }
    }

    setupQuizTimer() {
        this.updateTimer();
        this.quizTimer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.submitQuiz();
            }
        }, 1000);
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            timerElement.textContent = `$${minutes.toString().padStart(2, '0')}:$${seconds.toString().padStart(2, '0')}`;
        }
    }

    submitQuiz() {
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }

        // Calcular puntuación
        let score = 0;
        this.quizData.forEach((question, index) => {
            const userAnswer = this.quizAnswers[index];
            if (userAnswer !== null && question.options[userAnswer].correct) {
                score++;
            }
        });

        // Mostrar resultados
        this.displayQuizResults(score);
    }

    displayQuizResults(score) {
        const quizContent = document.querySelector('.quiz-content');
        const quizResults = document.getElementById('quiz-results');
        const finalScore = document.getElementById('final-score');
        const scorePercentage = document.getElementById('score-percentage');
        const scoreMessage = document.getElementById('score-message');
        const quizSummary = document.getElementById('quiz-summary');

        if (quizContent) {
            quizContent.style.display = 'none';
        }

        if (quizResults) {
            quizResults.style.display = 'block';
        }

        if (finalScore) {
            finalScore.textContent = score;
        }

        if (scorePercentage) {
            const percentage = Math.round((score / this.quizData.length) * 100);
            scorePercentage.textContent = percentage + '%';
        }

        if (scoreMessage) {
            const percentage = Math.round((score / this.quizData.length) * 100);
            if (percentage >= 90) {
                scoreMessage.textContent = '¡Excelente trabajo!';
            } else if (percentage >= 70) {
                scoreMessage.textContent = '¡Bien hecho!';
            } else if (percentage >= 50) {
                scoreMessage.textContent = 'Necesitas más práctica.';
            } else {
                scoreMessage.textContent = 'Revisa el material y vuelve a intentar.';
            }
        }

        if (quizSummary) {
            quizSummary.innerHTML = this.generateQuizSummary(score);
        }

        // Configurar botón de repetir
        const retakeBtn = document.getElementById('retake-quiz');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => {
                this.retakeQuiz();
            });
        }

        // Actualizar progreso del módulo
        this.moduleProgress = Math.max(this.moduleProgress, (score / this.quizData.length) * 100);
        this.updateProgress();
    }

    generateQuizSummary(score) {
        let summary = '<h4>Resumen de Respuestas:</h4><div class="quiz-details">';
        
        this.quizData.forEach((question, index) => {
            const userAnswer = this.quizAnswers[index];
            const isCorrect = userAnswer !== null && question.options[userAnswer].correct;
            
            summary += `
                <div class="question-summary $${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-number">Pregunta $${index + 1}</div>
                    <div class="question-result">
                        <span class="status">$${isCorrect ? '✓' : '✗'}</span>
                        <span class="explanation">$${question.explanation}</span>
                    </div>
                </div>
            `;
        });
        
        summary += '</div>';
        return summary;
    }

    retakeQuiz() {
        // Resetear quiz
        this.currentQuizQuestion = 0;
        this.quizAnswers = new Array(this.quizData.length).fill(null);
        this.timeRemaining = 20 * 60;

        // Mostrar contenido del quiz
        const quizContent = document.querySelector('.quiz-content');
        const quizResults = document.getElementById('quiz-results');

        if (quizContent) {
            quizContent.style.display = 'block';
        }

        if (quizResults) {
            quizResults.style.display = 'none';
        }

        // Reiniciar timer
        this.setupQuizTimer();
        
        // Mostrar primera pregunta
        this.displayQuizQuestion();
    }

    // Seguimiento de progreso
    updateProgress() {
        const sections = ['concepto', 'inmediatas', 'tecnicas', 'ejercicios', 'quiz'];
        const sectionIndex = sections.indexOf(this.currentSection);
        const baseProgress = (sectionIndex / sections.length) * 100;
        
        // Agregar progreso adicional por actividades completadas
        let additionalProgress = 0;
        
        // Verificar actividades completadas en la sección actual
        const completedActivities = this.countCompletedActivities();
        additionalProgress = (completedActivities / 10) * 20; // Máximo 20% adicional
        
        this.moduleProgress = Math.min(100, baseProgress + additionalProgress);
        
        // Actualizar UI
        const progressBar = document.getElementById('module-progress');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = this.moduleProgress + '%';
        }
        
        if (progressText) {
            progressText.textContent = Math.round(this.moduleProgress) + '% completado';
        }

        // Guardar progreso
        this.saveUserProgress();
    }

    countCompletedActivities() {
        let count = 0;
        
        // Contar ejercicios con soluciones vistas
        const viewedSolutions = document.querySelectorAll('.solution-toggle .toggle-btn.active').length;
        count += viewedSolutions;
        
        // Contar respuestas correctas en quizzes
        const correctAnswers = document.querySelectorAll('.option-btn.correct').length;
        count += correctAnswers;
        
        return count;
    }

    startTimeTracking() {
        setInterval(() => {
            this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000 / 60); // en minutos
            const timeElement = document.getElementById('time-spent');
            if (timeElement) {
                timeElement.textContent = `Tiempo: $${this.timeSpent} min`;
            }
        }, 60000); // Actualizar cada minuto
    }

    // Gestión de usuario y persistencia
    loadUserProgress() {
        // Cargar progreso desde Firebase o localStorage
        const savedProgress = localStorage.getItem('modulo1_progress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.moduleProgress = progress.moduleProgress || 0;
            this.timeSpent = progress.timeSpent || 0;
            this.updateProgress();
        }
    }

    saveUserProgress() {
        const progress = {
            moduleProgress: this.moduleProgress,
            timeSpent: this.timeSpent,
            lastUpdated: Date.now()
        };
        
        localStorage.setItem('modulo1_progress', JSON.stringify(progress));
        
        // También guardar en Firebase si está disponible
        if (window.authManager && window.authManager.currentUser) {
            window.authManager.updateModuleProgress('modulo1', this.moduleProgress);
        }
    }

    // Métodos de utilidad
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `$${minutes}:$${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Limpieza al salir
    cleanup() {
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
        this.saveUserProgress();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.modulo1Manager = new Modulo1Manager();
    
    // Limpiar al salir de la página
    window.addEventListener('beforeunload', () => {
        if (window.modulo1Manager) {
            window.modulo1Manager.cleanup();
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

function verifyIntegral(integrand, answer) {
    // Función para verificar si una integral es correcta
    // Esta sería una implementación simplificada
    // En una implementación real, usarías una librería como SymPy o similar
    
    try {
        // Aquí iría la lógica de verificación matemática
        return true; // Placeholder
    } catch (error) {
        console.error('Error verificando integral:', error);
        return false;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modulo1Manager;
}
