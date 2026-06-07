// --- JMGV-PTEL Cálculo Integral JS ---

document.addEventListener('DOMContentLoaded', function() {
    
	// 1. LÓGICA DE ACORDIÓN (Accordion Problems)
	const acc = document.querySelectorAll(".accordion");
	
	acc.forEach(button => {
					button.addEventListener("click", function() {
									this.classList.toggle("active");
									const panel = this.nextElementSibling;
									if (panel.style.maxHeight) {
													panel.style.maxHeight = null;
									} else {
													panel.style.maxHeight = panel.scrollHeight + "px";
													// Esperar a MathJax para recalcular altura si es necesario tras renderizado
													if (window.MathJax) {
																	window.MathJax.typesetPromise([panel]).then(() => {
																					panel.style.maxHeight = panel.scrollHeight + "px";
																	});
													}
									}
					});
	});

	// 2. LÓGICA DEL QUIZ ESTILO KAHOOT
	const quizData = [
					{
									q: "Identifica la fórmula correcta de la Regla de la Potencia.",
									options: [
													"\\[ \\int x^n dx = \\frac{x^n}{n} \\]",
													"\\[ \\int v^n dx = \\frac{v^{n+1}}{n+1} + C \\]",
													"\\[ \\int v^n dv = \\frac{v^{n+1}}{n+1} + C \\]",
													"\\[ \\int v^n dv = v^{n+1} + C \\]"
									],
									correct: 2, // Índice del array de opciones
									teacherTip: "Matemática: En fatizar la necesidad de 'dv' para 'v'. El distractor 1 no tiene C. El distractor 2 usa dx para v."
					},
					{
									q: "¿Cuál es el diferencial \(dv\) si \(v = 3x+4\)?",
									options: [
													"3",
													"3dx",
													"dx",
													"3x"
									],
									correct: 1,
									teacherTip: "Concepto: El diferencial es la derivada por dx. Error común: olvidar el dx o poner solo la derivada."
					},
					{
									q: "Resuelve: \(\int \sqrt[3]{x} dx\) (Ayuda: reescribe exponente)",
									options: [
													"\\[ \\frac{3}{2}x^{2/3} + C \\]",
													"\\[ \\frac{3}{4}x^{4/3} + C \\]",
													"\\[ 3x^{4/3} + C \\]",
													"\\[ \\frac{4}{3}x^{4/3} + C \\]"
									],
									correct: 1,
									teacherTip: "Álgebra: \(\\sqrt[3]{x} = x^{1/3}\). n+1 = 4/3. El denominador es 4/3, el coeficiente es 3/4."
					},
					{
									q: "Si \(dv = a dx\) y en la integral original solo hay \(dx\), ¿cómo se 'completa'?",
									options: [
													"Sumando 'a' dentro",
													"Multiplicando por 'a' fuera",
													"Multiplicando por 'a' dentro y por '1/a' fuera",
													"Dividiendo por 'a' dentro"
									],
									correct: 2,
									teacherTip: "Cambio de Variable: Se multiplica por un uno 'con forma' (a/a) y se saca la constante necesaria (1/a)."
					},
					{
									q: "En \(\int (ax^2+b)^3 x dx\), si \(v = ax^2+b\), ¿qué falta para completar el diferencial?",
									options: [
													"Falta el término 'x'",
													"Falta la constante 'a'",
													"Falta la constante '2'",
													"Falta la constante '2a'"
									],
									correct: 3,
									teacherTip: "Diferencial Complejo: \(dv = \\frac{d}{dx}(ax^2+b)dx = 2axdx\). Ya tenemos xdx, faltan las constantes '2a'."
					}
	];

	let currentQuestion = 0;
	let score = 0;

	const questionText = document.getElementById('question-text');
	const optionBtns = document.querySelectorAll('.option-btn');
	const scoreText = document.getElementById('current-score');

	function loadQuestion() {
					if (currentQuestion >= quizData.length) {
									questionText.textContent = "¡Quiz Completado!";
									document.querySelector('.options-grid').style.display = 'none';
									return;
					}

					const currentData = quizData[currentQuestion];
					questionText.textContent = `Q${currentQuestion+1}: ${currentData.q}`;
					
					optionBtns.forEach((btn, index) => {
									btn.textContent = currentData.options[index];
									btn.style.opacity = '1';
									btn.disabled = false;
					});

					// Tip pedagógico: Renderizar MathJax en preguntas y botones dinámicos
					if (window.MathJax) {
									window.MathJax.typesetPromise([questionText, ...optionBtns]);
					}
	}

	// Definición global de answerQuestion para el HTML
	window.answerQuestion = function(selectedIndex) {
					if (quizData[currentQuestion].correct === selectedIndex) {
									score++;
									scoreText.textContent = score;
									optionBtns[selectedIndex].style.filter = "brightness(1.3) border: 3px solid white";
					} else {
									optionBtns[selectedIndex].style.opacity = '0.3';
					}

					// Deshabilitar botones tras responder
					optionBtns.forEach(btn => btn.disabled = true);

					currentQuestion++;
					setTimeout(loadQuestion, 1200); // Pequeña pausa para ver feedback
	}

	// 3. MODO MAESTRO (Oculto)
	const teacherLogin = document.getElementById('teacher-login');
	const teacherContent = document.getElementById('teacher-content');
	const teacherAnswersList = document.getElementById('teacher-answers-list');

	window.unlockTeacherMode = function() {
					const pwdInput = document.getElementById('teacher-pwd').value;
					if (pwdInput === "1983") {
									teacherLogin.classList.add('hidden');
									teacherContent.classList.remove('hidden');
									loadTeacherAnswers();
					} else {
									alert("Contraseña incorrecta. Solo acceso para el Genio Maestro.");
					}
	}

	function loadTeacherAnswers() {
					teacherAnswersList.innerHTML = '';
					quizData.forEach((q, index) => {
									const li = document.createElement('li');
									li.innerHTML = `
													<strong>Pregunta ${index + 1}:</strong> \[ ${q.options[q.correct]} \]
													<span class="teach-tip">${q.teacherTip}</span>
									`;
									teacherAnswersList.appendChild(li);
					});
					// Renderizar mate en el panel del maestro
					if (window.MathJax) {
									window.MathJax.typesetPromise([teacherAnswersList]);
					}
	}

	// Inicializar Quiz
	loadQuestion();
});