# Jugador Total Coach — Inicio desde cero (v4)

Fecha: 2026-09-24. Este paquete es una especificación; no contiene una aplicación ni assets 3D.

**Empieza leyendo `START_HERE.md`.** No necesitas combinar paquetes anteriores ni ejecutar una migración: el usuario aún no inició el proyecto.

## Decisiones vigentes
- MVP1: sesión fija de 60 minutos, avatar 3D genérico y espacio 2×2 m.
- Claridad, continuidad y funcionalidad antes que hiperrealismo.
- Costo cero para construcción/uso local: se admite software gratuito abierto o no abierto, con derechos compatibles. Ver ZERO_COST_AND_GROWTH_POLICY.md.
- Crecimiento funcional sin nuevos pagos obligatorios; revisar costos y licencias antes de cada ampliación.
- Reutilizar motores, humanoides riggeados y herramientas de animación existentes.
- Demostración guiada y simulación física son modos separados.
- Remotion es candidato permitido, condicionado a su uso elegible y revisión de versión, para exportación local futura. No se instala en MVP1 por alcance; ya no hay veto FOSS. Ver ADR 0008.

## Qué debes hacer primero
1. Extraer este paquete en una carpeta local.
2. Abrir esa carpeta en Codex Local con tu cuenta de ChatGPT.
3. Ejecutar SOLO `prompts/00-spec-only.md`.
4. Revisar la auditoría antes de pasar a arquitectura o código.

`docs/plans/ROADMAP.md` indica el orden 00–09. `PROJECT_STATUS.md` conserva el estado entre chats.

## Qué está comprobado en este paquete
El workout de ejemplo valida contra su esquema y suma 3,600 segundos. Esto es una comprobación de datos, no una validación deportiva ni una prueba de una aplicación. El fixture sigue en draft. No se han instalado dependencias, descargado modelos ni ejecutado animaciones. Los prompts son instrucciones de trabajo, no tareas ya realizadas.
