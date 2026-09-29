# Fase 03 — plan de implementación y verificación

Autorizada mediante «de acuerdo» en respuesta al alcance completo del motor con herramientas ya instaladas. La fase 02 queda aceptada como base para continuar; se conservan sus límites de evidencia. Solo 03: sin avatar, Blender, nuevas dependencias externas, descargas, servicios, persistencia durable ni exportación.

## Resultado y pasos

1. Añadir al dominio los contratos mínimos de ejecución: plan/ocurrencias/segmentos, comandos, eventos, contadores y proyección. No implementar todavía todos los contratos de contenido/recursos de fase 01.
2. Compilar el fixture v1 sin modificarlo ni aprobarlo deportivamente. Convertir segundos a milisegundos una vez y fijar un snapshot inmutable. Limitar la expansión a 10000 ocurrencias y enteros seguros para evitar trabajo/memoria desmedidos; límite de ingeniería, no deportivo.
3. Crear session-engine puro, dependiente solo de domain. Estado encapsulado, entrada temporal explícita y eventos ordenados; sin reloj global, React, red ni almacenamiento. Copiar el plan al prepararlo para que cambios externos no lo alteren. Usar identidad de plan/versionado y snapshot completo; los hashes de archivos/recursos y recuperación durable se incorporarán con esas funciones, sin fingir SHA ni guardado.
4. Implementar preparación lógica, comienzo, avance confiable, pausa/reanudación, interrupciones, omisión, repetición/cancelación y preparación adicional. Conservar contadores de base, extras, omisiones, cancelaciones, preparación, pausa observada y huecos. Probar invariantes de conservación y eventos terminales únicos.
5. Adaptador con reloj inyectado: muestras monotónicas enteras, umbral de hueco >2000 ms, pausa al ocultar y reanudación explícita. Guardias de sesión/revisión/ocurrencia; Pause/Abort no se pierden por fronteras, extensiones válidas acumulan y commandId repetido no duplica. El adaptador muestrea antes de ejecutar un comando.
6. Vista de prueba en texto conectada al motor: caso técnico corto de un minuto y archivo histórico de una hora, claramente identificados como pruebas. Inicio, pausa, continuar, terminar, omitir, repetir/cancelar y +30 s/+1 min según capacidad. Mostrar preparación/siguiente/tiempos y últimos cinco segundos. Sin demostración corporal, conteo físico, recomendación de dosis ni botón «Estoy listo». Recargar pierde esta prueba en memoria: declararlo, no fingir recuperación de 08.
7. Verificar con Vitest ya instalado: fronteras exactas y avances grandes, descanso cero, rechazo de datos/overflow, pausas y huecos, visibilidad, duplicados y comandos obsoletos, preparación/autoinicio tardío y cambio de objetivo por repetición/cancelación, conservación de la hora, eventos y terminales. Probar el adaptador con reloj inyectado y el HTML de la vista. Ejecutar formato, lint, tipos, pruebas y build. Intentar inspección de navegador con herramientas existentes; declarar cualquier limitación real.
8. Actualizar documentación/estado, servir la nueva compilación y crear un punto de control local de alcance 03. Detenerse antes de 04.

## Decisiones verificables

- Mantener ready como disponibilidad técnica previa a Start; nunca usarlo como espera de confirmación al terminar preparación.
- En descanso, la preparación apunta al próximo ejercicio o extra encolado. Al encolar/cancelar un extra se transfieren los segundos de preparación pendientes al nuevo objetivo; si no queda objetivo, se cancelan y contabilizan.
- ExtendPreparation recibido sobre el mismo trabajo que acaba de comenzar guarda su cursor y lo retoma automáticamente; un objetivo antiguo se rechaza. No se reinicia ni se omite trabajo.
- Repetir copia demostración/trabajo/descanso, con identidad nueva, después del descanso actual. Omitir cancela su repetición pendiente y conserva descanso. Terminal cancela extras pendientes; nunca acredita lo no reproducido.
- La aplicación dispone de recursos para esta prueba de texto, no de assets aprobados para entrenar. Inspector 3D, cámaras, audio, checkpoints/Restore durable y concurrencia entre pestañas pertenecen a sus fases.

## Resultado — 2026-09-28

Revisión de cierre con captura: conservar el original, registrar Tab/ancho/consola según reporte y la imagen según inspección directa. Antes de cerrar, corregir la presentación detectada en la captura: el tiempo registrado se redondeaba hacia arriba igual que el restante (59:57 + 00:04). Mostrar acumulados con segundos completos (floor) y cuentas restantes con ceil; conservar los milisegundos del motor. Añadir una regresión a 3200 ms, ejecutar formato/lint/tipos/pruebas/build y actualizar la evidencia, distinguiendo captura anterior y corrección posterior. No pedir repetir el recorrido general por este cambio de formato. Guardar punto de control local; no ejecutar 04.

Plan escrito antes de código. Implementados contratos, compilador, motor, adaptador y vista de texto. Sin dependencias externas nuevas: solo enlaces internos, cero descargas. 85 pruebas, formato, lint, tipos y build correctos tras la corrección del redondeo; fixture/esquema intactos y dependencias externas del lockfile sin cambios. Servidor local existente utilizado para preview.

[Informe y cobertura](../reviews/phase03-session-engine-review.md). Cierre técnico de 03: reporte manual favorable de avance/botones/consola/Tab/ancho y captura nueva conservada e inspeccionada. La captura es anterior a la corrección menor del formato temporal; esta cuenta con regresión automática. El conector IAB sigue indisponible; no se afirma E2E automatizado ni accesibilidad integral. Persistencia/inspector/3D siguen fuera de esta implementación. Detención antes de 04.
