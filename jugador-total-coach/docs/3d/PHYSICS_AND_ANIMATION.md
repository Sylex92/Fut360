# Física y animación: separar enseñanza de simulación

## Elección

Three.js reproduce clips; Rapier resuelve física. Ambos se integran mediante React Three Fiber y react-three-rapier. La física no conoce la intención de un arrastre en V ni genera una técnica válida de sentadilla.

## 1. Reproductor de enseñanza (MVP obligatorio)

Avatar y balón siguen un clip sincronizado, reutilizado/adaptado o producido con las herramientas de Blender. Se muestran poses claras, cámara lateral/frontal y reproducción lenta. En cada repetición el punto de contacto y las indicaciones aparecen en el mismo instante.

La trayectoria puede prepararse usando física y guardarse como animación, o animarse directamente. No fingir que una trayectoria de enseñanza predefinida es un resultado de física libre. Los colliders/consultas pueden ayudar a revisar interpenetraciones, pero no certifican técnica humana.

Autoridad del movimiento: `authored`. No activar un cuerpo dinámico que escriba a la vez sobre el mismo nodo animado. Debe ser posible pausar, repetir y saltar a una pose sin re-simular una física no guardada.

### Aclaración de fase 00: representar bien el gesto y explicar su resultado

Fecha: 2026-09-25. El usuario precisa que no exige física perfecta: exige una ejecución bien explicada, con recursos complementarios si el resultado es difícil de representar. Esta aclaración orienta autoría y aceptación; no implementa funciones ni amplía la sesión de 2×2 a tiros o pases de campo.

Separar tres trabajos:

| Trabajo | Resultado exigido o límite |
|---|---|
| Demostración del gesto | Secuencia corporal y contactos comprensibles, coherentes con la ficha y revisados. Una falta de exactitud que enseñe otra técnica es un defecto que debe corregirse. |
| Explicación del resultado | Mostrar qué se busca conseguir con una trayectoria de ejemplo, detalle, secuencia o video pertinente. La ilustración no promete que cada persona obtenga exactamente ese recorrido. |
| Predicción física | Estimar un resultado a partir de parámetros y condiciones medidos. No es necesaria para cada demostración ni está acreditada por animar una curva convincente. |

