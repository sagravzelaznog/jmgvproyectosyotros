// Interactividad específica para Cálculo Integral
// Funcionalidades: visualizaciones matemáticas, calculadoras, ejercicios avanzados

document.addEventListener('DOMContentLoaded', function() {
    initializeCalculusInteractivity();
    initializeSigmaCalculator();
    initializeVisualizationTools();
    initializeExerciseGenerators();

    console.log('🧮 Módulo de interactividad para Cálculo Integral cargado');
});

// ========================================
// CALCULADORA SIGMA INTERACTIVA
// ========================================

function initializeSigmaCalculator() {
    // Crear calculadora sigma si existe el contenedor
    const calculatorContainer = document.getElementById('sigma-calculator');
    if (calculatorContainer) {
        createSigmaCalculator();
    }

    // Funcionalidad para ejemplos interactivos de sigma
    const sigmaExamples = document.querySelectorAll('.sigma-example');
    sigmaExamples.forEach(example => {
        makeSigmaInteractive(example);
    });
}

function createSigmaCalculator() {
    const container = document.getElementById('sigma-calculator');

    const calculatorHTML = `
        <div class="calculator-container">
            <h4>🧮 Calculadora Sigma</h4>
            <div class="calculator-inputs">
                <div class="input-group">
                    <label>Expresión (usa 'i' como variable):</label>
                    <input type="text" id="sigma-expression" value="i" placeholder="ej: i, i^2, 2*i">
                </div>
                <div class="input-group">
                    <label>Desde:</label>
                    <input type="number" id="sigma-start" value="1" min="1">
                </div>
                <div class="input-group">
                    <label>Hasta:</label>
                    <input type="number" id="sigma-end" value="10" min="1">
                </div>
                <button class="interactive-btn" onclick="calculateSigma()">Calcular Σ</button>
            </div>
            <div class="calculator-result" id="sigma-result">
                Ingresa valores y calcula
            </div>
            <div class="calculator-steps" id="sigma-steps" style="display: none;">
                <h5>Pasos del cálculo:</h5>
                <div id="steps-content"></div>
            </div>
        </div>
    `;

    container.innerHTML = calculatorHTML;

    // Agregar estilos específicos para la calculadora
    const style = document.createElement('style');
    style.textContent = `
        .calculator-container {
            background: var(--light-blue);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--primary-blue);
            margin: 1rem 0;
        }

        .calculator-inputs {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .input-group label {
            font-weight: 600;
            color: var(--dark-blue);
            font-size: 0.9rem;
        }

        .input-group input {
            padding: 0.5rem;
            border: 2px solid var(--neutral-300);
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .input-group input:focus {
            outline: none;
            border-color: var(--primary-emerald);
        }

        .calculator-result {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            font-size: 1.1rem;
            color: var(--dark-blue);
            margin: 1rem 0;
        }

        .calculator-steps {
            background: var(--neutral-100);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }

        .calculator-steps h5 {
            color: var(--dark-emerald);
            margin-bottom: 0.5rem;
        }

        .step-item {
            padding: 0.25rem 0;
            font-family: monospace;
            font-size: 0.9rem;
        }

        @media (min-width: 600px) {
            .calculator-inputs {
                grid-template-columns: 2fr 1fr 1fr auto;
                align-items: end;
            }
        }
    `;
    document.head.appendChild(style);
}

// Función global para calcular sigma
function calculateSigma() {
    const expression = document.getElementById('sigma-expression').value;
    const start = parseInt(document.getElementById('sigma-start').value);
    const end = parseInt(document.getElementById('sigma-end').value);
    const resultElement = document.getElementById('sigma-result');
    const stepsElement = document.getElementById('sigma-steps');
    const stepsContent = document.getElementById('steps-content');

    if (!expression || isNaN(start) || isNaN(end)) {
        resultElement.innerHTML = '❌ Por favor ingresa valores válidos';
        resultElement.style.background = '#fee2e2';
        resultElement.style.color = '#dc2626';
        return;
    }

    if (start > end) {
        resultElement.innerHTML = '❌ El valor inicial debe ser menor o igual al final';
        resultElement.style.background = '#fee2e2';
        resultElement.style.color = '#dc2626';
        return;
    }

    try {
        let sum = 0;
        let steps = [];

        for (let i = start; i <= end; i++) {
            const termValue = evaluateExpression(expression, i);
            sum += termValue;
            steps.push(`i=${i}: ${expression} = ${termValue}`);
        }

        resultElement.innerHTML = `∑ = ${formatNumber(sum)}`;
        resultElement.style.background = 'var(--light-emerald)';
        resultElement.style.color = 'var(--dark-emerald)';

        // Mostrar pasos
        stepsContent.innerHTML = steps.map(step => `<div class="step-item">${step}</div>`).join('');
        stepsElement.style.display = 'block';

    } catch (error) {
        resultElement.innerHTML = '❌ Error en la expresión. Usa solo números, i, +, -, *, /, ^';
        resultElement.style.background = '#fee2e2';
        resultElement.style.color = '#dc2626';
        stepsElement.style.display = 'none';
    }
}

