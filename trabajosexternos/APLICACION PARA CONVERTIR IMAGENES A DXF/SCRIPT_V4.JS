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

					const edgeMap = new Uint8Array(width * height);

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
																	edgeMap[y * width + x] = 1;
																	edgePixels[i] = 0;     // R
																	edgePixels[i+1] = 0;   // G
																	edgePixels[i+2] = 0;   // B
																	edgePixels[i+3] = 255; // Alpha
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

					// Iniciar estructura DXF
					dxfData = "0\nSECTION\n2\nENTITIES\n";

					// Extraer polilíneas continuas
					const visited = new Uint8Array(width * height);
					const dirs = [
									{dx: 1, dy: 0}, {dx: 1, dy: 1}, {dx: 0, dy: 1}, {dx: -1, dy: 1},
									{dx: -1, dy: 0}, {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1}
					];
					const dirs2 = [ // Radio 2 para unir puntos cercanos
									{dx: 2, dy: 0}, {dx: 2, dy: 1}, {dx: 2, dy: 2}, {dx: 1, dy: 2},
									{dx: 0, dy: 2}, {dx: -1, dy: 2}, {dx: -2, dy: 2}, {dx: -2, dy: 1},
									{dx: -2, dy: 0}, {dx: -2, dy: -1}, {dx: -2, dy: -2}, {dx: -1, dy: -2},
									{dx: 0, dy: -2}, {dx: 1, dy: -2}, {dx: 2, dy: -2}, {dx: 2, dy: -1}
					];

					for (let y = 1; y < height - 1; y++) {
									for (let x = 1; x < width - 1; x++) {
													let idx = y * width + x;
													if (edgeMap[idx] === 1 && visited[idx] === 0) {
																	let polyline = [{x: x, y: y}];
																	visited[idx] = 1;
																	
																	// Trazado hacia adelante
																	let currX = x;
																	let currY = y;
																	while (true) {
																					let foundNext = false;
																					for (let d = 0; d < dirs.length; d++) {
																									let nx = currX + dirs[d].dx;
																									let ny = currY + dirs[d].dy;
																									let nIdx = ny * width + nx;
																									if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
																													if (edgeMap[nIdx] === 1 && visited[nIdx] === 0) {
																																	currX = nx;
																																	currY = ny;
																																	polyline.push({x: currX, y: currY});
																																	visited[nIdx] = 1;
																																	foundNext = true;
																																	break;
																													}
																									}
																					}
																					// Si no encuentra adyacente inmediato, busca a distancia 2
																					if (!foundNext) {
																									for (let d = 0; d < dirs2.length; d++) {
																													let nx = currX + dirs2[d].dx;
																													let ny = currY + dirs2[d].dy;
																													let nIdx = ny * width + nx;
																													if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
																																	if (edgeMap[nIdx] === 1 && visited[nIdx] === 0) {
																																					currX = nx;
																																					currY = ny;
																																					polyline.push({x: currX, y: currY});
																																					visited[nIdx] = 1;
																																					foundNext = true;
																																					break;
																																	}
																													}
																									}
																					}
																					if (!foundNext) break;
																	}

																	// Trazado hacia atrás desde el punto de inicio
																	currX = x;
																	currY = y;
																	while (true) {
																					let foundNext = false;
																					for (let d = 0; d < dirs.length; d++) {
																									let nx = currX + dirs[d].dx;
																									let ny = currY + dirs[d].dy;
																									let nIdx = ny * width + nx;
																									if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
																													if (edgeMap[nIdx] === 1 && visited[nIdx] === 0) {
																																	currX = nx;
																																	currY = ny;
																																	polyline.unshift({x: currX, y: currY});
																																	visited[nIdx] = 1;
																																	foundNext = true;
																																	break;
																													}
																									}
																					}
																					// Si no encuentra adyacente inmediato, busca a distancia 2
																					if (!foundNext) {
																									for (let d = 0; d < dirs2.length; d++) {
																													let nx = currX + dirs2[d].dx;
																													let ny = currY + dirs2[d].dy;
																													let nIdx = ny * width + nx;
																													if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
																																	if (edgeMap[nIdx] === 1 && visited[nIdx] === 0) {
																																					currX = nx;
																																					currY = ny;
																																					polyline.unshift({x: currX, y: currY});
																																					visited[nIdx] = 1;
																																					foundNext = true;
																																					break;
																																	}
																													}
																									}
																					}
																					if (!foundNext) break;
																	}
																	
																	// Añadir la polilínea al DXF si tiene más de 1 punto
																	if (polyline.length > 1) {
																					addDxfPolyline(polyline, height);
																	}
													}
									}
					}
					
					// Cerrar estructura DXF
					dxfData += "0\nENDSEC\n0\nEOF\n";
	}

	function addDxfPolyline(polyline, height) {
					// Genera una entidad POLYLINE clásica compatible con todos los CAD
					dxfData += "0\nPOLYLINE\n8\nContornos\n66\n1\n";
					dxfData += "10\n0.0\n20\n0.0\n30\n0.0\n";
					
					for (let i = 0; i < polyline.length; i++) {
									dxfData += "0\nVERTEX\n8\nContornos\n";
									dxfData += "10\n" + polyline[i].x + "\n20\n" + (height - polyline[i].y) + "\n30\n0.0\n";
					}
					
					dxfData += "0\nSEQEND\n";
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