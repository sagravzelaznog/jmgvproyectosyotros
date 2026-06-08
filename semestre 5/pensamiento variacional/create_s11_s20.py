import json
import os

sessions = [
    {
        "id": 11,
        "title": "Noción Intuitiva de Límite",
        "desc": "Acercarse al concepto de límite de manera gráfica y numéricamente.",
        "theory": "El límite de una función es el valor al que se acerca 'y' (f(x)) cuando 'x' se acerca a un número específico, sin importar si realmente llega a tocarlo.",
        "ex1": ("Frenado de un vehículo", "La distancia se acorta infinitamente hasta llegar a cero."),
        "ex2": ("Tendencia de temperatura", "Al encender el clima, la temperatura busca un límite térmico."),
        "ex3": ("Asíntotas poblacionales", "La población crece hasta un límite máximo de recursos."),
        "sim_title": "Simulador: Zoom Infinito",
        "sim_desc": "Desliza para hacer zoom a la gráfica en x=2 para la función f(x) = (x^2 - 4)/(x - 2). Verás que aunque haya un hueco, el límite es 4.",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #f59e0b; padding:20px; border-radius:10px; text-align:center;">
                <canvas id="zoom-canvas" width="300" height="150" style="background:#0f172a; width:100%; border-radius:8px;"></canvas>
                <br><br>
                <label style="color:white;">Nivel de Zoom:</label>
                <input type="range" id="zoom-slider" min="1" max="100" value="1" oninput="drawZoom()">
            </div>
        """,
        "kahoot": [
            {"question": "¿Qué es un límite en matemáticas?", "options": ["El valor al que se aproxima una función", "El final de una recta", "Un error de cálculo", "El punto medio"], "answerIndex": 0},
            {"question": "Para encontrar el límite cuando x se acerca a 3, evaluamos...", "options": ["Valores muy cercanos a 3, como 2.99 y 3.01", "Solamente el 0", "Valores negativos", "Números muy grandes"], "answerIndex": 0},
            {"question": "Si f(2) no existe (es un hueco), ¿puede existir el límite en x=2?", "options": ["Sí, porque el límite evalúa la cercanía, no el punto exacto", "No, es imposible", "Solo si es cero", "Solo si es infinito"], "answerIndex": 0},
            {"question": "En la vida real, un límite se parece a...", "options": ["Frenar un auto acercándose a un muro sin chocar", "Acelerar indefinidamente", "Contar dinero", "Medir un círculo"], "answerIndex": 0},
            {"question": "Si al acercarnos por la izquierda da 5 y por la derecha da 5...", "options": ["El límite es 5", "El límite es 10", "No existe", "El límite es 0"], "answerIndex": 0},
            {"question": "¿Qué significa que la población llegue a un 'límite de recursos'?", "options": ["Que la gráfica se aplana horizontalmente (asíntota)", "Que cae en picada", "Que crece infinitamente", "Que desaparece"], "answerIndex": 0},
            {"question": "Para tabular un límite acercándose a 1, usamos...", "options": ["0.9, 0.99, 0.999", "1, 2, 3", "10, 100, 1000", "0.1, 0.2, 0.3"], "answerIndex": 0}
        ],
        "block": 1
    },
    {
        "id": 12,
        "title": "Límites Laterales",
        "desc": "Entender la direccionalidad al evaluar límites.",
        "theory": "Para que un límite exista realmente, debemos obtener el mismo resultado acercándonos por la izquierda (valores menores) y por la derecha (valores mayores).",
        "ex1": ("Costos escalonados", "El precio del estacionamiento salta bruscamente al pasar la hora."),
        "ex2": ("Cambios de voltaje", "Encender un interruptor cambia el voltaje de 0 a 110V al instante."),
        "ex3": ("Estados de la materia", "A 0°C exactos, el agua tiene propiedades que cambian bruscamente."),
        "sim_title": "Simulador: Caminos Cruzados",
        "sim_desc": "Mueve el deslizador para acercar los dos carritos. Si no están en la misma altura (límite lateral distinto), ¡el puente está roto!",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #ec4899; padding:20px; border-radius:10px; text-align:center;">
                <canvas id="bridge-canvas" width="300" height="150" style="background:#0f172a; width:100%; border-radius:8px;"></canvas>
                <br><br>
                <label style="color:white;">Posición X:</label>
                <input type="range" id="bridge-slider" min="0" max="100" value="0" oninput="drawBridge()">
            </div>
        """,
        "kahoot": [
            {"question": "Un límite lateral por la izquierda se denota con...", "options": ["x -> a^-", "x -> a^+", "x -> -a", "x -> a"], "answerIndex": 0},
            {"question": "Para que el límite general exista, los límites laterales deben ser...", "options": ["Iguales", "Diferentes", "Cero", "Infinitos"], "answerIndex": 0},
            {"question": "Si el límite por izquierda es 3 y por derecha es 5...", "options": ["El límite no existe", "El límite es 4", "El límite es 8", "El límite es 0"], "answerIndex": 0},
            {"question": "Una gráfica con un 'salto' (como un escalón) indica...", "options": ["Que los límites laterales no coinciden", "Que la función es continua", "Un error de dibujo", "Que el límite es infinito"], "answerIndex": 0},
            {"question": "El costo de un estacionamiento que sube a la hora exacta es una...", "options": ["Función escalonada", "Función lineal", "Función cuadrática", "Función seno"], "answerIndex": 0},
            {"question": "¿Al encender un foco, el voltaje salta de 0 a 110V. ¿Existe límite en ese instante?", "options": ["No, los laterales son distintos", "Sí, es 110", "Sí, es 0", "Sí, es 55"], "answerIndex": 0},
            {"question": "Acercarse por la derecha de 0 implica evaluar en...", "options": ["0.1, 0.01, 0.001", "-0.1, -0.01", "1, 2, 3", "-1, -2, -3"], "answerIndex": 0}
        ],
        "block": 1
    },
    {
        "id": 13,
        "title": "Propiedades de los Límites",
        "desc": "Formalizar el cálculo algebraico de límites.",
        "theory": "El límite de una suma es la suma de los límites. Podemos sustituir el valor directamente si la función no se 'rompe' (si no da división por cero).",
        "ex1": ("Suma de variaciones", "Combinar la presión del agua y la atmosférica."),
        "ex2": ("Límites polinomiales", "Trayectorias parabólicas sin interrupciones."),
        "ex3": ("Límites con raíces", "Cálculo de tiempos en caída libre."),
        "sim_title": "Simulador: Evaluación Directa",
        "sim_desc": "Arrastra la barra para cambiar el valor de X y ver la sustitución automática en f(x) = 2x^2 + 3.",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #10b981; padding:20px; border-radius:10px; text-align:center;">
                <div id="prop-text" style="font-size:2em; color:white; font-family:monospace;">f(x) = 2(0)² + 3 = 3</div>
                <br><br>
                <label style="color:white;">Valor de X:</label>
                <input type="range" id="prop-slider" min="-5" max="5" value="0" oninput="evalProp()">
            </div>
        """,
        "kahoot": [
            {"question": "La forma más rápida de evaluar un límite polinomial es...", "options": ["Sustitución directa", "Hacer una tabla inmensa", "Límites laterales", "Adivinar"], "answerIndex": 0},
            {"question": "El límite de una suma es igual a...", "options": ["La suma de los límites", "La resta", "Cero", "La multiplicación"], "answerIndex": 0},
            {"question": "El límite de una constante, por ejemplo límite de 5 cuando x->2 es:", "options": ["5", "2", "10", "0"], "answerIndex": 0},
            {"question": "Si al sustituir obtenemos un número real normal, significa que...", "options": ["Ese es el límite", "Hay un error", "Tenemos que factorizar", "El límite no existe"], "answerIndex": 0},
            {"question": "El límite de [f(x) * g(x)] es...", "options": ["El límite de f(x) por el límite de g(x)", "La división", "Cero", "No se puede calcular"], "answerIndex": 0},
            {"question": "Si evaluamos lim x->3 de (x^2), el resultado es:", "options": ["9", "6", "3", "0"], "answerIndex": 0},
            {"question": "Las propiedades de los límites nos permiten...", "options": ["Simplificar cálculos complejos separándolos en partes", "Hacer las gráficas más grandes", "Eliminar las x", "Resolver integrales"], "answerIndex": 0}
        ],
        "block": 1
    },
    {
        "id": 14,
        "title": "Indeterminaciones 0/0",
        "desc": "Resolver límites que requieren factorización.",
        "theory": "Si al sustituir nos da 0/0, ¡no es cero ni infinito! Es un 'fantasma' matemático que nos dice que hay un factor oculto que debemos eliminar factorizando o racionalizando.",
        "ex1": ("Velocidad instantánea inicial", "Tiempo cero sobre distancia cero."),
        "ex2": ("Agujeros en gráficas", "Una discontinuidad removible."),
        "ex3": ("Márgenes de error cero", "Tolerancias de maquinaria precisas."),
        "sim_title": "Simulador: Escape Room 0/0",
        "sim_desc": "La bóveda dice f(x) = (x² - 9)/(x - 3) evaluado en x=3. Si metes 0 te dará error. ¡Factoriza y pon la respuesta real para abrirla!",
        "sim_html": """
            <div style="background:#0f172a; border: 4px solid #ef4444; padding:20px; border-radius:10px; text-align:center;">
                <div id="vault-status" style="font-size:3em;">🔒</div>
                <p style="color:white;">lim(x->3) (x² - 9)/(x - 3)</p>
                <input type="number" id="vault-input" style="padding:10px; font-size:1.2em; width:100px;">
                <button onclick="checkVault()" style="padding:10px; background:#ef4444; color:white; border:none; border-radius:5px;">Abrir Bóveda</button>
            </div>
        """,
        "kahoot": [
            {"question": "¿Qué significa obtener 0/0 al sustituir un límite?", "options": ["Es una indeterminación, hay que factorizar", "Que el límite es cero", "Que el límite es infinito", "Que no tiene solución matemática"], "answerIndex": 0},
            {"question": "Para resolver (x^2 - 4)/(x - 2) cuando x->2, usamos:", "options": ["Diferencia de cuadrados", "Fórmula general", "Trigonometría", "Logaritmos"], "answerIndex": 0},
            {"question": "Una vez factorizado y cancelado el término problema...", "options": ["Volveos a hacer sustitución directa", "El límite es cero", "Terminamos", "Cambiamos de signo"], "answerIndex": 0},
            {"question": "Visualmente, una indeterminación 0/0 que se puede factorizar es...", "options": ["Un agujero en la gráfica", "Una asíntota vertical", "Una línea rota", "Un salto"], "answerIndex": 0},
            {"question": "Si nos queda 5/0, eso significa...", "options": ["Que es una asíntota (infinito), no un hueco", "Que hay que factorizar", "Que es cero", "Que es 5"], "answerIndex": 0},
            {"question": "Racionalizar es una técnica útil cuando el límite indeterminado tiene...", "options": ["Raíces cuadradas", "Seno y coseno", "Exponentes muy altos", "Letras distintas"], "answerIndex": 0},
            {"question": "El límite de (x^2-9)/(x-3) cuando x->3 es:", "options": ["6", "0", "Infinito", "3"], "answerIndex": 0}
        ],
        "block": 1
    },
    {
        "id": 15,
        "title": "Límites al Infinito",
        "desc": "Analizar el comportamiento asintótico de largo plazo.",
        "theory": "A veces nos interesa saber qué pasará en el 'futuro lejano' (x -> infinito). Si la curva se estabiliza horizontalmente, existe una Asíntota Horizontal.",
        "ex1": ("Estabilización de epidemias", "Los contagios se detienen cuando toda la población es inmune."),
        "ex2": ("Capacidad de carga ecológica", "Un bosque solo soporta un número máximo de venados."),
        "ex3": ("Enfriamiento", "La temperatura nunca baja del ambiente."),
        "sim_title": "Simulador: Estabilización Poblacional",
        "sim_desc": "Observa cómo la curva poblacional sube rápido pero al llegar al 'Límite de Capacidad' (Asíntota Horizontal), se aplana por completo.",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #3b82f6; padding:20px; border-radius:10px; text-align:center;">
                <canvas id="inf-canvas" width="300" height="150" style="background:#0f172a; width:100%; border-radius:8px;"></canvas>
                <br><br>
                <label style="color:white;">Tiempo (Años): <span id="inf-time">0</span></label>
                <input type="range" id="inf-slider" min="0" max="100" value="0" oninput="drawInf()">
            </div>
        """,
        "kahoot": [
            {"question": "Evaluar un límite al infinito significa investigar...", "options": ["El comportamiento a largo plazo de la función", "El origen de la función", "Dónde cruza el eje Y", "La velocidad inicial"], "answerIndex": 0},
            {"question": "Visualmente, un límite al infinito que resulta en un número concreto se ve como...", "options": ["Una asíntota horizontal", "Un agujero", "Una asíntota vertical", "Una parábola"], "answerIndex": 0},
            {"question": "Si el grado del polinomio de arriba es igual al de abajo...", "options": ["El límite es la división de sus coeficientes principales", "El límite es cero", "El límite es infinito", "No existe"], "answerIndex": 0},
            {"question": "Si el grado del denominador es mayor...", "options": ["El límite es cero", "El límite es infinito", "Es indeterminado", "Es 1"], "answerIndex": 0},
            {"question": "La capacidad de carga de un ecosistema es un ejemplo de...", "options": ["Límite al infinito (Asíntota horizontal)", "Límite al cero", "Indeterminación 0/0", "Asíntota vertical"], "answerIndex": 0},
            {"question": "El límite de 1/x cuando x tiende a infinito es:", "options": ["0", "1", "Infinito", "-1"], "answerIndex": 0},
            {"question": "¿Qué pasa si calentamos un metal infinitamente cerca del sol?", "options": ["Tiende a la temperatura de la superficie solar", "Se enfría", "Se vuelve cero", "Se vuelve negativo"], "answerIndex": 0}
        ],
        "block": 1
    },
    {
        "id": 16,
        "title": "Continuidad de Funciones",
        "desc": "Definir la continuidad en un punto.",
        "theory": "Una función es continua si la puedes dibujar sin despegar el lápiz del papel. Matemáticamente: f(a) existe, el límite en 'a' existe, y ambos son exactamente iguales.",
        "ex1": ("Flujo continuo de agua", "Sin interrupciones en la tubería."),
        "ex2": ("Circuito cerrado", "La electricidad fluye sin switches abiertos."),
        "ex3": ("Trayectoria de proyectil", "Un balón no se teletransporta en el aire."),
        "sim_title": "Simulador: Dibujo Continuo",
        "sim_desc": "Intenta unir los dos puntos. Si hay un hoyo (discontinuidad removible) o un salto (discontinuidad de salto), fallarás.",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #f59e0b; padding:20px; border-radius:10px; text-align:center;">
                <canvas id="cont-canvas" width="300" height="150" style="background:#0f172a; width:100%; border-radius:8px;"></canvas>
                <div style="margin-top:10px;">
                    <button onclick="setContMode('continuo')" style="padding:5px;">Continua</button>
                    <button onclick="setContMode('hueco')" style="padding:5px;">Hueco</button>
                    <button onclick="setContMode('salto')" style="padding:5px;">Salto</button>
                </div>
            </div>
        """,
        "kahoot": [
            {"question": "La definición intuitiva de continuidad es...", "options": ["Dibujar la gráfica sin despegar el lápiz", "Que siempre crezca", "Que sea una recta", "Que cruce el cero"], "answerIndex": 0},
            {"question": "Condición 1 de Continuidad matemática:", "options": ["Que f(a) exista (punto relleno)", "Que el límite sea infinito", "Que empiece en cero", "Que sea positiva"], "answerIndex": 0},
            {"question": "Condición 2 de Continuidad matemática:", "options": ["Que el límite cuando x->a exista (laterales iguales)", "Que el límite sea cero", "Que la gráfica sea recta", "Que no haya curvas"], "answerIndex": 0},
            {"question": "Condición 3 de Continuidad matemática:", "options": ["Que el límite sea exactamente igual a f(a)", "Que el límite sea mayor", "Que sea múltiplo de 2", "No existe condición 3"], "answerIndex": 0},
            {"question": "Un switch de luz apagado representa una discontinuidad tipo...", "options": ["De salto", "Removible (hueco)", "Asintótica (infinito)", "Continua"], "answerIndex": 0},
            {"question": "La trayectoria de un balón en el aire es un fenómeno...", "options": ["Continuo", "Discontinuo de salto", "Discontinuo asintótico", "Indeterminado"], "answerIndex": 0},
            {"question": "Si una gráfica tiene un hueco relleno en otra parte, ¿es continua ahí?", "options": ["No, porque el límite no coincide con el punto", "Sí", "Depende del grosor de la línea", "Solo si es un número par"], "answerIndex": 0}
        ],
        "block": 1
    },
    {
        "id": 17,
        "title": "Continuidad e Infraestructura",
        "desc": "Aplicar continuidad a problemas de la vida real.",
        "theory": "En la ingeniería civil y eléctrica, las funciones a trozos se diseñan para que sus piezas embonen perfectamente (sean continuas), evitando colapsos o cortocircuitos.",
        "ex1": ("Cableado ininterrumpido", "Empalmes eléctricos de alta tensión sin pérdidas."),
        "ex2": ("Rampas peatonales", "Conectar banquetas sin escalones bruscos para sillas de ruedas."),
        "ex3": ("Transiciones térmicas", "Aislamiento de tuberías industriales."),
        "sim_title": "Simulador: Construcción de Rampa",
        "sim_desc": "Tienes un tramo horizontal y una pendiente. Ajusta la 'altura' del segundo tramo para que la rampa sea continua y los carritos no choquen.",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #64748b; padding:20px; border-radius:10px; text-align:center;">
                <canvas id="ramp-canvas" width="300" height="150" style="background:#0f172a; width:100%; border-radius:8px;"></canvas>
                <br><br>
                <label style="color:white;">Alineación Vertical (b): <span id="ramp-val">0</span></label>
                <input type="range" id="ramp-slider" min="-50" max="50" value="30" oninput="drawRamp()">
            </div>
        """,
        "kahoot": [
            {"question": "Al diseñar una rampa peatonal, la función a trozos debe ser...", "options": ["Continua en el punto de unión", "Discontinua", "Trigonométrica infinita", "Logarítmica"], "answerIndex": 0},
            {"question": "Si dos cables tienen diferente voltaje y se unen mal, provocan...", "options": ["Un salto eléctrico (cortocircuito, discontinuidad)", "Energía infinita", "Un flujo laminar", "Continuidad perfecta"], "answerIndex": 0},
            {"question": "Las funciones definidas a trozos se usan para...", "options": ["Modelar fenómenos que cambian de comportamiento según condiciones", "Dibujar círculos", "Confundir", "Evitar el uso de números"], "answerIndex": 0},
            {"question": "Para que f(x) = {2x si x<1, k si x>=1} sea continua, 'k' debe valer:", "options": ["2", "1", "0", "-2"], "answerIndex": 0},
            {"question": "¿Una montaña rusa puede tener un diseño discontinuo en sus rieles?", "options": ["No, causaría un accidente fatal", "Sí, es más divertido", "Solo en las curvas", "Depende de la velocidad"], "answerIndex": 0},
            {"question": "El empalme de dos tramos de carretera busca garantizar...", "options": ["Continuidad", "Discontinuidad", "Infinitos", "Asintotas"], "answerIndex": 0},
            {"question": "Las discontinuidades en servicios (cortes de luz) representan...", "options": ["Fallas y caídas abruptas del servicio", "Eficiencia", "Acumulación", "Mejoras del sistema"], "answerIndex": 0}
        ],
        "block": 1
    },
    {
        "id": 18,
        "title": "Tasa de Variación Instantánea",
        "desc": "Transitar de la variación promedio a la instantánea.",
        "theory": "La velocidad promedio se calcula en un intervalo largo (Secante). Si encogemos ese intervalo de tiempo hasta que casi sea cero usando el límite, obtenemos la velocidad en ese instante exacto (Tangente).",
        "ex1": ("El Velocímetro", "No te dice la velocidad de todo tu viaje, te dice la velocidad de ESTE segundo."),
        "ex2": ("Carga de celular", "Porcentaje de batería recuperado justo en el minuto 15."),
        "ex3": ("Flujo de bomba", "Litros inyectados por segundo instantáneo."),
        "sim_title": "Simulador: Secante a Tangente",
        "sim_desc": "Desliza la barra para acercar el punto B al punto A. Verás cómo la línea Secante se transforma mágicamente en la línea Tangente.",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #8b5cf6; padding:20px; border-radius:10px; text-align:center;">
                <canvas id="sec-canvas" width="300" height="150" style="background:#0f172a; width:100%; border-radius:8px;"></canvas>
                <br><br>
                <label style="color:white;">Distancia entre puntos (h):</label>
                <input type="range" id="sec-slider" min="0" max="100" value="100" oninput="drawSecant()">
            </div>
        """,
        "kahoot": [
            {"question": "La Tasa de Variación Promedio equivale geométricamente a...", "options": ["La pendiente de la recta secante", "La pendiente de la recta tangente", "El área bajo la curva", "Una asíntota"], "answerIndex": 0},
            {"question": "La Tasa de Variación Instantánea equivale geométricamente a...", "options": ["La pendiente de la recta tangente", "La pendiente secante", "La longitud de arco", "El límite al infinito"], "answerIndex": 0},
            {"question": "El velocímetro de tu auto mide...", "options": ["Velocidad instantánea", "Velocidad promedio del día", "Aceleración", "Distancia"], "answerIndex": 0},
            {"question": "¿Cómo se convierte una secante en tangente?", "options": ["Acercando los dos puntos hasta que la distancia entre ellos tienda a cero", "Separando los puntos infinitamente", "Dibujando más rectas", "Borrando el plano"], "answerIndex": 0},
            {"question": "El límite cuando 'h' tiende a cero de (f(x+h) - f(x))/h es la definición de:", "options": ["Derivada", "Integral", "Asíntota", "Función constante"], "answerIndex": 0},
            {"question": "Si manejas a 120km/h y chocas contra un radar, el radar registra tu...", "options": ["Velocidad instantánea", "Velocidad promedio", "Desplazamiento total", "Frenado"], "answerIndex": 0},
            {"question": "La letra 'h' en la fórmula de derivación representa...", "options": ["La pequeñísima diferencia en el eje X (delta x)", "La altura del eje Y", "La hora", "El infinito"], "answerIndex": 0}
        ],
        "block": 2
    },
    {
        "id": 19,
        "title": "La Derivada y la Recta Tangente",
        "desc": "Interpretar geométricamente la derivada.",
        "theory": "La Derivada (f'(x)) es una máquina que nos fabrica pendientes. Si le das un valor de X, la derivada te escupe la inclinación exacta que tiene la curva en ese milímetro.",
        "ex1": ("Duna de arena", "Inclinación del terreno paso a paso."),
        "ex2": ("Reflexión solar", "Ángulo de los espejos en paneles solares curvos."),
        "ex3": ("Cable de tensión", "Tensión máxima en el puente colgante."),
        "sim_title": "Simulador: Escáner de Tangentes",
        "sim_desc": "Desliza el escáner a través de la parábola. Observa cómo la recta tangente cambia de negativa (bajada), a cero (valle), a positiva (subida).",
        "sim_html": """
            <div style="background:#1e293b; border: 4px solid #a855f7; padding:20px; border-radius:10px; text-align:center;">
                <canvas id="tan-canvas" width="300" height="150" style="background:#0f172a; width:100%; border-radius:8px;"></canvas>
                <br><br>
                <label style="color:white;">Posición de Escaneo (x):</label>
                <input type="range" id="tan-slider" min="0" max="100" value="50" oninput="drawTangent()">
                <div id="tan-slope" style="color:#a855f7; font-weight:bold; margin-top:5px;">Pendiente (m): 0</div>
            </div>
        """,
        "kahoot": [
            {"question": "La Derivada de una función en un punto x te da como resultado...", "options": ["El valor numérico de la pendiente de la recta tangente ahí", "El área de la figura", "La longitud de la curva", "El volumen"], "answerIndex": 0},
            {"question": "Si la recta tangente va 'de bajada', la derivada será...", "options": ["Negativa", "Positiva", "Cero", "Infinita"], "answerIndex": 0},
            {"question": "Si te encuentras en el fondo exacto de un valle curvo, la pendiente es...", "options": ["Cero (completamente horizontal)", "Negativa", "Positiva", "Infinita"], "answerIndex": 0},
            {"question": "La recta tangente toca a la curva en...", "options": ["Un solo punto localmente", "Dos puntos", "Infinitos puntos", "Ningún punto"], "answerIndex": 0},
            {"question": "¿Por qué es útil conocer la pendiente en una duna de arena?", "options": ["Para calcular si un vehículo volcará o no", "Para saber cuánta arena hay", "Para predecir el clima", "Para nada"], "answerIndex": 0},
            {"question": "Si la función es f(x) = x^2, su derivada fabrica pendientes según la regla:", "options": ["2x", "x", "x^3", "2"], "answerIndex": 0},
            {"question": "Geométricamente, f'(x) es sinónimo de...", "options": ["Pendiente 'm'", "Intersección 'b'", "Altura 'y'", "Distancia 'd'"], "answerIndex": 0}
        ],
        "block": 2
    },
    {
        "id": 20,
        "title": "Regla de los Cuatro Pasos",
        "desc": "Calcular derivadas de funciones lineales y cuadráticas por definición.",
        "theory": "Antes de tener atajos, los genios como Newton usaban este proceso algebraico duro: 1) Sumar h. 2) Restar f(x). 3) Dividir entre h. 4) Aplicar el límite cuando h->0.",
        "ex1": ("Caída libre", "Obtener velocidad a partir de la distancia (x²)."),
        "ex2": ("Costo marginal", "Cuánto cuesta fabricar la SIGUIENTE unidad."),
        "ex3": ("Mancha circular", "Tasa de crecimiento del área de un derrame."),
        "sim_title": "Simulador: Algoritmo de 4 Pasos",
        "sim_desc": "Haz clic en cada paso para aplicar el algoritmo a f(x) = x^2. ¡Observa el álgebra destruirse y simplificarse ante tus ojos!",
        "sim_html": """
            <div style="background:#0f172a; border: 4px solid #ef4444; padding:20px; border-radius:10px; text-align:left; color:white; font-family:monospace; font-size:1.1em;">
                <div id="step-0" style="color:#94a3b8;">f(x) = x²</div>
                <div id="step-1" style="display:none;">1) f(x+h) = (x+h)² = x² + 2xh + h²</div>
                <div id="step-2" style="display:none; color:#f59e0b;">2) - f(x) = 2xh + h²</div>
                <div id="step-3" style="display:none; color:#38bdf8;">3) / h = 2x + h</div>
                <div id="step-4" style="display:none; color:#10b981;">4) lim(h->0) = 2x</div>
                <br>
                <button onclick="nextStep()" style="padding:10px; background:#ef4444; color:white; border:none; border-radius:5px; cursor:pointer;">Siguiente Paso ➡</button>
            </div>
            <script>
                let currentStep = 0;
                function nextStep() {
                    currentStep++;
                    if(currentStep > 4) {
                        currentStep = 0;
                        document.getElementById('step-1').style.display='none';
                        document.getElementById('step-2').style.display='none';
                        document.getElementById('step-3').style.display='none';
                        document.getElementById('step-4').style.display='none';
                    } else {
                        document.getElementById('step-'+currentStep).style.display='block';
                    }
                }
            </script>
        """,
        "kahoot": [
            {"question": "El primer paso de la regla por definición es...", "options": ["Sustituir cada 'x' por '(x+h)'", "Restar la función original", "Dividir entre h", "Aplicar el límite"], "answerIndex": 0},
            {"question": "En el paso 2 (restar f(x)), ¿qué suele ocurrir algebraicamente?", "options": ["Se eliminan los términos que no tienen la letra 'h'", "El ejercicio se vuelve infinito", "Se borra la X", "Terminamos"], "answerIndex": 0},
            {"question": "El paso 3 (dividir entre h) sirve para...", "options": ["Eliminar la 'h' que causa la indeterminación 0/0", "Hacer los números más pequeños", "Cumplir reglas de división", "Cambiar de signo"], "answerIndex": 0},
            {"question": "El último paso es aplicar el límite h->0. ¿Qué le pasa a las 'h' sobrantes?", "options": ["Se vuelven cero y desaparecen", "Se vuelven uno", "Se vuelven infinito", "Se vuelven X"], "answerIndex": 0},
            {"question": "La derivada de f(x) = x^2 calculada con los 4 pasos da:", "options": ["2x", "x^2 + 2x", "2", "0"], "answerIndex": 0},
            {"question": "Esta regla general es conocida formalmente como...", "options": ["Derivada por Definición", "Teorema de Pitágoras", "Ley de Ohm", "Regla de la Cadena"], "answerIndex": 0},
            {"question": "El costo marginal en economía representa:", "options": ["La derivada de la función de costos (costo del siguiente elemento)", "El costo total", "El dinero ahorrado", "Un costo promedio falso"], "answerIndex": 0}
        ],
        "block": 2
    }
]

template = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sesión {id} - Pensamiento Variacional</title>
    <link rel="icon" href="data:,">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/app.css">
    <link rel="stylesheet" href="../css/quiz-kahoot.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        .css-graphic {{
            width: 100%; height: 120px; background: #1e293b; border-radius: 12px;
            margin: 15px 0; display: flex; align-items: center; justify-content: center;
            padding: 15px; box-sizing: border-box; position: relative; overflow: hidden;
            color: #94a3b8; font-family: monospace;
        }}
    </style>
</head>
<body>
    <div class="session-progress-container">
        <span style="font-size: 1.2em;">📚</span>
        <div class="session-progress-bar-bg">
            <div class="session-progress-fill" id="session-progress"></div>
        </div>
    </div>

    <div class="infographic-container" id="sesion{id}-variacional">
        <header class="info-header" ondblclick="unlockTeacherTipsS{id}()">
            <a href="../index.html" class="back-btn">⬅ Inicio</a>
            <div class="badge">Bloque {block} | Sesión {id}</div>
            <h1>{title}</h1>
            <p>{desc}</p>
            <div class="teacher-tip hidden">💡 TIP MAESTRO (1983): Explica con pasión y usa ejemplos reales.</div>
        </header>

        <div class="info-body">
            <section class="info-card goal-card">
                <h2>🎯 Propósito Formativo</h2>
                <p>{theory}</p>
            </section>

            <section class="info-card examples-card" style="grid-column: span 2;">
                <h2>📝 Ejemplos Prácticos</h2>
                <ul class="custom-list">
                    <li><b>{ex1_title}:</b> <p style="font-size: 0.9em; margin: 5px 0;">{ex1_desc}</p></li>
                    <li><b>{ex2_title}:</b> <p style="font-size: 0.9em; margin: 5px 0;">{ex2_desc}</p></li>
                    <li><b>{ex3_title}:</b> <p style="font-size: 0.9em; margin: 5px 0;">{ex3_desc}</p></li>
                </ul>
            </section>

            <section class="info-card strategy-card" style="border-color: #38bdf8; grid-column: span 2;">
                <h2 style="color: #38bdf8;">{sim_title}</h2>
                <p>{sim_desc}</p>
                {sim_html}
            </section>
        </div>
        
        <div id="quiz-mount-point" style="margin-top: 30px;"></div>
        <br><br>
    </div>

    <script src="../js/env.js"></script>
    <script src="../js/script.js"></script>
    <script type="module" src="../js/app.js"></script>
    <script type="module">
        import {{ AppController }} from '../js/app.js';
        import {{ KahootQuiz }} from '../js/quiz-kahoot.js';
        import {{ saveProgressToFirebase }} from '../js/firebase-setup.js';

        window.addEventListener('scroll', () => {{
            const scrollTop = window.scrollY;
            const docHeight = document.body.offsetHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            document.getElementById('session-progress').style.width = Math.min(scrollPercent * 100, 100) + '%';
        }});

        document.addEventListener('DOMContentLoaded', () => {{
            if(window.initSimS{id}) window.initSimS{id}();

            new KahootQuiz('quiz-mount-point', 'sesion{id}', async (score, percentage) => {{
                if(percentage === 100) {{
                    alert(`¡Excelente! Has obtenido el 100% de aciertos. Guardando progreso...`);
                    AppController.markSessionCompleted('sesion{id}');
                    const tempStudentId = localStorage.getItem('pv_student_id') || 'estudiante_' + Math.floor(Math.random()*10000);
                    localStorage.setItem('pv_student_id', tempStudentId);
                    await saveProgressToFirebase(tempStudentId, 'sesion{id}', score, true);
                    window.location.href = '../index.html';
                }} else {{
                    window.location.href = '../index.html';
                }}
            }});
        }});
    </script>
</body>
</html>
"""

