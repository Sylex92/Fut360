# Fut360 — Jugador Total Coach

Visión actualizada el 2026-10-02: [diseñar, mostrar y seguir entrenamientos conversando desde la app](docs/product/ADAPTIVE_FOOTBALL_COACH_VISION.md). [Objetivos de gol, extremo, mediocentro y defensa](docs/training/ROLE_AND_ENVIRONMENT_PLAN.md) y [opciones/costos de conversación](docs/reviews/conversational-coach-feasibility.md) documentados. Casa 2×2 y 60 minutos siguen como primer caso; el planificador flexible y la conversación son funciones por construir. Datos personales fuera de Git; no inferir capacidad actual de la frecuencia histórica de juego.

Actualizado: 2026-10-01. **Fase 07 implementada y verificada técnicamente: sesión v2 de 60 minutos.** El usuario considera correcto el flujo y cuestiona repetición/nivel; [revisión de contenido abierta](docs/reviews/phase07-content-reassessment.md). Fase 06 aceptada en claridad, incluido el empuje contra pared. Se integran dieciséis ejemplos de doce patrones, 52 intervalos y seis bloques, conservando el fixture histórico. [Informe y pruebas de una hora real](docs/reviews/phase07-hour-review.md), [dosis y transiciones](docs/training/PHASE07_SESSION_REVIEW.md), [cierre de 06](docs/reviews/phase06-closeout.md). Programa/recursos siguen draft: no se atribuye adecuación personal ni revisión profesional. No ejecutar 08–09.

Recursos heredados de 06: nueve animaciones con coordinación de brazos, tronco y apoyos; mismo diseño del avatar. Marcha con seis pasos y campanitas con cuatro toques; variantes básicas sin saltos. [Cambios y verificación](docs/reviews/phase06-natural-motion-review.md). Al abrir la biblioteca se muestra la marcha para facilitar su revisión.

Planificación ampliada solicitada el 2026-10-01: [desarrollo gradual de 24 semanas y horizonte de 52](docs/training/GRADUAL_DEVELOPMENT_PLAN.md), [fuentes y canales aportados](docs/reviews/progressive-training-sources.md) y [ruta de corrección de la hora](docs/plans/phase07-progressive-content.md). Propuesta condicionada a capacidades y contexto; no promesa de profesionalización ni programa anual implementado. La aplicación conserva v2 mientras se prepara el contenido siguiente.

**Consulta [PROJECT_STATUS.md](PROJECT_STATUS.md) para continuar.** [Informe de 06](docs/reviews/phase06-pipeline-review.md), [fundamento interno por ejercicio](docs/training/PHASE06_DOCUMENTARY_REVIEW.md), [costo/reutilización](docs/reviews/phase06-cost-and-reuse.md), [recursos/licencias](ASSET_LICENSES.md). La investigación no aparece en la app. No se exige contratación externa para avanzar ni se atribuye revisión profesional a las fuentes.

## Ejecutar la aplicación

Desde jugador-total-coach, con dependencias locales existentes:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/. El preview existente en http://127.0.0.1:4173/ sirve el build: recargar para abrir «Sesión de 60 minutos». El teléfono usa el preview LAN documentado en desarrollo local.

- Sesión v2: precarga todos los movimientos, timeline, lado/ronda, siguiente ejercicio, preparación automática, +30 s/+1 min, pausa, inspección lenta, repetición, omisión y final sonoro silenciable. Mientras está activa hay que terminarla para cambiar de vista. Recargar descarta el recorrido; persistencia pertenece a 08.
- Para E2E exclusivamente, `?e2e=1` acelera el programa ×60 con aviso visible: no seguir los ejercicios. Abrir sin ese parámetro para tiempo real.

- Biblioteca: selector de movimiento, frontal/lateral/tres cuartos y «Detalle de pies» en los ejercicios con balón, pausa, revisión por instante y media velocidad. Cada ejemplo termina; reproducir otra vez es explícito. Campanitas ofrece también 2× para observar. El ritmo visual no prescribe el ritmo de entrenamiento.
- Puente y pierna alterna: vista de suelo; el ejemplo empieza ya tumbado. No se han animado las transiciones de bajar/levantarse. Respiración: postura cómoda quieta, sin metrónomo obligatorio.
- «Pie y balón · fase 05» conserva demostración guiada y laboratorio Rapier separado. El laboratorio prueba contactos; no enseña una variante cuando el balón se desvía.
- «Bisagra de cadera · fase 04» conserva su prueba de uno/cinco minutos con preparación y +30/+60 automáticos, pausa e inspector.

217 pruebas generales correctas, más el ensayo real de una hora ejecutado aparte; lint, tipos, formato y build correctos. [Evidencias y límites de 07](docs/reviews/phase07-hour-review.md). Los dieciséis recursos conservan la verificación geométrica/Khronos de 06 y sus archivos sin cambios; el build conserva también las campanitas v1 para 05 (diecisiete GLB). El usuario confirmó las animaciones corregidas y detalle de pies en computadora y Samsung; posteriormente considera correcto el flujo de la hora, con objeciones al contenido pendientes de resolver. [Desarrollo local](docs/setup/LOCAL_DEVELOPMENT.md), [pipeline de autoría](docs/3d/ANIMATION_PIPELINE.md).

## Decisiones vigentes

Fase 04 conserva su aceptación de funcionamiento móvil y claridad por el usuario; [cierre y límites](docs/reviews/phase04-closeout.md). Fase 05 fue autorizada mediante «vamos con la fase 5»; su funcionamiento en computadora y Samsung queda aceptado por reporte del usuario, con los límites descritos arriba.

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
El workout original conserva su hash y sus 60 ocurrencias como regresión del motor. La nueva hora v2 tiene 52 intervalos explícitos y todos sus recursos resueltos; validar datos y reproducción no acredita adecuación deportiva individual. 04/05 tienen aceptación funcional en computadora/Samsung. En 06 el usuario confirmó ambos dispositivos para los movimientos corregidos y la vista de pies, y después aceptó la claridad del empuje en pared. PWA/offline y persistencia pertenecen a 08; todavía no se implementan.
