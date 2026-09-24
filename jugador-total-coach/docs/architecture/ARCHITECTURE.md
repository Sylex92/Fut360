# Arquitectura recomendada

## Estrategia

Monorepo y monolito modular. El MVP1 corre completamente en el cliente. El dominio no depende de UI, Three.js ni almacenamiento.

## Contenedores futuros

- **Coach PWA**: experiencia del usuario.
- **Authoring Studio**: futura herramienta para revisar ejercicios, cámaras y cues.
- **Render Worker**: futura exportación MP4.
- **API**: futura sincronización, cuentas e integraciones.
- **Tactical Simulator**: futuras escenas de transferencia a partido.

Solo Coach PWA y los paquetes compartidos se implementan en MVP1.

## Módulos

- `domain`: entidades, tipos y reglas.
- `session-engine`: reloj y máquina de estados.
- `exercise-catalog`: carga y validación de contenido.
- `avatar-runtime`: carga GLB, clips y cámaras.
- `scene-runtime`: entorno, iluminación y props.
- `persistence`: puertos y adaptador IndexedDB.
- `telemetry`: eventos internos, sin proveedor externo en MVP1.
- `integrations`: solo contratos futuros.
- `ui`: componentes de presentación.

## Estructura objetivo tras el bootstrap

```text
jugador-total-coach/
├── AGENTS.md
├── README.md
├── docs/
├── content/
│   ├── exercises/
│   ├── workouts/
│   └── schemas/
├── assets/
│   ├── blender-source/
│   └── runtime/
├── apps/
│   └── coach-pwa/
├── packages/
│   ├── domain/
│   ├── session-engine/
│   ├── exercise-catalog/
│   ├── avatar-runtime/
│   ├── scene-runtime/
│   ├── persistence/
│   ├── telemetry/
│   └── ui/
├── tools/
│   ├── asset-validator/
│   └── blender-export/
└── tests/
    └── e2e/
```

## Dependencias permitidas

Las flechas apuntan hacia el dominio:

```text
UI ───────────────┐
3D runtime ───────┼──> domain + schemas
Persistence ──────┤
Session engine ───┘
```

El dominio no importa módulos externos de UI o infraestructura.

## Estado de sesión

Estados mínimos:

- idle
- preparing
- working
- resting
- paused
- completed
- aborted

Los comandos y eventos deben ser explícitos y comprobables con un reloj falso.

## Extensión futura

Las integraciones se agregan como adaptadores:

```text
WearableAdapter -> MetricSample
SocialPublisher -> SharePayload
CloudRepository -> dominio
VideoRenderer -> WorkoutDefinition + assets
```

## Reglas de implementación

Añadir un adaptador pequeño `physics-runtime` solo cuando se implemente la prueba Rapier; no crear un framework físico. Separar estado físico de sesión y clips. El dominio permanece independiente del motor y la autoridad de transform se declara en la escena.

Reutilizar AnimationMixer, loaders, rigging/retargeting y validadores existentes. Bibliotecas y assets gratuitos con derechos auditados; pueden ser abiertos o no abiertos. No instalar todo el catálogo de candidatos: elegir el mínimo compatible en la auditoría.

No implementar integraciones futuras ni paquetes vacíos de wearables/social. El API público del módulo necesario basta para extender después. Todo recurso del MVP se distribuye localmente; no hay render cloud ni proveedor de voz obligatorio. Consultar ADR 0005/0006.
