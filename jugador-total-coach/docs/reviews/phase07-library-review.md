# Biblioteca ampliada — 2026-10-02

## Entrega

Búsqueda sin acentos por nombre e indicaciones; filtros de objetivo/material combinables, contador de variantes, selección conservada mientras siga visible, estado vacío y limpieza. Cambiar de ejemplo reinicia ese visor en pausa. Se conservan tamaño, apariencia del avatar y cámaras/controles. Observación 2× disponible en los siete ejemplos con balón.

Dos GLB nuevos: interior, exterior y planta, izquierdo/derecho, 13,6 s, una secuencia finita. Biblioteca: 18 variantes, 13 patrones contando la combinación como uno; no dos habilidades completamente nuevas. La hora v2 sigue con 16 variantes/12 patrones y 52 intervalos. Su dosis y revisión de dificultad no cambian por añadir recursos a la biblioteca.

[Plan previo](../plans/phase07-library-expansion.md), [fundamento interno](../training/BALL_COMBINATION_REVIEW.md), [fuentes y reels pendientes](progressive-training-sources.md), [catálogo](../../assets/phase06-catalog.json). El nombre histórico del archivo de catálogo se conserva para evitar una migración ajena al cambio; versión 2 con las nuevas variantes de 07.

## Verificado

- Blender 4.5.14 portable existente: `tools/build_ball_combination.py`, dos .blend editables y GLB de 926.652 bytes (izquierdo) y 926.656 bytes (derecho). Reutiliza clips v2 y herramientas existentes; no nuevo rig, física o dependencia.
- Khronos: cero errores/advertencias. 409 poses por lado a 30 Hz, 65 huesos, dentro de 2×2, continuidad, retorno y apoyos dentro de los umbrales del validador. [Izquierdo](evidence/phase07-library-left/asset-validation.json), [derecho](evidence/phase07-library-right/asset-validation.json).
- Contactos: 409 muestras por lado; separación máxima durante contacto ≈6,95 mm, intersección mínima ≈0,01 mm. [Medición](evidence/phase07-library/ball-surface-check.json). Muestreo geométrico discreto, no dinámica biomecánica, fuerza o validación deportiva.
- 227 pruebas correctas. Una prueba de hora real omitida por diseño del runner general, ya ejecutada históricamente y no repetida para esta entrega. Contratos de fichas/manifiestos/hashes, apariencia, apoyos y pausa/retorno cubren los nuevos recursos. La primera ejecución detectó formato incorrecto de `footballTransfer`; corregido antes de la ejecución final.
- Lint, tipos, formato y build correctos. Persiste aviso conocido de chunks grandes; dependencias y lockfile sin cambios.
- 14 comprobaciones de navegador: búsqueda, filtros, vacío sin visor residual, limpiar, selección, cámaras/pies, pausa, reproducción finita de ambos lados, Tab y anchos 412/360 px sin desbordamiento. Cero errores de consola. [Resultados](evidence/phase07-library/browser-results.json).
- Revisión visual del agente: [escritorio](evidence/phase07-library/library-desktop.png), [móvil](evidence/phase07-library/library-mobile.png), [planta derecha](evidence/phase07-library/right-feet.png), [planta izquierda](evidence/phase07-library/left-feet.png), [interior izquierdo](evidence/phase07-library/left-interior.png). Apoyos y balón visibles con las cámaras existentes.
- Preview local y enlace de red actual respondieron HTTP 200. El enlace LAN anterior estaba asociado a otra dirección; se inició preview acotado a la IP Wi-Fi actual, sin cambiar firewall/router o configuración global.

El navegador integrado no pudo conectarse: se usó Chromium independiente. Una espera inicial se agotó antes de traer la pestaña de prueba al frente; la repetición en primer plano pasó sin cambiar la app. Viewports móviles no acreditan Samsung real. Se conservan advertencias conocidas de THREE.Clock.

## Reutilización, licencia y costos de esta función

| Componente | Reutilizado/adaptado | Costo y condición |
|---|---|---|
| UI/búsqueda | React y controles nativos; filtro específico en TypeScript | Sin cuenta/servicio/pago; busca en el catálogo local. |
| Avatar/ball | Quaternius CC0 registrado; ropa, balón y poses v2 propias | Sin adquisición; malla, pesos, materiales y rig conservados por prueba. Aportaciones propias sin nueva licencia pública. |
| Autoría/visor/verificación | Blender/exportador, Three/Fiber/Khronos existentes | Sin instalación. Dos GLB añaden ≈1,85 MB al build; no promesa de hardware, mantenimiento o servicios futuros gratuitos. |
| Fuentes públicas | Lectura/enlaces y síntesis documental propia | Sin medios, miniaturas, libros o cursos empaquetados. Acceso público no concede redistribución. |

Análisis de funcionalidad/costos con versiones y auditorías existentes; [assets](../../ASSET_LICENSES.md). No cambia el roadmap financiero ni se activan Remotion, IA externa, sincronización o exportación.

## Pendientes

- Claridad y funcionamiento de las dos variantes nuevas en Samsung físico; no repetir aceptaciones históricas sin cambios/incidencias.
- Reels y fragmentos específicos de 7MLC no revisables en este acceso; quedan como candidatos sin atribución de contenido.
- Siguiente autoría: reorientación/salida diagonal con planta, después recepción y tareas por función con entorno/resultado explícitos. Las fichas de campo no se convierten en ejercicios de 2×2.
- Corrección completa de la hora, dificultad y progresión abiertas. Historial/offline, planificador flexible y conversación aún no implementados. No se declara revisión profesional ni mejora individual.
