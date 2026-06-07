// Base de datos de preguntas específicas para Sesión 09
const quizData = [
	{
					question: "¿Cuál es el principal objetivo de exportar un archivo DWG desde DIALux evo?",
					answers: ["Crear un render en 3D para el cliente", "Enviar el sembrado de luminarias exacto a los ingenieros para el plano eléctrico en AutoCAD", "Cambiar el color de las paredes", "Calcular el costo total de la energía eléctrica"],
					correct: 1
	},
	{
					question: "¿Cómo representa DIALux las luminarias una vez que abres el archivo exportado en AutoCAD?",
					answers: ["Como imágenes JPG pegadas", "Como texto plano que describe la lámpara", "Como Bloques (Blocks) de AutoCAD ordenados en capas", "Como nubes de puntos"],
					correct: 2
	},
	{
					question: "Para que el archivo exportado de DIALux coincida perfectamente al pegarlo sobre tu plano arquitectónico original en AutoCAD, ¿qué debiste hacer en la Sesión 02?",
					answers: ["Establecer correctamente el punto de origen (0,0) al importar el plano base", "Pintar todas las paredes de blanco", "Hacer el render de alta calidad", "Usar solo lámparas LED"],
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
					feedbackMessage.textContent = "¡Coordenadas exactas! Eres un maestro del BIM/CAD.";
					feedbackMessage.className = "text-success";
					score++;
	} else {
					buttonElement.classList.add("wrong-anim");
					feedbackMessage.textContent = "Error de exportación. Revisa la lógica de capas.";
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
	if (score === quizData.length) message = "¡Sincronización perfecta! Tu flujo de trabajo es profesional.";
	else if (score > 0) message = "Buen trabajo. Tu conocimiento de CAD es sólido.";
	else message = "La comunicación entre softwares requiere precisión. ¡Repásalo!";
	
	scoreText.innerHTML = `${message}<br><br>Acertaste ${score} de ${quizData.length} preguntas.`;
}

// Iniciar el quiz al cargar la página
window.onload = initQuiz;