# Fut360 — Jugador Total Coach

Actualizado: 2026-09-29. Fase 04 implementada: primer avatar riggeado y bisagra de cadera, con cámaras, preparación automática y pausa/inspección. Demostración en revisión; aceptación en navegador y humana pendientes. Todavía no es la rutina aprobada de una hora.

**Consulta [PROJECT_STATUS.md](PROJECT_STATUS.md) para continuar.** Fases 00–03 aceptadas como base; 04 autorizada, incluido Blender portable, con [informe y pendientes](docs/reviews/phase04-vertical-slice-review.md). 04 no cerrada; 05–09 no autorizadas. START_HERE conserva la preparación histórica: no repetir extracción ni inicialización de Git.

## Ejecutar la base

Desde jugador-total-coach, con las dependencias locales ya instaladas:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/. [Preparación reproducible y comandos](docs/setup/LOCAL_DEVELOPMENT.md), [resultado de fase 02](docs/reviews/phase02-bootstrap-review.md) y [dependencias/licencias](docs/reviews/phase02-dependencies.md).

La sección **Bisagra de cadera** permite ensayos técnicos de uno o cinco minutos del mismo gesto. Incluye tres vistas, pausa/continuación, inspector lento, omisión, repetición/cancelación y +30 s/+1 min de preparación con autoinicio. Ocultar la página pausa; volver exige continuar. Todo permanece en memoria: recargar pierde la prueba. No seguir sus intervalos como rutina deportiva. El diagnóstico histórico de 60 minutos sigue disponible en un desplegable.

108 pruebas, lint, tipos y build correctos; GLB validado y fuente editable conservada. [Licencias nuevas](docs/reviews/phase04-dependencies.md) y [registro de assets](ASSET_LICENSES.md). Se corrigió un aviso falso de WebGL disparado al montar el contenido de respaldo de Canvas. Renders de Blender y dos capturas del fallo aportadas por el usuario conservados; visualización posterior a la corrección pendiente. El conector sigue sin conectar. La revisión manual/captura de 03 no valida automáticamente 04. El usuario mantiene avance autónomo; consultar únicamente decisiones indispensables o ampliaciones de alcance.

## Decisiones vigentes
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
