// Datos del Quiz - Sesión 02
const quizData = [
	{
					question: "1. ¿Qué afirma el Principio de Bernoulli sobre los fluidos?",
					options: {
									a: "A mayor velocidad del fluido, mayor es su presión.",
									b: "A mayor velocidad del fluido, menor es su presión.",
									c: "La presión del aire siempre es constante."
					},
					correct: "b"
	},
	{
					question: "2. La fuerza que empuja un aspa hacia 'arriba' debido a la diferencia de presiones se llama:",
					options: {
									a: "Arrastre (Drag)",
									b: "Gravedad",
									c: "Sustentación (Lift)"
					},
					correct: "c"
	},
	{
					question: "3. Un rotor tipo SAVONIUS funciona principalmente gracias al principio de:",
					options: {
									a: "Sustentación",
									b: "Arrastre",
									c: "Magnetismo"
					},
					correct: "b"
	},
	{
					question: "4. En la práctica del papel, ¿por qué el papel se levantó al soplar por encima de él?",
					options: {
									a: "Porque el aire caliente sube.",
									b: "Porque el soplido empujó el papel desde abajo.",
									c: "Porque se creó una zona de baja presión arriba del papel."
					},
					correct: "c"
	},
	{
					question: "5. Si quisieras construir un aerogenerador muy rápido y eficiente, ¿qué diseño elegirías?",
					options: {
									a: "Tipo Hélice (basado en sustentación)",
									b: "Tipo Savonius (basado en arrastre)",
									c: "Rotor de cazoletas plano"
					},
					correct: "a"
	}
];

const quizContainer = document.getElementById('quiz-container');

// Generar Quiz Dinámicamente
function buildQuiz() {
	const output = [];

	quizData.forEach((currentQuestion, questionNumber) => {
					const options = [];
					for (letter in currentQuestion.options) {
									options.push(
													`<label class="quiz-option">
																	<input type="radio" name="question${questionNumber}" value="${letter}">
																	<strong>${letter.toUpperCase()})</strong> ${currentQuestion.options[letter]}
													</label>`
									);
					}
					output.push(
									`<div class="question-block" id="qb-${questionNumber}">
													<p style="font-size: 1.1rem; margin-top:0;"><strong>${currentQuestion.question}</strong></p>
													<div class="options">${options.join('')}</div>
									</div>`
					);
	});
	quizContainer.innerHTML = output.join('');
}

// Evaluar Quiz (Con Psicología de Refuerzo Positivo)
function checkQuiz() {
	const answerContainers = quizContainer.querySelectorAll('.options');
	let numCorrect = 0;

	quizData.forEach((currentQuestion, questionNumber) => {
					const answerContainer = answerContainers[questionNumber];
					const selector = `input[name=question${questionNumber}]:checked`;
					const userAnswer = (answerContainer.querySelector(selector) || {}).value;
					const qBlock = document.getElementById(`qb-${questionNumber}`);

					if (userAnswer === currentQuestion.correct) {
									numCorrect++;
									qBlock.style.borderLeftColor = '#34a853'; // Verde Google
									qBlock.style.backgroundColor = '#f6fbf7';
					} else {
									qBlock.style.borderLeftColor = '#ea4335'; // Rojo Google
									qBlock.style.backgroundColor = '#fdf6f6';
					}
	});

	const resultArea = document.getElementById('result-area');
	resultArea.classList.remove('hidden');

	// Andragogía: Feedback constructivo basado en resultados
	if (numCorrect === 5) {
					resultArea.innerHTML = `<h3>¡Calificación Perfecta! (5/5)</h3>
					<p>Has dominado el principio de Bernoulli. Estás pensando como un verdadero ingeniero aeronáutico. ¡Listo para diseñar aspas en la Sesión 3!</p>`;
					resultArea.className = "result-good";
	} else if (numCorrect >= 3) {
					resultArea.innerHTML = `<h3>¡Bien hecho! (${numCorrect}/5)</h3>
					<p>Tienes clara la diferencia entre sustentación y arrastre. Revisa las preguntas en rojo para ajustar los últimos detalles técnicos.</p>`;
					resultArea.className = "result-good";
	} else {
					resultArea.innerHTML = `<h3>Área de Oportunidad (${numCorrect}/5)</h3>
					<p>La aerodinámica requiere repasar los conceptos. Recuerda: <em>Mayor velocidad = Menor presión = Sustentación</em>. Vuelve a leer la sección teórica y reintenta.</p>`;
					resultArea.className = "result-bad";
	}
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