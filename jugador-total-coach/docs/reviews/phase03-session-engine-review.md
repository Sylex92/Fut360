# Fase 03 — motor temporal y vista de prueba

Fecha: 2026-09-28. Alcance autorizado: prompts/03-session-engine.md, usando las herramientas existentes. **Cierre técnico de 03 completado**, con pruebas automatizadas, reporte manual favorable de avance/botones/consola/Tab/ancho y captura conservada e inspeccionada. La interacción y consola se sustentan en el reporte del usuario; la observación directa del agente corresponde a la imagen. Sin E2E automatizado, certificación integral de accesibilidad ni aprobación deportiva. La corrección menor de redondeo posterior a la captura se verificó con regresión automatizada y build; no se atribuye al usuario una segunda prueba.

## Resultado disponible

La página local conserva el diagnóstico y añade «Prueba el avance automático». Ofrece una secuencia técnica de un minuto —preparación/trabajo/descanso de 5/10/15 s para A y 5/20/5 s para B— y el archivo histórico de 60 minutos. Esas duraciones prueban fronteras; no son una propuesta de ejercicios ni de dosis. El archivo deportivo permanece draft e intacto.

- Inicio único y transiciones automáticas; preparación adicional de +30 s/+1 min sin una segunda confirmación. La vista anuncia objetivo, lado y cuenta restante. En los cinco segundos finales hay aviso visible, sin audio todavía.
- Pausar todo congela el cursor del programa; continuar lo retoma. Ocultar la página pausa y volver no reanuda. Un hueco de muestreo superior a 2000 ms se registra sin acreditar trabajo.
- Omitir descarta solo el trabajo pendiente del ejercicio actual y conserva descanso; cancela su repetición pendiente. Repetir añade una copia completa del mismo lado después del descanso actual; puede cancelarse antes de comenzar.
- Separación de programa base, extras, preparación, pausas observadas, omisiones, cancelaciones y huecos. Tiempo de reproducción no equivale a actividad física medida.
- Recargar pierde la prueba: solo memoria. Se puede preparar una nueva prueba después de completar o terminar la anterior; una sesión terminada no se reabre.

## Archivos y responsabilidades

| Ruta | Responsabilidad |
|---|---|
| packages/domain/src/session.ts | Contratos y snapshot inmutable validado; milisegundos enteros seguros |
| packages/exercise-catalog/src/compile.ts | Expansión del fixture v1 a 60 ocurrencias con identidad estable; conversión única de segundos |
| packages/exercise-catalog/src/validate.ts | Validador previo trasladado sin alterar su lógica; exportado por index.ts |
| packages/session-engine/src/index.ts | Estado determinista, comandos idempotentes, fronteras, eventos y proyección; solo depende de domain |
| apps/coach-pwa/src/platform/session-clock.ts | Reloj inyectable, política de huecos/visibilidad y muestreo anterior a comandos |
| apps/coach-pwa/src/composition/session.ts | Composición local y secuencia técnica de un minuto |
| apps/coach-pwa/src/ui/SessionPanel.tsx | Controles y proyección textual; efectos React gestionan muestreo/limpieza |
| tests/session-engine.test.ts, tests/session-clock.test.ts, SessionPanel.test.tsx | Reglas temporales, adaptador y render HTML |

App.tsx incorpora el panel; styles.css añade disposición adaptable y foco. ESLint impide importar plataforma/React/red/almacenamiento en el motor y usar allí relojes o temporizadores globales. No hay servicios vacíos ni implementación de fases posteriores.

## Verificado

Comandos ejecutados desde el proyecto, todos con salida correcta:

```powershell
node tools/pnpm.mjs run format:check
node tools/pnpm.mjs run lint
node tools/pnpm.mjs run typecheck
node tools/pnpm.mjs run test
node tools/pnpm.mjs run build
```

**85 pruebas en cinco archivos.** Incluyen las 24 existentes y 61 nuevas. Cobertura relevante:

