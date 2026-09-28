# Auditoría de especificación — fase 00

Seguimiento documental del 2026-09-27: [revisión de arquitectura de fase 01](architecture-review.md) registra resolución de diseño de S02–S14 y lo que requiere todavía implementación, archivos o revisión de contenido. Esta auditoría conserva la evidencia inicial; “resuelto en diseño” no equivale a prueba aprobada. Fixture y esquemas originales sin cambios.

Fecha: 2026-09-24. Dictamen: **base documental coherente para continuar a revisión de arquitectura, con decisiones pendientes; no lista para entregar entrenamiento ni implementar automáticamente**.

Verificado = observado en archivos o comprobado con herramientas. Supuesto = propuesta de trabajo sin validar. Pendiente = falta evidencia o decisión. Ninguno de estos estados equivale a aceptación del usuario.

## Alcance confirmado

La sesión fija dura 60 minutos programados, en 2×2 m, con avatar genérico y tres cámaras. Se priorizan apoyos, lateralidad, continuidad y claridad. El núcleo es local, sin cuentas ni backend. El laboratorio de contactos es una prueba separada: clips guiados controlan avatar/balón en tutorial; Rapier controla el balón dinámico del laboratorio. Una sola autoridad de transformación por objeto.

ADR 0008 prevalece sobre 0005/0007. Se permiten licencias gratuitas no abiertas. Exportación MP4, IA integrada en el entrenamiento, wearables, social y simulación de partido están fuera del MVP1. Precisiones posteriores: Remotion Player conserva una comparación arquitectónica separada; IA de autoría puede evaluarse como ayuda para preparar recursos, sin instalar, generar ni adoptar herramientas ahora. Véanse el [plan](../plans/mvp1-execution-plan.md) y la [comparación IA](ai-production-tools-review.md).

### Pantallas aclaradas durante la revisión guiada

**Confirmado por el usuario:** el MVP1 se utilizará en un Samsung Galaxy S24 FE con Android 16 y Google Chrome, y en esta misma computadora Windows cuyo entorno se inspeccionó. Samsung Internet está instalado en el teléfono, pero no es de uso habitual ni el navegador principal de prueba. La TV es una ampliación para una fase futura, expresamente fuera del MVP1. La identificación básica de equipos está resuelta; versión exacta de Chrome móvil y rendimiento se registrarán al preparar las pruebas. La disponibilidad de suelo libre y de las cuatro categorías de material también quedó aclarada en la sección de espacio.

**Propuesta actual:** mantener la aplicación web adaptable a teléfono/computadora. Conservar la TV en el roadmap sin añadir ahora integraciones, controles específicos o pruebas de aceptación para ella. Modelo, conexión y compatibilidad del televisor se revisarán cuando se autorice esa ampliación.

