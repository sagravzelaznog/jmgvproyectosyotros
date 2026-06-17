const ejerciciosTutor = [
    // Ejercicio 1
    { 
        id: 1, 
        q: "x^{6}dx", 
        a: "x^7/7", 
        c: "Potencia",
        formula: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C",
        steps: [
            "Identificar n = 6.",
            "Aplicar n + 1: 6 + 1 = 7.",
            "Dividir entre el nuevo exponente."
        ],
        explanation: "Se aplica la regla básica de potencias para integrales indefinidas.",
        result: "\\frac{x^7}{7} + C"
    },
    
    // Ejercicio 2
    { 
        id: 2, 
        q: "5x^{4}dx", 
        a: "x^5", 
        c: "Potencia",
        formula: "c \\int x^n dx = c \\frac{x^{n+1}}{n+1} + C",
        steps: [
            "Extraer la constante 5.",
            "Integrar x^4 obteniendo x^5/5.",
            "Simplificar 5/5."
        ],
        explanation: "Se extrae la constante y se aplica la regla de potencias.",
        result: "x^5 + C"
    },
    
    // Ejercicio 3
    { 
        id: 3, 
        q: "bx^{3}dx", 
        a: "(bx^4)/4", 
        c: "Potencia",
        formula: "\\int k \\cdot x^n dx = k \\cdot \\frac{x^{n+1}}{n+1} + C",
        steps: [
            "Identificar k = b y n = 3.",
            "Aplicar n + 1: 3 + 1 = 4.",
            "Dividir entre el nuevo exponente."
        ],
        explanation: "Se aplica la regla de potencias con coeficiente constante.",
        result: "\\frac{bx^4}{4} + C"
    },
    
    // Ejercicio 4
    { 
        id: 4, 
        q: "\\sqrt{3}x^{2}dx", 
        a: "(\\sqrt{3}x^3)/3", 
        c: "Potencia",
        formula: "\\sqrt{3} \\int x^2 dx",
        steps: [
            "La constante es \\sqrt{3}.",
            "La integral de x^2 es x^3/3.",
            "Combinar términos."
        ],
        explanation: "Cualquier número real, incluso raíces, funciona como constante multiplicativa.",
        result: "\\frac{\\sqrt{3}x^3}{3} + C"
    },
    
    // Ejercicio 5
    { 
        id: 5, 
        q: "a~dx", 
        a: "ax", 
        c: "Constante",
        formula: "\\int k~dx = kx + C",
        steps: [
            "Identificar que 'a' no depende de x.",
            "La integral de una constante es la constante por la variable."
        ],
        explanation: "Es el proceso inverso a la derivada de una función lineal (f(x)=ax).",
        result: "ax + C"
    },
    
    // Ejercicio 6
    { 
        id: 6, 
        q: "\\frac{3~dx}{4}", 
        a: "3x/4", 
        c: "Constante",
        formula: "\\int k\\,dx = kx + C",
        steps: [
            "Identificar la constante k = 3/4.",
            "Aplicar la regla de la constante.",
            "Añadir la variable de integración x."
        ],
        explanation: "Cualquier fracción constante sigue la regla básica de integración de constantes.",
        result: "\\frac{3x}{4} + C"
    },
    
    // Ejercicio 7
    { 
        id: 7, 
        q: "\\frac{dx}{3}", 
        a: "x/3", 
        c: "Constante",
        formula: "\\int \\frac{1}{k}\\,dx = \\frac{1}{k}x + C",
        steps: [
            "Reescribir como (1/3) * integral de dx.",
            "Integrar para obtener x/3."
        ],
        explanation: "El denominador constante se mantiene bajo la variable x.",
        result: "\\frac{x}{3} + C"
    },
    
    // Ejercicio 8
    { 
        id: 8, 
        q: "\\sqrt[3]{x}dx", 
        a: "(3x^{4/3})/4", 
        c: "Radical",
        formula: "\\int x^{1/3} dx = \\frac{x^{1/3+1}}{1/3+1}",
        steps: [
            "Convertir raíz cúbica a exponente fraccionario (1/3).",
            "Sumar 1 al exponente: 1/3 + 3/3 = 4/3.",
            "Multiplicar por el inverso del nuevo exponente (3/4)."
        ],
        explanation: "Para integrar radicales, siempre conviértelos primero a potencias fraccionarias.",
        result: "\\frac{3x^{4/3}}{4} + C"
    },
    
    // Ejercicio 9
    { 
        id: 9, 
        q: "5\\sqrt[4]{x}dx", 
        a: "4x^{5/4}", 
        c: "Radical",
        formula: "5 \\int x^{1/4} dx",
        steps: [
            "Extraer el 5 y convertir la raíz cuarta a x^(1/4).",
            "Nuevo exponente: 1/4 + 1 = 5/4.",
            "Dividir: 5 / (5/4) = 4."
        ],
        explanation: "El coeficiente 5 se simplifica perfectamente con el nuevo denominador 5/4.",
        result: "4x^{5/4} + C"
    },
    
    // Ejercicio 10
    { 
        id: 10, 
        q: "\\frac{dx}{x^{3}}", 
        a: "-1/(2x^2)", 
        c: "Potencia Negativa",
        formula: "\\int x^{-3} dx = \\frac{x^{-3+1}}{-3+1}",
        steps: [
            "Subir x^3 como x^-3.",
            "Sumar 1 al exponente: -3 + 1 = -2.",
            "Dividir por -2 y reacomodar como fracción positiva."
        ],
        explanation: "Las potencias en el denominador se manejan como exponentes negativos antes de aplicar la regla de la potencia.",
        result: "-\\frac{1}{2x^2} + C"
    },
    
    // Ejercicio 11
    { 
        id: 11, 
        q: "\\frac{5~dx}{x^{4}}", 
        a: "-5/(3x^3)", 
        c: "Potencia Negativa",
        formula: "5 \\int x^{-4} dx",
        steps: [
            "Subir x^4 como x^-4.",
            "Sumar 1 al exponente: -4 + 1 = -3.",
            "Dividir 5 entre -3 y bajar x^3 al denominador."
        ],
        explanation: "Cuando la variable está en el denominador con una potencia, se usa un exponente negativo para aplicar la regla de la potencia.",
        result: "-\\frac{5}{3x^3} + C"
    },
    
    // Ejercicio 12
    { 
        id: 12, 
        q: "\\frac{dx}{\\sqrt[4]{x}}", 
        a: "(4x^{3/4})/3", 
        c: "Radical",
        formula: "\\int x^{-1/4} dx",
        steps: [
            "Transformar raíz cuarta en el denominador a x^-1/4.",
            "Nuevo exponente: -1/4 + 4/4 = 3/4.",
            "Multiplicar por el recíproco 4/3."
        ],
        explanation: "Este ejercicio combina el manejo de radicales y potencias negativas.",
        result: "\\frac{4x^{3/4}}{3} + C"
    },
    
    // Ejercicio 13
    { 
        id: 13, 
        q: "\\frac{4~dx}{x}", 
        a: "4ln|x|", 
        c: "Logarítmica",
        formula: "4 \\int \\frac{1}{x} dx",
        steps: [
            "Extraer la constante 4.",
            "Identificar la integral inmediata del logaritmo natural."
        ],
        explanation: "Importante: La regla de la potencia no aplica cuando el exponente es -1.",
        result: "4\\ln|x| + C"
    },
    
    // Ejercicio 14
    { 
        id: 14, 
        q: "\\frac{6~dx}{\\sqrt[3]{x}}", 
        a: "9x^{2/3}", 
        c: "Radical",
        formula: "6 \\int x^{-1/3} dx",
        steps: [
            "Convertir raíz cúbica en el denominador a x^-1/3.",
            "Sumar 1 al exponente: -1/3 + 1 = 2/3.",
            "Simplificar: 6 / (2/3) = 9."
        ],
        explanation: "La constante se multiplica por el inverso de la nueva fracción del exponente.",
        result: "9x^{2/3} + C"
    },
    
    // Ejercicio 15
    { 
        id: 15, 
        q: "\\sqrt[5]{x^{3}}dx", 
        a: "(5x^{8/5})/8", 
        c: "Radical",
        formula: "\\int x^{3/5} dx",
        steps: [
            "Convertir raíz quinta de x^3 a x^(3/5).",
            "Nuevo exponente: 3/5 + 1 = 8/5.",
            "Multiplicar por el recíproco 5/8."
        ],
        explanation: "Se aplica la regla de la potencia directamente tras la conversión del radical.",
        result: "\\frac{5x^{8/5}}{8} + C"
    },
    
    // Ejercicio 16
    { 
        id: 16, 
        q: "\\frac{a~dx}{\\sqrt[3]{x^{2}}}", 
        a: "3ax^{1/3}", 
        c: "Radical",
        formula: "a \\int x^{-2/3} dx",
        steps: [
            "Extraer constante 'a' y subir x como potencia negativa -2/3.",
            "Sumar 1 al exponente: -2/3 + 1 = 1/3.",
            "Dividir 'a' entre 1/3 (multiplicar por 3)."
        ],
        explanation: "Se manejan constantes literales y potencias fraccionarias negativas simultáneamente.",
        result: "3a\\sqrt[3]{x} + C"
    },
    
    // Ejercicio 17
    { 
        id: 17, 
        q: "\\frac{5~dx}{2x}", 
        a: "(5/2)ln|x|", 
        c: "Logarítmica",
        formula: "\\frac{5}{2} \\int \\frac{1}{x} dx",
        steps: [
            "Separar la constante 5/2 de la variable.",
            "Aplicar la regla directa del logaritmo natural para 1/x."
        ],
        explanation: "Las constantes en el denominador también deben extraerse antes de integrar.",
        result: "\\frac{5}{2}\\ln|x| + C"
    },
    
    // Ejercicio 18
    { 
        id: 18, 
        q: "\\sqrt{bx}dx", 
        a: "(2\\sqrt{b}x^{3/2})/3", 
        c: "Radical",
        formula: "\\sqrt{b} \\int x^{1/2} dx",
        steps: [
            "Propiedad de radicales: sqrt(bx) = sqrt(b) * sqrt(x).",
            "Nuevo exponente: 1/2 + 1 = 3/2.",
            "Multiplicar la constante por el recíproco 2/3."
        ],
        explanation: "Es vital separar la constante numérica o literal de la variable bajo el radical.",
        result: "\\frac{2\\sqrt{b}x^{3/2}}{3} + C"
    },
    
    // Ejercicio 19
    { 
        id: 19, 
        q: "(\\frac{5}{\\sqrt[3]{x}}-4\\sqrt[3]{x})dx", 
        a: "(15x^{2/3})/2 - 3x^{4/3}", 
        c: "Radicales",
        formula: "\\int 5x^{-1/3} dx - \\int 4x^{1/3} dx",
        steps: [
            "Dividir en dos integrales independientes.",
            "Término 1: 5 * (x^(2/3) / (2/3)) = 15/2 x^(2/3).",
            "Término 2: 4 * (x^(4/3) / (4/3)) = 3 x^(4/3)."
        ],
        explanation: "Este ejercicio practica la integración de sumas con exponentes fraccionarios.",
        result: "\\frac{15}{2}x^{2/3} - 3x^{4/3} + C"
    },
    
    // Ejercicio 20
    { 
        id: 20, 
        q: "(\\frac{3}{x^{5}}-\\frac{2}{x^{2}}-\\frac{6}{x})dx", 
        a: "-3/(4x^4) + 2/x - 6ln|x|", 
        c: "Polinómica",
        formula: "\\sum \\int x^n dx",
        steps: [
            "Término 1: 3x^-5 -> 3x^-4 / -4.",
            "Término 2: -2x^-2 -> -2x^-1 / -1.",
            "Término 3: -6/x -> -6 ln|x|."
        ],
        explanation: "Se combinan potencias negativas con la regla del logaritmo en un solo polinomio.",
        result: "-\\frac{3}{4x^4} + \\frac{2}{x} - 6\\ln|x| + C"
    },
    
   
    
    // Continuar con más ejercicios...
    // Nota: Se pueden agregar más ejercicios siguiendo el mismo patrón
    
    // Ejemplo para el ejercicio 84 (último ejercicio)
    { 
        id: 84, 
        q: "\\frac{sen^{\\frac{3}{4}}x}{cos^{\\frac{11}{4}}x}dx", 
        a: "(4tan^{7/4}x)/7", 
        c: "Trigonométrica",
        formula: "\\int \\tan^n x \\cdot \\sec^2 x dx = \\frac{\\tan^{n+1} x}{n+1} + C",
        steps: [
            "Expresar en términos de tangente y secante.",
            "Realizar sustitución u = tan(x).",
            "Aplicar la regla de potencias.",
            "Sustituir de vuelta."
        ],
        explanation: "Se utiliza la identidad trigonométrica y la sustitución para resolver la integral.",
        result: "\\frac{4\\tan^{7/4}x}{7} + C"
    }
    
    // Nota: Se deben agregar los ejercicios del 6 al 83 siguiendo el mismo formato
];

// Exportar el arreglo para su uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ejerciciosTutor;
}
