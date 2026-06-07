// app.js
// Lógica global de la WebApp (PWA, UI, Modals, Progress)

export const AppController = {
    init: function() {
        this.renderGlobalUI();
        this.bindEvents();
        this.calculateGlobalProgress();
    },

    renderGlobalUI: function() {
        // Inyectar Barra de Progreso Global
        const progressContainer = document.createElement('div');
        progressContainer.className = 'global-progress-container';
        progressContainer.innerHTML = `<div class="global-progress-bar" id="global-progress-bar"></div>`;
        document.body.prepend(progressContainer);

        // Inyectar Modal de Apoyo
        const modalHtml = `
            <div class="modal-overlay" id="support-modal">
                <div class="modal-content">
                    <button class="close-modal" id="close-support">&times;</button>
                    <h2>🌟 Apoya el Proyecto</h2>
                    <p>Tu contribución nos ayuda a mantener esta plataforma educativa gratuita y sin anuncios.</p>
                    <div class="support-bank-details">
                        CLABE: 0000 0000 0000 0000 00<br>
                        Banco: Tu Banco<br>
                        Concepto: Apoyo PV
                    </div>
                    <p style="font-size: 0.8em; color: var(--text-secondary);">¡Gracias por ser parte del cambio educativo!</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Inyectar Bottom Navigation (Solo si no existe ya en el HTML)
        if (!document.querySelector('.bottom-nav')) {
            const currentPath = window.location.pathname;
            const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/');
            const homeLink = isHome ? 'index.html' : '../index.html';
            
            const navHtml = `
                <nav class="bottom-nav">
                    <a href="${homeLink}" class="nav-item ${isHome ? 'active' : ''}">
                        <span class="nav-icon">🏠</span>
                        <span>Inicio</span>
                    </a>
                    <a href="#" class="nav-item" id="open-support-nav">
                        <span class="nav-icon">💖</span>
                        <span>Apoyar</span>
                    </a>
                </nav>
            `;
            document.body.insertAdjacentHTML('beforeend', navHtml);
        }
    },

    bindEvents: function() {
        const supportModal = document.getElementById('support-modal');
        
        // Botones para abrir modal
        const openBtns = document.querySelectorAll('#open-support, #open-support-nav');
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                supportModal.classList.add('active');
            });
        });

        // Cerrar modal
        document.getElementById('close-support')?.addEventListener('click', () => {
            supportModal.classList.remove('active');
        });

        // Cerrar al clickear fuera
        supportModal?.addEventListener('click', (e) => {
            if (e.target === supportModal) supportModal.classList.remove('active');
        });
    },

    calculateGlobalProgress: function() {
        // Leemos de localStorage por si no hay red, aunque luego se puede sincronizar con Firebase
        let completedCount = 0;
        const totalSessions = 50;

        for (let i = 1; i <= totalSessions; i++) {
            const key = `pv_sesion${i}_completed`;
            if (localStorage.getItem(key) === 'true') {
                completedCount++;
            }
        }

        const percentage = (completedCount / totalSessions) * 100;
        const bar = document.getElementById('global-progress-bar');
        if (bar) {
            bar.style.width = `${percentage}%`;
        }

        const statElem = document.getElementById('global-progress-text');
        if(statElem) {
            statElem.innerText = `${Math.round(percentage)}% Completado`;
        }
    },

    markSessionCompleted: function(sessionId) {
        localStorage.setItem(`pv_${sessionId}_completed`, 'true');
        this.calculateGlobalProgress();
    }
};

// Iniciar cuando el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
});
