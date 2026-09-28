# Revisión de usabilidad de los intervalos — fase 00

Fecha: 2026-09-24. Alcance: evaluación documental solicitada por el usuario; sin interfaz, código, instalaciones ni pruebas con participantes.

Seguimiento: fase 00 aceptada el 2026-09-27. La sección final recoge la corrección de fase 01: preparación automática ampliable, sin confirmación manual. Las observaciones originales conservan su fecha; ninguna prueba empírica se ha realizado.

## Dictamen y nivel de evidencia

La propuesta de repeticiones objetivo dentro de una ventana temporal es una base razonable para evaluar en fuerza. Mostrar objetivo y reloj con igual importancia, y dejar un avatar repitiendo continuamente, puede dar instrucciones contradictorias. Se recomienda refinar la jerarquía visual y la demostración antes de probarla.

- **Verificado en el proyecto:** el borrador usa ventanas de fuerza de 40 s; faltan dosis revisadas y clips. Las reglas permiten completar las repeticiones y descansar el tiempo sobrante. El usuario confirma avance automático, pausa para preparación adicional y separación entre duración programada y tiempo real.
- **Confirmado en conversación:** al usuario le agrada la propuesta de fuerza, pero solicita contrastarla con usabilidad y expectativas humanas antes de darla por la mejor opción. Esto no aprueba las mejoras nuevas de este informe.
- **Verificado en fuentes:** se consultaron guías de interacción/accesibilidad y un estudio original de una aplicación de ejercicio. Sus límites se explicitan abajo.
- **Inferencia de diseño:** durante el ejercicio conviene reducir las decisiones y la información que compite por atención. En este caso hay que entender el movimiento, recordar lado/objetivo, llevar la cuenta y reconocer las transiciones. La magnitud de esa carga no se ha medido.
- **Pendiente:** comprobar comprensión, alcance de controles, legibilidad, atención al movimiento y errores con una representación visible en los dispositivos del usuario. No existe validación empírica ni evidencia de superioridad universal.

## Fuentes y límites de aplicación

