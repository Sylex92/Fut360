# Entrega: referencias humanas y plan dentro de Fut360

2026-10-03. Petición: corregir la enseñanza insuficiente del 3D, mostrar el video original dentro de su rango y llevar el plan al producto. [Plan previo](../plans/video-guided-plan.md), [ADR 0016](../architecture/adr/0016-human-reference-and-visible-plan.md).

## Qué cambió
Mi plan es la entrada: etapas del ciclo 24/52 semanas, criterios observables y cinco propuestas: control 30 min, mediocentro 45, extremo/gol 50, defensa/transiciones 45 y fuerza 40. Cada bloque explica dosis, organización y tiempos y abre su ficha. Se puede recorrer la propuesta, añadir preparación, pausar, omitir, terminar, guardar y recuperar. Se reutiliza el motor existente; no hay segundo reloj de entrenamiento.

Biblioteca: 52 fichas de 32 familias, con instrucciones propias, objetivo, material, personas, organización, errores, regresión/progresión y modalidades. Diez esquemas originales para organización colectiva. [Inventario completo de lo registrado](../training/COACHING_LIBRARY_INVENTORY.md), no inventario exhaustivo de todos los ejercicios de internet.

Hay 20 fichas con referencia: 13 del gesto y siete de un componente. Provienen de seis videos de cinco fuentes; no son 20 videos originales ni 52 demostraciones completas. Las otras 32 muestran pendiente. El video original aparece mediante YouTube, con inicio/fin, repetir/bucle, controles oficiales y enlace de salida. Puede haber publicidad, restricciones o retirada; el enlace externo solo inicia en el segundo indicado. No se descarga ni copia el medio. [Derechos/costos](video-reference-cost-and-rights.md).

El 3D queda accesible como vista opcional en revisión. No se retocaron curvas para declarar resuelta la crítica ni se prometió fidelidad idéntica a humanos. Los esquemas organizan la tarea; no pretenden enseñar biomecánica. La fundamentación deportiva se conserva [fuera de la interfaz](../training/COACHING_SESSION_RATIONALE.md).

## Verificaciones realizadas

- **257 pruebas correctas, una opt-in omitida.** Incluye catálogo/esquema Ajv, IDs/rangos, referencias sin carga de terceros antes de abrir, duraciones exactas, preparación adicional, ocultación y recuperación con rechazo de otro plan.
- **Typecheck, lint, formato y build correctos.** Se conserva el aviso de bundles mayores de 500 kB, especialmente el laboratorio Rapier; no es error de compilación. No se añadió dependencia.
- **E2E en Chromium independiente, contexto nuevo:** 52 fichas, filtro a 20 con referencia, búsqueda sin acentos, ficha enfocada, cero peticiones YouTube antes de activarlo; +30 s mantiene marcha, pausa/guardado/recarga/recuperación y recorrido de 30 minutos finalizado en modo ×60. Sin excepciones de página. Regresión repetida tras ajustar recuperación. Script `tests/browser-coaching-plan.mjs`.
- **Seis fuentes reproducidas realmente desde su rango:** Become Elite 458.027 s; Futsal Movement 102.083; AllAttack defensa 130.028; 7mlc V 207.070; MPFC extremo 468.036; AllAttack finalización 158.078. Comprobación técnica de arranque, no revisión íntegra de esos videos.
- **Final/repetición del extremo:** 468–497 s. Final observado 497.001497 s; repetir manual volvió aproximadamente a 468.232. Tres reinicios en bucle observados en 138 muestras; al desactivar bucle terminó el tramo. Se corrigió un fallo real de recarga que quedaba en buffering. Reinicios con seek/play y vigilancia independiente del final cada 200 ms; no precisión de fotograma garantizada.
- **Fallo del proveedor simulado:** abortar iframe_api muestra error y alternativa externa; la ficha sigue accesible. La aplicación no pide cuentas/pagos ni descarga como evasión.
- **Móvil emulado 390×844:** corregido desbordamiento del título/bloque largo; plan, ficha, error de video y esquema sin desbordamiento. Iframe medido 289×210 px. No sustituye nueva aceptación en Samsung físico.
- **Offline en contexto de prueba:** aplicación preparada desde UI, red desactivada, recarga abre plan y 52 fichas. Cero recursos YouTube/googlevideo/ytimg en la caché propia. Los videos requieren red; no se declaran disponibles offline.

[Evidencia compacta](evidence/video-guided/checks.json), [vista móvil propia](evidence/video-guided/plan-mobile.png), [esquema móvil propio](evidence/video-guided/diagram-mobile.png). No se incorpora captura de material de terceros al repositorio. Las pruebas usan contextos aislados y no borran historial del usuario.

## Pendientes que impiden llamar terminado al producto

1. Completar referencias exactas de las 32 fichas pendientes y revisar los fragmentos completos que se vayan adoptando; sustituir apoyos parciales cuando sea necesario. El censo previo de 5.764 videos no equivale a validación ni habilita incorporar todos automáticamente.
2. Resolver fidelidad pedagógica de los movimientos 3D que merezca conservar como enseñanza; esto requiere autoría/captura/retargeting y revisión, no solo interpolación. No introducir mocap comercial ni descargas sin auditoría/autorización pertinente.
3. Encadenar video/demostración de manera automática sin acreditar publicidad o espera como práctica. Actualmente se estudia antes o con una acción que pausa el recorrido, y se continúa explícitamente; preparación y transiciones del reloj sí son automáticas.
4. Convertir las cinco propuestas y etapas en un plan editable y adaptado por capacidades/semana, con seguimiento de métricas. No hay programa anual diario personalizado ni conversación generativa dentro de la app.
5. Calibrar dosis de retorno y progresiones. El calendario orienta revisiones, no concede alta ni garantiza nivel profesional. Esta planificación se puede explorar antes de entrenar; no prescribe empezar las cinco sesiones ahora.
6. Nueva revisión de claridad/reproducción en Samsung real; instalación móvil/origen seguro y sincronización conservan sus límites anteriores.

No hay compras, nuevas dependencias, instaladores, modelos descargados, publicación, copia de videos ni cambios globales. El informe y estado del proyecto distinguen lo implementado, lo propuesto y lo pendiente.
