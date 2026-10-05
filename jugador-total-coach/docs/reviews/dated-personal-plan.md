# Calendario personal, revisión y demostraciones automáticas

2026-10-05. [Plan previo al código](../plans/dated-personal-plan.md). Continuación autorizada; horarios y contexto recibidos en conversación, sin datos reales en Git. Este informe cierra el incremento técnico del calendario y seguimiento, **no declara completos los tres objetivos ni todas las demostraciones**.

## Entregado

- Calendario por fecha y persona: lunes de inicio elegido, semanas, etapa, actividades existentes, descanso y propuestas. Adulto empieza con dos semanas revisables; infancia organiza ocho. Se admiten hasta 24 semanas adultas como horizonte, sin aumentar dosis por fecha.
- Versiones y anotaciones conservadas: cambios añaden una versión, no borran planes anteriores. Resultados diarios realizados/parciales/omitidos, minutos declarados y notas independientes de los minutos reproducidos.
- Observaciones por tarea, lado, intentos, aciertos y condiciones. Solo compara días distintos de la misma tarea/lado/condiciones declaradas. No infiere habilidad por asistencia ni acredita nivel profesional.
- Plan infantil: cuatro complementos disponibles, tres de 15 minutos y uno doméstico de 10. Rotación de conducción/gol, recepción/pase, protección/defensa cooperativa y recepción/pase; se repite en las semanas siguientes con objetivos de revisión. La nueva propuesta `youth-protect-15` reutiliza Y05/Y06/Y08, preparación Y12 y cierre Y13. Dos o tres intentos controlados por ronda, descansos amplios, sin oposición física adulta. No suma otra sesión al calendario.
- Fragmento de URL local para recibir propuestas preparadas, elegir el perfil correspondiente y revisar antes de guardar. Tras guardar se retira el fragmento. No se guardaron horarios reales en archivos, fixtures, capturas ni pruebas. El fragmento puede quedar en historial del navegador antes del guardado: no compartir el enlace privado. No se presupone que abrir una propuesta la haya guardado en el perfil real.
- Base IndexedDB 4, con conservación de perfiles/historial anteriores y bloqueo de clientes antiguos. Respaldo completo formato 3 cuando incluye plan; sigue leyendo formatos 1 y 2. Comparación atómica y protección contra borrar versiones/resultados mediante una pestaña desactualizada.
- Videos automáticos adultos: una activación por recorrido, original por fragmento y bucle, reloj en pausa mientras carga. La pausa manual prevalece. Volver visible retoma solo las causas automáticas compatibles; fallos requieren intervención. Desactivar videos no fuerza reanudación. Infancia mantiene su bloqueo de YouTube.

La propuesta personalizada se entrega por un enlace local de revisión, no mediante una escritura no observada al almacenamiento real del usuario. Computadora y teléfono mantienen bases distintas; usar respaldo completo para trasladar el perfil.

## Evidencia técnica

[Resultados](evidence/calendar/checks.json) y [captura sintética a 390 px](evidence/calendar/mobile-calendar.png). Ninguna captura contiene un horario o perfil real.

- 282 pruebas correctas y una opt-in omitida; tipos, lint, formato y build comprobados. Conserva el aviso de bundles de más de 500 kB; no es un error nuevo ni evidencia de rendimiento en TV.
- Navegador independiente: migración desde v3 sintética, cliente v3 rechazado, CAS, preservación de versiones/resultados, aislamiento, respaldo 3 y restauración idempotente.
- Interfaz: propuesta revisable, retirada del fragmento, fechas, rotación, apertura de la nueva sesión de protección, resultados, comparación homogénea y persistencia tras recarga. 390 px sin desbordamiento, cero errores de página y cero solicitudes a terceros en este flujo.
- Guardar el calendario sincroniza el contexto revisado con disponibilidad/requisitos, preservando todas las semanas anteriores; evita que un contexto viejo bloquee las sesiones del nuevo plan. Formulario de disponibilidad comprobado tras guardar.
- Encadenado real: después de M03 se abrió M05 (7mlc, 252–290 s) y comenzó sin una nueva activación. Regresión de adulto/infancia, recuperación, finalización y +30 s correcta.
- Proveedor simulado: carga, pausa manual, video cargado pero pausado, mantenimiento explícito de pausa durante carga y fallo de recurso. Estas pruebas **no** se usan como evidencia de reproducción real.
- YouTube real: M03, 7mlc `e5RxAJM-oxc`, tramo 157–195 s, inició automáticamente dentro del reproductor. Pausar detuvo el reloj y el video; Continuar volvió a reproducir, sin errores de página. Se corrigió un bloqueo de Continuar descubierto aquí: un video cargado en pausa no es un recurso indisponible. La publicidad/bloqueos del proveedor siguen siendo posibles.
- IAB no accesible desde el backend de automatización en esta ejecución. Se usó un navegador independiente con contextos desechables. No atribuir estas pruebas a perfiles reales, Samsung físico ni Sony A80J.