La aceptación del MVP1 deberá incluir avatar, cronómetro y cues legibles en teléfono/computadora, controles accesibles, pausa y audio coordinados. El uso en esos dispositivos no implica sincronizar registros entre ellos ni exportar video. La TV no bloquea el cierre del MVP1.

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
| S02 / antes del motor | PRD y dominio mencionan transiciones; workout.schema solo admite trabajo/descanso y rechaza campos adicionales. El usuario elige vista previa durante el descanso, avance automático y pausa para preparación adicional | En fase 01 formalizar ese comportamiento y revisar el tiempo disponible para cada cambio de material. Si se incorpora tiempo programado adicional, redistribuir y volver a sumar 3600. La preferencia de interfaz no demuestra que todos los cambios quepan en los descansos existentes. |
| S03 / antes del catálogo | Fuerza usa ventanas de 40 s; el esquema no expresa repeticiones objetivo, cadencia o descanso restante | Definir dosis revisada y final de serie dentro de la ventana. No imponer 40 s de repeticiones continuas ni al fallo. |
| S04 / antes del catálogo | Impacto, sidePolicy, commonErrors, regressionId y safetyCues son opcionales en exercise.schema | Alinear los obligatorios con AGENTS; exigir una regresión o justificación explícita y reglas de lado. No aprobar por mero pase de esquema. |
| S05 / antes del catálogo | No hay esquema de AnimationAsset/SceneDefinition; faltan en el esquema actual FPS, duración, bounds, contactos, autoridad, versión de mapping y evidencia de revisión | Referenciarlos desde manifiestos auditables, sin duplicar datos. Definir validación cruzada ID/versión/archivo/clip/lado/estado. |
| S06 / antes del catálogo | workout.space admite números no positivos; no valida unicidad de IDs de bloques, suma total ni existencia de exerciseId | Validación semántica adicional con herramientas existentes y reglas del dominio; no esperar que JSON Schema por sí solo compruebe todo. |
| S07 / antes de la prueba 3D | PRD pide animación en bucle; contrato 3D solo permite bucle si el clip es cíclico | Prevalece el contrato: acciones finitas tienen final/retorno explícito; nunca reinicio brusco presentado como técnica. |
| S08 / antes del motor | Falta precisar qué hacen skip/repeat en descanso, doble clic, recarga, pestaña oculta y cambio de velocidad | Propuesta: tiempo monotónico con reloj inyectable, eventos idempotentes, recuperación pausada y sin sumar tiempo de cierre. Fase 01 decide. |
| S09 / antes del motor | Reproducción lenta se pide en contrato físico, pero no se define efecto en los 60 min | Propuesta: inspección lenta en pausa; cambiar cámara nunca cambia tiempo. No alterar silenciosamente la dosis. |
| S10 / bloquea entrenamiento | El usuario confirma una zona libre de al menos 2×2 en una habitación mayor; aún faltan trayectorias, medidas de props y envolvente corporal | La disponibilidad del área está aclarada. Sigue pendiente probar cada ejercicio/variante incluyendo cuerpo, balón, silla, tapete, entradas/salidas y margen. Véase protocolo inferior. |
| S11 / antes de persistencia | AGENTS pide exportación/importación; prompt 08 solo enumera exportación. PRD recoge rodilla antes/después pero flujo previo no está definido | Acordar importación validada con versiones, deduplicación y borrado; feedback inicial y final opcional, privado y sin diagnóstico. |
| S12 / antes de salida | El usuario identificó Samsung Galaxy S24 FE, Android 16 y Chrome como referencia móvil; faltan versión del navegador, condiciones y medición | Registrar software real y condiciones de prueba. Propuesta inicial: al menos 30 FPS sostenidos, medir p95 del frame y degradación durante la hora; objetivo todavía no aceptado. No extrapolar el resultado a otros Android. |
| S13 / fase 01 | ARCHITECTURE termina remitiendo a ADR 0005/0006; «integrations: contratos futuros» puede inducir módulos vacíos | Corregir referencia activa a 0006/0008 y crear contratos solo al necesitarlos. No ejecutar Authoring Studio, API o Render Worker en MVP1. |
| S14 / fase 01 | Prompt 02 pide CI y PWA de diagnóstico; el offline completo está en 08 | Definir en 02 scripts locales reproducibles y base de app; sin activar CI remoto, publicación ni prometer offline completo antes de 08. |
| S15 / antes de publicación | Existe LICENSE MIT en la raíz Git, anterior a esta auditoría; AGENTS prohíbe elegir licencia pública sin autorización | Aclarar alcance/intención de esa licencia antes de distribuir. No se cambió ni se eligió una nueva. |

## Comprobación del espacio y claridad

**Confirmado por el usuario:** la habitación es más grande y tiene muebles, pero dispone de una zona de al menos 2×2 metros sin muebles ni obstáculos. Esta declaración resuelve la disponibilidad del área mínima para planificar; no es una medición ni revisión física realizada por el agente.

**Material confirmado por el usuario:** balón de fútbol, silla firme, banda elástica corta de varias resistencias y tapete/colchoneta de ejercicio. Las cuatro categorías previstas en el fixture están disponibles según su declaración. No se han inspeccionado dimensiones del material, estabilidad de la silla durante cada apoyo ni resistencias concretas; la disponibilidad no valida una variante ni su dosis.

