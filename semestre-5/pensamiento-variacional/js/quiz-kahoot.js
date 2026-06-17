// quiz-kahoot.js
import { questionDatabase } from './questions.js';

export class KahootQuiz {
    constructor(containerId, sessionId, onCompleteCallback) {
        this.container = document.getElementById(containerId);
        this.sessionId = sessionId;
        this.questions = questionDatabase[sessionId] || [];
        this.currentQIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 0;
        this.onCompleteCallback = onCompleteCallback;

        if (this.questions.length === 0) {
            this.container.innerHTML = `<p>No hay preguntas disponibles para esta sesión.</p>`;
            return;
        }

        this.initUI();
    }

    initUI() {
        this.container.innerHTML = `
            <div class="quiz-container" id="quiz-wrapper">
                <div id="quiz-content">
                    <div class="quiz-header">
                        <div class="question-counter">Pregunta ${this.currentQIndex + 1}/${this.questions.length}</div>
                        <div class="timer-box" id="quiz-timer">--</div>
                    </div>
                    <div class="question-text" id="quiz-question">¿Estás listo?</div>
                    <div class="options-grid" id="quiz-options">
                        <button class="option-btn color-0" id="start-btn">Comenzar Quiz 🚀</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('start-btn').addEventListener('click', () => this.loadQuestion());
    }

    loadQuestion() {
        if (this.currentQIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const q = this.questions[this.currentQIndex];
        
        if (!q.shuffledOptions) {
            const correctAnswerText = q.options[q.answerIndex];
            q.shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
            q.shuffledAnswerIndex = q.shuffledOptions.indexOf(correctAnswerText);
        }

        document.getElementById('quiz-question').innerText = q.question;
        
        // Actualizar contador
        document.querySelector('.question-counter').innerText = `Pregunta ${this.currentQIndex + 1}/${this.questions.length}`;

        const optionsHtml = q.shuffledOptions.map((opt, i) => `
            <button class="option-btn color-${i}" data-index="${i}">${opt}</button>
        `).join('');
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = optionsHtml;

        const btns = optionsContainer.querySelectorAll('.option-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => this.checkAnswer(parseInt(e.target.dataset.index), btns));
        });

        this.startTimer(q.timeLimit);
    }

    startTimer(seconds) {
        clearInterval(this.timer);
        this.timeLeft = seconds;
        const timerUI = document.getElementById('quiz-timer');
        timerUI.classList.remove('warning');
        
        timerUI.innerText = this.timeLeft;

        this.timer = setInterval(() => {
            this.timeLeft--;
            timerUI.innerText = this.timeLeft;

            if (this.timeLeft <= 5) {
                timerUI.classList.add('warning');
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                // Time up - auto fail this question
                this.checkAnswer(-1, document.querySelectorAll('.option-btn'));
            }
        }, 1000);
    }

    checkAnswer(selectedIndex, btnNodes) {
        clearInterval(this.timer);
        const q = this.questions[this.currentQIndex];
        const correctIndex = q.shuffledAnswerIndex;

        btnNodes.forEach(btn => {
            btn.disabled = true;
            const idx = parseInt(btn.dataset.index);
            if (idx === correctIndex) {
                btn.classList.add('correct');
            } else if (idx === selectedIndex) {
                btn.classList.add('wrong');
            } else {
                btn.style.opacity = '0.5';
            }
        });

        if (selectedIndex === correctIndex) {
            this.score++;
            // Play correct sound or animation here if needed
        }

        setTimeout(() => {
            this.currentQIndex++;
            this.loadQuestion();
        }, 2000); // Wait 2 seconds before next question
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let msg = percentage === 100 ? "¡Excelente Trabajo! 🏆" : "Debes lograr el 100% 🔄";

        document.getElementById('quiz-content').innerHTML = `
            <div class="quiz-score-board">
                <h2>${msg}</h2>
                <p>Tu puntuación es:</p>
                <div style="font-size: 4em; font-weight: 900; color: white;">${this.score} / ${this.questions.length}</div>
                <div style="margin: 20px 0; font-size: 1.2em; color: ${percentage === 100 ? '#10b981' : '#ef4444'};">Aciertos: ${percentage}%</div>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 15px;">
                    <button class="btn-next-level" id="retry-btn" style="background: #f59e0b;">Repetir Quiz 🔄</button>
                    <button class="btn-next-level" id="finish-btn" style="background: #3b82f6;">${percentage === 100 ? 'Guardar y Continuar ✅' : 'Salir sin guardar ❌'}</button>
                </div>
            </div>
        `;

        document.getElementById('retry-btn').addEventListener('click', () => {
            window.location.reload();
        });

        document.getElementById('finish-btn').addEventListener('click', () => {
            if (this.onCompleteCallback) {
                this.onCompleteCallback(this.score, percentage);
            }
        });
    }
}
