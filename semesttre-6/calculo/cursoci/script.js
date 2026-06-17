// Script principal para el curso de Cálculo Integral
// Funcionalidades: navegación, interactividad, animaciones

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades
    initializeCalculusInteractivity();
    initializeSigmaCalculator();
    initializeVisualizationTools();
    initializeExerciseGenerators();

    // Initialize Session 6 visualization if on that page
    if (document.getElementById('inscribed-canvas')) {
        updateInscribedVisualization();
        document.getElementById('inscribed-rects').addEventListener('input', updateInscribedVisualization);
    }

    console.log(' Cálculo Integral - Script cargado correctamente');
});

// ========================================
// FUNCIONES DE NAVEGACIÓN
// ========================================

function initializeNavigation() {
    // Marcar la página actual en el menú
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Funcionalidad del menú móvil (si es necesario)
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        sidebar.style.position = 'fixed';
        sidebar.style.transform = 'translateX(-100%)';
        sidebar.style.transition = 'transform 0.3s ease';
    }
}

// ========================================
// EFECTOS DE SCROLL
// ========================================

function initializeScrollEffects() {
    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efectos de scroll en secciones
    const sections = document.querySelectorAll('.content-section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
}

// ========================================
// MATHJAX Y FÓRMULAS MATEMÁTICAS
// ========================================

function initializeMathJax() {
    // Configurar MathJax para renderizado automático
    if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [['\\(', '\\)']],
                displayMath: [['\\[', '\\]']],
                processEscapes: true
            }
        });
    }
}

// ========================================
// ELEMENTOS INTERACTIVOS
// ========================================

function initializeInteractiveElements() {
    // Inicializar botones interactivos
    const interactiveButtons = document.querySelectorAll('.interactive-btn');
    interactiveButtons.forEach(button => {
        button.addEventListener('click', handleInteractiveClick);
    });

    // Inicializar inputs de ejercicios
    const exerciseInputs = document.querySelectorAll('.exercise-input');
    exerciseInputs.forEach(input => {
        input.addEventListener('input', handleExerciseInput);
        input.addEventListener('focus', handleExerciseFocus);
        input.addEventListener('blur', handleExerciseBlur);
    });
}

// Manejadores de eventos para elementos interactivos
function handleInteractiveClick(event) {
    const button = event.currentTarget;

    // Efectos visuales
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);

    // Ejecutar acción específica si existe
    const action = button.getAttribute('data-action');
    if (action) {
        window[action]();
    }
}

function handleExerciseInput(event) {
    const input = event.currentTarget;
    const value = input.value.trim();

    // Validación básica
    if (value.length > 0) {
        input.style.borderColor = 'var(--primary-emerald)';
    } else {
        input.style.borderColor = 'var(--neutral-300)';
    }
}

function handleExerciseFocus(event) {
    const input = event.currentTarget;
    input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
}

function handleExerciseBlur(event) {
    const input = event.currentTarget;
    input.style.boxShadow = '';
}

// ========================================
// FUNCIONES DE EJERCICIOS INTERACTIVOS
// ========================================

// Función global para verificar respuestas de opción múltiple
function checkAnswer(exerciseId, selectedAnswer) {
    const feedbackElement = document.getElementById(`feedback-${exerciseId}`);
    const correctAnswers = {
        'exercise1': 'b'
    };

    const isCorrect = selectedAnswer === correctAnswers[exerciseId];

    feedbackElement.style.display = 'block';
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Correcto! Excelente trabajo.';
    } else {
        feedbackElement.innerHTML = '❌ Incorrecto. Inténtalo de nuevo.';
    }

    // Deshabilitar otros botones después de responder
    const exerciseContainer = feedbackElement.parentElement;
    const buttons = exerciseContainer.querySelectorAll('.interactive-btn');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent.includes(selectedAnswer.toUpperCase())) {
            button.style.background = isCorrect ? 'var(--success)' : 'var(--error)';
        }
    });
}

