# Fase 07 — sesión completa versionada

Fecha: 2026-10-01. Autorización: tras revisar el empuje contra pared, el usuario declara «listo ya se valido y si se entiende y se visualiza bien, adelante». Se registra su aceptación cualitativa y se continúa únicamente con `prompts/07-expand-hour.md`. No autoriza fases 08–09, instalaciones, pagos ni publicación.

## Plan verificable, previo al código

1. Cerrar la aceptación visual de 06 conservando `draft` y la distinción entre claridad, revisión documental y revisión profesional no realizada.
2. Crear un workout v2 independiente del fixture v1. Seis bloques de 480/720/600/960/480/360 segundos; 3600 exactos. Referencias resueltas a los dieciséis recursos/doce patrones existentes. Esquema y compilador con lados, rondas, dosis visual finita y tiempo de preparación/trabajo/descanso. No trasladar dosis del fixture antiguo.
3. Documentar la propuesta de dosis y secuencias. Series iniciales acotadas; tiempo sobrante como descanso. Preparación explícita para pared, colchoneta, suelo y regreso al balón. Combinaciones como intervalos separados, sin atribuir nuevos gestos o táctica al avatar. Mantener fundamento y fuentes fuera de la interfaz.
4. Reutilizar motor, política de visibilidad/reloj y escenas/clips. Precargar los recursos necesarios antes de iniciar; fallo de recurso detiene el reloj y muestra recuperación explícita. Ningún fallback oculto ni física libre en la sesión guiada.
5. Integrar visor, cámaras (incluido detalle de pies), indicaciones estables, bloque/lado/ronda/siguiente, timeline, cuenta atrás y señal final silenciable. Conservar pausa, inspección cercana al botón, +30 s/+1 min con autoinicio, repetir, omitir y terminar. Evitar pérdida de sesión al cambiar de vista.
6. Modo acelerado explícito para pruebas, separado del modo real; no confundir avance lógico con duración real. Verificar contratos, compilación, cobertura, controles, errores y recorrido de navegador a ancho móvil. Ejecutar también una hora con reloj real y documentar su alcance y cualquier interrupción sin acreditar tiempo ausente.
7. Ejecutar pruebas, lint, tipos, formato y build; registrar evidencia, cobertura y pendientes reales. Actualizar estado y detenerse antes de 08.

## Costos y reutilización

No dependencias, descargas, servicios ni recursos nuevos. React/Three/Fiber, rig y GLB existentes; Web Audio nativo para aviso local tras gesto del usuario. Mantener licencias auditadas y `ASSET_LICENSES.md`; no modifica sus términos. Creación específica: definición/compilador del nuevo programa y composición de UI. Remotion/exportación/persistencia/IA quedan fuera.

## Límites y criterios de aceptación

- La aceptación del usuario verifica comprensión reportada; no otorga `coaching-reviewed`, adecuación individual ni eficacia deportiva.
- Doce patrones requieren dieciséis variantes actuales. Cualquier referencia o variante ausente bloquea inicio y se declara; no rellenar con otro gesto.
- Los clips finitos se reproducen en cantidades explícitas; las vistas previas tienen separación. Respiración cómoda sin apneas ni cadencia respiratoria obligatoria. La animación muestra ejemplos, no detecta repeticiones del usuario.
- 3600 s programados incluyen explicación y recuperación. Extras/pausas alargan; omisiones acortan. Ningún contador equivale a actividad física medida.
- Prueba del agente a ancho móvil no sustituye la aceptación física del Samsung del nuevo flujo.
