import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { DB } from './db.js';
import { startGame } from './main.js';

export const AuthManager = {
    currentUser: null,

    init: function () {
        const btnLogin = document.getElementById('btn-login-google');
        const btnLogout = document.getElementById('btn-logout');

        if(btnLogin) {
            btnLogin.addEventListener('click', () => this.loginGoogle());
        }
        if(btnLogout) {
            btnLogout.addEventListener('click', () => this.logout());
        }

        if (auth) {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    this.currentUser = user;
                    await DB.cargarProgreso(user.uid);
                    this.mostrarJuego();
                } else {
                    this.currentUser = null;
                    this.mostrarLogin();
                }
            });
        } else {
            // Modo Local si no hay Firebase configurado
            this.mostrarJuego();
        }
    },

    loginGoogle: async function () {
        if(!auth) {
            alert("Configura Firebase en js/firebase-config.js para usar inicio de sesión.");
            this.mostrarJuego();
            return;
        }
        try {
            document.getElementById('login-status').innerText = "Iniciando sesión...";
            await signInWithPopup(auth, provider);
        } catch (error) {
            document.getElementById('login-status').innerText = "Error: " + error.message;
            console.error(error);
        }
    },

    logout: async function () {
        if(auth) {
            await signOut(auth);
        } else {
            this.mostrarLogin();
        }
    },

    mostrarJuego: function () {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('game-container').classList.add('active');
        startGame(); // Inicia GameLoop y UI
    },

    mostrarLogin: function () {
        document.getElementById('game-container').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
    }
};
