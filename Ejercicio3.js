import promptSync from "prompt-sync";
const prompt = promptSync();


// 1. ASINCRONÍA REQUERIDA
// Explicación: se muestran tres formas de "enviar" una solicitud
// - enviarCallback: simula envío usando callback y setTimeout
// - enviarPromesa: retorna una Promise que se resuelve tras delay
// - enviarAsync: función async que delega en la promesa

const enviarCallback = (solicitud, cb) => {
	// Simula una operación asíncrona y devuelve el objeto con un campo 'estado'
	setTimeout(() => cb(null, { ...solicitud, estado: "Enviado por Callback" }), 1000);
};

const enviarPromesa = (solicitud) => {
	// Retorna una promesa que se resuelve con el resultado tras 1s
	return new Promise((res) => {
		setTimeout(() => res({ ...solicitud, estado: "Enviado por Promesa" }), 1000);
	});
};

const enviarAsync = async (solicitud) => await enviarPromesa(solicitud);
// Esta función ilustra la sintaxis async/await delegando en la promesa


// 2. CLASIFICACIÓN CON OPERADORES MODERNOS
// Explicación: clasifica la solicitud según su nivel usando desestructuración,
// operador ternario anidado y spread para no mutar el objeto original.

const clasificarNivel = (solicitud) => {
	// Desestructuramos para obtener nivel de forma clara
	const { nivel } = solicitud;
	// Operador ternario anidado para asignar categoría
	let categoria = nivel >= 4 ? "Alta" : nivel >= 2 ? "Media" : "Baja";
	// Retornamos un nuevo objeto (no mutamos la solicitud original)
	return { ...solicitud, categoria };
};


// Función principal: sistemaGestionSoporte
// Explicación general:
// - Lee repetidamente solicitudes desde la consola.
// - Valida los datos de entrada.
// - Almacena solicitudes (inmutables) en un array.
// - Filtra activas/inactivas y procesa activas con distintos mecanismos asíncronos.
// - Imprime un reporte final.

async function sistemaGestionSoporte() {
	// ...mantenemos una lista de solicitudes; se considera "original" e inmutable
	const solicitudesOriginales = [];

	// Bucle de entrada: pedimos datos hasta que el usuario diga que no quiere agregar más
	while (true) {
		try {
			// Lectura de campos desde consola
			const id = Number(prompt("ID único: "));
			const usuario = prompt("Usuario: ");
			const tipo = prompt("Tipo (hardware/software/red): ");
			const nivel = Number(prompt("Nivel de urgencia (1-5): "));
			const activoInput = prompt("¿Está activo? (s/n): ").toLowerCase();

			// VALIDACIÓN LÓGICA (forma larga, comprobaciones separadas)
			if (isNaN(id)) {
				throw new Error("Datos incoherentes o fuera de rango: id no es un número");
			}
			if (!usuario) {
				throw new Error("Datos incoherentes o fuera de rango: usuario vacío");
			}
			// opcional: verificar tipo explícitamente
			if (!["hardware", "software", "red"].includes(tipo)) {
				throw new Error("Datos incoherentes o fuera de rango: tipo no válido");
			}
			if (isNaN(nivel)) {
				throw new Error("Datos incoherentes o fuera de rango: nivel no es un número");
			}
			if (nivel < 1) {
				throw new Error("Datos incoherentes o fuera de rango: nivel menor que 1");
			}
			if (nivel > 5) {
				throw new Error("Datos incoherentes o fuera de rango: nivel mayor que 5");
			}

			// Determinar 'activo' en forma larga (if/else en lugar de expresión corta)
			let activo;
			if (activoInput === 's') {
				activo = true;
			} else {
				activo = false;
			}

			// Creamos la solicitud y la congelamos para evitar mutaciones posteriores
			const solicitud = Object.freeze({
				id, usuario, tipo, nivel,
				activo: activo
			});
			// Guardamos la solicitud en el array de originales
			solicitudesOriginales.push(solicitud);

		} catch (error) {
			// Manejo controlado de errores de validación / parsing
			console.log(`[FALLO CONTROLADO]: ${error.message}`);
		}
		// Preguntamos si se desea agregar otra solicitud; comprobaciones explícitas
		const respuestaContinuar = prompt("¿Agregar otra solicitud? (s/n): ");
		if (respuestaContinuar == null) {
			break;
		}
		const respuestaLower = respuestaContinuar.toLowerCase();
		if (respuestaLower !== 's') {
			break;
		}
	}

	// -------------------------------------------------------
	// 3. RECORRIDO Y ANÁLISIS
	// Explicación:
	// - Se separan las solicitudes activas (validas) de las rechazadas (inactivas)
	// - Se procesa cada válida: se clasifica y luego se envía usando distintos métodos
	//   (callback, promesa o async) para ejemplificar diferentes estilos asíncronos.
	// - Se muestran resultados por consola.
	// -------------------------------------------------------
	const validas = solicitudesOriginales.filter(s => s.activo);
	const rechazadas = solicitudesOriginales.filter(s => !s.activo);

	console.log("\n--- LISTADO DE SOLICITUDES PROCESADAS ---");
	try {
		for (const [index, item] of validas.entries()) {
			// Clasificación (no muta el objeto original)
			const procesada = clasificarNivel(item);
			let resultado;

			// Estrategia de envío según el índice:
			// - índices múltiplos de 3 -> callback
			// - resto -> promesa o async/await
			if (index % 3 === 0) {
				// Ejemplo de uso de callback: la respuesta llega en la función callback
				enviarCallback(procesada, (err, res) => {
					// En un caso real deberíamos manejar 'err' también
					console.log(`OK: ID ${res.id} | Categoría: ${res.categoria} | ${res.estado}`);
				});
			} else {
				// Uso de promesas / async-await: podemos await y capturar el resultado
				resultado = index % 3 === 1 ? await enviarPromesa(procesada) : await enviarAsync(procesada);
				console.log(`OK: ID ${resultado.id} | Categoría: ${resultado.categoria} | ${resultado.estado}`);
			}
		}
	} catch (e) {
		// Captura de errores en el flujo asíncrono
		console.log("Error en flujo asíncrono:", e.message);
	}

	// -------------------------------------------------------
	// 4. DATOS DE SALIDA
	// Explicación: mostramos un resumen con las solicitudes rechazadas y un mensaje final.
	// -------------------------------------------------------
	console.log("\n--- REPORTE FINAL ---");
	console.log("Rechazadas:", rechazadas.map(r => `ID ${r.id} (Motivo: Inactiva)`));
	console.log("Finalización del proceso sin bloqueos.");
}

// Inicio del programa
sistemaGestionSoporte();