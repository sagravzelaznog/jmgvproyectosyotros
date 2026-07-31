export const GameState = {
    // Datos del jugador
    capital: 2500,
    deudaBancaria: 0,
    xp: 0,

    // Reestructuración de Hectáreas para seguimiento por año/ciclo
    hectareasData: [{ id: 'h1', ciclos: 1 }],
    get hectareas() { return this.hectareasData.length; },

    // Fases agrícolas y costos base
    fases: [
        { id: 1, nombre: "Quitar piedra", costoBase: 50, reqXp: 0 },
        { id: 2, nombre: "Preparar tierra", costoBase: 100, reqXp: 0 },
        { id: 3, nombre: "Barbechar", costoBase: 150, reqXp: 0 },
        { id: 4, nombre: "Rastrear", costoBase: 80, reqXp: 0 },
        { id: 5, nombre: "Sembrar", costoBase: 300, reqXp: 0 },
        { id: 6, nombre: "Arrastrar", costoBase: 50, reqXp: 0 },
        { id: 7, nombre: "Escardar", costoBase: 120, reqXp: 0 },
        { id: 8, nombre: "Sobreescardar", costoBase: 120, reqXp: 0 },
        { id: 9, nombre: "Quitar maleza", costoBase: 100, reqXp: 0 },
        { id: 10, nombre: "Aflojar planta", costoBase: 150, reqXp: 0 },
        { id: 11, nombre: "Juntar", costoBase: 150, reqXp: 0 },
        { id: 12, nombre: "Parvear", costoBase: 100, reqXp: 0 },
        { id: 13, nombre: "Cosechar", costoBase: 250, reqXp: 0 }
    ],
    faseActualIndex: 0,
    progresoFase: 0,
    fasePagada: false,

    // Modificadores
    multiplicadorCosechaBase: 1.0,
    multiplicadorCosecha: 1.0,
    poderClicBase: 1, // Se requieren muchos clics inicialmente
    progresoPorSegundo: 0,

    // Maquinaria y Desbloqueos
    tieneYunta: false,
    tieneCapataz: false,
    tieneTractor: false,
    tieneArado: false,
    descuentoOperativo: 0,

    // Cargar desde base de datos
    cargarDesdeDatos(datos) {
        if (!datos) return;
        if (datos.progreso) {
            this.capital = datos.progreso.capital || 2500;
            this.deudaBancaria = datos.progreso.deudaBancaria || 0;
            this.xp = datos.progreso.xp || 0;
        }
        if (datos.parcela) {
            this.faseActualIndex = datos.parcela.faseActualIndex || 0;
            this.progresoFase = datos.parcela.progresoFase || 0;
            this.fasePagada = datos.parcela.fasePagada || false;
            this.hectareasData = datos.parcela.hectareasData || [{ id: 'h1', ciclos: 1 }];
        }
        if (datos.estado_juego) {
            this.multiplicadorCosechaBase = datos.estado_juego.multiplicadorCosechaBase || 1.0;
            this.multiplicadorCosecha = datos.estado_juego.multiplicadorCosecha || 1.0;
            this.poderClicBase = datos.estado_juego.poderClicBase || 1;
            this.progresoPorSegundo = datos.estado_juego.progresoPorSegundo || 0;
            this.descuentoOperativo = datos.estado_juego.descuentoOperativo || 0;
            this.tieneYunta = datos.estado_juego.tieneYunta || false;
            this.tieneCapataz = datos.estado_juego.tieneCapataz || false;
            this.tieneTractor = datos.estado_juego.tieneTractor || false;
            this.tieneArado = datos.estado_juego.tieneArado || false;
        }
    }
};
