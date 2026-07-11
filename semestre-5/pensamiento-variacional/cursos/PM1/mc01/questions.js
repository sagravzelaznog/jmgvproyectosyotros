// Arreglo de 7 Preguntas (Fácilmente escalable para otras sesiones)
const questions = [
    {
        question: "¿Cuál de los siguientes enunciados es una proposición lógica?",
        options: [
            "¡Qué buen clima hace hoy!",
            "¿Me prestas tu calculadora?",
            "La Tierra gira alrededor del Sol",
            "Cierra la puerta por favor"
        ],
        correct: 2
    },
    {
        question: "Si p = 'Estudio mucho' y q = 'Apruebo el examen', ¿qué significa la conjunción p ∧ q?",
        options: [
            "Estudio mucho o apruebo el examen",
            "Si estudio mucho, apruebo el examen",
            "No estudio mucho pero apruebo el examen",
            "Estudio mucho y apruebo el examen"
        ],
        correct: 3
    },
    {
        question: "¿Cuál es el símbolo utilizado para representar la Disyunción (O)?",
        options: [
            "∧",
            "∨",
            "¬",
            "→"
        ],
        correct: 1
    },
    {
        question: "Si una proposición es Verdadera (V), ¿cuál será su valor después de aplicarle la Negación (¬)?",
        options: [
            "Sigue siendo Verdadera",
            "Se vuelve Falsa",
            "Depende del contexto",
            "Se anula"
        ],
        correct: 1
    },
    {
        question: "En una operación de Conjunción (Y), el resultado es Verdadero SÓLO cuando:",
        options: [
            "Ambas proposiciones son Falsas",
            "Al menos una proposición es Verdadera",
            "Ambas proposiciones son Verdaderas",
            "La primera proposición es Verdadera"
        ],
        correct: 2
    },
    {
        question: "Analiza esto: 'Si ahorro 50 pesos a la semana, en un mes tendré 200 pesos'. Esto es un ejemplo de:",
        options: [
            "No es una proposición",
            "Conjunción lógica",
            "Modelado de un problema con proposiciones",
            "Disyunción"
        ],
        correct: 2
    },
    {
        question: "¿Para qué nos sirve aplicar la lógica matemática a problemas del entorno?",
        options: [
            "Para escribir fórmulas más largas y difíciles",
            "Para definir reglas claras, tomar decisiones y modelar soluciones",
            "Para memorizar conceptos sin comprenderlos",
            "Para calcular operaciones matemáticas básicas"
        ],
        correct: 1
    }
];