function evaluateExpression(expr, i) {
    // Evaluación segura de expresiones matemáticas simples
    try {
        // Reemplazar ^ con ** para potencias
        let processedExpr = expr.replace(/\^/g, '**');
        // Reemplazar i con el valor actual
        processedExpr = processedExpr.replace(/i/g, i);

        // Evaluar la expresión
        return eval(processedExpr);
    } catch (error) {
        throw new Error('Expresión inválida');
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('es-ES', {
        maximumFractionDigits: 6
    }).format(num);
}

// ========================================
// VISUALIZACIONES MATEMÁTICAS
// ========================================

function initializeVisualizationTools() {
    // Crear visualizaciones si existen los contenedores
    const riemannContainer = document.getElementById('riemann-visualization');
    if (riemannContainer) {
        createRiemannVisualization();
    }

    const functionContainer = document.getElementById('function-plotter');
    if (functionContainer) {
        createFunctionPlotter();
    }
}

function createRiemannVisualization() {
    const container = document.getElementById('riemann-visualization');

    const visualizationHTML = `
        <div class="visualization-controls">
            <div class="control-group">
                <label>Función: x²</label>
                <span>Intervalo: [0, 4]</span>
            </div>
            <div class="control-group">
                <label>Rectángulos:</label>
                <input type="range" id="rect-count" min="4" max="20" value="8">
                <span id="rect-display">8</span>
            </div>
            <button class="interactive-btn" onclick="updateRiemann()">Actualizar</button>
        </div>
        <div class="visualization-canvas">
            <canvas id="riemann-canvas" width="600" height="300"></canvas>
        </div>
        <div class="visualization-info">
            <div class="info-item">
                <strong>Área aproximada:</strong> <span id="approx-area">0</span>
            </div>
            <div class="info-item">
                <strong>Área exacta:</strong> <span id="exact-area">10.67</span>
            </div>
        </div>
    `;

    container.innerHTML = visualizationHTML;

    // Estilos para visualización
    const style = document.createElement('style');
    style.textContent = `
        .visualization-controls {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            padding: 1rem;
            background: var(--light-blue);
            border-radius: 8px;
            flex-wrap: wrap;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 120px;
        }

        .control-group label {
            font-weight: 600;
            color: var(--dark-blue);
        }

        .control-group input[type="range"] {
            width: 100%;
        }

        .visualization-canvas {
            border: 2px solid var(--primary-blue);
            border-radius: 8px;
            overflow: hidden;
            margin: 1rem 0;
        }

        .visualization-info {
            display: flex;
            gap: 2rem;
            justify-content: center;
            padding: 1rem;
            background: var(--light-emerald);
            border-radius: 8px;
        }

        .info-item {
            font-weight: 600;
            color: var(--dark-emerald);
        }
    `;
    document.head.appendChild(style);

    // Inicializar el slider
    const slider = document.getElementById('rect-count');
    const display = document.getElementById('rect-display');

    slider.addEventListener('input', function() {
        display.textContent = this.value;
    });

    // Dibujar visualización inicial
    updateRiemann();
}

// Función para actualizar la visualización de Riemann
function updateRiemann() {
    const canvas = document.getElementById('riemann-canvas');
    const ctx = canvas.getContext('2d');
    const rectCount = parseInt(document.getElementById('rect-count').value);

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración
    const margin = 40;
    const plotWidth = canvas.width - 2 * margin;
    const plotHeight = canvas.height - 2 * margin;

    // Función a integrar: x² de 0 a 4
    function f(x) {
        return x * x;
    }

    // Límites
    const a = 0, b = 4;
    const range = b - a;

    // Dibujar ejes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    // Eje X
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.stroke();

    // Dibujar función
    ctx.strokeStyle = 'var(--primary-blue)';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x <= plotWidth; x++) {
        const realX = a + (x / plotWidth) * range;
        const realY = f(realX);
        const canvasX = margin + x;
        const canvasY = canvas.height - margin - (realY / 16) * plotHeight;

        if (x === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Dibujar rectángulos de Riemann (sumas inferiores)
    const rectWidth = plotWidth / rectCount;
    let totalArea = 0;

    for (let i = 0; i < rectCount; i++) {
        const x1 = a + (i / rectCount) * range;
        const x2 = a + ((i + 1) / rectCount) * range;
        const height = f(x1); // Altura en el lado izquierdo (suma inferior)

        const canvasX = margin + (i / rectCount) * plotWidth;
        const canvasY = canvas.height - margin;
        const canvasWidth = rectWidth;
        const canvasHeight = (height / 16) * plotHeight;

        // Dibujar rectángulo
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.strokeStyle = 'var(--primary-emerald)';
        ctx.lineWidth = 1;

        ctx.fillRect(canvasX, canvasY - canvasHeight, canvasWidth, canvasHeight);
        ctx.strokeRect(canvasX, canvasY - canvasHeight, canvasWidth, canvasHeight);

        totalArea += height * (range / rectCount);
    }

    // Actualizar información
    document.getElementById('approx-area').textContent = formatNumber(totalArea);
    document.getElementById('exact-area').textContent = formatNumber(64/3); // ∫x² dx de 0 a 4 = 64/3
}

// ========================================
// EJERCICIOS INTERACTIVOS AVANZADOS
// ========================================

function initializeExerciseGenerators() {
    // Generar ejercicios aleatorios si existe el generador
    const exerciseGenerator = document.getElementById('exercise-generator');
    if (exerciseGenerator) {
        createExerciseGenerator();
    }
}

function createExerciseGenerator() {
    const container = document.getElementById('exercise-generator');

    const generatorHTML = `
        <div class="exercise-generator">
            <div class="generator-controls">
                <button class="interactive-btn" onclick="generateNewExercise()">🎲 Nuevo Ejercicio</button>
                <select id="exercise-type">
                    <option value="sigma-basic">Sigma Básica</option>
                    <option value="sigma-properties">Propiedades Sigma</option>
                    <option value="sigma-advanced">Sigma Avanzada</option>
                </select>
            </div>
            <div class="generated-exercise" id="generated-exercise">
                <p>Selecciona un tipo de ejercicio y genera uno nuevo</p>
            </div>
            <div class="exercise-solution" id="exercise-solution" style="display: none;">
                <h4>Solución:</h4>
                <div id="solution-content"></div>
                <button class="interactive-btn" onclick="showSolution()">Mostrar Solución</button>
            </div>
        </div>
    `;

    container.innerHTML = generatorHTML;

    // Generar primer ejercicio
    generateNewExercise();
}

function generateNewExercise() {
    const type = document.getElementById('exercise-type').value;
    const exerciseDiv = document.getElementById('generated-exercise');
    const solutionDiv = document.getElementById('exercise-solution');
    const solutionContent = document.getElementById('solution-content');

    solutionDiv.style.display = 'none';

    let exercise = '';
    let solution = '';

    switch(type) {
        case 'sigma-basic':
            const basicExercises = [
                {
                    question: 'Convierte a notación sigma: 2 + 4 + 6 + 8 + 10',
                    answer: '\\(\\sum_{i=1}^{5} 2i\\)',
                    explanation: 'Es la suma de números pares del 2 al 10. La fórmula general es 2i donde i va de 1 a 5.'
                },
                {
                    question: 'Convierte a notación sigma: 1 + 8 + 27 + 64',
                    answer: '\\(\\sum_{i=1}^{4} i^3\\)',
                    explanation: 'Son los cubos de los primeros 4 números naturales: 1³ + 2³ + 3³ + 4³.'
                },
                {
                    question: '¿Cuántos términos tiene \\(\\sum_{k=3}^{7} k^2\\)?',
                    answer: '5 términos',
                    explanation: 'Los términos son para k=3,4,5,6,7. Total: 7-3+1=5 términos.'
                }
            ];
            const basic = basicExercises[Math.floor(Math.random() * basicExercises.length)];
            exercise = basic.question;
            solution = basic.answer + '<br><small>' + basic.explanation + '</small>';
            break;

        case 'sigma-properties':
            const propertyExercises = [
                {
                    question: 'Simplifica: \\(\\sum_{i=1}^{5} (3i + 2)\\)',
                    answer: '\\(= 3\\sum_{i=1}^{5} i + \\sum_{i=1}^{5} 2 = 3(15) + 2(5) = 45 + 10 = 55\\)',
                    explanation: 'Aplicamos distributividad: factor común sale de la suma.'
                },
                {
                    question: 'Calcula: \\(\\sum_{i=1}^{4} (i^2 + 2i)\\)',
                    answer: '\\(= \\sum i^2 + 2\\sum i = (1+4+9+16) + 2(1+2+3+4) = 30 + 2(10) = 50\\)',
                    explanation: 'Separamos en dos sumas y calculamos cada una.'
                }
            ];
            const property = propertyExercises[Math.floor(Math.random() * propertyExercises.length)];
            exercise = property.question;
            solution = property.answer + '<br><small>' + property.explanation + '</small>';
            break;

        case 'sigma-advanced':
            const advancedExercises = [
                {
                    question: 'Encuentra el valor de \\(\\sum_{i=1}^{n} i\\) para n=100',
                    answer: '\\(= \\frac{n(n+1)}{2} = \\frac{100×101}{2} = 5050\\)',
                    explanation: 'Fórmula para la suma de los primeros n naturales.'
                },
                {
                    question: 'Calcula \\(\\sum_{i=1}^{6} \\frac{1}{i}\\)',
                    answer: '\\(= 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} + \\frac{1}{5} + \\frac{1}{6} = 2.45\\)',
                    explanation: 'Suma de la serie armónica hasta el término 6.'
                }
            ];
            const advanced = advancedExercises[Math.floor(Math.random() * advancedExercises.length)];
            exercise = advanced.question;
            solution = advanced.answer + '<br><small>' + advanced.explanation + '</small>';
            break;
    }

    exerciseDiv.innerHTML = `<div class="exercise-question">${exercise}</div>`;
    solutionContent.innerHTML = solution;

    // Renderizar MathJax si es necesario
    if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, solutionContent]);
    }
}