El catálogo del MVP1 debe seguir cabiendo en 2×2, sin depender del espacio sobrante de la habitación. El material introducido durante un ejercicio ocupa parte de esa superficie; aún se debe revisar su colocación y la ejecución completa. El inventario básico queda aclarado, sin requerir ahora compras ni medidas adicionales para cerrar esta auditoría. El fixture sigue draft y no se modifica por esta aclaración.

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

## Seguimiento de la explicación al usuario

**Primer tema, expectativa confirmada por el usuario:** distinguir duración programada (incluidos los descansos previstos) y tiempo real transcurrido. Una pausa congela cronómetro y avatar; continuar retoma el punto detenido; las repeticiones adicionales no recortan los ejercicios restantes. Ejemplo: completar el programa de 60 minutos con una pausa adicional de 5 minutos ocuparía 65 minutos reales, sin otras interrupciones ni cambios.

El usuario solicita el mismo comportamiento para futuras sesiones de 30 minutos, 90 minutos o más. Se registra como expectativa general independiente de la duración. El MVP1 conserva la única sesión fija de 60 minutos; no se autoriza con esta aclaración un selector, un generador de rutinas ni nuevos contenidos de otras duraciones.

**Segundo tema, preferencia confirmada por el usuario:** preparación e inicio del siguiente ejercicio (S02). Mostrar durante el descanso el siguiente ejercicio, su posición inicial y el material necesario; iniciar automáticamente al terminar el descanso y permitir pausar si hace falta más tiempo para acomodarse o preparar material. El usuario elige esta opción para reducir las intervenciones manuales; no se requiere pulsar «Estoy listo» en cada ejercicio. No se modifica el fixture ni se da por suficiente el tiempo disponible para todos los cambios de material.

**Tercer tema, revisión de usabilidad solicitada:** ventanas de fuerza (S03). La regla del proyecto permite un objetivo de repeticiones y descansar el tiempo restante de la ventana. Ejemplo solo de temporización: en una ventana de 40 s, si el objetivo se completa a los 30 s, los 10 s restantes se descansan y después se conserva el descanso programado siguiente. Esto no fija un número de repeticiones ni un ritmo recomendado. Al usuario le agrada la propuesta, pero solicita valorar comprensión, expectativas y esfuerzo de uso antes de considerarla la mejor.

La [revisión de usabilidad](usability-review.md) contrasta alternativas y fuentes primarias. Propone objetivo principal, reloj secundario, instrucción explícita de descanso al completar el objetivo, serie demostrada finita y pausa accesible. Un eventual contador describe la demostración, no repeticiones observadas del usuario. La app no sabe si terminó antes o después; no debe inferir ejecución correcta ni obligar a seguir el ritmo del avatar. Las mejoras nuevas siguen propuestas; dosis, cadencia, coordinación y pruebas con personas permanecen pendientes. El informe documenta una evaluación, no una validación empírica ni una aprobación deportiva.

La confirmación de las preferencias no cierra S02/S03/S08/S09: contratos de preparación, dosis, reglas precisas de repetir/omitir, recuperación y reproducción lenta se concretarán en fase 01 autorizada. Ninguna de estas aclaraciones equivale a aceptación global de 00 ni permiso para ejecutar 01.

### Continuación del 2026-09-25: evidencia, contenido y aprendizaje

El usuario pide mantener el criterio de evidencia en todas las decisiones, sin recordatorios. Se incorpora como instrucción permanente en AGENTS.md. La revisión guiada continúa; ni la propuesta de usabilidad ni el contenido reciben validación empírica por su aceptación conversacional.

**Verificado en archivos:** las 31 referencias del fixture todavía carecen de fichas y recursos incorporados/revisados. Que la suma sea 3600 s comprueba la duración del programa, pero no la elección de ejercicios, su dosis o su adecuación individual. Los intervalos de 40 s no determinan por sí solos el número apropiado de repeticiones.

