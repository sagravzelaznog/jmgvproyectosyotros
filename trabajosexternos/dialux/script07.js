// Base de datos de preguntas específicas para Sesión 07
const quizData = [
	{
					question: "¿Por qué es crucial establecer la orientación del Norte y la ubicación geográfica exacta en el proyecto?",
					answers: ["Para que el software cambie el idioma", "Para calcular con precisión la trayectoria solar y las sombras reales", "Para poder exportar el archivo en PDF", "Solo sirve para proyectos en exteriores, no interiores"],
					correct: 1
	},
	{
					question: "¿Qué es una 'Escena de Luz' en DIALux?",
					answers: ["Un render de alta calidad de la habitación", "Un video animado del proyecto", "La eliminación de todas las luminarias", "Una configuración específica de encendido, apagado o atenuación de grupos de luminarias"],
					correct: 3
	},
	{
					question: "Si quieres calcular el 'peor escenario' posible de iluminación natural durante el día, ¿qué modelo de cielo CIE deberías utilizar?",
					answers: ["Cielo Claro con Sol directo", "Cielo Promedio", "Cielo Cubierto (Overcast Sky)", "Escena Nocturna"],
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
					feedbackMessage.textContent = "¡Brillante! Controlas la luz natural y artificial.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Te falló la configuración solar. ¡Repásalo!";
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
	if (score === quizData.length) message = "¡Maestro de la Luz! Las escenas no tienen secretos para ti.";
	else if (score > 0) message = "Gran control. Las atmósferas empiezan a cobrar vida.";
	else message = "El dinamismo requiere práctica. Revisa los grupos de control.";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;