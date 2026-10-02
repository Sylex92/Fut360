# Contratos de contenido y registro — fase 01

## Concreción de fase 07 — 2026-10-01

La definición nueva implementa `schemaVersion: 2` separado de `version: 2`, `locale: es-MX`, espacio 2×2, unión de material de las fichas, condición para detenerse y `reviewStatus: draft`. Los segundos de autoría se convierten una sola vez a milisegundos al compilar. Se conserva el v1 sin migración de nombres. [Esquema v2](../../content/schemas/workout-v2.schema.json), [compilador](../../packages/exercise-catalog/src/workout-v2.ts).

En v2 las entradas están **expandidas explícitamente**, cada una con `round`; `rounds` declara las rondas que deben existir ordenadas y no vuelve a multiplicar la lista. Así las transiciones excepcionales de material tienen tiempos propios. `resources` fija ejercicio/versión, asset/versión/SHA-256, nombre exacto de clip y escena existente versionada (`guided-standing-v1` o `guided-floor-v1`). El compilador contrasta esas referencias con fichas/manifiestos importados; el snapshot inmutable conserva los hashes junto al plan temporal. El motor sigue recibiendo solo el plan temporal independiente de 3D.

Cada entrada separa `doseKind` (time-based/repetition-based), `targetRepetitions`, `repetitionUnit` y la instrucción `dose`. Una ventana temporal no tiene repeticiones obligatorias; una serie finita debe declarar objetivo/unidad y caber en su trabajo. `exampleRepetitions` cuenta reproducciones del clip, no actividad observada. En pierna alterna la unidad es por lado y cada clip contiene ambas elevaciones. El propósito ejecutable se denomina `training-draft`: concreta el candidato documental sin otorgar aprobación deportiva. No se implementan todavía persistencia ni recuperación.

El resto conserva el contrato de diseño de 01 y sus campos previstos; fichas/manifiestos existentes se adaptan mediante sus versiones auditadas, sin fingir una migración de todos sus esquemas.

Fecha: 2026-09-27. Especificación documental, sin tipos TypeScript ni esquemas nuevos implementados. El fixture y los dos esquemas v1 siguen intactos. La implementación futura separará schemaVersion (formato) de version (revisión del contenido); no tratar este documento como si el esquema actual ya lo exigiera.

## Reglas comunes y relaciones

Identidad de contenido: id estable + version entera positiva; cambios de variante/técnica invalidan revisión previa. La versión de un recurso no se sobrescribe. Referencias resueltas fijan id/version y SHA-256 del archivo; el plan compilado conserva sus hashes. Texto de idioma es dato, no identidad. Números finitos, unidades explícitas, duraciones internas en milisegundos enteros, coordenadas en metros.

WorkoutDefinition contiene ocurrencias que referencian ExerciseDefinition. Cada ejercicio admite variantes y referencias AnimationAsset específicas por lado. SceneDefinition coloca avatar/props y declara cámaras, escala, rig y autoridad. Una ocurrencia resuelta une ejercicio + dosis + animación + escena; ningún visor decide por su cuenta qué variante utilizar.

Un nombre repetido no implica identidad; no buscar clips por coincidencias aproximadas ni sustituir una referencia rota. El compilador produce errores con ruta, id y causa.

## Ejemplo para la revisión guiada: una bisagra bilateral sin carga

Este ejemplo explica las responsabilidades usando hip-hinge, candidato ya elegido para el primer gesto visible. No crea una ficha, archivo, dosis o revisión deportiva, ni acredita que exista una animación incorporada.

