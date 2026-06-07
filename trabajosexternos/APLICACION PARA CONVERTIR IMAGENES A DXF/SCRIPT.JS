document.addEventListener('DOMContentLoaded', () => {
	const imageInput = document.getElementById('image-input');
	const sourceCanvas = document.getElementById('source-canvas');
	const edgeCanvas = document.getElementById('edge-canvas');
	const thresholdInput = document.getElementById('threshold');
	const downloadBtn = document.getElementById('download-btn');
	
	const ctxSource = sourceCanvas.getContext('2d');
	const ctxEdge = edgeCanvas.getContext('2d');
	
	let currentImage = null;
	let dxfData = "";

	// Manejo de carga de imagen
	imageInput.addEventListener('change', (e) => {
					const file = e.target.files[0];
					if (!file) return;

					const reader = new FileReader();
					reader.onload = (event) => {
									const img = new Image();
									img.onload = () => {
													currentImage = img;
													setupCanvases(img);
													processEdges();
													downloadBtn.disabled = false;
									};
									img.src = event.target.result;
					};
					reader.readAsDataURL(file);
	});

	// Actualización en tiempo real basada en la sensibilidad
	thresholdInput.addEventListener('input', () => {
					if (currentImage) processEdges();
	});

	function setupCanvases(img) {
					// Escalar la imagen si es muy grande para mantener rendimiento
					const maxSize = 800;
					let width = img.width;
					let height = img.height;

					if (width > maxSize || height > maxSize) {
									const ratio = Math.min(maxSize / width, maxSize / height);
									width = Math.floor(width * ratio);
									height = Math.floor(height * ratio);
					}

					sourceCanvas.width = width;
					sourceCanvas.height = height;
					edgeCanvas.width = width;
					edgeCanvas.height = height;

					ctxSource.drawImage(img, 0, 0, width, height);
	}

	function processEdges() {
					const width = sourceCanvas.width;
					const height = sourceCanvas.height;
					const threshold = parseInt(thresholdInput.value);
					
					const imageData = ctxSource.getImageData(0, 0, width, height);
					const pixels = imageData.data;
					
					const edgeData = ctxEdge.createImageData(width, height);
					const edgePixels = edgeData.data;

					// Iniciar estructura DXF
					dxfData = "0\nSECTION\n2\nENTITIES\n";

					// Filtro de detección de bordes simplificado (Kernel básico)
					for (let y = 1; y < height - 1; y++) {
									for (let x = 1; x < width - 1; x++) {
													const i = (y * width + x) * 4;
													
													// Convertir a escala de grises
													const right = ((y * width + (x + 1)) * 4);
													const bottom = (((y + 1) * width + x) * 4);

													const currentGray = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
													const rightGray = (pixels[right] + pixels[right+1] + pixels[right+2]) / 3;
													const bottomGray = (pixels[bottom] + pixels[bottom+1] + pixels[bottom+2]) / 3;

													// Gradiente espacial
													const diffX = Math.abs(currentGray - rightGray);
													const diffY = Math.abs(currentGray - bottomGray);
													const gradient = diffX + diffY;

													if (gradient > threshold) {
																	// Píxel de borde: dibujar en negro en el canvas
																	edgePixels[i] = 0;     // R
																	edgePixels[i+1] = 0;   // G
																	edgePixels[i+2] = 0;   // B
																	edgePixels[i+3] = 255; // Alpha

																	// Añadir punto al DXF (Invertimos Y para sistemas CAD)
																	addDxfPoint(x, height - y);
													} else {
																	// Fondo blanco
																	edgePixels[i] = 255;
																	edgePixels[i+1] = 255;
																	edgePixels[i+2] = 255;
																	edgePixels[i+3] = 255;
													}
									}
					}
					
					ctxEdge.putImageData(edgeData, 0, 0);
					
					// Cerrar estructura DXF
					dxfData += "0\nENDSEC\n0\nEOF\n";
	}

	function addDxfPoint(x, y) {
					// Genera una entidad POINT en formato DXF
					dxfData += "0\nPOINT\n8\nContornos\n10\n" + x + "\n20\n" + y + "\n30\n0.0\n";
	}

	downloadBtn.addEventListener('click', () => {
					if (!dxfData) return;
					
					const blob = new Blob([dxfData], { type: 'text/plain' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'contornos_jmgv_ptel.dxf';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
	});
});