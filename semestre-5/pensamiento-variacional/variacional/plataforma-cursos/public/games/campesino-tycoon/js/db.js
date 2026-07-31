import { db } from './firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { GameState } from './GameState.js';
import { TycoonEngine } from './TycoonEngine.js';
import { AuthManager } from './auth.js';
import { UIManager } from './UIManager.js';

export const DB = {
    cargarProgreso: async function (uid) {
        if(!db) {
            // Cargar de LocalStorage (Fallback)
            const localData = localStorage.getItem('campesino_save');
            if(localData) {
                const pData = JSON.parse(localData);
                GameState.cargarDesdeDatos(pData);
                TycoonEngine.cargarMejoras(pData.upgrades_adquiridos);
            }
            return;
        }

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                GameState.cargarDesdeDatos(data);
                TycoonEngine.cargarMejoras(data.upgrades_adquiridos);
            } else {
                console.log("No hay datos previos. Iniciando nuevo juego.");
                await this.guardarProgreso();
            }
        } catch (e) {
            console.error("Error cargando documento: ", e);
        }
    },

    guardarProgreso: async function () {
        // Estructura de los datos a guardar
        const estadoJuego = {
            progreso: {
                capital: GameState.capital,
                deudaBancaria: GameState.deudaBancaria,
                xp: GameState.xp
            },
            parcela: {
                faseActualIndex: GameState.faseActualIndex,
                progresoFase: GameState.progresoFase,
                fasePagada: GameState.fasePagada,
                hectareasData: GameState.hectareasData
            },
            estado_juego: {
                multiplicadorCosechaBase: GameState.multiplicadorCosechaBase,
                poderClicBase: GameState.poderClicBase,
                progresoPorSegundo: GameState.progresoPorSegundo,
                descuentoOperativo: GameState.descuentoOperativo,
                tieneYunta: GameState.tieneYunta,
                tieneCapataz: GameState.tieneCapataz,
                tieneTractor: GameState.tieneTractor,
                tieneArado: GameState.tieneArado
            },
            upgrades_adquiridos: {}
        };

        Object.keys(TycoonEngine.upgrades).forEach(key => {
            estadoJuego.upgrades_adquiridos[key] = { nivel: TycoonEngine.upgrades[key].nivel };
        });

        if(!db || !AuthManager.currentUser) {
            // LocalStorage Fallback
            localStorage.setItem('campesino_save', JSON.stringify(estadoJuego));
            this.mostrarToast();
            return;
        }

        try {
            await setDoc(doc(db, "users", AuthManager.currentUser.uid), estadoJuego, { merge: true });
            this.mostrarToast();
        } catch (e) {
            console.error("Error guardando documento: ", e);
        }
    },

    mostrarToast: function() {
        // Crear un toast simple si no existe
        let toast = document.getElementById('save-toast');
        if(!toast) {
            toast = document.createElement('div');
            toast.id = 'save-toast';
            toast.className = 'save-toast';
            toast.innerHTML = '<i class="fas fa-save"></i> Guardado automático';
            document.body.appendChild(toast);
        }
        
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
};
