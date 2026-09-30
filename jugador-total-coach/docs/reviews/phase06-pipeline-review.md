# Fase 06 — biblioteca y pipeline de movimientos

2026-09-30. Alcance autorizado: prompt 06 y revisión documental según ADR 0012. **Entrega técnica parcial: once de doce patrones; empuje con silla pendiente de condiciones reales.** No se ejecuta 07 ni se declara una rutina de una hora lista.

## Resultado concreto

Quince ejemplos GLB: bisagra y campanitas existentes, más trece archivos nuevos. Variantes derecha/izquierda para tobillo, pasos con giro, planta lateral e interior/exterior. Marcha, sentadilla corta, puente bilateral, pierna alterna con brazos apoyados y respiración cómoda completan los once patrones. Esta última es postura quieta; no una simulación de la respiración. [Catálogo por recurso/lado](../../assets/phase06-catalog.json).

Biblioteca visible con selector, tres cámaras arriba, controles debajo, reproducción finita, pausa, revisión por instante y velocidad de observación. Encuadre específico para suelo. Campanitas permite 2× para observar el gesto más ágil; ninguna velocidad se prescribe como cadencia del usuario. Las pruebas de 04 y 05 siguen disponibles. No se genera una nueva sesión ni persistencia.

La investigación queda exclusivamente en [PHASE06_DOCUMENTARY_REVIEW](../training/PHASE06_DOCUMENTARY_REVIEW.md): finalidad, motivo, fuente, variante/adaptación, dosis propuesta y límites para los doce patrones. Se distinguen guías técnicas de estudios de eficacia y decisiones propias. Fuentes consultadas no significan que sus autores aprobaron nuestros recursos. No se exige contratación externa ni se concede coaching-reviewed.

## Reutilización y trazabilidad

Mismo Quaternius CC0, 65 huesos, pesos, ropa y correcciones; Blender portable, IK/bake/exportador y motores existentes. Sin descargas/dependencias/costos obligatorios nuevos. Scripts de autoría por grupos, fuentes .blend y manifiestos por GLB; [costos y carencias comprobadas](phase06-cost-and-reuse.md), [licencias](../../ASSET_LICENSES.md), [comandos](../3d/ANIMATION_PIPELINE.md).

Se normalizó el manifiesto de campanitas al contrato común: alternate/animation, inicio/final y metadatos de ejemplo; se preservaron procedencia, contactos y notas con propiedades opcionales estrictas en el esquema. Sus binarios GLB/fuente y los de bisagra no cambian. Las pruebas verifican esos hashes. Un par visual de toques no es una dosis personal.

## Comprobaciones ejecutadas

