# Fase 05 — Contactos y comparación guiada

Fecha: 2026-09-30. Autorizada mediante «vamos con la fase 5», después del cierre de 04 en `7694685`. [Plan previo](../plans/phase05-contact-spike.md). Implementación y verificación técnica completadas; funcionamiento en computadora y Samsung confirmado por el usuario, que reconoce las campanitas en la demostración. El propósito del laboratorio se aclara tras su consulta. No se inicia 06.

## Resultado y decisión

La aplicación permite elegir **Pie y balón · fase 05** o la bisagra de 04. Solo se monta el ejemplo visible. Dentro de 05 hay dos modos separados:

| Modo | Avatar/pie | Balón visible | Propósito |
|---|---|---|---|
| Demostración guiada | AnimationMixer, clip local de 10 s | TutorialBall del mismo GLB/clip | Dos toques interiores, pausa, media velocidad y revisión de cualquier instante |
| Laboratorio | Clip evaluado antes de cada paso; collider cinemático sigue los huesos foot/ball de cada pie | PhysicsBall dinámico, autoridad exclusiva de Rapier | Contactos calculados, variante lenta/rápida, forma aislada o avatar, debug y reinicio |

En laboratorio se oculta TutorialBall: es un nodo distinto del balón dinámico. Ningún sistema escribe sobre el balón del otro. Suelo fijo y área de referencia 2×2 m. El laboratorio tiene reloj propio; no cambia ni acredita tiempo de la sesión. Cambiar modo/origen/velocidad física destruye el mundo y lo crea desde el estado inicial. No hay corrección oculta de trayectoria. Al salir el balón del área se detiene y se explica; no se añaden paredes invisibles.

**Decisión del mínimo para enseñar:** mantener cuerpo y balón en un clip sincronizado como ruta del tutorial. El laboratorio queda como herramienta aislada de comprobación. Un contacto válido puede producir un recorrido que se aleje del gesto que queremos explicar; por sí solo no genera una demostración didáctica ni acredita técnica. No hace falta ragdoll, aerodinámica, control de drible o solver propio. Se conserva el ejercicio y se corrige su representación. [ADR 0011](../architecture/adr/0011-contact-spike-result.md).

## Reutilización, recursos y configuración

Se reutilizan Rapier/react-three-rapier, Three/Fiber, GLTFLoader, ClipDriver/AnimationMixer, el avatar Quaternius CC0 de 65 huesos y Blender 4.5.14 portable con IK/bake/exportador. Solo se crean poses del gesto faltante, balón geométrico, configuración, panel e integración específica. Se conservan malla/pesos/ropa y correcciones de hombros/brazos; el GLB de bisagra mantiene su hash anterior.

- @react-three/rapier **2.2.0**, MIT; @dimforge/rapier3d-compat **0.19.2**, Apache-2.0. Diez pares nombre/versión revisados, ocho paquetes añadidos; peers compatibles con React 19.3.0/Fiber 9.8.1/Three 0.186.1. [Costo, alternativas y licencias](phase05-cost-and-dependencies.md), [inventario](phase05-dependencies.json).
- Paso fijo **1/60 s**, gravedad −9,81 m/s², interpolación del wrapper, CCD en balón, hasta cuatro subpasos CCD. Esfera radio 0,11 m/masa ilustrativa 0,43 kg; pie cuboide con semiejes 0,055/0,045/0,12 m; suelo 2×0,1×2 m. Fricción suelo 0,65, pie/bola 0,5; restitución 0,25; damping lineal 0,15/angular 0,2. Combinación por defecto Average. No son parámetros medidos de tu balón/suelo.
- Lento: clip evaluado a 1×. Rápido: recorrido del pie a 4×, con paso y gravedad iguales; 10 s del recorrido se completan en 2,5 s físicos. No es una recomendación de cadencia deportiva. Los parámetros completos están en [physics-matrix.json](evidence/phase05/physics-matrix.json).
- Clip único finito `EX_inside-inside__alternating__v1`: 30 FPS, 10 s, 301 muestras; cuerpo y balón comparten tiempo. No se etiqueta como cíclico ni se repite automáticamente al finalizar. Fuente editable y [manifiesto](../../assets/manifests/inside-inside-v1.json). GLB **872284 bytes**, SHA-256 `c195511201131c201b7dc205d1d16825a2c6d0250b6b95f82e838e5b9f007129`.
- La trayectoria guiada es una ilustración preparada: fase de empuje junto al interior y transferencia al otro pie. El giro visual acompaña el desplazamiento. No se presenta como simulación guardada, predicción de velocidad o aprobación deportiva.

