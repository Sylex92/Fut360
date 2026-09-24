# Auditoría de especificación — fase 00

Fecha: 2026-09-24. Dictamen: **base documental coherente para continuar a revisión de arquitectura, con decisiones pendientes; no lista para entregar entrenamiento ni implementar automáticamente**.

Verificado = observado en archivos o comprobado con herramientas. Supuesto = propuesta de trabajo sin validar. Pendiente = falta evidencia o decisión. Ninguno de estos estados equivale a aceptación del usuario.

## Alcance confirmado

La sesión fija dura 60 minutos programados, en 2×2 m, con avatar genérico y tres cámaras. Se priorizan apoyos, lateralidad, continuidad y claridad. El núcleo es local, sin cuentas ni backend. El laboratorio de contactos es una prueba separada: clips guiados controlan avatar/balón en tutorial; Rapier controla el balón dinámico del laboratorio. Una sola autoridad de transformación por objeto.

ADR 0008 prevalece sobre 0005/0007. Se permiten licencias gratuitas no abiertas. Exportación MP4/Remotion, IA, wearables, social y simulación de partido están fuera del MVP1.

## Verificación del fixture

Archivo: content/examples/mvp1-60min.workout.json, versión 1, reviewStatus draft.
SHA-256: 0967293497539f57f71d201e019d7203b9707ab4152b7a6be0ecb9b4021fc40e.

Fórmula aplicada: suma por bloque de rounds × suma de (workSeconds + restSeconds).

| Bloque | Rondas | Intervalos expandidos | Trabajo (s) | Descanso (s) | Total (s) |
|---|---:|---:|---:|---:|---:|
| activation | 1 | 5 | 225 | 75 | 300 |
| ball-mastery | 2 | 12 | 480 | 240 | 720 |
| firmino-bellingham | 2 | 12 | 480 | 240 | 720 |
| full-body-strength | 2 | 16 | 640 | 320 | 960 |
| technical-conditioning | 2 | 8 | 320 | 160 | 480 |
| cooldown | 1 | 7 | 330 | 90 | 420 |
| **Total** | | **60** | **2475** | **1125** | **3600** |

Son 36 filas originales y 31 exerciseId distintos; no equivalen a 31 clips aprobados. En esta tabla, cada intervalo expandido es una entrada de ejercicio con su trabajo y descanso: son 60 trabajos y 59 descansos positivos, es decir, 119 segmentos temporales si el motor separa ambos estados. Los lados y variantes pueden requerir más recursos. Test-Json validó el fixture contra workout.schema.json; ambos esquemas se parsean. El validador Python suministrado verifica tiempo/integridad, **no ejecuta JSON Schema**: se utilizó Test-Json aparte.

La duración incluye todos los descansos, incluido el final. No incluye pausas del usuario, repeticiones extra ni explicaciones externas. No añadir transiciones silenciosamente. No se modificó el fixture ni se promovió su estado deportivo.

## Hallazgos y condiciones de cierre

