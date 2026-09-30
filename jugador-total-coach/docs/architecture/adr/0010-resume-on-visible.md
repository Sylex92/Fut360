# ADR 0010 — Retomar al volver a la ventana

Fecha: 2026-09-29. Decisión solicitada y autorizada por el usuario durante 04. Sustituye únicamente la exigencia de continuación manual tras ocultación de [ADR 0009](0009-session-time-and-recovery.md); conserva recuperación explícita tras fallos, pausa manual y recarga.

## Problema y evidencia

El usuario desea minimizar sin perder el punto y volver sin otro toque. Informa una pausa después de +30 s, pero no recuerda si minimizó: la causa de ese incidente queda pendiente. La implementación anterior pausaba al ocultar y exigía continuar incluso al regresar correctamente.

[MDN, Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), consultado el 2026-09-29, describe la detección de ocultación/minimización y un ejemplo de reproducción que se retoma solo si estaba activa antes. Perder foco no demuestra ocultación. El estado comunicado por el navegador es la señal; no se promete detectar atención del usuario ni toda forma de cubrir una ventana.

## Decisión

- Al pasar de visible a oculto, congelar programa, preparación y avatar. Recordar si la sesión estaba corriendo y sus recursos/reloj estaban disponibles.
- Al volver a visible, reanudar desde el punto guardado únicamente si la pausa sigue siendo exclusivamente por ocultación. Emitir el comando Resume habitual una vez, sin segundo reloj, confirmación, reinicio ni consumo del tiempo oculto.
- Una pausa manual previa o posterior, inspección manual, fallo de recurso/reloj, terminación o estado sin iniciar no habilitan esta reanudación. Un recurso que falló mientras estaba oculto exige continuar explícitamente después de recuperarlo.
- Conservar el motivo de una pausa previa cuando se oculta; el tiempo no observado se registra por separado. Un salto visible superior a 2000 ms continúa siendo interrupción del reloj y exige continuar; no atribuir cualquier salto a minimización.
- La vista previa anterior a iniciar puede volver a mostrarse según su estado de reproducción; nunca iniciar por ello una sesión. La inspección manual permanece pausada al regresar.
- La política vive en el adaptador de navegador. El dominio conserva Resume con precondiciones y no conoce document, ventanas ni Page Visibility.

## Consecuencias y verificación

Se elimina un toque al regresar y se mantiene la intención de Pausar todo. No se añade cuenta de preparación ni duración artificial al retorno. El usuario puede usar la pausa manual si desea que volver a la ventana no reactive la secuencia.

Verificar tiempos/poses conservados, extras/autoinicio, eventos duplicados, pausas manuales e inspección, fallos durante ocultación y estados terminales. Reloj inyectado demuestra la política, no la entrega real del evento en cada navegador. Medición de dispositivos y comprobación visual posterior continúan pendientes. Sin cambios de avatar, instalaciones, servicios, costo o alcance de fase.
