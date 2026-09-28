# Plan de ejecución MVP1 — consolidado en fase 01

Fecha inicial: 2026-09-24. Consolidación documental: 2026-09-27. **Fase 00 aceptada; fase 01 autorizada y documentada. No se han ejecutado 02–09 ni iniciado aplicación.**
Objetivo: sesión fija de 3,600 s en 2×2 m, comprensible a velocidad normal, avatar 3D reutilizado y genérico, operación local sin nuevos pagos obligatorios. No se persigue hiperrealismo.

## Evidencia y prioridades

Verificado: fixture válido contra su esquema, 3,600 s, 31 IDs, 60 intervalos; motores con licencias candidatas compatibles y archivos Standard publicados. Confirmado por el usuario: teléfono Samsung Galaxy S24 FE con Android 16 y Google Chrome, esta misma computadora, zona libre de al menos 2×2 metros, balón de fútbol, silla firme, banda corta de varias resistencias y tapete/colchoneta. Pendiente: catálogo, assets concretos, revisión deportiva, cabida de ejercicios/material, versiones transitivas, Blender ejecutable y pruebas de los equipos. Supuesto: hip-hinge será el primer gesto y Base Characters Standard el primer avatar a evaluar.

Las auditorías de [especificación](../reviews/spec-audit.md), [entorno](../reviews/environment-report.md), [licencias](../reviews/license-audit.md), [reutilización](../reviews/reuse-audit.md) y [costos](../reviews/feature-cost-matrix.md) son entradas de la siguiente fase, no una autorización para implementar.

La [revisión específica de Remotion del 2026-09-25](../research/REMOTION_LICENSE_REVIEW.md) confirma elegibilidad documental del escenario personal y corrige su descripción como mero exportador. Player y su integración con Three/Fiber son una alternativa real para reproducción. Se mantiene la base actual: aún no se demuestra ahorro total al añadir esa capa y la exportación no es requisito del MVP1. La revisión de arquitectura de 01 mantuvo Three/Fiber + AnimationMixer por alcance de integración, documentando alternativas en ADR 0006. Sin instalación ni benchmark. No se afirma inferioridad de rendimiento. Si se justificara incorporarlo como reproductor, registrar el cambio de arquitectura y del orden de dependencias; no introducirlo silenciosamente como si fuera exportación aprobada.

La [revisión de usabilidad](../reviews/usability-review.md), añadida a petición del usuario durante 00, propone comprobar comprensión de objetivo/reloj/descanso y claridad de la demostración. La evaluación documental ya existe; sus refinamientos aún deben revisarse con el usuario. Probar comprensión con una representación estática antes de atribuir éxito a la interfaz y, en 04/07/09 autorizadas, comprobar tareas reales en teléfono/computadora. El agrado declarado no sustituye observar errores, ayudas necesarias y acceso a pausa; no se realizan pruebas físicas con contenido draft.

## Aclaración del usuario: teléfono y computadora; TV futura

El usuario confirma Samsung Galaxy S24 FE con Android 16 y Chrome, más esta misma computadora Windows inspeccionada, para el MVP1 y reserva expresamente la TV para una fase futura. Samsung Internet queda registrado como alternativa instalada sin uso habitual. La identificación básica de equipos está resuelta; la versión exacta de Chrome móvil se registrará al preparar las pruebas. No se requiere información del televisor. En 01 se concretaron contratos de controles y objetivos de prueba para teléfono/computadora, sin diseñar ni implementar pantallas. La TV queda registrada como ampliación sin módulos o integraciones anticipadas.

La prueba de 04 debe permitir evaluar claridad del primer ejercicio en teléfono/computadora; 08/09 comprobarán operación/offline, legibilidad, pausa, audio y rendimiento de los equipos concretos. No hay pruebas de TV dentro de la aceptación del MVP1. Su compatibilidad, conexión, controles y costos se evaluarán al autorizar esa ampliación futura.

## Secuencia 00–09 y condiciones de avance

