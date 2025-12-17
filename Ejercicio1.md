# Documentación Técnica: Sistema de Gestión de Soporte Técnico (Ejercicio 1)


## 1. Descripción de las Variables Principales


* **`solicitudes` y `solicitudesInvalidas`**: Son arreglos (listas) que actúan como contenedores. El primero almacena solo los objetos que pasaron las validaciones y fueron autorizados, mientras que el segundo guarda los registros rechazados para el reporte final.
* **`solicitudIndividual`**: Representa la ficha de datos de cada reporte. Se utiliza `Object.freeze` para asegurar la **inmutabilidad**, lo que significa que una vez creada la ficha, sus datos no pueden ser alterados accidentalmente.
* **`prioridad`**: Almacena un valor numérico (1 al 5) ingresado por el usuario. Es fundamental para determinar la urgencia del caso sin modificar el valor original.
* **`tipo`**: Guarda la categoría del problema (Hardware, Software o Red) después de validar que el usuario seleccionó una opción válida del menú.

## 2. Riesgos Identificados y Soluciones


* **Ingreso de datos no numéricos**: Si el usuario escribe texto en campos como el ID o la Prioridad, el programa podría fallar. Se implementó un bloque `try/catch` para capturar estos errores y mostrar un mensaje de advertencia sin detener la ejecución.
* **Información incompleta**: Se estableció un riesgo de "datos insuficientes" si la descripción tiene menos de 10 caracteres. El sistema rechaza automáticamente estas entradas para garantizar que el técnico tenga suficiente información.
* **Bloqueo de la aplicación**: El procesamiento de datos puede tardar. Para evitar que el programa se "congele", se aplicó **asincronía**, permitiendo que el sistema maneje los tiempos de espera de forma eficiente.

## 3. Flujo del Programa (Paso a Paso)


1.  **Captura de Datos**: Se solicitan los datos al usuario mediante la terminal (ID, Usuario, Tipo, Prioridad y Descripción).
2.  **Validación Estricta**: Cada dato pasa por un filtro. Si algo está mal, el `throw new Error` salta directamente al mensaje de error y permite al usuario intentar de nuevo.
3.  **Creación Segura**: Si los datos son correctos, se crea un objeto y se "congela" (inmutabilidad) para cumplir con las buenas prácticas de programación.
4.  **Clasificación de Prioridad**: El sistema evalúa la prioridad numérica:
    * **Alta**: 4 o 5.
    * **Media**: 2 o 3.
    * **Baja**: 1.
5.  **Simulación de Procesamiento**: Las solicitudes autorizadas se procesan usando tres técnicas: **Callbacks, Promesas y Async/Await**. Esto garantiza que el programa sepa comunicarse con procesos que toman tiempo.
6.  **Generación de Reporte**: El programa finaliza mostrando estadísticas totales y un listado detallado de qué se procesó con éxito y qué fue rechazado.
