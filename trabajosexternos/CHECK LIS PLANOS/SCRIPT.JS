document.addEventListener('DOMContentLoaded', () => {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	const inputs = document.querySelectorAll('input[type="text"], input[type="date"]');
	const progressBar = document.getElementById('progressBar');

	// Función para calcular y animar la barra de progreso
	const updateProgress = () => {
					const total = checkboxes.length;
					const checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
					const percentage = (checked / total) * 100;
					progressBar.style.width = percentage + '%';
	};

	// Restaurar el estado guardado en LocalStorage
	checkboxes.forEach((cb, index) => {
					const savedState = localStorage.getItem(`chk_sesion01_${index}`);
					if (savedState === 'true') cb.checked = true;
					
					cb.addEventListener('change', () => {
									localStorage.setItem(`chk_sesion01_${index}`, cb.checked);
									updateProgress();
					});
	});

	// Guardar los datos de texto (Proyecto, Fecha, Revisor)
	inputs.forEach(input => {
					const savedValue = localStorage.getItem(`input_sesion01_${input.id}`);
					if (savedValue) input.value = savedValue;

					input.addEventListener('input', () => {
									localStorage.setItem(`input_sesion01_${input.id}`, input.value);
					});
	});

	// Inicializar el progreso al cargar
	updateProgress();
});