Espacio aclarado durante 00: habitación mayor con muebles, pero al menos 2×2 metros de suelo completamente despejado, según el usuario. Se conserva ese límite para diseñar y comprobar los ejercicios. También está confirmada por el usuario la disponibilidad de balón de fútbol, silla firme, banda corta de varias resistencias y tapete/colchoneta. Posteriormente se comprobarán colocación, estabilidad de apoyos y cabida de movimientos dentro del área, sin asumir que la habitación mayor permite ampliar el alcance.

La revisión básica de equipos, espacio y material está completa por declaración del usuario y diagnóstico disponible. El usuario aceptó 00 y autorizó únicamente 01 el 2026-09-27. La arquitectura, contratos y catálogo se consolidan documentalmente. Blender no se instala aquí; se preparará cuando sea necesario para adaptar el primer clip y exista autorización concreta. Ninguna fase técnica queda autorizada por esta actualización.

| Fase | Alcance acotado | Evidencia exigida para cerrar |
|---|---|---|
| 00 — auditoría | Solo diagnóstico, investigación y documentos | Seis entregables, recálculo/esquema comprobados, incertidumbres visibles y PROJECT_STATUS actualizado. Aceptada documentalmente el 2026-09-27; recursos y entrenamiento no aprobados por ello. |
| 01 — arquitectura | Resolver hallazgos S02–S09 y S11–S14; contratos Workout/Exercise/AnimationAsset/Scene; límites de módulos y Definition of Ready | Invariantes y autoridad explícitas; política de transiciones/repeticiones/lados/recuperación; cobertura de catálogo verificable; sin UI, instalaciones ni adaptadores futuros vacíos. |
| 02 — bootstrap mínimo | Monorepo pnpm, React/Vite/TS, validación existente, pruebas y herramientas mínimas auditadas | Versiones exactas compatibles, lockfile/transitivas/avisos; scripts locales de lint/typecheck/test/build pasan, fixture 3600 validado y pantalla de diagnóstico. CI remoto no activado; offline completo se prueba en 08. |
| 03 — motor de sesión | Reloj inyectable y estados; vista de texto | Pausa congela; límite de intervalo exacto; finalización única; skip/repeat/abort idempotentes según contrato; descansos de 0; ticks grandes; duración prevista separada de tiempo real. |
| 04 — primer ejercicio 3D | Avatar gratuito concreto y un gesto comprensible de 60 s; después prueba de 5 min con contenido disponible | Archivo/hash/licencia/mapping, tres cámaras, pausa/reanudación y cambio de vista sin reinicio; E2E y evidencia normal frontal/lateral; límites 2×2 documentados. Fallback solo draft para diagnóstico. |
| 05 — contactos aislados | Rapier, suelo fijo, pie cinemático, balón dinámico; comparar con inside-inside guiado | Contacto lento/rápido, debug, pausa/reset, tasas de render distintas y tolerancias registradas; authored y rapier nunca escriben simultáneamente al mismo balón. No validación deportiva por física. |
| 06 — pipeline y primeros clips | Blender/retarget/exportador existentes; hip-hinge, inside-inside y glute-bridge; solo autoría faltante | GLB validado, fuente importable, mapping, FPS/duración, bucle, apoyos, contacto, lados, bounds, cámaras y procedencia. ReviewStatus con evidencia; revisión humana pendiente donde falte. |
| 07 — sesión completa | Catálogo objetivo de doce patrones con variantes/combinaciones, nuevo workout versionado; ronda/lado/cues/descanso/next/beep/controles | 3600 exactos, pruebas acelerada y a velocidad normal, cobertura por ID/variante: listo/draft/fallback/pendiente. No se cierra entrenamiento con placeholders. Fuerza admite repeticiones objetivo y descanso restante revisados. |
| 08 — offline y registros | PWA/cache local, persistencia, recuperación, feedback, exportación/importación acordada en 01 y borrado | Tras carga completa y red bloqueada, reiniciar y reproducir todos los recursos; recarga segura; historial y registros incompletos; recuperación e importación sin duplicados; origen seguro móvil documentado. |
| 09 — revisión de salida | Matriz requisito/evidencia y defectos dentro del alcance; propuesta MVP2 separada | Lint/typecheck/tests/E2E, prueba real de hora, offline, teclado/subtítulos/contraste/silencio, Android identificado y medido, licencias de todos los recursos, cero placeholders y revisión humana real. Ninguna funcionalidad nueva. |

