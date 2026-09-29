# Fut360 — Jugador Total Coach

Actualizado: 2026-09-28. Fase 03 cerrada técnicamente: diagnóstico y motor temporal con vista de texto, pruebas automatizadas, recorrido manual básico y captura revisada. El usuario reporta avance/botones/Tab/ancho correctos y consola sin errores. Todavía no es un entrenador ejecutable con avatar.

**Consulta [PROJECT_STATUS.md](PROJECT_STATUS.md) para continuar.** Fases 00–02 aceptadas como base; 03 autorizada, con [informe de implementación y pendientes](docs/reviews/phase03-session-engine-review.md). Fases 04–09 no autorizadas. START_HERE conserva la preparación histórica: no repetir extracción ni inicialización de Git.

## Ejecutar la base

Desde jugador-total-coach, con las dependencias locales ya instaladas:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/. [Preparación reproducible y comandos](docs/setup/LOCAL_DEVELOPMENT.md), [resultado de fase 02](docs/reviews/phase02-bootstrap-review.md) y [dependencias/licencias](docs/reviews/phase02-dependencies.md).

La sección **Prueba el avance automático** ofrece una secuencia técnica de un minuto y el archivo histórico de 60 minutos. Incluye inicio, pausa, continuación, omisión, repetición/cancelación y +30 s/+1 min de preparación con autoinicio. Ocultar la página pausa; volver exige continuar. Todo permanece en memoria: recargar pierde la prueba. No seguir sus intervalos como rutina deportiva.

85 pruebas, formato, lint, tipos y build correctos, incluida una corrección de redondeo detectada al revisar la [captura de 03](docs/reviews/evidence/phase03-session-user.png). La captura y el reporte manual corresponden a la versión anterior al ajuste; la regresión automática verifica la corrección sin cambios de controles/layout. El conector sigue sin conectar: no se afirma E2E automatizado ni accesibilidad integral. Límites exactos en el informe de 03. El usuario mantiene avance autónomo; consultar únicamente decisiones indispensables o ampliaciones de alcance.

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
El workout original conserva su hash, valida contra su esquema y suma 3600 segundos. Se compila sin alterarlo en 60 ocurrencias para probar el motor. Sigue en draft: validar los datos no acredita técnica ni adecuación deportiva. Se reutilizan las dependencias de 02, sin nuevas dependencias externas en 03. PWA/offline, móvil, persistencia, Blender, modelos, animación y avatar siguen pendientes.
