import PromptSync from "prompt-sync";
const prompt = PromptSync()

// -------------------------------------------------------
// Archivo: ejercicio2.js
// Propósito: Recoger transacciones desde consola, validarlas,
// almacenarlas si están autorizadas, y luego mostrar un resumen.
// Se simula obtención asíncrona con un retraso.
// -------------------------------------------------------

// Simula una llamada asincrona que devuelve transacciones después de 1 segundo
function obtenerTransacciones(transacciones) {
	// Retorna una promesa que se resuelve tras 1s con la lista pasada
	return new Promise((resolve) => {
		setTimeout(() => {resolve(transacciones)}, 1000);
	});
}

// Función principal: solicita datos al usuario, valida entradas y construye la lista de transacciones
async function datos(){
    // Array acumulador de transacciones válidas/autorizadas
    // Paso 1: inicializamos la colección donde iremos guardando las transacciones autorizadas.
    let transacciones = []

    // Paso 2: abrimos un bucle para permitir múltiples ingresos por parte del usuario.
    while (true) {
        try {
            // ----------------------------------------------------------
            // LECTURA Y VALIDACIÓN DEL ID
            // - Leemos el ID como entero.
            // - Validamos paso a paso: no nulo, es número y no negativo.
            // ----------------------------------------------------------
            let id = parseInt(prompt("Ingrese el numero del ID: "))

            // Validaciones explícitas, una por una (forma larga)
            if (id == null) {
                // Si la entrada es null interrumpimos esta iteración con un error controlado
                throw new Error("El numero de Id no es valido");
            }
            if (isNaN(id)) {
                // Si parseInt no devolvió número, también es inválido
                throw new Error("El numero de Id no es valido");
            }
            if (id < 0) {
                // Rechazamos IDs negativos
                throw new Error("El numero de Id no es valido");
            }

            // ----------------------------------------------------------
            // LECTURA Y VALIDACIÓN DEL NOMBRE DEL CLIENTE
            // - Pedimos el nombre.
            // - Validamos que no sea null y que sea de tipo cadena.
            // ----------------------------------------------------------
            let cliente = prompt("Ingrese su nombre: ")

            // Validaciones explícitas de cliente
            if (cliente == null) {
                throw new Error("El dato ingresado no es valido");
            }
            if (typeof cliente != "string") {
                throw new Error("El dato ingresado no es valido");
            }

            // ----------------------------------------------------------
            // SELECCIÓN Y VALIDACIÓN DEL TIPO DE TRANSFERENCIA
            // - Mostramos opciones y leemos la selección numérica.
            // - Validamos paso a paso que la opción sea 1, 2 o 3.
            // ----------------------------------------------------------
            console.log("******tipo de trasnferencia******");
            console.log("1. Deposito");
            console.log("2. Retiro");
            console.log("3. Transferencia");
            let tipoSeleccion = parseInt(prompt("Seleccione el tipo de trasnferencia que desea realizar: "))

            // Validación de selección tipo en forma larga (comprobaciones separadas)
            if (tipoSeleccion == null) {
                throw new Error("El opcion seleccionada no es valida");
            }
            if (tipoSeleccion != 1) {
                if (tipoSeleccion != 2) {
                    if (tipoSeleccion != 3) {
                        throw new Error("El opcion seleccionada no es valida");
                    }
                }
            }

            // Mapear la selección numerica al texto correspondiente
            let tipo
            switch (tipoSeleccion) {
                case 1:
                    tipo = "Deposito"
                    break;
                case 2:
                    tipo = "Retiro"
                    break;
                case 3:
                    tipo = "Transferencia"
                    break;
            }

            // ----------------------------------------------------------
            // LECTURA Y VALIDACIÓN DEL MONTO
            // - Leemos monto y validamos: no nulo, numérico y no negativo.
            // ----------------------------------------------------------
            let monto = parseInt(prompt("Ingrese el monto de la transaccion: "))

            // Validaciones explícitas de monto
            if (monto == null) {
                throw new Error("El monto ingresado no es valido")
            }
            if (isNaN(monto)) {
                throw new Error("El monto ingresado no es valido")
            }
            if (monto < 0) {
                throw new Error("El monto ingresado no es valido")
            }

            // ----------------------------------------------------------
            // AUTORIZACIÓN DE LA TRANSACCIÓN
            // - Preguntamos si autoriza la transacción: esperamos 's' o 'n'.
            // - Validamos la respuesta y normalizamos (toLowerCase).
            // - Solo almacenaremos si fue autorizada ('s').
            // ----------------------------------------------------------
            let autorizado = true
            let autorizadoSeleccion = prompt("Desea autorizar la transaccion (s/n):")
            if (autorizadoSeleccion == null) {
                throw new Error("La opcion seleccionada no es valida")
            }

            // Normalizamos una vez y hacemos comprobaciones largas
            const selLower = autorizadoSeleccion.toLowerCase();
            if (selLower !== "s") {
                if (selLower !== "n") {
                    // Si no es ni 's' ni 'n' -> error
                    throw new Error("La opcion seleccionada no es valida")
                } else {
                    // si es 'n' -> no autorizado
                    autorizado = false
                }
            } else {
                // si es 's' -> autorizado
                autorizado = true
            }

            // ----------------------------------------------------------
            // ALMACENAMIENTO: Solo guardamos transacciones autorizadas.
            // ----------------------------------------------------------
            if (autorizado === true) {
                let transaccionIndividual = {
                    id : id,
                    cliente : cliente,
                    tipo : tipo,
                    monto : monto,
                    autorizado : autorizado
                }
                transacciones.push(transaccionIndividual)
            } else {
                // Si no está autorizado, no se guarda y se continúa (explicito)
            }

        } catch (error) {
            // Manejo controlado de errores: mostramos el motivo y permitimos reintentar
            console.error("Error encontrado: " + error.message)
        }

        // ----------------------------------------------------------
        // PREGUNTA PARA CONTINUAR: validación explícita de la respuesta
        // - Si la respuesta no es 's' se sale del bucle; en caso contrario se limpia la consola.
        // ----------------------------------------------------------
        let continuar = prompt("Desea ingresar otra transaccion? (s/n): ");
        if (continuar == null) {
            // Si canceló o no respondió, salimos
            break;
        }
        const contLower = continuar.toLowerCase();
        if (contLower !== 's') {
            // Cualquier respuesta distinta a 's' finaliza la entrada
            break;
        } else {
            // Si responde 's', limpiamos la consola y continuamos con la siguiente iteración
            console.clear();
        }
    }

    // ----------------------------------------------------------
    // SIMULACIÓN ASÍNCRONA DE OBTENCIÓN
    // - Simulamos un servicio que devuelve las transacciones con 1s de retraso.
    // - Retornamos la lista final para su posterior procesamiento.
    // ----------------------------------------------------------
    const listaSimulada = await obtenerTransacciones(transacciones);
    return listaSimulada;
}

