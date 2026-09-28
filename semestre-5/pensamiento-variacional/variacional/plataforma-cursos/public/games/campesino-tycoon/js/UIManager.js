import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { GameState } from './GameState.js';
import { TycoonEngine } from './TycoonEngine.js';

export const UIManager = {
    scene: null, camera: null, renderer: null,

    // Controles y Jugador
    jugadorGroup: null,
    avatar: { cuerpo: null, brazos: [], piernas: [], herramienta: null },
    teclas: { w: false, a: false, s: false, d: false },
    joystickData: { x: 0, y: 0, active: false }, // [NUEVO] Estado del Joystick
    velocidadJugador: 0.12,
    cameraOffset: new THREE.Vector3(12, 18, 12),
    isMoving: false,
    isWorking: false,

    // Entorno, Parcela y VFX
    parcelaGroup: null,
    plantasMeshes: [],
    recolectables: [],
    particulasTierra: [],
    faseRenderizada: -1,
    porcentajeProgreso: 0,
    radioInteraccion: 4.5,
    cooldownTrabajo: 0,

    init: function () {
        document.getElementById('btn-pagar').addEventListener('click', () => TycoonEngine.intentarPagarInsumos());
        document.getElementById('btn-prestamo').addEventListener('click', () => TycoonEngine.pedirPrestamo());
        document.getElementById('shop-toggle').addEventListener('click', () => {
            document.getElementById('shop-panel').classList.toggle('open');
        });

        if (TycoonEngine.obtenerCostoFase() === 0) GameState.fasePagada = true;

        this.actualizarTextos();
        this.renderizarTienda();

        this.inicializarThreeJS();
        this.configurarControles();

        // [NUEVO] Inicializar controles táctiles
        this.crearJoystickVirtual();

        window.addEventListener('resize', () => this.resize());
    },

    // [NUEVO] Creación del Joystick Virtual en el DOM
    crearJoystickVirtual: function () {
        // Solo inyectar si el dispositivo soporta eventos táctiles
        if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) return;

        // Base del Joystick
        const joystickBase = document.createElement('div');
        joystickBase.id = 'joystick-base';
        Object.assign(joystickBase.style, {
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '120px',
            height: '120px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.6)',
            zIndex: '1000',
            touchAction: 'none' // Evita que la pantalla haga scroll al usarlo
        });

        // Palanca del Joystick
        const joystickStick = document.createElement('div');
        joystickStick.id = 'joystick-stick';
        Object.assign(joystickStick.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.3)'
        });

        joystickBase.appendChild(joystickStick);
        document.body.appendChild(joystickBase);

        const centro = 60; // Mitad de 120px
        const maxRadio = 60;

        const onTouchMove = (e) => {
            e.preventDefault();
            const touch = e.targetTouches[0];
            const rect = joystickBase.getBoundingClientRect();

            // Coordenadas relativas al centro del joystick
            let dx = (touch.clientX - rect.left) - centro;
            let dy = (touch.clientY - rect.top) - centro;

            const distancia = Math.sqrt(dx * dx + dy * dy);

            // Limitar la palanca al radio máximo
            if (distancia > maxRadio) {
                dx = (dx / distancia) * maxRadio;
                dy = (dy / distancia) * maxRadio;
            }

            joystickStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

            // Normalizar valores analógicos entre -1 y 1
            this.joystickData.x = dx / maxRadio;
            this.joystickData.y = dy / maxRadio;
            this.joystickData.active = true;
        };

        const onTouchEnd = (e) => {
            e.preventDefault();
            // Retornar al centro
            joystickStick.style.transform = `translate(-50%, -50%)`;
            this.joystickData.x = 0;
            this.joystickData.y = 0;
            this.joystickData.active = false;
        };

        joystickBase.addEventListener('touchstart', onTouchMove, { passive: false });
        joystickBase.addEventListener('touchmove', onTouchMove, { passive: false });
        joystickBase.addEventListener('touchend', onTouchEnd);
        joystickBase.addEventListener('touchcancel', onTouchEnd);
    },

    inicializarThreeJS: function () {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x6AD4F0);
        this.scene.fog = new THREE.Fog(0x6AD4F0, 20, 40);

        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 15;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2, 1, 1000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.domElement.id = 'game-canvas-3d';

        // Evitar comportamientos táctiles por defecto (zoom, pull-to-refresh) en el canvas
        Object.assign(this.renderer.domElement.style, {
            position: 'absolute',
            top: '0', left: '0',
            zIndex: '1',
            touchAction: 'none'
        });

        const oldCanvas = document.getElementById('game-canvas');
        if (oldCanvas) oldCanvas.replaceWith(this.renderer.domElement);
        else document.body.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = -10;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -15;
        dirLight.shadow.camera.right = 15;
        dirLight.shadow.camera.top = 15;
        dirLight.shadow.camera.bottom = -15;
        this.scene.add(dirLight);

        this.construirMundo();
        this.crearJugadorArticulado();

        this.animar();
    },

    construirMundo: function () {
        const pasto = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshLambertMaterial({ color: 0x5DCC53 }));
        pasto.rotation.x = -Math.PI / 2;
        pasto.receiveShadow = true;
        pasto.position.y = -0.05;
        this.scene.add(pasto);

        const tierra = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshLambertMaterial({ color: 0x8B5A2B }));
        tierra.rotation.x = -Math.PI / 2;
        tierra.receiveShadow = true;
        this.scene.add(tierra);

        const cercaMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
        const posteGeom = new THREE.BoxGeometry(0.2, 1, 0.2);
        const barraGeom = new THREE.BoxGeometry(9, 0.15, 0.1);

        const construirValla = (x, z, rotY) => {
            const valla = new THREE.Group();
            for (let i = -4.5; i <= 4.5; i += 1.5) {
                const poste = new THREE.Mesh(posteGeom, cercaMat);
                poste.position.set(i, 0.5, 0);
                poste.castShadow = true;
                valla.add(poste);
            }
            const barra1 = new THREE.Mesh(barraGeom, cercaMat);
            barra1.position.set(0, 0.7, 0);
            const barra2 = new THREE.Mesh(barraGeom, cercaMat);
            barra2.position.set(0, 0.3, 0);
            valla.add(barra1, barra2);
            valla.position.set(x, 0, z);
            valla.rotation.y = rotY;
            this.scene.add(valla);
        };

        construirValla(0, -4.75, 0);
        construirValla(0, 4.75, 0);
        construirValla(-4.75, 0, Math.PI / 2);
        construirValla(4.75, 0, Math.PI / 2);

        this.parcelaGroup = new THREE.Group();
        this.scene.add(this.parcelaGroup);
    },

    crearJugadorArticulado: function () {
        this.jugadorGroup = new THREE.Group();

        const pielMat = new THREE.MeshLambertMaterial({ color: 0xffcc99 });
        const overolMat = new THREE.MeshLambertMaterial({ color: 0x2980b9 });
        const camisaMat = new THREE.MeshLambertMaterial({ color: 0xe74c3c });

        const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.4), overolMat);
        cuerpo.position.y = 0.8;
        cuerpo.castShadow = true;
        this.avatar.cuerpo = cuerpo;

        const cabeza = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), pielMat);
        cabeza.position.y = 0.65;
        cabeza.castShadow = true;

        const gorra = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.15, 0.6), camisaMat);
        gorra.position.set(0, 0.3, 0.05);
        const visera = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.05, 0.3), camisaMat);
        visera.position.set(0, 0.25, 0.4);
        cabeza.add(gorra, visera);
        cuerpo.add(cabeza);

        const crearExtremidad = (mat, x, y) => {
            const grupo = new THREE.Group();
            const malla = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), mat);
            malla.position.y = -0.2;
            malla.castShadow = true;
            grupo.add(malla);
            grupo.position.set(x, y, 0);
            return grupo;
        };

        const brazoIzq = crearExtremidad(camisaMat, -0.4, 0.2);
        const brazoDer = crearExtremidad(camisaMat, 0.4, 0.2);
        cuerpo.add(brazoIzq, brazoDer);
        this.avatar.brazos = [brazoIzq, brazoDer];

        const piernaIzq = crearExtremidad(overolMat, -0.15, 0.45);
        const piernaDer = crearExtremidad(overolMat, 0.15, 0.45);
        this.jugadorGroup.add(cuerpo, piernaIzq, piernaDer);
        this.avatar.piernas = [piernaIzq, piernaDer];

        const herramienta = new THREE.Group();
        const palo = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8), new THREE.MeshLambertMaterial({ color: 0x8b4513 }));
        const filo = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.3), new THREE.MeshLambertMaterial({ color: 0xbdc3c7 }));
        filo.position.set(0, 0.3, 0.15);
        herramienta.add(palo, filo);
        herramienta.position.set(0, -0.3, 0.2);
        herramienta.rotation.x = Math.PI / 2;
        herramienta.visible = false;
        brazoDer.add(herramienta);
        this.avatar.herramienta = herramienta;

        this.jugadorGroup.position.set(0, 0, 6);
        this.scene.add(this.jugadorGroup);
    },

    configurarControles: function () {
        const setTecla = (e, estado) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || key === 'arrowup') this.teclas.w = estado;
            if (key === 's' || key === 'arrowdown') this.teclas.s = estado;
            if (key === 'a' || key === 'arrowleft') this.teclas.a = estado;
            if (key === 'd' || key === 'arrowright') this.teclas.d = estado;
        };
        window.addEventListener('keydown', (e) => setTecla(e, true));
        window.addEventListener('keyup', (e) => setTecla(e, false));
    },

    // [MODIFICADO] Fusión de eventos Táctiles y de Teclado
    procesarMovimiento: function () {
        let movX = 0, movZ = 0;
        let esAnalogo = false;

        // Entradas de Teclado (Digitales: 0 o 1)
        if (this.teclas.w) movZ -= 1;
        if (this.teclas.s) movZ += 1;
        if (this.teclas.a) movX -= 1;
        if (this.teclas.d) movX += 1;

        // Entradas del Joystick Virtual (Análogas: de 0.0 a 1.0). Sobreescribe teclado si se usa.
        if (this.joystickData.active) {
            movX = this.joystickData.x;
            movZ = this.joystickData.y;
            esAnalogo = true;
        }

        // Zona muerta mínima para el joystick
        this.isMoving = (Math.abs(movX) > 0.05 || Math.abs(movZ) > 0.05);

        if (this.isMoving) {
            // Normalizar vectores digitales para evitar velocidad extra en diagonal
            if (!esAnalogo) {
                const length = Math.sqrt(movX * movX + movZ * movZ);
                movX = movX / length;
                movZ = movZ / length;
            }

            // Aplicar velocidad al jugador
            this.jugadorGroup.position.x += movX * this.velocidadJugador;
            this.jugadorGroup.position.z += movZ * this.velocidadJugador;

            // Rotación suave del avatar hacia donde camina
            const anguloDestino = Math.atan2(movX, movZ);
            const diff = anguloDestino - this.jugadorGroup.rotation.y;
            this.jugadorGroup.rotation.y += Math.atan2(Math.sin(diff), Math.cos(diff)) * 0.2;
        }

        const posObjetivo = this.jugadorGroup.position.clone().add(this.cameraOffset);
        this.camera.position.lerp(posObjetivo, 0.1);
        this.camera.lookAt(this.jugadorGroup.position);
    },

    animarAvatar: function () {
        const time = Date.now() * 0.015;

        if (this.isWorking) {
            this.avatar.herramienta.visible = true;
            this.avatar.brazos[1].rotation.x = Math.sin(time * 2) * -1 - 0.5;
            this.avatar.brazos[0].rotation.x = 0;
            this.avatar.piernas[0].rotation.x = 0;
            this.avatar.piernas[1].rotation.x = 0;
            this.avatar.cuerpo.rotation.x = 0.2;
        } else if (this.isMoving) {
            this.avatar.herramienta.visible = false;
            // Caminata
            this.avatar.piernas[0].rotation.x = Math.sin(time) * 0.6;
            this.avatar.piernas[1].rotation.x = Math.sin(time + Math.PI) * 0.6;
            this.avatar.brazos[0].rotation.x = Math.sin(time + Math.PI) * 0.5;
            this.avatar.brazos[1].rotation.x = Math.sin(time) * 0.5;
            this.avatar.cuerpo.rotation.x = 0;
            this.avatar.cuerpo.position.y = 0.8 + Math.abs(Math.sin(time)) * 0.05;
        } else {
            this.avatar.herramienta.visible = false;
            this.avatar.piernas[0].rotation.x = THREE.MathUtils.lerp(this.avatar.piernas[0].rotation.x, 0, 0.1);
            this.avatar.piernas[1].rotation.x = THREE.MathUtils.lerp(this.avatar.piernas[1].rotation.x, 0, 0.1);
            this.avatar.brazos[0].rotation.x = THREE.MathUtils.lerp(this.avatar.brazos[0].rotation.x, 0, 0.1);
            this.avatar.brazos[1].rotation.x = THREE.MathUtils.lerp(this.avatar.brazos[1].rotation.x, 0, 0.1);
            this.avatar.cuerpo.rotation.x = THREE.MathUtils.lerp(this.avatar.cuerpo.rotation.x, 0, 0.1);
            this.avatar.cuerpo.position.y = 0.8;
        }
    },

    procesarProximidadLaboral: function () {
        if (!GameState.fasePagada) {
            this.isWorking = false;
            return;
        }

        const centro = new THREE.Vector3(0, 0, 0);
        const distancia = this.jugadorGroup.position.distanceTo(centro);

        if (distancia < this.radioInteraccion) {
            this.isWorking = !this.isMoving;
            this.cooldownTrabajo++;

            if (this.isWorking && this.cooldownTrabajo > 10) {
                TycoonEngine.agregarProgreso(GameState.poderClicBase, true);
                this.crearParticulaTierra(this.jugadorGroup.position);
                this.cooldownTrabajo = 0;
            }
        } else {
            this.isWorking = false;
        }
    },

    crearParticulaTierra: function (origen) {
        const mat = new THREE.MeshBasicMaterial({ color: 0x6e4b33 });
        const geom = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const particula = new THREE.Mesh(geom, mat);

        const offsetFrontal = new THREE.Vector3(0, 0, 0.5);
        offsetFrontal.applyQuaternion(this.jugadorGroup.quaternion);
        particula.position.copy(origen).add(offsetFrontal);

        particula.userData = {
            vel: new THREE.Vector3((Math.random() - 0.5) * 0.1, 0.1 + Math.random() * 0.1, (Math.random() - 0.5) * 0.1),
            vida: 1.0
        };
        this.scene.add(particula);
        this.particulasTierra.push(particula);
    },

    animarVFX: function () {
        for (let i = this.particulasTierra.length - 1; i >= 0; i--) {
            const p = this.particulasTierra[i];
            p.position.add(p.userData.vel);
            p.userData.vel.y -= 0.01;
            p.rotation.x += 0.2;
            p.userData.vida -= 0.05;

            if (p.userData.vida <= 0 || p.position.y < 0) {
                this.scene.remove(p);
                this.particulasTierra.splice(i, 1);
            }
        }

        for (let i = this.recolectables.length - 1; i >= 0; i--) {
            const obj = this.recolectables[i];
            obj.position.lerp(this.jugadorGroup.position.clone().add(new THREE.Vector3(0, 1, 0)), 0.15);
            obj.scale.multiplyScalar(0.9);

            if (obj.position.distanceTo(this.jugadorGroup.position) < 1.0 || obj.scale.x < 0.1) {
                this.scene.remove(obj);
                this.recolectables.splice(i, 1);
            }
        }
    },

    actualizarGeometrias: function () {
        const idx = GameState.faseActualIndex;
        if (this.faseRenderizada >= 11 && idx === 0) {
            this.generarEfectoCosecha();
        }

        if (this.faseRenderizada === idx) return;
        this.faseRenderizada = idx;

        while (this.parcelaGroup.children.length > 0) {
            this.parcelaGroup.remove(this.parcelaGroup.children[0]);
        }
        this.plantasMeshes = [];

        if (idx === 0) {
            const rocaGeom = new THREE.DodecahedronGeometry(0.3);
            const rocaMat = new THREE.MeshLambertMaterial({ color: 0x95a5a6 });
            for (let i = 0; i < 20; i++) {
                const roca = new THREE.Mesh(rocaGeom, rocaMat);
                roca.position.set((Math.random() - 0.5) * 8, 0.1, (Math.random() - 0.5) * 8);
                roca.castShadow = true;
                this.parcelaGroup.add(roca);
            }
        }
        else if (idx >= 5 && idx <= 12) {
            const esCosecha = (idx >= 11);
            const colorPlanta = esCosecha ? 0xf1c40f : 0x2ecc71;
            const plantaGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            plantaGeom.translate(0, 0.25, 0);
            const plantaMat = new THREE.MeshLambertMaterial({ color: colorPlanta });

            for (let x = -3.5; x <= 3.5; x += 1.5) {
                for (let z = -3.5; z <= 3.5; z += 1.5) {
                    const planta = new THREE.Mesh(plantaGeom, plantaMat);
                    planta.position.set(x + (Math.random() - 0.5) * 0.3, 0, z + (Math.random() - 0.5) * 0.3);
                    planta.castShadow = true;
                    planta.scale.set(0.1, 0.1, 0.1);
                    this.parcelaGroup.add(planta);
                    this.plantasMeshes.push(planta);
                }
            }
        }
    },

    generarEfectoCosecha: function () {
        this.plantasMeshes.forEach(planta => {
            const volar = planta.clone();
            volar.material = new THREE.MeshLambertMaterial({ color: 0xf1c40f });
            this.scene.add(volar);
            this.recolectables.push(volar);
        });
    },

    animarPlantas: function () {
        const idx = GameState.faseActualIndex;
        if (idx >= 5 && idx <= 12) {
            const crecimiento = ((idx - 5) + (this.porcentajeProgreso / 100)) / 7.0;
            const escalaObjetivo = 0.2 + (crecimiento * 1.5);

            this.plantasMeshes.forEach(planta => {
                planta.scale.lerp(new THREE.Vector3(escalaObjetivo, escalaObjetivo, escalaObjetivo), 0.1);
            });
        }
    },

    animar: function () {
        requestAnimationFrame(() => this.animar());
        this.procesarMovimiento();
        this.procesarProximidadLaboral();
        this.animarAvatar();
        this.actualizarGeometrias();
        this.animarPlantas();
        this.animarVFX();
        this.renderer.render(this.scene, this.camera);
    },

    resize: function () {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 15;
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
        document.getElementById('fase-title').innerText = GameState.fases[GameState.faseActualIndex].nombre;
        const costoFase = TycoonEngine.obtenerCostoFase();
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
                if (upg.id === 'fertilizante' && GameState.faseActualIndex > 6) { puedeComprar = false; textoBoton = 'TARDE'; }
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
            if (btn && !btn.disabled) btn.addEventListener('click', () => TycoonEngine.comprarMejora(upg.id));
        });
    },

    mostrarFlotante: function (texto, x, y, color) {
        const el = document.createElement('div');
        el.className = 'floating-text';
        el.innerText = texto;
        el.style.position = 'absolute';
        if (x === window.innerWidth / 2) {
            el.style.left = `50%`;
            el.style.top = `40%`;
            el.style.transform = 'translate(-50%, -50%)';
        } else {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }
        el.style.color = color;
        el.style.zIndex = '100';
        el.style.fontWeight = '900';
        el.style.fontSize = '28px';
        el.style.textShadow = '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
};