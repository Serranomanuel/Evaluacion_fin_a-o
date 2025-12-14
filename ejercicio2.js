import PromptSync from "prompt-sync";
const prompt = PromptSync()

// Simula una llamada asincrona que devuelve transacciones después de 1 segundo
function obtenerTransacciones(transacciones) {
	return new Promise((resolve) => {
		setTimeout(() => {resolve(transacciones)}, 1000);
	});
}

// Función principal: solicita datos al usuario, valida entradas y construye la lista de transacciones
async function datos(){
    let transacciones = []
    while (true) {
        try {
    
            // Validar que el ID sea un numero entero positivo
            let id = parseInt(prompt("Ingrese el numero del ID: "))
            if (isNaN(id) || id < 0 || id == null){
                throw new Error("El numero de Id no es valido");
            }

            // Obtener el nombre del cliente
            let cliente = prompt("Ingrese su nombre: ")
            if (typeof cliente != "string" || cliente == null ){
                throw new Error("El dato ingresado no es valido");
            }

            // Mostrar opciones de tipo de transferencia y leer la seleccion
            console.log("******tipo de trasnferencia******");
            console.log("1. Deposito");
            console.log("2. Retiro");
            console.log("3. Transferencia");
            let tipoSeleccion = parseInt(prompt("Seleccione el tipo de trasnferencia que desea realizar: "))
            if (tipoSeleccion != 1 && tipoSeleccion != 2 && tipoSeleccion != 3){
                throw new Error("El opcion seleccionada no es valida");
                
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

            // Validar que el monto sea un numero positivo
            let monto = parseInt(prompt("Ingrese el monto de la transaccion: "))
            if (isNaN(monto) || monto < 0 || monto == null){
                throw new Error("El monto ingresado no es valido")
            }

            // Preguntar si el usuario autoriza la transaccion: solo 's' (si) o 'n' (no) son validos
            let autorizado = true
            let autorizadoSeleccion = prompt("Desea autorizar la transaccion (s/n):")
            if (autorizadoSeleccion.toLowerCase() != "s" && autorizadoSeleccion.toLowerCase() != "n"){
                throw new Error("La opcion seleccionada no es valida")
            }else if (autorizadoSeleccion.toLowerCase() == "n") {
                autorizado = false
            }

            // Solo almacenar la transaccion si fue autorizada
            if (autorizado == true){
                let transaccionIndividual = {
                    id : id,
                    cliente : cliente,
                    tipo : tipo,
                    monto : monto,
                    autorizado : autorizado
                }
                transacciones.push(transaccionIndividual)
            }
        } catch (error) {
            console.error("Error encontrado: " + error.message)
        }
        let continuar = prompt("Desea ingresar otra transaccion? (s/n): ");
        if (continuar.toLowerCase() !== 's') {
            break;
        }else{
            console.clear();
        }
    }

    // Simula la obtencion de la lista desde una funcion y la devuelve con un retraso de 1 segundo
    const listaSimulada = await obtenerTransacciones(transacciones);
    return listaSimulada;
}

(async () => {
    const listaFinal = await datos();
    console.log("Proceso completado. Lista final de trasnsacciones:");
    console.log(listaFinal);

    // Imprimir cada transaccion por separado
    for (let i = 0; i < listaFinal.length; i++) {
        const transaccion = listaFinal[i];
        console.log(`Transacción ID: ${transaccion.id}, 
            Cliente: ${transaccion.cliente}, 
            Tipo: ${transaccion.tipo}, 
            Monto: ${transaccion.monto}, 
            Autorizado: ${transaccion.autorizado}`);
    } 

    // Calcular totales (solo de transacciones autorizadas) y contar rechazadas
    let totalDepositos = 0;
    let totalRetiros = 0;
    let transaccionesRechazadas = 0;
    for (let i = 0; i < listaFinal.length; i++) {
        const transaccion = listaFinal[i];
        if (transaccion.autorizado) {
            if (transaccion.tipo === "Deposito") {
                totalDepositos += transaccion.monto;
            } else if (transaccion.tipo === "Retiro") {
                totalRetiros += transaccion.monto;
            }   
        } else {
            // Contar transacciones no autorizadas (rechazadas)
            transaccionesRechazadas++;
        }
    }

    // Mostrar resumen de totales
    console.log(`Total en depósitos: $${totalDepositos.toLocaleString('es-ES')}`);
    console.log(`Total en retiros: $${totalRetiros.toLocaleString('es-ES')}`);
    console.log(`Total de depósitos: ${totalDepositos}`);
    console.log(`Total de retiros: ${totalRetiros}`);
    console.log(`Número de transacciones rechazadas: ${transaccionesRechazadas}`);
})();