| Definición | Qué aportaría al mismo ejercicio | Qué se comprobará |
|---|---|---|
| WorkoutDefinition: programa de sesión | Lugar de la bisagra en la secuencia, variante/versión exactas, dosis elegida, tiempo y descanso | Referencia correcta y duración total; ampliar preparación no cambia la dosis |
| ExerciseDefinition: ficha | Objetivo y descripción de la variante bilateral sin carga, apoyos, instrucciones, errores y límites | Claridad y revisión de contenido; no deducirla del nombre de un clip |
| AnimationAsset: recurso visual | Archivo/clip que representa esa variante y su presentación previa, duración, rig, licencia y revisión | Que exista, corresponda a la ficha y muestre el gesto completo sin defectos que cambien lo enseñado |
| SceneDefinition: escenario | Avatar a escala, área 2×2, suelo, cámaras y encuadre; vista lateral inicial propuesta | Cabida declarada, visibilidad y escala; no esconder apoyos ni encoger el cuerpo para que quepa |

Son contratos de datos de una misma aplicación. No significan cuatro aplicaciones, servidores o servicios independientes. El catálogo resuelve sus referencias y comprueba compatibilidad antes de compilar el programa; la app conecta ese resultado con el motor y el visor.

En reproducción: el motor indica preparación, trabajo, descanso y tiempo restante; el visor muestra el ejemplo o la práctica correspondiente. +30 s/+1 min cambia la preparación del motor, conserva ficha/dosis y mantiene la vista previa hasta el autoinicio. Cambiar cámara modifica la vista, sin reiniciar el ejercicio. El almacenamiento registra eventos y tiempos, sin afirmar ejecución corporal observada.

Una incompatibilidad explícita en datos, como pedir variante bilateral y referenciar una unilateral, se debe detectar antes de iniciar. Si un recurso está mal etiquetado, validar JSON no descubre por sí solo lo que enseña el movimiento: hace falta inspeccionar la animación frente a la ficha. Corregir archivo, mapping o manifest y volver a revisar las referencias afectadas. La sesión iniciada conserva sus versiones, conforme al contrato de recuperación.

Esta separación permite reparar una animación sin reescribir el reloj, ajustar un encuadre sin alterar la dosis y probar el motor antes de disponer de 3D. Es una razón de diseño; sus beneficios y la integración real siguen pendientes de comprobar. [Organización de módulos](ARCHITECTURE.md) y [primer ejercicio visible](../plans/first-visible-exercise-ready.md).

## WorkoutDefinition

| Campo o grupo obligatorio | Contrato |
|---|---|
| schemaVersion, id, version, title, locale | Formato soportado e identidad inmutable; español inicial |
| expectedDurationMs | MVP1 de entrenamiento: exactamente 3.600.000; fixtures técnicos pueden declarar otra duración y propósito |
| purpose | training-candidate o technical-test; una prueba nunca se ofrece como rutina aprobada |
| blocks | IDs únicos y orden; título, duración declarada, rounds entero positivo y entradas no vacías |
| entry | ID único en bloque, ejercicio/versión/variante, lado, dosis, demostración opcional, trabajo, descanso, escena y referencias de recursos |
| space, equipment | Unión real de requisitos; no incluir una banda solo porque existe en el inventario |
| safety, review | Indicaciones para parar y evidencia aplicable a secuencia, dosis y transiciones, no solo fichas aisladas |

Duración: expandir rondas y entradas; sumar demostración + trabajo + descanso; comparar por bloque y total. Trabajo >0, descanso ≥0; demostración ausente o >0. El compilador nunca añade tiempo oculto por cambio de material o lado. Vista previa ocupa el descanso ya programado. Los lados que necesiten dos entradas aparecen dos veces con duraciones independientes.

La definición nueva prevista será contenido versión 2 con schemaVersion 2 cuando se implemente y revise. El fixture v1 permanece como prueba histórica. No convertir sus 31 IDs al catálogo reducido cambiando únicamente los nombres. Véase [sesión objetivo](../training/MVP1_60_MIN_SESSION.md).

## ExerciseDefinition

