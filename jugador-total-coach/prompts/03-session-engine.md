# Prompt 03 — Motor determinista de sesión

Implementa el motor de sesión como paquete independiente de React y Three.js.

Estados:
- idle;
- preparing;
- working;
- resting;
- paused;
- completed;
- aborted.

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
- repeat reinicia solo el ejercicio actual;
- completar produce un único evento;
- la duración calculada coincide con la definición.

Usa reloj inyectable y pruebas con tiempo falso.
Conecta una vista mínima de texto al motor; la integración 3D se hará en la siguiente fase.


## Cierre de fase
Leer PROJECT_STATUS.md y comprobar que la fase anterior fue aceptada. Ejecutar únicamente esta fase. Antes de instalar o descargar, presentar necesidad, licencia, versión y permiso requerido. Al terminar, actualizar el estado con pruebas realmente ejecutadas y pendientes. No continuar automáticamente ni publicar/subir archivos.
