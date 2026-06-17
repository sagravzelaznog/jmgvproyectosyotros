// JavaScript Interactivo para Módulo 5: Ecuaciones Diferenciales
// Funcionalidades avanzadas para visualización y cálculo

class EcuacionesDiferenciales {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupVisualizations();
    }

    init() {
        console.log('Módulo 5: Ecuaciones Diferenciales - Inicializado');
        this.setupMathJax();
        this.createCalculadora();
        this.createSimuladorCampos();
    }

    setupMathJax() {
        // Configurar MathJax para renderizado dinámico
        if (window.MathJax) {
            window.MathJax.startup.document.state(0);
        }
    }

    setupEventListeners() {
        // Event listeners para interactividad
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSolutionToggles();
            this.setupProgressTracker();
            this.setupInteractiveElements();
        });
    }

    setupSolutionToggles() {
        // Mejorar funcionalidad de mostrar/ocultar soluciones
        document.querySelectorAll('.solution-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                const solutionId = e.target.getAttribute('onclick')?.match(/toggleSolution\('(.*)'\)/)?.[1];
                if (solutionId) {
                    this.toggleSolution(solutionId, e.target);
                }
            });
        });
    }

    toggleSolution(id, button) {
        const solution = document.getElementById(id);
        const exerciseNumber = id.replace('sol', '');
        
        if (solution.style.display === 'none' || solution.style.display === '') {
            solution.style.display = 'block';
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Solución';
            button.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
            
            // Marcar ejercicio como completado
            this.markExerciseCompleted(exerciseNumber);
            this.updateProgress();
            
            // Animación de entrada
            solution.style.opacity = '0';
            solution.style.transform = 'translateY(20px)';
            solution.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                solution.style.opacity = '1';
                solution.style.transform = 'translateY(0)';
            }, 100);
        } else {
            solution.style.display = 'none';
            button.innerHTML = '<i class="fas fa-eye"></i> Ver Solución';
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }

    markExerciseCompleted(exerciseNumber) {
        const checkItem = document.querySelector(`[data-exercise="${exerciseNumber}"]`);
        if (checkItem && !checkItem.classList.contains('completed')) {
            checkItem.classList.add('completed');
            
            // Animación de celebración
            checkItem.style.transform = 'scale(1.2)';
            checkItem.style.background = '#28a745';
            checkItem.style.color = 'white';
            
            setTimeout(() => {
                checkItem.style.transform = 'scale(1)';
            }, 300);
        }
    }

    updateProgress() {
        const completed = document.querySelectorAll('.check-item.completed').length;
        const total = document.querySelectorAll('.check-item').length;
        const percentage = (completed / total) * 100;
        
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }

        // Mostrar mensaje de progreso
        if (percentage === 100) {
            this.showCompletionMessage();
        } else if (percentage > 0) {
            this.showProgressMessage(percentage);
        }
    }

    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'alert alert-success';
        message.innerHTML = `
            <h4><i class="fas fa-trophy"></i> ¡Felicitaciones!</h4>
            <p>Has completado todos los ejercicios del Módulo 5. ¡Excelente trabajo!</p>
        `;
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.zIndex = '1000';
        message.style.maxWidth = '300px';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    showProgressMessage(percentage) {
        const message = document.createElement('div');
        message.className = 'alert alert-info';
        message.innerHTML = `
            <i class="fas fa-chart-line"></i> 
            Progreso: ${Math.round(percentage)}% completado
        `;
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.zIndex = '1000';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    setupProgressTracker() {
        // Funcionalidad del tracker de progreso
        document.querySelectorAll('.check-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.target.classList.toggle('completed');
                this.updateProgress();
            });
        });
    }

    setupInteractiveElements() {
        // Configurar elementos interactivos
        this.setupAnimatedCards();
        this.setupHoverEffects();
        this.setupScrollAnimations();
    }

    setupAnimatedCards() {
        // Animación de entrada para las tarjetas
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.exercise-card, .content-section').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    setupHoverEffects() {
        // Efectos hover mejorados
        document.querySelectorAll('.exercise-card, .example-box').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-5px)';
                element.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
                element.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
        });
    }

    setupScrollAnimations() {
        // Animaciones basadas en scroll
        let ticking = false;
        
        function updateAnimations() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.module-header');
            
            parallax.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }

    createCalculadora() {
        // Crear calculadora de ecuaciones diferenciales
        const calculadoraHTML = `
            <div class="calculadora-ed" style="background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #667eea; margin-bottom: 20px;">
                    <i class="fas fa-calculator"></i> Calculadora de Ecuaciones Diferenciales
                </h3>
                
                <div class="calculadora-input">
                    <label for="ecuacion-input">Ecuación diferencial:</label>
                    <input type="text" id="ecuacion-input" placeholder="Ej: dy/dx = x^2 + y" 
                           style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #dee2e6; border-radius: 5px;">
                    
                    <label for="tipo-ed">Tipo de ecuación:</label>
                    <select id="tipo-ed" style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #dee2e6; border-radius: 5px;">
                        <option value="variables-separables">Variables Separables</option>
                        <option value="homogenea">Homogénea</option>
                        <option value="exacta">Exacta</option>
                        <option value="lineal">Lineal</option>
                    </select>
                    
                    <button onclick="calculadoraED.resolver()" 
                            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; margin: 10px 0;">
                        <i class="fas fa-play"></i> Resolver
                    </button>
                </div>
                
                <div id="resultado-calculadora" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; display: none;">
                    <h4>Resultado:</h4>
                    <div id="solucion-display"></div>
                </div>
            </div>
        `;
        
        // Insertar calculadora en el primer content-section
        const firstSection = document.querySelector('.content-section');
        if (firstSection) {
            firstSection.insertAdjacentHTML('afterend', calculadoraHTML);
        }
    }

    resolver() {
        const ecuacion = document.getElementById('ecuacion-input').value;
        const tipo = document.getElementById('tipo-ed').value;
        const resultado = document.getElementById('resultado-calculadora');
        const solucion = document.getElementById('solucion-display');
        
        if (!ecuacion) {
            this.mostrarError('Por favor, ingresa una ecuación diferencial.');
            return;
        }
        
        resultado.style.display = 'block';
        
        // Simular resolución (en una implementación real, usarías una librería como SymPy.js)
        const solucionTexto = this.simularResolucion(ecuacion, tipo);
        solucion.innerHTML = solucionTexto;
        
        // Re-renderizar MathJax
        if (window.MathJax) {
            window.MathJax.typesetPromise([solucion]);
        }
    }

    simularResolucion(ecuacion, tipo) {
        // Simulación de resolución (reemplazar con lógica real)
        const ejemplos = {
            'variables-separables': `
                <h5>Ecuación de Variables Separables</h5>
                <p><strong>Ecuación:</strong> $${ecuacion}$</p>
                <div class="step">
                    <span class="step-number">1</span>
                    <strong>Separar variables:</strong>
                    <p>$$\\frac{dy}{dx} = f(x)g(y)$$</p>
                    <p>$$\\frac{dy}{g(y)} = f(x) dx$$</p>
                </div>
                <div class="step">
                    <span class="step-number">2</span>
                    <strong>Integrar:</strong>
                    <p>$$\\int \\frac{dy}{g(y)} = \\int f(x) dx$$</p>
                </div>
                <div class="step">
                    <span class="step-number">3</span>
                    <strong>Solución:</strong>
                    <p>$$G(y) = F(x) + C$$</p>
                </div>
            `,
            'homogenea': `
                <h5>Ecuación Homogénea</h5>
                <p><strong>Ecuación:</strong> $${ecuacion}$</p>
                <div class="step">
                    <span class="step-number">1</span>
                    <strong>Sustitución:</strong>
                    <p>$y = vx$ donde $v$ es función de $x$</p>
                </div>
                <div class="step">
                    <span class="step-number">2</span>
                    <strong>Resolver para v:</strong>
                    <p>$$\\frac{dv}{dx} = f(v) - v$$</p>
                </div>
            `,
            'exacta': `
                <h5>Ecuación Exacta</h5>
                <p><strong>Ecuación:</strong> $${ecuacion}$</p>
                <div class="step">
                    <span class="step-number">1</span>
                    <strong>Verificar exactitud:</strong>
                    <p>$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$</p>
                </div>
                <div class="step">
                    <span class="step-number">2</span>
                    <strong>Encontrar función potencial:</strong>
                    <p>$F(x,y) = \\int M dx + g(y)$</p>
                </div>
            `,
            'lineal': `
                <h5>Ecuación Lineal</h5>
                <p><strong>Ecuación:</strong> $${ecuacion}$</p>
                <div class="step">
                    <span class="step-number">1</span>
                    <strong>Factor integrante:</strong>
                    <p>$$\\mu(x) = e^{\\int P(x) dx}$$</p>
                </div>
                <div class="step">
                    <span class="step-number">2</span>
                    <strong>Solución:</strong>
                    <p>$$y = \\frac{1}{\\mu(x)} \\int \\mu(x) Q(x) dx + C$$</p>
                </div>
            `
        };
        
        return ejemplos[tipo] || '<p>No se pudo resolver la ecuación.</p>';
    }

    mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensaje}`;
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.right = '20px';
        errorDiv.style.zIndex = '1000';
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    setupVisualizations() {
        // Configurar visualizaciones interactivas
        this.createFieldVisualizer();
        this.createSolutionPlotter();
    }

    createFieldVisualizer() {
        // Crear visualizador de campos direccionales
        const visualizadorHTML = `
            <div class="visualizador-campos" style="background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #667eea; margin-bottom: 20px;">
                    <i class="fas fa-chart-area"></i> Visualizador de Campos Direccionales
                </h3>
                
                <div class="campo-input">
                    <label for="campo-funcion">Función f(x,y):</label>
                    <input type="text" id="campo-funcion" placeholder="Ej: x + y" 
                           style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #dee2e6; border-radius: 5px;">
                    
                    <div style="display: flex; gap: 10px; margin: 10px 0;">
                        <div style="flex: 1;">
                            <label for="campo-x-min">X mínimo:</label>
                            <input type="number" id="campo-x-min" value="-5" 
                                   style="width: 100%; padding: 8px; border: 1px solid #dee2e6; border-radius: 5px;">
                        </div>
                        <div style="flex: 1;">
                            <label for="campo-x-max">X máximo:</label>
                            <input type="number" id="campo-x-max" value="5" 
                                   style="width: 100%; padding: 8px; border: 1px solid #dee2e6; border-radius: 5px;">
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin: 10px 0;">
                        <div style="flex: 1;">
                            <label for="campo-y-min">Y mínimo:</label>
                            <input type="number" id="campo-y-min" value="-5" 
                                   style="width: 100%; padding: 8px; border: 1px solid #dee2e6; border-radius: 5px;">
                        </div>
                        <div style="flex: 1;">
                            <label for="campo-y-max">Y máximo:</label>
                            <input type="number" id="campo-y-max" value="5" 
                                   style="width: 100%; padding: 8px; border: 1px solid #dee2e6; border-radius: 5px;">
                        </div>
                    </div>
                    
                    <button onclick="calculadoraED.dibujarCampo()" 
                            style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; margin: 10px 0;">
                        <i class="fas fa-draw-polygon"></i> Dibujar Campo
                    </button>
                </div>
                
                <div id="campo-canvas-container" style="margin-top: 20px; text-align: center;">
                    <canvas id="campo-canvas" width="600" height="400" 
                            style="border: 1px solid #dee2e6; border-radius: 8px; background: white;"></canvas>
                </div>
            </div>
        `;
        
        // Insertar visualizador
        const sections = document.querySelectorAll('.content-section');
        if (sections.length > 1) {
            sections[1].insertAdjacentHTML('afterend', visualizadorHTML);
        }
    }

    dibujarCampo() {
        const canvas = document.getElementById('campo-canvas');
        const ctx = canvas.getContext('2d');
        
        if (!canvas) return;
        
        const funcion = document.getElementById('campo-funcion').value;
        const xMin = parseFloat(document.getElementById('campo-x-min').value);
        const xMax = parseFloat(document.getElementById('campo-x-max').value);
        const yMin = parseFloat(document.getElementById('campo-y-min').value);
        const yMax = parseFloat(document.getElementById('campo-y-max').value);
        
        if (!funcion) {
            this.mostrarError('Por favor, ingresa una función.');
            return;
        }
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurar escalas
        const scaleX = canvas.width / (xMax - xMin);
        const scaleY = canvas.height / (yMax - yMin);
        
        // Dibujar ejes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        
        // Eje X
        const yZero = canvas.height - (-yMin * scaleY);
        if (yZero >= 0 && yZero <= canvas.height) {
            ctx.beginPath();
            ctx.moveTo(0, yZero);
            ctx.lineTo(canvas.width, yZero);
            ctx.stroke();
        }
        
        // Eje Y
        const xZero = -xMin * scaleX;
        if (xZero >= 0 && xZero <= canvas.width) {
            ctx.beginPath();
            ctx.moveTo(xZero, 0);
            ctx.lineTo(xZero, canvas.height);
            ctx.stroke();
        }
        
        // Dibujar campo direccional
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 1;
        
        const step = 0.5;
        for (let x = xMin; x <= xMax; x += step) {
            for (let y = yMin; y <= yMax; y += step) {
                try {
                    // Evaluar función (simplificado)
                    const pendiente = this.evaluarFuncion(funcion, x, y);
                    
                    // Calcular posición en canvas
                    const canvasX = (x - xMin) * scaleX;
                    const canvasY = canvas.height - (y - yMin) * scaleY;
                    
                    // Dibujar línea de pendiente
                    const length = 0.2;
                    const dx = length / Math.sqrt(1 + pendiente * pendiente);
                    const dy = pendiente * dx;
                    
                    ctx.beginPath();
                    ctx.moveTo(canvasX - dx, canvasY - dy);
                    ctx.lineTo(canvasX + dx, canvasY + dy);
                    ctx.stroke();
                } catch (e) {
                    // Ignorar errores de evaluación
                }
            }
        }
    }

    evaluarFuncion(funcion, x, y) {
        // Evaluación simplificada de funciones
        // En una implementación real, usarías una librería como math.js
        try {
            // Reemplazar variables
            let expr = funcion.replace(/x/g, x).replace(/y/g, y);
            
            // Evaluar expresiones básicas
            if (expr.includes('+')) {
                const parts = expr.split('+');
                return parseFloat(parts[0]) + parseFloat(parts[1]);
            } else if (expr.includes('-')) {
                const parts = expr.split('-');
                return parseFloat(parts[0]) - parseFloat(parts[1]);
            } else if (expr.includes('*')) {
                const parts = expr.split('*');
                return parseFloat(parts[0]) * parseFloat(parts[1]);
            } else {
                return parseFloat(expr);
            }
        } catch (e) {
            return 0;
        }
    }

    createSolutionPlotter() {
        // Crear graficador de soluciones
        const plotterHTML = `
            <div class="graficador-soluciones" style="background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #667eea; margin-bottom: 20px;">
                    <i class="fas fa-chart-line"></i> Graficador de Soluciones
                </h3>
                
                <div class="plotter-input">
                    <label for="solucion-funcion">Solución y(x):</label>
                    <input type="text" id="solucion-funcion" placeholder="Ej: x^2 + C" 
                           style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #dee2e6; border-radius: 5px;">
                    
                    <div style="display: flex; gap: 10px; margin: 10px 0;">
                        <div style="flex: 1;">
                            <label for="sol-x-min">X mínimo:</label>
                            <input type="number" id="sol-x-min" value="-5" 
                                   style="width: 100%; padding: 8px; border: 1px solid #dee2e6; border-radius: 5px;">
                        </div>
                        <div style="flex: 1;">
                            <label for="sol-x-max">X máximo:</label>
                            <input type="number" id="sol-x-max" value="5" 
                                   style="width: 100%; padding: 8px; border: 1px solid #dee2e6; border-radius: 5px;">
                        </div>
                    </div>
                    
                    <button onclick="calculadoraED.dibujarSolucion()" 
                            style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; margin: 10px 0;">
                        <i class="fas fa-chart-line"></i> Graficar Solución
                    </button>
                </div>
                
                <div id="solucion-canvas-container" style="margin-top: 20px; text-align: center;">
                    <canvas id="solucion-canvas" width="600" height="400" 
                            style="border: 1px solid #dee2e6; border-radius: 8px; background: white;"></canvas>
                </div>
            </div>
        `;
        
        // Insertar graficador
        const sections = document.querySelectorAll('.content-section');
        if (sections.length > 2) {
            sections[2].insertAdjacentHTML('afterend', plotterHTML);
        }
    }

    dibujarSolucion() {
        const canvas = document.getElementById('solucion-canvas');
        const ctx = canvas.getContext('2d');
        
        if (!canvas) return;
        
        const funcion = document.getElementById('solucion-funcion').value;
        const xMin = parseFloat(document.getElementById('sol-x-min').value);
        const xMax = parseFloat(document.getElementById('sol-x-max').value);
        
        if (!funcion) {
            this.mostrarError('Por favor, ingresa una función solución.');
            return;
        }
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurar escalas
        const scaleX = canvas.width / (xMax - xMin);
        
        // Dibujar ejes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        
        // Eje X
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        
        // Eje Y
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        
        // Dibujar función (simplificado)
        ctx.strokeStyle = '#dc3545';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let firstPoint = true;
        for (let x = xMin; x <= xMax; x += 0.1) {
            try {
                const y = this.evaluarFuncion(funcion, x, 0); // Asumiendo función de x
                
                const canvasX = (x - xMin) * scaleX;
                const canvasY = canvas.height / 2 - y * 20; // Escala Y simplificada
                
                if (firstPoint) {
                    ctx.moveTo(canvasX, canvasY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            } catch (e) {
                // Ignorar errores
            }
        }
        
        ctx.stroke();
    }

    // Métodos de utilidad
    formatEquation(equation) {
        // Formatear ecuación para MathJax
        return equation.replace(/\^/g, '^').replace(/\*/g, '\\cdot ');
    }

    generateRandomExercise() {
        // Generar ejercicio aleatorio
        const tipos = ['variables-separables', 'homogenea', 'exacta', 'lineal'];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        
        const ejercicios = {
            'variables-separables': [
                'dy/dx = xy',
                'dy/dx = x^2/y',
                'dy/dx = sin(x)cos(y)'
            ],
            'homogenea': [
                'dy/dx = (x^2 + y^2)/(2xy)',
                'dy/dx = (x + y)/(x - y)'
            ],
            'exacta': [
                '(2xy + 1)dx + (x^2 - 2y)dy = 0',
                '(3x^2 + 2y)dx + (2x + 4y)dy = 0'
            ],
            'lineal': [
                'dy/dx + 2y = x',
                'xy\' + y = x^2'
            ]
        };
        
        const ejercicio = ejercicios[tipo][Math.floor(Math.random() * ejercicios[tipo].length)];
        
        return {
            tipo: tipo,
            ecuacion: ejercicio
        };
    }

    // Método para exportar progreso
    exportProgress() {
        const completed = Array.from(document.querySelectorAll('.check-item.completed'))
            .map(item => item.getAttribute('data-exercise'));
        
        const progress = {
            module: 'Modulo 5 - Ecuaciones Diferenciales',
            completed: completed,
            percentage: (completed.length / 8) * 100,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(progress, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'progreso_modulo5.json';
        link.click();
    }

    // Método para importar progreso
    importProgress(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const progress = JSON.parse(e.target.result);
                
                // Marcar ejercicios como completados
                progress.completed.forEach(exerciseNumber => {
                    const checkItem = document.querySelector(`[data-exercise="${exerciseNumber}"]`);
                    if (checkItem) {
                        checkItem.classList.add('completed');
                    }
                });
                
                this.updateProgress();
                
                this.mostrarError('Progreso importado exitosamente.');
            } catch (error) {
                this.mostrarError('Error al importar el progreso.');
            }
        };
        
        reader.readAsText(file);
    }
}

// Inicializar la aplicación
let calculadoraED;

document.addEventListener('DOMContentLoaded', function() {
    calculadoraED = new EcuacionesDiferenciales();
    
    // Agregar funcionalidad de exportar/importar progreso
    const exportButton = document.createElement('button');
    exportButton.innerHTML = '<i class="fas fa-download"></i> Exportar Progreso';
    exportButton.onclick = () => calculadoraED.exportProgress();
    exportButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 25px; cursor: pointer; z-index: 1000;';
    
    document.body.appendChild(exportButton);
    
    // Agregar input para importar progreso
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.onchange = (e) => calculadoraED.importProgress(e);
    importInput.style.cssText = 'position: fixed; bottom: 20px; right: 200px; z-index: 1000;';
    
    document.body.appendChild(importInput);
    
    console.log('Módulo 5: Ecuaciones Diferenciales - Cargado completamente');
});

// Funciones globales para compatibilidad con HTML
function toggleSolution(id) {
    if (calculadoraED) {
        calculadoraED.toggleSolution(id, document.querySelector(`[onclick="toggleSolution('${id}')"]`));
    }
}
