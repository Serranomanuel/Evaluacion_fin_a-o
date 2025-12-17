# Documentación Técnica: Sistema de Registro de Transacciones Bancarias (Ejercicio 2)


## 1. ¿Qué hacen las variables principales?


* **`transacciones`**: Es una lista (arreglo) donde se guardan únicamente los movimientos que el usuario autorizó. Es como el libro contable del banco.
* **`id` y `cliente`**: Son los datos de identificación. El ID debe ser un número positivo y el cliente es el nombre de la persona que hace el movimiento.
* **`monto`**: Es la cantidad de dinero de la transacción. El programa siempre verifica que sea un número válido y que no sea negativo.
* **`totalDepositos` y `totalRetiros`**: Son acumuladores que van sumando todo el dinero que entra y sale para darte un reporte final exacto.

## 2. Riesgos y cómo los controlamos


* **Errores al escribir**: Si alguien escribe letras en lugar de dinero, el programa usaría un escudo llamado `try/catch`. En lugar de apagarse el programa, te avisa: "El monto ingresado no es válido" y te deja seguir con la siguiente tarea.
* **Transacciones no autorizadas**: Un riesgo es procesar dinero sin permiso. Por eso, el programa pregunta "(s/n)". Si el usuario no dice que "s" (sí), el dinero no se suma a los totales y se cuenta como una transacción rechazada.
* **Datos perdidos**: Para evitar que la información se pierda mientras se procesa, usamos una **Promesa**. Esto asegura que el programa espere un segundo a que todos los datos estén listos antes de mostrar el resumen en pantalla.





## 3. El camino que sigue el programa (Paso a paso)

El sistema funciona en este orden para que no haya confusiones:

1.  **Pedir información**: El programa te solicita el ID, tu nombre y qué quieres hacer (Depositar, Retirar o Transferir).
2.  **Verificar el dinero**: Revisa que el monto sea un número real y positivo. Si intentas poner números negativos, el sistema te detiene.
3.  **Preguntar permiso**: Antes de guardar nada, te pide confirmar si autorizas el movimiento.
4.  **Simular el proceso**: Una vez terminas de ingresar todo, el programa "simula" que envía la información a una base de datos (espera 1 segundo de forma asíncrona).
5.  **Dar el reporte**: Finalmente, el sistema hace las cuentas por ti y te dice:
    * Cuánto dinero entró en total por depósitos.
    * Cuánto dinero salió por retiros.
    * Cuántas transacciones fueron rechazadas por falta de autorización.
