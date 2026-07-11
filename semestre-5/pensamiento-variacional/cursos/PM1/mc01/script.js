// Arreglo de 7 Preguntas (Fácilmente escalable para otras sesiones)
const questions = [
    {
        question: "¿Cuál de los siguientes enunciados es una proposición lógica?",
        options: [
            "¡Qué buen clima hace hoy!",
            "¿Me prestas tu calculadora?",
            "La Tierra gira alrededor del Sol",
            "Cierra la puerta por favor"
        ],
        correct: 2
    },
    {
        question: "Si p = 'Estudio mucho' y q = 'Apruebo el examen', ¿qué significa la conjunción p ∧ q?",
        options: [
            "Estudio mucho o apruebo el examen",
            "Si estudio mucho, apruebo el examen",
            "No estudio mucho pero apruebo el examen",
            "Estudio mucho y apruebo el examen"
        ],
        correct: 3
    },
    {
        question: "¿Cuál es el símbolo utilizado para representar la Disyunción (O)?",
        options: [
            "∧",
            "∨",
            "¬",
            "→"
        ],
        correct: 1
    },
    {
        question: "Si una proposición es Verdadera (V), ¿cuál será su valor después de aplicarle la Negación (¬)?",
        options: [
            "Sigue siendo Verdadera",
            "Se vuelve Falsa",
            "Depende del contexto",
            "Se anula"
        ],
        correct: 1
    },
    {
        question: "En una operación de Conjunción (Y), el resultado es Verdadero SÓLO cuando:",
        options: [
            "Ambas proposiciones son Falsas",
            "Al menos una proposición es Verdadera",
            "Ambas proposiciones son Verdaderas",
            "La primera proposición es Verdadera"
        ],
        correct: 2
    },
    {
        question: "Analiza esto: 'Si ahorro 50 pesos a la semana, en un mes tendré 200 pesos'. Esto es un ejemplo de:",
        options: [
            "No es una proposición",
            "Conjunción lógica",
            "Modelado de un problema con proposiciones",
            "Disyunción"
        ],
        correct: 2
    },
    {
        question: "¿Para qué nos sirve aplicar la lógica matemática a problemas del entorno?",
        options: [
            "Para escribir fórmulas más largas y difíciles",
            "Para definir reglas claras, tomar decisiones y modelar soluciones",
            "Para memorizar conceptos sin comprenderlos",
            "Para calcular operaciones matemáticas básicas"
        ],
        correct: 1
    }
];

// Variables de Estado del Quiz
let currentQuestionIndex = 0;
let score = 0;

// Referencias a Elementos del DOM
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const quizSetup = document.getElementById('quiz-setup');
const quizActive = document.getElementById('quiz-active');
const quizResults = document.getElementById('quiz-results');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const progressFill = document.getElementById('progress-fill');
const scoreText = document.getElementById('score-text');

// Event Listeners Principales
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

/**
 * Inicializa el Quiz desde cero
 */
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    quizSetup.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizActive.classList.remove('hidden');
    
    loadQuestion();
}

/**
 * Carga la pregunta actual y sus opciones en la UI
 */
function loadQuestion() {
    optionsGrid.innerHTML = '';
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    
    // Actualización visual de la barra de progreso
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progress}%`;

    // Creación dinámica de los botones (opciones)
    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        // Se añade clase base y clase de color estilo Kahoot
        btn.classList.add('option-btn', `opt-${index}`);
        btn.addEventListener('click', () => checkAnswer(index, btn));
        optionsGrid.appendChild(btn);
    });
}

/**
 * Verifica si la respuesta seleccionada es correcta y aplica feedback visual
 */
function checkAnswer(selectedIndex, btnElement) {
    const currentQ = questions[currentQuestionIndex];
    const allBtns = document.querySelectorAll('.option-btn');
    
    // Bloquear todos los botones para evitar múltiples clics
    allBtns.forEach(b => b.disabled = true);

    // Lógica de validación
    if (selectedIndex === currentQ.correct) {
        btnElement.classList.add('correct');
        score++;
    } else {
        btnElement.classList.add('incorrect');
        // Resaltar la respuesta que era correcta para retroalimentación
        allBtns[currentQ.correct].classList.add('correct');
    }

    // Retardo para que el usuario procese el resultado visual, luego pasar de pregunta
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1800);
}

/**
 * Muestra la pantalla final de puntaje con un mensaje dinámico
 */
function showResults() {
    quizActive.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    // Llenar la barra de progreso al 100%
    progressFill.style.width = '100%';
    
    const percentage = Math.round((score / questions.length) * 100);
    
    let feedbackMessage = "";
    if (percentage === 100) {
        feedbackMessage = "¡Excelente! Eres un genio de la lógica matemática.";
    } else if (percentage >= 70) {
        feedbackMessage = "¡Muy bien! Dominas las bases del tema.";
    } else {
        feedbackMessage = "Buen intento. Te recomiendo repasar un poco los conectores.";
    }

    scoreText.innerHTML = `Acertaste ${score} de ${questions.length}<br>
    <span style="font-size: 1.2rem; color: var(--text-color); font-weight: 600; display: block; margin-top: 1rem;">
        ${feedbackMessage}
    </span>`;
}

/**
 * Reinicia el juego
 */
function restartQuiz() {
    startQuiz();
}
