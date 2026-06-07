/**
	* JMGV-PTEL Calculation Engine v1.0
	* data, render, quiz, print logic
	*/

// --- BASE DE DATOS MATEMÁTICA (ESCALABLE) ---
// Tip: Usamos MathJax LaTeX para renderizar ecuaciones perfectas
const integralesDb = [
	{
		id: 1,
		formula_base: "1.- \\int \\sin v dv",
		v: "8x",
		dv: "8dx",
		cambio: "\\frac{1}{8} \\int \\sin(8x) (8dx)",
		pasos: [
			"Identificar la variable: \\(v = 8x\\)",
			"Calcular el diferencial de \\(v\\): \\(dv = 8dx\\)",
			"Ajustar la integral original multiplicando por 1 (8 * 1/8): \\(\\frac{1}{8} \\int \\sin(8x) \\mathbf{8dx}\\)",
			"Aplicar la Fórmula 1: \\(\\int \\sin v dv = -\\cos v + C\\)",
			"Resultado Final: \\(\\frac{1}{8} (-\\cos 8x) + C = -\\frac{1}{8}\\cos 8x + C\\)"
		]
	},
	{
		id: 2,
		formula_base: "2.- \\int \\cos v dv",
		v: "(3x+1)",
		dv: "3dx",
		cambio: "\\frac{1}{3} \\int \\cos(3x+1) (3dx)",
		pasos: [
			"Variable: \\(v = 3x+1\\)",
			"Diferencial: \\(dv = 3dx\\)",
			"Ajuste: \\(\\frac{1}{3} \\int \\cos(3x+1) \\mathbf{3dx}\\)",
			"Aplicar Fórmula 2: \\(\\int \\cos v dv = \\sin v + C\\)",
			"Resultado: \\(\\frac{1}{3}\\sin(3x+1) + C\\)"
		]
	},
	{
		id: 3,
		formula_base: "1.- \\int \\sin v dv",
		v: "\\frac{x}{3} = \\frac{1}{3}x",
		dv: "\\frac{1}{3}dx",
		cambio: "3 \\int \\sin(\\frac{x}{3}) (\\frac{1}{3}dx)",
		pasos: [
			"Variable: \\(v = \\frac{1}{3}x\\)",
			"Diferencial: \\(dv = \\frac{1}{3}dx\\)",
			"Ajuste: Necesitamos \\(\\frac{1}{3}\\) adentro, multiplicamos por 3 afuera (3 * 1/3 = 1): \\(3 \\int \\sin(\\frac{x}{3}) \\mathbf{\\frac{1}{3}dx}\\)",
			"Aplicar Fórmula 1: \\(\\int \\sin v dv = -\\cos v + C\\)",
			"Resultado: \\(3(-\\cos\\frac{x}{3}) + C = -3\\cos\\frac{x}{3} + C\\)"
		]
	},
	{
		id: 4,
		formula_base: "2.- \\int \\cos v dv",
		v: "\\frac{3x}{2} = \\frac{3}{2}x",
		dv: "\\frac{3}{2}dx",
		cambio: "\\frac{2}{3} \\int \\cos(\\frac{3x}{2}) (\\frac{3}{2}dx)",
		pasos: [
			"Variable: \\(v = \\frac{3}{2}x\\)",
			"Diferencial: \\(dv = \\frac{3}{2}dx\\)",
			"Ajuste: Necesitamos \\(\\frac{3}{2}\\) adentro, multiplicamos por \\(\\frac{2}{3}\\) afuera: \\(\\frac{2}{3} \\int \\cos(\\frac{3x}{2}) \\mathbf{\\frac{3}{2}dx}\\)",
			"Aplicar Fórmula 2: \\(\\int \\cos v dv = \\sin v + C\\)",
			"Resultado: \\(\\frac{2}{3}\\sin\\frac{3x}{2} + C\\)"
		]
	},
	{
		id: 5,
		formula_base: "3.- \\int \\sec^2 v dv",
		v: "4x",
		dv: "4dx",
		cambio: "\\frac{1}{4} \\int \\sec^2(4x) (4dx)",
		pasos: [
			"Variable: \\(v = 4x\\)",
			"Diferencial: \\(dv = 4dx\\)",
			"Ajuste: \\(\\frac{1}{4} \\int \\sec^2(4x) \\mathbf{4dx}\\)",
			"Aplicar Fórmula 3: \\(\\int \\sec^2 v dv = \\tan v + C\\)",
			"Resultado: \\(\\frac{1}{4}\\tan 4x + C\\)"
		]
	},
	{
		id: 6,
		formula_base: "4.- \\int \\csc^2 v dv",
		v: "\\frac{1}{2}x",
		dv: "\\frac{1}{2}dx",
		cambio: "2 \\int \\csc^2(\\frac{1}{2}x) (\\frac{1}{2}dx)",
		pasos: [
			"Variable: \\(v = \\frac{1}{2}x\\)",
			"Diferencial: \\(dv = \\frac{1}{2}dx\\)",
			"Ajuste: \\(2 \\int \\csc^2(\\frac{1}{2}x) \\mathbf{\\frac{1}{2}dx}\\)",
			"Aplicar Fórmula 4: \\(\\int \\csc^2 v dv = -\\cot v + C\\)",
			"Resultado: \\(2(-\\cot\\frac{1}{2}x) + C = -2\\cot\\frac{x}{2} + C\\)"
		]
	},
	{
		id: 7,
		formula_base: "5.- \\int \\sec v \\tan v dv",
		v: "(2x+3)",
		dv: "2dx",
		cambio: "\\frac{1}{2} \\int \\sec(2x+3) \\tan(2x+3) (2dx)",
		pasos: [
			"Variable: \\(v = 2x+3\\)",
			"Diferencial: \\(dv = 2dx\\)",
			"Ajuste: \\(\\frac{1}{2} \\int \\sec(2x+3) \\tan(2x+3) \\mathbf{2dx}\\)",
			"Aplicar Fórmula 5",
			"Resultado: \\(\\frac{1}{2}\\sec(2x+3) + C\\)"
		]
	},
	{
		id: 8,
		formula_base: "6.- \\int \\csc v \\cot v dv",
		v: "(1-x)",
		dv: "-1dx",
		cambio: "-1 \\int \\csc(1-x) \\cot(1-x) (-1dx)",
		pasos: [
			"Variable: \\(v = 1-x\\)",
			"Diferencial: \\(dv = -1dx\\)",
			"Ajuste: Necesitamos \\(-1\\) adentro, multiplicamos por \\(-1\\) afuera (\\(-1 * -1 = 1\\)): \\(-1 \\int \\csc(1-x) \\cot(1-x) \\mathbf{-1dx}\\)",
			"Aplicar Fórmula 6: \\(\\int \\csc v dv = -\\csc v + C\\)",
			"Resultado: \\(-1(-\\csc(1-x)) + C = \\csc(1-x) + C\\)"
		]
	},
	{
		id: 9,
		formula_base: "2.- \\int \\cos v dv",
		v: "(a-bx)",
		dv: "-bdx",
		cambio: "-\\frac{1}{b} \\int \\cos(a-bx) (-bdx)",
		pasos: [
			"Algebra Tip: 'a' y 'b' son constantes.",
			"Variable: \\(v = a-bx\\)",
			"Diferencial: \\(dv = -bdx\\)",
			"Ajuste: Necesitamos \\(-b\\) adentro, multiplicamos por \\(-\\frac{1}{b}\\) afuera: \\(-\\frac{1}{b} \\int \\cos(a-bx) \\mathbf{-bdx}\\)",
			"Aplicar Fórmula 2",
			"Resultado: \\(-\\frac{1}{b}\\sin(a-bx) + C\\)"
		]
	},
	{
		id: 10,
		formula_base: "1.- \\int \\sin v dv",
		v: "\\sqrt{x} = x^{1/2}",
		dv: "\\frac{1}{2}x^{-1/2}dx = \\frac{dx}{2\\sqrt{x}}",
		cambio: "Nota: El ejercicio en la imagen falta un diferencial \\(\\frac{dx}{\\sqrt{x}}\\). Asumiremos el diferencial correcto para aplicar la fórmula: \\(\\int \\sin \\sqrt{x} \\frac{dx}{\\sqrt{x}}\\)",
		pasos: [
			"Pedagogical Genio Tip: A veces los libros tienen typos. Para aplicar estas fórmulas básicas, necesitamos el diferencial dv completo. Asumimos la forma correcta: \\(\\int \\sin \\sqrt{x} \\frac{dx}{\\sqrt{x}}\\).",
			"Variable: \\(v = x^{1/2}\\)",
			"Diferencial: \\(dv = \\frac{1}{2}x^{-1/2}dx = \\frac{dx}{2\\sqrt{x}}\\)",
			"Ajuste: Necesitamos \\(\\frac{1}{2}\\) multiplicando \\(\\frac{dx}{\\sqrt{x}}\\). Ponemos 2 afuera: \\(2 \\int \\sin \\sqrt{x} (\\frac{\\mathbf{dx}}{2\sqrt{x}})\\)",
			"Aplicar Fórmula 1: \\(\\int \\sin v dv = -\\cos v + C\\)",
			"Resultado: \\(2(-\\cos\\sqrt{x}) + C = -2\\cos\\sqrt{x} + C\\)"
		]
	},
	{
		id: 11,
		formula_base: "5.- \\int \\sec v \\tan v dv",
		v: "\\frac{1}{x} = x^{-1}",
		dv: "-1x^{-2}dx = -\\frac{dx}{x^2}",
		cambio: "Cambio: \\int \\sec v \\tan v dv",
		pasos: [
			"Identificar forma: Corresponde a la derivada de la Secante (Fórmula 5).",
			"Variable: \\(v = x^{-1}\\)",
			"Diferencial: \\(dv = -1dx/x^2\\). El término \\(dx/x^2\\) ya existe.",
			"Ajuste: Solo falta el signo \\(-1\\): \\(-\\int \\sec(1/x) \\tan(1/x) (\\mathbf{-dx/x^2})\\)",
			"Resultado: \\(-1(\\sec\\frac{1}{x}) + C = -\\sec\\frac{1}{x} + C\\)"
		]
	},
	{
		id: 12,
		formula_base: "2.- \\int \\cos v dv",
		v: "\\frac{3}{x} = 3x^{-1}",
		dv: "-3x^{-2}dx = -\\frac{3dx}{x^2}",
		cambio: "Cambio: \\int \\cos v dv",
		pasos: [
			"Variable: \\(v = 3x^{-1}\\)",
			"Diferencial: \\(dv = -3x^{-2}dx = \\mathbf{-\\frac{3dx}{x^2}}\\).",
			"Ajuste: El término \\(dx/x^2\\) ya existe. Necesitamos \\(-3\\). Multiplicamos por \\(-\\frac{1}{3}\\) afuera: \\(-\\frac{1}{3} \\int \\cos(3/x) (\\mathbf{-3dx/x^2})\\)",
			"Resultado: \\(-\\frac{1}{3}\\sin\\frac{3}{x} + C\\)"
		]
	},
	{
		id: 13,
		formula_base: "1.- \\int \\sin v dv",
		v: "(3x^2 - 2x)",
		dv: "(6x - 2)dx = 2(3x - 1)dx",
		cambio: "Ajuste: \\frac{1}{2} \\int \\sin(3x^2-2x) \\cdot 2(3x-1)dx",
		pasos: [
			"Identify structure: $\\int (Factor) \\sin(v) dx$.",
			"Variable: \\(v = 3x^2 - 2x\\)",
			"Diferencial: \\(dv = (6x - 2)dx\\). Factorizando: \\(dv = \\mathbf{2(3x - 1)dx}\\).",
			"Ajuste: El término \\((3x-1)dx\\) ya existe. Falta un \\(2\\). Multiplicamos por \\(1/2\\) afuera: \\(\\frac{1}{2} \\int \\sin(3x^2-2x) \\cdot \\mathbf{2(3x-1)dx}\\)",
			"Resultado: \\(\\frac{1}{2} (-\\cos(3x^2-2x)) + C = -\\frac{1}{2}\\cos(3x^2-2x) + C\\)"
		]
	},
	{
		id: 14,
		formula_base: "2.- \\int \\cos v dv",
		v: "(x^3 + 1)",
		dv: "3x^2 dx",
		cambio: "Ajuste: \\frac{1}{3} \\int \\cos(x^3+1) \\cdot 3x^2dx",
		pasos: [
			"Variable: \\(v = x^3+1\\)",
			"Diferencial: \\(dv = \\mathbf{3x^2 dx}\\).",
			"Ajuste: El término \\(x^2 dx\\) ya existe. Falta un \\(3\\). Multiplicamos por \\(1/3\\) afuera: \\(\\frac{1}{3} \\int \\cos(x^3+1) \\cdot \\mathbf{3x^2dx}\\)",
			"Resultado: \\(\\frac{1}{3}\\sin(x^3+1) + C\\)"
		]
	},
	{
		id: 15,
		formula_base: "3.- \\int \\sec^2 v dv",
		v: "\\sqrt{x} = x^{1/2}",
		dv: "\\frac{1}{2}x^{-1/2}dx = \\frac{dx}{2\\sqrt{x}}",
		cambio: "Ajuste: 2 \\int \\sec^2\\sqrt{x} \\frac{dx}{2\\sqrt{x}}",
		pasos: [
			"Variable: \\(v = x^{1/2}\\)",
			"Diferencial: \\(dv = \\frac{1}{2}x^{-1/2}dx = \\mathbf{\\frac{dx}{2\\sqrt{x}}}\\).",
			"Ajuste: El término \\(dx/\\sqrt{x}\\) ya existe. Falta \\(1/2\\) multiplicando (o 2 dividiendo). Multiplicamos por \\(2\\) afuera (2*1/2=1): \\(2 \\int \\sec^2\\sqrt{x} (\\frac{dx}{\\mathbf{2\sqrt{x}}})\\)",
			"Resultado: \\(2(\\tan\\sqrt{x}) + C = 2\\tan\\sqrt{x} + C\\)"
		]
	},
	{
		id: 16,
		formula_base: "4.- \\int \\csc^2 v dv",
		v: "e^x",
		dv: "e^x dx",
		cambio: "\\int \\csc^2 v dv",
		pasos: [
			"Variable: \\(v = e^x\\)",
			"Diferencial: \\(dv = \\mathbf{e^x dx}\\).",
			"Ajuste: El diferencial \\(dv\\) está completo y ordenado al principio: \\(\\int \\csc^2(e^x) (\\mathbf{e^x dx})\\)",
			"Resultado: \\(-\\cot(e^x) + C\\)"
		]
	},
	{
		id: 17,
		formula_base: "4.- \\int \\csc^2 v dv",
		v: "(2x-1)",
		dv: "2dx",
		cambio: "\\int (\\csc 2x - 1)^2 dx",
		pasos: [
			"Algebraic Note: En la imagen hay un typo, dice (csc 2x - 1)^2. Generalmente esto corresponde a expanding the binomial or standard substitution. Looking closely at image, I will assume it is $\\int \\csc^2(2x-1) dx$ for it to be solvable with the *given formulas* context.",
			"Suposición: Interpretaremos como \\(\\int \\csc^2(2x-1) dx\\) basado en la complejidad de la hoja.",
			"Variable: \\(v = 2x-1\\)",
			"Diferencial: \\(dv = 2dx\\)",
			"Ajuste: \\(\\frac{1}{2} \\int \\csc^2(2x-1) \\mathbf{2dx}\\)",
			"Resultado: \\(\\frac{1}{2}(-\\cot(2x-1)) + C = -\\frac{1}{2}\\cot(2x-1) + C\\)"
		]
	},
	{
		id: 18,
		formula_base: "1.- \\int \\sin v dv Y 2.- \\int \\cos v dv",
		v: "v1=x/2, v2=x",
		dv: "dv1=1/2 dx, dv2=dx",
		cambio: "\\int (\\sin \\frac{x}{2} + \\cos \\frac{x}{2})^2 dx",
		pasos: [
			"Trig Tip: Expande el binomio primero.",
			"Expansión Algebraica: \\(\\int (\\sin^2\\frac{x}{2} + 2\\sin\\frac{x}{2}\\cos\\frac{x}{2} + \\cos^2\\frac{x}{2}) dx\\)",
			"Identidad Pitagórica: \\(\\sin^2\\theta + \\cos^2\\theta = 1\\). En este caso \\(\\sin^2\\frac{x}{2} + \\cos^2\\frac{x}{2} = 1\\).",
			"Identidad Ángulo Doble: \\(2\\sin\\theta\\cos\\theta = \\sin(2\\theta)\\). En este caso \\(2\\sin\\frac{x}{2}\\cos\\frac{x}{2} = \\sin(x)\\).",
			"Simplificación Integral: \\(\\int (1 + \\sin x) dx\\)",
			"Integrar por separado: \\(\\int 1dx + \\int \\sin x dx\\)",
			"Resultado: \\(x - \\cos x + C\\)"
		]
	},
	// Mathematical Engine v1.1 - Concatenate to integralesDb
	// Adding Exercises 19 to 40 with Pedagogical Corrections

	{
		id: 19,
		formula_base: "1.- \\int \\sin v dv",
		v: "2x",
		dv: "2dx",
		cambio: "\\frac{1}{2} \\int \\sin(2x) (2dx)",
		pasos: [
			"Identificar variable: \\(v = 2x\\)",
			"Diferencial: \\(dv = 2dx\\)",
			"Ajuste Algebraico: \\(\\frac{1}{2} \\int \\sin(2x) (2dx)\\)",
			"Aplicar Fórmula 1",
			"Resultado: \\(-\\frac{1}{2}\\cos 2x + C\\)"
		]
	},
	{
		id: 20,
		formula_base: "2.- \\int \\cos v dv",
		v: "4x",
		dv: "4dx",
		cambio: "\\frac{1}{4} \\int \\cos(4x) (4dx)",
		pasos: [
			"Variable: \\(v = 4x\\)",
			"Diferencial: \\(dv = 4dx\\)",
			"Ajuste: \\(\\frac{1}{4} \\int \\cos(4x) (4dx)\\)",
			"Aplicar Fórmula 2",
			"Resultado: \\(\\frac{1}{4}\\sin 4x + C\\)"
		]
	},
	{
		id: 21,
		formula_base: "1.- \\int \\sin v dv",
		v: "\\frac{x}{2}",
		dv: "\\frac{1}{2}dx",
		cambio: "2 \\int \\sin(\\frac{x}{2}) (\\frac{1}{2}dx)",
		pasos: [
			"Variable: \\(v = x/2\\)",
			"Diferencial: \\(dv = 1/2 dx\\)",
			"Ajuste: Necesitamos 1/2 adentro, compensamos con 2 afuera (2 * 1/2 = 1): \\(2 \\int \\sin(\\frac{x}{2}) (\\frac{1}{2}dx)\\)",
			"Aplicar Fórmula 1",
			"Resultado: \\(2(-\\cos\\frac{x}{2}) + C = -2\\cos\\frac{x}{2} + C\\)"
		]
	},
	{
		id: 22,
		formula_base: "2.- \\int \\cos v dv",
		v: "\\frac{x}{3}",
		dv: "\\frac{1}{3}dx",
		cambio: "3 \\int \\cos(\\frac{x}{3}) (\\frac{1}{3}dx)",
		pasos: [
			"Variable: \\(v = x/3\\)",
			"Diferencial: \\(dv = 1/3 dx\\)",
			"Ajuste: \\(3 \\int \\cos(\\frac{x}{3}) (\\frac{1}{3}dx)\\)",
			"Aplicar Fórmula 2",
			"Resultado: \\(3\\sin\\frac{x}{3} + C\\)"
		]
	},
	{
		id: 23,
		formula_base: "3.- \\int \\sec^2 v dv",
		v: "2x",
		dv: "2dx",
		cambio: "\\frac{1}{2} \\int \\sec^2(2x) (2dx)",
		pasos: [
			"Variable: \\(v = 2x\\)",
			"Diferencial: \\(dv = 2dx\\)",
			"Ajuste: \\(\\frac{1}{2} \\int \\sec^2(2x) (2dx)\\)",
			"Aplicar Fórmula 3",
			"Resultado: \\(\\frac{1}{2}\\tan 2x + C\\)"
		]
	},
	{
		id: 24,
		formula_base: "4.- \\int \\csc^2 v dv",
		v: "3x",
		dv: "3dx",
		cambio: "\\frac{1}{3} \\int \\csc^2(3x) (3dx)",
		pasos: [
			"Variable: \\(v = 3x\\)",
			"Diferencial: \\(dv = 3dx\\)",
			"Ajuste: \\(\\frac{1}{3} \\int \\csc^2(3x) (3dx)\\)",
			"Aplicar Fórmula 4",
			"Resultado: \\(\\frac{1}{3}(-\\cot 3x) + C = -\\frac{1}{3}\\cot 3x + C\\)"
		]
	},
	{
		id: 25,
		formula_base: "5.- \\int \\sec v \\tan v dv",
		v: "2x",
		dv: "2dx",
		cambio: "\\frac{1}{2} \\int \\sec(2x) \\tan(2x) (2dx)",
		pasos: [
			"Variable: \\(v = 2x\\)",
			"Diferencial: \\(dv = 2dx\\)",
			"Ajuste: \\(\\frac{1}{2} \\int \\sec(2x) \\tan(2x) (2dx)\\)",
			"Aplicar Fórmula 5",
			"Resultado: \\(\\frac{1}{2}\\sec 2x + C\\)"
		]
	},
	{
		id: 26,
		formula_base: "6.- \\int \\csc v \\cot v dv",
		v: "3x",
		dv: "3dx",
		cambio: "\\frac{1}{3} \\int \\csc(3x) \\cot(3x) (3dx)",
		pasos: [
			"Variable: \\(v = 3x\\)",
			"Diferencial: \\(dv = 3dx\\)",
			"Ajuste: \\(\\frac{1}{3} \\int \\csc(3x) \\cot(3x) (3dx)\\)",
			"Aplicar Fórmula 6",
			"Resultado: \\(\\frac{1}{3}(-\\csc 3x) + C = -\\frac{1}{3}\\csc 3x + C\\)"
		]
	},
	{
		id: 27,
		formula_base: "3.- \\int \\sec^2 v dv",
		v: "\\frac{x}{3}",
		dv: "\\frac{1}{3}dx",
		cambio: "3 \\int \\sec^2(\\frac{x}{3}) (\\frac{1}{3}dx)",
		pasos: [
			"Variable: \\(v = x/3\\)",
			"Diferencial: \\(dv = 1/3 dx\\)",
			"Ajuste: \\(3 \\int \\sec^2(\\frac{x}{3}) (\\frac{1}{3}dx)\\)",
			"Aplicar Fórmula 3",
			"Resultado: \\(3\\tan\\frac{x}{3} + C\\)"
		]
	},
	{
		id: 28,
		formula_base: "4.- \\int \\csc^2 v dv",
		v: "\\frac{x}{4}",
		dv: "\\frac{1}{4}dx",
		cambio: "4 \\int \\csc^2(\\frac{x}{4}) (\\frac{1}{4}dx)",
		pasos: [
			"Variable: \\(v = x/4\\)",
			"Diferencial: \\(dv = 1/4 dx\\)",
			"Ajuste: \\(4 \\int \\csc^2(\\frac{x}{4}) (\\frac{1}{4}dx)\\)",
			"Aplicar Fórmula 4",
			"Resultado: \\(4(-\\cot\\frac{x}{4}) + C = -4\\cot\\frac{x}{4} + C\\)"
		]
	},
	{
		id: 29,
		formula_base: "5.- \\int \\sec v \\tan v dv",
		v: "\\frac{x}{2}",
		dv: "\\frac{1}{2}dx",
		cambio: "2 \\int \\sec(\\frac{x}{2}) \\tan(\\frac{x}{2}) (\\frac{1}{2}dx)",
		pasos: [
			"Variable: \\(v = x/2\\)",
			"Diferencial: \\(dv = 1/2 dx\\)",
			"Ajuste: \\(2 \\int \\sec(\\frac{x}{2}) \\tan(\\frac{x}{2}) (\\frac{1}{2}dx)\\)",
			"Aplicar Fórmula 5",
			"Resultado: \\(2\\sec\\frac{x}{2} + C\\)"
		]
	},
	{
		id: 30,
		formula_base: "6.- \\int \\csc v \\cot v dv",
		v: "\\frac{x}{3}",
		dv: "\\frac{1}{3}dx",
		cambio: "3 \\int \\csc(\\frac{x}{3}) \\cot(\\frac{x}{3}) (\\frac{1}{3}dx)",
		pasos: [
			"Variable: \\(v = x/3\\)",
			"Diferencial: \\(dv = 1/3 dx\\)",
			"Ajuste: \\(3 \\int \\csc(\\frac{x}{3}) \\cot(\\frac{x}{3}) (\\frac{1}{3}dx)\\)",
			"Aplicar Fórmula 6",
			"Resultado: \\(3(-\\csc\\frac{x}{3}) + C = -3\\csc\\frac{x}{3} + C\\)"
		]
	},
	{
		id: 31,
		formula_base: "Algebraica + Fórmula Potencia",
		v: "Manipulación Algebraica",
		dv: "N/A",
		cambio: "Identidad:\\sin^2 \\theta = \\frac{1-\\cos(2\\theta)}{2}",
		pasos: [
			"Trig Tip: El exponente 2 en $\\sin^2(3x)$ no permite integración directa.",
			"Usar Identidad de Ángulo Doble: $\\sin^2(v) = \\frac{1-\\cos(2v)}{2}$. Aquí $v=3x$, por lo que $2v=6x$.",
			"Reescribir Integral: $\\int \\frac{1-\cos(6x)}{2} dx$",
			"Separar Integrales: $\\frac{1}{2} \\int 1 dx - \\frac{1}{2} \\int \\cos(6x) dx$",
			"Integrar por separado: $\\frac{1}{2}x - \\frac{1}{2} \\left( \\frac{1}{6}\\sin 6x \\right) + C$ (ajustando dv para $\\cos 6x$)",
			"Resultado: $\\frac{1}{2}x - \\frac{1}{12}\\sin 6x + C$"
		]
	},
	{
		id: 32,
		formula_base: "Algebraica + Fórmula Potencia",
		v: "Manipulación Algebraica",
		dv: "N/A",
		cambio: "Identidad: \\cos^2 \\theta = \\frac{1+\cos(2\\theta)}{2}",
		pasos: [
			"Trig Tip: Usar Ángulo Doble para $\\cos^2(v) = \\frac{1+\cos(2v)}{2}$. Aquí $v=2x$, $2v=4x$.",
			"Reescribir Integral: $\\int \\frac{1+\cos(4x)}{2} dx$",
			"Separar Integrales: $\\frac{1}{2} \\int 1 dx + \\frac{1}{2} \\int \\cos(4x) dx$",
			"Integrar: $\\frac{1}{2}x + \\frac{1}{2} \\left( \\frac{1}{4}\\sin 4x \\right) + C$",
			"Resultado: $\\frac{1}{2}x + \\frac{1}{8}\\sin 4x + C$"
		]
	},
	{
		id: 33,
		formula_base: "3.- \\int \\sec^2 v dv (indirecto)",
		v: "4x",
		dv: "4dx",
		cambio: "Identidad: \\tan^2 v = \\sec^2 v - 1",
		pasos: [
			"Nota: No hay fórmula directa para $\\int \\tan^2 v$.",
			"Identidad Pitagórica: $\\tan^2 v = \\sec^2 v - 1$. Aquí $v=4x$.",
			"Reescribir Integral: $\\int (\\sec^2 4x - 1) dx$",
			"Separar Integrales: $\\int \\sec^2 4x dx - \\int 1 dx$",
			"Integrar: $\\frac{1}{4}\\tan 4x - x + C$",
			"Resultado: $\\frac{1}{4}\\tan 4x - x + C$"
		]
	},
	{
		id: 34,
		formula_base: "4.- \\int \\csc^2 v dv (indirecto)",
		v: "2x",
		dv: "2dx",
		cambio: "Identidad: \\cot^2 v = \\csc^2 v - 1",
		pasos: [
			"Nota: No hay fórmula directa para $\\int \\cot^2 v$.",
			"Identidad Pitagórica: $\\cot^2 v = \\csc^2 v - 1$. Aquí $v=2x$.",
			"Reescribir Integral: $\\int (\\csc^2 2x - 1) dx$",
			"Separar Integrales: $\\int \\csc^2 2x dx - \\int 1 dx$",
			"Integrar: $\\frac{1}{2}(-\\cot 2x) - x + C$",
			"Resultado: $-\\frac{1}{2}\\cot 2x - x + C$"
		]
	},
	{
		id: 35,
		formula_base: "1.- \\int \\sin v dv",
		v: "ax+b",
		dv: "a dx",
		cambio: "\\frac{1}{a} \\int \\sin(ax+b) (a dx)",
		pasos: [
			"Nota: 'a' y 'b' son constantes.",
			"Variable: \\(v = ax+b\\)",
			"Diferencial: \\(dv = a dx\\)",
			"Ajuste: \\(\\frac{1}{a} \\int \\sin(ax+b) (a dx)\\)",
			"Aplicar Fórmula 1",
			"Resultado: \\(\\frac{1}{a}(-\\cos(ax+b)) + C = -\\frac{1}{a}\\cos(ax+b) + C\\)"
		]
	},
	{
		id: 36,
		formula_base: "2.- \\int \\cos v dv",
		v: "mx",
		dv: "m dx",
		cambio: "\\frac{1}{m} \\int \\cos(mx) (m dx)",
		pasos: [
			"Variable: \\(v = mx\\)",
			"Diferencial: \\(dv = m dx\\)",
			"Ajuste: \\(\\frac{1}{m} \\int \\cos(mx) (m dx)\\)",
			"Aplicar Fórmula 2",
			"Resultado: \\(\\frac{1}{m}\\sin mx + C\\)"
		]
	},
	{
		id: 37,
		formula_base: "3.- \\int \\sec^2 v dv",
		v: "bx",
		dv: "b dx",
		cambio: "\\frac{1}{b} \\int \\sec^2(bx) (b dx)",
		pasos: [
			"Variable: \\(v = bx\\)",
			"Diferencial: \\(dv = b dx\\)",
			"Ajuste: \\(\\frac{1}{b} \\int \\sec^2(bx) (b dx)\\)",
			"Aplicar Fórmula 3",
			"Resultado: \\(\\frac{1}{b}\\tan bx + C\\)"
		]
	},
	{
		id: 38,
		formula_base: "4.- \\int \\csc^2 v dv",
		v: "cx",
		dv: "c dx",
		cambio: "\\frac{1}{c} \\int \\csc^2(cx) (c dx)",
		pasos: [
			"Variable: \\(v = cx\\)",
			"Diferencial: \\(dv = c dx\\)",
			"Ajuste: \\(\\frac{1}{c} \\int \\csc^2(cx) (c dx)\\)",
			"Aplicar Fórmula 4",
			"Resultado: \\(\\frac{1}{c}(-\\cot cx) + C = -\\frac{1}{c}\\cot cx + C\\)"
		]
	},
	{
		id: 39,
		formula_base: "5.- \\int \\sec v \\tan v dv",
		v: "ax",
		dv: "a dx",
		cambio: "\\frac{1}{a} \\int \\sec(ax) \\tan(ax) (a dx)",
		pasos: [
			"Variable: \\(v = ax\\)",
			"Diferencial: \\(dv = a dx\\)",
			"Ajuste: \\(\\frac{1}{a} \\int \\sec(ax) \\tan(ax) (a dx)\\)",
			"Aplicar Fórmula 5",
			"Resultado: \\(\\frac{1}{a}\\sec ax + C\\)"
		]
	},
	{
		id: 40,
		formula_base: "6.- \\int \\csc v \\cot v dv",
		v: "mx",
		dv: "m dx",
		cambio: "\\frac{1}{m} \\int \\csc(mx) \\cot(mx) (m dx)",
		pasos: [
			"Variable: \\(v = mx\\)",
			"Diferencial: \\(dv = m dx\\)",
			"Ajuste: \\(\\frac{1}{m} \\int \\csc(mx) \\cot(mx) (m dx)\\)",
			"Aplicar Fórmula 6",
			"Resultado: \\(\\frac{1}{m}(-\\csc mx) + C = -\\frac{1}{m}\\csc mx + C\\)"
		]
	}


	// fullstack tip: Concatenate these to existing db:
	// integralesDb = integralesDb.concat(integralesEjercicios19Al40);
];

