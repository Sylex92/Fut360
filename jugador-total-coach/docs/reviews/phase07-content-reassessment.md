# Fase 07 — revisión de repetición, dificultad y propósito

2026-10-01. Respuesta al usuario: el flujo parece correcto, pero los ejercicios se repiten mucho y resultan demasiado básicos para lo esperado. Se registra aceptación cualitativa del flujo, sin inferir una nueva prueba instrumental, dispositivos concretos ni aprobación del contenido deportivo. Esta revisión es interna; no se importa al portal. No inicia 08 ni modifica el programa servido.

## Dictamen del agente

La hora v2 funciona como introducción y prueba integrada, pero **no está suficientemente justificada como programa de desarrollo para el objetivo del usuario**. El defecto no se resuelve defendiendo que todo fundamento es útil ni añadiendo dificultad indiscriminadamente. Elegí una base de familiarización ante información incompleta; eso no acredita que el usuario necesite ese nivel. Debí evaluar antes si repetirla durante una hora conservaba una finalidad suficiente.

Las fichas describen propósitos plausibles de cada patrón. No justifican por sí mismas su dosis, distribución o repetición en esta sesión. La cobertura de doce patrones/dieciséis variantes y la reproducción exacta de 3600 s siguen verificadas; el criterio de valor del contenido queda reabierto. La restricción de reutilización tampoco obliga a limitar el programa a los clips actuales: cuando una tarea adecuada requiere otra secuencia, corresponde producirla con el pipeline existente.

## Hechos verificados en el workout v2

Recuento directo de `blocks[].items[]` en [definición](../../content/workouts/mvp1-60min-v2.json), sin ejecutar ni cambiar dosis:

| Hallazgo | Dato y alcance |
|---|---|
| Campanitas | 8 apariciones: 8:00 programados, de ellos 3:43 de ventana de práctica. |
| Planta lateral | 4 apariciones por lado; ambos lados suman 8:00 programados y 4:00 de práctica. |
| Interior/exterior | 4 apariciones por lado; ambos lados suman 8:00 programados y 4:00 de práctica. |
| Giro por pasos sin balón | 4 apariciones por sentido; 8:00 programados y 2:40 de práctica. |
| Tres bloques técnicos | Fundamentos, orientación e integración reutilizan las mismas cinco variantes de contacto; orientación/integración intercalan giro sin balón. No añaden una combinación continua de contactos ni una dificultad progresiva explícita. |
| Reparto total | 15:25 preparación/demostración, 27:28 ventanas de práctica y 17:07 descanso. Las ventanas tampoco equivalen a actividad realizada: parte queda libre tras completar la serie finita. |
| Fuerza | Hasta cuatro gestos por serie en bisagra, sentadilla corta y empuje; no hay esfuerzo/carga individual calibrados ni criterio operativo para progresar. |

La repetición cuantificada no demuestra ineficacia. El problema comprobable es que el programa no explica qué nueva exigencia o consolidación busca cada reaparición, ni permite concluir que la dosis aporte un estímulo adecuado a este usuario. Tampoco hay un porcentaje universal correcto de trabajo/descanso que autorice suprimir descansos para llenar tiempo activo.

## Contraste documental

Fuentes primarias institucionales consultadas directamente el 2026-10-01; lectura del texto, sin atribuir visionado de todos los videos ni revisión sistemática propia.

