// Base de datos de preguntas específicas para Sesión 08
const quizData = [
	{
					question: "¿Por qué NO es recomendable exportar todas las páginas que DIALux ofrece por defecto en un reporte?",
					answers: ["Porque el PDF no se podrá enviar por correo", "Porque el programa se bloquea al procesarlo", "Porque genera un documento confuso, excesivamente largo y lleno de datos irrelevantes para el cliente", "Porque gasta mucha tinta a color"],
					correct: 2
	},
	{
					question: "Si el electricista necesita saber exactamente qué lámparas comprar y cuántas, ¿qué página del reporte es indispensable incluir?",
					answers: ["La portada con el logo", "La Lista de Luminarias", "Las gráficas de falsos colores", "El modelo 3D renderizado"],
					correct: 1
	},
	{
					question: "¿En qué pestaña o modo de DIALux evo encuentras la herramienta para previsualizar y generar el PDF final?",
					answers: ["Modo Construcción", "Modo Luz", "Modo Documentación", "Modo Exportar DWG"],
					correct: 2
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
					feedbackMessage.textContent = "¡Aprobado! Tu reporte está listo para firmarse.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Detalle técnico incorrecto. ¡Verifica tus páginas!";
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
	if (score === quizData.length) message = "¡Documentación impecable! Eres un profesional completo.";
	else if (score > 0) message = "Buen trabajo filtrando la información técnica.";
	else message = "La presentación es vital. Repasa la teoría de reportes.";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;