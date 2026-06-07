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
