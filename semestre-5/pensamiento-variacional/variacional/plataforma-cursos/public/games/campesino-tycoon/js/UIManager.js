import { GameState } from './GameState.js';
import { TycoonEngine } from './TycoonEngine.js';

export const UIManager = {
    canvas: null,
    ctx: null,

    init: function () {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.getElementById('btn-pagar').addEventListener('click', () => TycoonEngine.intentarPagarInsumos());
        document.getElementById('btn-prestamo').addEventListener('click', () => TycoonEngine.pedirPrestamo());

        document.getElementById('shop-toggle').addEventListener('click', () => {
            document.getElementById('shop-panel').classList.toggle('open');
        });

        const interactuar = (e) => {
            if (!GameState.fasePagada) return;
            TycoonEngine.agregarProgreso(GameState.poderClicBase, true);
            
            // Partículas
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
        
        // Bucle de render visual
        requestAnimationFrame(() => this.renderizarParcela());
    },

    resize: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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

    renderizarParcela: function () {
        // En lugar de motor gráfico complejo, por ahora pintamos la tierra
        // según la fase actual.
        if(!this.ctx) return;
        const ctx = this.ctx;
        const idx = GameState.faseActualIndex;
        
        let r=120, g=90, b=60; // Tierra base
        
        if (idx === 0) { r=160; g=160; b=160; } // Piedras
        else if (idx >= 1 && idx <= 4) { r=101; g=67; b=33; } // Tierra preparada
        else if (idx >= 5 && idx <= 10) { r=39; g=174; b=96; } // Verde plantas
        else if (idx >= 11 && idx <= 12) { r=241; g=196; b=15; } // Amarillo cosecha

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Simulación de surcos
        ctx.strokeStyle = `rgba(0,0,0,0.1)`;
        ctx.lineWidth = 4;
        for(let i=0; i<this.canvas.width; i+=40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.canvas.height);
            ctx.stroke();
        }

        requestAnimationFrame(() => this.renderizarParcela());
    }
};
