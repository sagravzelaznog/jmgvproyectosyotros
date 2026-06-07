// Datos del Quiz (Preguntas pedagógicamente estructuradas)
const quizData = [
	{
					question: "1. Según la teoría vista, ¿cuál es la causa principal del viento?",
					options: {
									a: "El movimiento de las mareas",
									b: "El calentamiento desigual de la Tierra por el sol",
									c: "La rotación de la luna"
					},
					correct: "b"
	},
	{
					question: "2. ¿Qué establece la Ley de Betz de forma simplificada?",
					options: {
									a: "Podemos capturar el 100% de la energía del viento",
									b: "El viento siempre sopla de norte a sur",
									c: "Existe un límite físico (aprox 59%) de energía que podemos extraer"
					},
					correct: "c"
	},
	{
					question: "3. En la práctica del anemómetro, ¿qué principio físico hace que gire?",
					options: {
									a: "Sustentación (como un avión)",
									b: "Magnetismo",
									c: "Arrastre (el aire empuja las cazoletas)"
					},
					correct: "c"
	},
	{
					question: "4. ¿Qué representan los popotes (pajitas) en nuestro modelo?",
					options: {
									a: "Las aspas o el rotor",
									b: "La torre",
									c: "El generador eléctrico"
					},
					correct: "a"
	},
	{
					question: "5. ¿Por qué el aire caliente tiende a subir?",
					options: {
									a: "Porque es más pesado",
									b: "Porque es menos denso que el aire frío",
									c: "Por el magnetismo terrestre"
					},
					correct: "b"
	}
];

// Generar el Quiz al cargar
const quizContainer = document.getElementById('quiz-container');

function buildQuiz() {
	const output = [];

	quizData.forEach((currentQuestion, questionNumber) => {
					const options = [];

					for (letter in currentQuestion.options) {
									options.push(
													`<label class="quiz-option">
																	<input type="radio" name="question${questionNumber}" value="${letter}">
																	${letter} : ${currentQuestion.options[letter]}
													</label>`
									);
					}

					output.push(
									`<div class="question-block" style="margin-bottom: 20px;">
													<p><strong>${currentQuestion.question}</strong></p>
													<div class="options">${options.join('')}</div>
									</div>`
					);
	});

	quizContainer.innerHTML = output.join('');
}

// Lógica de Evaluación
function checkQuiz() {
	const answerContainers = quizContainer.querySelectorAll('.options');
	let numCorrect = 0;

	quizData.forEach((currentQuestion, questionNumber) => {
					const answerContainer = answerContainers[questionNumber];
					const selector = `input[name=question${questionNumber}]:checked`;
					const userAnswer = (answerContainer.querySelector(selector) || {}).value;

					if (userAnswer === currentQuestion.correct) {
									numCorrect++;
									answerContainers[questionNumber].style.borderLeft = '4px solid #28a745'; // Verde
					} else {
									answerContainers[questionNumber].style.borderLeft = '4px solid #dc3545'; // Rojo
					}
	});

	// Feedback Psicológico y Pedagógico
	const resultArea = document.getElementById('result-area');
	resultArea.classList.remove('hidden');
	resultArea.innerHTML = ''; // Limpiar previo

	let feedbackMessage = "";
	let cssClass = "";

	if (numCorrect === 5) {
					feedbackMessage = `<h3>¡Excelente Trabajo! (5/5)</h3><p>Tienes una comprensión sólida de la aerodinámica básica. Estás listo para diseñar aspas reales en la siguiente sesión.</p>`;
					cssClass = "result-good";
	} else if (numCorrect >= 3) {
					feedbackMessage = `<h3>Buen esfuerzo (${numCorrect}/5)</h3><p>Entendiste los conceptos clave, pero revisa las preguntas marcadas en rojo para afinar tu conocimiento técnico antes de avanzar.</p>`;
					cssClass = "result-good"; // Aún es positivo
	} else {
					feedbackMessage = `<h3>Sigue intentando (${numCorrect}/5)</h3><p>La ingeniería requiere paciencia. Te recomiendo releer la sección de Teoría, especialmente la Ley de Betz, y volver a intentar.</p>`;
					cssClass = "result-bad";
	}

	resultArea.innerHTML = feedbackMessage;
	resultArea.className = cssClass; // Asignar clase para estilo
}

// Barra de Progreso de Lectura
window.onscroll = function() {
	let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	let scrolled = (winScroll / height) * 100;
	document.getElementById("scrollProgress").style.width = scrolled + "%";
};

// Inicializar
buildQuiz();