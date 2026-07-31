import { AuthManager } from './auth.js';
import { UIManager } from './UIManager.js';
import { TycoonEngine } from './TycoonEngine.js';

let isGameStarted = false;

// Esta función es llamada por AuthManager después del login o en fallback local
export function startGame() {
    if(isGameStarted) return;
    
    UIManager.init();
    TycoonEngine.iniciarBucle();
    
    isGameStarted = true;
}

// Inicializar el flujo de Autenticación apenas cargue el script
window.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});