function showSolution() {
    const solutionDiv = document.getElementById('exercise-solution');
    solutionDiv.style.display = 'block';
}

// ========================================
// HERRAMIENTAS ADICIONALES
// ========================================

// Función para hacer ejemplos sigma interactivos
function makeSigmaInteractive(element) {
    element.style.cursor = 'pointer';
    element.title = 'Haz clic para expandir';

    element.addEventListener('click', function() {
        const content = this.getAttribute('data-content');
        if (content) {
            showSigmaDetails(content);
        }
    });
}

function showSigmaDetails(content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 600px; margin: 1rem;">
            <h3>Detalles de la Suma Sigma</h3>
            <div>${content}</div>
            <button class="interactive-btn" onclick="this.closest('div').parentElement.remove()" style="margin-top: 1rem;">
                Cerrar
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

// ========================================
// INICIALIZACIÓN DE HERRAMIENTAS ESPECÍFICAS
// ========================================

// Herramientas para visualización de funciones
function createFunctionPlotter() {
    const container = document.getElementById('function-plotter');

    const plotterHTML = `
        <div class="plotter-container">
            <div class="plotter-inputs">
                <div class="input-group">
                    <label>Función f(x):</label>
                    <input type="text" id="function-input" value="x^2" placeholder="ej: x^2, sin(x), x^3-2*x">
                </div>
                <div class="input-group">
                    <label>Desde x:</label>
                    <input type="number" id="plot-start" value="-5" step="0.1">
                </div>
                <div class="input-group">
                    <label>Hasta x:</label>
                    <input type="number" id="plot-end" value="5" step="0.1">
                </div>
                <button class="interactive-btn" onclick="plotFunction()">Graficar</button>
            </div>
            <div class="plotter-canvas">
                <canvas id="function-canvas" width="500" height="300"></canvas>
            </div>
        </div>
    `;

    container.innerHTML = plotterHTML;

    // Agregar estilos para el graficador
    const style = document.createElement('style');
    style.textContent = `
        .plotter-container {
            background: var(--light-blue);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--primary-blue);
        }

        .plotter-inputs {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .plotter-canvas {
            border: 1px solid var(--neutral-300);
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
    `;
    document.head.appendChild(style);
};

// Función para graficar funciones
function plotFunction() {
    const canvas = document.getElementById('function-canvas');
    const ctx = canvas.getContext('2d');
    const funcInput = document.getElementById('function-input').value;
    const start = parseFloat(document.getElementById('plot-start').value);
    const end = parseFloat(document.getElementById('plot-end').value);

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración
    const margin = 30;
    const plotWidth = canvas.width - 2 * margin;
    const plotHeight = canvas.height - 2 * margin;

    // Dibujar ejes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Eje X
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height/2);
    ctx.lineTo(canvas.width - margin, canvas.height/2);
    ctx.stroke();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, margin);
    ctx.lineTo(canvas.width/2, canvas.height - margin);
    ctx.stroke();

    // Dibujar función
    ctx.strokeStyle = 'var(--primary-blue)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const range = end - start;
    const points = 500;

    for (let i = 0; i <= points; i++) {
        const x = start + (i / points) * range;

        try {
            // Evaluación segura de la función
            const y = evaluateExpression(funcInput.replace(/x/g, `(${x})`), 0);

            if (!isFinite(y)) continue;

            const canvasX = margin + (i / points) * plotWidth;
            const canvasY = canvas.height/2 - (y * 20); // Escala ajustable

            if (i === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        } catch (error) {
            // Saltar puntos inválidos
            continue;
        }
    }

    ctx.stroke();

    // Mostrar información
    ctx.fillStyle = 'var(--neutral-600)';
    ctx.font = '12px Arial';
    ctx.fillText(`f(x) = ${funcInput}`, 10, 20);
    ctx.fillText(`x ∈ [${start}, ${end}]`, 10, 35);
};

