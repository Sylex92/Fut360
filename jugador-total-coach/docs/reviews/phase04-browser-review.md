# Fase 04: pruebas en navegador — 2026-09-30

## Entorno y alcance

Playwright MCP ya disponible, en una pestaña independiente de Chrome 153 sobre Windows. No se instalaron dependencias de navegador ni se cambió la configuración global. El conector de IAB sigue sin conectar; su fallo no impedía usar este navegador independiente. Las dos consultas manuales de controles/teclado enviadas inicialmente se retiraron expresamente al encontrar esta vía.

WebGL 2 real, renderer informado: ANGLE / Intel UHD Graphics (0x00004628) / Direct3D11. Primer viewport 1034×549, pruebas posteriores a 1280×800 y ancho reducido 390×844, DPR 1. El ancho reducido conserva motor y GPU de escritorio: no es un Samsung emulado ni físico.

Versiones probadas: base e8457ee/f27d2bc y, al final, el único cambio de texto de pausa de este turno. Build final: index-C6taBwK4.js, ExerciseScene-DJob9nch.js, index-Bmh7R24Y.css y hip-hinge-v1-BNOtzeRP.glb. Avatar, animación y lógica temporal no cambiaron. GLB con SHA-256 45466b100e7f1aa3d6d66643f9cdcd612a83de3d0b6a22257b960d82969ac4fe.

## Resultados observados

Las acciones se ejecutaron mediante controles reales de la página y esperas sobre el DOM. No se aceleró ni sustituyó el reloj de la aplicación. Los fallos de red/contexto se indujeron solo en esta pestaña de prueba.

| Caso y reproducción | Evidencia y resultado |
|---|---|
| Iniciar y añadir +1 min durante ejemplo | Preparación añadida 01:00; permaneció en marcha y pasó automáticamente al trabajo tras aproximadamente 70 s desde el inicio. No requirió Continuar. |
| Pausar trabajo, añadir +30 s, continuar | La pausa manual se conservó. Tras Continuar, la preparación transcurrió y volvió sola al trabajo guardado; espera observada de unos 30,2 s incluida interacción del comprobador. No es una medición exacta de latencia. |
| Añadir +30 s durante trabajo | Mostró ejemplo y cuenta para retomar el punto guardado, mantuvo Pausar todo y retomó sin otro toque. Total de preparación añadida en ese recorrido: 02:00. |
| Inspector y teclado | Tab desde Continuar llegó a Ver despacio; Enter abrió y enfocó el panel; Tab llegó al cursor y Home/flecha lo movieron. Reproducción a ½ velocidad y pausa no movieron el reloj de sesión (00:30). Volver al punto guardado devolvió el foco a Ver despacio. |
| Restauración del gesto | Cursor visible al abrir nuevamente: 100 ms antes/después. Tras esperar dos frames de render, capturas PNG del canvas iguales byte a byte; el reloj permaneció 00:30. La primera comparación sin esperar render dio distinta imagen: se corrigió la sincronización del comprobador, sin cambiar el reproductor. |
| Cámaras | Frontal, tres cuartos y lateral funcionaron con la sesión pausada; cuenta conservada en 00:08 y capturas reales inspeccionadas. Se distinguen cuerpo completo, pies y área de referencia. No constituye análisis biomecánico exhaustivo. |
| Repetir / cancelar / omitir | Añadir mostró 01:00 extra y aviso; cancelar dejó 00:00; volver a añadir repuso 01:00. Omitir pasó a descanso completo de 00:20 y canceló el extra. Es la regla vigente del contrato: evitar repetir por sorpresa lo omitido. Se corrigió la expectativa errónea de la guía, no el motor. |
| Bloque adicional | Añadido durante el descanso conservado, comenzó después de ese descanso. Recorrió su preparación, trabajo finito, reposo y descanso; terminó con base y extra en 00:00 y un solo botón para preparar otra prueba. |
| Minuto completo sin intervenciones | Build final: preparación → secuencia → reposo final de 6 s → descanso de 20 s → fin. 60009 ms entre primera actualización de ejecución y fin observados en DOM. Sin extras, omisiones o reinicio espontáneo. Registro en JSON enlazado abajo. |
| Ancho 390×844 | Documento de 390 px, sin desbordamiento horizontal ni controles fuera del ancho. Canvas 304×380 CSS px; botones visibles de 44 px de alto. Inspector enfocado, dentro del viewport al abrir (y≈280–678). Captura inspeccionada sin solapamiento; no certificación WCAG ni prueba móvil real. |
| Pérdida de contexto durante trabajo | WEBGL_lose_context provocó aviso y bloqueó Continuar; cuenta 00:30 antes/después de recargar avatar. El recurso volvió y la sesión siguió pausada hasta pulsar Continuar. |
| Descarga GLB fallida | Una solicitud abortada mediante route: aviso específico, inicio deshabilitado y 01:00 intacto. Retirar la interceptación y Volver a cargar avatar dejó el inicio disponible, sin iniciar solo. |
| Timeout GLB | Solicitud interceptada sin respuesta; aviso observado a los 25416 ms desde solicitud, coherente con límite de 25000 ms más observación. Inicio bloqueado y reloj intacto; retirar route y reintentar recuperó el avatar. Un primer intento de liberar manualmente la solicitud ya atendida produjo error del comprobador, no de la app; se repitió sin esa doble liberación y pasó. |
| Fallo del módulo del visor | Abortar ExerciseScene-*.js mostró Recargar página y aviso de descartar la prueba; no ofreció el reintento incorrecto del avatar. Retirar route y pulsar el botón cargó la página con inicio disponible y 01:00. |
| Mensaje durante pausa | Se corrigió el defecto de presentación observado: la frase de autoinicio aparecía también pausado. Build final observado: «Preparación pendiente: 00:38. El tiempo avanzará al continuar.»; al continuar, vuelve la frase de inicio automático. No cambió el reloj. |