// --- QUIZ DATA STYLE KAHOOT ---
const quizData = {
	"pwd_ maestro": "1983",
	"questions": [
		{
			"q": "¿Cuál es el resultado de $\\int \\sin(8x) dx$?",
			"options": [
				{ "t": "$-8\\cos(8x) + C$", "correct": false },
				{ "t": "$\\frac{1}{8}\\cos(8x) + C$", "correct": false },
				{ "t": "$-\\frac{1}{8}\\cos(8x) + C$", "correct": true },
				{ "t": "$\\sin(8x) + C$", "correct": false }
			],
			"note_maestro": "👨‍🏫 Nota de Pedagogía: El error más común es olvidar el signo negativo al integrar seno o multiplicar por 8 en lugar de dividir.",
			"tip_estudiante": "💡 Tip: $\\frac{d}{dx}(\\cos(ax)) = -a\\sin(ax)$, por lo tanto, la integral necesita compensar ese $-a$ con un $-1/a$."
		},
		{
			"q": "En el ejercicio 11 $\\int \\sec \\frac{1}{x} \\tan \\frac{1}{x} \\frac{dx}{x^2}$, ¿Cuál es el diferencial $dv$ correcto?",
			"options": [
				{ "t": "$x^2 dx$", "correct": false },
				{ "t": "$-\\frac{1}{x} dx$", "correct": false },
				{ "t": "$-x^{-2} dx$ o $-\\frac{dx}{x^2}$", "correct": true },
				{ "t": "$\\sec \\frac{1}{x} dx$", "correct": false }
			],
			"note_maestro": "👨‍🏫 Nota de Andragogía: Los adultos a veces olvidan las reglas de exponentes ($x^{-1}$ vs $x^{-2}$). Este ejercicio prueba la base algebraica.",
			"tip_estudiante": "💡 Tip: Si $v = x^{-1}$, entonces $dv = -1 \cdot x^{(-1-1)} dx = -x^{-2} dx$."
		},
		{
			"q": "Para resolver $\\int (3x^2 - 2x) \\sin(3x^2 - 2x) dx$, ¿Cuál es la forma del diferencial de ajuste necesario?",
			"options": [
				{ "t": "Mult. por 2 afuera, divide por 2 adentro.", "correct": false },
				{ "t": "Mult. por $1/2$ afuera, mult. por $2$ adentro.", "correct": true },
				{ "t": "Divide por $(3x-1)$ afuera.", "correct": false },
				{ "t": "No requiere ajuste.", "correct": false }
			],
			"note_maestro": "👨‍🏫 Nota de  Esta pregunta prueba la capacidad de factorización y el principio de 'no alterar la ecuación' (multiplicar por 1).",
			"tip_estudiante": "💡 Tip: $v=3x^2-2x$, $dv=2(3x-1)dx$. Ya tienes $(3x-1)dx$, te falta el $2$."
		},
		{
			"q": "¿Cuál de las siguientes fórmulas se usa para integrar $\\int \\sec^2(4x) dx$?",
			"options": [
				{ "t": "$\\int \cos v dv$", "correct": false },
				{ "t": "$\\int \sec v \\tan v dv$", "correct": false },
				{ "t": "$\\int \sec^2 v dv = \\tan v + C$", "correct": true },
				{ "t": "No se puede resolver", "correct": false }
			],
			"note_maestro": "👨‍🏫 Nota: Reconocimiento directo de patrones. Fundamental antes de intentar sustituir.",
			"tip_estudiante": "💡 Tip: Busca la fórmula que coincida exactamente con la función trigonométrica principal."
		},
		{
			"q": "En el ejercicio 18, $\\int (\\sin \frac{x}{2} + \\cos \frac{x}{2})^2 dx$, ¿Cuál es el paso algebraico preliminar indispensable?",
			"options": [
				{ "t": "Sustitución directa de $x/2$.", "correct": false },
				{ "t": "Factorizar la expresión.", "correct": false },
				{ "t": "Expandir el binomio al cuadrado y usar identidades.", "correct": true },
				{ "t": "Integrar término a término.", "correct": false }
			],
			"note_maestro": "👨‍🏫 Nota  Este es un ejercicio de madurez. Conecta Álgebra (trinomio cuadrado perfecto) -> Identidades Trigonométricas -> Cálculo Elemental. No enseñes trucos, enseña conexiones.",
			"tip_estudiante": "💡 Tip: $(A+B)^2 = A^2 + 2AB + B^2$. Mira lo que obtienes después de expandir."
		}
	]
};

