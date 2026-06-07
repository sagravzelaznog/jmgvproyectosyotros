document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sessions-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Data for the 50 sessions
    const sessions = [];

    // First session is explicitly defined since we have its file
    sessions.push({
        id: 1,
        title: "Inicios del Pensamiento Variacional",
        description: "¿Es posible el movimiento? La paradoja de Zenón y el infinito.",
        block: 1,
        link: "pages/PVS01.HTML",
        status: "active"
    });

    sessions.push({
        id: 2,
        title: "Arquímedes y el Método de Exhausción",
        description: "Aproximando curvas y áreas a través de figuras poligonales infinitas.",
        block: 1,
        link: "pages/PVS02.HTML",
        status: "active"
    });

    sessions.push({
        id: 3,
        title: "Tasa de Variación Promedio I",
        description: "Entendiendo el cambio matemático en un intervalo de tiempo y espacio.",
        block: 1,
        link: "pages/PVS03.HTML",
        status: "active"
    });

    // Generate the remaining sessions
    for (let i = 4; i <= 50; i++) {
        let blockNum = 1;
        if (i >= 17 && i <= 33) blockNum = 2;
        if (i >= 34) blockNum = 3;

        let formattedId = i.toString().padStart(2, '0');
        
        sessions.push({
            id: i,
            title: `Sesión ${i}: Desarrollo de Conceptos`,
            description: `Conceptos y prácticas del pensamiento variacional correspondientes a la sesión ${i}.`,
            block: blockNum,
            link: `pages/PVS${formattedId}.HTML`,
            status: "upcoming"
        });
    }

    // Function to render cards
    function renderCards(filterBlock = 'all') {
        container.innerHTML = ''; // Clear container

        const filteredSessions = filterBlock === 'all' 
            ? sessions 
            : sessions.filter(s => s.block === parseInt(filterBlock.replace('b', '')));

        filteredSessions.forEach((session, index) => {
            const card = document.createElement('a');
            card.href = session.link;
            card.className = `session-card block-${session.block}`;
            card.style.animationDelay = `${index * 0.03}s`;

            const statusHTML = session.status === 'active' 
                ? `<div class="session-status status-active"><span class="icon">✨</span> Disponible</div>`
                : `<div class="session-status status-upcoming"><span class="icon">⏳</span> Próximamente</div>`;

            card.innerHTML = `
                <div class="session-header">
                    <div class="session-number">${session.id}</div>
                    <div class="session-block">Bloque ${session.block}</div>
                </div>
                <h3 class="session-title">${session.title}</h3>
                <p class="session-desc">${session.description}</p>
                ${statusHTML}
            `;

            container.appendChild(card);
        });
    }

    // Initial render
    renderCards();

    // Filtering logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            e.target.classList.add('active');
            
            // Render filtered cards
            renderCards(e.target.dataset.filter);
        });
    });
});
