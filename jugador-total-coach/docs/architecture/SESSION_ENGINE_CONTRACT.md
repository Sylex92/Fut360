# Contrato del motor de sesión

Diseño: 2026-09-27. Actualización: 2026-09-28. Motor temporal y adaptador implementados en 03 con milisegundos enteros y conversión única del fixture. [Cobertura y límites](../reviews/phase03-session-engine-review.md): pruebas automáticas correctas; recorrido en navegador nuevo pendiente. Inspector, avatar, audio y recuperación durable siguen previstos para sus fases. Los nombres siguientes expresan el contrato; la API concreta está en domain/session.ts y session-engine.

## Autoridad y programa

Recibir programa inmutable validado, avance temporal confiable y comandos; devolver estado, eventos ordenados y proyección. Sin React, animación, reloj global o base de datos.

El adaptador aporta tiempo monotónico de un mismo origen. La UI deriva restante de la proyección; no resta un segundo por callback. Render/audio no mantienen cronómetros independientes. UTC sitúa el historial, nunca hace avanzar trabajo.

Corrección del usuario durante la revisión de 01: priorizar avance automático y mínima interacción. Durante preparación el ejemplo se reproduce automáticamente; «+30 s» o «+1 min» amplían el tiempo con un toque y conservan autoinicio. La propuesta de espera indefinida con confirmación manual queda sustituida. Un único reloj gobierna programa/extensiones; el cursor visual de ejemplo no acredita trabajo. Pausar todo e inspeccionar un trabajo iniciado siguen siendo acciones explícitas independientes.