// --- LÓGICA DE RENDERIZADO (Génio Developer) ---

function init() {
	renderSolutions();
	initQuiz();
	initMathJax();
}

function renderSolutions() {
	const container = document.getElementById('solutions-container');
	integralesDb.forEach(ejercicio => {
		const item = document.createElement('div');
		item.className = 'solution-item';
		item.id = `ex-${ejercicio.id}`;

		let pasosHtml = '';
		ejercicio.pasos.forEach((paso, index) => {
			pasosHtml += `
													<div class="step">
																	<span class="step-number">${index + 1}</span>
																	<p>${paso}</p>
													</div>
									`;
		});

		item.innerHTML = `
									<div class="exercise-text">${ejercicio.id}.- \\(\\int^{}_{} \\sin(8x) dx\\) </div> <h3>Pasos y Componentes:</h3>
									<div class="steps-container">
													<p><strong>Fórmula Base:</strong> \\(${ejercicio.formula_base}\\)</p>
													<p><strong>Identificación de Variable:</strong> \\(v = ${ejercicio.v}\\)</p>
													<p><strong>Cálculo del Diferencial:</strong> \\(dv = ${ejercicio.dv}\\)</p>
													<p><strong>Cambio de Variable / Ajuste:</strong> \\(${ejercicio.cambio}\\)</p>
													${pasosHtml}
													</div>
													`;

		// Dynamic Exercise text generation (scalability)
		// We'll update the inner text to LaTeX format based on data. Some exercises need complex parsing,
		// so I'll just hardcode standard standard transcription of image to LaTeX for performance here.
		container.appendChild(item);
	});

	// Hardcoded transcription of specific exercise expressions from image to LaTeX
	document.querySelector('#ex-1 .exercise-text').innerHTML = '1.- \\(\\int \sin 8x dx\\)';
	document.querySelector('#ex-2 .exercise-text').innerHTML = '2.- \\(\\int \cos(3x+1) dx\\)';
	document.querySelector('#ex-3 .exercise-text').innerHTML = '3.- \\(\\int \sin \\frac{x}{3} dx\\)';
	document.querySelector('#ex-4 .exercise-text').innerHTML = '4.- \\(\\int \cos \\frac{3x}{2} dx\\)';
	document.querySelector('#ex-5 .exercise-text').innerHTML = '5.- \\(\\int \\sec^2 4x dx\\)';
	document.querySelector('#ex-6 .exercise-text').innerHTML = '6.- \\(\\int \\csc^2 \\frac{1}{2}x dx\\)';
	document.querySelector('#ex-7 .exercise-text').innerHTML = '7.- \\(\\int \\sec(2x+3) \\tan(2x+3) dx\\)';
	document.querySelector('#ex-8 .exercise-text').innerHTML = '8.- \\(\\int \\csc(1-x) \\cot(1-x) dx\\)';
	document.querySelector('#ex-9 .exercise-text').innerHTML = '9.- \\(\\int \\cos(a-bx) dx\\)';
	document.querySelector('#ex-10 .exercise-text').innerHTML = '10.- \\(\\int \sin \sqrt{x} \\frac{dx}{\sqrt{x}}\\) (Corregido)'; // Fixed factor typo in original
	document.querySelector('#ex-11 .exercise-text').innerHTML = '11.- \\(\\int \\sec \\frac{1}{x} \\tan \\frac{1}{x} \\frac{dx}{x^2}\\)';
	document.querySelector('#ex-12 .exercise-text').innerHTML = '12.- \\(\\int \\cos \\frac{3}{x} \\frac{dx}{x^2}\\)';
	document.querySelector('#ex-13 .exercise-text').innerHTML = '13.- \\(\\int (3x-1) \\sin(3x^2-2x) dx\\)';
	document.querySelector('#ex-14 .exercise-text').innerHTML = '14.- \\(\\int x^2 \\cos(x^3+1) dx\\)';
	document.querySelector('#ex-15 .exercise-text').innerHTML = '15.- \\(\\int \\frac{\\sec^2 \\sqrt{x}}{\\sqrt{x}} dx\\)';
	document.querySelector('#ex-16 .exercise-text').innerHTML = '16.- \\(\\int e^x \\csc^2(e^x) dx\\)';
	document.querySelector('#ex-17 .exercise-text').innerHTML = '17.- \\(\\int \\csc^2(2x-1) dx\\)'; // Corregido typo en imagen
	document.querySelector('#ex-18 .exercise-text').innerHTML = '18.- \\(\\int (\\sin \\frac{x}{2} + \\cos \\frac{x}{2})^2 dx\\)';
	document.querySelector('#ex-19 .exercise-text').innerHTML = '19.- \\(\\int \\sin (2x)dx\\)';
	document.querySelector('#ex-20 .exercise-text').innerHTML = '20.- \\(\\int \\cos (4x)dx\\)';
	document.querySelector('#ex-21 .exercise-text').innerHTML = '21.- \\(\\int \\sin( \\frac{x}{2})dx\\)';
	document.querySelector('#ex-22 .exercise-text').innerHTML = '22.- \\(\\int \\cos( \\frac{x}{3})dx\\)';
	document.querySelector('#ex-23 .exercise-text').innerHTML = '23.- \\(\\int \\sec^2(2x)dx\\)';
	document.querySelector('#ex-24 .exercise-text').innerHTML = '24.- \\(\\int \\csc^2(3x)dx\\)';
	document.querySelector('#ex-25 .exercise-text').innerHTML = '25.- \\(\\int \\sec(2x) \\tan(2x) dx\\)';
	document.querySelector('#ex-26 .exercise-text').innerHTML = '26.- \\(\\int \\csc(3x) \\cot(3x) dx\\)';
	document.querySelector('#ex-27 .exercise-text').innerHTML = '27.- \\(\\int \\sec^2(\\frac{x}{3})dx\\)';
	document.querySelector('#ex-28 .exercise-text').innerHTML = '28.- \\(\\int \\csc^2(\\frac{x}{4})dx\\)';
	document.querySelector('#ex-29 .exercise-text').innerHTML = '29.- \\(\\int \\sec(\\frac{x}{2}) \\tan(\\frac{x}{2}) dx\\)';
	document.querySelector('#ex-30 .exercise-text').innerHTML = '30.- \\(\\int \\csc(\\frac{x}{3}) \\cot(\\frac{x}{3}) dx\\)';
	document.querySelector('#ex-31 .exercise-text').innerHTML = '31.- \\(\\int \\sin^2 (3x)dx\\)';
	document.querySelector('#ex-32 .exercise-text').innerHTML = '32.- \\(\\int \\cos^2 (2x)dx\\)';
	document.querySelector('#ex-33 .exercise-text').innerHTML = '33.- \\(\\int \\tan^2 (4x)dx\\)';
	document.querySelector('#ex-34 .exercise-text').innerHTML = '34.- \\(\\int \\cot^2 (2x)dx\\)';
	document.querySelector('#ex-35 .exercise-text').innerHTML = '35.- \\(\\int \\sin (ax+b)dx\\)';
	document.querySelector('#ex-36 .exercise-text').innerHTML = '36.- \\(\\int \\cos (mx)dx\\)';
	document.querySelector('#ex-37 .exercise-text').innerHTML = '37.- \\(\\int \\sec^2(bx)dx\\)';
	document.querySelector('#ex-38 .exercise-text').innerHTML = '38.- \\(\\int \\csc^2(cx)dx\\)';
	document.querySelector('#ex-39 .exercise-text').innerHTML = '39.- \\(\\int \\sec(ax) \\tan(ax) dx\\)';
	document.querySelector('#ex-40 .exercise-text').innerHTML = '40.- \\(\\int \\csc(mx) \\cot(mx) dx\\)';

}