1. [W3C: Help Users Focus](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/). Recomienda limitar distracciones y facilitar la preparación de tareas. Es orientación complementaria de accesibilidad cognitiva, no un ensayo de nuestra interfaz ni un requisito normativo completo de WCAG. Su aplicación al entrenamiento es una inferencia.
2. [Nielsen Norman Group: heurísticas de usabilidad](https://www.nngroup.com/articles/ten-usability-heuristics/). Sustenta hacer visibles estado y acciones, reducir recuerdo innecesario y mantener información relevante. Son principios de evaluación, no mediciones del usuario ni prueba de que una disposición específica sea óptima.
3. [Mehra y colaboradores, 2019: Supporting Older Adults in Exercising With a Tablet](https://pmc.ncbi.nlm.nih.gov/articles/PMC6376334/). Estudio original con 15 participantes de 69–99 años; 14 incluidos en el análisis. Encontró dificultades y preferencias mediante tareas observadas; hubo comentarios sobre exceso de texto y tamaño del video. Tableta de 10 pulgadas y población distinta: no extrapolar sus porcentajes a este usuario, teléfono o avatar. No comparó las alternativas temporales de este informe.
4. [W3C: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Explica tamaños/espaciado para reducir activaciones equivocadas; establece un mínimo de 24×24 píxeles CSS con excepciones. Ese mínimo no demuestra comodidad al entrenar. Pausa requiere una superficie amplia y ubicación estable, cuya utilidad se probará a la distancia real.
5. [W3C: Audio Control](https://www.w3.org/WAI/WCAG21/Understanding/audio-control). Apoya el control del audio; no demuestra que una voz o un pitido mejore por sí mismo esta tarea. Los avisos deben tener equivalente visual y poder silenciarse.
6. [ACSM: actualización de recomendaciones de fuerza, 2026](https://acsm.org/resistance-training-guidelines-update-2026/). El resumen oficial destaca individualización y señala que llegar al fallo no aporta resultados consistentes para el adulto sano promedio. No valida una dosis individual, estas ventanas de 40 s ni el programa de fútbol. Las cantidades, cadencias y descansos necesitan revisión específica.
7. [Nielsen Norman Group: tareas para pruebas de usabilidad](https://www.nngroup.com/articles/task-scenarios-usability-testing/). Recomienda tareas realistas sin revelar el camino de interacción. Se usará para separar agrado declarado de desempeño observado; este informe todavía no realiza esas pruebas.

No se infiere edad, capacidad física ni conducta del usuario a partir de las poblaciones de esas fuentes. No se tomó popularidad comercial como evidencia de eficacia.

## Comparación de alternativas

Evaluación cualitativa del agente según claridad, esfuerzo de interacción, fidelidad de información, flexibilidad y alcance autorizado. No son resultados de una prueba comparativa.

| Alternativa | Ventaja esperada | Problema para este caso | Dictamen propuesto |
|---|---|---|---|
| Solo cronómetro y movimiento continuo | Pocas decisiones de interfaz | Puede interpretarse como repetir hasta terminar el tiempo; no expresa la dosis por repeticiones | No usar como regla general de fuerza. Puede corresponder a ejercicios definidos por tiempo, si se revisan. |
| Repeticiones y confirmación manual de cada serie | Permite declarar que se terminó | Exige tocar el equipo repetidamente y altera el flujo automático elegido | No imponer como funcionamiento habitual. |
| Repeticiones y cronómetro con igual protagonismo | Ambos datos disponibles | No aclara cuál determina cuándo dejar de repetir; mantiene cuenta mental y miradas a pantalla | Base anterior que conviene refinar. |
| Objetivo principal, reloj secundario, demostración finita y pausa accesible | Conserva automatismo y explica el final de la serie | Sigue sin observar al usuario; necesita dosis/cadencia compatibles y pruebas de comprensión | Candidata recomendada para probar en fuerza. |
| Conteo mediante cámara | Podría reducir cuenta manual si funcionara bien | Introduce reconocimiento, errores, permisos y pruebas que no existen en MVP1 | No añadir en esta fase ni atribuir esa capacidad a un contador de animación. |

## Refinamiento propuesto

1. **Antes del cambio:** mostrar siguiente ejercicio, posición inicial, lado y material durante el descanso. Mantener el avance automático aceptado. Comprobar después que la preparación cabe sin consumir el descanso necesario; no resolver una mala planificación obligando a pausar constantemente.
2. **Durante fuerza:** avatar legible y objetivo de repeticiones como referencia principal; texto breve equivalente a «Al completar el objetivo, descansa». El tiempo disponible permanece visible en segundo plano. Probar la etiqueta «Cambio en…» para evitar que parezca una orden de repetir durante cada segundo.
3. **Demostración:** proponer una serie finita con entrada/salida y cadencia revisadas, seguida de reposo, en lugar de repetir indefinidamente hasta consumir la ventana. Si se muestra un contador, identificarlo como avance de la demostración. No afirmar «has hecho N» ni dar por correctas las repeticiones de una persona que no se está observando.
4. **Ritmos distintos:** permitir descansar antes si el usuario completa su objetivo. La app no conoce ese momento sin una entrada adicional; conservar la instrucción condicional visible. Si el usuario va más lento, el diseño no debe urgirlo a acelerar para alcanzar al avatar. Si acaba la ventana, la propuesta es pasar al descanso previsto sin afirmar que completó las repeticiones. Pausa sigue disponible; la regla precisa se formalizará en 01.
5. **Viabilidad del contenido:** revisar que la serie demostrada, entradas/salidas y cadencia caben en la ventana. Si no caben, revisar dosis o planificación en la fase autorizada; no comprimir artificialmente el gesto. La suma de 3600 s sigue siendo una condición del programa inicial.
6. **Controles y avisos:** Pausa grande, estable y accesible por teclado en computadora; avisos sonoros breves opcionales para cambios con equivalente visual. Ninguna información esencial debe depender solo de color o sonido. Voz hablada no queda aprobada, instalada ni prometida como offline; cualquier incorporación requiere revisar su recurso y licencia.
7. **Información según el momento:** durante ejecución, una indicación técnica breve y el lado en texto; durante descanso, preparación siguiente. La vista completa de la sesión puede consultarse fuera del momento activo. Evitar mostrar simultáneamente estadísticas, todos los controles de cámara y varias instrucciones largas.

Estas son propuestas para evaluación, no nuevos contratos implementados. No se aplica indiscriminadamente un objetivo por repeticiones a movilidad, posiciones sostenidas o todos los ejercicios de balón; la unidad adecuada depende de cada ficha revisada.

## Cómo comprobarlo después

Primero probar comprensión con una representación estática, sin realizar el ejercicio. En una fase posterior autorizada, comparar la propuesta anterior y el refinamiento, con el mismo contenido y variando el orden de presentación para reducir aprendizaje. No interpretar una simulación verbal o agentes que imitan usuarios como evidencia humana.

| Situación de prueba | Observación buscada | Motivo para revisar el diseño |
|---|---|---|
| Objetivo completado antes de acabar la ventana | Explica espontáneamente que puede descansar y qué significa el reloj | Cree que debe continuar hasta cero. |
| Avatar muestra una repetición diferente de la propia | Distingue demostración y ejecución personal | Cree que la app lo está contando o evaluando. |
| Necesita acomodar material | Encuentra pausa y retoma sin perder su lugar | Pulsa salir/omitir por error o no alcanza el control. |
| Llega el descanso/cambio de lado | Reconoce el estado y el lado sin leer párrafos | Continúa el gesto equivocado o confunde lado del avatar con el suyo. |
| Audio apagado o pantalla no observada durante unos instantes | Puede reorientarse al volver a mirar; evaluar también aviso sonoro opcional | Pierde transiciones de forma repetida o depende de un canal único. |
| Pantalla colocada para el uso real | Lee el objetivo y ve apoyos/cuerpo en teléfono y computadora | Tiene que sostener el teléfono, acercarse continuamente o pierde partes del gesto. |

Registrar por tarea aciertos sin ayuda, solicitudes de ayuda, errores, toques, tiempo para pausar y valoración de claridad/esfuerzo mental. Comparar resultados individuales; no inventar umbrales clínicos ni convertir una muestra pequeña en una garantía para todos. Una confusión crítica obliga a ajustar y repetir la tarea afectada.

La primera comprobación con el usuario permite evaluar su uso particular. Si se amplía el público, repetir con personas representativas de distintas experiencias y necesidades. Las pruebas físicas requieren contenido revisado previamente; entender la interfaz no valida técnica, dosis ni seguridad deportiva.

## Resultado actual y siguiente paso

Evaluación documental, comparación y explicación al usuario realizadas; pruebas humanas, prototipo, legibilidad y beneficio de avisos todavía pendientes. Actualización al balance del 2026-09-26: los repasos de licencias, reutilización, matriz de costos y plan ya se presentaron. La fase 00 queda propuesta para cierre documental, pendiente de aceptación, según [PROJECT_STATUS](../../PROJECT_STATUS.md); no se confunde el recorrido con validación empírica de la interfaz.

## Preparación automática ampliable — corrección de fase 01

Fecha: 2026-09-27. El usuario rechaza el segundo toque que requería la propuesta anterior para iniciar después de pedir tiempo. Explica que interactuar frecuentemente distrae y corta el ritmo. Se registra como experiencia y restricción de este usuario; no se presenta como estudio universal. La espera indefinida con confirmación manual queda sustituida.

**Diseño vigente:** demostración automática durante preparación/descanso, inicio automático al terminar y dos acciones directas, «+30 s» y «+1 min», bajo «Más tiempo para prepararme». Un toque en cualquiera añade su duración al tiempo que ya quedaba; no abre menú ni exige confirmar después. Son opciones aportadas por el usuario, no un umbral de aprendizaje o recuperación demostrado. Pausar todo queda accesible para una interrupción indefinida.

| Alternativa | Interacción necesaria al pedir más tiempo | Dictamen |
|---|---|---|
| Espera manual hasta estar listo | Pedir tiempo y volver a pulsar para iniciar | Retirada: contradice la experiencia y el flujo automático solicitado |
| Extensión temporizada con retorno automático | Un toque por ampliación necesaria | Elegida para especificación; comprensión/tamaños/suficiencia por probar |
| Detener todo indefinidamente | Pausar y continuar expresamente | Conservar como acción distinta para interrupciones de duración desconocida |

La vista previa no requiere que se active un modo. Mostrar «Empieza en…» con el total restante, ampliarlo inmediatamente al tocar y mantener el ejemplo hasta comenzar práctica. Ejemplo: quedan 20 s y +30 s produce 50 s. Si luego añade un minuto, sumar 60 al restante de ese instante; nunca resetear a 60 ni perder lo anterior. Al llegar a cero, cambiar a la posición inicial y al objetivo real de trabajo sin botón de estar listo.

Aviso visual de los últimos cinco segundos y audio opcional según configuración. Pausar solo la imagen del ejemplo no pausa esa cuenta; Pausar todo sí. Los controles deben tener nombres distintos y acceso estable, sin paneles que tapen lo principal. El estado y la cuenta deberán hacer previsible el cambio automático. Aumentar tiempo no debe exigir navegar ni llegar a un ajuste de preferencias.

Evidencia documental previamente consultada: [W3C 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) fundamenta que se pueda controlar el contenido en movimiento; se mantiene Pausar todo y control de imagen. [W3C 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) orienta sobre tiempo para interacción. Estas fuentes no prescriben 30/60 s, descansos deportivos ni demuestran que esta interfaz ya cumpla WCAG. En esta corrección no se realiza una nueva revisión deportiva ni se pretende acreditar aprendizaje.

Un ejemplo finito puede repetir su presentación con salida/retorno o separación visibles y revisados. Al pasar a práctica conserva dosis/cadencia y serie finita si corresponde. No inferir repeticiones realizadas, recuperación fisiológica o comprensión por tiempo transcurrido. Si habitualmente falta preparación, revisar la planificación; no convertir tocar extensiones en obligación repetida.

Pruebas futuras sin ejercicio físico: ver un cambio completo sin tocar; añadir 30 s y apartarse sin volver a la pantalla; elegir +1 min con un toque; añadir otra extensión durante la cuenta; pausar solo imagen; pausar todo; recibir aviso sin audio; comprobar comando justo en una frontera y regreso tras ocultación. Registrar toques, errores, necesidad de ayuda, comprensión del tiempo resultante y previsibilidad del autoinicio. Objetivos: cero interacciones en transición normal y una por ampliación elegida, excluyendo acciones excepcionales deliberadas. No declarar logrados esos objetivos sin observar la interfaz real.

Reglas y casos en el [contrato de sesión](../architecture/SESSION_ENGINE_CONTRACT.md). Solo cambia documentación: no hay aplicación, generación/descarga de recursos ni pruebas de usuarios.
