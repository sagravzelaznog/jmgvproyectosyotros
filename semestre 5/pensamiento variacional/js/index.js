document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sessions-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const sesionesActivas = [
        'sesion01', 'sesion02', 'sesion03', 'sesion04', 'sesion05',
        'sesion06', 'sesion07', 'sesion08', 'sesion09', 'sesion10',
        'sesion11', 'sesion12', 'sesion13', 'sesion14', 'sesion15',
        'sesion16', 'sesion17', 'sesion18', 'sesion19', 'sesion20',
        'sesion21', 'sesion22', 'sesion23', 'sesion24', 'sesion25',
        'sesion26', 'sesion27', 'sesion28', 'sesion29', 'sesion30',
        'sesion31', 'sesion32', 'sesion33', 'sesion34', 'sesion35',
        'sesion36', 'sesion37', 'sesion38', 'sesion39', 'sesion40'
    ];

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

    sessions.push({
        id: 4,
        title: "Tasa de Variación en la Ciudad",
        description: "Modelando fenómenos con datos reales de servicios e infraestructura.",
        block: 1,
        link: "pages/PVS04.HTML",
        status: "active"
    });

    sessions.push({
        id: 5,
        title: "Funciones de Variable Real",
        description: "El concepto de función como modelo matemático del entorno (Representación).",
        block: 1,
        link: "pages/PVS05.HTML",
        status: "active"
    });

    sessions.push({ id: 6, title: "Funciones Exponenciales I", description: "Modelado digital del crecimiento y decrecimiento acelerado.", block: 1, link: "pages/PVS06.HTML", status: "active" });
    sessions.push({ id: 7, title: "Funciones Exponenciales II", description: "Aplicaciones térmicas y la Ley de Enfriamiento de Newton.", block: 1, link: "pages/PVS07.HTML", status: "active" });
    sessions.push({ id: 8, title: "Funciones Logarítmicas", description: "Comprender la función inversa a la exponencial y las escalas logarítmicas.", block: 1, link: "pages/PVS08.HTML", status: "active" });
    sessions.push({ id: 9, title: "Funciones Trigonométricas I", description: "Análisis de fenómenos cíclicos y periódicos mediante el Seno y Coseno.", block: 1, link: "pages/PVS09.HTML", status: "active" });
    sessions.push({ id: 10, title: "Funciones Trigonométricas II", description: "Conectando la trigonometría con la infraestructura eléctrica mundial.", block: 1, link: "pages/PVS10.HTML", status: "active" });
    sessions.push({ id: 11, title: "Noción Intuitiva de Límite", description: "Acercarse al concepto de límite de manera gráfica y numéricamente.", block: 1, link: "pages/PVS11.HTML", status: "active" });
    sessions.push({ id: 12, title: "Límites Laterales", description: "Entender la direccionalidad al evaluar límites.", block: 1, link: "pages/PVS12.HTML", status: "active" });
    sessions.push({ id: 13, title: "Propiedades de los Límites", description: "Formalizar el cálculo algebraico de límites.", block: 1, link: "pages/PVS13.HTML", status: "active" });
    sessions.push({ id: 14, title: "Indeterminaciones 0/0", description: "Resolver límites que requieren factorización.", block: 1, link: "pages/PVS14.HTML", status: "active" });
    sessions.push({ id: 15, title: "Límites al Infinito", description: "Analizar el comportamiento asintótico de largo plazo.", block: 1, link: "pages/PVS15.HTML", status: "active" });
    sessions.push({ id: 16, title: "Continuidad de Funciones", description: "Definir la continuidad en un punto.", block: 1, link: "pages/PVS16.HTML", status: "active" });
    sessions.push({ id: 17, title: "Continuidad e Infraestructura", description: "Aplicar continuidad a problemas de la vida real.", block: 1, link: "pages/PVS17.HTML", status: "active" });
    sessions.push({ id: 18, title: "Tasa de Variación Instantánea", description: "Transitar de la variación promedio a la instantánea.", block: 2, link: "pages/PVS18.HTML", status: "active" });
    sessions.push({ id: 19, title: "La Derivada y la Recta Tangente", description: "Interpretar geométricamente la derivada.", block: 2, link: "pages/PVS19.HTML", status: "active" });
    sessions.push({ id: 20, title: "Regla de los Cuatro Pasos", description: "Calcular derivadas de funciones lineales y cuadráticas por definición.", block: 2, link: "pages/PVS20.HTML", status: "active" });
    sessions.push({ id: 21, title: "Regla de los Cuatro Pasos II", description: "Consolidando el cálculo por definición y sus implicaciones algebraicas.", block: 2, link: "pages/PVS21.HTML", status: "active" });
    sessions.push({ id: 22, title: "Reglas de Derivación: Constantes y Lineales", description: "Agilizar el cálculo mediante fórmulas directas.", block: 2, link: "pages/PVS22.HTML", status: "active" });
    sessions.push({ id: 23, title: "Derivada de Polinomios (Regla de la Potencia)", description: "Derivar polinomios de variable real de forma eficiente.", block: 2, link: "pages/PVS23.HTML", status: "active" });
    sessions.push({ id: 24, title: "Derivada de Sumas y Restas", description: "Aplicar linealidad en la derivación de sistemas compuestos.", block: 2, link: "pages/PVS24.HTML", status: "active" });
    sessions.push({ id: 25, title: "Derivada del Producto y Cociente", description: "Analizar variaciones de funciones interactuando entre sí.", block: 2, link: "pages/PVS25.HTML", status: "active" });

    // Generate the remaining sessions
    for (let i = 26; i <= 50; i++) {
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