- 164 pruebas en once archivos, lint y tipos correctos. Los 32 casos nuevos resuelven cada ficha/variante/recurso/fuente, comparan la configuración de la vista con el manifiesto, prueban pausa/seek/final y apoyos de puente y marcha supina.
- Quince archivos pasan Khronos sin errores ni advertencias. Muestreo a 30 Hz de todos los vértices, incluido balón: escala/bounds dentro del cuadrado 2×2, rig, continuidad de articulaciones, pose inicial/final y apoyos declarados. [Mediciones y hashes](evidence/phase06/asset-validation.json). No comprueba fuerzas, equilibrio humano, anatomía clínica ni todo instante continuo.
- Cuatro variantes nuevas con balón: 301 muestras cada una. Distancia de esfera a triángulos del avatar, con consultas de Three; no se construye un solver. Planta: separación de aproximadamente 0,11 mm; interior/exterior: 3,68–7,61 mm durante contacto ilustrado. Ninguna intersección en esas muestras. [Evidencia](evidence/phase06/ball-surface-check.json). Es tolerancia gráfica, no impacto físicamente calculado.
- En autoría se corrigieron flotación/apoyo de cabeza y manos del puente, separación de planta y un cruce del pie a través del balón en los fotogramas intermedios de interior/exterior. La trayectoria ahora retira el pie antes de cruzar y acercarse por la otra superficie. La comprobación no se limita a poses principales.
- Quince ejemplos tienen capturas frontal, lateral y tres cuartos para inspección del agente. Se conservan como evidencia técnica; no se atribuye revisión humana del usuario de estos nuevos recursos.
- Diecinueve comprobaciones E2E favorables: carga solo del GLB elegido, pausa, final finito/reinicio, cámara sin cambiar tiempo, seek con teclado, cambio de movimiento, 2×, ocultación/regreso y respeto de pausa manual, fallo de GLB/reintento y pérdida de contexto/reintento, ancho 390 px y controles de al menos 44 px. [Resultados](evidence/phase06/browser-results.json), [recorrido normal reproducible](evidence/phase06/browser-normal-flow.mjs), [fallos y ancho](evidence/phase06/browser-failure-flow.mjs).
- Consola normal sin errores, aviso conocido de THREE.Clock. Fallo de red y evento de pérdida de contexto provocados se registran aparte; no se cuentan como errores espontáneos. Ninguna solicitud externa observada: GLB, scripts y texturas locales/blob. Búsqueda en JavaScript distribuido sin referencias a los documentos/fuentes de fundamentación.
- [Vista estrecha](evidence/phase06/library-390.png) y [escritorio](evidence/phase06/library-desktop.png) inspeccionadas: textos/controles sin superposición. Muestra RAF de escritorio con puente quieto: 120 intervalos en dos segundos, mediana 16,7 ms, p95 16,9 ms. No mide entrenamiento sostenido, animación de todos los clips ni Samsung real.
- La primera prueba temporal agotó el plazo porque el navegador de automatización estaba relegado y entregaba aproximadamente un RAF por segundo pese a reportar visible. Llevar la pestaña de pruebas al frente recuperó la cadencia y pasó el recorrido; no se cambió la aplicación para ocultar el resultado. El visor descarta intervalos superiores a 250 ms para no saltar sobre suspensión; es tiempo de observación, distinto del motor de entrenamiento. Ocultación se comprobó mediante evento/propiedad simulados, no minimización nativa.
- Formato y build correctos. El build sirve quince GLB locales; no se instala nada. La advertencia conocida sobre tamaño de chunks queda registrada, sin ocultarla.
- Verificación documental: 95 Markdown UTF-8 y 461 enlaces locales existentes. Runtime completo: 12.476.280 bytes en quince GLB; solo el seleccionado se solicitó en el arranque observado. HTTP 200 en preview PC y LAN; JavaScript servido en ambos idéntico al build, SHA-256 `b2e15037eadb035dffd3b6bc301007aec1f1601fa9a5ffc6a42ecc646ab63de9`. Lockfile y binarios aceptados de 04/05 sin diferencias.

## Pendientes concretos

1. Empuje inclinado: se consultaron medidas aproximadas del asiento, ruedas/plegado/apoyabrazos. Faltan esa respuesta, variante de agarre, estabilidad contra vuelco/deslizamiento y cabida de silla+cuerpo. Sin recurso sustituto invisible ni aprobación basada solo en «silla firme».
2. Aceptación de claridad de los nuevos gestos y recorrido en Samsung físico. La aceptación de 04/05 no se extiende automáticamente a los clips de 06. Se puede agrupar el recorrido; no exigir una autorización por cada cámara.
3. Tobillo de pie y marcha supina son adaptaciones explícitas, con límites documentados; no equivalencias exactas a las fuentes. Revisar comprensión de apoyos. Entradas/salidas al suelo no animadas: la repetición empieza ya colocado.
4. Composición, dosificación individual, preparación/transiciones suficientes y nueva hora completa pertenecen a 07. Regresiones/dosis candidatas están en el documento interno; no son variantes GLB ya producidas ni prescripción liberada. Fichas y recursos conservan draft.

Advertencias conocidas: exportador Blender avisa sobre parentesco de mallas y color de vértices no usado; se comprobaron rig/materiales y salida glTF. Build advierte chunks grandes. No se desactiva un aviso para simular un resultado limpio. No PWA/offline, medición física del usuario, sincronización o exportación en esta fase.
