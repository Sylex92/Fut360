# Fase 07 — sesión completa v2

2026-10-01. Implementación y verificación técnica terminadas; pendiente la aceptación del nuevo flujo en computadora/Samsung. Autorizada al aceptar el empuje contra pared y solicitar continuar. [Plan previo al código](../plans/phase07-expand-hour.md), [cierre de 06](phase06-closeout.md). No se ejecuta 08–09.

## Qué se entrega

Nueva definición independiente, `home-foundations-60min-v2`: seis bloques, 52 intervalos y **3600 s exactos**. Preparación 925 s, ventanas de práctica 1648 s y descanso 1027 s. Incluye cambios explícitos de material y series finitas con descanso del tiempo sobrante. [Definición](../../content/workouts/mvp1-60min-v2.json), [fundamento de dosis/variantes/transiciones](../training/PHASE07_SESSION_REVIEW.md). La bibliografía y el análisis no se importan al producto.

Compilador y JSON Schema verifican estructura, unicidad, lados, rondas, duración de bloques/total y cabida de cada secuencia. Dominio admite el propósito explícito `training-draft`; no se cambia la máquina de estados. Fixture histórico v1 y lockfile conservan sus hashes. No se añaden dependencias, herramientas, servicios ni modelos; no se modifica ningún GLB/fuente. [Costos/reutilización](phase07-cost-and-reuse.md).

La nueva pantalla es la vista inicial. Precarga los dieciséis recursos y evalúa un solo avatar visible por instante; al cambiar ejercicio no hace otra solicitud. Timeline, siguiente, lados/rondas, preparación/práctica/descanso, reloj móvil junto al modelo y controles bajo el visor. Cámaras arriba, incluido detalle de pies cuando hay balón. Pausa congela reloj/pose; inspección lenta tiene foco visible; +30/+60 amplían preparación conservando autoinicio. Repetir durante descanso identifica el ejercicio anterior y anuncia el nombre; la nueva vista previa empieza desde su inicio. Omisión conserva descanso. Ocultar/mostrar sigue la política ya aceptada. Aviso sonoro final local silenciable, con final visible aunque el navegador impida audio.

## Cobertura real

Las categorías describen dimensiones diferentes, no una suma de estados excluyentes. [Matriz por variante/hash](evidence/phase07/coverage.json).

| Dimensión | Resultado |
|---|---:|
| Patrones representados | 12/12 |
| Variantes/ejemplos reales | 16/16 |
| Recursos listos técnicamente | 16 |
| Recursos con `reviewStatus: draft` deportivo | 16 |
| Fallbacks / recursos ausentes | 0 / 0 |
| Revisión profesional atribuida | 0 |

Claridad de recursos aceptada cualitativamente en 06; la aceptación de pared queda cerrada el 2026-10-01. No se transfiere automáticamente a usabilidad del flujo completo ni a adecuación personal. La combinación control/giro es una sucesión de intervalos con instrucciones para detener/recolocar el balón; no un gesto nuevo de contacto continuo. No hay clip de tumbarse/levantarse: se da preparación e instrucción explícita, sin llamar a un cambio instantáneo de modelo «transición enseñada». No se sustituye un ejercicio por falta de recurso.

## Evidencia ejecutada

