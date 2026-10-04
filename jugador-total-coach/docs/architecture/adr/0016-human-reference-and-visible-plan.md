# ADR 0016 — Referencia humana y plan visible

Fecha: 2026-10-03. Estado: implementado parcialmente, cobertura registrada. El usuario cuestiona las animaciones y solicita el video original con inicio/fin junto con el plan dentro de la aplicación.

## Decisión
Priorizar las referencias humanas oficiales cuando estén disponibles, junto a instrucciones propias y organización de la tarea. Conservar el 3D como vista opcional en revisión. La aceptación anterior de claridad no se extiende a esta nueva objeción. Ni más FPS ni suavizar interpolaciones demuestra equivalencia con un deportista: una reconstrucción fiel requeriría captura/autoría/retargeting y revisión por gesto. No prometer clonación automática ni comprar servicios.

Reutilizar YouTube IFrame API con activación explícita, controles y atribución oficiales. Inicio/fin absolutos para el primer tramo; repetición mediante seek/play con vigilancia de final cada 200 ms, porque seekTo pierde el límite nativo y recargar el mismo video falló durante las pruebas. No descargar medios, ocultar anuncios ni copiar transcripciones. Internet y permiso del autor son requisitos reales; fuera de la app el enlace solo fija el inicio. [Auditoría](../../reviews/video-reference-cost-and-rights.md).

Mi plan se abre por defecto. Publicar 52 fichas de 32 familias, etapas 24/52 semanas, cinco propuestas de distinta duración y acceso directo al ejercicio. Reutilizar ExecutionPlan/SessionEngine/SessionClock, IndexedDB e historial. La composición adapta tareas/series; no duplica la máquina temporal. Esquema JSON y contratos de tiempos cubren el contenido distribuido.

El video se estudia antes o mediante una acción que pausa el recorrido; no acreditar buffering/publicidad como práctica. Los intervalos de preparación/trabajo/descanso avanzan solos y +30 s/+1 min conserva autoinicio. Esta entrega no sincroniza automáticamente todos los videos de cada tarea con el reloj. Guardar y recuperar en pausa; no abrir un journal con otra propuesta.

## Alcance y consecuencias
13 fichas con referencia del gesto, siete de un componente, 32 con video pendiente; seis videos fuente, sin declarar revisión íntegra. Diez esquemas originales explican organización colectiva. No son 52 animaciones nuevas ni 52 ejercicios audiovisualmente completos.

El calendario es una propuesta educativa con criterios, no alta deportiva ni fecha de profesionalización. Las cinco sesiones se pueden explorar/recorrer, pero su dosis personal de retorno sigue abierta. Plan anual diario adaptativo, métricas por capacidad, conversación generativa y cobertura completa de referencias siguen pendientes. No se ha elegido un proveedor de IA ni introducido pagos/dependencias. Fichas/plan pueden guardarse localmente; el video conserva su dependencia externa.