| Campo o grupo obligatorio | Contrato |
|---|---|
| id/version, title, variantId | Movimiento y variante precisos; nombre genérico no sustituye descripción |
| objective, footballTransfer, limitations | Qué se practica y qué no demuestra el ejercicio doméstico |
| start, execution, finish | Posición, fases, apoyos, entrada/salida y retorno; orden comprensible |
| space, equipment, impact | Dimensiones positivas, altura requerida, material y apoyo; impacto declarado |
| sidePolicy | bilateral, unilateral o alternating; supportedSides explícitos, en referencia anatómica del practicante |
| cues, commonErrors, stopConditions | Texto breve, errores observables y acción de detenerse; no diagnóstico |
| regression | Variante concreta revisada o “pendiente; pausar/terminar”; nunca sustitución automática sin definir |
| dosageOptions | Opciones de dosis justificadas; cada ocurrencia elige una versión concreta, no un intervalo improvisado |
| animationBindings | variante/lado → AnimationAsset exacto, rig y escena compatibles |
| review | Investigación y revisión vinculadas a esta versión |

Dosis discriminada: time-based (tiempo de práctica y criterio de ritmo) o repetition-based (objetivo finito, cadencia demostrada y descanso dentro del sobrante). La ventana de trabajo es obligatoria en ambos. La secuencia visual finita debe caber en la ventana; no acelerar el clip para forzar cabida ni repetir indefinidamente fuerza. Dosis, intensidad y progresión siguen pendientes de autoría/revisión, no se heredan de los 40/20 del fixture.

Progression es opcional y no se implementa en MVP1. Ausencia de regresión validada no obliga a inventarla: se declara la limitación y se decide la elegibilidad de la ficha.

## AnimationAsset

| Campo o grupo obligatorio | Contrato |
|---|---|
| assetId, version, schemaVersion | Identidad de manifest; hash del archivo distribuido |
| uri, format, clipName | Ruta relativa local permitida, GLB/glTF 2.0 y clip existente con nombre exacto |
| durationMs, authoredFps | Duración positiva y FPS de autoría; FPS no gobierna el reloj del usuario |
| rigId/version, rigMappingId/version | Esqueleto real y correspondencia semántica documentada |
| startPose, endPose, playback | cyclic, finite o hold; loopable solo para cyclic; entrada/salida sin salto que enseñe otro gesto |
| previewPresentation | Secuencia explicativa repetible, con referencias, entrada/gesto/salida y retorno o separación explícitos; puede reutilizar el clip de práctica sin cambiar su dosis/playback |
| side, variantId | Lado anatómico/variante; espejo únicamente como derivación revisada con versión propia |
| cycleMarkers, contactWindows | Límites del gesto, pie/objeto, instante y tolerancia de revisión; lista vacía justificada cuando no hay contacto |
| rootMotion, bounds | Trayectoria del root, ocupación máxima cuerpo/props y unidades; no esconder traslación reseteando cada frame |
| requiredProps, syncTracks | Nodos/recursos y sus tiempos compartidos; offsets declarados, sin segundo reloj |
| recommendedCamera, camerasReviewed | Vista inicial y evidencia desde frontal, lateral y 3/4 |
| provenance, licenseId, review | Origen, edición, archivo/version/hash, derechos y revisión exactos |

El render evalúa la pose desde el cursor lógico. Three permite setTime, pero escala su entrada por timeScale: la implementación probará evaluación absoluta con factor 1 y cursor congelado al pausar, sin sumar update(delta) independiente. [Documentación AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html), consultada 2026-09-27. No se afirma que la integración esté hecha.

Mismo cuerpo y balón de enseñanza comparten timeline. Una animación procedente de IA, retargeting o simulación guardada tiene las mismas obligaciones; el origen no exime revisión.

La presentación previa puede repetir ejemplos de un clip finito sin convertir la serie de práctica en infinita. El retorno/separación se revisa y se identifica como parte de la explicación; no inventar una transición biomecánica. Cada recurso adicional lleva sus derechos y referencia. Los ciclos de preview no cuentan repeticiones del usuario.

