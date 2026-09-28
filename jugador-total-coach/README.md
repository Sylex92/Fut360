# Fut360 — Jugador Total Coach

Actualizado: 2026-09-28. Fase 02 implementada: base web local con diagnóstico del archivo de sesión. Todavía no es un entrenador ejecutable con avatar.

**Consulta [PROJECT_STATUS.md](PROJECT_STATUS.md) para continuar.** Fases 00 y 01 aceptadas; 02 autorizada e implementada con verificaciones técnicas, recorrido manual básico y captura revisada. Integración Git pendiente; 03 no autorizada. START_HERE conserva la preparación histórica: no repetir extracción ni inicialización de Git.

## Ejecutar la base

Desde jugador-total-coach, con las dependencias locales ya instaladas:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/. [Preparación reproducible y comandos](docs/setup/LOCAL_DEVELOPMENT.md), [resultado de fase 02](docs/reviews/phase02-bootstrap-review.md) y [dependencias/licencias](docs/reviews/phase02-dependencies.md).

24 pruebas, lint, tipos y build correctos. Render HTML y HTTP verificados. El usuario confirmó resultado/contador del botón, apertura/cierre del desplegable y uso por teclado de ambos; no observó problemas al reducir el ancho ni errores en consola durante el recorrido. [Captura aportada por el usuario](docs/reviews/evidence/phase02-diagnostic-user.png) conservada e inspeccionada sin incidencias en la zona visible. El conector de navegador del agente sigue sin conectar: la interacción y consola se sustentan en el reporte manual, y la imagen en inspección directa. Integración Git pendiente; pruebas móviles para sus fases y sin certificación integral de accesibilidad. El usuario restableció el avance autónomo tras el repaso manual; consultar únicamente decisiones indispensables o ampliaciones de alcance.

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
El workout original conserva su hash, valida contra su esquema y suma 3600 segundos. La aplicación base calcula y muestra ese diagnóstico. El fixture sigue en draft: validar los datos no acredita técnica ni adecuación deportiva. Dependencias de 02 instaladas localmente; ningún modelo, animación, Blender o motor 3D incorporado. PWA/offline, móvil, reloj y avatar siguen pendientes.