// IIFE para ejecutar el flujo principal: obtiene datos, muestra lista y calcula totales
(async () => {
    // Paso A: obtener listado (simulado)
    const listaFinal = await datos();
    console.log("Proceso completado. Lista final de trasnsacciones:");
    console.log(listaFinal);

    // Paso B: imprimir cada transacción en formato legible (explicación de campos)
    for (let i = 0; i < listaFinal.length; i++) {
        const transaccion = listaFinal[i];
        // Mostramos ID, cliente, tipo, monto y si fue autorizado
        console.log(`Transacción ID: ${transaccion.id}, 
            Cliente: ${transaccion.cliente}, 
            Tipo: ${transaccion.tipo}, 
            Monto: ${transaccion.monto}, 
            Autorizado: ${transaccion.autorizado}`);
    } 

    // Paso C: calcular totales por tipo solo para transacciones autorizadas
    // - totalDepositos acumula depósitos
    // - totalRetiros acumula retiros
    // - transaccionesRechazadas cuenta las no autorizadas (por si se hubieran incluido)
    let totalDepositos = 0;
    let totalRetiros = 0;
    let transaccionesRechazadas = 0;
    for (let i = 0; i < listaFinal.length; i++) {
        const transaccion = listaFinal[i];
        if (transaccion.autorizado) {
            // Acumulamos según el tipo exacto
            if (transaccion.tipo === "Deposito") {
                totalDepositos += transaccion.monto;
            } else if (transaccion.tipo === "Retiro") {
                totalRetiros += transaccion.monto;
            }   
        } else {
            // Si existiera alguna no autorizada en la lista, la contamos
            transaccionesRechazadas++;
        }
    }

    // Paso D: mostramos un resumen con formato y valores finales
    console.log(`Total en depósitos: $${totalDepositos.toLocaleString('es-ES')}`);
    console.log(`Total en retiros: $${totalRetiros.toLocaleString('es-ES')}`);
    console.log(`Total de depósitos: ${totalDepositos}`);
    console.log(`Total de retiros: ${totalRetiros}`);
    console.log(`Número de transacciones rechazadas: ${transaccionesRechazadas}`);
})();