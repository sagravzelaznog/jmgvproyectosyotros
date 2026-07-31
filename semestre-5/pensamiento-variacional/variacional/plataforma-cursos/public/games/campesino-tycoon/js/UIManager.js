import { GameState } from './GameState.js';
import { TycoonEngine } from './TycoonEngine.js';

export const UIManager = {
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    
    // Modelos
    modelCampesino: null,
    modelPeon: null,
    modelCapataz: null,
    mixers: [], // Para animaciones
    clock: null,
    
    // Entorno
    planoTierra: null,

    init: function () {
        this.canvas = document.getElementById('game-canvas');
        
        // Setup Three.js
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Cielo azul
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        // Perspectiva isométrica/inclinada
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
        
        this.clock = new THREE.Clock();

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        // Suelo (Parcela)
        const planeGeo = new THREE.PlaneGeometry(50, 50);
        const planeMat = new THREE.MeshLambertMaterial({ color: 0x785a3c });
        this.planoTierra = new THREE.Mesh(planeGeo, planeMat);
        this.planoTierra.rotation.x = -Math.PI / 2;
        this.scene.add(this.planoTierra);

        // Cargar Modelos (GLTF)
        const loader = new THREE.GLTFLoader();
        // Usamos el mismo modelo (Soldier) de prueba para los 3, pero los escalamos y posicionamos distinto
        loader.load('./assets/models/Campesino.glb', (gltf) => {
            this.modelCampesino = gltf.scene;
            this.modelCampesino.scale.set(3, 3, 3);
            this.modelCampesino.position.set(0, 0, 0); // Centro
            this.scene.add(this.modelCampesino);
            
            // Animación
            if(gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(this.modelCampesino);
                mixer.clipAction(gltf.animations[0]).play(); // Idle
                this.mixers.push(mixer);
            }
        });

        loader.load('./assets/models/Campesino.glb', (gltf) => {
            this.modelPeon = gltf.scene;
            this.modelPeon.scale.set(2.5, 2.5, 2.5);
            this.modelPeon.position.set(-6, 0, 2); // Izquierda
            this.modelPeon.visible = false;
            this.scene.add(this.modelPeon);
            
            if(gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(this.modelPeon);
                const action = mixer.clipAction(gltf.animations[1] || gltf.animations[0]); // Run/Walk si existe
                action.timeScale = 1.5;
                action.play();
                this.mixers.push(mixer);
            }
        });

        loader.load('./assets/models/Campesino.glb', (gltf) => {
            this.modelCapataz = gltf.scene;
            this.modelCapataz.scale.set(3.2, 3.2, 3.2);
            this.modelCapataz.position.set(6, 0, -2); // Derecha
            this.modelCapataz.visible = false;
            this.scene.add(this.modelCapataz);
            
            if(gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(this.modelCapataz);
                mixer.clipAction(gltf.animations[0]).play();
                this.mixers.push(mixer);
            }
        });

        // UI HTML Events
        document.getElementById('btn-pagar').addEventListener('click', () => TycoonEngine.intentarPagarInsumos());
        document.getElementById('btn-prestamo').addEventListener('click', () => TycoonEngine.pedirPrestamo());

        document.getElementById('shop-toggle').addEventListener('click', () => {
            document.getElementById('shop-panel').classList.toggle('open');
        });

        const interactuar = (e) => {
            if (!GameState.fasePagada) return;
            TycoonEngine.agregarProgreso(GameState.poderClicBase, true);
            
            let x, y;
            if (e.changedTouches) {
                x = e.changedTouches[0].clientX;
                y = e.changedTouches[0].clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }
            this.mostrarFlotante("+1", x, y, '#f1c40f');
        };

        // Escuchar clics en el canvas globalmente
        this.canvas.addEventListener('mousedown', interactuar);
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); interactuar(e); }, { passive: false });

        if (TycoonEngine.obtenerCostoFase() === 0) GameState.fasePagada = true;

        this.actualizarTextos();
        this.renderizarTienda();
        
        // Bucle de render visual
        this.animate();
    },

    resize: function() {
        if(!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    actualizarBarraProgreso: function(porcentaje) {
        document.getElementById('progress-bar').style.width = `${porcentaje}%`;
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
                div.innerHTML = `
                    <div class="upgrade-info">
                        <h4><i class="fas fa-lock"></i> Desbloqueo: ${upg.reqXp} XP</h4>
                    </div>
                `;
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
                    <button class="btn-buy" id="buy-${upg.id}" ${!puedeComprar ? 'disabled' : ''}>
                        ${textoBoton}
                    </button>
                `;
            }
            container.appendChild(div);
            
            const btn = document.getElementById(`buy-${upg.id}`);
            if(btn && !btn.disabled) {
                btn.addEventListener('click', () => TycoonEngine.comprarMejora(upg.id));
            }
        });
    },

    mostrarFlotante: function (texto, x, y, color) {
        const el = document.createElement('div');
        el.className = 'floating-text';
        el.innerText = texto;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.color = color;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    },

    animate: function () {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Actualizar animaciones
        this.mixers.forEach(mixer => mixer.update(delta));

        // Lógica de visibilidad y color de tierra
        const idx = GameState.faseActualIndex;
        let colorHex = 0x785a3c;
        if (idx === 0) colorHex = 0xa0a0a0; // Piedras
        else if (idx >= 1 && idx <= 4) colorHex = 0x654321; // Tierra preparada
        else if (idx >= 5 && idx <= 10) colorHex = 0x27ae60; // Verde plantas
        else if (idx >= 11 && idx <= 12) colorHex = 0xf1c40f; // Amarillo cosecha

        if(this.planoTierra) {
            this.planoTierra.material.color.setHex(colorHex);
        }

        // Mostrar Peon si hay trabajo auto
        if (this.modelPeon) {
            this.modelPeon.visible = (GameState.progresoPorSegundo > 0);
        }
        
        // Mostrar Capataz si se tiene la mejora
        if (this.modelCapataz) {
            this.modelCapataz.visible = GameState.tieneCapataz;
        }

        // Renderizar
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
