// Arreglo de 7 Preguntas Específicas para Masterclass 02
const questions = [
    {
        question: "¿Cuántas filas o combinaciones tiene una tabla de verdad que analiza 2 proposiciones (p y q)?",
        options: [
            "2 filas",
            "4 filas",
            "6 filas",
            "8 filas"
        ],
        correct: 1
    },
    {
        question: "En una tabla de verdad, si evaluamos la Conjunción (p ∧ q), ¿qué ocurre si la proposición p es Verdadera y la q es Falsa?",
        options: [
            "El resultado es Verdadero",
            "El resultado es Falso",
            "No se puede determinar",
            "Da como resultado una Negación"
        ],
        correct: 1
    },
    {
        question: "¿Cuál es el propósito principal de construir una tabla de verdad para un proyecto?",
        options: [
            "Para llenar un formato administrativo",
            "Para hacer cálculos matemáticos de sumas",
            "Para evaluar sistemáticamente todos los escenarios posibles del proyecto",
            "Para elegir el nombre del proyecto"
        ],
        correct: 2
    },
    {
        question: "Si p = 'Tenemos agua' y q = 'Tenemos semillas', la viabilidad del huerto exige (p ∧ q). Si la comunidad no tiene agua pero sí semillas, ¿el proyecto es viable?",
        options: [
            "Sí, con las semillas es suficiente",
            "No, porque en la conjunción ambas deben ser verdaderas",
            "A veces es viable",
            "Depende de la disyunción"
        ],
        correct: 1
    },
    {
        question: "Si analizamos la Disyunción (O, p ∨ q) de dos alternativas, ¿en qué único caso el resultado general será Falso?",
        options: [
            "Cuando ambas proposiciones sean Verdaderas",
            "Cuando la primera sea Verdadera y la segunda Falsa",
            "Cuando ambas proposiciones sean Falsas",
            "Cuando se aplique una conjunción"
        ],
        correct: 2
    },
    {
        question: "Imagina que tu proyecto requiere de 5000 pesos de inversión o bien una donación de material. ¿Qué conector modela mejor esta situación?",
        options: [
            "Negación (¬)",
            "Conjunción (∧)",
            "Disyunción (∨)",
            "Ninguna de las anteriores"
        ],
        correct: 2
    },
    {
        question: "Al usar GeoGebra para la viabilidad booleana, ¿qué herramienta de la Vista nos permite organizar las combinaciones de 'true' y 'false' en celdas?",
        options: [
            "La vista gráfica 3D",
            "La herramienta de Polígonos",
            "El CAS",
            "La Hoja de Cálculo"
        ],
        correct: 3
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
        feedbackMessage = "¡Impresionante! Dominas perfectamente las tablas de verdad.";
    } else if (percentage >= 70) {
        feedbackMessage = "¡Gran trabajo! Tienes bases sólidas para evaluar proyectos.";
    } else {
        feedbackMessage = "¡No te rindas! Vuelve a revisar las reglas de conjunción y disyunción.";
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
