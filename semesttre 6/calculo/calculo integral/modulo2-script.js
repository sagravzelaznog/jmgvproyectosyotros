// Módulo 2: Sumas de Riemann y la Integral Definida - JavaScript
// Funcionalidades interactivas y cálculos matemáticos

// Variables globales
let currentFunction = 'x^2';
let currentInterval = [0, 2];
let currentRectangles = 10;
let currentRiemannType = 'left';
let geogebraApp = null;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeModule();
    setupEventListeners();
    initializeVisualizations();
    updateProgress();
});

// Inicialización del módulo
function initializeModule() {
    console.log('Inicializando Módulo 2: Sumas de Riemann y la Integral Definida');
    
    // Configurar navegación de pestañas
    setupTabNavigation();
    
    // Inicializar visualizaciones de canvas
    initializeCanvasVisualizations();
    
    // Configurar GeoGebra
    initializeGeoGebra();
    
    // Configurar calculadora interactiva
    setupInteractiveCalculator();
}

// Configurar navegación de pestañas
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remover clase active de todas las pestañas y secciones
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Agregar clase active a la pestaña y sección seleccionadas
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            // Actualizar progreso
            updateProgress();
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Controles de visualización interactiva
    const functionSelect = document.getElementById('functionSelect');
    const intervalA = document.getElementById('intervalA');
    const intervalB = document.getElementById('intervalB');
    const numRectangles = document.getElementById('numRectangles');
    const riemannType = document.getElementById('riemannType');
    
    if (functionSelect) {
        functionSelect.addEventListener('change', updateVisualization);
    }
    
    if (intervalA) {
        intervalA.addEventListener('input', updateVisualization);
    }
    
    if (intervalB) {
        intervalB.addEventListener('input', updateVisualization);
    }
    
    if (numRectangles) {
        numRectangles.addEventListener('input', function() {
            document.getElementById('numRectanglesValue').textContent = this.value;
            updateVisualization();
        });
    }
    
    if (riemannType) {
        riemannType.addEventListener('change', updateVisualization);
    }
}

// Inicializar visualizaciones de canvas
function initializeCanvasVisualizations() {
    drawAreaProblem();
    drawRiemannVisualizations();
}