## Evidencia ejecutada

**132 pruebas / 10 archivos** correctas, además de lint, tipos, formato y build. Las cuatro pruebas nuevas ejercitan GLB real y Rapier/WASM: contrato del clip, poses y apoyos, contacto guiado/seek, matriz de velocidades/cadencias y reinicio. Las pruebas anteriores de bisagra/motor conservan su resultado.

- Khronos glTF Validator: cero errores y cero warnings. [Informe](evidence/phase05/gltf-validation.json).
- Fuente .blend reabierta con Blender portable: 65 huesos, acciones de avatar/ball, 30 FPS y rango 0–300, con poses inspeccionadas por datos. [Reapertura](evidence/phase05/blend-reopen.json). No se afirma un round-trip completo de otro exportador.
- Geometría deformada en 301 poses: dentro de 2×2, Y mínima −0,000045 m aproximadamente, altura máxima 1,7196 m en esta postura; sin salto de cabeza mayor a 0,0021 m por muestra. Pie de apoyo permanece aproximadamente en ±0,34 m. [Bounds](evidence/phase05/asset-bounds.json).
- Consulta de proximidad esfera/cuboide durante el clip: mínimo ≈0,0000082 m en ambos lados, sin penetración en esos proxies. No certifica toda la superficie de la piel, ropa ni técnica humana. [Datos](evidence/phase05/guided-contact.json). Capturas reales de [contacto derecho](evidence/phase05/tutorial-contact-right.png) e [izquierdo](evidence/phase05/tutorial-contact-left.png) inspeccionadas por el agente.
- CPU/WASM: cuatro configuraciones (forma aislada/avatar × lento/rápido), agrupadas a 30/60/120 Hz, con reinicio por configuración: **16 ejecuciones**. Mismas posiciones por paso dentro de este entorno. Primer contacto del avatar a 1,4167 s del recorrido lento / 1,4667 s del rápido, nunca al inicio. Dos entradas de contacto en lento y tres en rápido; esas entradas son eventos físicos, **no número de toques o repeticiones prescritos**.
- Forma aislada sale del área después del impulso: final explícito, un contacto; caso rápido termina a 6,3333 s del recorrido. Avatar termina sin salir, pero su balón deriva hacia delante: resultado ilustrativo del solver, no control deportivo validado. [Matriz](evidence/phase05/physics-matrix.json), [debug](evidence/phase05/debug-outside.png), [colliders sobre avatar](evidence/phase05/physics-contact.png).
- Navegador real Playwright independiente: pausa conserva tiempo/posición; reinicio deja cursor 0/contactos 0/bola inicial; repetir caso rápido reproduce resultado. Modo guiado permite seek inverso y media velocidad. GLB fallido bloquea reproducción y reintento recupera la escena; la bisagra sigue accesible y su botón se habilita cuando termina de cargar.
- Prueba adicional del wrapper en navegador con scheduler de render sustituido **solo en pestañas de prueba**: nominal 30/60/120 Hz, medianas observadas 32,9/16,1/8,3 ms. Tres contactos y misma posición final `[-0.2976445258, 0.1086639389, 0.4534674585]` en los tres casos. Esto no significa pantalla física de 120 Hz ni determinismo binario entre dispositivos.
- Ancho 390×844: documento de 390 px, sin desbordamiento horizontal; controles visibles de al menos 44 px de alto. Activación/pausa por espacio comprobadas. [Captura](evidence/phase05/mobile-layout.png). Es viewport de escritorio, no prueba en un Samsung físico.
- Muestra breve de escritorio con reproducción y canvas visible: 282 intervalos RAF en 5,0117 s; mediana 17,9 ms y p95 18,2 ms. Chrome de automatización declara 153 en Windows. No garantía de fluidez sostenida ni medición móvil.
- La automatización mantiene visibles sus pestañas de fondo: el cambio real de pestaña no permitió probar ocultación. Inyección de `visibilitychange` y `document.hidden` sí comprobó congelación a 1,0 s, retorno a 1,1 s y conservación de pausa manual. Registrar como **evento simulado**, no minimizar físicamente Windows.
- Recorrido normal en pestaña nueva: cero errores de consola y todas las solicitudes observadas al origen local. Dos avisos de dependencias: THREE.Clock obsoleto en Fiber y parámetros de inicialización obsoletos dentro de Rapier compat. El fallo de GLB se indujo por separado. Build advierte chunks grandes (Three ≈957 KB, ContactScene+WASM ≈2265 KB sin comprimir). No se ocultan avisos ni se modifican librerías externas para silenciarlos.

