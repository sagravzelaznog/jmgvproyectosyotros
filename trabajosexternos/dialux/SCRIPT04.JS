// Base de datos de preguntas específicas para Sesión 04
const quizData = [
	{
					question: "¿Qué efecto tiene pintar todas las paredes de un local de color negro mate (bajo coeficiente de reflexión) en el cálculo lumínico?",
					answers: ["La luz rebota más rápido", "Ninguno, el material es solo estético", "Se absorbe luz, reduciendo drásticamente los niveles de iluminancia", "Aumenta el deslumbramiento"],
					correct: 2
	},
	{
					question: "Al seleccionar un material en DIALux, ¿cuál es el parámetro matemático MÁS importante para el cálculo de iluminación indirecta?",
					answers: ["La resolución de la textura (píxeles)", "El Grado de Reflexión (Rho - ρ)", "El tamaño de la escala del mapa UV", "El grosor de la pared"],
					correct: 1
	},
	{
					question: "¿Cómo aplicas rápidamente un material a una superficie específica en la vista 3D?",
					answers: ["Arrastrando el material desde el panel hacia la superficie", "Escribiendo código en la consola", "Haciendo clic derecho y seleccionando 'Insertar Muro'", "Presionando Ctrl + C y Ctrl + V"],
					correct: 0
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
					feedbackMessage.textContent = "¡Brillante! Entiendes la física de la luz.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Cuidado con la absorción lumínica. ¡Repasa la teoría!";
					feedbackMessage.className = "text-error";
					
					// Resaltar la respuesta correcta
					const buttons = answersGrid.children;
					buttons[correctIndex].style.transform = "scale(1.05)";
					buttons[correctIndex].style.border = "3px solid white";
	}
	
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
	if (score === quizData.length) message = "¡Luminiscencia pura! Puntuación perfecta.";
	else if (score > 0) message = "Buen trabajo dominando las texturas y reflexiones.";
	else message = "La fotometría requiere precisión. ¡Vuelve a intentarlo!";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;