Avanzar autónomamente dentro del alcance autorizado y registrar las aceptaciones necesarias antes de iniciar fases nuevas; no exigir un mensaje por paso. La fase 01 actualizó contratos documentales y prompts de referencia, sin código, instalaciones ni ejecución de fases siguientes.

## Recorrido guiado: qué verá el usuario en cada paso

1. **01, reglas claras en documentos.** Ejemplos completos de inicio, preparación, trabajo, descanso, pausa, repetición y final; fichas y límites de los módulos. Catálogo conciliado con tabla de los 31 IDs originales; Remotion Player evaluado documentalmente, sin instalarlo.
2. **02, aplicación mínima que abre.** Una pantalla de diagnóstico y herramientas locales reproducibles. No se presenta todavía como entrenador.
3. **03, sesión textual con reloj.** Observar que trabajo/descanso y comandos respetan el contrato. Verificar que las pausas añaden tiempo real sin quitar trabajo programado.
4. **04, un ejercicio visible.** Avatar exacto y gesto legible desde tres vistas, con pausa/reanudación; después una secuencia técnica de cinco minutos. Los 60 segundos del primer hito describen una prueba del reproductor, no una dosis ni obligación de repetir sin descanso. Preparar Blender aquí si el clip necesita ajustes.
5. **05, contactos en un laboratorio separado.** Observar pie, balón y suelo con parámetros inspeccionables. El resultado no aprueba el gesto deportivo ni obliga al tutorial a depender de física libre.
6. **06, producción repetible.** Preparar y revisar movimiento de pie, con balón y en suelo, registrando fuentes y correcciones. Comparar asistencia IA solo cuando resuelva una carencia concreta, según el apartado siguiente.
7. **07, sesión completa.** Unir catálogo acordado, instrucciones, descansos, preparación de material y controles en 3600 segundos programados. Revisar todas las variantes; doce patrones no equivalen a doce clips suficientes. El fixture original permanece como regresión técnica, separado del programa nuevo.
8. **08, uso local sin conexión y registros.** Comprobar carga/reinicio, recursos, historial y recuperación en computadora y teléfono. Resolver el acceso seguro móvil; no prometer que basta con abrir la IP del PC.
9. **09, aceptación con evidencia.** Reproducción real de una hora, revisión de usabilidad/accesibilidad, licencias, rendimiento y calidad del contenido. Las pruebas aceleradas del reloj complementan esa observación. Contenido pendiente de revisión no se ofrece como aprobado para entrenar.

En cada fase autorizada, explicar aquí el cambio, mostrar su resultado y registrar pruebas y límites antes de pedir avance. El 2026-09-26 el usuario asume la revisión humana de fichas y demostraciones junto con el agente. Este prepara fundamento, criterios y comprobaciones; el usuario revisa, observa y solicita correcciones. No se le exige elegir algoritmos ni decidir dosis. Registrar esa revisión con su alcance real, sin atribuirle formación deportiva no declarada ni marcar revisión profesional realizada. Los hallazgos que excedan la evidencia disponible permanecen pendientes. No hay plazos de trabajo estimados con evidencia todavía. Véase el [alcance de revisión](../quality/ACCEPTANCE_OSS_PHYSICS.md).

## Asistencia IA en preparación de recursos

La [comparación documental de producción](../reviews/ai-production-tools-review.md) amplía las alternativas previas. Mantener Three/Fiber, Blender y Rapier en sus funciones; evaluar IA como herramienta auxiliar de autoría, no dependencia del entrenamiento. No se instala ni genera nada en 00.

