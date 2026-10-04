# Seguridad y privacidad

Ampliación 2026-10-04, propuesta pendiente de implementación: separar perfiles adulto/infantil y vincular explícitamente planes/sesiones/resultados/exportaciones. No asignar automáticamente registros legados al menor ni mezclar estadísticas. Responsable adulto administra el perfil infantil; datos mínimos, sin nombre completo, fotos o expediente obligatorios. No enviar medidas/observaciones personales a YouTube ni incluirlas en código/fixtures/documentación. Revisar idoneidad y requisitos del proveedor antes de habilitar medios de terceros para la ruta infantil. [Especificación](../product/THREE_OBJECTIVES.md).

- Nunca guardar secretos en el repositorio.
- No usar datos de salud reales en fixtures públicos.
- Crear datos sintéticos para pruebas.
- Sanitizar exportaciones.
- El usuario controla exportación y eliminación.
- Social y cloud serán opt-in.
- Toda integración futura debe definir permisos mínimos y revocación.