| Grupo | Evidencia automática |
|---|---|
| Programa | Fixture inalterado, duración exacta, snapshot propio/inmutable, IDs únicos; rechazo de datos inválidos, overflow y más de 10000 ocurrencias |
| Avance | Fronteras 40/20 s, múltiples segmentos por avance confiable, descansos cero, una única finalización y callbacks posteriores sin reapertura |
| Pausa | Cursor 12.345 ms conservado después de 300.000 ms de pausa; base 3600 s + extra 60 s + pausa 300 s = 3960 s registrados |
| Comandos | commandId repetido no duplica; guardias de sesión/revisión/ocurrencia; Pause/Abort toleran fronteras; ID de extra no colisiona con IDs base |
| Omisión/repetición | Conservación del descanso/base/lado; una repetición pendiente; cancelación; omisión del extra separada de base |
| Preparación | 20+30=50 s; 5+30+60=95 s; autoinicio; pausa total; retorno al cursor si llega tarde; transferencia/cancelación de objetivo al cambiar extra; base 60 min + preparación = 60:30/61:30 |
| Conservación | 20 secuencias reproducibles de 100 acciones verifican contadores, identidades, finales de segmentos y terminal único |
| Adaptador | Reloj fraccionario normalizado, umbral 2000/2001 ms, valores negativos/no finitos, ocultación/regreso y recursos no disponibles; comandos muestrean antes de actuar |
| Pantalla | HTML identifica prueba/draft/pérdida por recarga; muestra preparación, pausa/huecos y lado del próximo objetivo. Regresión de redondeo a 3200 ms: base restante 59:57 y registrado 00:03, con milisegundos internos intactos. No acredita clics reales ni efectos React en navegador |

Build final correcto: 115 módulos; JavaScript 387,82 kB (117,17 kB gzip), CSS 8,74 kB (2,63 kB gzip). Son tamaños de salida, no mediciones de rendimiento móvil. El servidor preview existente escucha solo en 127.0.0.1:4173. Servir archivos no prueba ejecución de JavaScript ni ausencia de errores de consola.

Comprobación de la entrega inicial: HTML y JavaScript con HTTP 200; asset index-CvYP8xQb.js servido con SHA-256 idéntico al archivo compilado local y contiene el panel nuevo. 68 documentos decodificados como UTF-8, 199 enlaces locales válidos y git diff --check correcto. La petición de mostrar la página en Codex quedó en cola; no se interpreta como prueba de visualización. El build de la corrección posterior genera index-CqYMhzmH.js.

Fixture SHA-256: `0967293497539f57f71d201e019d7203b9707ab4152b7a6be0ecb9b4021fc40e`. Esquema de workout: `5dfb5c501845de1d4c0f5c352f931c42e9f6d1978f14200c471b5034f56fc1c8`. Ambos coinciden con la evidencia anterior. No se cambia la sesión ni se aprueba su contenido.

## Reutilización, dependencias y costo

Solo se añade el paquete propio privado @fut360/session-engine, con dependencia interna de domain. Se enlazó mediante `node tools/pnpm.mjs install --offline --ignore-scripts --no-frozen-lockfile`: cinco proyectos, 141 paquetes reutilizados, cero descargas y cero paquetes externos añadidos. Las secciones packages/snapshots del lockfile son idénticas a HEAD de 02; cambian únicamente importadores/enlaces internos. Comprobación posterior `install --offline --frozen-lockfile --ignore-scripts`: correcta, «Already up to date», sin nuevas descargas.

Se conserva el [inventario/licencias de 02](phase02-dependencies.md). No se presenta aquel resultado de vulnerabilidades como una consulta nueva. No hay nueva cuenta, servicio, pago, generador IA, recurso audiovisual o licencia pública del código. [Justificación de la pieza propia](../architecture/REUSE_MATRIX.md).

## Supuestos y límites explícitos

- El umbral de 2000 ms es política de detección del proyecto. Pasar pruebas inyectadas no valida su sensibilidad en cada dispositivo. Si el hilo se bloquea, se favorece no avanzar trabajo sin observación.
- El máximo de 10000 ocurrencias y los enteros seguros son límites de implementación. No son límites médicos ni una promesa de ejecución ilimitada. Eventos/comandos quedan en memoria durante cada prueba.
- Snapshot del plan conserva versión y valores, sin inventar hash de recursos ni checkpoints. Los eventos de esta fase no constituyen un historial durable recuperable; el almacenamiento consistente se implementará en 08.
- El fixture v1 no tiene segmentos propios de demostración: el compilador no inventa tiempo dentro de sus 60 minutos. La secuencia técnica corta sí los incluye para probarlos. La sesión deportiva definitiva requiere sus fichas y transiciones revisadas.
- Recursos disponibles significa texto de prueba disponible. No hay avatar, bucle de demostración, inspección a 0,5×, cámaras, audio, física, material visual ni PWA offline. No se afirma haber validado enseñanza, técnica corporal, seguridad, usabilidad o rendimiento móvil.

