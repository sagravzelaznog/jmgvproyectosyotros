// Base de datos de preguntas
const quizData = [
	{
					question: "¿Cuál es el primer paso en el flujo de trabajo de DIALux?",
					answers: ["Cálculo", "Documentación", "Construcción", "Exportar a PDF"],
					correct: 2
	},
	{
					question: "Para diseñar una sola habitación rápidamente, ¿qué opción eliges al inicio?",
					answers: ["Planificación de edificio exterior", "Planificación de espacio interior vacío", "Importar plano CAD", "Diseño de vialidades"],
					correct: 1
	},
	{
					question: "¿En qué pestaña seleccionas e insertas los equipos de iluminación?",
					answers: ["Pestaña 'Luz'", "Pestaña 'Construcción'", "Pestaña 'Materiales'", "Pestaña 'Exportar'"],
					correct: 0
	}
];

let currentQuestionIndex = 0;
let score = 0;
let isAnswering = false; // Previene múltiples clics

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
					feedbackMessage.textContent = "¡Correcto! Excelente trabajo.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Incorrecto. ¡Sigue practicando!";
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
	if (score === quizData.length) message = "¡Genio absoluto! Puntuación perfecta.";
	else if (score > 0) message = "¡Buen trabajo! Has completado tu primera sesión.";
	else message = "No te rindas, la arquitectura requiere práctica.";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;