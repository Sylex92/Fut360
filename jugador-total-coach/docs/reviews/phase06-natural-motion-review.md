# Fase 06 — corrección de coordinación del avatar

2026-09-30. Respuesta al comentario del usuario: buena visualización general, pero movimiento estático/robotizado, brazos de marcha sin acompañar y preferencia por básicos con balón sin saltos. Se conserva el diseño del maniquí. La observación no identifica una nueva prueba específica en Samsung ni supone aceptación deportiva. [Plan previo](../plans/phase06-natural-motion.md).

## Resultado

Nueve recursos v2 sustituyen a sus v1 en «Movimientos · fase 06». Son versiones nuevas y corregibles; las v1, la bisagra de 04 y el laboratorio de 05 se conservan. La biblioteca abre con la marcha y muestra las duraciones decimales reales. No cambian encuadre/tamaño del visor, apariencia, motor de sesión o ejercicio seleccionado por razones de comodidad de animación.

| Ejemplo | Corrección | Duración del ejemplo |
|---|---|---|
| Marcha en el sitio | Seis pasos, brazo contrario, flexión de codos y pequeños acompañamientos de pelvis/tronco | 8 s |
| Campanitas | Dos pares de toques, brazos y tronco acompañando; contacto medial acercado al balón | 6,5 s |
| Planta lateral, izquierda/derecha | Transferencia gradual hacia el apoyo, flexión de codos y acompañamiento del tronco | 6,5 s cada una |
| Interior/exterior, izquierda/derecha | Misma coordinación y ajuste de aproximación del pie en contacto exterior | 6,5 s cada una |
| Giro por pasos, izquierda/derecha | Brazos coordinados, pelvis acompañando los pasos cortos y retorno explícito | 7,2 s cada uno |
| Sentadilla corta | Codos menos rígidos, conservando el recorrido breve y los dos apoyos | 5,2 s |

La naturalidad propuesta proviene de coordinación entre segmentos y transiciones menos detenidas; no de añadir oscilaciones aleatorias o aumentar toda velocidad. Los básicos con balón mantienen al menos un pie apoyado. Saltar no es una progresión universal demostrada ni un requisito para que la animación sea fluida. La velocidad del visor permite observar; no prescribe ritmo o dosis. La estabilidad intencional del puente, variante supina y postura de respiración se conserva.

**Reutilización:** Walk_Loop del Quaternius Standard CC0 ya adquirido aporta 129 muestras de ángulo de brazo y flexión de codo para marcha y ambos giros. No se adopta su caminata completa ni se afirma origen mocap. Referencia JSON conservada y extracción reproducida con hash idéntico; [licencia y procedencia](../../ASSET_LICENSES.md). Blender IK, bake y exportador realizan la adaptación; no solver, rig o editor nuevos. Sin descargas, instalaciones, dependencias o costos obligatorios adicionales. Nuevas fuentes .blend y scripts de autoría identificados en el [pipeline](../3d/ANIMATION_PIPELINE.md).

