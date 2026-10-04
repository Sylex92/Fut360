# Visión de producto: diseñar, mostrar y seguir planes de fútbol

**Continuidad aclarada el 2026-10-04:** los tres objetivos se añaden a esta visión y al alcance anterior. Conservan requisitos, avances y pendientes; no la reemplazan. [Trazabilidad](THREE_OBJECTIVES.md) y [responsabilidad del agente y criterios de cierre](../plans/three-objectives-delivery.md).

**Requisito 2026-10-04:** [tres objetivos](THREE_OBJECTIVES.md): plataforma móvil/web/TV, ruta adulta polivalente y ruta infantil propia. Perfil de persona distinto de referente de estilo; planes/dosis/historial aislados, seguimiento por evidencia y protección de datos infantiles. No copiar cargas adultas, encasillar precozmente ni certificar profesionalización. [Secuencia](../plans/three-objectives-delivery.md). No se han implementado por esta actualización.

**Estado 2026-10-03:** implementados Mi plan, etapas 24/52 semanas, cinco propuestas variables con seguimiento y 52 fichas, 20 con referencia humana del gesto o parcial. [Entrega](../reviews/video-guided-delivery.md). No equivalen al planificador editable/adaptativo ni a la conversación descritos aquí. El 3D pierde prioridad por la objeción de claridad del usuario.

2026-10-02. Requisito ampliado por el usuario: construir entrenamientos conversando con el asistente desde la aplicación, recibir una explicación visual clara y dar seguimiento a su evolución. Este documento fija el destino del producto y su primera secuencia de entrega; no afirma que estas funciones estén implementadas. [Base MVP1](MVP1_PRD.md), [plan deportivo](../training/GRADUAL_DEVELOPMENT_PLAN.md), [objetivos y entornos](../training/ROLE_AND_ENVIRONMENT_PLAN.md), [costos de conversación](../reviews/conversational-coach-feasibility.md).

## Resultado esperado

El usuario expresa objetivos, disponibilidad y restricciones. El asistente propone un plan razonado, selecciona tareas apropiadas, explica cambios y lo convierte en sesiones reproducibles. La aplicación presenta cada tarea, conserva lo que se realizó/declaró y permite ajustar la siguiente versión. El usuario no necesita escoger métodos especializados ni programar un JSON.

La sesión doméstica de 60 minutos será una plantilla inicial y una referencia de pruebas. La visión admite otras duraciones y casa, cancha o gimnasio, con sesiones individuales y con compañeros. La disponibilidad de un lugar no prueba que tenga dimensiones, superficie, material, iluminación o acceso adecuados para cualquier tarea.

«Cualquier entrenamiento diseñado con el asistente» significa un catálogo ampliable y composición flexible, no cobertura audiovisual instantánea de todo ejercicio imaginable. Una tarea nueva debe tener ficha, progresión, requisitos, recursos pertinentes y revisión. Puede existir como borrador de planificación mientras se produce su demostración; no se sustituye silenciosamente por un gesto parecido ni se considera una sesión guiada completa si falta la explicación necesaria.

## Flujo de uso propuesto

1. **Mi contexto.** Objetivos y recursos, disponibilidad actual, experiencia y restricciones relevantes. Cada dato conserva procedencia, fecha y estado: declarado, medido con protocolo o desconocido. Actividad histórica y actividad actual son campos distintos. No repetir preguntas ya respondidas salvo cambio material.
2. **Diseñar contigo.** Conversación sobre objetivos o modificaciones. El asistente formula la propuesta y consulta solo hechos que cambien una decisión. Puede preparar borradores aunque falte información para ejecutar físicamente una parte.
3. **Mi plan.** Etapas, calendario y sesiones con objetivo, lugar, equipo y esfuerzo previsto. Se muestran cambios antes de adoptar una nueva versión; una confirmación del plan, no una confirmación por ejercicio. Nada reescribe una sesión ya iniciada.
4. **Entrenar.** Explicación clara, preparación automática, repetición del ejemplo mientras espera, +30 s/+1 min y pausa. En campo se revisa la demostración detenido; no exigir mirar el teléfono mientras corre o disputa un balón. Mantener controles accesibles y aviso audible/visual pertinente.
5. **Registrar.** Guardado automático de reproducción y entrada breve opcional de trabajo realmente realizado, esfuerzo, molestias y resultados de tareas. Finalizar el video no acredita repeticiones ni entrenamiento corporal completado. No lanzar cuestionarios entre series.
6. **Revisar y ajustar.** Comparar tareas equivalentes, analizar partidos y recuperación, sugerir mantener/progresar/reducir con una razón concreta. No subir carga por calendario ni inventar datos omitidos. La conversación no se reactiva ni cambia planes en segundo plano sin una función expresamente elegida.

