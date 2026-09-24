# Plan de ejecución MVP1 — resultado de fase 00

Fecha: 2026-09-24. **Propuesta para revisión. Solo se ha ejecutado la fase 00.**
Objetivo: sesión fija de 3,600 s en 2×2 m, comprensible a velocidad normal, avatar 3D reutilizado y genérico, operación local sin nuevos pagos obligatorios. No se persigue hiperrealismo.

## Evidencia y prioridades

Verificado: fixture válido contra su esquema, 3,600 s, 31 IDs, 60 intervalos; motores con licencias candidatas compatibles y archivos Standard publicados. Pendiente: catálogo, assets concretos, revisión deportiva, espacio, versiones transitivas, Blender ejecutable y Android. Supuesto: hip-hinge será el primer gesto y Base Characters Standard el primer avatar a evaluar.

Las auditorías de [especificación](../reviews/spec-audit.md), [entorno](../reviews/environment-report.md), [licencias](../reviews/license-audit.md), [reutilización](../reviews/reuse-audit.md) y [costos](../reviews/feature-cost-matrix.md) son entradas de la siguiente fase, no una autorización para implementar.

## Secuencia 00–09 y condiciones de avance

| Fase | Alcance acotado | Evidencia exigida para cerrar |
|---|---|---|
| 00 — auditoría | Solo diagnóstico, investigación y documentos | Seis entregables, recálculo/esquema comprobados, incertidumbres visibles y PROJECT_STATUS actualizado. Revisión/aceptación del usuario pendiente. |
| 01 — arquitectura | Resolver hallazgos S02–S09 y S11–S14; contratos Workout/Exercise/AnimationAsset/Scene; límites de módulos y Definition of Ready | Invariantes y autoridad explícitas; política de transiciones/repeticiones/lados/recuperación; cobertura de catálogo verificable; sin UI, instalaciones ni adaptadores futuros vacíos. |
| 02 — bootstrap mínimo | Monorepo pnpm, React/Vite/TS, validación existente, pruebas y herramientas mínimas auditadas | Versiones exactas compatibles, lockfile/transitivas/avisos; scripts locales de lint/typecheck/test/build pasan, fixture 3600 validado y pantalla de diagnóstico. CI remoto no activado; offline completo se prueba en 08. |
| 03 — motor de sesión | Reloj inyectable y estados; vista de texto | Pausa congela; límite de intervalo exacto; finalización única; skip/repeat/abort idempotentes según contrato; descansos de 0; ticks grandes; duración prevista separada de tiempo real. |
| 04 — primer ejercicio 3D | Avatar gratuito concreto y un gesto comprensible de 60 s; después prueba de 5 min con contenido disponible | Archivo/hash/licencia/mapping, tres cámaras, pausa/reanudación y cambio de vista sin reinicio; E2E y evidencia normal frontal/lateral; límites 2×2 documentados. Fallback solo draft para diagnóstico. |
| 05 — contactos aislados | Rapier, suelo fijo, pie cinemático, balón dinámico; comparar con inside-inside guiado | Contacto lento/rápido, debug, pausa/reset, tasas de render distintas y tolerancias registradas; authored y rapier nunca escriben simultáneamente al mismo balón. No validación deportiva por física. |
| 06 — pipeline y primeros clips | Blender/retarget/exportador existentes; hip-hinge, inside-inside y glute-bridge; solo autoría faltante | GLB validado, fuente importable, mapping, FPS/duración, bucle, apoyos, contacto, lados, bounds, cámaras y procedencia. ReviewStatus con evidencia; revisión humana pendiente donde falte. |
| 07 — sesión completa | Catálogo/timeline de los 31 IDs y sus variantes; ronda/lado/cues/descanso/next/beep/controles | 3600 exactos, pruebas acelerada y a velocidad normal, cobertura por ID/variante: listo/draft/fallback/pendiente. No se cierra entrenamiento con placeholders. Fuerza admite repeticiones objetivo y descanso restante revisados. |
| 08 — offline y registros | PWA/cache local, persistencia, recuperación, feedback, exportación/importación acordada en 01 y borrado | Tras carga completa y red bloqueada, reiniciar y reproducir todos los recursos; recarga segura; historial y registros incompletos; recuperación e importación sin duplicados; origen seguro móvil documentado. |
| 09 — revisión de salida | Matriz requisito/evidencia y defectos dentro del alcance; propuesta MVP2 separada | Lint/typecheck/tests/E2E, prueba real de hora, offline, teclado/subtítulos/contraste/silencio, Android identificado y medido, licencias de todos los recursos, cero placeholders y revisión humana real. Ninguna funcionalidad nueva. |

Una fase por mensaje y aceptación de la anterior registrada antes de avanzar. Esta fase no modifica los contratos ni implementa las decisiones propuestas para 01.

## Primer ejercicio: Definition of Ready propuesta

- Ficha draft hip-hinge con espacio, cues, errores, regresión, dosis y lado explícitos; sin presentar un ejercicio no revisado como rutina aprobada.
- Avatar gratuito exacto con rig/feet/toes y derechos comprobados; material neutro y legible.
- Un clip adecuado, cíclico solo si lo demuestra. Si no existe en el catálogo gratuito, registrar la carencia y adaptar/animar ese gesto con Blender.
- Envolvente de cuerpo y props dentro del espacio declarado, más entradas/salidas; alturas y tolerancias explicitadas.
- Reloj y comandos de fase 03 disponibles; una fuente de tiempo para cuerpo, balón futuro y cues; evidencia frontal/lateral/3/4.

No esperar a la fase 06 para resolver el único clip necesario en 04: en 01 se debe acordar la mínima preparación de asset autorizada para la rebanada. La fase 06 sistematiza y amplía el pipeline, no justifica mostrar oscilaciones genéricas mientras tanto.

## Instalación mínima propuesta, nunca ejecutada en fase 00

1. Fase 01 sigue solo documental. No cambiar Git/Node ni remediar globalmente la propiedad del repositorio.
2. Antes de 02, comprobar Node y gestor fuera del entorno privado de Codex; seleccionar versiones mantenidas compatibles y fijarlas. No actualizar globalmente herramientas de otros proyectos. Cualquier instalación requiere una fase autorizada con versión, procedencia y licencia concretas.
3. En 02, solo herramientas de UI/build/TS, validación, pruebas y lint/format realmente necesarias. No instalar un catálogo completo de motores/exportadores. Revisar scripts/transitivas; preparar pruebas locales sin servicio CI obligatorio.
4. En 04, añadir Three/Fiber, avatar y un clip, con descargas autorizadas e inventario. Si adaptar ese clip requiere Blender, comprobar primero si hay ejecutable utilizable y proponer el mínimo necesario.
5. En 05, añadir Rapier/wrapper compatibles y WASM local.
6. En 06, completar Blender/exportador/validador glTF. No comprar Source, instalar auto-riggers ni addons sin auditoría.
7. En 08, seleccionar únicamente ayuda PWA/persistencia que reduzca trabajo, tras auditarla. No nube, autenticación ni voz obligatoria.
8. Remotion, FFmpeg, modelos IA, conectores y hosting no se instalan para MVP1.

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

El cierre actual es entregar y revisar la fase 00. El siguiente trabajo posible es prompts/01-architecture-review.md tras una instrucción explícita; no se ha iniciado.

