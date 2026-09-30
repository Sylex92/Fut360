# Fase 04: comprobación de la demostración en pantalla

Actualizada el 2026-09-30. Fuente: [DemoPanel](../../apps/coach-pwa/src/ui/DemoPanel.tsx), [contrato del motor](../architecture/SESSION_ENGINE_CONTRACT.md), [informe de fase](phase04-vertical-slice-review.md) y [pruebas reales en navegador](phase04-browser-review.md).

## Evidencia disponible

- **Usuario:** aparición del avatar, detención conjunta de reloj/avatar, ajuste de hombros, recarga/inicio y apertura visible/controles del inspector confirmados. El 2026-09-29 acepta el regreso automático tras minimizar. El 2026-09-30 informa que el recorrido solicitado de cinco minutos termina sin anomalías. No atribuir revisión profesional ni cronometría independiente a esos reportes.
- **Agente, navegador:** Playwright independiente con WebGL 2/Intel UHD, capturas de tres cámaras, controles, preparación adicional, inspector/foco, ancho de 390 px, minuto completo y fallos inducidos comprobados. IAB sigue sin conectar, pero ya no bloquea estas verificaciones. Las dos consultas manuales anteriores de controles/teclado fueron retiradas al descubrir esta vía; no esperar ni volver a pedir esas respuestas.
- **Agente, código/recursos:** 128 pruebas en nueve archivos, lint, tipos, formato y build correctos, repetidos tras la pequeña corrección del mensaje de pausa. Validación previa del GLB y fuente conservada. CPU y navegador son evidencias distintas.
- **Pendiente:** Samsung físico, rendimiento móvil y comprensión/calidad del gesto. La muestra RAF inicial fue lenta; poner el navegador al frente y canvas visible permitió una nueva muestra con avatar en marcha: 1201 intervalos en 20 s, mediana 16,6 ms y p95 17 ms. Es referencia breve de escritorio, sin garantizar rendimiento sostenido o móvil. Apariencia y lectura no se declaran aceptadas por haber validado contadores.

## Casos y resultados

| Caso | Resultado requerido | Estado actual |
|---|---|---|
| Pausa / continuación | Conservar pose y cuenta; retomar el mismo punto. | Usuario confirma detención; agente confirma pausa/retorno durante pruebas reales, incluyendo inspección y recurso. |
| Cámaras / inspector | Cambiar vista sin reiniciar; abrir con foco visible, mover solo el ejemplo y volver al punto/foco guardados sin reanudar solo. | Tres cámaras comprobadas; Tab/Enter/cursor y retorno comprobados. Canvas antes/después idéntico tras renderizar retorno; usuario ya confirmó uso del inspector. |
| +1 min / autoinicio | Sumar a preparación, mantener ejemplo y empezar solo al agotarse. | Comprobado en navegador con tiempo real; suma 01:00 y comienzo automático. |
| +30 s durante trabajo / pausa | Conservar punto de trabajo; ejemplo durante extra y retorno automático. Respetar pausa manual hasta Continuar. | Ambos escenarios comprobados en navegador. La pausa histórica reportada junto a posible minimización no tiene causa determinada; no se atribuye al botón. |
| Repetir / cancelar | Añadir un bloque tras descanso; cancelar solo el extra pendiente. | Añadir/cancelar/volver a añadir comprobados; otro extra recorrió sus fases y terminó con contadores en cero. |
| Omitir | Omitir trabajo restante, conservar descanso y cancelar el extra pendiente de esa ocurrencia. | Comprobado: descanso 00:20 y extra 00:00. La guía anterior esperaba conservarlo por error; corregida conforme al contrato vigente, sin modificar el motor. |
| Un minuto / cinco minutos | Trabajo finito, reposo y descanso; final único, sin reinicio. | Un minuto completo observado por el agente, 60009 ms entre primera actualización y fin. Cinco minutos aceptados por reporte del usuario. |
| Teclado / ancho / consola | Foco alcanzable y retorno; sin controles recortados o superpuestos; sin errores normales de consola. | Inspector por teclado y ancho 390×844 comprobados; botones de 44 px de alto, sin desbordamiento. Cero errores, un aviso de THREE.Clock proveniente de Fiber. No certificación integral de accesibilidad. |
| Fallo/reintento | Detener cuenta e impedir inicio/continuación sin avatar; recuperar sin autoiniciar. | Descarga GLB, timeout, pérdida real de contexto y fallo del módulo comprobados mediante inyección controlada. Avisos y acciones de recuperación correctos. |
| Lectura / apariencia / técnica | Gesto comprensible, cuerpo/apoyos visibles, texto relacionado con la pose. | Capturas reales inspeccionadas; hombros aceptados por el usuario. Mantener revisión conjunta de movimiento/texto y límites del estilo del cuerpo; no inferir aprendizaje, técnica personal ni dosis válida. |

Una repetición corporal es una bisagra completa: cadera atrás y retorno. El bloque técnico contiene 10 s de ejemplo, tres gestos de 8 s, 6 s de reposo y 20 s de descanso. Repetir bloque añade todo ese minuto. No son dosis deportivas aprobadas.

## Visibilidad ya revisada

Ocultar/minimizar pausa sin consumir ese tiempo. Volver visible retoma automáticamente solo si estaba en marcha y la única causa era ocultación. Pausa manual, inspección y fallos mantienen su pausa. [ADR 0010](../architecture/adr/0010-resume-on-visible.md), pruebas con reloj inyectado y aceptación manual posterior del usuario. No volver a exigir Continuar tras una ocultación normal ni repetir esa consulta sin nueva incidencia.

## Prueba pendiente en Samsung

El usuario confirma el 2026-09-30 que PC y teléfono están en la misma Wi-Fi de confianza. Se prepara un segundo preview temporal en la IPv4 Wi-Fi actual, puerto 4174; la dirección concreta se entrega en la conversación y puede cambiar al cambiar de red. Se conserva 127.0.0.1:4173 para la computadora. HTML y cuatro recursos comprobados HTTP 200 y bytes idénticos al build. Esto no demuestra todavía acceso desde el teléfono.

Recorrido agrupado solicitado en Chrome del Samsung Galaxy S24 FE / Android 16: abrir la dirección temporal, probar un minuto, cambiar cámara y añadir +30 s durante preparación; informar carga, fluidez, lectura y autoinicio. Solo revisar la pantalla, sin ejecutar físicamente el ejercicio. Versión real de Chrome móvil y respuesta pendientes. Si no conecta, informar el error antes de proponer cambios; no se ha cambiado firewall, router ni seguridad.

La prueba HTTP por LAN no acepta instalación PWA, origen seguro ni offline, previstos después. El agente mantiene responsabilidad de la implementación y de investigar cualquier incidencia. La revisión humana conjunta está asignada al usuario con apoyo del agente; su aceptación no se presenta como revisión profesional. Ficha/clip siguen draft y 04 no se declara cerrada; 05 no se inicia.
