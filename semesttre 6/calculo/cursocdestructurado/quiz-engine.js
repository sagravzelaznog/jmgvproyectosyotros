/**
 * Motor Universal de Quizzes (Mobile-First)
 * Para ser incluido en cualquier lección de Ciencias y Especialidades.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Buscar todos los contenedores de quiz en la página
    const quizContainers = document.querySelectorAll('.quiz-container');

    quizContainers.forEach(container => {
        // Leer la data del quiz desde un script tipo JSON incrustado
        const dataScript = container.querySelector('script[type="application/json"]');
        if (!dataScript) return;

        let quizData = [];
        try {
            quizData = JSON.parse(dataScript.textContent);
        } catch (e) {
            console.error("Error parseando datos del quiz:", e);
            return;
        }

        let currentQuestion = 0;
        let score = 0;

        // Construir la UI del Quiz
        container.innerHTML = `
            <div class="quiz-header">
                <h3><i class="fas fa-brain"></i> Comprueba tu aprendizaje</h3>
                <div class="quiz-progress">
                    <div class="quiz-progress-bar" style="width: 0%"></div>
                </div>
            </div>
            <div class="quiz-body"></div>
            <div class="quiz-results">
                <h4>¡Quiz Completado!</h4>
                <div class="quiz-score">0 / ${quizData.length}</div>
                <p class="quiz-message"></p>
                <button class="btn retry-btn">Reintentar</button>
            </div>
        `;

        const bodyDiv = container.querySelector('.quiz-body');
        const progressBar = container.querySelector('.quiz-progress-bar');

        // Generar preguntas
        quizData.forEach((q, index) => {
            const qDiv = document.createElement('div');
            qDiv.className = `quiz-question ${index === 0 ? 'active' : ''}`;
            qDiv.dataset.index = index;

            // Mezclar opciones para que no siempre sea la misma posición
            // Guardando el índice original para saber la correcta
            let options = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correctIndex }));
            // Mezclar array (Fisher-Yates)
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }

            let optionsHtml = options.map((opt, i) => `
                <button class="quiz-option" data-correct="${opt.isCorrect}">${opt.text}</button>
            `).join('');

            qDiv.innerHTML = `
                <h4>Pregunta ${index + 1} de ${quizData.length}:<br> ${q.question}</h4>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
                <div class="quiz-feedback"></div>
                <button class="quiz-next-btn">Siguiente <i class="fas fa-arrow-right"></i></button>
            `;
            bodyDiv.appendChild(qDiv);

            // Agregar eventos a las opciones
            const optionBtns = qDiv.querySelectorAll('.quiz-option');
            const feedbackDiv = qDiv.querySelector('.quiz-feedback');
            const nextBtn = qDiv.querySelector('.quiz-next-btn');

            let answered = false;

            optionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (answered) return; // Solo permitir una respuesta
                    answered = true;

                    const isCorrect = btn.dataset.correct === "true";
                    if (isCorrect) {
                        btn.classList.add('correct');
                        score++;
                        feedbackDiv.innerHTML = `<strong>¡Correcto!</strong> ${q.explanation || ''}`;
                        feedbackDiv.className = 'quiz-feedback show success';
                    } else {
                        btn.classList.add('wrong');
                        // Resaltar la correcta
                        optionBtns.forEach(b => {
                            if (b.dataset.correct === "true") b.classList.add('correct');
                        });
                        feedbackDiv.innerHTML = `<strong>Incorrecto.</strong> ${q.explanation || ''}`;
                        feedbackDiv.className = 'quiz-feedback show error';
                    }

                    nextBtn.classList.add('show');
                });
            });

            // Botón Siguiente
            nextBtn.addEventListener('click', () => {
                qDiv.classList.remove('active');
                currentQuestion++;
                
                // Actualizar barra
                const progress = (currentQuestion / quizData.length) * 100;
                progressBar.style.width = `${progress}%`;

                if (currentQuestion < quizData.length) {
                    bodyDiv.children[currentQuestion].classList.add('active');
                } else {
                    showResults();
                }
            });
        });

        function showResults() {
            bodyDiv.style.display = 'none';
            const resultsDiv = container.querySelector('.quiz-results');
            resultsDiv.style.display = 'block';
            
            container.querySelector('.quiz-score').innerText = `${score} / ${quizData.length}`;
            const msgDiv = container.querySelector('.quiz-message');
            
            const ratio = score / quizData.length;
            if (ratio === 1) {
                msgDiv.innerHTML = "¡Excelente! Nivel Genio desbloqueado. Lo has comprendido a la perfección.";
            } else if (ratio >= 0.6) {
                msgDiv.innerHTML = "¡Buen trabajo! Has entendido los conceptos básicos.";
            } else {
                msgDiv.innerHTML = "Te recomendamos volver a leer la lección y realizar el experimento práctico para afianzar conceptos.";
            }
            
            // Reintentar
            container.querySelector('.retry-btn').addEventListener('click', () => {
                // Reset states
                currentQuestion = 0;
                score = 0;
                progressBar.style.width = '0%';
                
                bodyDiv.style.display = 'block';
                resultsDiv.style.display = 'none';
                
                // Limpiar clases de respuestas previas
                const allQuestions = bodyDiv.querySelectorAll('.quiz-question');
                allQuestions.forEach((qDiv, idx) => {
                    qDiv.classList.remove('active');
                    qDiv.querySelector('.quiz-feedback').classList.remove('show');
                    qDiv.querySelector('.quiz-next-btn').classList.remove('show');
                    
                    const opts = qDiv.querySelectorAll('.quiz-option');
                    opts.forEach(o => {
                        o.classList.remove('correct', 'wrong');
                    });
                    
                    // Solo activar la primera
                    if(idx === 0) qDiv.classList.add('active');
                    
                    // Reset 'answered' logic - we have to recreate or clone nodes if we want fresh closures,
                    // but a simpler way is reloading the page, which guarantees fresh state for the quiz module
                });
                // A quick hack for clean reset
                location.reload(); 
            });
        }
    });
});