os.makedirs("pages", exist_ok=True)

# Generate HTML files
for s in sessions:
    html = template.format(
        id=s["id"],
        block=s["block"],
        title=s["title"],
        desc=s["desc"],
        theory=s["theory"],
        ex1_title=s["ex1"][0], ex1_desc=s["ex1"][1],
        ex2_title=s["ex2"][0], ex2_desc=s["ex2"][1],
        ex3_title=s["ex3"][0], ex3_desc=s["ex3"][1],
        sim_title=s["sim_title"],
        sim_desc=s["sim_desc"],
        sim_html=s["sim_html"]
    )
    with open(f"pages/PVS{s['id']}.HTML", "w", encoding="utf-8") as f:
        f.write(html)

# Append questions
questions_js_append = "    ],"
for s in sessions:
    questions_js_append += f"\n    \"sesion{s['id']}\": ["
    for i, q in enumerate(s["kahoot"]):
        options_str = ", ".join([f'"{opt}"' for opt in q["options"]])
        questions_js_append += f'\n        {{ question: "{q["question"]}", options: [{options_str}], answerIndex: {q["answerIndex"]}, timeLimit: 20 }}'
        if i < len(s["kahoot"]) - 1:
            questions_js_append += ","
    questions_js_append += "\n    ],"

questions_js_append = questions_js_append.rstrip(",") # remove last comma

