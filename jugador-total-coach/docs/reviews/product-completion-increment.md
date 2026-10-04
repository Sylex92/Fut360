# Entrega: inventario, cuatro clips y continuidad local
Fecha: 2026-10-03. Solicitud: ampliar revisión a todas las fuentes, producir recursos y completar el producto.

## Resultado verificable
- **22 variantes animadas / 15 patrones** en la biblioteca. Cuatro nuevas: planta atrás/adelante y arrastre con salida en V, ambos pies. Rig y aspecto existentes; GLB, fuentes Blender, fichas, manifiestos y hashes registrados.
- **32 familias de ejercicios/jugadas y 33 capacidades** estructuradas, con material, participantes, entornos, regresión/progresión y adaptación FUT 5/7/11. Una familia con un componente animado no se considera completa.
- **5.764 videos únicos localizados** en las pestañas Videos de siete canales, tras quitar 30 duplicados del listado de 7mlc. 771 de 7mlc; 848 Become Elite; 832 Joner Football; 158 My Personal Football Coach; 2.913 Unisport; 228 AllAttack; 14 Futsal Movement. Censo provisional: excluye Shorts/directos/privados; dejar de cargar no prueba exhaustividad.
- **Ocho videos con muestras visuales**, cubriendo las siete fuentes. Tiempos, qué se vio y qué falta en VIDEO_OBSERVATIONS. Cero videos/canales declarados íntegramente validados.
- Historial local, feedback opcional, copia JSON, importación validada/atómica, recuperación tras recarga pausada y protección de escritura entre ventanas.
- Preparación offline explícita, comprobación de todos los archivos y reparación de una copia incompleta. Actualización de versión por acción del usuario.

[Inventario legible](../training/CONTENT_INVENTORY.md), [datos estructurados](../training/CONTENT_INVENTORY.json), [videos CSV](../research/VIDEO_CATALOGUE.csv), [observación](../research/VIDEO_OBSERVATIONS.json), [fundamento de los clips](../training/SOLE_V_REVIEW.md), [costos](product-completion-costs.md), [ADR de persistencia/offline](../architecture/adr/0015-local-recovery-offline.md).

## Verificaciones ejecutadas
247 pruebas unitarias/contrato correctas, una omitida (ensayo de hora real opt-in; no repetido en esta entrega). Tipos, lint, formato y build correctos. Advertencia existente de chunks mayores de 500 kB; no se oculta. 23 GLB distribuidos: 22 de biblioteca y versión histórica de campanitas para el laboratorio/prueba anterior.

Cuatro nuevos GLB: cero errores y cero warnings del validador Khronos, 65 huesos, duración 8/10 s, geometría deformada muestreada a 30 Hz, apoyo y regreso comprobados. Contactos: máximo solapamiento aproximado 1,63 mm y separación de 3,69 mm en ventanas de contacto, dentro de tolerancias técnicas 2/10 mm. No simula fuerzas reales ni certifica biomecánica. Apariencia existente conservada; aceptación humana de los cuatro clips pendiente.

Navegador Chromium:
- Recarga con +30 s: restante base idéntico antes/después, recuperación pausada y Continuar explícito.
- Feedback sintético, exportación, importación idéntica sin duplicados y conflicto sin escrituras parciales.
- Segunda ventana toma control; la anterior se pausa, rechaza escritura obsoleta y ofrece exportar su progreso sin guardar.
- Cuatro clips visibles y detalle de pies; V termina a 2×.
- Recorrido final por las 22 variantes conserva el mismo Canvas y carga cada recurso. Regresión reproducible: `tests/browser-library-reuse.mjs`.
- Red bloqueada: recarga, inicio y carga de nuevos GLB. Primera preparación en perfil limpio y detección/reparación de un recurso eliminado del caché.
- Recorrido de una hora a ×60 en viewport 390×844: completado, 60:00 registrados, cero omitido, restante cero. Sin desbordamiento horizontal.
- Borrado de registro completado: no reaparece tras dos ciclos de guardado.
- Cero errores en la consola del tab principal; una advertencia. En la prueba final de caché/reparación, cero errores de consola y pageerror. Errores de YouTube se separan de la aplicación.

[Evidencia y capturas propias](evidence/product-library/browser-checks.json). En una prueba intensiva posterior, Chromium bloqueó la creación de WebGL tras numerosos cambios/recargas y emitió cuatro errores; la app mostró fallback y detuvo el visor. Se corrigió la biblioteca para conservar Canvas al cambiar de ejercicio, cambiando solo el recurso y reiniciando sus controles. Tras reabrir el tab, las 22 variantes pasaron la regresión sin errores. No se promete inmunidad a bloqueos gráficos externos. También se corrigió la búsqueda explícita de actualizaciones de la copia offline. Estas pruebas no equivalen a una nueva prueba en Samsung físico. No se usaron datos de salud reales en fixtures, capturas o Git.

## Límites que impiden declarar todo el producto completo
1. Falta revisar íntegramente el inventario audiovisual, desglosar todos sus ejercicios/variantes y verificar contactos, apoyos, errores y progresiones. No hay una configuración que convierta todos esos videos en animaciones validadas automáticamente. Un recurso privado concreto quedó registrado; no se eludió.
2. La hora v2 sigue como familiarización y conserva su dosificación/repetición pendientes de la revisión abierta. Las cuatro variantes nuevas están en biblioteca; no se añaden automáticamente a una carga personal.
3. Planificador de duración/contenido flexible, periodización ejecutable, adaptación por seguimiento y conversación real dentro de la app siguen por implementar. Su viabilidad económica ya tiene informe; no se añadió una IA fingida ni una API de pago.
4. Recepción con información, pase/remate, defensa, oposición, carreras y jugadas colectivas requieren sus recursos y entornos; las 32 fichas no son cobertura gráfica completa.
5. Instalación PWA nativa y nueva prueba en Samsung real pendientes. LAN HTTP permite prueba online, pero no Service Worker/instalación; hace falta un origen seguro. No se cambiaron certificados/firewall globales.
6. Almacenamiento local puede perderse por cierre brusco, cuota, fallo o limpieza del navegador. Exportar copia sigue siendo necesario. La actualización offline se bloquea por sesión activa de la ventana actual; coordinación de actualización entre todas las pestañas sigue pendiente.

## Próxima ejecución, sin repetir permisos ya concedidos
Continuar con recepción/control orientado y defensa a partir de secuencias completas; crear fichas de autoría y comprobar su representación. Separar esta tarea del planificador versionado, que debe soportar duraciones variables sin mutilar el formato histórico de 60 min. Mantener investigación/fundamento en documentos, fuera del portal. No exigir nuevas confirmaciones rutinarias; preguntar únicamente ante acceso indispensable, costos, licencia incierta o contexto personal necesario para prescripción.
