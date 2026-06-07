// Base de datos de preguntas específicas para Sesión 02
const quizData = [
    {
        question: "¿Qué formatos de archivo de dibujo vectorial admite DIALux evo para importar planos?",
        answers: [".PDF y .JPG", ".RVT y .SKP", ".DWG y .DXF", ".DOC y .XLS"],
        correct: 2
    },
    {
        question: "Si en tu plano de AutoCAD una pared mide '2.50', ¿qué unidad debes seleccionar al importar a DIALux?",
        answers: ["Milímetros", "Metros", "Centímetros", "Pulgadas"],
        correct: 1
    },
    {
        question: "¿Por qué es recomendable desactivar ciertas capas (textos, cotas) del plano importado?",
        answers: ["Para que las luces no reboten en las letras", "Para mejorar el rendimiento del software y la visibilidad", "Porque DIALux borra el archivo original", "Para cambiar el color de las paredes"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let isAnswering = false;

const questionText = document.getElementById("question-text");
const answersGrid = document.getElementById("answers-grid");
const feedbackMessage = document.getElementById("feedback-message");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("results-container");
const scoreText = document.getElementById("score-text");

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizContainer.classList.remove("hidden");
    resultsContainer.classList.add("hidden");
    loadQuestion();
}

function loadQuestion() {
    isAnswering = false;
    feedbackMessage.textContent = "";
    feedbackMessage.className = "hidden";
    
    const currentQ = quizData[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    
    // Limpiar botones anteriores
    answersGrid.innerHTML = "";
    
    // Generar botones de respuesta
    currentQ.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("answer-btn");
        button.onclick = () => checkAnswer(index, button);
        answersGrid.appendChild(button);
    });
}

function checkAnswer(selectedIndex, buttonElement) {
    if (isAnswering) return;
    isAnswering = true;
    
    const correctIndex = quizData[currentQuestionIndex].correct;
    
    feedbackMessage.classList.remove("hidden");
    
    if (selectedIndex === correctIndex) {
        buttonElement.classList.add("correct-anim");
        feedbackMessage.textContent = "¡Precisión absoluta! Correcto.";
        feedbackMessage.className = "text-success";
        score++;
    } else {
        buttonElement.classList.add("wrong-anim");
        feedbackMessage.textContent = "Revisa tus coordenadas. ¡Incorrecto!";
        feedbackMessage.className = "text-error";
        
        // Resaltar la respuesta correcta visualmente
        const buttons = answersGrid.children;
        buttons[correctIndex].style.transform = "scale(1.05)";
        buttons[correctIndex].style.border = "3px solid white";
    }
    
    // Esperar un momento para mostrar la animación antes de avanzar
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1800);
}

function showResults() {
    quizContainer.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    
    let message = "";
    if (score === quizData.length) message = "¡Maestría espacial! Puntuación perfecta.";
    else if (score > 0) message = "Bien hecho. Has superado la importación de planos.";
    else message = "El diseño requiere paciencia. Revisa la teoría e inténtalo de nuevo.";
    
    scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;