## SceneDefinition

| Campo o grupo obligatorio | Contrato |
|---|---|
| sceneId/version/schemaVersion, mode | tutorial o physics-lab; no intercambiables durante sesión |
| units, axes, origin | Metros, Y arriba, frente del avatar +Z, derecha anatómica del avatar −X en pose inicial; mundo centrado en suelo |
| practiceArea, clearance | Cuadrado x/z entre −1 y +1; altura y márgenes explícitos por ficha, sin margen universal inventado |
| avatar | Referencia/version/hash, escala coherente, rigMapping y posición inicial |
| objects | IDs únicos, modelo o primitiva, tamaño real, posición, autoridad y uso/apoyo |
| cameras | front/side/threeQuarter y detail cuando lo declare la ficha (pies/balón); encuadre pertinente, sin cambiar lado o tiempo |
| exerciseCompatibility | Variantes/props y límites espaciales que puede mostrar |
| physicsConfig | Solo laboratorio: motor/WASM fijados, paso, parámetros, colliders, estado inicial e inputs |
| review | Evidencia de encuadre, colocación, espacio, contraste y limitaciones |

Autoridades: static para suelo/props inmóviles; authored para cuerpo/balón guiado; rapier para cuerpo físico. En laboratorio el pie tiene collider cinemático: trayectoria entra por la API cinemática y Rapier publica la pose; no escribir además el mismo nodo desde AnimationMixer. Balón dinámico, suelo fijo. El controlador del ejemplo no es un solver nuevo.

Comprobar volumen barrido del cuerpo, props y balón en todo el clip, entrada/salida y transiciones. Un máximo digital dentro de 2×2 no prueba cabida personal real: conservar medidas/condiciones verificadas y pendientes. No encoger avatar o silla para simular que caben. La extensión de seguridad y los apoyos requieren revisión del ejercicio concreto.

## Revisión y elegibilidad

Conservar reviewStatus draft / technical-reviewed / coaching-reviewed por compatibilidad conceptual, pero acompañarlo de reviewEvidence: alcance, recurso/versión/hash, fecha, responsable, rol declarado, método, resultado y pendientes. Un único enum no demuestra todos los controles.

Distinguir: investigación documental del agente; verificación técnica; revisión humana de comprensión/representación; revisión de contenido y dosis con competencia pertinente. El usuario está asignado a revisar fichas y demostraciones; no se infiere titulación ni se registra esa revisión como realizada. La aceptación de fase 00/01 no eleva estados de ejercicios. No contratar un revisor por esta especificación.

La vista de desarrollo admite draft identificado; el modo de entrenamiento exige recursos completos, derechos compatibles, contenido/dosis y movimiento revisados con evidencia suficiente para el alcance declarado. No atribuir aprobación profesional donde no exista. Si falta una revisión exigida, informar qué aspecto queda pendiente y mantener bloqueada esa entrega como entrenamiento aprobado; se puede continuar trabajo técnico independiente.

Validación en capas: formato → referencias/versiones → suma temporal/dosis/lados → compatibilidad de rig/props/autoridad → archivos/licencias → geometría y revisión humana. Un esquema no certifica técnica ni adecuación individual. Ninguna capa inventa resultados de la siguiente.

## Plan compilado, sesión y proyección

CompiledWorkout fija snapshot de definiciones, hashes y segmentos; occurrenceId derivado de bloque/ronda/entrada/lado, segmentId estable. SessionProjection expone estado, fase, cursor, lado, cues, siguiente, restantes base/extras y capacidad de comandos. El visor solo consume; los eventos no son instrucciones de un renderer.

WorkoutSession: sessionId, planHash, fechas, controlRevision, cursor/colas, contadores base/extra/omisión/pausa/huecos y resultado. Registrar tiempo de reproducción, no “minutos de actividad física medidos”. El [contrato del motor](SESSION_ENGINE_CONTRACT.md) es normativo para transiciones.

