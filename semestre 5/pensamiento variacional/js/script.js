/* =========================================================
SCRIPT: SESIÓN 1 PENSAMIENTO VARIACIONAL
========================================================= */

// 1. Lógica del Modo Maestro (Contraseña 1983)
function unlockTeacherTipsS1() {
    const pwd = prompt("🔐 MODO MAESTRO (Pensamiento Variacional)\nIngrese el código de acceso para visualizar los tips    pedagógicos: ");

    if (pwd === "1983") {
        const tips = document.querySelectorAll('#sesion1-variacional .teacher-tip');
        let unlocked = false;

        tips.forEach(tip => {
            if (tip.classList.contains('hidden')) {
                tip.classList.remove('hidden');
                unlocked = true;
            }
        });

        if (unlocked) {
            alert("✅ ¡Modo Maestro Activado! Se han revelado las sugerencias para Inicio, Desarrollo y Cierre.");
        } else {
            alert("ℹ️ El Modo Maestro ya está activo en esta infografía.");
        }
    } else if (pwd !== null) {
        alert("❌ Código incorrecto. Acceso denegado.");
    }
}

// 2. Lógica del Simulador M-Learning (La Dicotomía de Zenón)
let currentPosition = 0; // Posición en porcentaje (0 a 100)
let remainingDistance = 100;

function moveHalfway() {
    // Calcula la mitad de la distancia que falta para llegar al 90% (para no salirse del div visualmente)
    let moveAmount = remainingDistance / 2;
    currentPosition += moveAmount;
    remainingDistance -= moveAmount;

    // Actualiza la posición visual del corredor
    const runner = document.getElementById('runner-dot');
    runner.style.left = `calc(${currentPosition}% - 15px)`;

    // Actualiza el texto
    const log = document.getElementById('distance-log');
    log.innerHTML = `Distancia restante: <b>${remainingDistance.toFixed(2)}%</b> <br><small>(Observa cómo nunca llega a
        0)</small>`;
}

function resetRunner() {
    currentPosition = 0;
    remainingDistance = 100;
    document.getElementById('runner-dot').style.left = '0%';
    document.getElementById('distance-log').innerHTML = 'Distancia restante: 100%';
}

// =========================================================
// SCRIPT: SESIÓN 2 PENSAMIENTO VARIACIONAL
// =========================================================

function unlockTeacherTipsS2() {
    const pwd = prompt("🔐 MODO MAESTRO (Pensamiento Variacional)\nIngrese el código de acceso: ");
    if (pwd === "1983") {
        const tips = document.querySelectorAll('#sesion2-variacional .teacher-tip');
        let unlocked = false;
        tips.forEach(tip => {
            if (tip.classList.contains('hidden')) {
                tip.classList.remove('hidden');
                unlocked = true;
            }
        });
        if (unlocked) alert("✅ ¡Modo Maestro Activado!");
    } else if (pwd !== null) {
        alert("❌ Código incorrecto. Acceso denegado.");
    }
}

function drawPolygon(sides) {
    const canvas = document.getElementById('polygon-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Dibujar Círculo exterior
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#3b82f6';
    ctx.stroke();

    // Dibujar Polígono inscrito
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
        const angle = i * (2 * Math.PI / sides) - (Math.PI / 2);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.fill();
    
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#a855f7';
    ctx.stroke();
    
    ctx.shadowBlur = 0;
}
// =========================================================
// SCRIPT: SESIÓN 3 PENSAMIENTO VARIACIONAL
// =========================================================

function unlockTeacherTipsS3() {
    const pwd = prompt("🔐 MODO MAESTRO (Pensamiento Variacional)\nIngrese el código de acceso: ");
    if (pwd === "1983") {
        const tips = document.querySelectorAll('#sesion3-variacional .teacher-tip');
        let unlocked = false;
        tips.forEach(tip => {
            if (tip.classList.contains('hidden')) {
                tip.classList.remove('hidden');
                unlocked = true;
            }
        });
        if (unlocked) alert("✅ ¡Modo Maestro Activado!");
    } else if (pwd !== null) {
        alert("❌ Código incorrecto. Acceso denegado.");
    }
}

function calculateSpeed() {
    const dist = parseFloat(document.getElementById('dist-slider').value);
    const time = parseFloat(document.getElementById('time-slider').value);
    
    document.getElementById('dist-label').innerText = dist;
    document.getElementById('time-label').innerText = time;
    
    // m = Δy / Δx
    const speed = dist / time;
    
    // Update UI
    const speedVal = document.getElementById('speed-val');
    speedVal.innerText = speed.toFixed(1);
    
    // Cambiar color basado en la velocidad
    const gauge = document.getElementById('gauge-display');
    if (speed > 100) {
        gauge.style.borderColor = '#ef4444'; // Red
        gauge.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
        speedVal.style.color = '#ef4444';
    } else if (speed > 50) {
        gauge.style.borderColor = '#eab308'; // Yellow
        gauge.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.5)';
        speedVal.style.color = '#eab308';
    } else {
        gauge.style.borderColor = '#38bdf8'; // Blue
        gauge.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.5)';
        speedVal.style.color = '#38bdf8';
    }
}