Para explicar S01/S03/S04/S10, separar cuatro preguntas:

| Pregunta | Evidencia que haría falta | Estado |
|---|---|---|
| ¿La persona entiende la aplicación y puede controlarla? | Tareas de uso observadas en los dispositivos y contexto reales | Evaluación documental preparada; pruebas pendientes. |
| ¿La demostración corresponde al movimiento que se quiere enseñar? | Ficha, clip concreto, apoyos, lados, errores y revisión humana competente | No hay clips incorporados; pendiente. |
| ¿Objetivo, dificultad, repeticiones, ritmo y descanso son adecuados? | Fundamentación del contenido y revisión deportiva pertinente; valoración clínica individual cuando corresponda | Rutina draft; no se prescribe dosis ni se infiere de preferencias. |
| ¿Lo aprendido se conserva y sirve fuera de la demostración? | Evaluación posterior de retención y transferencia con criterios definidos | No medido. La sesión completada no prueba aprendizaje ni automatización. |

**Evidencia consultada:** el resumen oficial [ACSM 2026](https://acsm.org/resistance-training-guidelines-update-2026/) recomienda individualizar según objetivos y condiciones; no valida esta rutina de fútbol ni una persona concreta. La revisión de [Soderstrom y Bjork, 2015, publicada por el laboratorio de los autores](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/11/soderstorm_ra_learningvsperformance.pdf) distingue ejecución durante la práctica de aprendizaje evaluado mediante retención o transferencia. No demuestra un método específico para este avatar ni un plazo de aprendizaje.

**Aplicación propuesta al proyecto:** fundamentar cada ficha y distinguir contenido revisado de hipótesis. No prometer que el aprendizaje sea rápido, automático o transferible al partido por repetir un clip. Evaluar contenido y resultados por separado; una interfaz fácil puede seguir siendo necesaria sin que su facilidad pruebe aprendizaje. No crear ahora un sistema de evaluación física, nutrición, diagnóstico ni personalización.

**Actualización de revisión al 2026-09-26:** el usuario se asigna la revisión humana de fichas y demostraciones; el agente mantiene investigación, fundamento y comprobaciones. Esa asignación no acredita formación especializada ni cambia el contenido a revisado. Registrar el alcance real de la revisión del usuario y los hallazgos que queden pendientes, conforme a los [criterios de aceptación](../quality/ACCEPTANCE_OSS_PHYSICS.md). No se contrata ni se impone una consulta externa por defecto. El contenido conserva draft; investigación y software posterior requieren sus respectivas autorizaciones.

Esta explicación no solicita información clínica ni que el usuario seleccione dosis. Los repasos posteriores de licencias, reutilización, costos y plan ya se presentaron. Los hallazgos se distribuyen por fase en el balance inferior; explicarlos no equivale a implementarlos ni comprobar recursos todavía inexistentes.

### Inicio de la revisión de contenido: activación

El usuario indica continuar tras aclarar que se puede revisar el contenido antes de construir. Se realiza la [primera revisión documental del calentamiento](training-content-review.md): cinco IDs examinados, 225 s de trabajo y 75 s de descanso, cinco minutos programados. Se conservan marcha, bisagra y mini sentadilla como candidatos; movilidad de tobillo y giro requieren definición más precisa. La distribución 45/15 no se considera aprobada por su uniformidad o por sumar 300 s.

Hay fuentes y propuestas para revisar fichas desde ahora; no se pospone esa investigación hasta disponer de software. Revisión deportiva independiente, dosis final y demostraciones siguen pendientes por falta de evidencia específica. No cambian el fixture ni sus estados. Cobertura de aquella primera entrega: cinco IDs; la ampliación siguiente actualiza la cobertura documental, no la validación deportiva.

### Ampliación: decisiones deportivas delegadas al agente

El usuario pide que el agente elija y fundamente, sin pedirle resolver preguntas especializadas. La consulta anterior de actividad reciente se retira como requisito de investigación; no se supone un nivel físico ni se declara adecuación individual. La [dirección deportiva recomendada](training-design-recommendation.md) incorpora fuentes FIFA, Liverpool, Manchester City, Barça Innovation Hub, ACSM y revisiones de aprendizaje/desarrollo, con acceso y limitaciones explícitos.

**Nuevo dictamen:** 31/31 IDs examinados en cuanto a pertinencia; doce patrones propuestos para una base doméstica, con el empuje sobre silla condicionado a comprobaciones reales. Fusionar duplicados, posponer progresiones y retirar etiquetas de falso nueve, llegada y presión cuando solo se representa una coreografía. Reparto candidato: 8/12/10/16/8/6 = 60 minutos, incluyendo descansos y enseñanza; no es una dosis individual ni 60 minutos de esfuerzo continuo. La propuesta distingue también la ausencia de tracción progresiva y de preparación física completa para competir.

Estos hallazgos amplían S01/S03/S04/S10: antes de producir los clips debe conciliarse el catálogo de 31 referencias con la selección recomendada, definir variantes/dosis y registrar revisión pertinente. No se puede declarar completado el catálogo original por haber aconsejado reducirlo. El fixture, esquemas y catálogo normativo conservan su versión; 0/31 fichas runtime y clips incorporados. Las demostraciones siguen separadas de la simulación física y no miden la ejecución real del usuario.

## Balance documental para cierre de 00 — 2026-09-26

La auditoría identifica quince hallazgos y el momento de resolverlos. No exige resolverlos todos antes de concluir una fase que prohíbe implementar, instalar o descargar. Dictamen del agente: entregable documental preparado para aceptación; no aprobación del entrenamiento ni autorización de 01.

| Hallazgos | Trabajo siguiente y ejemplo comprensible | Momento de comprobación |
|---|---|---|
| S02, S08, S09 | Formalizar preparación, repetir/omitir, pausa, recarga/pestaña oculta y cámara lenta. Ejemplo: distinguir observar un gesto lentamente de cambiar la duración del ejercicio | Reglas en 01; reloj y casos extremos en 03; integración 3D después |
| S03, S04 | Definir qué información necesita cada ejercicio: repeticiones cuando procedan, ritmo, lados, alternativa, errores y material; conciliar la propuesta de doce patrones con los 31 IDs actuales | Contratos y selección documental en 01; fichas/contenido y revisión en producción |
| S05, S06, S07 | Contrato de archivo/clip y validaciones entre piezas. Ejemplo: detectar que una ficha pide un lado o animación inexistentes, y evitar bucles que aparenten un movimiento imposible | Diseño en 01; verificaciones implementadas y ejecutadas en 02–07 según componente |
| S01, S10 | Producir y revisar recursos reales; comprobar cuerpo, balón, silla y colchoneta dentro del área. Tener la habitación despejada no verifica todas sus combinaciones | Primer recurso en 04; variantes y sesión en 06–07; aceptación en 09 |
| S11 | Precisar registros, recuperación, importación, duplicados y borrado; no confundir reloj completado con ejercicio observado | Contrato en 01; persistencia y pruebas en 08 |
| S12 | Fijar objetivos medibles y luego probar el S24 FE/PC durante uso real; inventario de hardware no es prueba de fluidez | Criterios en 01; mediciones en 04, 08 y 09 |
| S13, S14 | Actualizar referencias arquitectónicas y separar scripts locales, base inicial y offline completo; evitar servicios anticipados | Documentos en 01; base en 02 y offline en 08 |
| S15 | Aclarar la licencia preexistente del código propio antes de publicar/distribuir | Antes de una publicación autorizada; no bloquea esta auditoría local |

Las dudas de adecuación individual, revisión especializada no acreditada y costos desconocidos siguen explícitas; no se cierran por el visto bueno del usuario ni por consolidar esta tabla. El usuario revisará los resultados con el agente según el alcance registrado. Los pasos siguientes necesitan su autorización de fase; el detalle técnico será decidido y explicado por el agente.