| ID / prioridad | Verificado en la especificación | Decisión o evidencia necesaria |
|---|---|---|
| S01 / bloquea entrenamiento | No existe content/exercises ni assets; las 31 referencias no se pueden resolver | Catálogo completo, licencia y clip/variante real; revisión técnica y humana documentada antes de entregar. |
| S02 / antes del motor | PRD y dominio mencionan transiciones; workout.schema solo admite trabajo/descanso y rechaza campos adicionales | En fase 01 decidir si preparación/cambio de material se incluye en restSeconds. Si se añade tiempo, redistribuir y volver a sumar 3600. |
| S03 / antes del catálogo | Fuerza usa ventanas de 40 s; el esquema no expresa repeticiones objetivo, cadencia o descanso restante | Definir dosis revisada y final de serie dentro de la ventana. No imponer 40 s de repeticiones continuas ni al fallo. |
| S04 / antes del catálogo | Impacto, sidePolicy, commonErrors, regressionId y safetyCues son opcionales en exercise.schema | Alinear los obligatorios con AGENTS; exigir una regresión o justificación explícita y reglas de lado. No aprobar por mero pase de esquema. |
| S05 / antes del catálogo | No hay esquema de AnimationAsset/SceneDefinition; faltan en el esquema actual FPS, duración, bounds, contactos, autoridad, versión de mapping y evidencia de revisión | Referenciarlos desde manifiestos auditables, sin duplicar datos. Definir validación cruzada ID/versión/archivo/clip/lado/estado. |
| S06 / antes del catálogo | workout.space admite números no positivos; no valida unicidad de IDs de bloques, suma total ni existencia de exerciseId | Validación semántica adicional con herramientas existentes y reglas del dominio; no esperar que JSON Schema por sí solo compruebe todo. |
| S07 / antes de la prueba 3D | PRD pide animación en bucle; contrato 3D solo permite bucle si el clip es cíclico | Prevalece el contrato: acciones finitas tienen final/retorno explícito; nunca reinicio brusco presentado como técnica. |
| S08 / antes del motor | Falta precisar qué hacen skip/repeat en descanso, doble clic, recarga, pestaña oculta y cambio de velocidad | Propuesta: tiempo monotónico con reloj inyectable, eventos idempotentes, recuperación pausada y sin sumar tiempo de cierre. Fase 01 decide. |
| S09 / antes del motor | Reproducción lenta se pide en contrato físico, pero no se define efecto en los 60 min | Propuesta: inspección lenta en pausa; cambiar cámara nunca cambia tiempo. No alterar silenciosamente la dosis. |
| S10 / bloquea entrenamiento | Dimensión 2×2 declarada sin trayectorias, medidas de props ni envolvente corporal | Prueba por ejercicio/variante incluyendo cuerpo, balón, silla, tapete, entradas/salidas y margen. Véase protocolo inferior. |
| S11 / antes de persistencia | AGENTS pide exportación/importación; prompt 08 solo enumera exportación. PRD recoge rodilla antes/después pero flujo previo no está definido | Acordar importación validada con versiones, deduplicación y borrado; feedback inicial y final opcional, privado y sin diagnóstico. |
| S12 / antes de salida | Android «gama media razonable» carece de modelo, presupuesto y medición | Elegir dispositivo real, navegador y condiciones. Propuesta inicial: al menos 30 FPS sostenidos, medir p95 del frame y degradación durante la hora; objetivo todavía no aceptado. |
| S13 / fase 01 | ARCHITECTURE termina remitiendo a ADR 0005/0006; «integrations: contratos futuros» puede inducir módulos vacíos | Corregir referencia activa a 0006/0008 y crear contratos solo al necesitarlos. No ejecutar Authoring Studio, API o Render Worker en MVP1. |
| S14 / fase 01 | Prompt 02 pide CI y PWA de diagnóstico; el offline completo está en 08 | Definir en 02 scripts locales reproducibles y base de app; sin activar CI remoto, publicación ni prometer offline completo antes de 08. |
| S15 / antes de publicación | Existe LICENSE MIT en la raíz Git, anterior a esta auditoría; AGENTS prohíbe elegir licencia pública sin autorización | Aclarar alcance/intención de esa licencia antes de distribuir. No se cambió ni se eligió una nueva. |

## Comprobación del espacio y claridad

**Protocolo propuesto, aún no ejecutado:**

1. Fijar escala en metros y cuadrado centrado: x/z entre -1 y +1. Definir orientación frontal, altura de avatar y medidas reales de silla/tapete; altura de techo y alcance de brazos también pueden limitar la ejecución.
2. Revisar la envolvente de las mallas animadas, balón y props durante todo el gesto, no solo root ni pose inicial. Documentar muestreo/tolerancia y revisar máximos visualmente; un AABB estático no basta.
3. Comprobar transiciones de pie a suelo y cambios de apoyo/material. Un objeto que sale del cuadro no se considera resuelto moviéndolo fuera de cámara.
4. Mostrar contactos/apoyos sin oclusión en frente, lateral y 3/4; texto para izquierda/derecha además de color. Pausa y cámara mantienen exactamente el tiempo de clip.
5. Repetir a velocidad normal y registrar revisión humana. Que el modelo quepa no prueba que una persona de cualquier talla pueda realizar el gesto en ese espacio.

Atención especial pendiente: incline-push-up-chair, single-leg-rdl-supported, prone-ytw, dead-bug y apertura de pecho pueden exceder la superficie útil. supported-split-squat debe mantener ambos pies en suelo, sin transformarse en búlgara. Estabilidad de silla y alternativa sin apoyo deben definirse antes de usarla. Los movimientos con «salida», «aceleración», «llegada» y «presión» necesitan una variante estacionaria revisada; no se infiere que correr o disparar quepa en 2×2.

## Seguridad y revisión de contenido

**Verificado:** se incluyen activación y vuelta a la calma; el contenido conserva draft. Las reglas del repositorio exigen detener ante dolor, bloqueo, inflamación o inestabilidad y buscar valoración; aún no hay interfaz que lo haga. Esta auditoría comprueba requisitos y no prescribe una rutina.

**Pendiente:** revisión de dosis, regresiones, estabilidad de apoyos, cues de respiración sin contener el aire, errores comunes y coherencia del balón con la técnica. Bandas cortas figuran en equipo, pero no se puede comprobar su necesidad sin catálogo. No convertir variantes rápidas en simples cambios de velocidad sin revisión.

**Supuesto para el primer hito:** hip-hinge como gesto inicial, sin silla ni balón. Es una prioridad de implementación, no una aprobación deportiva. El interior-interior vendrá como primera demostración de contacto guiado. Crear solo los gestos que falten después de inventariar los clips gratuitos.

## Decisiones que quedan para fase 01

Cerrar S02–S09 y S11–S14; definir Definition of Ready del primer ejercicio con estado draft visible, recurso concreto, mapping, espacio y prueba. No reescribir todavía PRD, esquemas ni arquitectura como si esas propuestas ya estuvieran aceptadas. Los fallbacks permiten depurar, pero bloquean la declaración de MVP1 de entrenamiento completo.