window.unlockTeacherTipsS3 = unlockTeacherTipsS3;
window.calculateSpeed = calculateSpeed;

// =========================================================
// SCRIPT: SESIÓN 4 PENSAMIENTO VARIACIONAL
// =========================================================

function unlockTeacherTipsS4() {
    const pwd = prompt("🔐 MODO MAESTRO (Pensamiento Variacional)\nIngrese el código de acceso: ");
    if (pwd === "1983") {
        const tips = document.querySelectorAll('#sesion4-variacional .teacher-tip');
        let unlocked = false;
        tips.forEach(tip => {
            if (tip.classList.contains('hidden')) {
                tip.classList.remove('hidden');
                unlocked = true;
            }
        });
        if (unlocked) alert("✅ ¡Modo Maestro Activado!");
    } else if (pwd !== null) {
        alert("❌ Código incorrecto. Acceso denegado.");
    }
}

function calculateLoad() {
    const tempSlider = document.getElementById('temp-slider');
    if(!tempSlider) return;
    
    const temp = parseFloat(tempSlider.value);
    document.getElementById('temp-label').innerText = temp;
    
    // Cálculo exponencial simple (simulando demanda de A/C)
    // Base a 20°C = 40% de carga. 
    // Por cada grado extra, sube 2% al principio, y luego más rápido.
    const excessTemp = temp - 20;
    const load = Math.min(100, Math.floor(40 + (excessTemp * 1.5) + (Math.pow(excessTemp, 1.3))));
    
    document.getElementById('load-val').innerText = load;
    
    const gauge = document.getElementById('load-gauge');
    const alertBox = document.getElementById('overload-alert');
    
    if (load >= 95) {
        gauge.style.borderColor = '#ef4444'; // Red
        gauge.style.color = '#ef4444';
        gauge.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.7)';
        alertBox.style.display = 'block';
    } else if (load >= 75) {
        gauge.style.borderColor = '#f59e0b'; // Amber
        gauge.style.color = '#f59e0b';
        gauge.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.5)';
        alertBox.style.display = 'none';
    } else {
        gauge.style.borderColor = '#10b981'; // Green
        gauge.style.color = '#10b981';
        gauge.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
        alertBox.style.display = 'none';
    }
}

window.unlockTeacherTipsS4 = unlockTeacherTipsS4;
window.calculateLoad = calculateLoad;

// =========================================================
// SCRIPT: SESIÓN 5 PENSAMIENTO VARIACIONAL
// =========================================================

function unlockTeacherTipsS5() {
    const pwd = prompt("🔐 MODO MAESTRO (Pensamiento Variacional)\nIngrese el código de acceso: ");
    if (pwd === "1983") {
        const tips = document.querySelectorAll('#sesion5-variacional .teacher-tip');
        let unlocked = false;
        tips.forEach(tip => {
            if (tip.classList.contains('hidden')) {
                tip.classList.remove('hidden');
                unlocked = true;
            }
        });
        if (unlocked) alert("✅ ¡Modo Maestro Activado!");
    } else if (pwd !== null) {
        alert("❌ Código incorrecto. Acceso denegado.");
    }
}

function processFunction() {
    const inputVal = document.getElementById('func-input').value;
    if (inputVal === '') return;
    
    const x = parseFloat(inputVal);
    const rule = document.getElementById('func-rule').value;
    const gears = document.getElementById('machine-gears');
    const outputBox = document.getElementById('func-output');
    
    // Animate gears
    gears.classList.add('spin');
    outputBox.innerText = "...";
    
    setTimeout(() => {
        let y = 0;
        if (rule === 'double') y = 2 * x;
        else if (rule === 'square') y = x * x;
        else if (rule === 'plusTen') y = x + 10;
        
        outputBox.innerText = y;
        gears.classList.remove('spin');
    }, 1000);
}

window.unlockTeacherTipsS5 = unlockTeacherTipsS5;
window.processFunction = processFunction;

// =========================================================
// SCRIPT: SESIÓN 6 a 10 PENSAMIENTO VARIACIONAL
// =========================================================

function unlockTeacherTipsS6() { unlockTips('sesion6-variacional'); }
function unlockTeacherTipsS7() { unlockTips('sesion7-variacional'); }
function unlockTeacherTipsS8() { unlockTips('sesion8-variacional'); }
function unlockTeacherTipsS9() { unlockTips('sesion9-variacional'); }
function unlockTeacherTipsS10() { unlockTips('sesion10-variacional'); }