// ========================================
// HERRAMIENTAS DE CÁLCULO NUMÉRICO
// ========================================

// Función para calcular integrales numéricas simples
function numericalIntegration(func, a, b, intervals = 1000) {
    const h = (b - a) / intervals;
    let sum = 0;

    for (let i = 0; i < intervals; i++) {
        const x1 = a + i * h;
        const x2 = a + (i + 1) * h;
        const y1 = evaluateExpression(func.replace(/x/g, `(${x1})`), 0);
        const y2 = evaluateExpression(func.replace(/x/g, `(${x2})`), 0);

        // Regla del trapecio
        sum += (y1 + y2) * h / 2;
    }

    return sum;
};

// Función para actualizar la visualización de Riemann
function updateRiemannVisualization() {
    const canvas = document.getElementById('riemann-canvas');
    const ctx = canvas.getContext('2d');
    const rectCount = parseInt(document.getElementById('riemann-rects').value);
    const riemannType = document.getElementById('riemann-type').value;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración
    const margin = 40;
    const plotWidth = canvas.width - 2 * margin;
    const plotHeight = canvas.height - 2 * margin;

    // Función a integrar: x² de 0 a 2
    function f(x) {
        return x * x;
    }

    // Límites
    const a = 0, b = 2;
    const range = b - a;

    // Dibujar ejes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    // Eje X
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.stroke();

    // Dibujar función
    ctx.strokeStyle = 'var(--primary-blue)';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x <= plotWidth; x++) {
        const realX = a + (x / plotWidth) * range;
        const realY = f(realX);
        const canvasX = margin + x;
        const canvasY = canvas.height - margin - (realY / 4) * plotHeight;

        if (x === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Dibujar rectángulos de Riemann según el tipo seleccionado
    const rectWidth = plotWidth / rectCount;
    let totalArea = 0;

    for (let i = 0; i < rectCount; i++) {
        const x1 = a + (i / rectCount) * range;
        const x2 = a + ((i + 1) / rectCount) * range;

        let height;
        let rectColor = 'rgba(16, 185, 129, 0.3)';

        switch(riemannType) {
            case 'left':
                height = f(x1); // Punto izquierdo
                break;
            case 'right':
                height = f(x2); // Punto derecho
                break;
            case 'midpoint':
            default:
                height = f((x1 + x2) / 2); // Punto medio
                rectColor = 'rgba(59, 130, 246, 0.3)'; // Azul para punto medio
                break;
        }

        const canvasX = margin + (i / rectCount) * plotWidth;
        const canvasY = canvas.height - margin;
        const canvasWidth = rectWidth;
        const canvasHeight = (height / 4) * plotHeight;

        // Dibujar rectángulo
        ctx.fillStyle = rectColor;
        ctx.strokeStyle = riemannType === 'midpoint' ? 'var(--primary-blue)' : 'var(--primary-emerald)';
        ctx.lineWidth = 1;

        ctx.fillRect(canvasX, canvasY - canvasHeight, canvasWidth, canvasHeight);
        ctx.strokeRect(canvasX, canvasY - canvasHeight, canvasWidth, canvasHeight);

        totalArea += height * (range / rectCount);
    }

// Función para actualizar la visualización de rectángulos inscritos
function updateInscribedVisualization() {
    const canvas = document.getElementById('inscribed-canvas');
    const ctx = canvas.getContext('2d');
    const rectCount = parseInt(document.getElementById('inscribed-rects').value);

    // Actualizar el valor mostrado
    document.getElementById('inscribed-rects-value').textContent = rectCount;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración
    const margin = 40;
    const plotWidth = canvas.width - 2 * margin;
    const plotHeight = canvas.height - 2 * margin;

    // Función a integrar: x² de 0 a 2
    function f(x) {
        return x * x;
    }

    // Límites
    const a = 0, b = 2;
    const range = b - a;

    // Dibujar ejes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    // Eje X
    ctx.beginPath();
    ctx.moveTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.stroke();

    // Dibujar función
    ctx.strokeStyle = 'var(--primary-blue)';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x <= plotWidth; x++) {
        const realX = a + (x / plotWidth) * range;
        const realY = f(realX);
        const canvasX = margin + x;
        const canvasY = canvas.height - margin - (realY / 4) * plotHeight;

        if (x === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    ctx.stroke();

    // Dibujar rectángulos inscritos (puntos izquierdos)
    const rectWidth = plotWidth / rectCount;
    let totalArea = 0;

    for (let i = 0; i < rectCount; i++) {
        const x1 = a + (i / rectCount) * range;
        const x2 = a + ((i + 1) / rectCount) * range;

        // Para rectángulos inscritos, usamos el punto izquierdo (x1)
        const height = f(x1);

        const canvasX = margin + (i / rectCount) * plotWidth;
        const canvasY = canvas.height - margin;
        const canvasWidth = rectWidth;
        const canvasHeight = (height / 4) * plotHeight;

        // Dibujar rectángulo
        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'; // Verde esmeralda con transparencia
        ctx.strokeStyle = 'var(--primary-emerald)';
        ctx.lineWidth = 2;

        ctx.fillRect(canvasX, canvasY - canvasHeight, canvasWidth, canvasHeight);
        ctx.strokeRect(canvasX, canvasY - canvasHeight, canvasWidth, canvasHeight);

        totalArea += height * (range / rectCount);
    }

    // Actualizar información
    const exactArea = 8/3; // ∫x² dx de 0 a 2 = 8/3
    document.getElementById('inscribed-approx-area').textContent = formatNumber(totalArea);
    document.getElementById('inscribed-exact-area').textContent = formatNumber(exactArea);
// Función para verificar la suma de rectángulos inscritos
function checkInscribedSum() {
    const input = document.getElementById('exercise6_3-input');
    const userAnswer = input?.value.trim();
    const feedbackElement = document.getElementById('feedback-exercise6_3');

    if (!userAnswer || !feedbackElement) return;

    // Respuesta correcta: Suma de Riemann para f(x) = 2x + 1 de 1 a 3 con n=4 usando puntos izquierdos
    // Δx = 0.5, puntos: 1.0, 1.5, 2.0, 2.5
    // f(1.0)=3, f(1.5)=4, f(2.0)=5, f(2.5)=6
    // Suma: 3 + 4 + 5 + 6 = 18
    const correctAnswer = '9';
    const isCorrect = userAnswer === correctAnswer;

    feedbackElement.classList.remove('hidden');
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Correcto! Excelente cálculo de sumas inferiores.';
        input.disabled = true;
        input.style.backgroundColor = 'var(--light-emerald)';
    } else {
        feedbackElement.innerHTML = `❌ Respuesta incorrecta. El resultado es 9. <br>
            Cálculo paso a paso:<br>
            1. Δx = (3-1)/4 = 0.5<br>
            2. Puntos izquierdos: 1.0, 1.5, 2.0, 2.5<br>
            3. f(1.0) = 3, f(1.5) = 4, f(2.0) = 5, f(2.5) = 6<br>
            4. Suma: 3×0.5 + 4×0.5 + 5×0.5 + 6×0.5 = 1.5 + 2.0 + 2.5 + 3.0 = 9`;
    }
}

// ========================================
// FUNCIONES DE EJERCICIOS ESPECÍFICOS
// ========================================

// Función para verificar respuestas de opción múltiple
function checkAnswer(exerciseId, selectedAnswer) {
    const feedbackElement = document.getElementById(`feedback-${exerciseId}`);
    const correctAnswers = {
        'exercise1': 'b',  // Session 1
        'exercise2_1': 'a', // Session 2: Σ(4) = 24
        'exercise2_2': 'a', // Session 2: 3 × Σ(i from 1 to 4) = 30
        'exercise2_3': 'a', // Session 2: Σ(i + 2i) = Σ(i) + Σ(2i)
        'exercise3_1': 'a', // Session 3: Σ(3i + 2) from 1 to 4 = 30
        'exercise3_2': 'a', // Session 3: Σ(i + i² + 1) from 1 to 3 = 20
        'exercise3_4': 'a', // Session 3: Distributivity (2Σi + 3Σ1)
        'exercise4_1': 'a', // Session 4: Σ(i² + i + 1) from 1 to 4 = 40
        'exercise4_2': 'a', // Session 4: Σ((i+2)/(i+1)) from 1 to 3 = 11/6
        'exercise4_4': 'a', // Session 4: Arithmetic series 3+5+7+9+11 = 35
        'exercise5_1': 'b', // Session 5: Riemann sum with midpoints = 0.375
        'exercise5_2': 'c', // Session 5: Midpoint sum is most accurate
        'exercise6_1': 'b', // Session 6: Area under f(x) = x + 1 with 4 inscribed rectangles = 4.0
        'exercise6_2': 'b'  // Session 6: Inscribed rectangles always underestimate
    };

    const isCorrect = selectedAnswer === correctAnswers[exerciseId];

    if (feedbackElement) {
        feedbackElement.classList.remove('hidden');
        feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

        if (isCorrect) {
            feedbackElement.innerHTML = '✅ ¡Correcto! Excelente trabajo.';
        } else {
            feedbackElement.innerHTML = '❌ Incorrecto. Inténtalo de nuevo.';
        }
    }

    // Deshabilitar otros botones después de responder
    const exerciseContainer = feedbackElement?.parentElement;
    if (exerciseContainer) {
        const buttons = exerciseContainer.querySelectorAll('.interactive-btn');
        buttons.forEach(button => {
            button.disabled = true;
            if (button.textContent.includes(selectedAnswer.toUpperCase())) {
                button.style.background = isCorrect ? 'var(--success)' : 'var(--error)';
            }
        });
    }
}

// Función para verificar respuestas de notación sigma
function checkSigmaAnswer() {
    const input = document.getElementById('exercise2-input');
    const userAnswer = input?.value.trim().replace(/\s+/g, '');
    const feedbackElement = document.getElementById('feedback-exercise2');

    if (!userAnswer || !feedbackElement) return;

    // Respuestas aceptadas (variaciones de la notación sigma)
    const correctAnswers = [
        '\\sum_{i=1}^{4}5',
        '\\sum_{i=1}^45',
        '\\sum_{k=1}^{4}5',
        '\\sum_{k=1}^45',
        '∑_{i=1}^{4}5',
        '∑_{i=1}^45',
        '∑_{k=1}^{4}5',
        '∑_{k=1}^45'
    ];

    const isCorrect = correctAnswers.some(correct => {
        const normalizedCorrect = correct.replace(/\s+/g, '').replace(/\\sum/g, '∑');
        return userAnswer === normalizedCorrect ||
               userAnswer.replace(/\\sum/g, '∑') === normalizedCorrect ||
               userAnswer === normalizedCorrect.replace(/\\sum/g, '∑');
    });

    feedbackElement.classList.remove('hidden');
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Perfecto! La notación sigma es correcta.';
        input.disabled = true;
        input.style.backgroundColor = 'var(--light-emerald)';
    } else {
        feedbackElement.innerHTML = '❌ La notación no es correcta. Revisa la sintaxis. Debe ser: ∑ (desde i=1 hasta 4) de 5';
    }
}

// Función para verificar cálculo sigma de Session 2
function checkSigmaCalculation() {
    const input = document.getElementById('exercise2_4-input');
    const userAnswer = input?.value.trim();
    const feedbackElement = document.getElementById('feedback-exercise2_4');

    if (!userAnswer || !feedbackElement) return;

    // Respuesta correcta: Σ(2i + 3) de 1 a 3 = (2+3) + (4+3) + (6+3) = 5 + 7 + 9 = 21
    const correctAnswer = '21';
    const isCorrect = userAnswer === correctAnswer;

    feedbackElement.classList.remove('hidden');
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Correcto! Excelente cálculo.';
        input.disabled = true;
        input.style.backgroundColor = 'var(--light-emerald)';
    } else {
        feedbackElement.innerHTML = `❌ Respuesta incorrecta. El resultado es 21. <br>
            Cálculo: (2×1+3) + (2×2+3) + (2×3+3) = 5 + 7 + 9 = 21`;
    }
}

// Función para verificar cálculo sigma de Session 3
function checkSigmaCalculation3() {
    const input = document.getElementById('exercise3_3-input');
    const userAnswer = input?.value.trim();
    const feedbackElement = document.getElementById('feedback-exercise3_3');

    if (!userAnswer || !feedbackElement) return;

    // Respuesta correcta: Σ(2i² - 3i + 4) de 1 a 5
    // Σ(2i²) = 2(55) = 110, Σ(3i) = 3(15) = 45, Σ(4) = 5(4) = 20
    // Resultado: 110 - 45 + 20 = 85
    const correctAnswer = '85';
    const isCorrect = userAnswer === correctAnswer;

    feedbackElement.classList.remove('hidden');
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Correcto! Excelente aplicación de la linealidad.';
        input.disabled = true;
        input.style.backgroundColor = 'var(--light-emerald)';
    } else {
        feedbackElement.innerHTML = `❌ Respuesta incorrecta. El resultado es 85. <br>
            Cálculo paso a paso:<br>
            1. Σ(2i² - 3i + 4) = 2Σ(i²) - 3Σ(i) + Σ(4)<br>
            2. Σ(i²) de 1 a 5 = 55, Σ(i) de 1 a 5 = 15, Σ(4) = 20<br>
            3. 2(55) - 3(15) + 20 = 110 - 45 + 20 = 85`;
    }
}

