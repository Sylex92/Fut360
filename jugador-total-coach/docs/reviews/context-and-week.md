# Entrega de contexto y semana por perfil

2026-10-04. Incremento del [plan previo](../plans/context-and-week.md). No cierra los tres objetivos ni amplía la biblioteca audiovisual.

## Implementado

En Mi plan, cada perfil puede guardar disponibilidad diaria, personas, lugares y recursos confirmados. Agenda de semana tipo con días sin asignar, descanso, actividad externa y propuestas existentes. Cuenta también lo que ocurre fuera de la app, muestra exceso sobre disponibilidad y conserva cada versión al guardar otra. No llena siete días automáticamente ni acredita cumplimiento.

Las cinco propuestas se contrastan con personas, lugar y recursos. Una propuesta con compañeros puede estudiarse, pero no iniciarse desde esa selección si contradice el contexto guardado. Una pared para apoyarse no se presume apta para pases. La comprobación es logística: no valida la dificultad, dosis o preparación individual. Perfiles sin contexto conservan el comportamiento anterior y no tienen una evaluación de compatibilidad acreditada.

El perfil infantil solo organiza actividad externa/descanso en esta entrega. No recibe plantillas adultas. Esta agenda no hace que exista ya una rutina infantil enseñada.

## Conservación de datos

- Participant incorpora contexto y versiones; editar alias conserva ambos. Guardar disponibilidad no borra la semana que se está editando.
- IndexedDB v3 conserva los almacenes y registros de v1/v2; impide a clientes antiguos abrir en v2 para sobrescribir perfiles omitiendo los nuevos campos.
- Respaldos completos con agenda usan formato 2. Se siguen aceptando respaldos anteriores sin agenda. Importación, restauración y eliminación conservan aislamiento y transacciones existentes. Una copia diferente no sobrescribe automáticamente otra.
- Las versiones semanales guardadas no pueden quitarse o reescribirse mediante una edición de perfil. Eliminar el perfil sigue siendo la eliminación explícita de sus datos. Límite: 104 versiones, sin descartar las antiguas en silencio.
- Firma del contenido adoptado por día; si cambia el catálogo, el editor pide volver a seleccionarlo/revisarlo antes de guardar otra versión. No ejecuta un contenido antiguo como si fuera el actual.

Si una copia offline anterior no puede abrir la base después de actualizarla, cargar/aplicar la versión nueva. No limpiar almacenamiento para resolverlo: conservar perfiles/historial. Solo los respaldos completos incluyen agenda; los respaldos de sesiones mantienen su alcance anterior.

## Pruebas ejecutadas

269 pruebas correctas, una opt-in omitida; tipos, lint y build correctos. Sin dependencia nueva. El build mantiene avisos de chunks mayores de 500 kB.

En navegador separado con datos sintéticos: migración v2, rechazo de cliente antiguo, conflicto de edición, semanas anteriores inmutables, respaldo/restauración idempotente y aislamiento entre personas. Regresión de perfiles desde v1 preserva journal y recuperación pausada, selección bloqueada durante actividad y espera del guardado final.

Interfaz compilada: contexto individual, bloqueo de propuesta con compañeros, propuesta doméstica compatible, exceso de disponibilidad, versiones, edición del alias, recarga y perfil infantil limitado a actividad externa. A 390 px no hay desbordamiento; campos numéricos con objetivo táctil de 44 px. Preparar caché, desconectar red y recargar conserva la agenda. Cero errores de página; regresión de perfiles sin peticiones de video. [Resultados](evidence/planning/checks.json), [vista móvil sintética](evidence/planning/week-mobile.png). Build `index-CV-lK-He.js`.

## Pendiente y alcance exacto

Un bloque por día, semana tipo sin fechas, sin edición de ejercicios/dosis propia, sin enlace automático entre cumplimiento de calendario y sesión. Para varias actividades externas se puede describir su total. Los planes individuales adultos/infantiles, biblioteca suficiente, progresión y métricas siguen abiertos. No confundir este calendario manual con el entrenador conversacional solicitado.

No se probaron este incremento en Samsung físico ni Sony. [Sony A80J](sony-a80j-compatibility.md): plataforma/Cast verificados documentalmente; prueba de visualización y manejo con mando pendientes. [Fundamento interno](../training/CONTEXT_AND_LOAD_DECISIONS.md): carga existente y disponibilidad consideradas sin guardar respuestas privadas en Git. La aclaración de disponibilidad infantil se recibió en el [incremento siguiente](personal-programs-and-visual-coverage.md); no repetirla.
