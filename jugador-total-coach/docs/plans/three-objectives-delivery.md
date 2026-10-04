# Entregas para los tres objetivos

Avance técnico 2026-10-04: [perfiles e historial aislados implementados](../reviews/participant-isolation.md), con límites y pruebas. [Cobertura para el cierre integral](../reviews/three-objective-coverage.md): todavía faltan biblioteca suficiente, planes personales, métricas, conversación y TV. La entrega final de los tres objetivos no puede dejar ninguna de esas funciones esenciales como ampliación accesoria.

2026-10-04. [Requisitos adicionales y alcance conservado](../product/THREE_OBJECTIVES.md), [rutas y evidencia](../training/ADULT_AND_YOUTH_PATHWAYS.md). Plan verificable anterior a implementación de esta ampliación. Se suma a [completar el producto](product-completion.md) y [enseñanza con video y plan](video-guided-plan.md); no sustituye sus pendientes ni reinicia las fases. No ejecuta instaladores, servicios ni migración de datos reales.

## Responsabilidad y continuidad

El usuario delega crear, investigar, revisar, aprobar técnicamente, corregir y dar seguimiento hasta entregar el alcance acordado con calidad. El agente ejecuta las decisiones rutinarias autorizadas y registra resultados; no requiere un “adelante” por paso ni traslada al usuario decisiones especializadas. Consulta únicamente información indispensable o permisos que realmente falten. Costos, publicación y cambios globales conservan sus restricciones previas.

Cada entrega debe indicar qué requisito resuelve, qué conserva, qué comprobó y qué falta. Una revisión del mismo agente no se presenta como revisión independiente ni certificación clínica. Los fundamentos deportivos extensos siguen en documentos internos. Si una prueba falla, se corrige y se repite la comprobación afectada antes de aprobar la entrega; si falta evidencia, esa parte permanece pendiente y se continúa con el trabajo independiente.

Prioridad inmediata: preservar los flujos existentes y cerrar deficiencias que impidan entender o completar el entrenamiento. La cobertura visual y el encadenado automático de demostraciones siguen abiertos junto con la ampliación de perfiles; no esperan a terminar TV o conversación. Las respuestas personales pendientes condicionan la dosis correspondiente, no el desarrollo ni la investigación restantes.

## Dependencias de las entregas adicionales

La numeración ordena dependencias, no seis pasos que sustituyan todo el backlog. Reutilizar primero lo existente; investigar referencias y comprobar enseñanza a lo largo de las entregas.

| Entrega | Resultado comprobable | Dependencia / verificación |
|---|---|---|
| 1. Perfiles separados | Adulto/infantil, objetivos/modalidades, selección visible, planes e historial aislados; responsable administra perfil infantil | Reutilizar IndexedDB y motor; contrato de participante/versiones; migración explícita de registros legados; pruebas de cambio, recuperación, exportación/eliminación sin mezclar personas. Solo datos sintéticos en Git |
| 2. Plan propio por perfil | Contexto actual, objetivos funcionales, sesiones elegibles y calendario con carga de partidos; versión adoptada y propuesta siguiente separadas | Respuestas de salud/carga para dosis individuales; no bloquean construir formato/editor. Catálogo infantil y dosificación no se copian del adulto |
| 3. Enseñanza suficiente | Demostración humana/original pertinente, rango completo, instrucciones legibles; estudio/preparación/práctica separados; medios faltantes explícitos | Cerrar cobertura de tareas prioritarias y revisar integración infantil de terceros antes de habilitarla. Probar fluidez/entendimiento en computadora y Samsung; sin promesa de avatar idéntico |
| 4. Seguimiento por capacidad | Intentos/resultados/protocolos y evolución por perfil; distinguir reproducción, práctica declarada y medición | Pruebas con datos faltantes/cambio de método/denominador; sin “profesional 80%”, falsa medición automática ni ranking infantil |
| 5. Rutinas solicitadas desde app | Conversación/propuesta estructurada, revisión de contexto y plan versionado, sin editar una sesión activa | Proveedor e integración a costo permitido pendientes; no presentar reglas locales como IA ni usar la suscripción Codex como API gratuita |
| 6. Smart TV | Vista a distancia con mando y pausa/preparación accesibles, reproducción verificada y continuidad definida | Marca/modelo/OS reales, prueba de navegador/medios y decisión de distribución. No asumir PWA instalable o un empaquetado para todas las marcas |

