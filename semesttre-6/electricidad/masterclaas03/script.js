// Datos del Quiz - Sesión 03
const quizData = [
	{
					question: "1. ¿Qué es el 'Ángulo de Ataque' en un aspa?",
					options: {
									a: "El ángulo en el que se corta el tubo de PVC con la sierra.",
									b: "La inclinación del aspa respecto a la dirección del viento.",
									c: "El ángulo de la torre respecto al suelo."
					},
					correct: "b"
	},
	{
					question: "2. Según el perfil NACA ideal, ¿cómo deben ser los bordes del aspa?",
					options: {
									a: "Borde de Ataque plano y Borde de Fuga plano.",
									b: "Borde de Ataque afilado y Borde de Fuga grueso.",
									c: "Borde de Ataque redondeado y Borde de Fuga afilado."
					},
					correct: "c"
	},
	{
					question: "3. ¿Por qué las aspas modernas tienen 'torsión' (twist)?",
					options: {
									a: "Porque la punta del aspa viaja más rápido que la base.",
									b: "Para que se vean más estéticas al girar.",
									c: "Para evitar que el viento las rompa por la mitad."
					},
					correct: "a"
	},
	{
					question: "4. Al tallar el aspa en el tubo de PVC, ¿qué se logra al usar este material curvo?",
					options: {
									a: "Generar energía magnética directamente.",
									b: "Imitar la curvatura de un perfil aerodinámico que genera sustentación.",
									c: "Hacer que el aerogenerador sea más pesado y estable."
					},
					correct: "b"
	},
	{
					question: "5. En el trazado del aspa sobre el PVC, ¿qué parte debe ser más ancha?",
					options: {
									a: "La punta (la parte más alejada del centro).",
									b: "Ambos extremos deben tener exactamente el mismo ancho.",
									c: "La raíz (la parte que se atornilla al rotor central)."
					},
					correct: "c"
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

// Evaluar Quiz
function checkQuiz() {
	const answerContainers = quizContainer.querySelectorAll('.options');
	let numCorrect = 0;

	quizData.forEach((currentQuestion, questionNumber) => {
					const answerContainer = answerContainers[questionNumber];
					const selector = `input[name=question${questionNumber}]:checked`;
					const userAnswer = (answerContainer.querySelector(selector) || {}).value;
					const qBlock = document.getElementById(`qb-${questionNumber}`);

					// Andragogía: Refuerzo visual directo
					if (userAnswer === currentQuestion.correct) {
									numCorrect++;
									qBlock.style.borderLeftColor = 'var(--success)';
									qBlock.style.backgroundColor = '#f6fbf7';
					} else {
									qBlock.style.borderLeftColor = 'var(--error)';
									qBlock.style.backgroundColor = '#fdf6f6';
					}
	});

	const resultArea = document.getElementById('result-area');
	resultArea.classList.remove('hidden');

	// Psicología: Retroalimentación empática y orientada a la acción
	if (numCorrect === 5) {
					resultArea.innerHTML = `<h3>¡Magistral! (5/5)</h3>
					<p>Tu comprensión del diseño estructural y aerodinámico es excelente. Ya dominas la geometría necesaria para tallar tus aspas de PVC con total seguridad de que funcionarán.</p>`;
					resultArea.className = "result-good";
	} else if (numCorrect >= 3) {
					resultArea.innerHTML = `<h3>Buen progreso (${numCorrect}/5)</h3>
					<p>Has captado la esencia del tallado. Recuerda revisar la importancia de la <em>torsión</em> y el perfil <em>NACA</em> en las respuestas marcadas en rojo para perfeccionar la eficiencia de tus cortes.</p>`;
					resultArea.className = "result-good";
	} else {
					resultArea.innerHTML = `<h3>Oportunidad de Ajuste (${numCorrect}/5)</h3>
					<p>El diseño de aspas es precisión pura. Te sugiero repasar la teoría del "Ángulo de Ataque" en las gráficas superiores. ¡Un error en papel es un aprendizaje, un error en el PVC cuesta material! Intenta de nuevo.</p>`;
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

// Inicializar la interfaz
buildQuiz();