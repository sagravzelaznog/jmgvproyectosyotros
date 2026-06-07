document.addEventListener('DOMContentLoaded', function() {
    // Initialize the quiz
    initQuiz();
    
    // Add animation to question blocks on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all question blocks
    document.querySelectorAll('.question-block').forEach((block, index) => {
        block.style.opacity = '0';
        block.style.transform = 'translateX(-20px)';
        block.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(block);
    });

    // Add hover effect to options
    const labels = document.querySelectorAll('.option-label');
    labels.forEach(label => {
        label.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        label.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

function initQuiz() {
    const form = document.getElementById('quizForm');
    if (!form) return;
    
    // Add event listener to form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularResultado();
    });

    // Add click event to submit button
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);
        });
    }
}

function calcularResultado() {
    let score = 0;
    const total = document.querySelectorAll('.question-block').length;
    const form = document.getElementById('quizForm');
    const formData = new FormData(form);
    const resultDiv = document.getElementById('result');
    
    // Reset previous results
    document.querySelectorAll('.option-label').forEach(label => {
        label.style.backgroundColor = '';
        label.style.borderColor = '';
    });

    // Calculate score and highlight answers
    for (let pair of formData.entries()) {
        const questionName = pair[0];
        const selectedValue = pair[1];
        const correctAnswer = document.querySelector(`input[name="${questionName}"][value="correct"]`);
        const selectedInput = document.querySelector(`input[name="${questionName}"]:checked`);
        
        if (selectedInput) {
            const selectedLabel = selectedInput.closest('.option-label');
            
            if (selectedValue === 'correct') {
                score++;
                selectedLabel.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                selectedLabel.style.borderColor = '#28a745';
            } else {
                selectedLabel.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                selectedLabel.style.borderColor = '#dc3545';
                
                // Highlight correct answer
                if (correctAnswer && correctAnswer !== selectedInput) {
                    const correctLabel = correctAnswer.closest('.option-label');
                    correctLabel.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                    correctLabel.style.borderColor = '#28a745';
                }
            }
        } else {
            // If no answer was selected, show the correct one
            if (correctAnswer) {
                const correctLabel = correctAnswer.closest('.option-label');
                correctLabel.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                correctLabel.style.borderColor = '#28a745';
            }
        }
    }

    // Show result
    resultDiv.style.display = 'block';
    resultDiv.className = 'result-container';
    
    let message = `Has obtenido ${score} de ${total} aciertos.`;
    
    if (score === total) {
        resultDiv.classList.add('result-success');
        message = `¡Excelente! ${message}`;
    } else if (score >= total * 0.6) {
        resultDiv.classList.add('result-warning');
        message = `Bien hecho. ${message}`;
    } else {
        resultDiv.classList.add('result-danger');
        message = `Sigue practicando. ${message}`;
    }
    
    resultDiv.innerHTML = `
        <h3>${message}</h3>
        <p>${getEncouragementMessage(score/total)}</p>
        <button class="btn mt-2" onclick="window.location.reload()">Reintentar</button>
    `;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Disable form after submission
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.disabled = true;
    });
    
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Cuestionario completado';
    }
}

function getEncouragementMessage(percentage) {
    if (percentage === 1) return '¡Perfecto! Has dominado los términos semejantes.';
    if (percentage >= 0.8) return '¡Muy buen trabajo! Casi lo logras por completo.';
    if (percentage >= 0.6) return 'Buen intento. Sigue practicando para mejorar.';
    if (percentage >= 0.4) return 'No te rindas. Revisa los conceptos y vuelve a intentarlo.';
    return 'Los términos semejantes requieren práctica. Te recomiendo repasar los conceptos básicos antes de continuar.';
}
