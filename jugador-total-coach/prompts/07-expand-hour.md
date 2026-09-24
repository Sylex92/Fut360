# Prompt 07 — Expandir hasta la sesión completa

Solo ejecutar después de aceptar la rebanada vertical, el motor y el pipeline.

1. Importa `content/examples/mvp1-60min.workout.json`.
2. Crea el catálogo de ejercicios requerido.
3. Para assets aún no producidos usa fallback visual explícito, nunca silencio.
4. Implementa:
   - timeline por bloques;
   - ejercicio siguiente;
   - lado;
   - ronda;
   - trabajo/descanso;
   - beep final;
   - controles.
5. Añade modo de prueba acelerado para E2E.
6. Verifica exactamente 60 minutos en modo real.
7. Reporta cobertura real de assets:
   - listo;
   - draft;
   - fallback;
   - pendiente de revisión.

No añadas personalización IA.

## Revisión de alcance

Los fallbacks sirven solo para desarrollo; el informe final bloquea la entrega de entrenamiento si falta un asset revisado. No crear gestos mediante oscilaciones genéricas de huesos y presentarlos como técnica. No usar física libre para todos los ejercicios. Comprobar legibilidad y variantes reales, especialmente ambos pies en suelo para sentadilla dividida.


## Cierre de fase
Leer PROJECT_STATUS.md y comprobar que la fase anterior fue aceptada. Ejecutar únicamente esta fase. Antes de instalar o descargar, presentar necesidad, licencia, versión y permiso requerido. Al terminar, actualizar el estado con pruebas realmente ejecutadas y pendientes. No continuar automáticamente ni publicar/subir archivos.