Preparación adicional temporizada: preparationExtension fija targetOccurrenceId/versión/lado y milisegundos añadidos, consumidos, cancelados y restantes; returnCursor solo para el comando que alcanza a un trabajo ya iniciado. Forma parte del checkpoint. La proyección expone el tiempo hasta inicio/reanudación, sumando segmentos previos y extensión, sin estado de estar listo. El motor recibe ExtendPreparation con 30000 o 60000 ms; registra PreparationExtended y comienzo/fin/cancelación de la extensión, sin eventos de práctica por vueltas visuales. PreviewState del visor conserva recurso, lado, cursor visual, play/pause y velocidad. Tras recarga, recuperar pausado con restante intacto y ejemplo detenido. Preparación extra se contabiliza aparte de trabajo y pausas manuales, sin doble suma.

## Persistencia y archivo portable

TrainingEvent es append-only dentro de una sesión: eventId, sessionId, seq creciente, schemaVersion, tipo, referencia de ocurrencia, reloj lógico, fecha informativa y payload validado. Tipos mínimos: SessionStarted, SegmentStarted/Finished, ProgressCheckpoint, SessionPaused/Resumed, RepeatQueued/Cancelled, WorkSkipped, ClockGapDetected, SessionCompleted/Aborted/Interrupted y FeedbackSubmitted. No guardar frames, telemetría remota ni muestras médicas.

La app agrupa eventos y snapshot en una transacción. Guardar en cada comando/frontera y como máximo cada segundo de reproducción visible; nunca una transacción por frame. Reintentos conservan IDs. Solo indicar guardado después de completar la transacción, no al insertar una fila. Si falla, pausar e informar, permitir exportar lo recuperable o terminar; no continuar acreditando historial durable inexistente.

[IndexedDB documenta rollback y límites al cerrar el navegador](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB), consultado 2026-09-27. El último segundo más una escritura pendiente pueden perderse; no se garantiza límite absoluto ante fallos de disco, cierre o suspensión. No depender de unload. Restore usa último checkpoint confirmado y queda pausado, con hueco explícito; nunca supone trabajo durante el cierre. Eventos y checkpoints consistentes permiten reconstruir contadores.

Una sola pestaña puede escribir una sesión: operación transaccional compara revision almacenada y propietario de escritura. Otra vista ofrece lectura; tomar control explícito invalida propietario anterior. No permitir dos relojes acreditando simultáneamente. Prueba de concurrencia en 08.

Exportación: archivo JSON local con formatVersion, fecha, sesiones/eventos, feedback y referencias de contenido necesarias para interpretar el historial; sin GLB, credenciales, blobs arbitrarios ni rutas del sistema. No garantiza poder reproducir una sesión sin sus assets. Feedback opcional: esfuerzo percibido, molestias declaradas y notas; omitirlo no bloquea guardar/terminar. No diagnóstico a partir de escalas.

Importación 08: tamaño máximo inicial 10 MiB, hasta 100.000 eventos; límites de ingeniería por probar. Validar tamaño antes de parseo, versión soportada, tipos, secuencias, unicidad, contadores y consistencia. Sin eval, HTML activo ni descarga de URLs. Mostrar resumen antes de modificar registros. Mismo eventId y contenido es duplicado inocuo; mismo ID distinto contenido es conflicto y rechaza el archivo sin escritura parcial. Versiones futuras se rechazan sin destruir el original. Migraciones solo explícitas/probadas.

Borrado local por elección del usuario elimina sesiones/feedback seleccionados; append-only no impide el derecho a borrar un registro completo. Datos reales en almacenamiento privado del navegador o archivo elegido fuera de Git durante el uso futuro, nunca en fixtures. El permiso actual no autoriza generar/exportar datos personales ni escribir fuera del proyecto.
