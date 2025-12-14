import promptSync from "prompt-sync";
const prompt = promptSync();

// Función asincrona para manejar la entrada de datos de las solicitudes
async function datos() {
    // Arreglo donde se almacenan las solicitudes validas
    let solicitudes = []
    let solicitudesInvalidas = []
    // Bucle infinito para permitir ingresar multiples solicitudes
    while (true) {
        try {
            // Validación del Id: debe ser un numero entero no negativo
            let id = parseInt(prompt("Ingrese el Id: "));
            if (isNaN(id) || id == null || id < 0){
                throw new Error("El Id ingresado no es valido");
            }
            // Lectura del usuario (se espera que sea texto o se valida que no sea vacio)
            let usuario = prompt("Ingrese el usuario: ")
            if (usuario == null || usuario.trim() === "") {
                throw new Error("El usuario ingresado no es valido");
            }
            console.log("***********tipos de solicitud****************");
            console.log("1. Hardware");
            console.log("2. Software");
            console.log("3. Red");
            let tipoSeleccion = parseInt(prompt("Seleccione el tipo de solicitud: "))
            // Se valida que la seleccion este entre las opciones permitidas
            if (tipoSeleccion != 1 && tipoSeleccion != 2 && tipoSeleccion != 3){
                throw new Error("El tipo de solicitud no es valido");
            }
            let tipo
            switch (tipoSeleccion) {
                case 1:
                    tipo = "Hardware"
                    break;
                case 2:
                    tipo = "Software"
                    break;
                case 3:
                    tipo = "Red"
                    break;
            }
            // Nivel de prioridad: 1 a 5, donde 5 es la mas alta
            let prioridad = parseInt(prompt("Ingrese un nivel de prioridad (5 = mas alta, 1 = mas baja): "))
            if (isNaN(prioridad) || prioridad < 1 || prioridad > 5){
                throw new Error("El nivel de prioridad seleccionado no es valido");
            }
            switch (prioridad) {
                case 1:
                    prioridad = "Baja"
                    break;
                case 2:
                    prioridad = "Media-Baja"
                    break;
                case 3:
                    prioridad = "Media"
                    break;
                case 4:
                    prioridad = "Media-Alta"
                    break;
                case 5:
                    prioridad = "Alta"
                    break;
            }
            // Descripcion: se exige longitud minima 
            let descripcion = prompt("Ingrese una descripcion de mas de 10 caracteres: ")
            // se evita aceptar texto muy corto o solo numeros
            if (descripcion == null || descripcion.trim().length < 10 || !isNaN(descripcion)){
                throw new Error("La descripcion ingresada no cumple con los requerimientos");
            }
            // Opcion para autorizar la transaccion; solo se guardan solicitudes autorizadas
            let activo = true
            let activoSeleccion = prompt("Desea autorizar la transaccion (s/n):")
            if (activoSeleccion.toLowerCase() != "s" && activoSeleccion.toLowerCase() != "n"){
                throw new Error("La opcion seleccionada no es valida")
            }else if (activoSeleccion.toLowerCase() == "n") {
                activo = false
            }
            let solicitudIndividual
            if (activo == true){
                //se agregan los datos dentro de un objeto
                solicitudIndividual = {
                    id : id,
                    usuario : usuario,
                    tipo : tipo,
                    prioridad : prioridad,
                    descripcion : descripcion,
                    activo : activo
                }
                // Freeze para que no se le puea cambiar ni propiedades ni valores
                Object.freeze(solicitudIndividual);
                // Se agrega la solicitud autorizada a la lista
                solicitudes.push(solicitudIndividual)
            }else{
                //se agregan los datos dentro de un objeto
                solicitudIndividual = {
                    id : id,
                    usuario : usuario,
                    tipo : tipo,
                    prioridad : prioridad,
                    descripcion : descripcion,
                    activo : activo
                }
                //Freeze para que no se le puea cambiar ni propiedades ni valores
                Object.freeze(solicitudIndividual);
                // se agrega la solicitud no autorizada a la lista de invalidas
                solicitudesInvalidas.push(solicitudIndividual)
            }
            
        } catch (error) {
            // Se captura y muestra cualquier error de validacion sin terminar el bucle
            console.error("Error encontrado: " + error.message)
        }
        let continuar = prompt("Desea ingresar otra transaccion? (s/n): ");
        if (continuar.toLowerCase() !== 's') {
            break;
        }else{
            console.clear();
        }
    }
    // Retornamos las listas (autorizadas e inválidas)
    return { solicitudes, solicitudesInvalidas }
}

(async () => {
    const { solicitudes: autorizadas, solicitudesInvalidas: invalidas } = await datos()
    console.log("Solicitudes autorizadas:", autorizadas);
    console.log("Solicitudes no autorizadas:", invalidas);
    
    // Recorremos y mostramos cada solicitud valida
    for (const solicitud of autorizadas) {
        console.log(`id : ${solicitud.id},
                    usuario : ${solicitud.usuario},
                    tipo : ${solicitud.tipo},
                    prioridad : ${solicitud.prioridad},
                    descripcion : ${solicitud.descripcion},
                    activo : ${solicitud.activo}`);
    }

    // Recorremos y mostramos cada solicitud no autorizada
    for (const solicitud of invalidas) {
        console.log(`(NO AUTORIZADA) id : ${solicitud.id},
                    usuario : ${solicitud.usuario},
                    tipo : ${solicitud.tipo},
                    prioridad : ${solicitud.prioridad},
                    descripcion : ${solicitud.descripcion},
                    activo : ${solicitud.activo}`);
    }
    let totalRecibidas = autorizadas.length + invalidas.length
    let totalValidas = autorizadas.length
    let totalInvalidas = invalidas.length
    console.log("Resumen de solicitudes:");
    console.log(`Total recibidas: ${totalRecibidas}`);
    console.log(`Total válidas: ${totalValidas}`);
    console.log(`Total inválidas: ${totalInvalidas}`);
})()