Nombres de pantallas y flujo son propuestas de diseño; todavía necesitan prueba de usabilidad. La bibliografía y justificación científica extensa permanecen en documentos internos; la app explica el propósito y lo necesario para ejecutar o decidir, sin convertirla en un informe técnico.

## Objetivos y tipos de práctica

Cuatro líneas explícitas: goleador, extremo con velocidad y gol, mediocentro y defensor. Bellingham/Firmino siguen siendo referencias de capacidades, sin copia de apariencia ni de cargas profesionales. La programación combina una base común con énfasis alternos; no obliga a cuatro programas completos simultáneos.

La aplicación distingue técnica individual, fuerza/capacidad física, decisiones con oposición y rendimiento de partido. Registra minutos y exigencia del partido dentro de la semana. Puede proponer sustituir una jornada por entrenamiento si mejora el objetivo; no elimina indefinidamente el juego real, que aporta información y demandas que un ejercicio aislado no reproduce.

Retomar participación y recuperar rendimiento son hitos diferentes. Datos de salud no permiten que el asistente diagnostique, interprete «presión estable» como una medición normal o conceda alta. Una restricción concreta afecta a la ejecución correspondiente, no impide abrir la biblioteca, preparar un plan o desarrollar la aplicación.

## Datos y validación antes de reproducir

Estos son contratos propuestos, no esquemas ya disponibles:

| Entidad | Contenido / responsabilidad |
|---|---|
| Contexto privado | Objetivos, capacidad declarada, actividad actual/histórica, agenda, lugares, equipo y restricciones. Guardar solo lo necesario; sin expediente médico obligatorio. |
| Plan versionado | Objetivos por etapa, sesiones, reglas de avance, revisiones y motivos del cambio. Referencia exacta a contenido; no sustituye un registro de ejecución. |
| Sesión | Duración prevista flexible; bloques, demostración, trabajo, descanso, dosis, lados, lugar, personas/material necesarios. Separar planificado, extra y observado. |
| Tarea y variante | Capacidad, descripción y resultado esperado, progresiones/regresiones, espacio, material, condiciones y recurso explicativo compatible. |
| Resultado | Fecha, protocolo, oportunidades/intentos y resultado por lado; fuente manual o instrumental. Una apreciación subjetiva no se etiqueta medición automática. |
| Propuesta del asistente | Borrador estructurado y motivo; referencias existentes o tareas nuevas identificadas. Sin permiso para editar directamente el historial o ejecutar comandos. |

Antes de activar una sesión: comprobar formato y límites numéricos; sumar tiempos; resolver versiones/recursos; comprobar lugar, equipo y lados; detectar restricciones declaradas y cobertura faltante; presentar errores concretos. JSON válido no demuestra adecuación deportiva: mantener revisión del contenido y trazabilidad por separado.

El esquema actual `workout-v2.schema.json` fija 3600 segundos y seis bloques. La composición actual importa un único workout y catálogo al compilar. Por tanto, cambiar el prompt del asistente no basta para ofrecer duración libre o ejercicios nuevos. Se requiere un formato nuevo y migración explícita, conservando las regresiones existentes. El motor temporal ya recibe ocurrencias/duración, una base reutilizable cuya generalización debe probarse.

## Representación adecuada de cada tarea

