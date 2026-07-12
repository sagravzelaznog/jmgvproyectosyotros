const quizData = [
    {
        "q": "¿Por qué las normas de electrificación exigen una profundidad mínima estricta (ej. 1.20m)?",
        "options": [
            "Para esconder los cables de los ladrones",
            "Para proteger el tubo de las cargas mecánicas superficiales (peso de vehículos) y evitar riesgos eléctricos por ruptura",
            "Para mantener los cables calientes",
            "Porque a 1.20m hay oro"
        ],
        "correct": 1
    },
    {
        "q": "En una calle inclinada, ¿cómo se debe medir la profundidad mínima de protección para que la zanja sea segura?",
        "options": [
            "Verticalmente en línea recta hacia abajo (con nivel de plomada)",
            "En diagonal a 45 grados",
            "Perpendicularmente (a 90 grados) respecto a la superficie inclinada de la calle",
            "Horizontalmente"
        ],
        "correct": 2
    },
    {
        "q": "Si la calle tiene un ángulo $\\theta$, y quieres una protección perpendicular $P$, ¿por qué la profundidad vertical de excavación $H$ debe ser mayor a $P$?",
        "options": [
            "Porque el ángulo de la pendiente crea un triángulo rectángulo donde $H$ es la hipotenusa, y la hipotenusa siempre es mayor que los catetos",
            "Porque la tierra está suelta",
            "No debe ser mayor, debe ser igual",
            "Porque el contratista cobra por metro cúbico"
        ],
        "correct": 0
    },
    {
        "q": "Fórmula: $H = P / \\cos(\\theta)$. Si la calle es plana ($\\theta = 0^\\circ$), ¿cuánto vale $H$?",
        "options": [
            "Infinito",
            "$H = P$ (ya que el coseno de 0 grados es 1)",
            "$H = 0$",
            "$H = P / 2$"
        ],
        "correct": 1
    },
    {
        "q": "Si $\\theta = 45^\\circ$ (una pendiente brutal), el Coseno es aprox 0.707. La profundidad de excavación vertical $H$ será:",
        "options": [
            "Significativamente mayor que $P$ (casi un 40% más profunda)",
            "Menor que $P$",
            "Igual a $P$",
            "Imposible de calcular"
        ],
        "correct": 0
    },
    {
        "q": "Si un ingeniero ignora la trigonometría y excava 1.20m verticalmente en una ladera muy inclinada, la protección real perpendicular será:",
        "options": [
            "Mayor a 1.20m",
            "Exactamente 1.20m",
            "Infinita",
            "Menor a 1.20m (dejando el cable vulnerable a ser aplastado por el tráfico)"
        ],
        "correct": 3
    },
    {
        "q": "Este uso de la trigonometría demuestra que los ángulos no solo modelan líneas, sino también:",
        "options": [
            "Temperaturas",
            "Distancias de seguridad estructural invisibles",
            "El color del pavimento",
            "La velocidad del viento"
        ],
        "correct": 1
    }
];