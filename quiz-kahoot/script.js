document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    // Start Form
    const startForm = document.getElementById('start-form');
    const nicknameInput = document.getElementById('nickname');
    
    // Quiz Elements
    const questionCounter = document.getElementById('question-counter');
    const timerText = document.getElementById('timer-text');
    const scoreDisplay = document.getElementById('score-display');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    
    // Result Elements
    const finalNickname = document.getElementById('final-nickname');
    const finalScoreText = document.getElementById('final-score-text');
    const btnRestart = document.getElementById('btn-restart');
    
    // Variables
    let playerName = '';
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 15;
    const TIME_LIMIT = 15;

    // Colores tipo Kahoot
    const btnColors = ['red', 'blue', 'yellow', 'green'];

    // Banco de Preguntas (Ejemplo)
    const questions = [
        {
            question: "¿Qué significa HTML?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Hyperlink and Text Markup Language",
                "Home Tool Markup Language"
            ],
            correct: 0
        },
        {
            question: "¿Qué lenguaje define el comportamiento de una página web?",
            options: [
                "CSS",
                "HTML",
                "JavaScript",
                "Python"
            ],
            correct: 2
        },
        {
            question: "¿Qué propiedad de CSS se usa para cambiar el color de fondo?",
            options: [
                "color",
                "background-color",
                "bgcolor",
                "bg-color"
            ],
            correct: 1
        },
        {
            question: "¿En qué etiqueta HTML se incluye el archivo JavaScript?",
            options: [
                "<js>",
                "<scripting>",
                "<script>",
                "<javascript>"
            ],
            correct: 2
        },
        {
            question: "¿Cuál es el símbolo para un selector de ID en CSS?",
            options: [
                ".",
                "#",
                "&",
                "*"
            ],
            correct: 1
        }
    ];

    // Iniciar Juego
    startForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playerName = nicknameInput.value.trim();
        if (playerName) {
            startGame();
        }
    });

    // Reiniciar Juego
    btnRestart.addEventListener('click', () => {
        startGame();
    });

    function startGame() {
        currentQuestionIndex = 0;
        score = 0;
        switchScreen(startScreen, quizScreen);
        switchScreen(resultScreen, quizScreen); // en caso de venir de resultados
        updateScore();
        loadQuestion();
    }

    function loadQuestion() {
        clearInterval(timer);
        if (currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }

        const q = questions[currentQuestionIndex];
        questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1}/${questions.length}`;
        questionText.textContent = q.question;
        
        optionsContainer.innerHTML = '';
        
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = `option-btn ${btnColors[index]}`;
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(index);
            optionsContainer.appendChild(btn);
        });

        startTimer();
    }

    function startTimer() {
        timeLeft = TIME_LIMIT;
        timerText.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            timerText.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleAnswer(-1); // Tiempo agotado
            }
        }, 1000);
    }

    function handleAnswer(selectedIndex) {
        clearInterval(timer);
        
        const q = questions[currentQuestionIndex];
        const buttons = optionsContainer.querySelectorAll('button');
        
        // Deshabilitar botones temporalmente
        buttons.forEach(btn => btn.disabled = true);

        if (selectedIndex === q.correct) {
            // Calcular puntos (base 1000 + bonus por tiempo)
            const timeBonus = timeLeft * 10;
            score += (1000 + timeBonus);
            updateScore();
            // Feedback visual simple
            if(buttons[selectedIndex]) buttons[selectedIndex].style.filter = "brightness(1.5)";
        } else {
            // Mostrar cuál era correcta
            if (selectedIndex !== -1 && buttons[selectedIndex]) {
                buttons[selectedIndex].style.opacity = "0.5";
            }
            buttons[q.correct].style.filter = "brightness(1.5)";
        }

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 2000); // 2 segundos para ver respuesta antes de la siguiente
    }

    function updateScore() {
        scoreDisplay.textContent = `Puntos: ${score}`;
    }

    function endGame() {
        switchScreen(quizScreen, resultScreen);
        finalNickname.textContent = playerName;
        
        // Animar contador final
        let currentScore = 0;
        const increment = Math.ceil(score / 50); // 50 pasos
        
        const scoreAnim = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(scoreAnim);
                createConfetti();
            }
            finalScoreText.textContent = currentScore;
        }, 30);
    }

    function switchScreen(from, to) {
        from.classList.remove('active-screen');
        from.classList.add('hidden-screen');
        
        to.classList.remove('hidden-screen');
        to.classList.add('active-screen');
    }

    // Efecto Confeti
    function createConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = '';
        const colors = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(confetti);
        }
    }
});
