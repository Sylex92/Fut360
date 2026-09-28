# Remotion — elegibilidad, utilidad y decisión para este proyecto

Seguimiento de arquitectura, 2026-09-27: [ADR 0006](../architecture/adr/0006-rapier-and-guided-clips.md) conserva Three/Fiber + AnimationMixer para MVP1 por alcance de integración. Player sigue siendo alternativa admisible, sin ahorro total ni superioridad de rendimiento demostrados en este proyecto. No se instaló ni se eligió versión. Esta decisión no cambia la elegibilidad/licencia documentada abajo ni incorpora exportación.

Revisión específica: 2026-09-25, a petición del usuario durante la fase 00. Sustituye la explicación del 2026-09-24, que se centraba demasiado en exportación y mezclaba condiciones futuras con la elegibilidad actual. Solo investigación y documentos; ningún paquete instalado ni prueba de ejecución.

## Dictamen para el escenario actual

**El uso personal declarado encaja en la licencia gratuita revisada.** No hay un impedimento de licencia identificado para ese escenario. «Condicionado» conserva el significado de la [política del proyecto](../product/ZERO_COST_AND_GROWTH_POLICY.md): uso actual cubierto, con cambios de contexto que exigen reevaluación. No significa que falte permiso comercial ni que haya que comprar una licencia ahora.

| Cuestión | Resultado y tipo de evidencia |
|---|---|
| Elegibilidad del uso personal | Verificada documentalmente contra el escenario declarado; no requiere otra pregunta al usuario. |
| Capacidades de reproducción y 3D | Verificadas en documentación; Remotion Player es una alternativa técnica real. |
| Elección del reproductor del MVP1 | Recomendación: conservar Three.js/Fiber como base actual; no se ha demostrado que añadir Player reduzca el trabajo total. |
| Exportación local posterior | Remotion es el primer candidato recomendado para evaluar cuando se autorice esa función. |
| Rendimiento, funcionamiento offline e integración real | Pendientes en computadora y Galaxy S24 FE. No hay comparación experimental entre alternativas. |
| Fase y autorización | Continúa 00. Exportación fuera del MVP1 y ninguna instalación autorizada ahora. |

## Licencia: qué se comprobó y qué puede cambiar