No son seis nuevas aplicaciones. Reutilizar UI/dominio/catálogo/reproductor/persistencia existentes; extensiones concretas y reversibles. La TV es objetivo comprometido de producto con validación pendiente, no funcionalidad terminada ni prohibición permanente. Evaluarla antes si el aparato concreto bloquea decisiones del reproductor, sin condicionar la planificación deportiva a comprarlo.

## Evidencia necesaria para aprobar y entregar

| Área | Comprobación necesaria | Qué no permite cerrar |
|---|---|---|
| Alcance y regresiones | Relación con requisitos acumulados y prueba de los flujos afectados; preservar registros existentes | Tener solo los tres nuevos objetivos documentados o aprobar únicamente pantallas nuevas |
| Enseñanza | Ficha y demostración corresponden a variante, apoyos, contactos, resultado y ritmo; revisar rango completo y comprensión donde proceda | Contar una URL, un clip parcial o una animación geométricamente válida como ejercicio plenamente explicado |
| Flujo y usabilidad | Recorrido completo, preparación extra y autoinicio, pausas, fallos y recuperación; teclado, tamaño de pantalla y lectura | Una captura aislada o un clic exitoso como prueba del entrenamiento completo |
| Datos y progreso | Aislamiento de perfiles, integridad de versiones, importación/exportación/eliminación y mediciones con procedencia | Pérdida o mezcla de historial; tiempo reproducido presentado como capacidad física |
| Implementación | Tipos, lint, pruebas pertinentes y build; revisión de cambios y consola. Repetir controles afectados tras corregir | Pruebas de una versión anterior como validación de funciones nuevas |
| Dispositivos y disponibilidad | Evidencia por versión y entorno: computadora, Samsung físico y TV concreta; offline solo sobre recursos cubiertos | Emulación como sustituto del dispositivo o compatibilidad universal inferida de Chrome |
| Contenido, derechos y costo | Fuente y alcance de revisión, adecuación por contexto, permisos y límites del recurso concreto | Confundir fundamento documental con alta deportiva, aprobación infantil o permiso para copiar medios |

Estados por requisito: **pendiente → en trabajo → comprobado técnicamente**, con **revisión documental / comprobación de comprensión / prueba en dispositivo** registradas por separado cuando apliquen. “Listo para entregar” exige los criterios aplicables satisfechos y evidencia enlazada. No asignar un porcentaje global de calidad ni cerrar el producto ampliado mientras falten funciones comprometidas; una entrega parcial conserva su nombre y sus pendientes.

Al finalizar cada incremento, actualizar `PROJECT_STATUS.md` con cambios, verificaciones realmente ejecutadas, defectos abiertos y siguiente acción concreta. El seguimiento se mantiene en el repositorio durante el trabajo; no implica que exista un servicio autónomo ejecutándose entre conversaciones.

## Criterios que frenan solo la parte dependiente

- Estado actual adulto y carga/supervisión infantil: necesarios para fijar la dosis, no para documentar objetivos o desarrollar perfiles con datos sintéticos.
- Nombre completo del referente “Anderson”: necesario para atribuir capacidades a esa persona, no para usar los objetivos funcionales ya declarados.
- Aparato TV: necesario para verificar compatibilidad, no para extender modelo de datos o enseñanza móvil/web.
- Fuente visual exacta/derechos: necesarios para marcar una tarea como demostración completa, no para conservar su borrador razonado.

## Costos, privacidad y continuidad

Núcleo local sin pagos nuevos; almacenamiento y respaldo sujetos al navegador/equipo. Sync entre dispositivos, distribución nativa, IA y medios de terceros tienen auditorías propias; no prometer nube o acceso ilimitados. El modo infantil requiere revisar tanto idoneidad educativa como reglas del proveedor: youtube-nocookie no sustituye la designación exigida para contenido dirigido a niños. [Fuente oficial](https://support.google.com/youtube/answer/171780?hl=en).

La especificación y el menú infantil de este incremento son documentales. La aplicación conserva la última entrega técnica; no muestra que ya exista un plan personal del niño. Pruebas de código anteriores no se reutilizan como evidencia de esta ampliación.
