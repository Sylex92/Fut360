# Revisión de arquitectura — fase 01

Fecha: 2026-09-27. Autorización: «Acepto y autorizo», como respuesta al cierre de 00 y ejecución únicamente de prompts/01-architecture-review.md. Fase 00 aceptada. Entrega documental de 01; sin aplicación, instalación, descarga, modelo, subida ni cambios globales. Fase 02 no ejecutada ni autorizada.

## Dictamen y evidencia

La arquitectura queda definida para empezar por una base pequeña, después el reloj y después un gesto visible. Se mantienen monorepo/monolito modular, dominio puro, Three/Fiber, reutilización de rig/Blender, laboratorio Rapier separado y persistencia local. No se crean paquetes ni contratos vacíos para futuras integraciones.

**Verificado:** documentos existentes, fixture v1, referencias y fuentes técnicas consultadas; controles documentales registrados al cierre. **Decidido para diseño:** árbol, dependencias, estados, contratos, catálogo objetivo y condiciones del primer gesto. **Pendiente de comprobar:** comportamiento real, versiones instaladas, compatibilidad de assets, fichas/dosis, revisión efectiva y dispositivos. “Definido” no significa “implementado”, “óptimo demostrado” ni “aprobado para entrenar”.

## Entregables del prompt 01

| Petición | Decisión y documento |
|---|---|
| Revisar arquitectura frente al MVP1 | [Arquitectura](../architecture/ARCHITECTURE.md): una app, sin backend/auth/microservicios; pruebas por fase |
| Árbol final | Mismo documento: domain, exercise-catalog, session-engine, viewer-3d, physics-lab, persistence; creación solo cuando se necesiten |
| Dependencias permitidas | Tabla explícita sin ciclos; app compone, visor no gobierna motor, dominio no importa plataforma |
| Máquina e invariantes | [Motor](../architecture/SESSION_ENGINE_CONTRACT.md): estados, fronteras, extras, omisiones, visibilidad, pausas, inspector y recuperación |
| Cuatro contratos | [Dominio](../architecture/DOMAIN_MODEL.md): WorkoutDefinition, ExerciseDefinition, AnimationAsset y SceneDefinition, referencias/versiones/revisión y registro |
| ADR duraderos | [0006](../architecture/adr/0006-rapier-and-guided-clips.md) y [0008](../architecture/adr/0008-zero-cost-extensible.md) consolidados; [0009](../architecture/adr/0009-session-time-and-recovery.md) nuevo para tiempo/recuperación. 0005/0007 históricos intactos |
| Primera rebanada preparada | [Definition of Ready](../plans/first-visible-exercise-ready.md): hip-hinge, evidencia por requisito y bloqueos reales |
| Reutilización por módulo | [Matriz](../architecture/REUSE_MATRIX.md): biblioteca existente, pieza específica faltante y prueba; sin recrear motores, rigs ni editores |

## Decisiones que verá el usuario

El programa base sigue durando 60 minutos. Una pausa añade tiempo real. “Repetir” añade una vuelta completa después del descanso actual, sin quitar ejercicios posteriores. Ver despacio es inspeccionar mientras la sesión está pausada y luego volver al punto guardado. Omitir conserva el descanso y registra lo omitido.

Durante el repaso, el usuario precisó que obtener más preparación no debe obligarle a volver para iniciar. La propuesta previa de espera manual queda retirada. Diseño vigente: ejemplo automático, acciones directas +30 s/+1 min que se suman al tiempo restante y comienzo automático con trabajo íntegro. Pausar todo sigue disponible para una interrupción indefinida. El motor registra la preparación extra aparte; mirar bucles no acredita práctica. [Evaluación de usabilidad corregida](usability-review.md), sin prototipo ni prueba humana.

La aplicación no puede saber que el usuario hizo una repetición solo porque el avatar la mostró. En fuerza, la serie visual es finita y el tiempo sobrante sirve para descansar; no bucle obligatorio hasta agotar el reloj.

El primer gesto evita inicialmente balón y apoyos externos para comprobar cuerpo/tiempo con menos variables. La fase 05 prueba contactos por separado. Un rebote convincente no sustituye revisar si se enseña bien el gesto.