## Consola, rendimiento y límites

Uso normal y recorrido final: **cero errores y un aviso** de obsolescencia de THREE.Clock. Se identificó new THREE.Clock() en Fiber 9.8.1 instalado, dist/events-9ce18a08.esm.js:1054. No se parcheó la dependencia ni se silenció el aviso. Los errores de descarga y avisos de contexto inducidos se separan de esta consola normal.

La muestra de requestAnimationFrame produjo 19 intervalos durante 19,3 s, mediana ≈1015,6 ms. El documento informaba visible. Es un resultado lento en este navegador controlado; la causa no está aislada y podría involucrar limitación por visibilidad/oclusión del entorno, pero no se ha demostrado. **Esta primera muestra no acredita fluidez** del PC habitual o del Samsung. El flujo temporal E2E sí avanzó y terminó correctamente. Se conserva y se contrasta a continuación, sin cambiar flags/GPU globales. La espera inicial del comprobador suponía sumar 19,9 s antes de detener el muestreo y agotó su timeout; se recuperaron los datos reales, sin inventar muestras adicionales.

Contraste posterior: se llamó page.bringToFront() y se hizo visible el canvas. Una primera muestra de 5 s con pose detenida obtuvo mediana 16,7 ms/p95 17 ms. Se repitió con avatar en preparación y trabajo durante 20 s: 1201 intervalos, media 16,662 ms, mediana 16,6 ms, p95 17 ms, p99 17,2 ms, máximo 33,3 ms y ninguno >50 ms. Documento visible/enfocado, 1280×800, DPR 1. [Datos](phase04-browser-foreground.json). Esto indica sensibilidad al estado de presentación del navegador de pruebas; no identifica por sí solo el mecanismo interno de limitación. Es evidencia breve de cadencia de callbacks mientras se renderiza, compatible con unos 60 por segundo, no recuento certificado de cuadros físicamente presentados ni garantía de rendimiento sostenido o del Samsung.

Verificaciones del cambio de texto: 128 pruebas / nueve archivos, lint, TypeScript, formato y build correctos. Prettier señaló inicialmente el archivo editado, se aplicó solo a ese archivo y se repitió format:check con éxito. Persisten los avisos conocidos de CommonJS de Three en la suite y de chunk 3D >500 KB en build.

## Evidencia conservada

- [Registro temporal y muestra RAF inicial](phase04-browser-evidence.json) y [contraste al frente con movimiento](phase04-browser-foreground.json).
- [Lateral en navegador](evidence/phase04/browser-desktop-side.png), [frontal](evidence/phase04/browser-desktop-front.png) y [tres cuartos](evidence/phase04/browser-desktop-three-quarter.png).
- [Inspector a ancho reducido](evidence/phase04/browser-narrow-inspector.png). Estas capturas preceden a la corrección de la frase de pausa; conservan el defecto observado.
- [Canvas antes](evidence/phase04/inspector-return-before.png) y [después del inspector](evidence/phase04/inspector-return-after.png), iguales tras renderizar el retorno.
- [Fallo GLB inducido](evidence/phase04/browser-asset-failure.png), [fallo del módulo inducido](evidence/phase04/browser-module-failure.png) y [final del minuto](evidence/phase04/browser-one-minute-final.png).
- [Mensaje de pausa corregido](evidence/phase04/browser-paused-preparation-fixed.png), capturado tras el build final.
- [Consola normal inicial](evidence/phase04/browser-normal-console.txt) y [consola del build final](evidence/phase04/browser-final-console.txt).

## Pendiente para aceptación

El usuario confirmó por separado cinco minutos sin anomalías y el regreso tras minimizar; no repetirlos sin una nueva incidencia. Quedan prueba física/rendimiento en Galaxy S24 FE/Chrome y revisión conjunta de claridad del gesto/texto/apariencia, sin atribuir revisión profesional a una aceptación del usuario. Ficha y clip continúan draft. El usuario confirmó PC y teléfono en la misma Wi-Fi de confianza. Se preparó un segundo preview temporal enlazado a la IPv4 Wi-Fi actual y puerto 4174, conservando loopback en 4173. HTML y cuatro recursos responden HTTP 200 con bytes idénticos; esto todavía no demuestra acceso desde el teléfono. Dirección y recorrido móvil entregados en la conversación, respuesta pendiente. Sin cambios de firewall/router/certificados ni publicación. La primera IP consultada dejó de pertenecer a la Wi-Fi antes del arranque; se reconsultó y se utilizó la actual. PID/logs en .local. Fase 04 todavía no se declara cerrada y 05 no se ha iniciado.