MDN documenta limitación de timers/render en pestañas ocultas y diferencias durante suspensión. Elegimos pausar al ocultar y no acreditar actividad no observada. Fuentes consultadas 2026-09-27: [visibilidad](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [reloj](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now). Es una decisión del proyecto, no una recomendación deportiva de esas fuentes.

Compilar WorkoutDefinition en ocurrencias identificadas por bloque/ronda/entrada/lado. Cada ocurrencia incluye demostración programada opcional, trabajo y descanso. Demostración/trabajo positivos; descanso cero se elimina sin evento de inicio. Vista previa durante descanso no añade un segmento ni consume el siguiente ejercicio. Explicaciones anteriores a Start quedan fuera del programa. Toda demostración incluida en los 60 minutos tiene duración explícita.

Restante base = 3.600.000 − baseConsumidaMs − baseOmitidaMs. Restante de ejecución añade extras de práctica y preparación pendientes. La duración declarada base no se reescribe al pausar/repetir/ampliar preparación. La suma base de demostración, trabajo y descanso es exactamente 3.600.000.

## Estados y transiciones

| Estado | Entrada | Resultado |
|---|---|---|
| idle | Prepare | preparing; fijar versión, validar y precargar |
| preparing | PreparationSucceeded | ready; sin tiempo de programa consumido |
| preparing | PreparationFailed | error con causa |
| ready | Start | running en primer segmento; SessionStarted una vez |
| running | Advance confiable | Consumir fronteras ordenadas; completed al final una sola vez |
| running | Pause, PageHidden, ResourceFailed o ClockGap | paused, conservando punto y motivo |
| paused | Resume, con página visible y recursos listos | running en punto guardado |
| running/paused | QueueRepeat | Encolar extra según reglas inferiores; conservar pausa previa |
| running/paused con phase work | SkipCurrentWork | Omitir trabajo restante, conservar descanso y pausa previa |
| running/paused durante preparación del trabajo objetivo | ExtendPreparation(30000 o 60000 ms) | Sumar tiempo adicional, conservar el estado de pausa si existía; sin confirmación posterior |
| running; terminan segmentos previos y hay preparación extra | Frontera anterior a work | phase preparation-extra; mantener work en 0 mientras se consume la extensión |
| running con phase preparation-extra | Se agota extensión | Cerrar preview e iniciar trabajo automáticamente; si se interrumpió trabajo al cruzar frontera, retomar su cursor guardado |
| ready/running/paused | Abort | aborted; cancelar extras pendientes y conservar registro |
| Sesión recuperable | Restore | paused si checkpoint/plan/assets compatibles; error en otro caso |
| completed/aborted | Avance o repetición | Rechazo sin efectos; nuevo entrenamiento necesita nueva sessionId |
| error | RetryPrepare o descartar | preparing o idle; nunca saltar validación |

running expone phase = demonstration, work, rest o preparation-extra. paused guarda phase y cursor. En demonstration/rest se permite pausa/aborto/repetición del ejercicio asociado; omitir solo en work. En preparation-extra se permite ampliar, pausar todo o terminar; no añadir otra serie por confundirla con preparación. Cancelar ready antes de Start no cuenta como entrenamiento iniciado.

Prepare expresa el estado lógico; la app ejecuta validación/carga y envía su resultado. El motor puro no hace I/O. Un error durante Restore conserva la sesión guardada: reintentar validación/recuperación, nunca abrir una sesión nueva sobre ese registro.

## Pausa, visibilidad y huecos

Pause muestrea hasta el instante confiable del comando y congela programa, cuerpo, balón y audio. Resume establece nuevo anclaje. PageHidden pausa; volver a visible no reanuda solo. Un blur sin ocultación no basta.

Aquí Pause se presenta como «Pausar todo»: también detiene la vista previa/inspector y la cuenta de preparación adicional. Ocultación, pérdida de recursos o interrupción del reloj detienen ambos; volver requiere acción explícita y conserva lo pendiente. Esta recuperación excepcional no añade una confirmación al flujo normal de preparación, que termina automáticamente.

Umbral inicial del adaptador: >2000 ms entre muestras visibles es interrupción no observada. No enviar ese salto al motor; pausar en el último cursor confirmado y registrar hueco, sin acreditar trabajo. Delta negativo/no finito es error. El umbral se comprobará en dispositivos; no tiene significado deportivo.

El motor puro procesa avances grandes confiables atravesando cada frontera una vez, para pruebas aceleradas. El adaptador decide previamente si el avance es confiable. Audio no dispara ráfagas de avisos vencidos: solo el vigente. Frontera exacta pertenece al segmento siguiente; última frontera produce completed.

## Repetir sin quitar programa

QueueRepeat significa «repetir este ejercicio después de su descanso». Disponible durante sus segmentos y en pausa. Encola copia completa de la ocurrencia: demostración programada si existe, trabajo y descanso, mismo lado/dosis. No reinicia ni descarta la parte actual; el extra va antes de la siguiente ocurrencia base.

Una repetición pendiente por ocurrencia; indicar «repetición añadida». Durante el extra se puede pedir otro al terminarlo. CancelQueuedRepeat elimina el extra no iniciado. Abort cancela todos. SkipCurrentWork cancela el extra pendiente de esa ocurrencia y conserva su descanso; evitar repetir por sorpresa lo que se acaba de omitir.

Presentación propuesta para evitar confundir una vuelta del ejercicio con una repetición corporal: control «Repetir ejercicio» y texto «Después del descanso · +duración», calculando demostración, trabajo y descanso del extra. Tras encolarlo, mostrar confirmación persistente y opción de cancelar antes del inicio. Esto no constituye una recomendación automática de aumentar la dosis; el objetivo finito de cada serie permanece igual. La comprensión de estos textos se probará con la interfaz, sin considerarla validada por documentarlos.

Inspeccionar una demostración no añade trabajo. Pulsar repetir no demuestra que el usuario hizo repeticiones físicas.

## Omitir y terminar

SkipCurrentWork marca el restante como omitido, no completado; conserva el descanso previsto. No hay salto de descanso ni barra de búsqueda libre de la sesión en MVP1. Omitir trabajo base da resultado completed-with-omissions al llegar al final; el programa declarado sigue siendo de 60 min aunque se haya reproducido menos.

Abort conserva tiempo/eventos y admite feedback opcional. No exige describir molestias para salir. Un aviso de detenerse no selecciona automáticamente sustituciones ni infiere diagnóstico.

## Cámaras e inspección

Cambiar front/side/threeQuarter no altera cursor ni lado. Cámara inicial threeQuarter salvo justificación de la ficha; las tres disponibles.

«Ver despacio» pausa y abre inspector guardando el punto de sesión. El inspector permite buscar posición y reproducir a 0,5×, con tiempo separado y sin eventos de ejercicio. Indicador Pausado visible. Cerrar inspector restaura pose/cursor guardados; Resume los restaura antes de continuar. No reanudar desde la pose inspeccionada ni dejar dos autoridades sobre el objeto.

El inspector del ejercicio ya iniciado ofrece velocidad normal y 0,5× y controles de animación propios, con «Continuar ejercicio» para retomar el cursor guardado. No salta al siguiente ejercicio ni reinicia el trabajo realizado. La preparación previa descrita abajo sí comienza el trabajo objetivo desde cero, porque aún no se ha iniciado.

## Preparación automática con tiempo adicional — diseño vigente

El usuario rechaza tener que volver a pulsar para empezar después de pedir tiempo. Se adopta avance automático, demostración previa automática y extensión temporizada opcional. La experiencia de interacción comunicada por el usuario es evidencia de su necesidad; el diseño de interfaz y los valores no han sido probados en este proyecto.

1. Durante descanso/preparación se muestra automáticamente el siguiente ejercicio, su material y el ejemplo repetido. Sin pulsar nada, el programa llega a la práctica con el tiempo previsto.
2. Si necesita más tiempo, el usuario pulsa una acción directa «+30 s» o «+1 min», agrupadas bajo «Más tiempo para prepararme». Cada una requiere un toque, sin menú, diálogo ni confirmación al finalizar. Son incrementos tomados de su propuesta, no dosis deportivas ni tiempos óptimos demostrados.
3. Sumar el incremento al tiempo que ya quedaba hasta la práctica; no sustituirlo ni reiniciarlo. Ejemplo: faltan 20 s y pulsa +30 s → empieza dentro de 50 s. Otro +1 min suma 60 s al restante que haya en ese instante. Un toque deliberado nuevo añade tiempo; reintentar el mismo commandId no lo duplica.
4. Conservar descanso/demostración programados y, antes del trabajo, consumir preparación adicional como segmento virtual preparation-extra. Durante ese segmento el programa base no avanza y el trabajo queda intacto; el ejemplo visual sigue reproduciéndose. Mostrar una cuenta clara «Empieza en…» que incluya todos los segmentos previos y la extensión.
5. Al agotarse la cuenta, detener preview, colocar la pose inicial e iniciar automáticamente el ejercicio, sin botón de estar listo. El visor sigue entonces la pauta real de práctica: serie finita cuando corresponda. Nunca continuar desde el instante arbitrario del bucle ni reducir trabajo para mantener una hora de calendario.
6. Aviso visible de los últimos cinco segundos y aviso sonoro opcional según configuración existente; sin avisos por cada vuelta del ejemplo. Si se amplía la cuenta durante el aviso, actualizarla y volver a avisar al nuevo vencimiento, evitando audios atrasados.
7. Pausar todo queda accesible para una interrupción de duración desconocida; congela también cuenta adicional y animación. Reanudar tras esa acción explícita continúa lo restante. Añadir tiempo mientras está pausado no reanuda por sorpresa. Ocultación, fallo o recarga conservan esta pausa excepcional, sin consumir tiempo cerrado.
8. La extensión es local al cambio actual, no una preferencia que añada esperas a todos los ejercicios. Abort cancela lo pendiente y detiene la presentación. Cerrar un panel de detalles no altera la cuenta ni se interpreta como confirmación para iniciar.

Durante preparación, controles opcionales de la demostración: pausar/reproducir imagen, 1×/0,5× y cámaras. Pausar solo la imagen no detiene la cuenta visible ni el autoinicio; Pausar todo sí. La reproducción previa no cuenta repeticiones ni demuestra aprendizaje. Un clip finito puede repetir su presentación con salida/retorno o separación revisados; no unir poses imposibles ni convertir la práctica en bucle infinito.

La extensión fija targetOccurrenceId/versión/lado. Si un extra de práctica encolado pasa a ser lo siguiente, actualizar objetivo/ejemplo sin perder los segundos añadidos. No saltar a un ejercicio arbitrario. Si el comando llega justo después de que ese mismo objetivo empiece, insertar la pausa temporizada y guardar el trabajo ya consumido; mostrar «Reanuda en…» y volver automáticamente a ese cursor. No reiniciar ni omitir trabajo para fingir que el toque llegó antes. Una referencia que no corresponde al objetivo actual/próximo se rechaza sin cambiar otro ejercicio.

El caso normal empieza el trabajo desde 0. El caso tardío conserva returnCursor. Inspección detallada de un trabajo ya iniciado sigue usando pausa explícita con reanudación exacta; no se impone para obtener más preparación en una transición. No se crean servicios, motores ni controladores visuales nuevos.

Duración: base de 3600 s + una ampliación de 30 s = 3630 s (60:30), sin otros cambios. +30 s y +60 s agregan 90 s, por lo que la base dura 3690 s (61:30). Preparación extra consumida se registra aparte de trabajo y pausa manual; no acreditarla como ejercicio ni sumarla dos veces. Demostraciones/descansos programados siguen contando una sola vez en la base.

## Fuerza, lados y preparación

Una ventana por repeticiones requiere objetivo finito y pauta revisada. Visor: serie finita y después pose de descanso, sin reiniciar para llenar la ventana. UI: descansar cuando se alcance el objetivo. No cuenta repeticiones del usuario ni presume su ritmo. El sobrante permanece en la ventana; no acorta el descanso siguiente.

Cada ocurrencia unilateral tiene lado explícito; bilateral/alternado solo cuando la variante lo permite. Alternancia interna necesita marcas revisadas, sin duplicar duraciones por intuición. La vista previa anuncia lado del usuario y material. No espejar automáticamente según cámara frontal.

Durante descanso se presenta preparación del siguiente ejercicio, sin pedir confirmación en cada cambio. Autoinicio al terminar el descanso; Pause permite más tiempo. Si está encolado un extra, la vista previa muestra ese extra como siguiente. Las transiciones reales y cabida de material se revisarán; el contrato no demuestra suficiencia de los tiempos.

El autoinicio se conserva también después de añadir preparación; solo cambia el tiempo restante. Un ejercicio que requiera más preparación de manera habitual debe revisar sus transiciones; esta opción no justifica planificar tiempos insuficientes.

## Duraciones e invariantes

- baseConsumidaMs + baseOmitidaMs nunca supera duración base; contadores no negativos.
- extrasConsumidosMs no aumenta baseConsumidaMs; cada copia tiene nuevo occurrenceId y referencia de origen.
- Registrar extrasOmitidosMs y extrasCanceladosMs separados: extras añadidos = consumidos + omitidos + cancelados + restantes. Omitir un extra no marca omitida la ocurrencia base; el historial conserva ambas acciones. Ninguna omisión/cancelación se suma al tiempo reproducido.
- tiempoRegistradoMs suma reproducción base, extras de práctica, preparación extra consumida y pausas observadas, sin doble conteo. Sin omisiones/huecos: 60 min + pausa 5 min + extra 1 min = 66 min.
- Intervalo de calendario inicio-fin es informativo. Recarga/suspensión puede dejar huecos no medidos: mostrarlos separados, con estimación e incertidumbre si existe. No sumar navegador cerrado al trabajo ni presentar tiempo registrado como actividad física observada.
- Plan iniciado no cambia al actualizar catálogo; Restore requiere versiones/hashes fijados.
- Cursor de vista previa nunca consume tiempo ni dosis del trabajo. preparacionExtraAñadidaMs = consumida + cancelada + restante; no cuenta como extras de práctica ni como pausa manual. El tiempo con Pausar todo dentro de esa preparación se registra solo en pausas.
- Terminal es irreversible y emite una sola finalización; callbacks tardíos no reabren la sesión.
- Eventos permiten reconstruir consumo/omisión, no técnica, aprendizaje ni ejecución personal.

## Concurrencia y recuperación

Comando lleva commandId, sessionId, expectedControlRevision y expectedOccurrenceId cuando procede. Procesar secuencialmente. Mismo commandId devuelve resultado anterior; revisión/ocurrencia vieja se rechaza sin afectar al siguiente ejercicio. controlRevision cambia con comandos/fronteras, no cada frame.

Excepción intencional: Pause y Abort actúan sobre el estado vigente no terminal de esa sessionId aunque la revisión haya avanzado; nunca perder la petición de detenerse por una frontera. Son idempotentes y no alteran una sesión ya terminada. La guardia de ocurrencia protege omitir/repetir/cancelar, no bloquea una parada.

ExtendPreparation es una suma serializada sobre un objetivo válido: comandos distintos pueden acumular incrementos aunque se hayan emitido con la misma revisión de control, siempre que correspondan a la misma ocurrencia actual/próxima y a las condiciones descritas. El mismo commandId sigue siendo idempotente. Así dos toques deliberados suman tiempo, sin aplicarlo a otro ejercicio ni duplicarlo por un reintento de entrega.

Antes del comando muestrear avance confiable y resolver fronteras; si cambió la ocurrencia esperada, rechazar como obsoleto e informar del estado actual. Así dos clics no omiten dos ejercicios. Eventos/checkpoint se escriben atómicamente en 08, con IDs estables para reintentos.

Restore siempre pausado al último checkpoint confirmado, sin calcular trabajo desde Date.now. Asset fijado ausente bloquea recuperación; no sustituirlo. Reponer versión cuando esté autorizado o cerrar como interrumpida. Límites de guardado en [DOMAIN_MODEL](DOMAIN_MODEL.md).

## Casos de aceptación futuros

| Caso | Resultado esperado |
|---|---|
| Trabajo 40 s + descanso 20 s; Advance 40.000 ms | Rest con 20.000 restantes y una frontera |
| Mismo caso; Advance confiable 60.000 ms | Siguiente ocurrencia o completed sin perder intervalos |
| Descanso cero | Sin segmento rest vacío ni bucle infinito |
| Pause a 12.345 ms; esperar 300.000 ms; Resume | Cursor sigue 12.345; espera suma pausa observada |
| Base 3600 s + extra 40+20 + pausa 300 | 3600 base, 60 extras, 3960 registrados si no hay huecos |
| Omitir tras 10 s de trabajo 40+20 | 30 omitidos y descanso 20 intacto; resultado con omisiones |
| Repetir a mitad del descanso | Termina descanso, luego copia completa; siguiente base intacto |
| Dos omisiones sobre misma revisión/ocurrencia | Solo primera aplicable muta; segunda no afecta al siguiente |
| Pause/Abort llega justo después de una frontera | Detiene estado vigente de la misma sesión, sin rechazo por revisión vieja |
| Ocultar durante trabajo | Pausa automática y Resume explícito al volver |
| Gap visible >2000 ms | Último cursor confirmado; hueco sin trabajo |
| Inspector durante trabajo a 0,5× y cambio de cámara | Cero avance base; retorno al punto guardado |
| Quedan 20 s hasta trabajo; ExtendPreparation(30000) | Empieza en 50 s sin confirmar; trabajo íntegro y 30 s añadidos |
| Quedan 5 s; +30 s y luego +60 s sin avance intermedio | Empieza en 95 s; dos comandos distintos suman, mismo commandId no duplica |
| Preparación durante demostración programada | Consumir demostración una vez y extensión; autoinicio en work 0 |
| Advance cruza final de preparación adicional | Cerrar preview una vez y consumir solo el excedente confiable en trabajo |
| Ejemplo completa vueltas o se pausa la imagen | Cero repeticiones/trabajo registrados; cuenta y autoinicio siguen activos |
| Cuenta acaba a mitad del bucle | Cambiar al inicio del trabajo, sin mezclar cursores ni exigir otro toque |
| Pausar todo/ocultar/recargar durante preparación | Congelar cuenta e imagen; recuperación explícita conservando restante |
| Ampliar cuando se anuncia el final | Actualizar cuenta y avisos al nuevo vencimiento, sin audio atrasado |
| Cambia el próximo extra | Conservar segundos añadidos y actualizar objetivo/preview |
| Comando llega justo tras iniciar su objetivo | Pausa temporizada; reanudar automáticamente el cursor ya consumido |
| Recarga/fallo de guardado | Recuperación pausada según último checkpoint, con límites visibles |
| Evento después de completed/aborted | Sin doble finalización |

Son requisitos de pruebas 03–09, no tests ejecutados en 01. En 03 se probaron las reglas temporales y el adaptador; las filas que incluyen representación corporal, inspector, audio o recuperación durable requieren sus fases. La prueba con reloj inyectado no demuestra comportamiento real en todos los navegadores/dispositivos. Resuelven el diseño de S02, S03, S07–S09 y parte de S11.