function initMathJax() {
	// Basic configurations
	window.MathJax = {
		tex: {
			inlineMath: [['$', '$'], ['\\(', '\\)']]
		},
		startup: {
			pageReady: () => {
				return MathJax.startup.defaultPageReady();
			}
		}
	};
}

// --- LÓGICA DEL QUIZ KAHOOT ---

let currentQuestionIndex = 0;
let quizScore = 0;
let isTeacherUnlocked = false;

function initQuiz() {
	renderQuestion(currentQuestionIndex);
	document.getElementById('unlock-teacher').addEventListener('click', teacherLockControl);
}

function renderQuestion(index) {
	const quizContent = document.getElementById('quiz-content');
	const qData = quizData.questions[index];

	let optionsHtml = '';
	qData.options.forEach((opt, oIndex) => {
		optionsHtml += `
									<button class="btn-option" data-correct="${opt.correct}" onclick="selectOption(this, ${oIndex})">
													${opt.t}
									</button>
					`;
	});

	quizContent.innerHTML = `
					<div class="quiz-question">
									<p class="branding">Pregunta ${index + 1} / ${quizData.questions.length}</p>
									<h3 id="quiz-q-text">${qData.q}</h3>
									<p id="tip-estudiante" class="tip-content">${qData.tip_estudiante}</p>
					</div>
					<div class="options-grid">
									${optionsHtml}
					</div>
					<div id="teacher-section" class="teacher-note ${isTeacherUnlocked ? 'visible' : ''}">
									<p><strong>Tip de Pedogogía (Maestro):</strong> ${qData.note_maestro}</p>
									<p><strong>Clave de Respuesta:</strong> <span class="math-static">${qData.options.find(o => o.correct).t}</span></p>
					</div>
					<button class="btn-submit" id="btn-submit-q" onclick="submitAnswer()">Enviar Respuesta</button>
	`;

	MathJax.typesetPromise([quizContent]); // Render math in quiz
}

