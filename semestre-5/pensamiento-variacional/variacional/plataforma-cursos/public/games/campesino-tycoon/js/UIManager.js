import { GameState } from './GameState.js';
import { TycoonEngine } from './TycoonEngine.js';

class CharacterAgent {
    constructor(mesh, animations, isPlayerControlled) {
        this.mesh = mesh;
        this.state = 'IDLE';
        this.targetRock = null;
        this.carriedRock = null;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = isPlayerControlled ? 7 : (3 + Math.random() * 2);
        
        this.animations = animations;
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.currentAction = null;
        
        if (this.animations && this.animations.length > 0) {
            this.currentAction = this.mixer.clipAction(this.animations[0]);
            this.currentAction.play();
        }
    }
    
    playAnim(index) {
        if (!this.animations[index]) return;
        if (this.currentAction) {
            const prev = this.currentAction;
            this.currentAction = this.mixer.clipAction(this.animations[index]);
            this.currentAction.reset();
            this.currentAction.play();
            prev.crossFadeTo(this.currentAction, 0.2, true);
        } else {
            this.currentAction = this.mixer.clipAction(this.animations[index]);
            this.currentAction.play();
        }
    }
    
    reset() {
        this.state = 'IDLE';
        this.playAnim(0);
        if (this.carriedRock) {
            this.mesh.remove(this.carriedRock);
            this.carriedRock = null;
        }
        if (this.targetRock) {
            this.targetRock.isTargeted = false;
            this.targetRock = null;
        }
    }
}

class DropoffVehicle {
    constructor(mesh, capacity) {
        this.mesh = mesh;
        this.capacity = capacity;
        this.currentLoad = 0;
        this.state = 'IDLE'; // IDLE, LEAVING, RETURNING
        this.startPos = mesh.position.clone();
        this.leavePos = this.startPos.clone().add(new THREE.Vector3(30, 0, 0)); // Afuera de la pantalla
    }
}

