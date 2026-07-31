import { GameState } from './GameState.js';
import { UIManager } from './UIManager.js';
import { DB } from './db.js';

export const TycoonEngine = {
    upgrades: {
        yunta: { id: 'yunta', nombre: "Yunta de Bueyes", desc: "Acelera quitar piedra (x3). Costo pastura ($20/fase).", costoBase: 150, multCosto: 1, nivel: 0, maxNivel: 1, reqXp: 0, aplicar: function () { GameState.tieneYunta = true; } },
        herramienta: { id: 'herramienta', nombre: "Mejorar Azadón", desc: "Aumenta el progreso manual (+4).", costoBase: 150, multCosto: 1.5, nivel: 0, maxNivel: null, reqXp: 0, aplicar: function () { GameState.poderClicBase += 4; } },
        peon: { id: 'peon', nombre: "Contratar Jornalero", desc: "Trabajo auto (+2/s).", costoBase: 300, multCosto: 1.8, nivel: 0, maxNivel: null, reqXp: 0, aplicar: function () { GameState.progresoPorSegundo += 2.0; } },
        fertilizante: { id: 'fertilizante', nombre: "Fertilizante", desc: "Cosecha +15% (Máx 30%). Hasta Escardar.", costoBase: 800, multCosto: 2.2, nivel: 0, maxNivel: null, reqXp: 0, aplicar: function () { GameState.multiplicadorCosecha = Math.min(1.30, GameState.multiplicadorCosecha + 0.15); } },
        capataz: { id: 'capataz', nombre: "Capataz", desc: "Paga insumos automático.", costoBase: 1500, multCosto: 1, nivel: 0, maxNivel: 1, reqXp: 1000, aplicar: function () { GameState.tieneCapataz = true; } },
        tractor: { id: 'tractor', nombre: "Tractor Agrícola", desc: "Trabajo masivo (+50/s).", costoBase: 8000, multCosto: 1, nivel: 0, maxNivel: 1, reqXp: 2500, aplicar: function () { GameState.progresoPorSegundo += 50; GameState.tieneTractor = true; } },
        hectarea: { id: 'hectarea', nombre: "Comprar Hectárea", desc: "Sube costos y ganancias x2.", costoBase: 5000, multCosto: 2.5, nivel: 1, maxNivel: null, reqXp: 0, aplicar: function () { GameState.hectareasData.push({ id: 'h' + (GameState.hectareas + 1), ciclos: 1 }); } }
    },

    cargarMejoras(datosUpgrades) {
        if (!datosUpgrades) return;
        for (const key in datosUpgrades) {
            if (this.upgrades[key]) {
                this.upgrades[key].nivel = datosUpgrades[key].nivel || 0;
            }
        }
    },

    comprarMejora: function (id) {
        const upg = this.upgrades[id];
        if (upg.maxNivel && upg.nivel >= upg.maxNivel) return;
        if (upg.reqXp > 0 && GameState.xp < upg.reqXp) return;
        if (id === 'fertilizante' && GameState.faseActualIndex > 6) return;

        const costoActual = Math.floor(upg.costoBase * Math.pow(upg.multCosto, upg.nivel));
        if (GameState.capital >= costoActual) {
            GameState.capital -= costoActual;
            upg.nivel++;
            upg.aplicar();
            UIManager.actualizarTextos();
            UIManager.renderizarTienda();
            DB.guardarProgreso();
        }
    },

    obtenerCostoFase: function (indiceFase = GameState.faseActualIndex) {
        const fase = GameState.fases[indiceFase];
        let costoFinal = 0;

        if (indiceFase === 0) {
            let costoTotalPiedra = 0;
            GameState.hectareasData.forEach(hectarea => {
                if (hectarea.ciclos <= 10) {
                    const reduccion = (hectarea.ciclos - 1) * 0.10;
                    costoTotalPiedra += fase.costoBase * (1 - reduccion);
                }
            });
            costoFinal = Math.floor(costoTotalPiedra);
        } else {
            costoFinal = Math.floor(fase.costoBase * GameState.hectareas);
        }

        if (GameState.tieneYunta) costoFinal += 20 * GameState.hectareas;
        costoFinal = costoFinal * (1 - GameState.descuentoOperativo);
        return Math.floor(costoFinal);
    },

    intentarPagarInsumos: function () {
        const costo = this.obtenerCostoFase();
        if (GameState.capital >= costo) {
            GameState.capital -= costo;
            GameState.fasePagada = true;
            UIManager.mostrarFlotante(`-$${costo}`, UIManager.canvas.width / 2, UIManager.canvas.height / 2, '#e74c3c');
            UIManager.actualizarTextos();
            DB.guardarProgreso();
        }
    },

    pedirPrestamo: function () {
        let costoRestante = 0;
        for (let i = GameState.faseActualIndex; i < GameState.fases.length; i++) {
            costoRestante += this.obtenerCostoFase(i);
        }

        if (costoRestante > 0) {
            const prestamoConInteres = costoRestante * 1.15;
            GameState.capital += costoRestante;
            GameState.deudaBancaria += prestamoConInteres;
            UIManager.mostrarFlotante(`+$${costoRestante.toFixed(0)}`, UIManager.canvas.width / 2, UIManager.canvas.height / 2 - 40, '#9b59b6');
            this.intentarPagarInsumos();
            DB.guardarProgreso();
        }
    },

    agregarProgreso: function (cantidad, isClick = false) {
        if (!GameState.fasePagada) return;

        let hectareasActivas = GameState.hectareas;
        if (GameState.faseActualIndex === 0) {
            hectareasActivas = GameState.hectareasData.filter(h => h.ciclos <= 10).length;
        }

        let progresoAplicado = cantidad;
        if (GameState.faseActualIndex === 0 && !GameState.tieneYunta) {
            progresoAplicado = cantidad / 3;
        }

        const metaProgreso = 500 * (1 + ((hectareasActivas - 1) * 0.15));
        GameState.progresoFase += progresoAplicado;

        const porcentaje = Math.min((GameState.progresoFase / metaProgreso) * 100, 100);
        UIManager.actualizarBarraProgreso(porcentaje);

        if (GameState.progresoFase >= metaProgreso) {
            this.completarFase();
        }
    },

    completarFase: function () {
        const xpGanada = 10 + (GameState.faseActualIndex * 2);
        GameState.xp += xpGanada;
        UIManager.mostrarFlotante(`+${xpGanada} XP`, UIManager.canvas.width / 2, UIManager.canvas.height / 2 - 40, '#9b59b6');

        if (GameState.faseActualIndex === 12) { // Cosechar
            const ingresoCosecha = 9999 * GameState.hectareas * GameState.multiplicadorCosecha;
            const gananciaNeta = ingresoCosecha - GameState.deudaBancaria;

            GameState.capital += gananciaNeta;
            GameState.deudaBancaria = 0;

            if (gananciaNeta >= 0) {
                UIManager.mostrarFlotante(`¡+$${gananciaNeta.toFixed(0)}!`, UIManager.canvas.width / 2, 100, '#2ecc71');
            } else {
                UIManager.mostrarFlotante(`-$${Math.abs(gananciaNeta).toFixed(0)}`, UIManager.canvas.width / 2, 100, '#e74c3c');
            }

            GameState.hectareasData.forEach(h => h.ciclos++);
            GameState.multiplicadorCosecha = GameState.multiplicadorCosechaBase;
            this.upgrades.fertilizante.nivel = 0;

            GameState.faseActualIndex = 0;
            const hReqPiedra = GameState.hectareasData.filter(h => h.ciclos <= 10).length;
            if (hReqPiedra === 0) {
                GameState.faseActualIndex = 1; // Salta piedra
            }
        } else {
            GameState.faseActualIndex++;
        }

        GameState.progresoFase = 0;
        GameState.fasePagada = (this.obtenerCostoFase() === 0);
        UIManager.actualizarBarraProgreso(0);
        UIManager.actualizarTextos();
        UIManager.renderizarTienda();
        UIManager.renderizarParcela();
        DB.guardarProgreso();
    },

    iniciarBucle: function () {
        setInterval(() => {
            if (GameState.tieneCapataz && !GameState.fasePagada) {
                const costo = this.obtenerCostoFase();
                if (costo > 0 && GameState.capital >= costo) {
                    this.intentarPagarInsumos();
                }
            }
            if (GameState.fasePagada && GameState.progresoPorSegundo > 0) {
                this.agregarProgreso(GameState.progresoPorSegundo);
            }
        }, 1000);
        
        // Guardado automático cada 30 segundos
        setInterval(() => {
            DB.guardarProgreso();
        }, 30000);
    }
};