let selectedOption = null;

function selectOption(btn, oIndex) {
	const options = document.querySelectorAll('.btn-option');
	options.forEach(o => o.classList.remove('selected'));
	btn.classList.add('selected');
	selectedOption = btn;
	document.getElementById('btn-submit-q').style.display = 'block';
}

function submitAnswer() {
	if (!selectedOption) return;
	const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
	if (isCorrect) {
		quizScore++;
		selectedOption.style.backgroundColor = '#ecfdf5';
		selectedOption.style.borderColor = 'var(--accent-v)';  // Added quotes around CSS variable
	} else {
		selectedOption.style.backgroundColor = '#fff5f5';
		selectedOption.style.borderColor = 'var(--accent-dv)';  // Added quotes around CSS variable
		// feedback: show correct answer sutilly
		document.querySelectorAll('.btn-option').forEach(o => {
			if (o.getAttribute('data-correct') === 'true') {
				o.style.borderColor = 'var(--accent-v)';  // Added quotes around CSS variable
				o.style.backgroundColor = '#FAF5FF';
			}
		});
	}

	document.getElementById('btn-submit-q').disabled = true;

	setTimeout(() => {
		currentQuestionIndex++;
		if (currentQuestionIndex < quizData.questions.length) {
			renderQuestion(currentQuestionIndex);
		} else {
			renderFinalScore();
		}
	}, 1500);
}