**Verificado documentalmente:** Blender permite autoría mediante poses/propiedades y fotogramas clave; Three.js representa secuencias en clips. Eso permite preparar movimientos sin que un simulador tenga que generarlos por sí solo. [Introducción de animación de Blender, contenido oficial indexado](https://docs.blender.org/manual/en/5.0/animation/introduction.html), [AnimationClip de Three.js](https://threejs.org/docs/pages/AnimationClip.html). Ninguna referencia selecciona versión ni acredita un clip de este proyecto.

**Evaluación del agente:** no se ha identificado un gesto del MVP1 imposible de representar por principio. No tenerlo en una biblioteca o no conseguirlo con el primer rig es distinto de demostrar imposibilidad. Calidad final, esfuerzo y medios adecuados siguen pendientes de probar. La ruta normal ante un defecto es corregir o preparar el movimiento concreto con herramientas existentes, conservando el objetivo deportivo.

**Ejemplo conceptual aportado por el usuario: pase o tiro con efecto.** Una demostración podría combinar el gesto revisado, un detalle del contacto, indicación visual del giro y una trayectoria ilustrativa; un video pertinente podría mostrar un resultado real. La NASA explica que el vuelo depende de velocidad, giro, fuerzas aerodinámicas y características del balón/aire; predecirlo con precisión requiere más información y calibración que mostrar el principio. [Fuerzas sobre un balón de fútbol](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/forces-on-a-soccer-ball/). No se fija aquí una técnica, dosis ni trayectoria cuantitativa, ni se presenta un clip como predicción personal.

La coherencia entre contacto, giro y resultado ilustrado también se revisa. Una vista del resultado debe distinguirse de la escena de práctica cuando cambien espacio o escala; no aparentar que un tiro de campo ocurre dentro del cuadrado doméstico. El ejemplo se conserva para explicar el criterio y para contenido futuro, sin añadir su ejecución a la hora de entrenamiento en casa.

Video complementario significa mostrar contenido existente o preparado con derechos comprobados; es distinto de exportar sesiones a MP4. La exportación continúa fuera del MVP1 y no exige instalar Remotion ahora. Antes de incorporar video se revisarán autoría/licencia, concordancia con la variante, legibilidad, control de reproducción, tamaño y funcionamiento local. Un enlace público no acredita permiso para empaquetarlo; ningún archivo o proveedor queda elegido.

Los recursos explicativos deben mejorar una demostración correcta, no ocultar un gesto incorrecto. Los [criterios de aceptación](../quality/ACCEPTANCE_OSS_PHYSICS.md) distinguen reparar/sustituir el recurso de cambiar el ejercicio por una razón de contenido o contexto. Las cámaras, inspección lenta y demás apoyos se coordinarán con el contrato temporal; no añadir tiempo ni cambiar dosis silenciosamente.

## 2. Prueba de contactos (spike acotado, no videojuego)

Un pie con collider cinemático sigue una trayectoria; un balón dinámico interactúa con él y con un suelo fijo. Rapier calcula contactos, fricción y restitución. Mostrar colliders en modo debug. Configurar `setNextKinematicTranslation/Rotation` o equivalentes de la versión elegida, no teletransportar un dinámico en cada frame.

Usar formas simples existentes: esfera para balón, cápsula/caja o convexa sencilla para pie, caja para suelo. No exigir colisión exacta por triángulo de la piel. Los cuerpos cinemáticos no son detenidos automáticamente por fuerzas: validar su recorrido contra la geometría cuando corresponda.

Mantener paso fijo (punto inicial propuesto: 1/60 s), actualización de la pose/colliders antes del paso físico e interpolación del render. Configurar CCD para las pruebas rápidas que lo requieran, no asumir que resuelve toda interpenetración. Documentar límites.

No escribir un controlador que aprenda a driblar ni un ragdoll completo. No intentar corregir el balón con teletransportes invisibles cuando falle: reiniciar el ejemplo de forma explícita o corregirlo en autoría.

## 3. Futuro modo libre

Balón dinámico y acciones del jugador, con cambio explícito de autoridad si se pasa de una secuencia guiada a física. No está dentro de la sesión de una hora. La simulación táctica tampoco debe depender de una física libre si su propósito es enseñar decisiones.

## Contratos de diseño

- `mode`: tutorial o physics-lab.
- `transformAuthority`: authored o rapier por objeto móvil; static para escenario/props inmóviles según SceneDefinition.
- `sourceClipId`, `assetVersion`, `rigMappingVersion`.
- `ballProfile`: identificador y parámetros visuales/físicos documentados.
- `contactWindows`: pie, región, comienzo/fin y tolerancia de revisión.
- `simulationConfig`: versión de motor, paso, estado inicial, parámetros y secuencia de entradas.
- `reviewStatus`: draft / technical-reviewed / coaching-reviewed; con evidencia, nunca autodeclarado.

Los parámetros de fricción, rebote y damping iniciales son ilustrativos, no mediciones de un balón de futsal. No prometer calibración real, velocidad de tiro o potencia humana a partir de esta escena. Fútbol 5 sobre cemento no implica necesariamente reglas o balón reglamentario de futsal: el perfil se configura, no se deduce solo del nombre.

## Tiempo, bucles y verificaciones

En el tutorial, pausa congela motor de sesión, animación y audio. Repetir añade una ocurrencia completa tras el descanso actual; no reinicia ni recorta el programa en curso. Inspección lenta solo estando pausado, con regreso al punto guardado. Reglas normativas: [contrato del motor](../architecture/SESSION_ENGINE_CONTRACT.md).

Pausa anterior significa Pausar todo. Durante descanso/preparación, el ejemplo aparece automáticamente y sigue al añadir +30 s/+1 min. Al agotarse lo programado y añadido, el visor cambia automáticamente de preview al inicio del trabajo, sin mezclar cursores ni pedir confirmación. Cuerpo y balón del ejemplo comparten tiempo visual, sin acreditar práctica. Un clip finito puede repetir su presentación con salida/retorno o separación revisados; no fingir continuidad física ni convertir la serie real de fuerza en bucle infinito.

En el laboratorio independiente, pausa congela su reloj y física; reiniciar el ejemplo restaura estado y tiempo de simulación. No comparte el botón Repetir del entrenamiento ni se carga como parte de la sesión. La curva predefinida puede evaluarse a un tiempo exacto; una simulación dinámica requiere restaurar estado y reproducir pasos o usar la trayectoria ya guardada.

Paso fijo ayuda a reproducir; no basta para prometer identidad binaria en todos los dispositivos. Registrar versión, WASM, configuración y entradas, y medir tolerancias en los entornos soportados.

No exigir físicamente un bucle perfecto a un rebote que pierde energía. Solo clips cíclicos son loopables; acciones finitas tienen final y retorno explícito que no debe confundirse con técnica.

## Fuentes

S01: función y tipos de cuerpos rígidos; S02: colliders y materiales; S04: wrapper y paso fijo; S07: reproducción/pausa/tiempo exacto de clips. Ver SOURCES.md.


## Implementación contrastada en fase 05

2026-09-30: Rapier 0.19.2 y wrapper 2.2.0 con paso fijo 1/60 s, interpolación y CCD. Se comprobó forma de pie aislada y collider derivado de huesos foot/ball; el balón dinámico no recibe escrituras del mixer. El tutorial tiene un GLB único para avatar y otro nodo TutorialBall. Cambio de modo desmonta la escena; no hay transferencia oculta de autoridad.

Se reutiliza el acumulador del wrapper. El final exacto duerme el balón antes de posibles pasos acumulados adicionales, sin teletransporte. Comparación de cadencias y decisión de conservar clips para enseñar: [informe de 05](../reviews/phase05-contact-review.md). Revisión deportiva pendiente; parámetros ilustrativos.
