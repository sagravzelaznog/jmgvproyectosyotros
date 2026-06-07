const detailedSolutions = [
	{
			id: 1,
			formula: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C",
			steps: [
					"Identificar n = 6.",
					"Aplicar n + 1: 6 + 1 = 7.",
					"Dividir entre el nuevo exponente."
			],
			explanation: "Se aplica la regla básica de potencias para integrales indefinidas.",
			result: "\\frac{x^7}{7} + C"
	},
	{
			id: 2,
			formula: "c \\int x^n dx = c \\frac{x^{n+1}}{n+1} + C",
			steps: [
					"Extraer la constante 5.",
					"Integrar x^4 obteniendo x^5/5.",
					"Simplificar 5/5."
			],
			explanation: "La constante multiplicativa se mantiene y se simplifica con el nuevo denominador.",
			result: "x^5 + C"
	},
	{
			id: 3,
			formula: "b \\int x^n dx = b \\frac{x^{n+1}}{n+1} + C",
			steps: [
					"Mantener la constante 'b' fuera.",
					"Aumentar el exponente de 3 a 4.",
					"Dividir por el nuevo exponente 4."
			],
			explanation: "Tratamos las letras iniciales del alfabeto (a, b, c) generalmente como constantes.",
			result: "\\frac{bx^4}{4} + C"
	},
	{
			id: 4,
			formula: "\\sqrt{3} \\int x^2 dx",
			steps: [
					"La constante es sqrt(3).",
					"La integral de x^2 es x^3/3.",
					"Combinar términos."
			],
			explanation: "Cualquier número real, incluso raíces, funciona como constante multiplicativa.",
			result: "\\frac{\\sqrt{3}x^3}{3} + C"
	},
	{
			id: 5,
			formula: "\\int k~dx = kx + C",
			steps: [
					"Identificar que 'a' no depende de x.",
					"La integral de una constante es la constante por la variable."
			],
			explanation: "Es el proceso inverso a la derivada de una función lineal (f(x)=ax).",
			result: "ax + C"
	},
	{
			id: 6,
			formula: "\\int k\\,dx = kx + C",
			steps: [
					"Identificar la constante k = 3/4.",
					"Aplicar la regla de la constante.",
					"Añadir la variable de integración x."
			],
			explanation: "Cualquier fracción constante sigue la regla básica de integración de constantes.",
			result: "\\frac{3}{4}x + C"
	},
	{
			id: 7,
			formula: "\\int \\frac{1}{k}\\,dx = \\frac{1}{k}x + C",
			steps: [
					"Reescribir como (1/3) * integral de dx.",
					"Integrar para obtener x/3."
			],
			explanation: "El denominador constante se mantiene bajo la variable x.",
			result: "\\frac{x}{3} + C"
	},
	{
			id: 8,
			formula: "\\int x^{1/3} dx = \\frac{x^{1/3+1}}{1/3+1}",
			steps: [
					"Convertir raíz cúbica a exponente fraccionario (1/3).",
					"Sumar 1 al exponente: 1/3 + 3/3 = 4/3.",
					"Multiplicar por el inverso del nuevo exponente (3/4)."
			],
			explanation: "Para integrar radicales, siempre conviértelos primero a potencias fraccionarias.",
			result: "\\frac{3x^{4/3}}{4} + C"
	},
	{
			id: 9,
			formula: "5 \\int x^{1/4} dx",
			steps: [
					"Extraer el 5 y convertir la raíz cuarta a x^(1/4).",
					"Nuevo exponente: 1/4 + 1 = 5/4.",
					"Dividir: 5 / (5/4) = 4."
			],
			explanation: "El coeficiente 5 se simplifica perfectamente con el nuevo denominador 5/4.",
			result: "4x^{5/4} + C"
	},
	{
			id: 10,
			formula: "\\int x^{-3} dx = \\frac{x^{-3+1}}{-3+1}",
			steps: [
					"Subir x^3 como x^-3.",
					"Sumar 1 al exponente: -3 + 1 = -2.",
					"Dividir por -2 y reacomodar como fracción positiva."
			],
			explanation: "Las potencias en el denominador se manejan como exponentes negativos antes de aplicar la regla de la potencia.",
			result: "-\\frac{1}{2x^2} + C"
	},
{
			id: 11,
			formula: "5 \\int x^{-4} dx",
			steps: [
					"Subir x^4 como x^-4.",
					"Sumar 1 al exponente: -4 + 1 = -3.",
					"Dividir 5 entre -3 y bajar x^3 al denominador."
			],
			explanation: "Cuando la variable está en el denominador con una potencia, se usa un exponente negativo para aplicar la regla de la potencia.",
			result: "-\\frac{5}{3x^3} + C"
	},
	{
			id: 12,
			formula: "\\int x^{-1/4} dx",
			steps: [
					"Transformar raíz cuarta en el denominador a x^-1/4.",
					"Nuevo exponente: -1/4 + 4/4 = 3/4.",
					"Multiplicar por el recíproco 4/3."
			],
			explanation: "Este ejercicio combina el manejo de radicales y potencias negativas.",
			result: "\\frac{4x^{3/4}}{3} + C"
	},
	{
			id: 13,
			formula: "4 \\int \\frac{1}{x} dx",
			steps: [
					"Extraer la constante 4.",
					"Identificar la integral inmediata del logaritmo natural."
			],
			explanation: "Importante: La regla de la potencia no aplica cuando el exponente es -1.",
			result: "4\\ln|x| + C"
	},
	{
			id: 14,
			formula: "6 \\int x^{-1/3} dx",
			steps: [
					"Convertir raíz cúbica en el denominador a x^-1/3.",
					"Sumar 1 al exponente: 2/3.",
					"Simplificar: 6 / (2/3) = 18/2 = 9."
			],
			explanation: "La constante se multiplica por el inverso de la nueva fracción del exponente.",
			result: "9x^{2/3} + C"
	},
	{
			id: 15,
			formula: "\\int x^{3/5} dx",
			steps: [
					"Convertir raíz quinta de x^3 a x^(3/5).",
					"Nuevo exponente: 3/5 + 1 = 8/5.",
					"Multiplicar por el recíproco 5/8."
			],
			explanation: "Se aplica la regla de la potencia directamente tras la conversión del radical.",
			result: "\\frac{5x^{8/5}}{8} + C"
	},
		{
			id: 16,
			formula: "a \\int x^{-2/3} dx",
			steps: [
					"Extraer constante 'a' y subir x como potencia negativa -2/3.",
					"Sumar 1 al exponente: -2/3 + 1 = 1/3.",
					"Dividir 'a' entre 1/3 (multiplicar por 3)."
			],
			explanation: "Se manejan constantes literales y potencias fraccionarias negativas simultáneamente.",
			result: "3ax^{1/3} + C"
	},
	{
			id: 17,
			formula: "\\frac{5}{2} \\int \\frac{1}{x} dx",
			steps: [
					"Separar la constante 5/2 de la variable.",
					"Aplicar la regla directa del logaritmo natural para 1/x."
			],
			explanation: "Las constantes en el denominador también deben extraerse antes de integrar.",
			result: "\\frac{5}{2}\\ln|x| + C"
	},
	{
			id: 18,
			formula: "\\sqrt{b} \\int x^{1/2} dx",
			steps: [
					"Propiedad de radicales: sqrt(bx) = sqrt(b) * sqrt(x).",
					"Nuevo exponente: 1/2 + 1 = 3/2.",
					"Multiplicar la constante por el recíproco 2/3."
			],
			explanation: "Es vital separar la constante numérica o literal de la variable bajo el radical.",
			result: "\\frac{2\\sqrt{b}x^{3/2}}{3} + C"
	},
	{
			id: 19,
			formula: "\\int 5x^{-1/3} dx - \\int 4x^{1/3} dx",
			steps: [
					"Dividir en dos integrales independientes.",
					"Término 1: 5 * (x^(2/3) / (2/3)) = 15/2 x^(2/3).",
					"Término 2: 4 * (x^(4/3) / (4/3)) = 3 x^(4/3)."
			],
			explanation: "Este ejercicio practica la integración de sumas con exponentes fraccionarios.",
			result: "\\frac{15}{2}x^{2/3} - 3x^{4/3} + C"
	},
	{
			id: 20,
			formula: "\\sum \\int x^n dx",
			steps: [
					"Término 1: 3x^-5 -> 3x^-4 / -4.",
					"Término 2: -2x^-2 -> -2x^-1 / -1.",
					"Término 3: -6/x -> -6 ln|x|."
			],
			explanation: "Se combinan potencias negativas con la regla del logaritmo en un solo polinomio.",
			result: "-\\frac{3}{4x^4} + \\frac{2}{x} - 6\\ln|x| + C"
	},
	{
			id: 21,
			formula: "\\int (at)^{1/3} dt",
			steps: [
					"Convertir raíz cúbica a exponente 1/3.",
					"Integrar: (at)^(4/3) dividido por (4/3) y por la constante 'a'.",
					"Simplificar la fracción resultante."
			],
			explanation: "Se introduce la variable 't'. Las constantes literales (a) se manejan igual que las numéricas.",
			result: "\\frac{3(at)^{4/3}}{4a} + C"
	},
	{
			id: 22,
			formula: "\\int (6t)^{1/2} dt",
			steps: [
					"Transformar la raíz cuadrada a potencia 1/2.",
					"Aplicar regla de la potencia: (6t)^(3/2) / (3/2 * 6).",
					"Simplificar el denominador: 1.5 * 6 = 9."
			],
			explanation: "Ejercicio de refuerzo para integración de funciones lineales bajo un radical.",
			result: "\\frac{(6t)^{3/2}}{9} + C"
	},
	{
			id: 23,
			formula: "\\int \\sum a_i x^i dx",
			steps: [
					"Integrar 8x^5 -> 8x^6/6 = 4x^6/3.",
					"Integrar -5x^4 -> -5x^5/5 = -x^5.",
					"Integrar cada término sucesivo bajando el grado.",
					"La constante -3 se convierte en -3x."
			],
			explanation: "Práctica de polinomios extensos. Se debe cuidar la simplificación de cada fracción.",
			result: "\\frac{4x^6}{3}-x^5-x^4-2x^3-x^2-3x + C"
	},
	{
			id: 24,
			formula: "\\int (ax^3 - bx^2 - cx + d) dx",
			steps: [
					"Identificar que a, b, c, d son constantes.",
					"Aplicar n+1 a cada potencia de x.",
					"Dividir cada término por su nuevo exponente."
			],
			explanation: "Base fundamental para el cálculo integral con coeficientes indeterminados.",
			result: "\\frac{ax^4}{4}-\\frac{bx^3}{3}-\\frac{cx^2}{2}+dx + C"
	},
	{
			id: 25,
			formula: "\\int (k_1 x^2 - k_2 x - k_3) dx",
			steps: [
					"Tratar los denominadores con raíces como constantes fijas.",
					"Integrar x^2 para obtener x^3/3.",
					"Integrar 3x para obtener 3x^2/2.",
					"Integrar la constante 5*sqrt(b) agregando la variable x."
			],
			explanation: "Uso de constantes complejas para evaluar la capacidad de identificar la variable real.",
			result: "\\frac{x^3}{3\\sqrt{a^2+b^2}}-\\frac{3x^2}{2\\sqrt{a}}-5x\\sqrt{b} + C"
	}
,
	{
			id: 26,
			formula: "\\int \\frac{x^4-6x^3-7x}{x} dx = \\int (x^3-6x^2-7) dx",
			steps: [
					"Dividir cada término del numerador por x.",
					"Integrar x^3 -> x^4/4.",
					"Integrar -6x^2 -> -2x^3.",
					"Integrar -7 -> -7x."
			],
			explanation: "La simplificación por división de monomios es el paso más eficiente antes de integrar.",
			result: "\\frac{x^4}{4} - 2x^3 - 7x + C"
	},
	{
			id: 27,
			formula: "\\int (3x^{-2/5} - 2x^{-1/5}) dx",
			steps: [
					"Convertir radicales en el denominador a potencias negativas.",
					"Sumar 1 a -2/5 para obtener 3/5; multiplicar 3 por el recíproco 5/3 para obtener 5.",
					"Sumar 1 a -1/5 para obtener 4/5; multiplicar 2 por el recíproco 5/4 para obtener 5/2."
			],
			explanation: "Se manejan exponentes fraccionarios negativos para aplicar la regla de la potencia.",
			result: "5x^{3/5} - \\frac{5x^{4/5}}{2} + C"
	},
	{
			id: 28,
			formula: "\\int (4x^{-1/3} - 5x^{-1/4}) dx",
			steps: [
					"Reescribir los términos como potencias negativas.",
					"Término 1: 4 * (x^(2/3) / (2/3)) = 6x^(2/3).",
					"Término 2: 5 * (x^(3/4) / (3/4)) = 20/3 x^(3/4)."
			],
			explanation: "Este ejercicio refuerza la aritmética de fracciones en los coeficientes y exponentes.",
			result: "6x^{2/3} - \\frac{20x^{3/4}}{3} + C"
	},
	{
			id: 29,
			formula: "\\int \\sum y^n dy",
			steps: [
					"Integrar y^(5/2) -> 2y^(7/2)/7.",
					"Integrar -5y^(4/3) -> -5 * (3/7)y^(7/3) = -15y^(7/3)/7.",
					"Integrar -2y^(1/4) -> -2 * (4/5)y^(5/4) = -8y^(5/4)/5.",
					"Integrar -y^(1/2) -> -2y^(3/2)/3."
			],
			explanation: "Se aplica la regla de la potencia término a término para una variable distinta (y).",
			result: "\\frac{2y^{7/2}}{7} - \\frac{15y^{7/3}}{7} - \\frac{8y^{5/4}}{5} - \\frac{2y^{3/2}}{3} + C"
	},
	{
			id: 30,
			formula: "\\int (y^{-1} - y^{-1/3} - y^{-7/4}) dy",
			steps: [
					"Simplificar la fracción restando exponentes de y.",
					"La integral de y^-1 es el logaritmo natural ln|y|.",
					"Aplicar regla de la potencia a los términos restantes."
			],
			explanation: "Fundamental reconocer que x^-1 (o y^-1) no sigue la regla de la potencia habitual.",
			result: "\\ln|y| + 3y^{2/3} + \\frac{4y^{-3/4}}{3} + C"
	}
,
	{
			id: 31,
			formula: "\\int (5t^{7/3} - 3t^{4/3} + 2t^{1/3}) dt",
			steps: [
					"Distribuir t^(1/3) multiplicando a cada término.",
					"Integrar t^(7/3) -> t^(10/3) / (10/3).",
					"Integrar t^(4/3) -> t^(7/3) / (7/3).",
					"Integrar t^(1/3) -> t^(4/3) / (4/3)."
			],
			explanation: "Fundamental: Siempre realiza las multiplicaciones indicadas antes de intentar integrar.",
			result: "\\frac{3}{2}t^{10/3} - \\frac{9}{7}t^{7/3} + \\frac{3}{2}t^{4/3} + C"
	},
	{
			id: 32,
			formula: "\\int (7t)^{1/3} dt",
			steps: [
					"Cambio de variable: u = 7t, du = 7 dt.",
					"Despejar dt: dt = du/7.",
					"Sustituir: (1/7) integral de u^(1/3).",
					"Resultado en u: (1/7) * (3/4) * u^(4/3)."
			],
			explanation: "Introducción a la sustitución simple cuando el argumento del radical no es solo x.",
			result: "\\frac{3(7t)^{4/3}}{28} + C"
	},
	{
			id: 33,
			formula: "\\int u^6 \\frac{du}{3}",
			steps: [
					"Identificar u = 3x+4.",
					"Derivar: du = 3 dx -> dx = du/3.",
					"Sacar 1/3 de la integral.",
					"Integrar u^6 -> u^7/7."
			],
			explanation: "Regla de la Cadena inversa: Se compensa la derivada interna multiplicando por su recíproco.",
			result: "\\frac{(3x+4)^7}{21} + C"
	},
	{
			id: 34,
			formula: "\\int u^5 \\frac{du}{2a}",
			steps: [
					"Identificar u = ax^2 - b.",
					"Derivar: du = 2ax dx.",
					"Notar que 'x dx' está presente; falta la constante '2a'.",
					"Compensar con 1/(2a) fuera de la integral."
			],
			explanation: "Ejercicio clásico de sustitución donde la variable de la derivada ya está presente en la integral.",
			result: "\\frac{(ax^2 - b)^6}{12a} + C"
	},
	{
			id: 35,
			formula: "\\int u^2 \\frac{du}{3}",
			steps: [
					"Identificar u = t^3 - 4 (lo que está dentro de la potencia).",
					"Derivar: du = 3t^2 dt.",
					"Tenemos t^2 dt, falta el 3.",
					"Multiplicar por 1/3 e integrar u^2 -> u^3/3."
			],
			explanation: "Reconocer patrones: t^2 es la derivada (salvo constante) de t^3.",
			result: "\\frac{(t^3 - 4)^3}{9} + C"
	}
,
	{
			id: 36,
			formula: "\\int u^4 \\frac{du}{-b}",
			steps: [
					"Identificar u = a - by.",
					"Derivar: du = -b dy -> dy = du/-b.",
					"Extraer -1/b e integrar u^4 -> u^5/5."
			],
			explanation: "Cuidado con el signo negativo que surge de la derivada de -by.",
			result: "-\\frac{(a-by)^5}{5b} + C"
	},
	{
			id: 37,
			formula: "\\int (t^4 - 12t^2 + 36) dt",
			steps: [
					"¡ALERTA! No usar sustitución (falta 't' afuera).",
					"Expandir el binomio al cuadrado.",
					"Integrar polinomio resultante: t^5/5 - 12t^3/3 + 36t."
			],
			explanation: "Si la derivada de lo de adentro no está afuera, debes desarrollar el álgebra primero.",
			result: "\\frac{t^5}{5} - 4t^3 + 36t + C"
	},
	{
			id: 38,
			formula: "\\int (x^3 + 8x^2 + 16x) dx",
			steps: [
					"Desarrollar (x+4)^2 -> x^2 + 8x + 16.",
					"Distribuir la 'x' externa.",
					"Integrar término a término."
			],
			explanation: "Combinación de álgebra básica con reglas de potencia.",
			result: "\\frac{x^4}{4} + \\frac{8x^3}{3} + 8x^2 + C"
	},
	{
			id: 39,
			formula: "\\int (x^5 + 3x^4 + 3x^3 + x^2) dx",
			steps: [
					"Desarrollar cubo: (x+1)^3 = x^3 + 3x^2 + 3x + 1.",
					"Multiplicar por x^2.",
					"Integrar las potencias resultantes (5, 4, 3, 2)."
			],
			explanation: "Requiere paciencia algebraica antes de aplicar cálculo.",
			result: "\\frac{x^6}{6} + \\frac{3x^5}{5} + \\frac{3x^4}{4} + \\frac{x^3}{3} + C"
	},
	{
			id: 40,
			formula: "\\int u^{1/2} \\frac{du}{n}",
			steps: [
					"Sustitución u = m + ny.",
					"Compensar la derivada 'n' con 1/n afuera.",
					"Integrar u^(1/2) -> 2/3 u^(3/2)."
			],
			explanation: "Similar a los ejercicios de radicales anteriores, pero con dos constantes (m y n).",
			result: "\\frac{2(m+ny)^{3/2}}{3n} + C"
	}
,
	{
			id: 41,
			formula: "\\int u^{1/2} \\frac{du}{5}",
			steps: [
					"Sustitución u = 5x-3, du = 5dx.",
					"Compensar con 1/5 afuera.",
					"Integrar u^(1/2) -> 2/3 u^(3/2)."
			],
			explanation: "Sustitución lineal básica con radicales.",
			result: "\\frac{2(5x-3)^{3/2}}{15} + C"
	},
	{
			id: 42,
			formula: "\\int u^{-1/2} \\frac{du}{2a}",
			steps: [
					"Reescribir denominador como (at^2+b)^(-1/2).",
					"Sustitución u = at^2+b, du = 2at dt.",
					"Compensar con 1/(2a). Integrar u^(-1/2) -> 2u^(1/2).",
					"Simplificar: (1/2a) * 2 = 1/a."
			],
			explanation: "La variable 't' en el numerador es la clave para usar sustitución.",
			result: "\\frac{\\sqrt{at^2+b}}{a} + C"
	},
	{
			id: 43,
			formula: "\\int u^{-1/3} \\frac{du}{9}",
			steps: [
					"Sustitución u = 9x-1, du = 9dx.",
					"Compensar con 1/9.",
					"Integrar u^(-1/3) -> (3/2)u^(2/3).",
					"Simplificar 1/9 * 3/2 = 1/6."
			],
			explanation: "Manejo de fracciones al compensar y al integrar exponentes negativos.",
			result: "\\frac{(9x-1)^{2/3}}{6} + C"
	},
	{
			id: 44,
			formula: "\\int (x - 8x^{1/2} + 16) dx",
			steps: [
					"¡Desarrollar binomio! No usar sustitución.",
					"x - 8sqrt(x) + 16.",
					"Integrar cada término por separado."
			],
			explanation: "A veces la manipulación algebraica es más rápida que buscar una sustitución compleja.",
			result: "\\frac{x^2}{2} - \\frac{16x^{3/2}}{3} + 16x + C"
	},
	{
			id: 45,
			formula: "\\int u^{-4} \\frac{du}{6}",
			steps: [
					"Subir denominador como (3x^2-4)^-4.",
					"Sustitución u = 3x^2-4, du = 6x dx.",
					"Compensar con 1/6. Integrar u^-4 -> u^-3 / -3."
			],
			explanation: "La integral resulta en una función racional negativa.",
			result: "-\\frac{1}{18(3x^2-4)^3} + C"
	}
,
	{
			id: 46,
			formula: "\\frac{5}{3} \\int u^{-2} du",
			steps: [
					"Subir el denominador como (3x-4)^-2.",
					"u = 3x-4, du = 3dx. Compensar con 1/3.",
					"Integrar: 5 * (1/3) * (u^-1 / -1)."
			],
			explanation: "Aunque parece un logaritmo, al tener exponente 2 en el denominador, se usa la regla de la potencia.",
			result: "-\\frac{5}{3(3x-4)} + C"
	},
	{
			id: 47,
			formula: "2 \\int u^{-4} du",
			steps: [
					"u = 2x^2+5, du = 4x dx.",
					"Observar que el numerador 8x dx es 2 * du.",
					"Integrar 2u^-4 -> 2 * (u^-3 / -3)."
			],
			explanation: "Aprovechar que el numerador es múltiplo exacto de la derivada del denominador.",
			result: "-\\frac{2}{3(2x^2+5)^3} + C"
	},
	{
			id: 48,
			formula: "2 \\int u^2 du",
			steps: [
					"u = sqrt(x)-b.",
					"Derivada du = 1/(2sqrt(x)) dx.",
					"El término dx/sqrt(x) se reemplaza por 2 du.",
					"Integrar 2u^2 -> 2u^3/3."
			],
			explanation: "Sustitución elegante donde el denominador es parte de la derivada de la base.",
			result: "\\frac{2(\\sqrt{x}-b)^3}{3} + C"
	},
	{
			id: 49,
			formula: "\\frac{1}{a} \\int \\frac{du}{u}",
			steps: [
					"Identificar estructura du/u (potencia 1 en denominador).",
					"u = at+b, du = a dt. Compensar con 1/a.",
					"Resultado es logaritmo natural."
			],
			explanation: "La integral de dx/(ax+b) siempre resulta en (1/a)ln|ax+b|.",
			result: "\\frac{1}{a} \\ln|at+b| + C"
	},
	{
			id: 50,
			formula: "\\frac{1}{6} \\int \\frac{du}{u}",
			steps: [
					"u = 3x^2-4 (denominador).",
					"Derivada du = 6x dx.",
					"Tenemos x dx, falta el 6. Compensar con 1/6.",
					"Integrar 1/u -> ln|u|."
			],
			explanation: "Cuando el numerador es la derivada del denominador (salvo constantes), es un logaritmo.",
			result: "\\frac{1}{6} \\ln|3x^2-4| + C"
	}
,
	{
			id: 51,
			formula: "\\int \\frac{du}{u}",
			steps: [
					"u = x+3, du = dx.",
					"Integral directa de du/u.",
					"Resultado es logaritmo natural."
			],
			explanation: "El caso más simple de integración logarítmica.",
			result: "\\ln|x+3| + C"
	},
	{
			id: 52,
			formula: "\\int \\frac{du}{u}",
			steps: [
					"u = 2x^2-6.",
					"Derivada du = 4x dx.",
					"El numerador es exactamente la derivada.",
					"Integral directa: ln|u|."
			],
			explanation: "Reconocer derivadas exactas ahorra tiempo de cálculo.",
			result: "\\ln|2x^2-6| + C"
	},
	{
			id: 53,
			formula: "\\int u^{-2} du",
			steps: [
					"Subir denominador como potencia negativa -2.",
					"u = x^2-3x+6, du = (2x-3) dx.",
					"Sustitución directa.",
					"Integrar u^-2 -> -1/u."
			],
			explanation: "Ojo: No es logaritmo porque el denominador tiene exponente 2, no 1.",
			result: "-\\frac{1}{x^2-3x+6} + C"
	},
	{
			id: 54,
			formula: "\\frac{1}{3} \\int u^{1/2} du",
			steps: [
					"u = x^3-6x+3.",
					"Derivada du = (3x^2-6)dx = 3(x^2-2)dx.",
					"Falta el factor 3. Compensar con 1/3.",
					"Integrar u^(1/2) -> 2/3 u^(3/2)."
			],
			explanation: "A veces la derivada está 'escondida' y requiere factorizar una constante.",
			result: "\\frac{2(x^3-6x+3)^{3/2}}{9} + C"
	},
	{
			id: 55,
			formula: "\\frac{1}{an} \\int u^{-m} du",
			steps: [
					"u = ay^n+b.",
					"Derivada du = an y^(n-1) dy.",
					"Falta la constante 'an'. Compensar con 1/(an).",
					"Integrar u^-m -> u^(-m+1) / (-m+1)."
			],
			explanation: "Ejercicio abstracto avanzado para generalizar la regla de la potencia.",
			result: "\\frac{(ay^n+b)^{1-m}}{an(1-m)} + C"
	}
,
	{
			id: 56,
			formula: "-\\frac{1}{3} \\int u^2 du",
			steps: [
					"u = 1-e^{3x}.",
					"Derivada du = -3e^{3x} dx.",
					"Compensar con -1/3.",
					"Integrar u^2 -> u^3/3."
			],
			explanation: "La exponencial es su propia derivada, lo que facilita la sustitución.",
			result: "-\\frac{(1-e^{3x})^3}{9} + C"
	},
	{
			id: 57,
			formula: "-1 \\int u^3 du",
			steps: [
					"u = 4-ln|x+3|.",
					"Derivada du = -1/(x+3) dx.",
					"Falta solo el signo negativo.",
					"Integrar -u^3 -> -u^4/4."
			],
			explanation: "La derivada del logaritmo natural 1/x permite cancelar el denominador.",
			result: "-\\frac{(4-\\ln|x+3|)^4}{4} + C"
	},
	{
			id: 58,
			formula: "-\\frac{1}{4} \\int u^3 du",
			steps: [
					"u = 1-sin(4x).",
					"Derivada du = -4cos(4x) dx.",
					"Compensar con -1/4.",
					"Integrar u^3 -> u^4/4."
			],
			explanation: "Fundamental recordar la Regla de la Cadena en trigonométricas (el 4 sale multiplicando).",
			result: "-\\frac{(1-\\sin 4x)^4}{16} + C"
	},
	{
			id: 59,
			formula: "-1 \\int u^{1/2} du",
			steps: [
					"u = 3+cot(x).",
					"Derivada du = -csc^2(x) dx.",
					"Compensar con signo negativo.",
					"Integrar u^(1/2) -> 2/3 u^(3/2)."
			],
			explanation: "Reconocer que d/dx(cot x) = -csc^2 x es la clave del ejercicio.",
			result: "-\\frac{2(3+\\cot x)^{3/2}}{3} + C"
	},
	{
			id: 60,
			formula: "-\\frac{1}{2} \\int u^{-1/2} du",
			steps: [
					"Subir radical como (1-sec 2x)^(-1/2).",
					"u = 1-sec(2x), du = -2sec(2x)tan(2x) dx.",
					"Compensar con -1/2.",
					"Integrar u^(-1/2) -> 2u^(1/2)."
			],
			explanation: "La derivada de la secante (sec·tan) aparece completa en el numerador.",
			result: "-\\sqrt{1-\\sec 2x} + C"
	}
,
	{
			id: 61,
			formula: "-\\frac{1}{a} \\int \\frac{du}{u}",
			steps: [
					"u = 1-sin(ax), du = -a cos(ax) dx.",
					"El numerador cos(ax) dx necesita un -a.",
					"Compensar con -1/a.",
					"Integrar 1/u -> ln|u|."
			],
			explanation: "Integral logarítmica clásica con función trigonométrica compuesta.",
			result: "-\\frac{1}{a} \\ln|1 - \\sin ax| + C"
	},
	{
			id: 62,
			formula: "2 \\int u^{1/2} du",
			steps: [
					"u = e^sqrt(x) - 1.",
					"Derivada du = (e^sqrt(x) / 2sqrt(x)) dx.",
					"Tenemos e^sqrt(x)/sqrt(x) dx, falta el /2.",
					"Compensar multiplicando por 2 afuera.",
					"Integrar u^(1/2) -> 2/3 u^(3/2)."
			],
			explanation: "Ejercicio visualmente complejo que se simplifica al derivar correctamente el exponente radical.",
			result: "\\frac{4(e^{\\sqrt{x}}-1)^{3/2}}{3} + C"
	},
	{
			id: 63,
			formula: "\\int u du",
			steps: [
					"u = 2 + ln|sin x|.",
					"Derivada de ln(sin x) es (1/sin x) * cos x = cot x.",
					"La derivada cot x dx está presente exactamente.",
					"Integrar u -> u^2 / 2."
			],
			explanation: "Reconocer que la derivada del logaritmo del seno es la cotangente.",
			result: "\\frac{(2+\\ln|\\sin x|)^2}{2} + C"
	},
	{
			id: 64,
			formula: "2 \\int u^{-5} du",
			steps: [
					"Identidad: 1-cos^2 x = sin^2 x. Denom -> sin^6 x.",
					"Identidad: sin 2x = 2sin x cos x.",
					"Simplificar a: 2 * integral(cos x * sin^-5 x).",
					"Sustitución u = sin x, du = cos x dx.",
					"Integrar 2u^-5 -> -1/(2u^4)."
			],
			explanation: "El uso de identidades trigonométricas simplifica enormemente la expresión antes de integrar.",
			result: "-\\frac{1}{2\\sin^4 x} + C"
	},
	{
			id: 65,
			formula: "\\frac{1}{b} \\int u^2 du",
			steps: [
					"u = sin(bx).",
					"Derivada du = b cos(bx) dx.",
					"Compensar con 1/b.",
					"Integrar u^2 -> u^3 / 3."
			],
			explanation: "Sustitución estándar para potencias de funciones trigonométricas.",
			result: "\\frac{\\sin^3 bx}{3b} + C"
	}
,
	{
			id: 66,
			formula: "-\\frac{1}{m} \\int u du",
			steps: [
					"u = cot(mx).",
					"Derivada du = -m csc^2(mx) dx.",
					"Compensar con -1/m.",
					"Integrar u -> u^2 / 2."
			],
			explanation: "Integral inmediata al reconocer la derivada de la cotangente.",
			result: "-\\frac{\\cot^2 mx}{2m} + C"
	},
	{
			id: 67,
			formula: "-\\frac{1}{4} \\int u^2 du",
			steps: [
					"u = cos(4x).",
					"Derivada du = -4 sin(4x) dx.",
					"Compensar con -1/4.",
					"Integrar u^2 -> u^3 / 3."
			],
			explanation: "La potencia está en el coseno, por lo que esa es nuestra 'u'.",
			result: "-\\frac{\\cos^3 4x}{12} + C"
	},
	{
			id: 68,
			formula: "\\frac{1}{5} \\int u^{-1/2} du",
			steps: [
					"u = sin(5x) + 4.",
					"Derivada du = 5 cos(5x) dx.",
					"Compensar con 1/5.",
					"Integrar u^(-1/2) -> 2u^(1/2)."
			],
			explanation: "Sustitución directa con radical en el denominador.",
			result: "\\frac{2\\sqrt{\\sin 5x+4}}{5} + C"
	},
	{
			id: 69,
			formula: "\\int (4 - \\frac{6}{x+2}) dx",
			steps: [
					"División algebraica: (4x+2)/(x+2) = 4 con residuo -6.",
					"Reescribir como 4 - 6/(x+2).",
					"Integrar por separado: 4x - 6ln|x+2|."
			],
			explanation: "Siempre divide primero si el grado del numerador es igual al del denominador.",
			result: "4x - 6\\ln|x+2| + C"
	},
	{
			id: 70,
			formula: "\\int (3x + 3 + \\frac{5}{x-1}) dx",
			steps: [
					"División sintética de 3x^2+2 entre x-1.",
					"Cociente: 3x+3. Residuo: 5.",
					"Integrar polinomio: 3x^2/2 + 3x.",
					"Integrar fracción: 5ln|x-1|."
			],
			explanation: "División obligatoria cuando Grado Numerador > Grado Denominador.",
			result: "\\frac{3x^2}{2} + 3x + 5\\ln|x-1| + C"
	}
,
	{
			id: 71,
			formula: "\\int u^{-2} du",
			steps: [
					"Reescribir como integral de (ln y)^-2 * (1/y dy).",
					"u = ln y, du = (1/y) dy.",
					"Sustitución directa.",
					"Integrar u^-2 -> -1/u."
			],
			explanation: "Clave: La derivada del logaritmo (1/y) permite integrar potencias de logaritmos.",
			result: "-\\frac{1}{\\ln y} + C"
	},
	{
			id: 72,
			formula: "\\frac{1}{2} \\int \\frac{du}{u}",
			steps: [
					"Extraer constante 1/2.",
					"u = ln(3x), du = (1/3x)*3 dx = (1/x) dx.",
					"Integral de du/u es logaritmo natural.",
					"Resultado: (1/2)ln|ln(3x)|."
			],
			explanation: "Un ejercicio clásico de 'logaritmo de logaritmo'.",
			result: "\\frac{1}{2} \\ln|\\ln 3x| + C"
	},
	{
			id: 73,
			formula: "\\frac{1}{a(n+1)} \\int u^{1/2} du",
			steps: [
					"u = ax^(n+1) + b.",
					"Derivada du = a(n+1)x^n dx.",
					"Falta la constante compuesta a(n+1). Compensar con su inverso.",
					"Integrar u^(1/2) -> 2/3 u^(3/2)."
			],
			explanation: "Generalización abstracta de la regla de sustitución.",
			result: "\\frac{2(ax^{n+1}+b)^{3/2}}{3a(n+1)} + C"
	},
	{
			id: 74,
			formula: "\\frac{1}{2} \\int u^{1/2} du",
			steps: [
					"u = 1 - x^-2.",
					"Derivada du = 2x^-3 dx = (2/x^3) dx.",
					"Falta el 2 en el numerador. Compensar con 1/2.",
					"Integrar u^(1/2) -> (1/2)*(2/3)u^(3/2)."
			],
			explanation: "Convertir fracciones algebraicas a potencias negativas facilita ver la derivada.",
			result: "\\frac{1}{3} (1-\\frac{1}{x^2})^{3/2} + C"
	},
	{
			id: 75,
			formula: "\\frac{1}{3} \\int u^{-2} du",
			steps: [
					"Reescribir csc^2 como 1/sin^2.",
					"Integral: cos(3x) * (sin(3x))^-2.",
					"u = sin(3x), du = 3cos(3x) dx. Compensar con 1/3.",
					"Integrar u^-2 -> -1/u."
			],
			explanation: "Transformar a senos y cosenos suele aclarar el camino de la sustitución.",
			result: "-\\frac{1}{3 \\sin 3x} + C"
	}
,
	{
			id: 76,
			formula: "\\int (2(x+1)^{-3} - 3(x+1)^{-2} + 4(x+1)^{-1}) dx",
			steps: [
					"Aplicar regla de potencia inversa a los dos primeros términos.",
					"El tercer término es un logaritmo natural.",
					"Cuida los signos al dividir por exponentes negativos."
			],
			explanation: "Descomposición básica en potencias negativas y logaritmos.",
			result: "-\\frac{1}{(x+1)^2} + \\frac{3}{x+1} + 4\\ln|x+1| + C"
	},
	{
			id: 77,
			formula: "\\int \\frac{du}{u} - \\int \\frac{dv}{v}",
			steps: [
					"Ambos términos son logaritmos directos.",
					"3 ln|x+2| - 4 ln|x+5|."
			],
			explanation: "Integración directa de fracciones simples.",
			result: "3\\ln|x+2| - 4\\ln|x+5| + C"
	},
	{
			id: 78,
			formula: "\\frac{3}{2}\\ln|u| + \\frac{5}{3}\\ln|v|",
			steps: [
					"u = 2x-1 (compensar con 1/2).",
					"v = 3x-4 (compensar con 1/3).",
					"Multiplicar por las constantes originales (3 y 5)."
			],
			explanation: "Logaritmos con coeficientes en la variable x.",
			result: "\\frac{3}{2}\\ln|2x-1| + \\frac{5}{3}\\ln|3x-4| + C"
	},
	{
			id: 79,
			formula: "-\\int u^{-2/3} du",
			steps: [
					"Reescribir denominador como (cos x)^(-2/3).",
					"u = cos x, du = -sin x dx.",
					"Compensar signo negativo.",
					"Integrar u^(-2/3) -> 3u^(1/3)."
			],
			explanation: "Potencia fraccionaria negativa con función trigonométrica.",
			result: "-3\\sqrt[3]{\\cos x} + C"
	},
	{
			id: 80,
			formula: "2 \\int u^4 du",
			steps: [
					"Identidad: sin(2x) = 2 sin x cos x.",
					"Nueva integral: 2 * sin^4 x * cos x.",
					"u = sin x, du = cos x dx.",
					"Integrar 2u^4 -> 2u^5/5."
			],
			explanation: "Uso crucial de la identidad del ángulo doble.",
			result: "\\frac{2\\sin^5 x}{5} + C"
	},
	{
			id: 81,
			formula: "\\int u^{-1/2} du",
			steps: [
					"Identidad: 1/sin^2 w = csc^2 w.",
					"u = 1 - cot w.",
					"Derivada du = csc^2 w dw (exacta).",
					"Integrar u^(-1/2) -> 2u^(1/2)."
			],
			explanation: "La derivada de la cotangente simplifica todo el problema.",
			result: "2\\sqrt{1-\\cot w} + C"
	},
	{
			id: 82,
			formula: "-\\frac{3}{4} \\int u^{-1/2} du",
			steps: [
					"u = 1 - 2sin^2 y.",
					"Derivada du = -4 sin y cos y dy.",
					"Tenemos 3 sin y cos y. Factor de corrección: -3/4.",
					"Integrar."
			],
			explanation: "Sustitución avanzada requiriendo ajuste de constantes fraccionarias.",
			result: "-\\frac{3}{2}\\sqrt{1-2\\sin^2 y} + C"
	},
	{
			id: 83,
			formula: "2 \\int \\cos(u) du",
			steps: [
					"Identidad: 1+cos(a) = 2cos^2(a/2).",
					"Raíz cuadrada simplifica a sqrt(2)cos(a/2).",
					"Integrar cos(a/2) requiere multiplicar por 2.",
					"sqrt(2) * 2 = 2sqrt(2)."
			],
			explanation: "Identidad de ángulo medio para eliminar la raíz cuadrada.",
			result: "2\\sqrt{2}\\sin(\\frac{\\alpha}{2}) + C"
	},
	{
			id: 84,
			formula: "\\int u^{3/4} du",
			steps: [
					"Separar cos^(11/4) en cos^(3/4) * cos^2.",
					"Formar tan^(3/4) y sec^2.",
					"u = tan x, du = sec^2 x dx.",
					"Integrar u^(3/4)."
			],
			explanation: "El ejercicio más difícil: requiere ver la tangente y la secante ocultas.",
			result: "\\frac{4}{7}\\tan^{7/4}x + C"
	}
]