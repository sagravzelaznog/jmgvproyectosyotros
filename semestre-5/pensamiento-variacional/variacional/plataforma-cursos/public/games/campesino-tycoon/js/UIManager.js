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
    farmObjects: null,
    lastRenderedFase: -1,

    // Lógica Animación Campesino
    campesinoState: 'IDLE',
    targetRock: null,
    carriedRock: null,
    wheelbarrowObj: null,
    campesinoAction: null,
    campesinoMixer: null,
    campesinoAnimations: [],

    init: function () {
        this.canvas = document.getElementById('game-canvas');
        
        // Setup Three.js
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Cielo azul
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
        
        this.clock = new THREE.Clock();

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        // Grupo para objetos dinámicos (rocas, plantas)
        this.farmObjects = new THREE.Group();
        this.scene.add(this.farmObjects);

        // Suelo (Parcela) con Textura
        const textureLoader = new THREE.TextureLoader();
        const planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        textureLoader.load('./assets/tierra.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10); // Repetir textura
            planeMat.map = texture;
            planeMat.needsUpdate = true;
        });

        const planeGeo = new THREE.PlaneGeometry(50, 50);
        this.planoTierra = new THREE.Mesh(planeGeo, planeMat);
        this.planoTierra.rotation.x = -Math.PI / 2;
        this.scene.add(this.planoTierra);

        // Cargar Modelos (GLTF) - Personajes
        const loader = new THREE.GLTFLoader();
        loader.load('./assets/models/Campesino.glb', (gltf) => {
            this.modelCampesino = gltf.scene;
            this.modelCampesino.scale.set(3, 3, 3);
            this.modelCampesino.position.set(0, 0, 0);
            this.scene.add(this.modelCampesino);
            if(gltf.animations && gltf.animations.length > 0) {
                this.campesinoMixer = new THREE.AnimationMixer(this.modelCampesino);
                this.campesinoAnimations = gltf.animations;
                this.campesinoAction = this.campesinoMixer.clipAction(this.campesinoAnimations[0]);
                this.campesinoAction.play();
                this.mixers.push(this.campesinoMixer);
            }
        });

        loader.load('./assets/models/Campesino.glb', (gltf) => {
            this.modelPeon = gltf.scene;
            this.modelPeon.scale.set(2.5, 2.5, 2.5);
            this.modelPeon.position.set(-6, 0, 2);
            this.modelPeon.visible = false;
            this.scene.add(this.modelPeon);
            if(gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(this.modelPeon);
                const action = mixer.clipAction(gltf.animations[1] || gltf.animations[0]); // 1 es Walk/Run en Soldier
                action.timeScale = 1.5;
                action.play();
                this.mixers.push(mixer);
            }
        });

        loader.load('./assets/models/Campesino.glb', (gltf) => {
            this.modelCapataz = gltf.scene;
            this.modelCapataz.scale.set(3.2, 3.2, 3.2);
            this.modelCapataz.position.set(6, 0, -2);
            this.modelCapataz.visible = false;
            this.scene.add(this.modelCapataz);
            if(gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(this.modelCapataz);
                mixer.clipAction(gltf.animations[0]).play();
                this.mixers.push(mixer);
            }
        });

        // Eventos UI
        document.getElementById('btn-pagar').addEventListener('click', () => TycoonEngine.intentarPagarInsumos());
        document.getElementById('btn-prestamo').addEventListener('click', () => TycoonEngine.pedirPrestamo());
        document.getElementById('shop-toggle').addEventListener('click', () => document.getElementById('shop-panel').classList.toggle('open'));

        const interactuar = (e) => {
            if (!GameState.fasePagada) return;
            TycoonEngine.agregarProgreso(GameState.poderClicBase, true);
            
            // Animación Campesino al hacer clic en Fase 0
            if (GameState.faseActualIndex === 0 && this.campesinoState === 'IDLE' && this.modelCampesino && this.farmObjects) {
                let possibleRocks = this.farmObjects.children.filter(c => c !== this.wheelbarrowObj && !c.isCarried && c.isRock);
                if (possibleRocks.length > 0) {
                    this.targetRock = possibleRocks[Math.floor(Math.random() * possibleRocks.length)];
                    this.campesinoState = 'MOVING_TO_ROCK';
                    this.playCampesinoAnimation(1); // 1 = Run/Walk
                }
            }

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

        this.canvas.addEventListener('mousedown', interactuar);
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); interactuar(e); }, { passive: false });

        if (TycoonEngine.obtenerCostoFase() === 0) GameState.fasePagada = true;

        this.actualizarTextos();
        this.renderizarTienda();
        this.animate();
    },

    resize: function() {
        if(!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    playCampesinoAnimation: function(index) {
        if(!this.campesinoMixer || !this.campesinoAnimations[index]) return;
        if(this.campesinoAction) {
            // Animación cruzada suave de 0.2s
            const previousAction = this.campesinoAction;
            this.campesinoAction = this.campesinoMixer.clipAction(this.campesinoAnimations[index]);
            this.campesinoAction.reset();
            this.campesinoAction.play();
            previousAction.crossFadeTo(this.campesinoAction, 0.2, true);
        } else {
            this.campesinoAction = this.campesinoMixer.clipAction(this.campesinoAnimations[index]);
            this.campesinoAction.play();
        }
    },

    updateFarmObjects: function(faseIndex) {
        // Reset state
        this.campesinoState = 'IDLE';
        this.playCampesinoAnimation(0);
        if (this.carriedRock && this.modelCampesino) {
            this.modelCampesino.remove(this.carriedRock);
            this.carriedRock = null;
        }

        // Limpiar objetos anteriores
        while(this.farmObjects.children.length > 0) { 
            this.farmObjects.remove(this.farmObjects.children[0]); 
        }

        const radioEsparcimiento = 15;

        if (faseIndex === 0) {
            // Carretilla
            this.wheelbarrowObj = new THREE.Group();
            const wbMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
            const wbGeo = new THREE.BoxGeometry(2, 1, 3);
            const wbMesh = new THREE.Mesh(wbGeo, wbMat);
            wbMesh.position.y = 1;
            this.wheelbarrowObj.add(wbMesh);
            const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
            const wheelMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI/2;
            wheel.position.set(0, 0.5, 1.5);
            this.wheelbarrowObj.add(wheel);
            
            this.wheelbarrowObj.position.set(8, 0, 8); // A un lado
            this.farmObjects.add(this.wheelbarrowObj);

            // Rocas
            const rockGeo = new THREE.DodecahedronGeometry(0.5);
            const rockMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
            for (let i = 0; i < 40; i++) {
                const rock = new THREE.Mesh(rockGeo, rockMat);
                rock.isRock = true;
                rock.position.set(
                    (Math.random() - 0.5) * radioEsparcimiento * 2,
                    0.25,
                    (Math.random() - 0.5) * radioEsparcimiento * 2
                );
                if(Math.abs(rock.position.x) < 3 && Math.abs(rock.position.z) < 3) continue;
                rock.rotation.y = Math.random() * Math.PI;
                rock.scale.setScalar(Math.random() * 0.5 + 0.5);
                this.farmObjects.add(rock);
            }
        } 
        else if (faseIndex >= 5 && faseIndex <= 10) {
            const growthProgress = (faseIndex - 4) / 6;
            const plantHeight = 0.5 + (growthProgress * 1.5);
            const plantGeo = new THREE.ConeGeometry(0.2, plantHeight, 5);
            const plantMat = new THREE.MeshLambertMaterial({ color: 0x2ecc71 });
            
            for (let i = 0; i < 80; i++) {
                const plant = new THREE.Mesh(plantGeo, plantMat);
                plant.position.set(
                    (Math.random() - 0.5) * radioEsparcimiento * 2,
                    plantHeight / 2,
                    (Math.random() - 0.5) * radioEsparcimiento * 2
                );
                if(Math.abs(plant.position.x) < 2 && Math.abs(plant.position.z) < 2) continue;
                this.farmObjects.add(plant);
            }
        }
        else if (faseIndex >= 11 && faseIndex <= 12) {
            const harvestGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 5);
            const harvestMat = new THREE.MeshLambertMaterial({ color: 0xf1c40f });
            
            for (let i = 0; i < 80; i++) {
                const harvest = new THREE.Mesh(harvestGeo, harvestMat);
                harvest.position.set(
                    (Math.random() - 0.5) * radioEsparcimiento * 2,
                    1.25,
                    (Math.random() - 0.5) * radioEsparcimiento * 2
                );
                if(Math.abs(harvest.position.x) < 2 && Math.abs(harvest.position.z) < 2) continue;
                harvest.rotation.x = (Math.random() - 0.5) * 0.2;
                harvest.rotation.z = (Math.random() - 0.5) * 0.2;
                this.farmObjects.add(harvest);
            }
        }
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
        this.mixers.forEach(mixer => mixer.update(delta));

        const idx = GameState.faseActualIndex;
        
        // Actualizar Objetos si cambió de fase
        if (idx !== this.lastRenderedFase) {
            this.updateFarmObjects(idx);
            this.lastRenderedFase = idx;
        }

        // --- LÓGICA DE ANIMACIÓN DEL CAMPESINO (FASE 0) ---
        if (this.modelCampesino) {
            if (this.campesinoState === 'MOVING_TO_ROCK' && this.targetRock) {
                const dest = this.targetRock.position.clone();
                dest.y = this.modelCampesino.position.y;
                
                // Rotar suavemente hacia destino
                const quaternion = new THREE.Quaternion();
                const m = new THREE.Matrix4();
                m.lookAt(this.modelCampesino.position, dest, this.modelCampesino.up);
                quaternion.setFromRotationMatrix(m);
                this.modelCampesino.quaternion.slerp(quaternion, 10 * delta);

                // Mover
                if (this.modelCampesino.position.distanceTo(dest) > 1.0) {
                    this.modelCampesino.translateZ(5 * delta); // El modelo mira hacia +Z o -Z dependiendo, ajustado con lerp
                    // TranslateZ se mueve en el eje local. Si lookAt() funciona, avanzará hacia adelante.
                    // Para evitar complicaciones de ejes locales del GLB, usamos lerp o moveTowards
                    this.modelCampesino.position.lerp(dest, 3 * delta);
                } else {
                    // Alcanzó la piedra
                    this.targetRock.isCarried = true;
                    this.carriedRock = this.targetRock;
                    this.farmObjects.remove(this.targetRock);
                    this.modelCampesino.add(this.carriedRock);
                    
                    // Ajustar escala porque al emparejar hereda la escala del campesino (que es 3x3x3)
                    this.carriedRock.scale.setScalar(0.2); 
                    this.carriedRock.position.set(0, 0.5, 0.2); // Posición relativa a las manos/frente
                    
                    this.campesinoState = 'MOVING_TO_WHEELBARROW';
                }
            } 
            else if (this.campesinoState === 'MOVING_TO_WHEELBARROW' && this.wheelbarrowObj) {
                const dest = this.wheelbarrowObj.position.clone();
                dest.y = this.modelCampesino.position.y;
                
                const quaternion = new THREE.Quaternion();
                const m = new THREE.Matrix4();
                m.lookAt(this.modelCampesino.position, dest, this.modelCampesino.up);
                quaternion.setFromRotationMatrix(m);
                this.modelCampesino.quaternion.slerp(quaternion, 10 * delta);

                if (this.modelCampesino.position.distanceTo(dest) > 2.5) {
                    this.modelCampesino.position.lerp(dest, 3 * delta);
                } else {
                    // Alcanzó carretilla
                    this.modelCampesino.remove(this.carriedRock);
                    this.wheelbarrowObj.add(this.carriedRock);
                    this.carriedRock.scale.setScalar(0.5); // Restaurar escala relativa a la carretilla
                    this.carriedRock.position.set((Math.random()-0.5), 1 + Math.random(), (Math.random()-0.5));
                    this.carriedRock = null;
                    
                    this.campesinoState = 'IDLE';
                    this.playCampesinoAnimation(0); // Volver a Idle
                }
            }
            else if (this.campesinoState === 'IDLE' && idx !== 0) {
                // Asegurar que si no está en fase de rocas vuelva al centro lentamente
                const center = new THREE.Vector3(0,0,0);
                if (this.modelCampesino.position.distanceTo(center) > 0.5) {
                    const quaternion = new THREE.Quaternion();
                    const m = new THREE.Matrix4();
                    m.lookAt(this.modelCampesino.position, center, this.modelCampesino.up);
                    quaternion.setFromRotationMatrix(m);
                    this.modelCampesino.quaternion.slerp(quaternion, 5 * delta);
                    this.modelCampesino.position.lerp(center, 2 * delta);
                }
            }
        }

        // Tinte de la tierra
        if(this.planoTierra) {
            if (idx === 0) this.planoTierra.material.color.setHex(0xaaaaaa); // Grisáceo
            else if (idx >= 1 && idx <= 4) this.planoTierra.material.color.setHex(0xffffff); // Color natural tierra
            else if (idx >= 5 && idx <= 10) this.planoTierra.material.color.setHex(0xbbffbb); // Tinte verde
            else if (idx >= 11 && idx <= 12) this.planoTierra.material.color.setHex(0xffffbb); // Tinte amarillo
        }

        // Mostrar Peon si hay trabajo auto
        if (this.modelPeon) this.modelPeon.visible = (GameState.progresoPorSegundo > 0);
        // Mostrar Capataz si se tiene la mejora
        if (this.modelCapataz) this.modelCapataz.visible = GameState.tieneCapataz;

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
