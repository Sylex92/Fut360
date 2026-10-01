# Fut360 — Jugador Total Coach

Actualizado: 2026-09-30. **Fase 06 en curso: biblioteca con quince ejemplos de once patrones.** Se reutilizan el avatar y las herramientas existentes. Falta el patrón de empuje: la referencia de silla plástica lleva a proponer una variante en pared, pendiente de confirmar ese soporte. Aún no es una rutina aprobada de una hora. 07–09 no autorizadas.

Corrección actual: nueve animaciones con coordinación de brazos, tronco y apoyos; mismo diseño del avatar. Marcha con seis pasos y campanitas con cuatro toques; variantes básicas sin saltos. [Cambios y verificación](docs/reviews/phase06-natural-motion-review.md). Al abrir la biblioteca se muestra la marcha para facilitar su revisión.

**Consulta [PROJECT_STATUS.md](PROJECT_STATUS.md) para continuar.** [Informe de 06](docs/reviews/phase06-pipeline-review.md), [fundamento interno por ejercicio](docs/training/PHASE06_DOCUMENTARY_REVIEW.md), [costo/reutilización](docs/reviews/phase06-cost-and-reuse.md), [recursos/licencias](ASSET_LICENSES.md). La investigación no aparece en la app. No se exige contratación externa para avanzar ni se atribuye revisión profesional a las fuentes.

## Ejecutar la aplicación

Desde jugador-total-coach, con dependencias locales existentes:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/. El preview existente en http://127.0.0.1:4173/ sirve el build: recargar y elegir «Movimientos · fase 06». El teléfono usa el preview LAN documentado en desarrollo local.

- Biblioteca: selector de movimiento, frontal/lateral/tres cuartos y «Detalle de pies» en los ejercicios con balón, pausa, revisión por instante y media velocidad. Cada ejemplo termina; reproducir otra vez es explícito. Campanitas ofrece también 2× para observar. El ritmo visual no prescribe el ritmo de entrenamiento.
- Puente y pierna alterna: vista de suelo; el ejemplo empieza ya tumbado. No se han animado las transiciones de bajar/levantarse. Respiración: postura cómoda quieta, sin metrónomo obligatorio.
- «Pie y balón · fase 05» conserva demostración guiada y laboratorio Rapier separado. El laboratorio prueba contactos; no enseña una variante cuando el balón se desvía.
- «Bisagra de cadera · fase 04» conserva su prueba de uno/cinco minutos con preparación y +30/+60 automáticos, pausa e inspector.

179 pruebas, lint y tipos correctos; nueve GLB v2 pasan Khronos, además de la línea base anterior. La biblioteca selecciona quince ejemplos; el build conserva también las campanitas v1 para 05 (dieciséis GLB). Fuentes editables, manifiestos, muestras de apoyos/contactos y vistas guardadas. El usuario confirma revisión favorable de las animaciones corregidas y detalle de pies en computadora y Samsung; mantienen draft como contenido deportivo. [Desarrollo local](docs/setup/LOCAL_DEVELOPMENT.md), [pipeline de autoría](docs/3d/ANIMATION_PIPELINE.md).

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
El workout original conserva su hash, valida contra su esquema y suma 3600 segundos. Se compila sin alterarlo en 60 ocurrencias para probar el motor. Sigue en draft: validar los datos no acredita técnica ni adecuación deportiva. 04/05 tienen aceptación funcional en computadora/Samsung. En 06 el usuario confirma ambos dispositivos para los movimientos corregidos y la vista de pies. PWA/offline, persistencia y contenido de toda la hora siguen pendientes.