## Revisión manual y cierre

Actualización tras la entrega: el usuario informa «si hice pruebas de la parte de prueba de avance automático y como funcionan los botones y parecen estar correctos». Evidencia manual general favorable, sin detalle suficiente para atribuir todos los escenarios, teclado/ancho reducido o revisión exhaustiva de usabilidad. No se solicitan de nuevo las mismas pruebas como si no se hubieran realizado. Inicialmente pidió orientación para revisar la consola; su comprobación posterior se registra a continuación.

Guía proporcionada: abrir la aplicación en Chrome de Windows y usar Ctrl+Mayús+J; mantener visible la consola y sus errores, recargar y utilizar los controles para observar mensajes. Comunicar el texto o captura de errores, o su ausencia durante ese recorrido. No requiere escribir comandos. Referencias oficiales consultadas para la guía: [abrir DevTools](https://developer.chrome.com/docs/devtools/open) y [consola/filtros](https://developer.chrome.com/docs/devtools/console/reference). No convertir la entrega de instrucciones en una comprobación ejecutada.

Resultado posterior: el usuario confirma «listo comprobado no aparece ningún error en la consola». Se registra ausencia de errores observados durante su recorrido manual y se resuelve el pendiente de consola. No hay inspección directa del agente ni captura de consola; no generalizar a escenarios no probados. No se repiten pruebas de código porque esta actualización solo registra evidencia, sin modificar la aplicación.

El intento con browser-use falló: «No Codex IAB backends were discovered». No se añadieron herramientas ni se usaron otras interfaces para eludir el conector. La captura y el recorrido del usuario de 02 siguen siendo evidencia de **02**, no de estos controles nuevos.

Comprobación final del usuario: «se comprobó la navegación de Tab de manera correcta, de misma manera el ancho de la ventana y acomodo de textos y botones» y entrega captura. Resueltos los pendientes de navegación básica/acomodo por reporte manual y evidencia visual mediante inspección del agente. No inventar resultados detallados de cada tecla, dimensiones probadas ni escenarios no enumerados; no es certificación integral de accesibilidad. No repetir el recorrido ya confirmado sin un cambio o fallo relevante.

[Captura de fase 03](evidence/phase03-session-user.png): 1213×581 píxeles, 38893 bytes, SHA-256 `fc16bf1da7ffe621bee098b1b8873241616bb52ac91ec238de76f5f82964db9f`, idéntico al original y sin edición. Muestra active-march, siguiente ankle-mobility, reloj 00:42, base 59:57, registrado 00:04, extras en cero y controles de pausa/omisión/repetición/terminación y preparación +30 s/+1 min. Se observan legibilidad y separación adecuadas en la zona mostrada. El borde superior está recortado; no acredita el resto de la página, consola o comportamiento por sí sola. Los nombres son IDs del fixture técnico histórico, no fichas finales.

La revisión detectó un detalle de formato: se usaba ceil tanto en restantes como en acumulados y podía mostrarse 59:57 + 00:04. Corregido en SessionPanel: segundos completos para acumulados, redondeo superior para cuentas restantes, milisegundos del motor intactos. Regresión a 3200 ms verifica 59:57/00:03. Pasaron 85 pruebas, formato, lint, tipos y build. Se conserva la captura anterior sin editar y se distingue de esta corrección posterior. No cambian layout, semántica de botones ni navegación.

Verificación final del cierre: 68 documentos UTF-8 y 201 enlaces locales sin roturas; git diff --check correcto. Hashes del fixture/esquema conservados. HTML y JavaScript final devuelven HTTP 200; index-CqYMhzmH.js servido con SHA-256 idéntico al build local. La implementación base está en c35ff3f; este cierre conserva las confirmaciones, captura y corrección como punto de control local, sin publicación.

La indisponibilidad del conector queda como límite de la evidencia automatizada, no como motivo para repetir el recorrido manual ya documentado. La evidencia visual alternativa y el reporte cubren el cierre básico de esta fase. Prueba real en Samsung, optimización, PWA, demostración corporal y revisión deportiva conservan sus fases. No comenzar 04 (avatar/escena) sin el alcance correspondiente autorizado. [Estado vigente](../../PROJECT_STATUS.md).
