// Motor Compartido del Quiz Estilo Kahoot
// Depende de la constante 'questions' definida en questions.js de cada sesión.

let currentQuestionIndex = 0;
let score = 0;

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const quizSetup = document.getElementById('quiz-setup');
const quizActive = document.getElementById('quiz-active');
const quizResults = document.getElementById('quiz-results');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const progressFill = document.getElementById('progress-fill');
const scoreText = document.getElementById('score-text');

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    quizSetup.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizActive.classList.remove('hidden');
    
    loadQuestion();
}

function loadQuestion() {
    optionsGrid.innerHTML = '';
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progress}%`;

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.classList.add('option-btn', `opt-${index}`);
        btn.addEventListener('click', () => checkAnswer(index, btn));
        optionsGrid.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const currentQ = questions[currentQuestionIndex];
    const allBtns = document.querySelectorAll('.option-btn');
    
    allBtns.forEach(b => b.disabled = true);

    if (selectedIndex === currentQ.correct) {
        btnElement.classList.add('correct');
        score++;
    } else {
        btnElement.classList.add('incorrect');
        allBtns[currentQ.correct].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1800);
}

function showResults() {
    quizActive.classList.add('hidden');
    quizResults.classList.remove('hidden');
    progressFill.style.width = '100%';
    
    const percentage = Math.round((score / questions.length) * 100);
    
    let feedbackMessage = "";
    if (percentage === 100) {
        feedbackMessage = "¡Excelente! Has demostrado un dominio absoluto de los conceptos.";
    } else if (percentage >= 70) {
        feedbackMessage = "¡Muy bien! Tienes bases sólidas para seguir avanzando.";
    } else {
        feedbackMessage = "¡No te rindas! Te recomendamos repasar los conceptos de esta sesión.";
    }

    scoreText.innerHTML = `Acertaste ${score} de ${questions.length}<br>
    <span style="font-size: 1.2rem; color: var(--text-color); font-weight: 600; display: block; margin-top: 1rem;">
        ${feedbackMessage}
    </span>`;
}

function restartQuiz() {
    startQuiz();
}
