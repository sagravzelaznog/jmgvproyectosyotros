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
    ]
    // Aquí se agregarán las de la sesión 2, 3...
};
