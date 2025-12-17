# Documentación Técnica: Sistema de Validación y Envío de Solicitudes (Ejercicio 3)


## 1. Descripción de las Variables y Operadores Especiales


* **`solicitudesOriginales`**: Es el arreglo principal que guarda la información. Se mantiene intacto durante todo el proceso para cumplir con la regla de **no mutar los datos**.
* **Desestructuración (`const { nivel } = solicitud`)**: Usamos esta técnica para "sacar" directamente el dato que necesitamos de un objeto sin tener que escribir nombres largos, lo que hace el código más limpio.
* **Operador Spread (`...`)**: Lo usamos para crear copias de las solicitudes y añadirles la categoría (Alta, Media, Baja) sin modificar la ficha original. Es como sacarle una fotocopia a un documento y escribir solo en la copia.
* **`nivel`**: Reemplaza a la prioridad del ejercicio anterior, funcionando como el indicador numérico (1-5) para la urgencia del caso.

## 2. Riesgos Identificados y Manejo de Errores


* **Incoherencia de datos**: Si un ID es negativo, el nivel de urgencia no está entre 1 y 5, o el tipo de soporte no es válido, el sistema genera un "Fallo Controlado". Esto evita que se procese información basura.
* **Bloqueos por procesos externos**: El envío de datos a un servidor puede fallar o tardar. Usamos bloques `try/catch` para que, si un envío falla, el programa simplemente nos avise y pase a la siguiente solicitud en lugar de detenerse.
* **Mutación accidental**: Existe el riesgo de cambiar los datos originales por error. Para solucionarlo, usamos `Object.freeze` y métodos de arreglos como `.filter()`, que crean listas nuevas en lugar de cambiar la principal.



## 3. Flujo del Programa


1.  **Ingreso de Información**: El usuario registra el ID, nombre, tipo de soporte, nivel de urgencia y si la solicitud está activa.
2.  **Validación de Reglas**: El programa verifica que los datos tengan sentido lógico antes de guardarlos en el arreglo inmutable.
3.  **Filtrado de Registros**: Se separan las solicitudes en dos grupos: las **Válidas** (activas) y las **Rechazadas** (inactivas), explicando en el reporte el motivo del rechazo.
4.  **Clasificación Moderna**: Se analiza el nivel de urgencia para asignar la categoría (Alta, Media o Baja) usando funciones que no alteran el objeto original.
5.  **Simulación de Envío Asíncrono**: Se envían las solicitudes usando tres métodos:
    * **Callbacks**: Para procesos tradicionales por turnos.
    * **Promesas**: Para un manejo de espera más ordenado.
    * **Async/Await**: Para que el código asíncrono se lea de forma fácil y lineal.
6.  **Finalización**: Se muestra un resumen detallado y se confirma que el proceso terminó con éxito y sin bloqueos de memoria.