**Fundamento:** el NHS indica acompañamiento rítmico de brazos y codos flexionados en la marcha; FIFA describe interiores alternos y postura relajada para fluidez. Los ángulos, tiempos y adaptación estacionaria son decisiones propias, no un protocolo exacto de esas fuentes. Véase [fundamento interno y límites](../training/PHASE06_DOCUMENTARY_REVIEW.md#corrección-de-coordinación-y-naturalidad--2026-09-30); nada de esta investigación se importa al portal. No se atribuye revisión profesional ni efecto medido en aprendizaje o rendimiento.

## Verificación realizada

- **179 pruebas en once archivos**, lint, tipos, formato y build correctos. Quince pruebas añadidas: una de coordinación contralateral/seis pasos y apoyo de marcha; cinco de acompañamiento de brazos y ausencia de vuelo en básicos con balón, muestreados a 60 Hz; nueve comparan exactamente atributos de mallas/pesos, materiales, texturas y nombres de huesos contra v1. El diseño del avatar queda conservado.
- **Nueve GLB v2 sin errores ni advertencias de Khronos**, 1812 poses muestreadas a 30 Hz. Vértices/balón dentro del área declarada, continuidad, retorno inicial/final y apoyos revisados; mayor paso de una articulación entre muestras, 0,04676 m. Es un umbral de inspección, no una medida de naturalidad. [Informe con hashes de GLB y fuentes](evidence/phase06-natural-motion/asset-validation.json).
- **Cinco clips con balón, 196 muestras cada uno**, consulta de esfera contra triángulos deformados. Planta: separación de aproximadamente 0,11 mm; campanitas: contacto a 3,82–3,88 mm; interior/exterior: separación de contacto hasta 6,96 mm y penetración máxima aproximadamente 0,011 mm, dentro de las tolerancias declaradas de 2/10 mm. [Mediciones y hashes](evidence/phase06-natural-motion/ball-surface-check.json). No se afirma ausencia matemática de toda intersección ni contacto dinámico físicamente calculado.
- La revisión detectó y corrigió una transferencia demasiado temprana que estiraba una pierna, la separación de contacto exterior tras modificar apoyo y un hueco de unos 32 mm entre interior y balón. Se graduó la transferencia y se ajustó la aproximación del pie (5 mm en exterior, 30 mm en campanitas). El recurso del laboratorio histórico no se reescribió.
- **Veinte comprobaciones en navegador correctas:** arranque, reproducción, pausa de cursor y píxeles, cámara sin reinicio, media velocidad, 2× de campanitas, cambio de recurso, final finito de las nueve versiones, revisión con teclado, ancho 390 px, ausencia de errores y solicitudes externas. [Resultado](evidence/phase06-natural-motion/browser-results.json), [recorrido reproducible](evidence/phase06-natural-motion/browser-flow.mjs). El script devuelve su informe para guardarlo; las capturas se guardan dentro del proyecto.
- Capturas frontal/lateral/tres cuartos de las nueve versiones examinadas por el agente; hojas enlazadas abajo. [Vista de 390 px](evidence/phase06-natural-motion/library-390.png) sin solapamientos ni desbordamiento observado. Es emulación en escritorio, no comprobación en Samsung físico. El navegador de pruebas estuvo en primer plano para evitar el throttling ya documentado en 06.
- Consola sin errores durante el recorrido normal, aviso conocido de THREE.Clock. El build conserva aviso de chunks grandes. Blender mantiene avisos previos de parentesco de mallas y color no utilizado; se comprueban la salida glTF y la identidad visual, sin ocultarlos. Una primera invocación del recorrido no llegó a empezar por limitación de importación del conector de pruebas; se corrigió el script y se ejecutó completo, sin cambiar la app por ello.
- Preview PC/LAN: HTTP 200, JavaScript servido idéntico al build, dieciséis GLB distribuidos (quince seleccionables y campanitas v1 de 05). Verificados 87 Markdown en docs/assets/source/raíz y 532 enlaces locales; [entrega](evidence/phase06-natural-motion/delivery-check.json). Las versiones v1 aceptadas y el lockfile no cambian.

## Evidencia visual

| Recurso | Frontal, lateral y tres cuartos |
|---|---|
| Marcha | [Tres vistas](evidence/phase06-natural-motion/active-march-review.png); [paso contrario](evidence/phase06-natural-motion/march-right-step.png) |
| Campanitas | [Tres vistas](evidence/phase06-natural-motion/inside-inside-review.png) |
| Planta izquierda / derecha | [Izquierda](evidence/phase06-natural-motion/lateral-sole-roll-left-review.png), [derecha](evidence/phase06-natural-motion/lateral-sole-roll-right-review.png) |
| Interior/exterior izquierda / derecha | [Izquierda](evidence/phase06-natural-motion/inside-outside-left-review.png), [derecha](evidence/phase06-natural-motion/inside-outside-right-review.png) |
| Giro izquierda / derecha | [Izquierda](evidence/phase06-natural-motion/soft-step-turn-left-review.png), [derecha](evidence/phase06-natural-motion/soft-step-turn-right-review.png) |
| Sentadilla corta | [Tres vistas](evidence/phase06-natural-motion/mini-squat-review.png) |

## Alcance y pendientes

Verificado: salida técnica, diseño conservado, coordinación medida, apoyos/contactos en las muestras y comportamiento de reproducción. Propuesto: estas curvas y amplitudes como mejora visual de los ejemplos. Pendiente: que el usuario vea y acepte la nueva naturalidad/claridad y funcionamiento de estos recursos en su Samsung. No se presenta «más humano» como un resultado cuantificado o ya aceptado. Las manos conservan su pose sencilla; no se añade actuación de dedos ni realismo facial.

La animación sigue siendo una ilustración guiada: la revisión no mide fuerzas ni estabilidad del centro de masa, y no certifica técnica o dosis individual. Los recursos mantienen draft. Silla, entradas/salidas al suelo y composición de la hora mantienen sus pendientes anteriores; no se repite la pregunta de silla durante esta corrección ni se ejecuta 07. Sin publicación ni cambios globales. [Estado vigente](../../PROJECT_STATUS.md).