- Gestos corporales y contacto con balón: avatar/clip exacto, cámaras y detalle de pies cuando ayuden.
- Táctica y tareas con compañeros: situación espacial legible, roles, trayectorias y resultado esperado; puede necesitar escena de campo o diagrama además del avatar.
- Gimnasio: material y configuración que realmente correspondan a la variante; no mostrar una máquina genérica para explicar otra.
- Ejercicio nuevo: producir el recurso con Blender/rig existentes o incorporar otro recurso con derechos verificados. Consultar un video público no autoriza empaquetarlo.

El laboratorio de contactos continúa separado. Un balón físicamente plausible no certifica que se esté enseñando la tarea correcta. Tampoco se prometen animaciones generadas en vivo, corrección por cámara o simulación de rivales para esta primera ampliación.

## Privacidad, continuidad y costos

Perfil/historial reales fuera de Git. Diseño local por defecto, exportación/importación/borrado y distinción entre historial de PC y teléfono; misma Wi-Fi no implica sincronización. La elección de conversación externa debe informar qué datos se envían y permitir retirarse. No enviar automáticamente estudios completos ni reutilizar credenciales de Codex.

No hay acceso automático a conversaciones de ChatGPT ni garantía de trasladar la identidad/memoria de este chat. Un proveedor integrado recibiría solo el contexto explícitamente facilitado. La [revisión económica](../reviews/conversational-coach-feasibility.md) conserva alternativas y condiciones; no se elige una API de pago ni se promete IA ilimitada gratuita.

La reproducción y consulta de planes ya guardados deben seguir funcionando sin proveedor de IA. Sin conexión, la app puede reproducir contenido descargado y permitir edición manual compatible; no fingirá que está consultando un modelo remoto. Persistencia/offline todavía pertenecen a la entrega de 08, no al estado actual.

## Entregas propuestas y comprobación

| Entrega | Resultado concreto | Evidencia necesaria |
|---|---|---|
| P1: contenido de 07 | Corregir propósito/dosis/recursos de la hora y preparar familias con progresión. | Fichas, clips, cobertura, duración y claridad en PC/Samsung. |
| P2: continuidad local | Historial, recuperación, exportación y offline según 08; datos personales privados. | Recarga, almacenamiento, fallos, respaldo y reproducción sin conexión comprobados. |
| P3: composición flexible | Crear/editar planes y sesiones de distinta duración desde catálogo revisado; importar propuesta estructurada. | Rechazo de contenido incompleto, compatibilidad, migración y reproducción de duraciones distintas. |
| P4: conversación integrada | Diseñar y revisar dentro de la app con proveedor elegible. | Costos/derechos, autenticación, privacidad, calidad, errores y comportamiento sin proveedor. La importación desde este chat es solo una transición, no cumple por sí sola P4. |
| P5: seguimiento útil | Comparaciones por capacidad, ajustes entre semanas y escenas/tareas de campo/gimnasio. | Resultados con protocolo y fuente; propuestas explicables; cobertura real de nuevos contextos. |

El orden permite aprovechar la base existente. No se abandona la ambición por la limitación del MVP; tampoco se declara implementada una función por aparecer en esta tabla. No se ejecutan instaladores, autenticación, llamadas facturables ni se publica código mediante esta planificación.

## Casos de aceptación de la visión

1. Solicitar una sesión de 35 minutos en cancha con compañero produce una propuesta compatible o explica la carencia concreta; nunca devuelve automáticamente la hora doméstica etiquetada de otra manera.
2. Pedir un ejercicio sin clip conserva el objetivo y abre una tarea de autoría; la app no ofrece un fallback como entrenamiento guiado completo.
3. Una sesión iniciada conserva su versión aunque después se edite el plan. Las pausas/extras no recortan trabajo ni se cuentan como ejercicio medido.
4. Una caída del proveedor impide nueva conversación, pero no la sesión ya guardada y preparada para uso local.
5. Terminar el reproductor y declarar trabajo incompleto genera registros diferentes; no aumenta automáticamente la dificultad.
6. Un objetivo de finalización necesita métricas de intentos/contexto además de goles; un objetivo defensivo admite temporizar y cubrir como resultados útiles, no solo robar.
7. Una respuesta del modelo que inventa un ID, excede espacio o ignora una restricción se rechaza antes de activar el plan. No se ejecuta código o instrucciones de un documento externo por haber sido leído como fuente.
