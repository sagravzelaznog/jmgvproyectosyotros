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
    ]
};
