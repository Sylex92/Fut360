# Prompt 03 — Motor determinista de sesión

Implementa el motor de sesión como paquete independiente de React y Three.js.

Aplicar docs/architecture/SESSION_ENGINE_CONTRACT.md, definido en 01. Estados:
- idle;
- preparing;
- ready;
- running (phase demonstration, work o rest);
- paused;
- completed;
- aborted.
- error.

Comandos:
- start;
- pause;
- resume;
- skip;
- repeat;
- abort;
- tick.

Invariantes:
- el reloj no avanza en pausa;
- un intervalo termina una sola vez;
- skip no duplica eventos;
- repeat encola una ocurrencia completa después del descanso actual, sin recortar programa;
- completar produce un único evento;
- la duración calculada coincide con la definición.

Incluir omisión que conserva descanso, pausa automática al ocultar, huecos no acreditados, comandos idempotentes y guardias de ocurrencia; Pause/Abort no se pierden al cruzar frontera. Usar los casos de aceptación del contrato. Persistencia durable corresponde a 08; no fingir recuperación con memoria volátil.

Incluir ExtendPreparation del contrato: sumar 30000/60000 ms al restante, consumir preparación adicional y comenzar trabajo automáticamente; sin estado de estar listo. Contadores separados de base, extras de práctica y pausa manual. Probar fronteras, suma de toques, idempotencia del mismo comando, pausa total y cambio de objetivo. La vista previa no envía avances de trabajo; no crear todavía animación 3D.

Usa reloj inyectable y pruebas con tiempo falso.
Conecta una vista mínima de texto al motor; la integración 3D se hará en la siguiente fase.


## Cierre de fase
Leer PROJECT_STATUS.md y comprobar que la fase anterior fue aceptada. Ejecutar únicamente esta fase. Antes de instalar o descargar, presentar necesidad, licencia, versión y permiso requerido. Al terminar, actualizar el estado con pruebas realmente ejecutadas y pendientes. No continuar automáticamente ni publicar/subir archivos.
