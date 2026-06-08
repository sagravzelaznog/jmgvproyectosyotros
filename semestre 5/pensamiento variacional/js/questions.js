// questions.js
// Base de datos de preguntas para los Quizzes (Estilo Kahoot)

export const questionDatabase = {
    "sesion1": [
        {
            question: "¿Cuál de las siguientes es una paradoja propuesta por Zenón de Elea?",
            options: ["El gato de Schrödinger", "Aquiles y la tortuga", "El demonio de Maxwell", "La paradoja de los gemelos"],
            answerIndex: 1, // "Aquiles y la tortuga"
            timeLimit: 20
        },
        {
            question: "Según la paradoja de la Dicotomía, para llegar a una meta, ¿qué debes hacer primero?",
            options: ["Correr lo más rápido posible", "Recorrer el doble de la distancia", "Llegar a la mitad del camino", "Detenerte a pensar"],
            answerIndex: 2, // "Llegar a la mitad del camino"
            timeLimit: 20
        },
        {
            question: "¿En la dicotomía de Zenón, por qué nunca se llega al cero?",
            options: [
                "Porque siempre queda la mitad de la distancia anterior",
                "Porque la velocidad es constante",
                "Porque el espacio se acaba",
                "Porque Aquiles es más lento"
            ],
            correctIndex: 0
        },
        {
            question: "En 'Aquiles y la Tortuga', ¿por qué Zenón argumenta que Aquiles nunca alcanzará a la tortuga?",
            options: [
                "Porque la tortuga es más rápida",
                "Porque siempre debe llegar primero a donde la tortuga ya estuvo",
                "Porque Aquiles se cansa",
                "Porque el espacio no existe"
            ],
            answerIndex: 1,
            timeLimit: 30
        },
        {
            question: "¿Qué concepto matemático histórico es el origen del 'Pensamiento Variacional' que vimos hoy?",
            options: ["La noción intuitiva del infinito y el límite", "El teorema de Pitágoras", "La probabilidad", "La estadística descriptiva"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "El método de Exhausción de Arquímedes consistía en...",
            options: [
                "Cansar a su oponente en un debate",
                "Llenar un círculo con polígonos de más y más lados para acercarse a su área",
                "Dividir una línea a la mitad hasta desaparecerla",
                "Medir el agua desplazada en una bañera"
            ],
            answerIndex: 1,
            timeLimit: 30
        },
        {
            question: "Si sumamos mitades sucesivamente (1/2 + 1/4 + 1/8 + 1/16...), ¿a qué número nos acercaremos infinitamente?",
            options: ["Al infinito", "Al Cero", "A la unidad (1)", "A Pi"],
            answerIndex: 2,
            timeLimit: 20
        },
        {
            question: "¿Cómo refuta la física moderna las paradojas de Zenón?",
            options: [
                "Demostrando que el tiempo y el espacio son continuos pero cuantizables (se pueden cruzar)",
                "Dando la razón matemática a Zenón",
                "Prohibiendo las carreras con tortugas",
                "Modificando la velocidad de la luz"
            ],
            answerIndex: 0,
            timeLimit: 30
        }
    ],
    "sesion2": [
        {
            question: "¿Qué curva intentaba medir Arquímedes con polígonos?",
            options: ["El círculo", "El cuadrado", "El triángulo", "La recta"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Qué nombre recibe el método de aproximación de áreas de Arquímedes?",
            options: ["Método de Exhausción", "Método de Dicotomía", "Método Algebraico", "Método Infinito"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Qué sucede al aumentar el número de lados de un polígono regular inscrito en un círculo?",
            options: ["Su área se aproxima a la del círculo", "Su área se hace cero", "Se convierte en un cuadrado", "Su perímetro disminuye"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Cuál es el polígono con menor número de lados que usó Arquímedes como base?",
            options: ["Triángulo", "Cuadrado", "Hexágono", "Octágono"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Además del círculo, ¿qué otra curva midió Arquímedes cortándola en triángulos?",
            options: ["La parábola", "La hipérbola", "La elipse", "La espiral"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "El Método de Exhausción es considerado el precursor de...",
            options: ["El Cálculo Integral", "El Álgebra Lineal", "La Trigonometría", "La Estadística"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Si el polígono tuviera infinitos lados, ¿qué figura formaría?",
            options: ["Un círculo perfecto", "Un punto", "Una línea recta infinita", "Una estrella"],
            answerIndex: 0,
            timeLimit: 20
        }
    ],
    "sesion3": [
        {
            question: "¿Qué mide la 'Tasa de Variación Promedio' en un viaje en coche?",
            options: ["La Velocidad Promedio", "La Gasolina consumida", "El Peso del coche", "El color de la carretera"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "En matemáticas, ¿cómo se le llama a la inclinación de una recta que representa esta variación?",
            options: ["Pendiente (m)", "Intercepto (b)", "Área (A)", "Hipotenusa (h)"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Si recorres 100 km en 2 horas, ¿cuál fue tu velocidad promedio?",
            options: ["50 km/h", "200 km/h", "100 km/h", "25 km/h"],
            answerIndex: 0,
            timeLimit: 30
        },
        {
            question: "¿Cuál es la fórmula algebraica de la pendiente m?",
            options: ["Δy / Δx", "Δx * Δy", "Δx - Δy", "x + y"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Qué significa el símbolo 'Δ' (Delta) en matemáticas?",
            options: ["Cambio o Diferencia", "Suma total", "Infinito", "Una variable desconocida"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Si la población de un país crece 500,000 habitantes en 5 años, ¿cuál es la tasa de variación anual?",
            options: ["100,000 habitantes por año", "50,000 habitantes por año", "1 millón de habitantes por año", "500,000 habitantes por año"],
            answerIndex: 0,
            timeLimit: 30
        },
        {
            question: "En una gráfica de distancia vs tiempo, una línea muy empinada (casi vertical) indica...",
            options: ["Alta velocidad", "Baja velocidad", "Que el objeto está detenido", "Que retrocede en el tiempo"],
            answerIndex: 0,
            timeLimit: 20
        }
    ],
    "sesion4": [
        {
            question: "¿Qué ocurre con la 'Tasa de Demanda' eléctrica de la ciudad durante el calor extremo?",
            options: ["Aumenta exponencialmente", "Disminuye", "Se mantiene constante", "Llega a cero"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "En una gráfica de demanda eléctrica, si la pendiente es positiva muy alta, significa que...",
            options: ["El consumo está subiendo rápidamente", "Hay un apagón", "El consumo es estable", "Es de madrugada"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Por qué el agua pierde presión a medida que viaja por la tubería urbana?",
            options: ["Por la fricción y fugas que generan una tasa negativa", "Por gravedad inversa", "Por exceso de cloro", "Porque el agua se evapora"],
            answerIndex: 0,
            timeLimit: 30
        },
        {
            question: "Si analizas un recibo de luz que pasa de 100 kWh a 400 kWh en verano, la Tasa de Variación es...",
            options: ["Positiva", "Negativa", "Cero", "Infinita"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Qué nos permite predecir el modelado de la variación de voltaje?",
            options: ["Cuándo se va a dañar un transformador", "Cuándo va a llover", "El costo del cable de cobre", "La velocidad del viento"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Matemáticamente, la infraestructura urbana se comporta de manera...",
            options: ["Dinámica y variante", "Estática", "Infinita", "Cíclica exacta"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Qué magnitud sufre variación durante el uso simultáneo de aires acondicionados?",
            options: ["La Carga (Amperes) del transformador", "La velocidad de la luz", "El diámetro del transformador", "El color de los postes"],
            answerIndex: 0,
            timeLimit: 30
        }
    ],
    "sesion5": [
        {
            question: "¿Qué es el Dominio de una función?",
            options: ["Todos los valores posibles de entrada (x)", "Los valores de salida (y)", "La gráfica trazada", "El nombre de la función"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "¿Qué es el Rango o Imagen de una función?",
            options: ["Los resultados o salidas producidas (y)", "Las entradas de la función", "El valor cero", "La distancia entre puntos"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Para que una relación sea considerada una Función, un valor de 'x' puede tener...",
            options: ["Únicamente un solo valor de 'y'", "Dos valores de 'y'", "Infinitos valores de 'y'", "Ningún valor de 'y'"],
            answerIndex: 0,
            timeLimit: 30
        },
        {
            question: "¿Cómo funciona la Prueba de la Línea Vertical?",
            options: ["Si cruza la gráfica una sola vez, es Función", "Si cruza dos veces, es Función", "Debe ser horizontal", "Mide el área bajo la curva"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Si la regla de correspondencia es f(x) = 3x, ¿cuál es la salida para x=4?",
            options: ["12", "7", "43", "1"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "Una tarifa de taxi que sube $10 por cada kilómetro es un ejemplo de...",
            options: ["Función escalonada o a trozos", "Relación no funcional", "Función constante", "Aceleración"],
            answerIndex: 0,
            timeLimit: 20
        },
        {
            question: "La 'Máquina de Funciones' nos enseña que f(x) es...",
            options: ["Una regla de transformación de datos", "Un número estático", "Solo un dibujo", "Una variable aleatoria"],
            answerIndex: 0,
            timeLimit: 30
        }
        ],
    "sesion6": [
        { question: "Si una bacteria se divide en dos cada hora, el crecimiento es:", options: ["Exponencial", "Lineal", "Cuadrático", "Nulo"], answerIndex: 0, timeLimit: 20 },
        { question: "En f(x) = a^x, ¿dónde se encuentra la variable independiente 'x'?", options: ["En el exponente", "Como base", "Como coeficiente", "No existe"], answerIndex: 0, timeLimit: 20 },
        { question: "El interés compuesto es poderoso porque...", options: ["Genera interés sobre el interés acumulado", "La tasa cambia a diario", "Es lineal", "Es gratuito"], answerIndex: 0, timeLimit: 30 },
        { question: "Si a > 1 en f(x) = a^x, la gráfica...", options: ["Crece muy rápido", "Decrece", "Es una línea recta", "Se detiene"], answerIndex: 0, timeLimit: 20 },
        { question: "¿Qué sucede en el cuento del ajedrez y los granos de trigo?", options: ["La cantidad de trigo supera la producción mundial", "El rey gana", "Se quedan sin casillas", "Es una suma constante"], answerIndex: 0, timeLimit: 30 },
        { question: "Para predecir la propagación rápida de un rumor usamos...", options: ["Modelo Exponencial", "Modelo Lineal", "Trigonometría", "Geometría plana"], answerIndex: 0, timeLimit: 20 },
        { question: "Si un fenómeno se duplica cada paso, su base 'a' es:", options: ["2", "0.5", "10", "1"], answerIndex: 0, timeLimit: 20 }
    ],
    "sesion7": [
        { question: "La Ley de Enfriamiento de Newton modela...", options: ["Cómo un cuerpo caliente pierde calor exponencialmente", "La gravedad", "La fricción", "La ebullición"], answerIndex: 0, timeLimit: 20 },
        { question: "En T(t) = Ta + (To - Ta)*e^(-kt), 'Ta' significa:", options: ["Temperatura Ambiente", "Tiempo Anual", "Total Actual", "Tasa Acelerada"], answerIndex: 0, timeLimit: 30 },
        { question: "¿Por qué la gráfica de enfriamiento tiene exponente negativo?", options: ["Porque la temperatura decae o disminuye", "Porque es frío", "Por error de signo", "Porque el tiempo retrocede"], answerIndex: 0, timeLimit: 20 },
        { question: "¿A qué valor tiende la temperatura de la taza de café después de mucho tiempo?", options: ["A la temperatura ambiente", "A cero grados", "A congelarse", "A infinito"], answerIndex: 0, timeLimit: 20 },
        { question: "¿La pérdida térmica en una casa en invierno sigue este mismo modelo?", options: ["Sí, el calor se fuga buscando el equilibrio térmico", "No, las casas son estáticas", "Solo si tiene ventanas abiertas", "Solo en verano"], answerIndex: 0, timeLimit: 20 },
        { question: "La 'k' en la ecuación representa...", options: ["La constante de enfriamiento del material", "Kilos", "Kilómetros", "Kelvin obligatoriamente"], answerIndex: 0, timeLimit: 20 },
        { question: "¿El enfriamiento es constante (baja lo mismo cada minuto)?", options: ["No, al principio baja rápido y luego muy lento", "Sí, siempre baja 1 grado por minuto", "Depende del recipiente", "Es totalmente aleatorio"], answerIndex: 0, timeLimit: 30 }
    ],
    "sesion8": [
        { question: "¿Cuál es la función matemática inversa a la exponencial?", options: ["Función Logarítmica", "Función Lineal", "Función Cúbica", "Función Seno"], answerIndex: 0, timeLimit: 20 },
        { question: "El propósito de usar logaritmos en las escalas (ej. Richter) es...", options: ["Comprimir rangos inmensos de números", "Hacerlo más difícil", "Expandir números pequeños", "Multiplicar rápido"], answerIndex: 0, timeLimit: 30 },
        { question: "En la escala Richter, un sismo grado 6 comparado con uno grado 5 es...", options: ["10 veces más fuerte en amplitud", "Un 20% más fuerte", "El doble de fuerte", "Igual de fuerte"], answerIndex: 0, timeLimit: 30 },
        { question: "La escala de pH mide...", options: ["La acidez o alcalinidad logarítmicamente", "La presión del agua", "El volumen del líquido", "La temperatura"], answerIndex: 0, timeLimit: 20 },
        { question: "¿Por qué el volumen del sonido se mide en Decibelios (logarítmico)?", options: ["Porque el oído humano percibe el sonido así para no dañarse", "Porque es más fácil de escribir", "Fue un error histórico", "Por convención europea"], answerIndex: 0, timeLimit: 30 },
        { question: "y = log_a(x) significa exactamente lo mismo que...", options: ["a^y = x", "y^a = x", "x^a = y", "x*y = a"], answerIndex: 0, timeLimit: 30 },
        { question: "Si a=10, y el logaritmo de x es 3, ¿cuánto vale x?", options: ["1000", "30", "10", "3"], answerIndex: 0, timeLimit: 30 }
    ],
    "sesion9": [
        { question: "Las funciones Seno y Coseno son ideales para modelar fenómenos...", options: ["Periódicos y cíclicos", "Aleatorios", "De crecimiento infinito", "Estáticos"], answerIndex: 0, timeLimit: 20 },
        { question: "¿Qué indica la Amplitud (A) en la ecuación y = A*sen(x)?", options: ["La altura máxima que alcanza la onda", "El tiempo que tarda un ciclo", "La posición inicial", "El número de ciclos"], answerIndex: 0, timeLimit: 20 },
        { question: "¿Qué indica la Frecuencia o Periodo en una onda senoidal?", options: ["Qué tan rápido se repite el ciclo", "La fuerza del choque", "La amplitud", "El color de la onda"], answerIndex: 0, timeLimit: 20 },
        { question: "Un péndulo oscilando puede ser descrito por...", options: ["Seno o Coseno", "Una parábola", "Un logaritmo", "Una línea recta"], answerIndex: 0, timeLimit: 20 },
        { question: "Las mareas (alta y baja) se comportan como...", options: ["Un fenómeno cíclico senoidal", "Una línea constante", "Un crecimiento exponencial", "Ruido blanco"], answerIndex: 0, timeLimit: 20 },
        { question: "En sonido, si aumentas la 'frecuencia' de la onda...", options: ["El sonido se vuelve más agudo", "El sonido se vuelve más fuerte", "El sonido se corta", "Aumenta el bajo"], answerIndex: 0, timeLimit: 20 },
        { question: "El voltaje de Corriente Alterna (AC) toma la forma de...", options: ["Una onda senoidal", "Un voltaje plano", "Picos cuadrados", "Ruido estático"], answerIndex: 0, timeLimit: 20 }
    ],
    "sesion10": [
        { question: "El sistema eléctrico Trifásico utiliza...", options: ["Tres ondas senoidales desfasadas 120°", "Una sola onda muy fuerte", "Corriente directa (DC)", "Ondas cuadradas"], answerIndex: 0, timeLimit: 30 },
        { question: "¿Por qué desfasar las ondas en un motor trifásico?", options: ["Para mantener un empuje constante cuando una onda vale cero", "Para gastar menos cable", "Para que se vea bonito en el osciloscopio", "Fue un accidente"], answerIndex: 0, timeLimit: 30 },
        { question: "Nuestra red eléctrica oscila a una frecuencia de 60Hz. Eso significa que...", options: ["Completa 60 ciclos senoidales cada segundo", "El voltaje es de 60V", "Dura 60 horas", "Se detiene a los 60 grados"], answerIndex: 0, timeLimit: 30 },
        { question: "¿Qué es un 'fasor'?", options: ["Un vector que gira y su proyección en Y dibuja una onda", "Un tipo de láser", "Un motor eléctrico", "Un cable suelto"], answerIndex: 0, timeLimit: 20 },
        { question: "Si una fase cae a cero voltios, las otras dos fases...", options: ["Tienen voltaje suficiente para evitar que el motor pare", "También caen a cero", "Explotan", "Se invierten"], answerIndex: 0, timeLimit: 20 },
        { question: "120 grados en radianes equivalen matemáticamente a:", options: ["2π/3 radianes", "π/2 radianes", "π radianes", "1 radián"], answerIndex: 0, timeLimit: 30 },
        { question: "Gracias a la trigonometría, la infraestructura mundial puede...", options: ["Transmitir energía eficientemente a largas distancias", "Evitar sismos", "Refrigerar computadoras", "Cargar baterías de celular instantáneamente"], answerIndex: 0, timeLimit: 30 }
    ]
};