// Función para verificar cálculo avanzado de Session 4
function checkAdvancedSum() {
    const input = document.getElementById('exercise4_3-input');
    const userAnswer = input?.value.trim();
    const feedbackElement = document.getElementById('feedback-exercise4_3');

    if (!userAnswer || !feedbackElement) return;

    // Respuesta correcta: Σ(3i² - 2i + 1) de 1 a 5
    // Σ(3i²) = 3(55) = 165, Σ(2i) = 2(15) = 30, Σ(1) = 5
    // Resultado: 165 - 30 + 5 = 140
    const correctAnswer = '140';
    const isCorrect = userAnswer === correctAnswer;

    feedbackElement.classList.remove('hidden');
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Correcto! Excelente dominio de las propiedades.';
        input.disabled = true;
        input.style.backgroundColor = 'var(--light-emerald)';
    } else {
        feedbackElement.innerHTML = `❌ Respuesta incorrecta. El resultado es 140. <br>
            Cálculo paso a paso:<br>
            1. Σ(3i² - 2i + 1) = 3Σ(i²) - 2Σ(i) + Σ(1)<br>
            2. Σ(i²) de 1 a 5 = 55, Σ(i) de 1 a 5 = 15, Σ(1) = 5<br>
            3. 3(55) - 2(15) + 5 = 165 - 30 + 5 = 140`;
    }
}

