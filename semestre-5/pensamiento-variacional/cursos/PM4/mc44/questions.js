const quizData = [
    {
        "q": "En la fabricación digital por láser o CNC, ¿a qué se le denomina 'Kerf'?",
        "options": [
            "A la marca de quemadura superficial estética",
            "Al grosor físico del material pulverizado o cortado por el haz láser/broca",
            "A la velocidad de la máquina",
            "Al formato del archivo DXF"
        ],
        "correct": 1
    },
    {
        "q": "Si dibujas un cuadrado de 10x10cm exactos y lo cortas, la pieza resultante será ligeramente:",
        "options": [
            "Más grande que 10x10cm",
            "Más pequeña que 10x10cm",
            "Exactamente 10x10cm",
            "Se convertirá en un círculo"
        ],
        "correct": 1
    },
    {
        "q": "Para lograr un ensamble a presión perfecto (Press-fit) entre dos piezas de MDF, debes:",
        "options": [
            "Dibujarlas exactamente de la misma medida matemática",
            "Pegarlas con mucha cinta adhesiva",
            "Aplicar tolerancias de diseño usando OFFSET, compensando algebraicamente el ancho del láser en los machos y hembras",
            "Cortar la madera con serrucho"
        ],
        "correct": 2
    },
    {
        "q": "¿Qué comando geométrico de CAD nos permite crear una curva idéntica desplazada a una distancia constante (útil para compensar el Kerf)?",
        "options": [
            "ROTATE",
            "OFFSET (Desfase)",
            "TRIM",
            "ARRAY"
        ],
        "correct": 1
    },
    {
        "q": "En el software láser, los colores del vector dictan usualmente el 'Orden de corte'. ¿Por qué debemos cortar los agujeros internos antes del contorno externo?",
        "options": [
            "Por estética geométrica",
            "Para que la máquina suene mejor",
            "Porque si cortas el exterior primero, la pieza se cae de la rejilla y al cortar los centros quedarán chuecos (Pérdida de referencia cartesiana)",
            "Porque el láser gasta menos energía"
        ],
        "correct": 2
    },
    {
        "q": "El Escalado Cartesiano de nuestro mapa (ej. 1:100 a tamaño físico) implica matemáticamente:",
        "options": [
            "Sumarle números a las coordenadas",
            "Restarle números a las áreas",
            "Multiplicar todas las coordenadas $(x,y)$ de la matriz por un factor escalar constante $k$",
            "Dividir entre cero"
        ],
        "correct": 2
    },
    {
        "q": "¿Qué nos enseña el Kerf sobre la transición de la matemática pura a la ingeniería?",
        "options": [
            "Que la matemática nunca se equivoca y la realidad sí",
            "Que las matemáticas puras son adimensionales, pero la ingeniería requiere modelar las tolerancias de las herramientas y materiales físicos",
            "Que el láser está descompuesto",
            "Que el MDF es un mal material"
        ],
        "correct": 1
    }
];