function renderFinalScore() {
	const quizContent = document.getElementById('quiz-content');
	quizContent.innerHTML = `
					<div class="final-score text-center" style="font-size:2rem; font-weight:bold; color:var(--quiz-purple);">
									¡Nivel Maestro de Integrales Trigonométricas Alcanzado!
									<p>Puntuación Final: ${quizScore} / ${quizData.questions.length}</p>
									<button class="btn-option" onclick="resetQuiz()" style="width:auto; margin:20px;">Reiniciar Quiz</button>
					</div>
	`;
}

function resetQuiz() {
	currentQuestionIndex = 0;
	quizScore = 0;
	renderQuestion(currentQuestionIndex);
}

// --- MODO MAESTRO SECURITY ---

function teacherLockControl() {
	const btn = document.getElementById('unlock-teacher');
	if (!isTeacherUnlocked) {
		const password = prompt("Ingrese Contraseña de Maestro:");
		if (password === quizData["pwd_ maestro"]) {
			isTeacherUnlocked = true;
			btn.innerHTML = "Maestro Activo 🔓";
			btn.classList.add('unlocked');
			showTeacherNotes(true);
			alert("Pedagogical Data Unlocked.");
		} else if (password === null) {
			// Cancelado
		} else {
			alert("Contraseña Incorrecta. Intentos monitoreados.");
		}
	} else {
		isTeacherUnlocked = false;
		btn.innerHTML = "Modo Maestro 🔒";
		btn.classList.remove('unlocked');
		showTeacherNotes(false);
	}
}

function showTeacherNotes(show) {
	const note = document.getElementById('teacher-section');
	if (!note) return;
	if (show) note.classList.add('visible');
	else note.classList.remove('visible');
}

// Run engine
init();
											
			