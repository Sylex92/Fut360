# Fut360 — Jugador Total Coach

Actualizado: 2026-09-30. Fase 04 cerrada como prototipo técnico: avatar riggeado, bisagra de cadera, cámaras, preparación automática y pausa/inspección. Funcionamiento en Samsung y claridad de la demostración aceptados por el usuario. Todavía no es la rutina aprobada de una hora.

**Consulta [PROJECT_STATUS.md](PROJECT_STATUS.md) para continuar.** Fases 00–04 completadas como base, incluido Blender portable autorizado. [Cierre de 04 y límites](docs/reviews/phase04-closeout.md). 05–09 no autorizadas. START_HERE conserva la preparación histórica: no repetir extracción ni inicialización de Git.

## Ejecutar la base

Desde jugador-total-coach, con las dependencias locales ya instaladas:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/. [Preparación reproducible y comandos](docs/setup/LOCAL_DEVELOPMENT.md), [resultado de fase 02](docs/reviews/phase02-bootstrap-review.md) y [dependencias/licencias](docs/reviews/phase02-dependencies.md).

La sección **Bisagra de cadera** permite ensayos técnicos de uno o cinco minutos del mismo gesto. Incluye tres vistas, pausa/continuación, inspector lento, omisión, repetición/cancelación y +30 s/+1 min de preparación con autoinicio. Ocultar la página pausa; volver retoma automáticamente si estaba en marcha y no hubo otro motivo de pausa. Pausa manual y fallos mantienen «Continuar». Todo permanece en memoria: recargar pierde la prueba. No seguir sus intervalos como rutina deportiva. El diagnóstico histórico de 60 minutos sigue disponible en un desplegable.

128 pruebas, lint, tipos, formato y build correctos. GLB validado y fuente editable conservada. [Licencias nuevas](docs/reviews/phase04-dependencies.md) y [registro de assets](ASSET_LICENSES.md). [Pruebas E2E y capturas reales](docs/reviews/phase04-browser-review.md): minuto completo, cámaras, preparación/pausa/inspector, repetición/omisión, ancho reducido y recuperación de fallos. Cinco minutos aceptados por reporte del usuario. Consola normal sin errores y con un aviso de THREE.Clock en Fiber. El conector IAB sigue fallando, pero se utilizó un navegador Playwright independiente. La primera muestra RAF fue lenta; al poner el navegador al frente, con avatar en marcha, se midieron 1201 intervalos en 20 s, mediana 16,6 ms y p95 17 ms. Es una muestra breve de escritorio, no una garantía de rendimiento móvil. Avance autónomo, consultando solo decisiones indispensables o ampliaciones de alcance.

La explicación completa permanece junto al cronómetro; las indicaciones dinámicas inferiores se agrupan en dos mitades de 4 s. Cámaras arriba, controles debajo, preparación compacta e inspector próximo al botón, con foco comprobado. Tamaño original restituido y menor apertura de brazos, conservando malla/pesos y la corrección de hombros aceptada. Última corrección: durante pausa se indica preparación pendiente, sin anunciar un autoinicio que no puede ocurrir hasta continuar. [Guía y resultados](docs/reviews/phase04-manual-check.md).

## Decisiones vigentes

Validación más reciente de 04 (2026-09-30): recorrido de cinco minutos aceptado por reporte y controles de escritorio comprobados por el agente. El usuario confirma PC/teléfono en la misma Wi-Fi; preview temporal de la app compilada en puerto 4174 preparado y verificado desde la computadora, sin cambios de firewall. El usuario confirma que las comprobaciones móviles salieron bien; [registro y límites](docs/reviews/phase04-mobile-review.md). El usuario confirma después que la demostración se entiende claramente. 04 cerrada como prototipo; no se valida la dosis deportiva. Siguiente alcance: prueba acotada de contactos pie–balón con comparación guiada, pendiente de autorización.

- MVP1: sesión fija de 60 minutos, avatar 3D genérico y espacio 2×2 m.
- Claridad, continuidad y funcionalidad antes que hiperrealismo.
- Costo cero para construcción/uso local: se admite software gratuito abierto o no abierto, con derechos compatibles. Ver ZERO_COST_AND_GROWTH_POLICY.md.
- Crecimiento funcional sin nuevos pagos obligatorios; revisar costos y licencias antes de cada ampliación.
- Reutilizar motores, humanoides riggeados y herramientas de animación existentes.
- Demostración guiada y simulación física son modos separados.
- Remotion es candidato permitido, condicionado a su uso elegible y revisión de versión, para exportación local futura. No se instala en MVP1 por alcance; ya no hay veto FOSS. Ver ADR 0008.

## Qué debes hacer primero

La secuencia siguiente describe el inicio original del paquete. El trabajo actual continúa según PROJECT_STATUS; [informe de arquitectura](docs/reviews/architecture-review.md), [contrato de sesión](docs/architecture/SESSION_ENGINE_CONTRACT.md) y [primer ejercicio visible](docs/plans/first-visible-exercise-ready.md) registran la fase 01. No ejecutar fases posteriores por leer sus prompts.
1. Extraer este paquete en una carpeta local.
2. Abrir esa carpeta en Codex Local con tu cuenta de ChatGPT.
3. Ejecutar SOLO `prompts/00-spec-only.md`.
4. Revisar la auditoría antes de pasar a arquitectura o código.

`docs/plans/ROADMAP.md` indica el orden 00–09. `PROJECT_STATUS.md` conserva el estado entre chats.

## Qué está comprobado en este paquete
El workout original conserva su hash, valida contra su esquema y suma 3600 segundos. Se compila sin alterarlo en 60 ocurrencias para probar el motor. Sigue en draft: validar los datos no acredita técnica ni adecuación deportiva. En 04 se añadieron únicamente herramientas/recursos auditados del primer gesto; PWA/offline, móvil, persistencia, contactos con balón y contenido de toda la hora siguen pendientes.