- Suite general: **217 pruebas correctas en trece archivos**; la prueba adicional de una hora se ejecutó aparte. Lint, tipos, formato y build correctos. Los ajustes finales de rótulos se verificaron en navegador y con tipos/build/lint/formato, sin atribuirles otra ejecución de toda la suite.
- [26 comprobaciones de navegador](evidence/phase07/browser-results.json): recursos, pausa de píxeles/reloj, inspector/foco, extras en pausa, repetición/cancelación, navegación protegida, fin/reinicio, fallo de GLB, pérdida/recuperación de WebGL, teclado y ancho 390 px. Ocultación mediante evento sintético; no una minimización física del Samsung. Pruebas iniciales se ajustaron para excluir URLs `blob:` locales del concepto de red externa y esperar el efecto React que libera navegación; no fueron cambios de la aplicación para ocultar fallos.
- [Recorrido acelerado ×60](evidence/phase07/accelerated-hour.json): 52 intervalos, 16 variantes, 6 bloques, final único y una creación de tono con contexto de audio activo. 60227,2 ms hasta observar el final en UI; **no equivale a una hora de reloj real**. Se conserva el modo explícito `?e2e=1`, con advertencia visible para no seguir físicamente el movimiento.
- [Muestra RAF de escritorio](evidence/phase07/desktop-raf.json): 1202 intervalos en 20 s; mediana 16,7 ms, p95 16,9 ms, máximo 17,2 ms, ninguno >50 ms. Dieciséis recursos analizados en memoria, un avatar visible. No FPS medidos en Samsung ni garantía de cada cuadro físicamente presentado.
- [Entrega local](evidence/phase07/delivery.json): 25 archivos servidos por PC/LAN con HTTP 200 y bytes iguales al build. La dirección Wi-Fi vigente se comprobó, sin modificar firewall/router. La IP puede cambiar; no tratarla como URL permanente.
- [Una hora real del motor](evidence/phase07/real-hour.json): correcta, tasa 1× y 3.600.000 ms de programa consumidos exactamente; 3.600.055,609 ms de tiempo monotónico observado, diferencia correspondiente al muestreo. Sin pausas, omisiones, extras ni huecos sin acreditar. 157 transiciones; separación máxima entre muestras de 80,105 ms. No ejecuta movimientos físicos ni mide renderizado.
- Procedencia de las pruebas largas: comenzaron con la definición guardada en [línea base](evidence/phase07/workout-timing-baseline.json). Durante su ejecución se añadieron metadatos de versión, referencias exactas y discriminación de dosis; [comparación y prueba de equivalencia](evidence/phase07/timing-equivalence.json) confirman que identidades, lados, rondas, texto, dosis y tiempos no cambiaron. El primer arnés Node tomó el hash al finalizar; su evidencia declara esa limitación y el arnés ya captura el hash al inicio para futuras ejecuciones. No se afirma que la compilación visual final estuvo cargada durante toda la hora. [Recorrido acelerado posterior](evidence/phase07/final-accelerated-hour.json) vuelve a cubrir 52 intervalos, 16 variantes y seis bloques; los últimos cambios de rótulos/inspector se probaron por separado.
- [Una hora real en Chromium/WebGL](evidence/phase07/browser-real-hour.json): completada sin acelerar. 52 intervalos, 158 registros de estado incluyendo inicio/final, cero transiciones de pausa, cero muestras ocultas y cero errores capturados. Final observado a los 3.600.351,1 ms desde la instalación del observador, que precedió al clic de inicio unos 300 ms; no interpretar ese tiempo como deriva del motor. Restante 0, resumen de reproducción 60:00, extras/omisiones/pausas 00:00, una sola creación de tono con contexto activo. [Captura final inspeccionada](evidence/phase07/real-hour-complete.png). No se midió el sonido acústico ni el número de cuadros efectivamente presentados durante toda la hora.
- Seguimiento focalizado de la compilación final: repetir durante descanso anuncia el ejercicio anterior, restablece su ejemplo y al cancelar recupera el siguiente; etiqueta «Repetición extra» y cámara de pies correctas. WebGL no disponible impide iniciar y muestra recuperación explícita. Consola normal sin errores; persiste el aviso conocido de THREE.Clock. La instrumentación de fallos se mantiene separada del recorrido normal.

## Límites y pendientes concretos

El usuario tiene una consulta pendiente de revisión breve del nuevo flujo en computadora/Samsung, sin solicitarle hacer los ejercicios ni esperar una hora. Pruebas a ancho 390 px y la aceptación anterior de clips no sustituyen esa comprobación física.

Se conserva `draft`: las dosis son una propuesta documentada de familiarización, no una prescripción individual. No se ha observado al usuario entrenar ni se han medido tolerancia, aprendizaje o transferencia al campo. Tobillo de pie y pierna alterna son adaptaciones propias con los límites de sus fichas. No existe una obligación genérica de contratar revisor externo para avanzar; cualquier necesidad personal posterior debe plantearse con una razón concreta conforme a ADR 0012.

No persistencia/recuperación tras recarga, PWA offline, IA personalizada ni exportación. Se bloquea cambiar de vista durante la sesión y se usa el aviso del navegador antes de abandonar cuando está disponible; no sustituye guardar datos. Chunks 3D grandes y aviso conocido de THREE.Clock siguen documentados. Se mantiene la separación entre demostración guiada y laboratorio Rapier.
