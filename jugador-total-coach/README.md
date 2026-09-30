# Fut360 — Jugador Total Coach

Actualizado: 2026-09-30. **Fase 05 implementada y verificada técnicamente:** comparación entre un interior-interior guiado y contactos reales calculados por Rapier. Dos modos separados, cámaras, detalle de pies, pausa/reinicio y revisión lenta. La bisagra de 04 sigue disponible.

**Consulta [PROJECT_STATUS.md](PROJECT_STATUS.md) para continuar.** [Informe de 05 y evidencias](docs/reviews/phase05-contact-review.md), [licencias/costos](docs/reviews/phase05-cost-and-dependencies.md), [registro de recursos](ASSET_LICENSES.md). El usuario confirma buen funcionamiento del nuevo caso en computadora y Samsung y reconoce las campanitas. Se aclara en pantalla que el laboratorio es una prueba de contactos, no otra variante del ejercicio; revisión deportiva pendiente. 06–09 no autorizadas. Todavía no es una rutina aprobada de una hora.

## Ejecutar la aplicación

Desde jugador-total-coach, con dependencias locales instaladas:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/. El preview local existente en http://127.0.0.1:4173/ sirve el build actualizado; recargar la página. Elegir «Pie y balón · fase 05» o «Bisagra de cadera · fase 04». Cambiar de ejemplo reinicia la prueba, sin guardar entrenamiento.

- Demostración guiada de campanitas (interior-interior): cuerpo y balón en un clip finito de 10 s, pausa, media velocidad, revisión de instante y tres vistas. Trayectoria ilustrativa; contenido draft.
- Laboratorio: Rapier 0.19.2/react-three-rapier 2.2.0; pie cinemático, balón dinámico y suelo fijo. Contactos lentos/rápidos, forma aislada o huesos del avatar, colliders opcionales y reinicio explícito. El avatar no adapta sus pies si el balón se desvía: el resultado no enseña un control orientado. Se detiene al salir del área. El tiempo visible representa el recorrido del clip; en rápido se recorre a 4× sin cambiar gravedad/paso físico.
- Bisagra: ensayo de uno/cinco minutos ya aceptado como prototipo en escritorio y Samsung, con preparación automática, +30/+60, pausa e inspector. Se conserva ese comportamiento.

132 pruebas, lint, tipos, formato y build correctos; dos GLB validados, fuentes editables y avisos locales. Pruebas CPU de contactos a 30/60/120 Hz y comprobación adicional del wrapper en navegador. Consola normal sin errores, con avisos de obsolescencia documentados de Fiber/Rapier; build advierte chunks grandes. Viewport de 390 px comprobado, distinto de móvil físico. [Desarrollo local](docs/setup/LOCAL_DEVELOPMENT.md).

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
El workout original conserva su hash, valida contra su esquema y suma 3600 segundos. Se compila sin alterarlo en 60 ocurrencias para probar el motor. Sigue en draft: validar los datos no acredita técnica ni adecuación deportiva. En 04 se añadieron únicamente herramientas/recursos auditados del primer gesto; PWA/offline, móvil, persistencia, contactos con balón y contenido de toda la hora siguen pendientes.