// Función para verificar suma de Riemann de Session 5
function checkRiemannSum() {
    const input = document.getElementById('exercise5_3-input');
    const userAnswer = input?.value.trim();
    const feedbackElement = document.getElementById('feedback-exercise5_3');

    if (!userAnswer || !feedbackElement) return;

    // Respuesta correcta: Suma de Riemann para f(x) = x + 1 de 0 a 2 con n=4 usando puntos derechos
    // Δx = 0.5, puntos: 0.5, 1.0, 1.5, 2.0
    // f(0.5)=1.5, f(1.0)=2.0, f(1.5)=2.5, f(2.0)=3.0
    // Suma: 1.5 + 2.0 + 2.5 + 3.0 = 9.0
    const correctAnswer = '9';
    const isCorrect = userAnswer === correctAnswer;

    feedbackElement.classList.remove('hidden');
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ ¡Correcto! Excelente aplicación de sumas de Riemann.';
        input.disabled = true;
        input.style.backgroundColor = 'var(--light-emerald)';
    } else {
        feedbackElement.innerHTML = `❌ Respuesta incorrecta. El resultado es 9. <br>
            Cálculo de Riemann:<br>
            1. Δx = (2-0)/4 = 0.5<br>
            2. Puntos derechos: 0.5, 1.0, 1.5, 2.0<br>
            3. f(0.5) = 1.5, f(1.0) = 2.0, f(1.5) = 2.5, f(2.0) = 3.0<br>
            4. Suma: 1.5 + 2.0 + 2.5 + 3.0 = 9`;
    }
}

