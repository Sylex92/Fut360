# Arquitectura MVP1 — fase 01

Diseño de fase 01 del 2026-09-27. Actualización 2026-09-29: 02–04 implementan app, domain, exercise-catalog, session-engine y viewer-3d; aceptación visual/humana de 04 pendiente. El árbol siguiente conserva el objetivo y no implica que existan módulos de fases posteriores. Bases vigentes: [ADR 0001](adr/0001-modular-monolith.md), [0006](adr/0006-rapier-and-guided-clips.md) y [0008](adr/0008-zero-cost-extensible.md). ADR 0005/0007 son históricos.

## Resultado y límites

Una aplicación web local para computadora y Samsung Galaxy S24 FE/Chrome, con sesión fija de 60 minutos programados, avatar genérico y área de 2×2 m. Sin backend, autenticación, microservicios ni proveedores obligatorios. No construir ahora Authoring Studio, API, Render Worker, simulador táctico ni conectores.

Monorepo y monolito modular: una sola aplicación distribuible, límites comprobables dentro del repositorio. Los módulos se crean cuando tienen trabajo real; el árbol es el objetivo final del MVP, no instrucciones para fabricar paquetes vacíos en 02.

## Árbol objetivo

~~~text
jugador-total-coach/
  apps/
    coach-pwa/
      src/
        composition/          conecta implementaciones y puertos
        platform/             reloj, visibilidad, audio y cache del navegador
        ui/                   pantallas y controles accesibles
  packages/
    domain/                   contratos y reglas puras
    exercise-catalog/         validación, referencias y compilación del programa
    session-engine/           estados y avance determinista
    viewer-3d/                avatar, cámaras, escena y props guiados
    physics-lab/              integración mínima Rapier, solo laboratorio
    persistence/              adaptador IndexedDB y archivo portable
  content/
    examples/                 fixture v1 histórico, conservado
    schemas/                  esquemas actuales; revisión futura versionada
    exercises/                definiciones reales cuando se produzcan
    workouts/                 programa revisado cuando se produzca
    manifests/                escena, animación y revisiones
  assets/
    source/                   recursos editables con derechos
    runtime/                  GLB y recursos locales con estado de revisión
    manifests/                metadatos y mapping ligados a cada recurso (04)
  tools/                      herramientas existentes; adaptaciones justificadas
  tests/
    e2e/                      flujos cuando exista aplicación
  docs/
~~~

Fusionar los anteriores avatar-runtime y scene-runtime en viewer-3d: comparten ciclo de vida y una escena pequeña. Mantener separación interna de avatar, cámaras y props. No hay otro consumidor que justifique dos paquetes. physics-lab es independiente y no se carga al entrenar. UI permanece en la aplicación; no crear otra biblioteca sin necesidad real.

Los esquemas están en content/schemas; no crear un paquete schemas que duplique la fuente. Los tipos puros corresponden a domain y el validador elegido se integra en exercise-catalog. Eventos locales en domain: no se necesita paquete telemetry ni analítica externa. No crear MetricSample/WearableAdapter antes de una función que los necesite.

## Dependencias permitidas

Cada fila enumera todos los paquetes internos que puede importar directamente. Prohibidos ciclos e imports de rutas privadas. Las bibliotecas externas se auditan por versión antes de instalarlas.

| Módulo | Importaciones internas permitidas | Capacidad externa | Nace |
|---|---|---|---|
| domain | Ninguna | Datos, tipos y reglas puras; sin React, Three, DOM, IndexedDB ni reloj global | 02 |
| exercise-catalog | domain | Validador JSON Schema auditado; carga por puerto, sin red propia | 02 |
| session-engine | domain | Tiempo y comandos recibidos como datos; sin renderer ni almacenamiento | 03 |
| viewer-3d | domain | Three/Fiber y loaders auditados; no escribe el estado de sesión | 04 |
| physics-lab | domain | Rapier/wrapper y visualización mínima; sin session-engine/persistence | 05 |
| persistence | domain | IndexedDB; wrapper solo si se justifica | 08 |
| apps/coach-pwa | Todos los anteriores cuando existan | React/Vite, adaptadores del navegador y composición; laboratorio diferido | 02–08 |
| tests/e2e y herramientas | APIs públicas necesarias | Herramientas auditadas, nunca importadas por producción | Según fase |

La app coordina: cargar/validar catálogo → obtener plan inmutable → iniciar motor → entregar proyección común a visor/audio/UI → enviar eventos al repositorio. El visor no importa el motor para darle órdenes. IndexedDB no se invoca desde render o dominio. El motor no espera transacciones para calcular una pose; la app pausa si falla el registro exigido en 08.

Puertos mínimos del dominio: lectura de contenido y acceso a registros. El reloj se adapta fuera del motor. Un puerto es un contrato necesario, no un servicio remoto ni un framework genérico.

## Sesión, escena y autoridad

El [contrato de sesión](SESSION_ENGINE_CONTRACT.md) define un reloj lógico para programa y extras. Cuerpo, balón guiado, textos y avisos derivan de esa proyección. La cámara no modifica el tiempo. La inspección lenta usa un cursor separado estando pausado y restaura el punto de sesión antes de continuar.