[Resultados del navegador](evidence/phase05/browser-results.json) conservan resultados previos/corregidos y límites. El primer guion de layout se detuvo por buscar «Reproducir» después de un seek, cuando el botón correcto era «Continuar»; se corrigió el guion y se repitieron layout/teclado. No fue un bloqueo de la aplicación.

## Correcciones durante la prueba

1. El primer bake evaluaba poses dependientes y no animaba los objetivos IK: la exportación deformaba huesos al comenzar. Se restauran bases locales por hueso y se animan objetivos antes de usar el bake de Blender. Se añade comprobación de continuidad y bounds de todas las poses; no se conserva el recurso defectuoso en runtime.
2. El primer recorrido guiado dejaba demasiado espacio al contacto: se ajustó la curva al interior del pie y se comprobó con consultas existentes de Rapier y capturas. No se alteró el ejercicio para acomodar el defecto.
3. A 30 Hz podía quedar un paso físico extra antes de que React aplicara la pausa terminal. Ahora se duerme el balón en el paso final y se bloquean nuevas entradas; el wrapper sigue siendo dueño del paso fijo/solver. Se probó con pasos adicionales y se repitió la matriz de navegador. No se teletransporta el balón.

## Revisión del usuario y aclaración — 2026-09-30

- El usuario comunica que todo funciona bien en computadora y Samsung. Evidencia manual cualitativa de este caso nuevo, sin captura, FPS ni comprobación adicional de consola aportados en este mensaje.
- Reconoce el gesto guiado como campanitas o inside-inside. Pregunta por qué la devolución del laboratorio parece un control orientado. Es una duda sobre el propósito de los modos: el clip mueve los pies por un recorrido fijado, mientras Rapier mueve libremente el balón. No hay adaptación del pie a su nueva posición ni intención de enseñar un control orientado.
- Se nombran las campanitas en la demostración y la prueba técnica en el laboratorio. Los textos explican la diferencia y para qué se prueban velocidades distintas. Animación, física, controles y velocidades permanecen iguales. La explicación se entrega; no se atribuye al usuario una aceptación posterior que aún no ha comunicado.
- El usuario valora poder observar un gesto más rápido. Se registra como criterio para el diseño posterior: distinguir velocidad didáctica para examinar el gesto y reproducción más ágil para comprender su continuidad. No se añade ahora un control nuevo ni se valida 4× del laboratorio como ritmo humano habitual, dosis o recomendación de práctica.
- Con estas evidencias se cierra la comprobación funcional pendiente de 05. Los clips conservan draft como contenido deportivo y 06 sigue sin autorización.

Verificación de esta aclaración: 132 pruebas/10 archivos, lint, tipos, formato y build correctos. Navegador independiente sobre el build local: títulos y textos nuevos visibles al cambiar entre ambos modos; cero errores de página/consola y los dos avisos conocidos de dependencias. Permanece la advertencia de chunks grandes. No se repite la matriz física ni la exportación porque solo cambian textos y documentos. La revisión del Samsung procede del reporte anterior a este ajuste, no de una nueva ejecución del agente en el teléfono.

## Pendientes y límites

- Técnica, dosis y adecuación de entrenamiento continúan en borrador. La revisión del usuario cubre funcionamiento y reconocimiento del gesto, sin convertirse en revisión profesional.
- Colliders simplificados; no contacto exacto con la malla ni calibración de balón/suelo. CCD reduce túneles en estos casos, sin garantía universal. No se probó un rango arbitrario de velocidades ni otros dispositivos.
- No sesión completa, audio, persistencia, PWA/offline de servidor, exportación, pagos, cuentas ni cambios globales. Recursos locales verificables; servirlos desde loopback no equivale a instalar una PWA offline.
- Fase 06 requiere nueva autorización después de revisar este resultado. El alcance de 05 queda completado como prototipo técnico con funcionamiento aceptado por reporte; no se declara aprobada una rutina deportiva.
