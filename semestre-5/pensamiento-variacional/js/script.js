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


// S11 to S20 Logic
function unlockTeacherTipsS11() { unlockTips('sesion11-variacional'); }
window.unlockTeacherTipsS11 = unlockTeacherTipsS11;
function unlockTeacherTipsS12() { unlockTips('sesion12-variacional'); }
window.unlockTeacherTipsS12 = unlockTeacherTipsS12;
function unlockTeacherTipsS13() { unlockTips('sesion13-variacional'); }
window.unlockTeacherTipsS13 = unlockTeacherTipsS13;
function unlockTeacherTipsS14() { unlockTips('sesion14-variacional'); }
window.unlockTeacherTipsS14 = unlockTeacherTipsS14;
function unlockTeacherTipsS15() { unlockTips('sesion15-variacional'); }
window.unlockTeacherTipsS15 = unlockTeacherTipsS15;
function unlockTeacherTipsS16() { unlockTips('sesion16-variacional'); }
window.unlockTeacherTipsS16 = unlockTeacherTipsS16;
function unlockTeacherTipsS17() { unlockTips('sesion17-variacional'); }
window.unlockTeacherTipsS17 = unlockTeacherTipsS17;
function unlockTeacherTipsS18() { unlockTips('sesion18-variacional'); }
window.unlockTeacherTipsS18 = unlockTeacherTipsS18;
function unlockTeacherTipsS19() { unlockTips('sesion19-variacional'); }
window.unlockTeacherTipsS19 = unlockTeacherTipsS19;
function unlockTeacherTipsS20() { unlockTips('sesion20-variacional'); }
window.unlockTeacherTipsS20 = unlockTeacherTipsS20;

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



// S21 Logic
function unlockTeacherTipsS21() { unlockTips('sesion21-variacional'); }
window.unlockTeacherTipsS21 = unlockTeacherTipsS21;

function runRelayStep(step) {
    document.getElementById('relay-step-' + step).classList.add('visible');
    document.getElementById('btn-s' + step).classList.remove('active');
    document.getElementById('btn-s' + step).disabled = true;
    if(step < 4) {
        let nextBtn = document.getElementById('btn-s' + (step+1));
        nextBtn.disabled = false;
        nextBtn.classList.add('active');
    } else {
        // Success animation or message
        setTimeout(() => alert("🏁 ¡Carrera completada! Hemos demostrado que la derivada de 1/x es -1/x²."), 500);
    }
}
window.runRelayStep = runRelayStep;

// Reveal bottom nav when scrolling to the end
document.addEventListener('DOMContentLoaded', () => {
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                bottomNav.classList.add('visible');
            }
        }, { threshold: 0.1 });
        
        // Observe the bottom nav itself or the quiz container
        const quizPoint = document.getElementById('quiz-mount-point');
        if (quizPoint) observer.observe(quizPoint);
        else observer.observe(bottomNav);
    }
});