export const UIManager = {
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    clock: null,
    
    // Entorno
    planoTierra: null,
    farmObjects: null,
    lastRenderedFase: -1,

    // Lógica AI
    agents: [],
    playerAgent: null,
    vehicles: [],
    
    // Almacenamos el modelo original para clonarlo
    baseModel: null,
    baseAnimations: null,
    
    lastPeonCount: -1, // Para detectar compras de jornaleros

    init: function () {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
        
        this.clock = new THREE.Clock();
        this.resize();
        window.addEventListener('resize', () => this.resize());

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        this.farmObjects = new THREE.Group();
        this.scene.add(this.farmObjects);

        const textureLoader = new THREE.TextureLoader();
        const planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        textureLoader.load('./assets/tierra.png', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
            planeMat.map = texture;
            planeMat.needsUpdate = true;
        });

        const planeGeo = new THREE.PlaneGeometry(50, 50);
        this.planoTierra = new THREE.Mesh(planeGeo, planeMat);
        this.planoTierra.rotation.x = -Math.PI / 2;
        this.scene.add(this.planoTierra);

        // Cargar Modelo Base
        const loader = new THREE.GLTFLoader();
        loader.load('./assets/models/Campesino.glb', (gltf) => {
            this.baseModel = gltf.scene;
            this.baseAnimations = gltf.animations;
            
            // Instanciar al Campesino (Jugador)
            const campMesh = THREE.SkeletonUtils.clone(this.baseModel);
            campMesh.scale.set(3, 3, 3);
            campMesh.position.set(0, 0, 0);
            this.scene.add(campMesh);
            this.playerAgent = new CharacterAgent(campMesh, this.baseAnimations, true);
            this.agents.push(this.playerAgent);
            
            this.verificarJornaleros();
        });

        document.getElementById('btn-pagar').addEventListener('click', () => TycoonEngine.intentarPagarInsumos());
        document.getElementById('btn-prestamo').addEventListener('click', () => TycoonEngine.pedirPrestamo());
        document.getElementById('shop-toggle').addEventListener('click', () => document.getElementById('shop-panel').classList.toggle('open'));

        const interactuar = (e) => {
            if (!GameState.fasePagada) return;
            TycoonEngine.agregarProgreso(GameState.poderClicBase, true);
            
            // Clic Jugador
            if (GameState.faseActualIndex === 0 && this.playerAgent && this.playerAgent.state === 'IDLE') {
                let rocks = this.farmObjects.children.filter(c => c.isRock && !c.isTargeted);
                if (rocks.length > 0) {
                    let r = rocks[Math.floor(Math.random() * rocks.length)];
                    r.isTargeted = true;
                    this.playerAgent.targetRock = r;
                    this.playerAgent.state = 'MOVING_TO_ROCK';
                    this.playerAgent.playAnim(1); // Run/Walk
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

    verificarJornaleros: function() {
        if(!this.baseModel) return;
        const peonCount = TycoonEngine.upgrades.peon.nivel + (GameState.tieneCapataz ? 1 : 0);
        
        if (peonCount !== this.lastPeonCount) {
            // Eliminar AIs anteriores que no sean el jugador
            this.agents = this.agents.filter(a => a.isPlayerControlled);
            
            // Recrear
            for(let i=0; i<peonCount; i++) {
                const mesh = THREE.SkeletonUtils.clone(this.baseModel);
                mesh.scale.set(2.5, 2.5, 2.5);
                mesh.position.set(-6 + (Math.random()*4), 0, 2 + (Math.random()*4));
                this.scene.add(mesh);
                const agent = new CharacterAgent(mesh, this.baseAnimations, false);
                this.agents.push(agent);
            }
            this.lastPeonCount = peonCount;
        }
    },

    resize: function() {
        if(!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    updateFarmObjects: function(faseIndex) {
        // Reset vehicles and objects
        this.vehicles = [];
        this.agents.forEach(a => {
            a.reset();
            
            // Lógica del Azadón para Peones en Fases 1 a 4
            let asadon = a.mesh.getObjectByName('azadon');
            if (faseIndex >= 1 && faseIndex <= 4 && !a.isPlayerControlled) {
                if (!asadon) {
                    const grp = new THREE.Group();
                    grp.name = 'azadon';
                    // Palo de madera
                    const paloGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
                    const paloMat = new THREE.MeshLambertMaterial({color: 0x8b4513});
                    const palo = new THREE.Mesh(paloGeo, paloMat);
                    grp.add(palo);
                    // Hoja de metal
                    const hojaGeo = new THREE.BoxGeometry(0.3, 0.4, 0.05);
                    const hojaMat = new THREE.MeshLambertMaterial({color: 0x777777});
                    const hoja = new THREE.Mesh(hojaGeo, hojaMat);
                    hoja.position.set(0.15, -0.6, 0);
                    grp.add(hoja);
                    
                    // Posicionarlo a la altura de las manos
                    grp.position.set(0.4, 0.8, 0.3);
                    grp.rotation.z = Math.PI / 4;
                    a.mesh.add(grp);
                }
            } else {
                if (asadon) {
                    a.mesh.remove(asadon);
                }
            }
        });

        while(this.farmObjects.children.length > 0) { 
            this.farmObjects.remove(this.farmObjects.children[0]); 
        }

        const radioEsparcimiento = 15;

        if (faseIndex === 0) {
            // 1. Carretilla
            const wbGrp = new THREE.Group();
            const wbMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
            const wbGeo = new THREE.BoxGeometry(2, 1, 3);
            const wbMesh = new THREE.Mesh(wbGeo, wbMat);
            wbMesh.position.y = 1;
            wbGrp.add(wbMesh);
            const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
            const wheelMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI/2;
            wheel.position.set(0, 0.5, 1.5);
            wbGrp.add(wheel);
            wbGrp.position.set(10, 0, 8);
            this.farmObjects.add(wbGrp);
            this.vehicles.push(new DropoffVehicle(wbGrp, 100));

            // 2. Yunta de Bueyes
            if (GameState.tieneYunta) {
                const yuntaGrp = new THREE.Group();
                const oxMat = new THREE.MeshLambertMaterial({color: 0x5c4033});
                const oxGeo = new THREE.BoxGeometry(1.5, 2, 3.5);
                const ox1 = new THREE.Mesh(oxGeo, oxMat); ox1.position.set(-1.2, 1, 2);
                const ox2 = new THREE.Mesh(oxGeo, oxMat); ox2.position.set(1.2, 1, 2);
                yuntaGrp.add(ox1); yuntaGrp.add(ox2);
                const trailerMat = new THREE.MeshLambertMaterial({color: 0x8b4513});
                const trailerGeo = new THREE.BoxGeometry(4.5, 0.8, 5);
                const trailer = new THREE.Mesh(trailerGeo, trailerMat);
                trailer.position.set(0, 0.8, -2);
                yuntaGrp.add(trailer);
                yuntaGrp.position.set(-12, 0, 8);
                this.farmObjects.add(yuntaGrp);
                this.vehicles.push(new DropoffVehicle(yuntaGrp, 250));
            }

            // 3. Rocas
            const rockGeo = new THREE.DodecahedronGeometry(0.5);
            const rockMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
            // Mas rocas para ver trabajar a multiples AIs
            for (let i = 0; i < 150; i++) {
                const rock = new THREE.Mesh(rockGeo, rockMat);
                rock.isRock = true;
                rock.isTargeted = false;
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
        document.getElementById('fase-title').innerText = GameState.fases[GameState.faseActualIndex].nombre;
        const btnPagar = document.getElementById('btn-pagar');
        const btnPrestamo = document.getElementById('btn-prestamo');
        const progressContainer = document.getElementById('progress-container');
        if (!GameState.fasePagada) {
            progressContainer.style.display = 'none';
            if (GameState.capital >= TycoonEngine.obtenerCostoFase()) {
                btnPagar.style.display = 'block';
                btnPagar.innerText = `Pagar Insumos ($${TycoonEngine.obtenerCostoFase()})`;
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
        this.verificarJornaleros(); // Actualizar si se compró
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
            if(btn && !btn.disabled) btn.addEventListener('click', () => TycoonEngine.comprarMejora(upg.id));
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
        
        const idx = GameState.faseActualIndex;
        if (idx !== this.lastRenderedFase) {
            this.updateFarmObjects(idx);
            this.lastRenderedFase = idx;
        }

        // Tinte de la tierra
        if(this.planoTierra) {
            if (idx === 0) this.planoTierra.material.color.setHex(0xaaaaaa);
            else if (idx >= 1 && idx <= 4) this.planoTierra.material.color.setHex(0xffffff);
            else if (idx >= 5 && idx <= 10) this.planoTierra.material.color.setHex(0xbbffbb);
            else if (idx >= 11 && idx <= 12) this.planoTierra.material.color.setHex(0xffffbb);
        }

        const rocksLeft = this.farmObjects.children.filter(c => c.isRock).length;

        // Vechicles Logic
        for (let veh of this.vehicles) {
            if (veh.state === 'IDLE') {
                if (veh.currentLoad >= veh.capacity || (rocksLeft === 0 && veh.currentLoad > 0)) {
                    veh.state = 'LEAVING';
                }
            } else if (veh.state === 'LEAVING') {
                veh.mesh.position.lerp(veh.leavePos, 2 * delta);
                if (veh.mesh.position.distanceTo(veh.leavePos) < 1.0) {
                    veh.currentLoad = 0; // Se asume vaciado (se tiran las piedras)
                    veh.state = 'RETURNING';
                }
            } else if (veh.state === 'RETURNING') {
                veh.mesh.position.lerp(veh.startPos, 2 * delta);
                if (veh.mesh.position.distanceTo(veh.startPos) < 1.0) {
                    veh.state = 'IDLE';
                }
            }
        }

        // Agents Logic
        for (let agent of this.agents) {
            agent.mixer.update(delta);
            
            if (idx !== 0) {
                // If not in rock phase, just wander or idle
                if (agent.state !== 'IDLE') agent.reset();
                if (!agent.isPlayerControlled) {
                    agent.mesh.visible = (GameState.progresoPorSegundo > 0);
                    if(agent.mesh.visible) {
                         // Solo que estén de pie
                         agent.playAnim(0);
                    }
                } else {
                    // Player returns to center
                    const center = new THREE.Vector3(0,0,0);
                    if (agent.mesh.position.distanceTo(center) > 0.5) {
                        const m = new THREE.Matrix4(); m.lookAt(agent.mesh.position, center, agent.mesh.up);
                        agent.mesh.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 5*delta);
                        agent.mesh.position.lerp(center, 2*delta);
                    }
                }
                continue;
            }

            // Phase 0 AI (Non-player controlled, auto-fetch)
            if (!agent.isPlayerControlled && agent.state === 'IDLE' && GameState.progresoPorSegundo > 0) {
                agent.mesh.visible = true;
                let rocks = this.farmObjects.children.filter(c => c.isRock && !c.isTargeted);
                if (rocks.length > 0) {
                    let r = rocks[Math.floor(Math.random() * rocks.length)];
                    r.isTargeted = true;
                    agent.targetRock = r;
                    agent.state = 'MOVING_TO_ROCK';
                    agent.playAnim(1); // Run/Walk
                }
            } else if (!agent.isPlayerControlled && GameState.progresoPorSegundo === 0) {
                agent.mesh.visible = false;
            }

            if (agent.state === 'MOVING_TO_ROCK' && agent.targetRock) {
                const dest = agent.targetRock.position.clone(); dest.y = agent.mesh.position.y;
                const m = new THREE.Matrix4(); m.lookAt(agent.mesh.position, dest, agent.mesh.up);
                agent.mesh.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 10*delta);

                if (agent.mesh.position.distanceTo(dest) > 1.0) {
                    agent.mesh.position.lerp(dest, agent.speed * delta);
                } else {
                    agent.carriedRock = agent.targetRock;
                    this.farmObjects.remove(agent.targetRock);
                    agent.mesh.add(agent.carriedRock);
                    agent.carriedRock.scale.setScalar(0.2);
                    agent.carriedRock.position.set(0, 0.5, 0.2);
                    agent.state = 'MOVING_TO_DROPOFF';
                }
            }
            else if (agent.state === 'MOVING_TO_DROPOFF' && agent.carriedRock) {
                // Find closest IDLE vehicle
                let closestVeh = null;
                let minDist = Infinity;
                for (let v of this.vehicles) {
                    if (v.state === 'IDLE') {
                        let d = agent.mesh.position.distanceTo(v.mesh.position);
                        if (d < minDist) { minDist = d; closestVeh = v; }
                    }
                }

                if (closestVeh) {
                    if (agent.currentAction && agent.currentAction.getClip().name !== agent.animations[1].name) {
                        agent.playAnim(1); // Ensure walking
                    }
                    const dest = closestVeh.mesh.position.clone(); dest.y = agent.mesh.position.y;
                    const m = new THREE.Matrix4(); m.lookAt(agent.mesh.position, dest, agent.mesh.up);
                    agent.mesh.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(m), 10*delta);

                    if (agent.mesh.position.distanceTo(dest) > 2.5) {
                        agent.mesh.position.lerp(dest, agent.speed * delta);
                    } else {
                        // Dropoff
                        agent.mesh.remove(agent.carriedRock);
                        closestVeh.currentLoad++;
                        // Si queremos visualmente acumular en el vehiculo, aqui hariamos algo,
                        // Pero para no saturar memoria, solo desaparece en el vehiculo o se muestra contabilidad
                        agent.carriedRock = null;
                        agent.state = 'IDLE';
                        agent.playAnim(0);
                    }
                } else {
                    // Esperando que un vehiculo vuelva
                    agent.playAnim(0);
                }
            }
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
