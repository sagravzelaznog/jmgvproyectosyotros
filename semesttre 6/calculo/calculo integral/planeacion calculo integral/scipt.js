/**
 * Script de Control de Planeación
 * JMGV-PTEL-2026
 */

function printPlanner() {
	window.print();
}

// Efecto de carga suave para las filas de la tabla
document.addEventListener('DOMContentLoaded', () => {
	const rows = document.querySelectorAll('.planner-table tbody tr');
	
	// Configuración inicial
	rows.forEach(row => {
					row.style.opacity = '0';
					row.style.transform = 'translateY(10px)';
					row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
	});

	// Animación en cascada
	let delay = 0;
	rows.forEach(row => {
					setTimeout(() => {
									row.style.opacity = '1';
									row.style.transform = 'translateY(0)';
					}, delay);
					delay += 30; // 30ms de retraso entre cada fila
	});
});