// Función para verificar respuestas de notación sigma
function checkSigmaAnswer() {
    const input = document.getElementById('exercise2-input');
    const userAnswer = input.value.trim().replace(/\s+/g, '');
    const feedbackElement = document.getElementById('feedback-exercise2');

    // Respuestas aceptadas (variaciones de la notación sigma)
    const correctAnswers = [
        '\\sum_{i=1}^{4}5',
        '\\sum_{i=1}^45',
        '\\sum_{k=1}^{4}5',
        '\\sum_{k=1}^45',
        '∑_{i=1}^{4}5',
        '∑_{i=1}^45',
        '∑_{k=1}^{4}5',
        '∑_{k=1}^45'
    ];

    const isCorrect = correctAnswers.some(correct => {
        const normalizedCorrect = correct.replace(/\s+/g, '').replace(/\\sum/g, '∑');
        return userAnswer === normalizedCorrect ||
               userAnswer.replace(/\\sum/g, '∑') === normalizedCorrect ||
               userAnswer === normalizedCorrect.replace(/\\sum/g, '∑');
    });

    feedbackElement.style.display = 'block';
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Perfecto! La notación sigma es correcta.';
        input.disabled = true;
        document.querySelector('#exercise2-input').style.backgroundColor = 'var(--light-emerald)';
    } else {
        feedbackElement.innerHTML = '❌ La notación no es correcta. Revisa la sintaxis. Debe ser: ∑ (desde i=1 hasta 4) de 5';
    }
}

// Función para mostrar pistas
function showHint(exerciseId) {
    const hintElement = document.getElementById(`hint-${exerciseId}`);

    if (hintElement.style.display === 'none' || hintElement.style.display === '') {
        hintElement.style.display = 'block';

        switch(exerciseId) {
            case 'exercise2':
                hintElement.innerHTML = '💡 Pista: La suma es 5 + 5 + 5 + 5 (cuatro veces). El formato es ∑ (índice desde 1 hasta 4) de 5';
                break;
            default:
                hintElement.innerHTML = '💡 Revisa la notación sigma básica: ∑ (desde valor inicial hasta valor final) de expresión';
        }
    } else {
        hintElement.style.display = 'none';
    }
}

// ========================================
// FUNCIONES DE ANIMACIÓN Y VISUALIZACIÓN
// ========================================

// Función para resaltar fórmulas matemáticas
function highlightMath() {
    const mathElements = document.querySelectorAll('.math-expression');
    mathElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Función para animar elementos al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.step-by-step, .example-box, .math-expression');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// FUNCIONES DE UTILIDAD PARA ELEMENTOS OCULTOS
// ========================================

// Función para mostrar un elemento (removiendo la clase hidden)
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

// Función para ocultar un elemento (agregando la clase hidden)
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// Función para alternar visibilidad de un elemento
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden');
    }
}
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Función para calcular sumas sigma básicas
function calculateSigmaSum(expression, start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
        // Evaluación simple de expresiones (solo para casos básicos)
        const value = eval(expression.replace(/i/g, i));
        sum += value;
    }
    return sum;
}

// Función para mostrar resultados de sumas
function showSigmaResult(expression, start, end) {
    const result = calculateSigmaSum(expression, start, end);
    return `∑ de ${start} a ${end} de ${expression} = ${formatNumber(result)}`;
}

// ========================================
// INICIALIZACIÓN ADICIONAL
// ========================================

// Inicializar animaciones adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    highlightMath();
    animateOnScroll();

    // Agregar funcionalidad de copiar fórmulas
    const mathElements = document.querySelectorAll('.math-expression');
    mathElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.title = 'Haz clic para copiar la fórmula';
        element.addEventListener('click', function() {
            const formula = this.textContent.trim();
            navigator.clipboard.writeText(formula).then(() => {
                showToast('📋 Fórmula copiada al portapapeles');
            });
        });
    });
});

// Función para mostrar notificaciones
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-emerald);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// ========================================
// CSS ADICIONAL PARA ANIMACIONES
// ========================================

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .exercise-container {
        margin: 1.5rem 0;
        padding: 1rem;
        border: 1px solid var(--neutral-200);
        border-radius: 8px;
        background-color: var(--neutral-50);
    }

    .exercise-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1rem 0;
    }
`;
document.head.appendChild(style);
