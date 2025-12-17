import promptSync from "prompt-sync";
const prompt = promptSync();

// 1. FUNCIONES DE PROCESAMIENTO ASÍNCRONO
// Propósito: mostrar tres estilos de asincronía:
// - Callback, Promise y async/await (delegando en la promesa)

const atenderCallback = (s, cb) => setTimeout(() => cb(null, `ID ${s.id} procesado (Callback)`), 1000);
const atenderPromesa = (s) => new Promise(res => setTimeout(() => res(`ID ${s.id} procesado (Promesa)`), 1000));
const atenderAsync = async (s) => await atenderPromesa(s);


// 2. FUNCIÓN DE CLASIFICACIÓN (Para no mutar el objeto)
// Devuelve categoría según prioridad (Alta/Media/Baja)

const obtenerCategoria = (p) => p >= 4 ? "Alta" : p >= 2 ? "Media" : "Baja";

async function datos() {
    // Arrays para solicitudes válidas e inválidas
    let solicitudes = [];
    let solicitudesInvalidas = [];

    // Bucle para permitir entrada repetida
    while (true) {
        try {
            // Leer y validar Id numérico
            let id = parseInt(prompt("Ingrese el Id: "));
            if (isNaN(id) || id < 0) throw new Error("El Id no es válido");

            // Leer y validar usuario (no vacío)
            let usuario = prompt("Ingrese el usuario: ");
            if (!usuario || usuario.trim() === "") throw new Error("Usuario no válido");

            // VALIDACIÓN DE TIPO: mostrar opciones y mapear selección
            console.log("1. hardware | 2. software | 3. red");
            let tipoSel = parseInt(prompt("Seleccione tipo: "));
            let tipos = {1: "hardware", 2: "software", 3: "red"};
            if (!tipos[tipoSel]) throw new Error("Tipo de solicitud no válido");
            let tipo = tipos[tipoSel];

            // PRIORIDAD: número entre 1 y 5
            let prioridad = parseInt(prompt("Prioridad (1-5): "));
            if (isNaN(prioridad) || prioridad < 1 || prioridad > 5) throw new Error("Prioridad no válida");

            // Descripción: mínima longitud para ser válida
            let descripcion = prompt("Descripción (+10 carac.): ");
            if (descripcion.trim().length < 10) throw new Error("Descripción muy corta");

            // Autorización: 's' para activa, cualquier otra lectura se considera no autorizada
            let activoSeleccion = prompt("¿Autorizar? (s/n): ").toLowerCase();
            let activo = activoSeleccion === "s";

            // CREACIÓN INMUTABLE de la solicitud
            const solicitudIndividual = Object.freeze({ 
                id, usuario, tipo, prioridad, descripcion, activo 
            });

            // Almacenar según si está autorizada o no (válida vs inválida)
            if (activo) {
                solicitudes.push(solicitudIndividual);
            } else {
                solicitudesInvalidas.push(solicitudIndividual);
            }

        } catch (error) {
            // Mostrar error controlado y continuar con la siguiente iteración
            console.error("Error encontrado: " + error.message);
        }

        // Pregunta para continuar; si no, salir del bucle
        if (prompt("¿Desea ingresar otra? (s/n): ").toLowerCase() !== 's') break;
        console.clear();
    }
    return { solicitudes, solicitudesInvalidas };
}

// funcion anonima autoejecutable para ejecutar el flujo principal y procesar solicitudes válidas
(async () => {
    const { solicitudes: autorizadas, solicitudesInvalidas: invalidas } = await datos();

    console.log("\n--- PROCESANDO SOLICITUDES VÁLIDAS ---");
    // RECORRIDO CON ASINCRONÍA TRIPLE: callback, promesa y async/await
    for (let i = 0; i < autorizadas.length; i++) {
        const s = autorizadas[i];
        const cat = obtenerCategoria(s.prioridad); // Obtener categoría sin mutar

        if (i % 3 === 0) {
            // Ejemplo con callback: el resultado se imprime desde el callback
            atenderCallback(s, (err, msg) => console.log(`[OK] ${msg} | Prioridad: ${cat}`));
        } else if (i % 3 === 1) {
            // Ejemplo con promesa y await
            console.log(`[OK] ${await atenderPromesa(s)} | Prioridad: ${cat}`);
        } else {
            // Ejemplo con función async que usa await internamente
            console.log(`[OK] ${await atenderAsync(s)} | Prioridad: ${cat}`);
        }
    }

    // RESUMEN FINAL: conteos y listado de inválidas si existen
    console.log("\n======= RESUMEN DE GESTIÓN =======");
    console.log(`Total Recibidas: ${autorizadas.length + invalidas.length}`);
    console.log(`Total Válidas: ${autorizadas.length}`);
    console.log(`Total Inválidas: ${invalidas.length}`);
    
    if (invalidas.length > 0) {
        console.log("Listado de Inválidas (Rechazadas):");
        invalidas.forEach(inv => console.log(`- ID: ${inv.id} | Usuario: ${inv.usuario}`));
    }
})();