## Fuentes y derechos revisados

El [fundamento de dosis](../training/PROGRAM_DOSE_RATIONALE.md) y las [reglas de revisión](../training/CALENDAR_REVIEW_RULES.md) permanecen en documentación interna. No se exige contratar una revisión externa para continuar construyendo; la revisión documental no se presenta como valoración clínica o profesional individual.

Se añade F01 → [NHS, video de sentadilla](https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/), sección «squat», orientación 0:08–0:42. Reproductor oficial con duración observada 45,52 s; muestras a 5/12/20/30/35/40 s. Se ve flexión/extensión con ambos pies apoyados, vistas frontal y lateral, sin sentarse en el banco. Muestreo visual, no todos los fotogramas ni examen biomecánico. No se adopta como regla universal que la rodilla no pueda adelantar la punta del pie. La referencia no prescribe nuestra dosis.

Los [términos NHS §3.5](https://www.nhs.uk/our-policies/terms-and-conditions/) excluyen de la licencia general, entre otras categorías, videos con personas identificables. Se enlaza la página; no se descarga, recorta, redistribuye ni copia el archivo. Sin hash audiovisual porque no se incorpora un medio. No se atribuye aval NHS al producto.

Se intentó inspeccionar [Vimeo, 7 Soccer Drills for Kids](https://vimeo.com/1003031076): apareció verificación humana. No se sorteó ni se incorporó como material visto. Investigar un proveedor alternativo no habilita por sí solo uso infantil compatible.

La automatización usa la [API oficial de YouTube](https://developers.google.com/youtube/iframe_api_reference); no elimina controles, atribución ni publicidad. El [requisito de designación infantil](https://support.google.com/youtube/answer/171780?hl=en) sigue pendiente para la instalación local. No se inventó un parámetro de iframe ni se confundió permiso del tutor con esa designación.

## Cobertura y límites que permanecen

69 fichas, 15 con referencia del gesto incrustada y siete de componente; 47 sin video incrustado. Entre esas 47 hay una demostración externa NHS y siete referencias parciales FIFA; 39 no tienen ninguna de estas referencias de video. Son ocho originales YouTube, dos FIFA y uno NHS, sin archivos de terceros incorporados. [Inventario actualizado](../training/COACHING_LIBRARY_INVENTORY.md).

La enseñanza de cada tarea de ambos planes **sigue incompleta**: los ejemplos parciales y esquemas no sustituyen demostraciones humanas claras. Faltan especialmente las variantes infantiles completas, tareas individuales de cancha y control del tronco. La técnica básica y las decisiones cooperativas tampoco acreditan oposición real, velocidad máxima o rendimiento de partido. El calendario tiene un bloque principal diario; no se añadieron dobles sesiones por disponibilidad.

El plan fechado y las observaciones ya existen; la evaluación de competencia real y adaptación automática aún no. Conversación dentro de la app, verificación física Samsung/TV y operación con mando siguen en [la matriz acumulada](three-objective-coverage.md). No desplazar esos requisitos a extras para declarar entrega final.

## Costo y reutilización

Sin dependencias, instaladores, modelos, cuentas, servicios de pago ni configuración global nuevos. Se reutilizaron motor, compilador, catálogo, reproductor y transacciones locales. Metadatos/enlaces gratuitos no garantizan disponibilidad futura, ausencia de anuncios, uso comercial ni modo offline del video. Una futura distribución, proveedor infantil o autorización de medios requiere revisar condiciones concretas; no se activa ningún pago.