Se consultó el [LICENSE del tag v4.0.524](https://raw.githubusercontent.com/remotion-dev/remotion/v4.0.524/LICENSE.md): admite individuos y organizaciones lucrativas de hasta tres empleados, además de otras categorías, y permite crear videos/imágenes personales o comerciales. Prohíbe vender o relicenciar un derivado de Remotion como producto. Este tag sirve como referencia documental fija: no es una versión seleccionada para instalar, una auditoría de sus dependencias ni una afirmación de que sea la última.

La [FAQ oficial](https://www.remotion.dev/docs/license/faq) aclara que Free admite automatización, no recorta funcionalidades y no cobra por render al elegible. Utilizar Player, automatizar o monetizar no obliga por sí solo a contratar Company. Tampoco exige registro en remotion.pro para Free. Las tarifas Company no corresponden al uso personal aquí declarado.

La página de [términos 5.0](https://www.remotion.dev/docs/terms) se identifica como futura y remite a [4.0](https://www.remotion.pro/terms-4-0). Esta última lleva una etiqueta de documento anticuado, pero explica que será reemplazada al lanzarse 5.0. Se registra esa diferencia; no se aplican indistintamente textos de ambas versiones. Para una adopción se fijarán paquete y términos correspondientes.

**Disparadores concretos:** pasar a una entidad lucrativa fuera de la categoría gratuita; cambiar titularidad o colaboración; ofrecer un servicio de render de proyectos ajenos; actualizar a una versión con otras condiciones. El texto 5.0 detalla el cómputo conjunto de partes que poseen u operan el proyecto. Antes de ese cambio, revisar el texto aplicable y mantener una alternativa si aparece un gasto obligatorio. No confundir entrenandos con empleados/colaboradores de la entidad.

**Inferencia para nuestro alcance:** ampliar el catálogo, estadísticas o duración de la sesión no cambia por sí mismo la categoría del titular ni constituye una tarifa por funcionalidad. Los recursos de cómputo siguen siendo finitos. Hosting, productos adicionales y contenido contratado tendrían sus propias condiciones; no se requieren para justificar la elegibilidad personal.

## Qué aporta realmente Remotion

Presentarlo solo como exportador era incompleto. La documentación de [Player](https://www.remotion.dev/docs/player) permite incrustar composiciones React en una aplicación. Su [API](https://www.remotion.dev/docs/player/player) incluye reproducción, pausa, búsqueda de posición, velocidad y eventos. No exige convertir primero toda la sesión en un MP4. Puede participar en una experiencia interactiva, no únicamente en una película previamente generada.

La integración [@remotion/three](https://www.remotion.dev/docs/three) trabaja sobre React Three Fiber. [ThreeCanvas](https://www.remotion.dev/docs/three-canvas) permite derivar la escena del fotograma actual para sincronizarla con la composición. Por tanto, no sustituye Three/Fiber ni crea automáticamente rig, movimientos o física. Cambiar cámaras e integrar clips es trabajo posible de la aplicación; no se descarta esa capacidad por utilizar Remotion.

Remotion también documenta [renderizado con @remotion/renderer](https://www.remotion.dev/docs/renderer), utilizable en un proceso local de la computadora. La etiqueta «server-side» describe dónde corre ese proceso; no exige contratar un servidor en la nube. Dependencias, codec, preparación de recursos y capacidad real del equipo se comprobarían al incorporar la exportación.

## Comparación razonada para el entrenador

Esta tabla es evaluación del proyecto, no un benchmark ni una afirmación del fabricante.

| Necesidad | Base Three/Fiber prevista | Añadir Remotion Player y su integración 3D |
|---|---|---|
| Avatar, clips y cámaras | Reutilizar motor y animaciones existentes; construir controles del entrenador | Reutilizar los mismos recursos con sincronización por fotograma; sigue haciendo falta integrar clips y cámaras |
| Reproducción | Adaptar reloj de sesión a animación y avisos | Aprovechar controles y eventos existentes; adaptar su tiempo a las reglas del entrenador |
| Trabajo, descanso, lados, dosis e historial | Reglas del dominio propias y acotadas | Las mismas reglas siguen siendo necesarias; Player no define su significado deportivo |
| Video exportado más adelante | Integración posterior; puede requerir adaptar animaciones a tiempo determinista | Ventaja potencial: reutilizar composiciones en reproducción y exportación; no elimina validación de ambas salidas |
| Fluidez y autonomía en los equipos | Pendientes de medir | Pendientes de medir; no hay evidencia para afirmar que sea más lento o mejor |

Ejemplo: repetir una demostración debe conservar el entrenamiento restante y sumar tiempo real. Un salto en la línea temporal no decide por sí solo qué registrar como trabajo completado. Esta lógica existe con cualquiera de las dos rutas. Si se adoptara Player, el contrato debe definir una única autoridad temporal y la conversión entre segundos y fotogramas; no mantener dos relojes independientes compitiendo. La reproducción de animaciones se delegará a bibliotecas existentes, sin fabricar un motor nuevo.

**Recomendación:** mantener la base actual para el MVP1 porque su resultado exigido es el entrenador interactivo, mientras que exportar está expresamente fuera del alcance. Player puede ahorrar trabajo de reproducción y futura composición; no hay evidencia suficiente para afirmar que sea la mejor arquitectura global ahora. La exclusión de exportación no basta, por sí sola, para descartar Player. Queda registrado como alternativa válida para la revisión documental de arquitectura, sin iniciar esa fase ni exigir un prototipo en 00.

El criterio para cambiar la recomendación será que reduzca trabajo total de controles, sincronización y mantenimiento conservando las reglas temporales, cámaras, funcionamiento local y claridad móvil. La arquitectura deberá contemplar el costo de adaptar después la exportación; no se promete integración gratuita ni inmediata. Mantener datos de sesión y assets independientes del reproductor, sin crear adaptadores vacíos.

## Telemetría: distinguir reproductor y exportadores

La [documentación de telemetría](https://www.remotion.dev/docs/telemetry) distingue APIs: `@remotion/renderer` envía eventos si se configura `licenseKey`; `@remotion/web-renderer` los envía en cada exportación, aun sin clave. También indica que el fallo de esa petición no hace fallar el render. **`@remotion/player` no es `@remotion/web-renderer`:** esa obligación de exportación en navegador no demuestra que Player tenga el mismo comportamiento.

Pendiente: observar las comunicaciones de la versión y ruta elegidas. No prometer cero solicitudes de red por decir «local», ni concluir que la exportación necesita conexión solo por existir telemetría. En el uso Free, la ruta local sin telemetría obligatoria del servidor es una candidata a comprobar, no una prueba ya ejecutada.

## Pendientes cuando corresponda incorporar

- Elegir versión compatible y paquetes mínimos, revisar licencia/transitivas y procedencia; no instalar plantillas, Editor Starter o cloud por asociación.
- Integrar un clip real y comprobar pausa, repetición, cámara, velocidad y coherencia del registro; separar demostración guiada de contactos físicos.
- Medir legibilidad, fluidez, memoria y operación offline en los equipos confirmados. No se necesita resolver exportación para declarar probado el reproductor.
- Para exportar: derechos de contenido, codec y binarios, tiempo/tamaño del resultado y comportamiento de red de esa ruta específica.

No se necesita más información personal para este dictamen. Véanse la [auditoría de licencias](../reviews/license-audit.md), la [matriz de costos](../reviews/feature-cost-matrix.md) y el [plan del MVP1](../plans/mvp1-execution-plan.md). La fase 00 permanece abierta para su revisión guiada.