Three/Fiber + AnimationMixer siguen como base. Remotion Player se comparó como alternativa real, pero no hay ahorro demostrado al añadir composición por fotogramas para este alcance; el dominio seguiría siendo necesario. No se descarta por licencia o rendimiento supuesto. La exportación posterior conserva Remotion como candidato condicionado, sin instalación.

## Catálogo y programa

[Catálogo](../training/EXERCISE_CATALOG_SCOPE.md): doce patrones adoptados para autoría, con condiciones y correspondencia de 31/31 IDs originales. [Sesión](../training/MVP1_60_MIN_SESSION.md): presupuesto 8/12/10/16/8/6 = 60 min, incluyendo demostraciones y recuperación. Las variantes pueden requerir más de doce clips.

No se ha fabricado un nuevo workout cambiando nombres. El fixture v1 conserva 2475 s de trabajo + 1125 s de descanso, 36 filas y 60 ocurrencias expandidas. Sirve como regresión técnica. El programa nuevo necesita fichas/dosis revisadas y referencias exactas; esa producción y migración se harán en fases técnicas.

La selección se fundamenta en la investigación de 00 y restricciones de contexto, no en facilidad de animación. La silla sigue condicionada a estabilidad/cabida. El usuario es revisor humano asignado; no se registra revisión realizada ni competencia profesional por su aceptación.

## Hallazgos de 00: resolución y pendientes

| Hallazgo | Resolución documental en 01 | Evidencia que falta y fase |
|---|---|---|
| S01: sin catálogo/assets | Alcance de doce patrones y mapping histórico | Fichas/archivos/licencias/revisión 04–07; cobertura actual cero |
| S02: transiciones | Preview durante descanso; demostración programada explícita | Compilador/reloj y preparación real 03/07 |
| S03: fuerza continua | Dosis finita y descanso sobrante, sin inferir repeticiones personales | Dosis y clips revisados 04–07 |
| S04: campos de ejercicio | Seguridad, lateralidad, apoyos, errores y regresión explícitos | Esquemas/definiciones y contenido 04–07 |
| S05: assets/escenas sin contrato | Referencias, rig, FPS, bounds, contactos, autoridad, evidencia | Schemas y archivos reales 04–06 |
| S06: invariantes semánticas | IDs/referencias/sumas/espacio positivos y validación en capas | Validadores 02–07; geometría/recorrido real 04–07 |
| S07: bucles indiscriminados | cyclic/finite/hold, entradas/salidas y serie finita | Reproducción/claridad 04–07 |
| S08: reloj/comandos/reload | Máquina, idempotencia, extra encolado, stop prioritario y Restore pausado | Tests 03 y almacenamiento 08 |
| S09: cámara lenta | Inspector pausado con retorno al cursor guardado | UI/pose sin deriva 04 |
| S10: 2×2 digital/real | Coordenadas, volumen barrido y props; no encoger para caber | Medidas/recorrido y revisión 04–07 |
| S11: datos/importación | Eventos/checkpoint transaccionales, límites, conflictos y borrado; feedback opcional | Persistencia/archivo/concurrencia/privacidad 08 |
| S12: dispositivos/rendimiento | Equipos fijados, objetivos medibles y protocolo | Versiones/mediciones PC y S24 FE 04/07–09 |
| S13: ADR/módulos vacíos | Árbol consistente, 0006/0008 vigentes, sin integraciones vacías | Imports se comprobarán cuando exista código |
| S14: CI/PWA prematuros | 02 scripts locales; offline completo 08; prompts armonizados | Bootstrap autorizado posterior, prueba origen seguro móvil 08 |
| S15: LICENSE raíz | Intacto, alcance no interpretado como permiso de publicar | Aclaración antes de distribuir, no bloquea docs locales |

Los contratos se implementan progresivamente: 02 valida v1 y crea solo dominio/catálogo mínimo; 03 implementa motor y plan interno; 04 incorpora esquemas/manifiestos necesarios de ejercicio/animación/escena para la primera ficha; 06 amplía recursos y validación; 07 compila nuevo WorkoutDefinition versionado. No duplicar tipos/esquemas ni llamar migrado a v1 por validar su formato antiguo.

## Archivos cambiados y motivo

