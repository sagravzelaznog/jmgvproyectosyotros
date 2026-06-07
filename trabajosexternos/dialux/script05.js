// Base de datos de preguntas específicas para Sesión 05
const quizData = [
	{
					question: "¿Qué información fundamental contiene un archivo con extensión .IES o .LDT?",
					answers: ["La forma en que se distribuye la luz en el espacio (Fotometría)", "El modelo 3D detallado de la carcasa de la lámpara", "Los colores de las paredes de la habitación", "El plano eléctrico para la instalación"],
					correct: 0
	},
	{
					question: "Si necesitas iluminar un pasillo largo usando tubos LED continuos, ¿qué herramienta de disposición es la más eficiente?",
					answers: ["Disposición individual múltiple", "Disposición circular", "Disposición en línea", "Disposición en rejilla"],
					correct: 2
	},
	{
					question: "¿Qué nos indica visualmente la 'Curva Polar' de una luminaria?",
					answers: ["El consumo eléctrico en Watts", "La distribución de la intensidad luminosa", "El peso físico del equipo", "El precio de la lámpara en el mercado"],
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
					feedbackMessage.textContent = "¡Exacto! Tienes ojo de Lighting Designer.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Revisa la teoría fotométrica. ¡Incorrecto!";
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
	if (score === quizData.length) message = "¡Fotometría dominada! Estás listo para calcular.";
	else if (score > 0) message = "Buen manejo de la luz. Sigue practicando las disposiciones.";
	else message = "La física de la luz requiere repaso. ¡Vuelve a leer la teoría!";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;