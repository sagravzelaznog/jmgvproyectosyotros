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