| Grupo | Documentos | Motivo |
|---|---|---|
| Arquitectura | ARCHITECTURE, DOMAIN_MODEL, SESSION_ENGINE_CONTRACT nuevo, EXTENSIBILITY y REUSE_MATRIX | Árbol, contratos completos, límites y justificación de lógica propia |
| Decisiones | ADR 0006/0008; 0009 nuevo | Consolidar herramientas/costos y registrar tiempo/recuperación duraderos |
| Recurso 3D | AVATAR_CONTRACT, PHYSICS_AND_ANIMATION, ASSET_SELECTION, ANIMATION_PIPELINE | Coordenadas/mapping, una autoridad, primer candidato gratuito e importación editable sin requerir fuentes de pago |
| Producto/contenido | MVP1_PRD, EXERCISE_CATALOG_SCOPE, MVP1_60_MIN_SESSION | Comportamiento concreto y catálogo objetivo separado del fixture |
| Plan/calidad | first-visible-exercise-ready y phase02-ready nuevos, ROADMAP, mvp1-execution-plan, DEFINITION_OF_DONE | Requisitos de entrada, hitos, versiones candidatas y controles aplicables a una fase documental |
| Continuidad | AGENTS, README, START_HERE, PROJECT_STATUS | Autorización actual, avance autónomo solicitado y evitar repetir preparación inicial |
| Referencias y auditorías | spec-audit, training-design-recommendation, REMOTION_LICENSE_REVIEW, environment-report, license-audit | Enlazar decisiones actuales y nuevas consultas sin borrar evidencia de 00 ni declarar auditados artefactos inexistentes |
| Prompts posteriores | 02, 03, 04, 06, 07 | Evitar paquetes vacíos, repeat contradictorio, bucle forzado y 31 IDs como catálogo obligatorio; solo editar instrucciones, no ejecutarlas |
| Informe | Este documento nuevo | Trazabilidad, verificaciones, límites y siguiente paso |

## Verificaciones de esta entrega

El registro final de comprobaciones se conserva en [PROJECT_STATUS](../../PROJECT_STATUS.md). Comprobaciones de documentos y datos, sin sustituir tests de producto. No se ejecutan build, lint, typecheck, E2E ni pruebas visuales/deportivas sin aplicación/assets. No se creó commit; cierre de integración Git pendiente según Definition of Done.

## Fuentes reconsultadas

Consulta técnica del 2026-09-27: [AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html) para evaluación temporal; [Remotion Player](https://www.remotion.dev/docs/player/player) para composición interactiva; [visibilidad](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) y [performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) para límites del navegador; [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) para transacciones/cierre; [W3C Secure Contexts](https://www.w3.org/TR/secure-contexts/) para origen seguro. Las decisiones de producto se infieren de esas capacidades, no se atribuyen a las fuentes.

No se reauditaron todas las licencias ni precios de 00; conservan fechas y límites originales. Antes de incorporar paquetes/archivos se revisarán versión, dependencias y licencia concreta. No se promete gratuidad futura ilimitada.

Ampliación del cierre autónomo: reconsulta de las páginas del autor de Quaternius y metadatos públicos npm el 2026-09-27. [Selección 3D](../3d/ASSET_SELECTION.md) y [preparación de 02](../plans/phase02-ready.md) contienen fuentes y resultados. Se detectó TypeScript 7.0.2 fuera del rango declarado de typescript-eslint 8.70.1; la propuesta usa TypeScript 6.0.3. Se comprobó compatibilidad declarada con Node 22.14.0, no instalación. La consulta HTTP directa al registro requirió salir de la restricción de red de la ejecución de solo lectura; no descargó paquetes ni modificó configuración. Sin auditoría de árbol resuelto ni licencias internas de archivos todavía.

## Próximo paso

Trabajo documental de 01 completado. El usuario pidió sustituir el repaso obligatorio paso a paso por avance autónomo; AGENTS y estado lo registran. Se resolvieron los bloques restantes de recursos y herramientas y se preparó [el alcance concreto de 02](../plans/phase02-ready.md). Solicitar solo la aceptación del diseño y el nuevo permiso de código/instalación local necesario para ese alcance. No hay permisos implícitos de instalar Blender, generadores, modelos o recursos. La falta de assets no impide completar este diseño con pendientes visibles.
