// Base de datos de preguntas específicas para Sesión 06
const quizData = [
	{
					question: "¿Qué es el 'Plano Útil' en un cálculo de iluminación?",
					answers: ["La herramienta para medir la pared", "Una superficie virtual a cierta altura donde se realiza la tarea visual (ej. un escritorio)", "El piso de la habitación", "El plano DWG original"],
					correct: 1
	},
	{
					question: "¿Qué nos muestran visualmente las 'Isolíneas' en los resultados del cálculo?",
					answers: ["Los cables eléctricos de la instalación", "Las sombras proyectadas por los muebles", "El recorrido exacto que hace el rayo de luz", "Curvas topográficas que unen puntos con la misma cantidad de luxes"],
					correct: 3
	},
	{
					question: "En las gráficas de falsos colores, ¿qué suelen indicar los colores fríos como el azul oscuro o violeta?",
					answers: ["Zonas de alta iluminación (muchos luxes)", "La temperatura de color de la lámpara", "Zonas oscuras o con bajos niveles de iluminación", "Mucha reflexión del material"],
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
					feedbackMessage.textContent = "¡Cálculo exacto! Muy bien.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Error de lectura. ¡Repasa la teoría!";
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
	if (score === quizData.length) message = "¡Analista experto! Comprendes la luz matemáticamente.";
	else if (score > 0) message = "Buen análisis. Dominas las bases de los reportes.";
	else message = "Los números no mienten. Te sugiero repasar los falsos colores.";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;