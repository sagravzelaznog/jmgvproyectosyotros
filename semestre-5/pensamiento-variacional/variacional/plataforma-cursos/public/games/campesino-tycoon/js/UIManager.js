import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { GameState } from './GameState.js';
import { TycoonEngine } from './TycoonEngine.js';

export const UIManager = {
    // Entorno Three.js
    scene: null,
    camera: null,
    renderer: null,

    // Avatar y Controles
    jugador: null,
    teclas: { w: false, a: false, s: false, d: false },
    velocidadJugador: 0.15,
    cameraOffset: new THREE.Vector3(15, 20, 15),

    // Entorno y Parcela
    parcelaGroup: null,
    surcosGroup: null,
    plantasMeshes: [],
    faseRenderizada: -1,
    porcentajeProgreso: 0,
    radioInteraccion: 4.5, // Distancia para empezar a trabajar la tierra
    cooldownTrabajo: 0,

    init: function () {
        // Interfaz DOM Clásica (HUD)
        document.getElementById('btn-pagar').addEventListener('click', () => TycoonEngine.intentarPagarInsumos());
        document.getElementById('btn-prestamo').addEventListener('click', () => TycoonEngine.pedirPrestamo());
        document.getElementById('shop-toggle').addEventListener('click', () => {
            document.getElementById('shop-panel').classList.toggle('open');
        });

        if (TycoonEngine.obtenerCostoFase() === 0) GameState.fasePagada = true;

        this.actualizarTextos();
        this.renderizarTienda();

        // Inicializar Motor 3D Hyper-Casual
        this.inicializarThreeJS();
        this.configurarControles();

        window.addEventListener('resize', () => this.resize());
    },

    inicializarThreeJS: function () {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x6AD4F0); // Cielo azul vibrante toon

        // Cámara Ortográfica para mantener estilo isométrico pero enfocada en el jugador
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 18;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2,
            1, 1000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.domElement.id = 'game-canvas-3d';
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';

        const oldCanvas = document.getElementById('game-canvas');
        if (oldCanvas) oldCanvas.replaceWith(this.renderer.domElement);
        else document.body.appendChild(this.renderer.domElement);

        // Iluminación vibrante (estilo Toon/Casual)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        this.scene.add(dirLight);

        this.construirMundo();
        this.crearJugador();

        this.animar();
    },

    construirMundo: function () {
        // Mundo infinito verde (Pasto)
        const pastoGeom = new THREE.PlaneGeometry(100, 100);
        const pastoMat = new THREE.MeshLambertMaterial({ color: 0x5DCC53 }); // Verde vibrante
        const pasto = new THREE.Mesh(pastoGeom, pastoMat);
        pasto.rotation.x = -Math.PI / 2;
        pasto.receiveShadow = true;
        pasto.position.y = -0.1;
        this.scene.add(pasto);

        // Zona de la Parcela (Tierra de cultivo)
        const tierraGeom = new THREE.PlaneGeometry(10, 10);
        const tierraMat = new THREE.MeshLambertMaterial({ color: 0x8B5A2B });
        const tierra = new THREE.Mesh(tierraGeom, tierraMat);
        tierra.rotation.x = -Math.PI / 2;
        tierra.receiveShadow = true;
        this.scene.add(tierra);

        this.parcelaGroup = new THREE.Group();
        this.scene.add(this.parcelaGroup);
    },

    crearJugador: function () {
        this.jugador = new THREE.Group();

        // Estética Low-Poly / Hyper-Casual (Cuerpo de cápsula/cilindro y cabeza grande)
        const cuerpoMat = new THREE.MeshLambertMaterial({ color: 0x2980b9 }); // Overol azul
        const pielMat = new THREE.MeshLambertMaterial({ color: 0xf1c27d }); // Piel

        const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), cuerpoMat);
        cuerpo.position.y = 0.4;
        cuerpo.castShadow = true;

        const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), pielMat);
        cabeza.position.y = 1.0;
        cabeza.castShadow = true;

        // Añadir una pequeña gorra o indicador frontal para ver hacia dónde mira
        const gorra = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.4), new THREE.MeshLambertMaterial({ color: 0xe74c3c }));
        gorra.position.set(0, 1.3, 0.1);
        gorra.castShadow = true;

        this.jugador.add(cuerpo, cabeza, gorra);
        this.jugador.position.set(0, 0, 5); // Inicia un poco fuera de la parcela
        this.scene.add(this.jugador);
    },

    configurarControles: function () {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.teclas.hasOwnProperty(key) || key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright') {
                if (key === 'w' || key === 'arrowup') this.teclas.w = true;
                if (key === 's' || key === 'arrowdown') this.teclas.s = true;
                if (key === 'a' || key === 'arrowleft') this.teclas.a = true;
                if (key === 'd' || key === 'arrowright') this.teclas.d = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || key === 'arrowup') this.teclas.w = false;
            if (key === 's' || key === 'arrowdown') this.teclas.s = false;
            if (key === 'a' || key === 'arrowleft') this.teclas.a = false;
            if (key === 'd' || key === 'arrowright') this.teclas.d = false;
        });
    },

    procesarMovimiento: function () {
        let movX = 0;
        let movZ = 0;

        if (this.teclas.w) movZ -= 1;
        if (this.teclas.s) movZ += 1;
        if (this.teclas.a) movX -= 1;
        if (this.teclas.d) movX += 1;

        if (movX !== 0 || movZ !== 0) {
            // Normalizar vector para evitar movimiento diagonal más rápido
            const length = Math.sqrt(movX * movX + movZ * movZ);
            movX = (movX / length) * this.velocidadJugador;
            movZ = (movZ / length) * this.velocidadJugador;

            this.jugador.position.x += movX;
            this.jugador.position.z += movZ;

            // Rotar jugador hacia la dirección del movimiento
            const anguloDestino = Math.atan2(movX, movZ);
            // Lerp para rotación suave
            const diff = anguloDestino - this.jugador.rotation.y;
            this.jugador.rotation.y += Math.atan2(Math.sin(diff), Math.cos(diff)) * 0.2;
        }

        // Actualizar Cámara (Sigue al jugador fluidamente)
        const posObjetivoCamara = this.jugador.position.clone().add(this.cameraOffset);
        this.camera.position.lerp(posObjetivoCamara, 0.1);
        this.camera.lookAt(this.jugador.position);
    },

    procesarProximidadLaboral: function () {
        if (!GameState.fasePagada) return;

        // La parcela está en el origen (0,0,0). Verificamos si el jugador está sobre ella.
        const centroParcela = new THREE.Vector3(0, 0, 0);
        const distancia = this.jugador.position.distanceTo(centroParcela);

        if (distancia < this.radioInteraccion) {
            this.cooldownTrabajo++;
            // Simulamos clics rápidos y continuos mientras el jugador está sobre la tierra
            if (this.cooldownTrabajo > 5) { // Ejecuta cada ~5 frames
                TycoonEngine.agregarProgreso(GameState.poderClicBase * 0.5, true);
                this.cooldownTrabajo = 0;

                // Efecto de rebote del jugador simulando que está "trabajando"
                this.jugador.position.y = 0.1 + Math.sin(Date.now() * 0.02) * 0.1;
            }
        } else {
            this.jugador.position.y = 0; // Restaurar altura si sale
        }
    },

    actualizarGeometrias: function () {
        const idx = GameState.faseActualIndex;
        if (this.faseRenderizada === idx) return;
        this.faseRenderizada = idx;

        while (this.parcelaGroup.children.length > 0) {
            const child = this.parcelaGroup.children[0];
            this.parcelaGroup.remove(child);
        }
        this.plantasMeshes = [];

        // Distribuimos los objetos en una cuadrícula más pequeña para ajustarse a la zona de 10x10
        if (idx === 0) {
            const rocaGeom = new THREE.DodecahedronGeometry(0.4);
            const rocaMat = new THREE.MeshLambertMaterial({ color: 0x888888 });

            for (let i = 0; i < 15; i++) {
                const roca = new THREE.Mesh(rocaGeom, rocaMat);
                roca.position.set((Math.random() - 0.5) * 8, 0.2, (Math.random() - 0.5) * 8);
                roca.castShadow = true;
                this.parcelaGroup.add(roca);
            }
        }
        else if (idx >= 5 && idx <= 12) {
            const esCosecha = (idx >= 11);
            const colorPlanta = esCosecha ? 0xFFD700 : 0x32CD32; // Oro o Verde brillante Toon

            const plantaGeom = new THREE.SphereGeometry(0.4, 8, 8); // Plantas redondas estilo cartoon
            plantaGeom.translate(0, 0.4, 0);
            const plantaMat = new THREE.MeshLambertMaterial({ color: colorPlanta });

            for (let x = -4; x <= 4; x += 2) {
                for (let z = -4; z <= 4; z += 2) {
                    const planta = new THREE.Mesh(plantaGeom, plantaMat);
                    planta.position.set(x + (Math.random() - 0.5) * 0.5, 0, z + (Math.random() - 0.5) * 0.5);
                    planta.castShadow = true;
                    planta.scale.set(0.1, 0.1, 0.1);

                    this.parcelaGroup.add(planta);
                    this.plantasMeshes.push(planta);
                }
            }
        }
    },

    animarPlantas: function () {
        const idx = GameState.faseActualIndex;
        if (idx >= 5 && idx <= 12) {
            const faseNormalizada = idx - 5;
            const progresoSubFase = this.porcentajeProgreso / 100;
            const crecimientoTotal = (faseNormalizada + progresoSubFase) / 7.0;

            const escalaObjetivo = 0.2 + (crecimientoTotal * 1.5); // Escala en los 3 ejes para estilo cartoon

            for (let i = 0; i < this.plantasMeshes.length; i++) {
                const planta = this.plantasMeshes[i];
                planta.scale.lerp(new THREE.Vector3(escalaObjetivo, escalaObjetivo, escalaObjetivo), 0.05);
            }
        }
    },

    animar: function () {
        requestAnimationFrame(() => this.animar());

        this.procesarMovimiento();
        this.procesarProximidadLaboral();
        this.actualizarGeometrias();
        this.animarPlantas();

        this.renderer.render(this.scene, this.camera);
    },

    resize: function () {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 18;
        if (this.camera) {
            this.camera.left = -frustumSize * aspect / 2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = -frustumSize / 2;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    actualizarBarraProgreso: function (porcentaje) {
        document.getElementById('progress-bar').style.width = `${porcentaje}%`;
        this.porcentajeProgreso = porcentaje;
    },

    actualizarTextos: function () {
        document.getElementById('ui-capital').innerText = Math.floor(GameState.capital);
        document.getElementById('ui-xp').innerText = GameState.xp;
        document.getElementById('ui-hectareas').innerText = GameState.hectareas;
        document.getElementById('ui-calidad').innerText = GameState.multiplicadorCosecha.toFixed(2);

        const uiDeudaContainer = document.getElementById('ui-deuda-container');
        if (GameState.deudaBancaria > 0) {
            uiDeudaContainer.style.display = 'block';
            document.getElementById('ui-deuda').innerText = Math.floor(GameState.deudaBancaria);
        } else {
            uiDeudaContainer.style.display = 'none';
        }

        const costoFase = TycoonEngine.obtenerCostoFase();
        document.getElementById('fase-title').innerText = GameState.fases[GameState.faseActualIndex].nombre;

        const btnPagar = document.getElementById('btn-pagar');
        const btnPrestamo = document.getElementById('btn-prestamo');
        const progressContainer = document.getElementById('progress-container');

        if (!GameState.fasePagada) {
            progressContainer.style.display = 'none';
            if (GameState.capital >= costoFase) {
                btnPagar.style.display = 'block';
                btnPagar.innerText = `Pagar Insumos ($${costoFase})`;
                btnPrestamo.style.display = 'none';
            } else {
                btnPagar.style.display = 'none';
                btnPrestamo.style.display = 'block';
            }
        } else {
            progressContainer.style.display = 'block';
            btnPagar.style.display = 'none';
            btnPrestamo.style.display = 'none';
        }
    },

    renderizarTienda: function () {
        const container = document.getElementById('shop-items-container');
        container.innerHTML = '';
        Object.keys(TycoonEngine.upgrades).forEach(key => {
            const upg = TycoonEngine.upgrades[key];
            const div = document.createElement('div');
            div.className = 'upgrade-item';
            if (upg.reqXp > 0 && GameState.xp < upg.reqXp) {
                div.classList.add('locked-item');
                div.innerHTML = `<div class="upgrade-info"><h4><i class="fas fa-lock"></i> Desbloqueo: ${upg.reqXp} XP</h4></div>`;
            } else {
                const esMaximo = upg.maxNivel !== null && upg.nivel >= upg.maxNivel;
                const costoActual = Math.floor(upg.costoBase * Math.pow(upg.multCosto, upg.nivel));
                let puedeComprar = !esMaximo && GameState.capital >= costoActual;
                let textoBoton = esMaximo ? 'MÁX' : '$' + costoActual;

                if (upg.id === 'fertilizante' && GameState.faseActualIndex > 6) {
                    puedeComprar = false;
                    textoBoton = 'TARDE';
                }

                div.innerHTML = `
                    <div class="upgrade-info">
                        <h4>${upg.nombre} ${upg.maxNivel === 1 ? '' : '(Nvl. ' + upg.nivel + ')'}</h4>
                        <p>${upg.desc}</p>
                    </div>
                    <button class="btn-buy" id="buy-${upg.id}" ${!puedeComprar ? 'disabled' : ''}>${textoBoton}</button>
                `;
            }
            container.appendChild(div);

            const btn = document.getElementById(`buy-${upg.id}`);
            if (btn && !btn.disabled) {
                btn.addEventListener('click', () => TycoonEngine.comprarMejora(upg.id));
            }
        });
    },

    mostrarFlotante: function (texto, x, y, color) {
        const el = document.createElement('div');
        el.className = 'floating-text';
        el.innerText = texto;
        el.style.position = 'absolute';
        // Si el usuario ya no hace clic, los flotantes del motor (como XP o cosechas) aparecerán sobre el jugador
        if (x === window.innerWidth / 2) {
            // Posicionar el flotante encima de la cabeza del avatar en el HTML
            el.style.left = `50%`;
            el.style.top = `40%`;
            el.style.transform = 'translate(-50%, -50%)';
        } else {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }

        el.style.color = color;
        el.style.zIndex = '100';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '24px'; // Más grande para el estilo casual
        el.style.textShadow = '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
};