with open("js/questions.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
content = re.sub(r'\]\s*\};\s*$', questions_js_append + "\n};", content)

with open("js/questions.js", "w", encoding="utf-8") as f:
    f.write(content)

# Append script logic
script_js_append = "\n\n// S11 to S20 Logic\n"
for s in sessions:
    script_js_append += f"function unlockTeacherTipsS{s['id']}() {{ unlockTips('sesion{s['id']}-variacional'); }}\n"
    script_js_append += f"window.unlockTeacherTipsS{s['id']} = unlockTeacherTipsS{s['id']};\n"

script_js_append += """
// S11 Zoom
function drawZoom() {
    const canvas = document.getElementById('zoom-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const zoom = document.getElementById('zoom-slider').value;
    ctx.clearRect(0,0,300,150);
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(150 - 50/zoom, 75 + 50/zoom); // left side approach
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 4; ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(150 + 50/zoom, 75 - 50/zoom); // right side approach
    ctx.lineTo(300, 0);
    ctx.stroke();
    
    // Hole
    ctx.beginPath();
    ctx.arc(150, 75, 5 + parseInt(zoom)/5, 0, 2*Math.PI);
    ctx.strokeStyle = "white"; ctx.stroke();
}
window.drawZoom = drawZoom;
window.initSimS11 = drawZoom;

// S12 Bridge
function drawBridge() {
    const canvas = document.getElementById('bridge-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const x = document.getElementById('bridge-slider').value;
    ctx.clearRect(0,0,300,150);
    
    // Left road
    ctx.fillStyle = "#334155"; ctx.fillRect(0, 70, 150, 10);
    // Right road (offset)
    ctx.fillRect(150, 90, 150, 10);
    
    // Car 1 (Left)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x*1.3, 50, 20, 20);
    
    // Car 2 (Right) coming backwards
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(300 - x*1.3, 70, 20, 20);
    
    if(x > 95) {
        ctx.fillStyle = "white";
        ctx.fillText("¡Límites no coinciden! Choque evitado.", 50, 30);
    }
}
window.drawBridge = drawBridge;
window.initSimS12 = drawBridge;

// S13 Prop
function evalProp() {
    const x = document.getElementById('prop-slider').value;
    const text = document.getElementById('prop-text');
    if(text) text.innerText = `f(x) = 2(${x})² + 3 = ${2*x*x + 3}`;
}
window.evalProp = evalProp;

// S14 Vault
function checkVault() {
    const val = document.getElementById('vault-input').value;
    const status = document.getElementById('vault-status');
    if(val == "6") {
        status.innerText = "🔓 ABIERTA";
        alert("¡Correcto! Factorizando: (x-3)(x+3)/(x-3) = x+3. Limite = 3+3 = 6.");
    } else {
        status.innerText = "🚨 ERROR";
    }
}
window.checkVault = checkVault;

// S15 Inf
function drawInf() {
    const canvas = document.getElementById('inf-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const t = document.getElementById('inf-slider').value;
    document.getElementById('inf-time').innerText = t;
    ctx.clearRect(0,0,300,150);
    
    // Asymptote
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(300, 30);
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.stroke();
    ctx.setLineDash([]);
    
    // Curve
    ctx.beginPath();
    for(let i=0; i<=t*3; i++) {
        let y = 150 - 120*(1 - Math.exp(-0.05*i));
        if(i===0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
    }
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 3; ctx.stroke();
}
window.drawInf = drawInf;
window.initSimS15 = drawInf;

// S16 Cont
let contMode = "continuo";
window.setContMode = (m) => { contMode = m; drawCont(); }
function drawCont() {
    const canvas = document.getElementById('cont-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,300,150);
    
    ctx.beginPath();
    if(contMode === "continuo") {
        ctx.moveTo(0,100); ctx.lineTo(300,50);
        ctx.strokeStyle="#10b981"; ctx.lineWidth=4; ctx.stroke();
    } else if(contMode === "hueco") {
        ctx.moveTo(0,100); ctx.lineTo(145, 75); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(155, 73); ctx.lineTo(300, 50); ctx.stroke();
        ctx.beginPath(); ctx.arc(150, 74, 5, 0, 2*Math.PI); ctx.stroke();
        ctx.fillStyle="#10b981"; ctx.fillRect(148, 20, 4, 4); // point displaced
    } else {
        ctx.moveTo(0,100); ctx.lineTo(150, 75); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(150, 25); ctx.lineTo(300, 50); ctx.stroke();
    }
}
window.drawCont = drawCont;
window.initSimS16 = drawCont;

// S17 Ramp
function drawRamp() {
    const canvas = document.getElementById('ramp-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const b = parseInt(document.getElementById('ramp-slider').value);
    document.getElementById('ramp-val').innerText = b;
    ctx.clearRect(0,0,300,150);
    
    ctx.beginPath();
    ctx.moveTo(0, 100); ctx.lineTo(150, 100); // Fixed left
    ctx.moveTo(150, 100 - b); ctx.lineTo(300, 50); // Right adjustable
    ctx.strokeStyle="#38bdf8"; ctx.lineWidth=6; ctx.stroke();
    
    if(b === 0) {
        ctx.fillStyle = "#10b981";
        ctx.fillText("¡Rampa Continua!", 100, 30);
    } else {
        ctx.fillStyle = "#ef4444";
        ctx.fillText("¡Discontinuidad de Salto! Peligro.", 60, 30);
    }
}
window.drawRamp = drawRamp;
window.initSimS17 = drawRamp;

// S18 Secant
function drawSecant() {
    const canvas = document.getElementById('sec-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const h = parseInt(document.getElementById('sec-slider').value);
    ctx.clearRect(0,0,300,150);
    
    // curve
    ctx.beginPath();
    for(let x=0; x<=300; x+=5) {
        let y = 150 - (x*x)/600;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle="rgba(255,255,255,0.3)"; ctx.stroke();
    
    // points
    let x1 = 100; let y1 = 150 - (x1*x1)/600;
    let x2 = 100 + h; let y2 = 150 - (x2*x2)/600;
    
    ctx.fillStyle="white";
    ctx.beginPath(); ctx.arc(x1,y1,5,0,2*Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(x2,y2,5,0,2*Math.PI); ctx.fill();
    
    // line
    ctx.beginPath(); ctx.moveTo(0, y1 - (y2-y1)/(x2-x1)*x1); ctx.lineTo(300, y1 + (y2-y1)/(x2-x1)*(300-x1));
    ctx.strokeStyle = h < 5 ? "#10b981" : "#ef4444";
    ctx.lineWidth=2; ctx.stroke();
}
window.drawSecant = drawSecant;
window.initSimS18 = drawSecant;

// S19 Tan
function drawTangent() {
    const canvas = document.getElementById('tan-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = parseInt(document.getElementById('tan-slider').value);
    ctx.clearRect(0,0,300,150);
    
    // curve (valley)
    ctx.beginPath();
    for(let x=0; x<=300; x+=5) {
        let y = (x-150)*(x-150)/200 + 30;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.strokeStyle="white"; ctx.stroke();
    
    let x1 = (pos/100)*300;
    let y1 = (x1-150)*(x1-150)/200 + 30;
    let slope = (x1-150)/100; // derivative of x^2/200 is 2x/200 = x/100
    
    document.getElementById('tan-slope').innerText = "Pendiente (m): " + slope.toFixed(2);
    
    ctx.beginPath(); ctx.arc(x1,y1,5,0,2*Math.PI); ctx.fillStyle="#a855f7"; ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x1 - 50, y1 - 50*slope);
    ctx.lineTo(x1 + 50, y1 + 50*slope);
    ctx.strokeStyle="#a855f7"; ctx.lineWidth=3; ctx.stroke();
}
window.drawTangent = drawTangent;
window.initSimS19 = drawTangent;

"""

with open("js/script.js", "a", encoding="utf-8") as f:
    f.write(script_js_append)

# modify index.js
with open("js/index.js", "r", encoding="utf-8") as f:
    content = f.read()

import re
sessions_push_code = ""
for s in sessions:
    sessions_push_code += f'    sessions.push({{ id: {s["id"]}, title: "{s["title"]}", description: "{s["desc"]}", block: {s["block"]}, link: "pages/PVS{s["id"]}.HTML", status: "active" }});\n'

# Find where S10 push ends
content = re.sub(r'(sessions\.push\(\{ id: 10,.*?\n)', r'\1' + sessions_push_code, content)
content = re.sub(r'for \(let i = 11; i <= 50; i\+\+\)', 'for (let i = 21; i <= 50; i++)', content)

with open("js/index.js", "w", encoding="utf-8") as f:
    f.write(content)

print("S11 to S20 created and registered successfully!")