Antes de producir muchos clips, si hay una carencia, elegir una sola ruta asistida pertinente y compararla con adaptación/autoría existente: mismo gesto, referencia autorizada, exportación editable, claridad desde tres cámaras, apoyos/contactos, costo/cuota y tiempo total incluida corrección. Si la carencia aparece en 04, no aplazar artificialmente la evaluación hasta 06. No convertir esa comparación en requisito de probar todos los proveedores ni cambiar ejercicios adecuados para ajustarlos a una salida defectuosa.

Generación de malla, creación de rig, captura de movimiento, asistencia física y video son capacidades distintas. Una licencia o cuota gratuita de una no aprueba las demás. Antes de usar servicio externo, concretar términos, datos enviados y permisos; ninguna autorización de descarga o instalación implica permiso de subir archivos personales. Las revisiones técnicas/deportivas se mantienen para clips de cualquier origen.

## Decisiones de contenido antes de producir clips

La [dirección deportiva recomendada](../reviews/training-design-recommendation.md), investigada en 00 por delegación expresa del usuario, evalúa los 31 IDs y propone reducir el núcleo inicial a doce patrones, con variantes y combinaciones claras. Recomienda un reparto 8/12/10/16/8/6 de los 60 minutos; no es una prescripción aprobada ni cambia el fixture. Hip-hinge bilateral sin carga se mantiene como primer gesto visible recomendado para examinar claridad de apoyos y movimiento; no es una prueba de suficiencia deportiva del producto.

La recomendación se concilió en 01 con PRD y catálogo: doce patrones objetivo, tabla de destino de los 31 IDs y presupuesto 8/12/10/16/8/6. El fixture sigue intacto. Faltan fichas completas, dosis, secuencia detallada y recursos revisados; no fingir que los nombres nuevos bastan para una sesión válida. La preparación doméstica no demuestra táctica de partido, fuerza completa o adecuación individual.

## Primer ejercicio: Definition of Ready consolidada

- Ficha draft hip-hinge con espacio, cues, errores, regresión, dosis y lado explícitos; sin presentar un ejercicio no revisado como rutina aprobada.
- Avatar gratuito exacto con rig/feet/toes y derechos comprobados; material neutro y legible.
- Un clip adecuado, cíclico solo si lo demuestra. Si no existe en el catálogo gratuito, registrar la carencia y adaptar/animar ese gesto con Blender.
- Envolvente de cuerpo y props dentro del espacio declarado, más entradas/salidas; alturas y tolerancias explicitadas.
- Reloj y comandos de fase 03 disponibles; una fuente de tiempo para cuerpo, balón futuro y cues; evidencia frontal/lateral/3/4.

No esperar a la fase 06 para resolver el único clip necesario en 04: la [Definition of Ready](first-visible-exercise-ready.md) especifica ficha, recurso, herramientas y pruebas necesarias, con estados reales. Ninguna descarga queda autorizada por documentarla. La fase 06 sistematiza y amplía el pipeline, no justifica mostrar oscilaciones genéricas mientras tanto.

## Instalación mínima propuesta, nunca ejecutada en fases 00/01

1. Fase 01 sigue solo documental. No cambiar Git/Node ni remediar globalmente la propiedad del repositorio.
2. Antes de 02, comprobar Node y gestor fuera del entorno privado de Codex; seleccionar versiones mantenidas compatibles y fijarlas. No actualizar globalmente herramientas de otros proyectos. Cualquier instalación requiere una fase autorizada con versión, procedencia y licencia concretas.
3. En 02, solo herramientas de UI/build/TS, validación, pruebas y lint/format realmente necesarias. No instalar un catálogo completo de motores/exportadores. Revisar scripts/transitivas; preparar pruebas locales sin servicio CI obligatorio.
4. En 04, añadir Three/Fiber, avatar y un clip, con descargas autorizadas e inventario. Si adaptar ese clip requiere Blender, comprobar primero si hay ejecutable utilizable y proponer el mínimo necesario.
5. En 05, añadir Rapier/wrapper compatibles y WASM local.
6. En 06, completar Blender/exportador/validador glTF. No comprar Source, instalar auto-riggers ni addons sin auditoría.
7. En 08, seleccionar únicamente ayuda PWA/persistencia que reduzca trabajo, tras auditarla. No nube, autenticación ni voz obligatoria.
8. No se prevén modelos IA dentro del runtime ni instalación de generadores locales para MVP1. Una ayuda de autoría se evaluaría por necesidad demostrada y autorización de su fase, conservando una ruta de producción sin pagos obligatorios. Remotion/FFmpeg para exportación, conectores y hosting permanecen fuera del alcance; la alternativa Player conserva su revisión arquitectónica separada.