| Fuente | Aporte y límite |
|---|---|
| [FIFA / Michael Beale: Developing a technical hard drive](https://www.fifatrainingcentre.com/en/practice/training-perspectives/outplaying-the-opponent-with-michael-beale/developing-a-technical-hard-drive.php), 2026-08-13 | Describe retos graduales según asimilación, ambos lados, contacto y orientación, seguidos por oposición. Su activación enlaza superficies del pie; otras tareas requieren compañeros y unos 10 m. Apoya revisar progresión y propósito, no copiar su sesión en 2×2 ni suponer transferencia de nuestra adaptación. |
| [FIFA: Mastering ball control](https://www.fifatrainingcentre.com/en/practice/elite-sessions/in-possession/mastering-ball-control.php) | Incluye fundamentos de manipulación y variantes posteriores. Tener tareas básicas en una sesión de fútbol no las hace inútiles; tampoco valida las ocho apariciones y las dosis de nuestro JSON. |
| [ACSM: actualización de fuerza 2026](https://acsm.org/resistance-training-guidelines-update-2026/), 2026-03-17 | Resumen institucional de su revisión para adultos sanos: constancia, esfuerzo y ajuste al objetivo; entrenamiento doméstico, bandas y peso corporal pueden ser útiles. Distingue necesidades deportivas específicas. No es una prescripción para este usuario ni una prueba de que cuatro repeticiones de pared/bisagra produzcan el estímulo buscado. No trasladamos porcentajes de carga ni pautas semanales sin contexto. |

**Inferencia de diseño:** conservar fundamentos útiles y aumentar su exigencia pertinente cuando corresponda; no confundir movimientos vistosos, saltos, velocidad del avatar o cansancio con mejor entrenamiento. Los perfiles Bellingham/Firmino requieren además percepción, decisiones y acciones con compañeros/oposición. Una habitación no reproduce esas demandas; un estímulo de pantalla tampoco equivale por sí solo a leer un rival.

## Corrección propuesta antes de cerrar el contenido

1. Separar primera familiarización de la práctica regular. Dar explicación completa al presentar una tarea y recordatorios breves al repetirla; conservar demostración automática, recuperación necesaria y +30/+60. El usuario no debe pulsar para aprobar cada inicio. Recalcular después la hora completa, no eliminar tiempos automáticamente.
2. Asignar a cada serie un propósito observable: control dentro del área, superficie de contacto, precisión por ambos lados o continuidad. Repetir puede consolidar el mismo objetivo; debe estar justificado. Cambiar una exigencia cada vez y comprobarla, sin prometer un umbral universal de dominio.
3. Priorizar secuencias reales de contacto y reorientación para los bloques de orientación/integración. Candidato de autoría: enlazar interior, exterior y planta con retorno controlado, por ambos lados. Requiere ficha, cabida y clip completo; alternar un contacto aislado con un giro sin balón no representa esa combinación. El gesto final y su dificultad dependen del punto de partida.
4. Revisar variantes y dosis físicas según actividad habitual, capacidad y restricciones declaradas. Pared, sentadilla corta y bisagra sin carga pueden conservarse como entradas/regresiones; no imponerlas como techo. No prescribir saltos, fatiga obligatoria ni aumentar carga para compensar aburrimiento.
5. Mantener el requisito de una sesión fija de 60 min y el área 2×2. El reparto 8/12/10/16/8/6 es una decisión revisable, no una obligación científica. Conservar v2 como referencia; una nueva propuesta requiere versión explícita, justificación, recursos y pruebas, sin generar planes con IA en runtime.

## Información necesaria y siguiente paso

Se preguntó una sola vez por contexto y se recibió respuesta durante la revisión. Los valores personales y el estado de salud se conservan en la conversación, no en este documento ni en Git. No repetir el cuestionario ya respondido ni volver a pedir el objetivo Bellingham/Firmino. Falta evidencia de dominio técnico, que no se infiere de jugar varias posiciones o de que una animación parezca fácil; no solicitar ahora pruebas físicas ni máximas.

**Decisión tras la respuesta:** diseñar preparación complementaria al fútbol habitual, contabilizando partidos como carga. Experiencia de juego y adaptación a fuerza son dimensiones distintas: ni nivel principiante global por no hacer gimnasio, ni progresión física avanzada automática por jugar a menudo. Los 60 min definen la duración del producto, no una pauta diaria ni una hora adicional obligatoria sobre todos los partidos. La distribución semanal requiere duración/intensidad y recuperación, cuando corresponda fijarla; no se prescribe en esta revisión.

La siguiente propuesta debe desarrollar: contactos encadenados por ambos pies; orientación con balón realmente representada; control y precisión antes de aumentar velocidad; variantes físicas graduables; explicación inicial suficiente y recordatorios sin redundancia. Retención/adaptación se revisarán cuando sea oportuno con tareas comparables; no habrá conteo automático de aciertos ni promesas tácticas. Determinar dosis/tiempos finales después de seleccionar tareas y nivel, producir los clips necesarios y volver a comprobar 3600 s. La revisión de diseño puede continuar sin ejecutar físicamente la rutina. No se utiliza el MVP para autorizar una vuelta al deporte.

No declarar la hora actual aprobada deportivamente ni avanzar a 08 por la conformidad con el flujo. No exigir contratación externa genérica: sigue [ADR 0012](../architecture/adr/0012-documentary-training-review.md).

En este seguimiento solo se revisan documentos y definición de solo lectura. Aplicación, GLB, entrenamiento servido y dependencias permanecen sin cambios; no se repite ni se atribuye otra ejecución de las 217 pruebas o de la hora real.