// Función para mostrar pistas
function showHint(exerciseId) {
    const hintElement = document.getElementById(`hint-${exerciseId}`);

    if (hintElement) {
        hintElement.classList.toggle('hidden');

        switch(exerciseId) {
            case 'exercise2':
                hintElement.innerHTML = '💡 Pista: La suma es 5 + 5 + 5 + 5 (cuatro veces). El formato es ∑ (índice desde 1 hasta 4) de 5';
                break;
            case 'exercise2_4':
                hintElement.innerHTML = '💡 Pista: Aplica las propiedades paso a paso:<br>1. Separa: Σ(2i + 3) = Σ(2i) + Σ(3)<br>2. Factor: 2Σ(i) + 3Σ(1)<br>3. Calcula: 2(1+2+3) + 3(1+1+1) = 2(6) + 3(3) = 12 + 9 = 21';
                break;
            case 'exercise3_3':
                hintElement.innerHTML = '💡 Pista: Usa la linealidad y factorización:<br>1. Σ(2i² - 3i + 4) = 2Σ(i²) - 3Σ(i) + Σ(4)<br>2. Σ(i²) de 1 a 5 = 55<br>3. Σ(i) de 1 a 5 = 15<br>4. Σ(4) = 4+4+4+4+4 = 20<br>5. 2(55) - 3(15) + 20 = 110 - 45 + 20 = 85';
                break;
            case 'exercise4_3':
                hintElement.innerHTML = '💡 Pista: Aplica propiedades paso a paso:<br>1. Σ(3i² - 2i + 1) = 3Σ(i²) - 2Σ(i) + Σ(1)<br>2. Σ(i²) de 1 a 5 = 55, Σ(i) de 1 a 5 = 15, Σ(1) = 5<br>3. 3(55) - 2(15) + 5 = 165 - 30 + 5 = 140';
                break;
            case 'exercise5_3':
                hintElement.innerHTML = '💡 Pista: Suma de Riemann con puntos derechos:<br>1. Δx = (2-0)/4 = 0.5<br>2. Puntos: 0.5, 1.0, 1.5, 2.0<br>3. f(0.5) = 1.5, f(1.0) = 2.0, f(1.5) = 2.5, f(2.0) = 3.0<br>4. Suma: 1.5×0.5 + 2.0×0.5 + 2.5×0.5 + 3.0×0.5 = 0.75 + 1.0 + 1.25 + 1.5 = 4.5';
                break;
            case 'exercise6_1':
                hintElement.innerHTML = '💡 Pista: Rectángulos inscritos con f(x) = x + 1:<br>1. Δx = (2-0)/4 = 0.5<br>2. Puntos izquierdos: 0.0, 0.5, 1.0, 1.5<br>3. f(0.0) = 1.0, f(0.5) = 1.5, f(1.0) = 2.0, f(1.5) = 2.5<br>4. Área: 1.0×0.5 + 1.5×0.5 + 2.0×0.5 + 2.5×0.5 = 0.5 + 0.75 + 1.0 + 1.25 = 3.5';
                break;
            case 'exercise6_2':
                hintElement.innerHTML = '💡 Pista: Los rectángulos inscritos siempre quedan por debajo de la función cuando esta es creciente. Esto significa que siempre subestiman el área real bajo la curva.';
                break;
            case 'exercise6_3':
                hintElement.innerHTML = '💡 Pista: Suma inferior con f(x) = 2x + 1:<br>1. Δx = (3-1)/4 = 0.5<br>2. Puntos izquierdos: 1.0, 1.5, 2.0, 2.5<br>3. f(1.0) = 3, f(1.5) = 4, f(2.0) = 5, f(2.5) = 6<br>4. Suma: 3×0.5 + 4×0.5 + 5×0.5 + 6×0.5 = 1.5 + 2.0 + 2.5 + 3.0 = 9';
                break;
            default:
                hintElement.innerHTML = '💡 Revisa la notación sigma básica: ∑ (desde valor inicial hasta valor final) de expresión';
        }
    }
}

// ========================================
// INICIALIZACIÓN FINAL
// ========================================

// Funciones globales para uso en HTML
window.checkAnswer = checkAnswer;
window.checkSigmaAnswer = checkSigmaAnswer;
window.checkSigmaCalculation = checkSigmaCalculation;
window.checkSigmaCalculation3 = checkSigmaCalculation3;
window.checkAdvancedSum = checkAdvancedSum;
window.checkRiemannSum = checkRiemannSum;
window.checkInscribedSum = checkInscribedSum;
window.updateRiemannVisualization = updateRiemannVisualization;
window.updateInscribedVisualization = updateInscribedVisualization;
window.showHint = showHint;