function unlockTips(id) {
    const pwd = prompt("🔐 MODO MAESTRO\nIngrese el código de acceso: ");
    if (pwd === "1983") {
        const tips = document.querySelectorAll('#' + id + ' .teacher-tip');
        let unlocked = false;
        tips.forEach(t => { t.classList.remove('hidden'); unlocked = true; });
        if (unlocked) alert("✅ ¡Modo Maestro Activado!");
    } else if (pwd !== null) {
        alert("❌ Código incorrecto.");
    }
}

// S6
function updateExpoCurve() {
    const slider = document.getElementById('base-slider');
    if(!slider) return;
    const base = parseFloat(slider.value);
    document.getElementById('base-val').innerText = base.toFixed(1);
    
    let points = [];
    let maxVal = 100; // Fixed ceiling to visually compare steepness
    
    for(let x=0; x<=10; x+=0.2) {
        let y = Math.pow(base, x);
        let percentX = (x / 10) * 100;
        let percentY = 100 - ((y / maxVal) * 100);
        
        if(percentY < 0) percentY = 0; // Clip to ceiling
        
        points.push(`${percentX.toFixed(1)}% ${percentY.toFixed(1)}%`);
    }
    
    const polygon = `polygon(0% 100%, ${points.join(', ')}, 100% 100%)`;
    document.getElementById('expo-curve').style.clipPath = polygon;
}

// S7
function updateCoolingCurve() {
    const slider = document.getElementById('time-slider');
    if(!slider) return;
    const t = parseFloat(slider.value);
    document.getElementById('time-val').innerText = t;
    
    const temp = 25 + 75 * Math.exp(-0.05 * t);
    document.getElementById('temp-readout').innerText = temp.toFixed(1) + " °C";
    document.getElementById('thermo-mercury').style.height = temp + '%';
}

// S8
let micInterval = null;
function toggleMic() {
    const btn = document.getElementById('btn-mic');
    if(!btn) return;
    
    if(micInterval) {
        clearInterval(micInterval);
        micInterval = null;
        btn.classList.remove('active');
        btn.innerText = "Activar Micrófono Simulado";
        document.getElementById('db-val').innerText = "--";
        document.getElementById('db-led').style.width = '0%';
    } else {
        btn.classList.add('active');
        btn.innerText = "Detener Simulación";
        
        micInterval = setInterval(() => {
            const db = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
            document.getElementById('db-val').innerText = db;
            const w = (db / 140) * 100;
            document.getElementById('db-led').style.width = w + '%';
        }, 300);
    }
}

// S9 & S10 Global Animation
let s9Phase = 0;
let s10Time = 0;
let activePhases = [true, true, true];

function animateCanvas() {
    drawSineWave();
    drawThreePhase();
    requestAnimationFrame(animateCanvas);
}
requestAnimationFrame(animateCanvas);

function drawSineWave() {
    const canvas = document.getElementById('sine-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    
    const ampSlider = document.getElementById('amp-slider');
    const freqSlider = document.getElementById('freq-slider');
    if(!ampSlider) return;
    
    const A = parseFloat(ampSlider.value);
    const f = parseFloat(freqSlider.value);
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.stroke();
    
    ctx.beginPath();
    for(let x=0; x<width; x++) {
        const y = height/2 - A * Math.sin(f * x + s9Phase);
        if(x===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    s9Phase += 0.1;
}

function togglePhase(idx) {
    activePhases[idx] = !activePhases[idx];
}

function drawThreePhase() {
    const canvas = document.getElementById('three-phase-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    const A = 50;
    const f = 0.05;
    const colors = ["#ef4444", "#10b981", "#3b82f6"];
    const offsets = [0, (2*Math.PI)/3, (4*Math.PI)/3];
    
    for(let i=0; i<3; i++) {
        if(!activePhases[i]) continue;
        ctx.beginPath();
        for(let x=0; x<width; x++) {
            const y = height/2 - A * Math.sin(f * x - offsets[i] + s10Time);
            if(x===0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    s10Time += 0.05;
}

window.unlockTeacherTipsS6 = unlockTeacherTipsS6;
window.unlockTeacherTipsS7 = unlockTeacherTipsS7;
window.unlockTeacherTipsS8 = unlockTeacherTipsS8;
window.unlockTeacherTipsS9 = unlockTeacherTipsS9;
window.unlockTeacherTipsS10 = unlockTeacherTipsS10;
window.updateExpoCurve = updateExpoCurve;
window.updateCoolingCurve = updateCoolingCurve;
window.toggleMic = toggleMic;
window.drawSineWave = drawSineWave;
window.drawThreePhase = drawThreePhase;
window.togglePhase = togglePhase;
