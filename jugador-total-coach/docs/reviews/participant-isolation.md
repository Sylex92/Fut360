# Entrega técnica: perfiles e historial separados

2026-10-04. [Plan previo](../plans/participant-isolation.md), [cobertura de los tres objetivos](three-objective-coverage.md). Se añade al trabajo previo; no completa el producto ni sus planes personales.

## Implementado

- Crear/editar perfil adulto o infantil con alias, pie preferido, modalidades y capacidades elegidas. Administración infantil declarada por adulto; sin medidas, nombres ni datos privados precargados. Cambiar objetivos no recalcula dosis.
- Selección por pestaña conservada al recargar. Cambio de persona bloqueado durante un recorrido y mientras se guarda su resultado final. La prueba simula almacenamiento ocupado para verificar este último caso.
- Historial, recuperación, importación/exportación y borrado limitados al participante. IndexedDB v2 añade perfiles sin eliminar los registros v1. El historial anterior permanece sin asignar; asignación explícita y atómica únicamente a un perfil adulto, con eventos/fechas preservados.
- Respaldo completo de un perfil y sus sesiones; restauración sin sobrescritura silenciosa, rollback ante conflictos y eliminación limitada al perfil. Las escrituras desde pestañas obsoletas o perfiles eliminados se rechazan.
- Vista infantil separada: conserva objetivos y muestra que el plan está en preparación; no habilita las plantillas adultas ni medios de terceros como programa infantil aprobado.

Los perfiles no son autenticación ni cifrado. Los datos siguen por navegador/origen, con respaldo manual y sujetos a cuotas. No hay sincronización automática; se requiere la versión nueva para leer la base actualizada. No borrar el almacenamiento para resolver una copia offline antigua: aplicar la actualización de la app.

## Evidencia

[Resultados estructurados](evidence/participants/checks.json), [captura a 390 px](evidence/participants/profile-mobile.png), [prueba reproducible](../../tests/browser-participants.mjs). Datos sintéticos en contextos separados; no se cambió el historial real del usuario.

- 263 pruebas correctas, una opt-in omitida. Tipos, lint, formato y build correctos; persiste aviso de bundles mayores de 500 kB.
- IndexedDB real: actualización desde v1, tres perfiles separados, protección de identidad/revisión, asignación conservadora del legado, rechazo de asignación infantil, rollback completo de respaldo conflictivo, borrado por persona, rechazo de escritura tras eliminación y conservación de sesión pendiente al restaurar.
- Interfaz de producción: creación de ambos tipos, lateralidad conservada, recarga/recuperación pausada en el perfil adecuado, historial adulto ausente en el infantil, espera al guardado final, cero solicitudes al proveedor audiovisual y sin errores de página. Sin desbordamiento a 390 px; emulación no sustituye Samsung físico.
- Regresión de producción: biblioteca 52/20, preparación extra sin pausa, recuperación y recorrido de 30 minutos completado a ×60. Sin errores de página ni peticiones al proveedor antes de abrirlo.
- Borrado de una sesión recién terminada: conserva navegación disponible y no recrea el registro eliminado. El acuse del guardado final se conserva aunque se elimine después su entrada del historial.
- Offline de producción, tras preparar copia y bloquear red: recarga conserva perfil y las 52 fichas; los videos externos siguen fuera de caché. Preview LAN actual responde HTTP 200 desde PC y muestra perfiles en `192.168.68.101:4174`; no equivale a prueba física en Samsung.
- Revisión documental: 11 archivos, 238 enlaces locales sin destino ausente; `git diff --check` correcto.
- Se corrigió la comparación de registros normalizados: el orden de campos introducido al asignar el legado no debe generar un falso conflicto de restauración. Las pruebas de conflicto real siguen rechazando toda la operación.

El navegador integrado de Codex no respondió a la automatización; se utilizó Playwright independiente. No se ha comprobado esta entrega en Samsung físico ni TV. No se atribuye validación deportiva a estas pruebas.

## Reutilización, derechos y costo

Admisible para este incremento local: React/TypeScript, IndexedDB y motor existentes, sin paquetes, assets ni servicios nuevos. [Auditoría de dependencias previa](license-audit.md) y [política](../product/ZERO_COST_AND_GROWTH_POLICY.md) conservadas. No hay nuevos derechos de contenido que aprobar por crear perfiles ni cuentas, tarifas, claves, modelos o descargas añadidos. Importación/exportación son archivos locales; compartirlos queda a decisión del usuario.

El siguiente incremento debe preparar biblioteca/planes versionados y seguimiento sin confundir el selector de objetivos con personalización ya realizada. Los pendientes esenciales permanecen en la matriz de cobertura.
