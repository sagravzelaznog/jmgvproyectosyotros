// Base de datos de preguntas específicas para Sesión 03
const quizData = [
	{
					question: "Al trazar los muros de un local, ¿qué acción es fundamental realizar al final para que se genere el volumen correctamente?",
					answers: ["Presionar ESC", "Cerrar el polígono", "Cambiar al visor 3D", "Guardar el archivo"],
					correct: 1
	},
	{
					question: "¿Qué herramienta se utiliza para agregar puertas o ventanas en los muros ya levantados?",
					answers: ["Herramienta de Techos", "Herramienta de Materiales", "Herramienta de Vanos (Aberturas)", "Herramienta de Extrusión"],
					correct: 2
	},
	{
					question: "Verdadero o Falso: Las ventanas y puertas perforan automáticamente los muros en DIALux cuando se colocan sobre ellos.",
					answers: ["Falso, hay que hacer un hueco manual antes", "Verdadero", "Solo si el muro es de concreto", "Falso, se colocan detrás del muro"],
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
					feedbackMessage.textContent = "¡Excelente! Comprensión espacial perfecta.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Cuidado con la estructura. ¡Inténtalo de nuevo!";
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
	if (score === quizData.length) message = "¡Arquitecto experto! Tu modelo 3D está listo.";
	else if (score > 0) message = "Buena estructura. Ya dominas los fundamentos del 3D.";
	else message = "El levantamiento 3D toma práctica. Repasa la teoría.";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;