Corrección de la revisión guiada: vista previa automática y extensiones de preparación +30 s/+1 min con un toque. El motor suma un segmento virtual preparation-extra antes del trabajo y lo inicia automáticamente al terminar, sin confirmación de estar listo. El ejemplo usa cursor visual independiente, sin acreditar trabajo. Pausar todo, ocultación o fallo congelan cuenta e imagen. Según [ADR 0010](adr/0010-resume-on-visible.md), volver visible retoma automáticamente solo una sesión que corría y se pausó exclusivamente por ocultación; pausa manual/fallo mantienen continuación explícita. Un solo modo escribe sobre el avatar; se reutiliza visor/mixer sin paquete nuevo. Las extensiones se registran aparte de trabajo y pausa manual.

Tutorial: cuerpo y balón authored, props estáticos. Laboratorio: pie cinemático guiado, balón dinámico de Rapier y suelo fijo. Un dueño de transformación por nodo e instante. El laboratorio no comparte su balón ni reloj con la sesión; no hay cambio de autoridad en caliente entre ambos modos en MVP1.

Un fallo de recurso/GLB/WebGL pausa y muestra la causa. Una figura temporal solo sirve en inspección de desarrollo. No sustituir movimientos ni completar entrenamiento con placeholders.

## Decisión sobre reproducción y Remotion Player

Elegir Three/Fiber + AnimationMixer para MVP1. El [API de Three](https://threejs.org/docs/pages/AnimationMixer.html) permite evaluar un instante; se deberá probar la relación entre acciones, tiempo absoluto y timeScale. No sumar otro delta independiente desde el render.

[Remotion Player](https://www.remotion.dev/docs/player/player) ofrece composiciones React y controles. Es una alternativa real con elegibilidad personal documental según la [revisión específica](../research/REMOTION_LICENSE_REVIEW.md), no descartada por licencia ni por ser solo exportador.

| Necesidad | Decisión razonada |
|---|---|
| Trabajo/descanso, omisiones, extras e historial | Dominio propio con cualquiera de las opciones |
| GLB y tres cámaras | Three/Fiber ya necesarios; AnimationMixer cubre evaluar el gesto |
| Controles del entrenador | Deben conservar el significado de los comandos; buscar un frame no define trabajo completado |
| Exportación posterior | Remotion puede permitir compartir composiciones; ventaja futura, sin implementarla ahora |
| Capas de integración actuales | Player añadiría conversión por fotogramas y sincronización; ahorro total no demostrado |

Elección de alcance, no benchmark de superioridad. Datos/assets independientes permiten reconsiderarla si una prueba demuestra ahorro neto o se autoriza exportación. No construir adaptador Remotion vacío ni compositor propio. Fuentes técnicas reconsultadas el 2026-09-27; versiones y rendimiento no seleccionados/comprobados.

## Persistencia, offline y móvil

En 03–07 puede usarse memoria para pruebas identificadas; recuperación durable se acepta en 08. El [modelo de dominio](DOMAIN_MODEL.md) define eventos, registros e importación.

Empaquetar recursos locales con manifiesto versionado. Verificar los del programa antes de inicio; cache por aplicación/contenido y actualización entre sesiones. Una sesión recuperable mantiene su versión exacta: no mezclar clips nuevos. WASM del laboratorio solo en su paquete offline cuando se ofrezca ese modo. Ninguna CDN, voz cloud o IA necesaria.

Disponibilidad offline no exige cargar todos los GLB simultáneamente en GPU. Mantener escena actual y preparar la siguiente; liberar recursos que ya no se usan según política probada. Conservar todos los archivos necesarios en cache verificada antes de afirmar que la hora funciona sin red. Memoria y tiempos de carga se medirán en el teléfono.

El origen seguro del teléfono conserva una prueba pendiente. En 04 puede evaluarse visualmente una ruta LAN sin prometer PWA/offline. En 08 hace falta una ruta local reproducible a origen confiable, carga y reinicio sin red. [W3C Secure Contexts](https://www.w3.org/TR/secure-contexts/) distingue loopback de una IP LAN ordinaria. No desactivar seguridad, cambiar certificados globales ni contratar hosting para resolverlo implícitamente. Elegir/probar el mecanismo antes de aceptar offline; una acción fuera del proyecto requiere su autorización concreta.

## Verificación prevista

- 02: imports acíclicos, esquema/fixture v1, diagnóstico y scripts locales; sin CI remoto ni promesa offline.
- 03: reloj con entradas deterministas y sin 3D.
- 04–07: contratos cruzados de archivos, claridad, cámaras y autoridad; programa nuevo con todas sus referencias resueltas.
- 08–09: recuperación/importación, cache, offline, dispositivos y privacidad.

Objetivo técnico inicial: ≥30 FPS en ventanas de medición de 10 s y p95 de intervalos de frame ≤50 ms durante reproducción estable de la hora, excluyendo carga inicial y pausas registradas. Respuesta visual de pausa ≤150 ms en al menos 95% de 20 intentos por dispositivo, sin perder comandos. Son criterios de ingeniería elegidos, no resultados ni umbrales médicos. Registrar navegador, resolución/DPR, recursos, método y degradación durante la sesión. Reducir sombras/texturas antes que legibilidad de apoyos o proponer compras.

El [informe de fase 01](../reviews/architecture-review.md) enlaza decisiones con hallazgos de 00. La [Definition of Ready](../plans/first-visible-exercise-ready.md) distingue especificación de un recurso disponible.