// Dibujar el problema del área
function drawAreaProblem() {
    const canvas = document.getElementById('areaProblemCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar coordenadas
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Dibujar ejes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Dibujar función y = x^2
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x <= 2; x += 0.01) {
        const y = x * x;
        const pixelX = padding + (x / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        
        if (x === 0) {
            ctx.moveTo(pixelX, pixelY);
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }
    ctx.stroke();
    
    // Dibujar área sombreada
    ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    for (let x = 0; x <= 2; x += 0.01) {
        const y = x * x;
        const pixelX = padding + (x / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        ctx.lineTo(pixelX, pixelY);
    }
    
    ctx.lineTo(padding + graphWidth, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Etiquetas
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter';
    ctx.fillText('0', padding - 10, height - padding + 20);
    ctx.fillText('1', padding + graphWidth/2 - 5, height - padding + 20);
    ctx.fillText('2', padding + graphWidth - 10, height - padding + 20);
    ctx.fillText('y = x²', padding + graphWidth/2, padding + 20);
}

// Dibujar visualizaciones de Riemann
function drawRiemannVisualizations() {
    drawLeftRiemann();
    drawRightRiemann();
    drawMidpointRiemann();
}

// Dibujar suma por la izquierda
function drawLeftRiemann() {
    const canvas = document.getElementById('leftRiemannCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 20;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Dibujar ejes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Dibujar función y = x^2
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x <= 2; x += 0.01) {
        const y = x * x;
        const pixelX = padding + (x / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        
        if (x === 0) {
            ctx.moveTo(pixelX, pixelY);
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }
    ctx.stroke();
    
    // Dibujar rectángulos (suma por la izquierda)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    
    const n = 4;
    const deltaX = 2 / n;
    
    for (let i = 0; i < n; i++) {
        const x = i * deltaX;
        const y = x * x;
        const pixelX = padding + (x / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        const rectWidth = (deltaX / 2) * graphWidth;
        
        ctx.fillRect(pixelX, pixelY, rectWidth, height - padding - pixelY);
        ctx.strokeRect(pixelX, pixelY, rectWidth, height - padding - pixelY);
    }
}

// Dibujar suma por la derecha
function drawRightRiemann() {
    const canvas = document.getElementById('rightRiemannCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 20;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Dibujar ejes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Dibujar función y = x^2
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x <= 2; x += 0.01) {
        const y = x * x;
        const pixelX = padding + (x / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        
        if (x === 0) {
            ctx.moveTo(pixelX, pixelY);
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }
    ctx.stroke();
    
    // Dibujar rectángulos (suma por la derecha)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    
    const n = 4;
    const deltaX = 2 / n;
    
    for (let i = 0; i < n; i++) {
        const x = (i + 1) * deltaX;
        const y = x * x;
        const pixelX = padding + ((x - deltaX) / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        const rectWidth = (deltaX / 2) * graphWidth;
        
        ctx.fillRect(pixelX, pixelY, rectWidth, height - padding - pixelY);
        ctx.strokeRect(pixelX, pixelY, rectWidth, height - padding - pixelY);
    }
}

// Dibujar suma por el punto medio
function drawMidpointRiemann() {
    const canvas = document.getElementById('midpointRiemannCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 20;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Dibujar ejes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Dibujar función y = x^2
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x <= 2; x += 0.01) {
        const y = x * x;
        const pixelX = padding + (x / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        
        if (x === 0) {
            ctx.moveTo(pixelX, pixelY);
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }
    ctx.stroke();
    
    // Dibujar rectángulos (suma por el punto medio)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    
    const n = 4;
    const deltaX = 2 / n;
    
    for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * deltaX;
        const y = x * x;
        const pixelX = padding + ((i * deltaX) / 2) * graphWidth;
        const pixelY = height - padding - (y / 4) * graphHeight;
        const rectWidth = (deltaX / 2) * graphWidth;
        
        ctx.fillRect(pixelX, pixelY, rectWidth, height - padding - pixelY);
        ctx.strokeRect(pixelX, pixelY, rectWidth, height - padding - pixelY);
    }
}

// Inicializar GeoGebra
function initializeGeoGebra() {
    const container = document.getElementById('geogebra-container');
    if (!container) return;
    
    const parameters = {
        "appName": "graphing",
        "width": container.offsetWidth,
        "height": 400,
        "showToolBar": false,
        "showAlgebraView": false,
        "showMenuBar": false,
        "showResetIcon": true,
        "enableLabelDrags": false,
        "enableShiftDragZoom": true,
        "enableRightClick": false,
        "errorDialogsActive": false,
        "useBrowserForJS": false,
        "allowStyleBar": false,
        "preventFocus": false,
        "showZoomButtons": true,
        "showFullscreenButton": true,
        "showSuggestionButtons": false,
        "showAnimationButton": false,
        "captureThreshold": 3,
        "appletOnLoad": function(api) {
            geogebraApp = api;
            updateGeoGebraVisualization();
        }
    };
    
    geogebraApp = new GGBApplet(parameters, true);
    geogebraApp.inject(container);
}

// Actualizar visualización de GeoGebra
function updateGeoGebraVisualization() {
    if (!geogebraApp) return;
    
    const a = parseFloat(document.getElementById('intervalA').value);
    const b = parseFloat(document.getElementById('intervalB').value);
    const n = parseInt(document.getElementById('numRectangles').value);
    const functionType = document.getElementById('functionSelect').value;
    const riemannType = document.getElementById('riemannType').value;
    
    // Definir función
    let functionStr = '';
    switch(functionType) {
        case 'x^2':
            functionStr = 'x^2';
            break;
        case 'x^3':
            functionStr = 'x^3';
            break;
        case 'sin(x)':
            functionStr = 'sin(x)';
            break;
        case 'exp(x)':
            functionStr = 'exp(x)';
            break;
    }
    
    // Crear comandos GeoGebra
    const commands = [
        `f(x) = ${functionStr}`,
        `a = ${a}`,
        `b = ${b}`,
        `n = ${n}`,
        `dx = (b - a) / n`,
        `SumaRiemann(f, a, b, n, ${riemannType === 'left' ? 0 : riemannType === 'right' ? 1 : 0.5})`
    ];
    
    commands.forEach(cmd => {
        geogebraApp.evalCommand(cmd);
    });
    
    // Actualizar resultados
    updateCalculationResults();
}

// Actualizar resultados de cálculo
function updateCalculationResults() {
    const a = parseFloat(document.getElementById('intervalA').value);
    const b = parseFloat(document.getElementById('intervalB').value);
    const n = parseInt(document.getElementById('numRectangles').value);
    const functionType = document.getElementById('functionSelect').value;
    const riemannType = document.getElementById('riemannType').value;
    
    // Calcular suma de Riemann
    const riemannSum = calculateRiemannSum(functionType, a, b, n, riemannType);
    
    // Calcular valor exacto
    const exactValue = calculateExactIntegral(functionType, a, b);
    
    // Calcular error
    const error = Math.abs(riemannSum - exactValue);
    
    // Actualizar UI
    document.getElementById('riemannSum').textContent = riemannSum.toFixed(4);
    document.getElementById('exactValue').textContent = exactValue.toFixed(4);
    document.getElementById('errorValue').textContent = error.toFixed(4);
}

// Calcular suma de Riemann
function calculateRiemannSum(functionType, a, b, n, riemannType) {
    const deltaX = (b - a) / n;
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
        let x;
        switch(riemannType) {
            case 'left':
                x = a + i * deltaX;
                break;
            case 'right':
                x = a + (i + 1) * deltaX;
                break;
            case 'midpoint':
                x = a + (i + 0.5) * deltaX;
                break;
        }
        
        const y = evaluateFunction(functionType, x);
        sum += y * deltaX;
    }
    
    return sum;
}

// Evaluar función
function evaluateFunction(functionType, x) {
    switch(functionType) {
        case 'x^2':
            return x * x;
        case 'x^3':
            return x * x * x;
        case 'sin(x)':
            return Math.sin(x);
        case 'exp(x)':
            return Math.exp(x);
        default:
            return 0;
    }
}

// Calcular integral exacta
function calculateExactIntegral(functionType, a, b) {
    switch(functionType) {
        case 'x^2':
            return (b * b * b / 3) - (a * a * a / 3);
        case 'x^3':
            return (b * b * b * b / 4) - (a * a * a * a / 4);
        case 'sin(x)':
            return -Math.cos(b) + Math.cos(a);
        case 'exp(x)':
            return Math.exp(b) - Math.exp(a);
        default:
            return 0;
    }
}

// Actualizar visualización
function updateVisualization() {
    updateGeoGebraVisualization();
    updateCalculationResults();
}

// Configurar calculadora interactiva
function setupInteractiveCalculator() {
    const calculateBtn = document.querySelector('.calculator-input button');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateIntegral);
    }
}

// Calcular integral definida
function calculateIntegral() {
    const functionStr = document.getElementById('integralFunction').value;
    const lower = parseFloat(document.getElementById('integralLower').value);
    const upper = parseFloat(document.getElementById('integralUpper').value);
    
    try {
        // Encontrar antiderivada
        const antiderivative = findAntiderivative(functionStr);
        
        // Evaluar integral
        const result = evaluateAntiderivative(antiderivative, upper) - 
                      evaluateAntiderivative(antiderivative, lower);
        
        // Actualizar UI
        document.getElementById('integralResult').textContent = result.toFixed(4);
        document.getElementById('antiderivative').textContent = antiderivative;
        
    } catch (error) {
        document.getElementById('integralResult').textContent = 'Error';
        document.getElementById('antiderivative').textContent = 'No disponible';
        console.error('Error calculando integral:', error);
    }
}

// Encontrar antiderivada
function findAntiderivative(functionStr) {
    // Simplificación básica para funciones comunes
    if (functionStr.includes('x^2')) {
        return 'x^3/3';
    } else if (functionStr.includes('x^3')) {
        return 'x^4/4';
    } else if (functionStr.includes('x')) {
        return 'x^2/2';
    } else if (functionStr.includes('sin')) {
        return '-cos(x)';
    } else if (functionStr.includes('cos')) {
        return 'sin(x)';
    } else if (functionStr.includes('exp') || functionStr.includes('e^x')) {
        return 'exp(x)';
    }
    
    return 'No disponible';
}

// Evaluar antiderivada
function evaluateAntiderivative(antiderivative, x) {
    // Evaluación básica para funciones comunes
    if (antiderivative.includes('x^3/3')) {
        return (x * x * x) / 3;
    } else if (antiderivative.includes('x^4/4')) {
        return (x * x * x * x) / 4;
    } else if (antiderivative.includes('x^2/2')) {
        return (x * x) / 2;
    } else if (antiderivative.includes('-cos')) {
        return -Math.cos(x);
    } else if (antiderivative.includes('sin')) {
        return Math.sin(x);
    } else if (antiderivative.includes('exp')) {
        return Math.exp(x);
    }
    
    return 0;
}

// Alternar solución de ejercicios
function toggleSolution(button) {
    const solution = button.previousElementSibling;
    if (solution.style.display === 'none') {
        solution.style.display = 'block';
        button.textContent = 'Ocultar Solución';
    } else {
        solution.style.display = 'none';
        button.textContent = 'Ver Solución';
    }
}

// Actualizar progreso del módulo
function updateProgress() {
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    const sectionId = activeSection.id;
    let progress = 0;
    
    switch(sectionId) {
        case 'sumas-riemann':
            progress = 25;
            break;
        case 'integral-definida':
            progress = 50;
            break;
        case 'teorema-fundamental':
            progress = 75;
            break;
        case 'ejercicios':
            progress = 100;
            break;
    }
    
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressFill && progressPercentage) {
        progressFill.style.width = progress + '%';
        progressPercentage.textContent = progress + '%';
    }
}

// Funciones de utilidad matemática
const MathUtils = {
    // Calcular factorial
    factorial: function(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    },
    
    // Calcular combinaciones
    combination: function(n, k) {
        return this.factorial(n) / (this.factorial(k) * this.factorial(n - k));
    },
    
    // Derivar función polinómica
    derivative: function(coeffs) {
        return coeffs.slice(1).map((coeff, index) => coeff * (index + 1));
    },
    
    // Integrar función polinómica
    integrate: function(coeffs) {
        return [0, ...coeffs.map((coeff, index) => coeff / (index + 1))];
    }
};

// Exportar funciones para uso global
window.toggleSolution = toggleSolution;
window.calculateIntegral = calculateIntegral;
window.updateVisualization = updateVisualization;
