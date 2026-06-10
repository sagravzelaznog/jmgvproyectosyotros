document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias UI ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const nicknameForm = document.getElementById('nickname-form');
    const nicknameInput = document.getElementById('nickname');
    
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQSpan = document.getElementById('current-q');
    const totalQSpan = document.getElementById('total-q');
    const timerSpan = document.getElementById('timer');
    const scoreSpan = document.getElementById('score');
    
    const finalNicknameSpan = document.getElementById('final-nickname');
    const finalScoreSpan = document.getElementById('final-score-val');
    const btnRestart = document.getElementById('btn-restart');

    // --- Variables de Estado ---
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    let timeLeft = 15;
    let nickname = "";

    // --- Datos del Quiz ---
    const questions = [
        {
            question: "¿Qué etiqueta de HTML5 se usa para el contenido principal?",
            options: ["<header>", "<main>", "<footer>", "<section>"],
            correctIndex: 1
        },
        {
            question: "¿En CSS, qué propiedad cambia el color de fondo?",
            options: ["color", "bg-color", "background-color", "fill"],
            correctIndex: 2
        },
        {
            question: "¿Qué significa el acrónimo DOM?",
            options: ["Document Object Model", "Data Oriented Module", "Digital Ordinance Maker", "Desktop Oriented Mode"],
            correctIndex: 0
        },
        {
            question: "¿Con qué palabra clave se declara una variable en JavaScript que NO puede cambiar de valor?",
            options: ["let", "var", "static", "const"],
            correctIndex: 3
        },
        {
            question: "¿Cuál de estos colores NO pertenece típicamente a la paleta clásica de botones de Kahoot?",
            options: ["Rojo", "Azul", "Morado", "Amarillo"],
            correctIndex: 2
        }
    ];

    totalQSpan.textContent = questions.length;

    // --- Event Listeners ---
    nicknameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        nickname = nicknameInput.value.trim();
        if (nickname) {
            startGame();
        }
    });

    btnRestart.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        scoreSpan.textContent = "0";
        showScreen(startScreen);
        nicknameInput.value = "";
    });

    // --- Lógica del Juego ---
    function startGame() {
        showScreen(quizScreen);
        loadQuestion();
    }

    function loadQuestion() {
        resetTimer();
        
        const q = questions[currentQuestionIndex];
        currentQSpan.textContent = currentQuestionIndex + 1;
        questionText.textContent = q.question;
        
        optionsContainer.innerHTML = '';
        
        // Kahoot icons for options
        const icons = ["fa-triangle", "fa-diamond", "fa-circle", "fa-square"];
        
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = `option-btn opt-${index}`;
            // Se usa fas fa-play y se rota para el triángulo, fa-square, etc. Usaremos iconos genéricos simples.
            const iconClass = index === 0 ? 'fa-caret-up' : index === 1 ? 'fa-square' : index === 2 ? 'fa-circle' : 'fa-star';
            
            btn.innerHTML = `<i class="fa-solid ${iconClass}" style="margin-right: 15px; font-size: 1.2em;"></i> ${opt}`;
            
            btn.addEventListener('click', () => handleAnswer(index));
            optionsContainer.appendChild(btn);
        });

        startTimer();
    }

    function handleAnswer(selectedIndex) {
        clearInterval(timerInterval);
        const q = questions[currentQuestionIndex];
        
        // Bloquear botones
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = true);

        if (selectedIndex === q.correctIndex) {
            // Calcular puntos basados en el tiempo restante (max 1000)
            const timeBonus = Math.floor((timeLeft / 15) * 500);
            score += 500 + timeBonus;
            scoreSpan.textContent = score;
            
            // Animación visual de acierto
            buttons[selectedIndex].style.filter = "brightness(1.5)";
            buttons[selectedIndex].style.boxShadow = "0 0 20px rgba(255,255,255,0.8)";
        } else {
            // Mostrar correcta y marcar incorrecta
            buttons[selectedIndex].style.opacity = "0.5";
            if (selectedIndex !== -1) {
                buttons[selectedIndex].style.background = "#555";
            }
            buttons[q.correctIndex].style.filter = "brightness(1.5)";
            buttons[q.correctIndex].style.boxShadow = "0 0 20px rgba(255,255,255,0.8)";
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                endGame();
            }
        }, 2000);
    }

    function startTimer() {
        timerSpan.parentElement.classList.remove('timer-warning');
        timerInterval = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            
            if (timeLeft <= 5) {
                timerSpan.parentElement.classList.add('timer-warning');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleAnswer(-1); // -1 significa que no respondió a tiempo
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timeLeft = 15;
        timerSpan.textContent = timeLeft;
        timerSpan.parentElement.classList.remove('timer-warning');
    }

    function endGame() {
        finalNicknameSpan.textContent = nickname;
        finalScoreSpan.textContent = score;
        showScreen(resultScreen);
        triggerConfetti();
    }

    // --- Utilidades ---
    function showScreen(screen) {
        startScreen.classList.add('hidden-screen');
        startScreen.classList.remove('active-screen');
        quizScreen.classList.add('hidden-screen');
        quizScreen.classList.remove('active-screen');
        resultScreen.classList.add('hidden-screen');
        resultScreen.classList.remove('active-screen');

        screen.classList.remove('hidden-screen');
        screen.classList.add('active-screen');
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            var duration = 3 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            var interval = setInterval(function() {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
});