Familia a evaluar: React 19 / Fiber 9 / react-three-rapier 2. Las fuentes oficiales confirman esa relación; los patches y Three/Rapier exactos quedan pendientes. Node detectado satisface el mínimo general de Vite, no una matriz completa de compatibilidad.

## Próximos comandos propuestos

**No ejecutarlos como bootstrap ahora.** Estas comprobaciones pueden repetirse en la fase autorizada; ejecutarlas desde la carpeta del proyecto:

~~~powershell
Get-Location
git -c safe.directory=C:/Users/mario.sabaleta/Documents/GitHub/Fut360 status --short
Get-Command git,node,npm.cmd,pnpm.cmd,blender -ErrorAction SilentlyContinue |
  Select-Object Name,Source
node --version
npm.cmd --version
pnpm.cmd --version
Test-Json -Json (Get-Content -Raw content/examples/mvp1-60min.workout.json) -SchemaFile content/schemas/workout.schema.json
~~~

No se proporciona un comando de instalación con latest ni una versión inventada. Tras fijar manifests/lockfile en 02, los comandos de aceptación previstos son pnpm install --frozen-lockfile, pnpm lint, pnpm typecheck, pnpm test y pnpm build, **solo cuando existan scripts y la instalación esté autorizada**. Playwright y validación de assets se añadirán según la fase. No ejecutar npx/dlx durante la auditoría.

El validador original tools/validate_blueprint.py pasó antes de editar, pero su manifiesto es del paquete inicial; tras cambios documentales detectará hashes distintos. En la siguiente fase se debe decidir cómo conservar la referencia de importación y comprobar el estado vivo, sin confundir ambos.

## Riesgos y criterios de decisión

| Riesgo | Respuesta prevista |
|---|---|
| No hay clip técnico apto gratuito | Inventariar primero, luego autoría mínima sobre rig existente. No completar la hora con placeholders. |
| Exportado gratuito insuficiente para editar | Probar otra base reutilizable; no depender de Source de pago. |
| Silla/tapete/cuerpo no caben en 2×2 | Revisar variante o regresión y luego dosis/fixture; no reducir ficticiamente props ni esconderlos. |
| Sesión draft sin revisión humana | Mantener modo de prueba y bloquear la declaración de entrenamiento aprobado. La revisión humana también requiere disponibilidad real. |
| Blender o GPU no utilizables | Verificar instalación/capacidad cuando corresponda; reducir carga antes de considerar gasto. |
| Deriva o ambigüedad temporal | Contratos y reloj falso antes de 3D; pausa/cámara no alteran dosis. |
| PWA móvil no dispone de origen seguro | Resolver ruta gratuita y permisos en 08; no desactivar seguridad ni prometer que HTTP LAN basta. |
| Licencias/servicios cambian o exigen pago | Revisar solo integración afectada y usar alternativa compatible; mantener núcleo local y formatos neutrales. |

El cierre actual entrega la fase 01 documental completada por el agente. El usuario pidió avanzar autónomamente dentro del alcance autorizado, sustituyendo el repaso obligatorio paso a paso. La fase 02 queda sin autorización; su [alcance concreto, versiones candidatas y controles](phase02-ready.md) están preparados para una sola decisión de avance. No falta una respuesta técnica o deportiva del usuario para entregar estos documentos.
