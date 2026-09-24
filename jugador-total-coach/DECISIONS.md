# Decisiones iniciales recomendadas

| Tema | Decisión inicial |
|---|---|
| Producto | PWA local-first |
| Usuario MVP | Un solo usuario |
| Idioma | Español |
| Pantalla durante sesión | Horizontal, adaptable a vertical |
| Salida principal | Reproductor 3D interactivo |
| MP4 | Posterior al MVP1 |
| Avatar | Humanoide genérico estilizado |
| Formato 3D | GLB/glTF 2.0 |
| Autoría 3D | Blender |
| Runtime 3D | Three.js mediante React Three Fiber |
| Stack UI | React + TypeScript + Vite |
| Repositorio | Monorepo pnpm |
| Persistencia | IndexedDB detrás de un puerto |
| Backend | No en MVP1 |
| Sesión MVP1 | Fija, 60 minutos, espacio 2×2 |
| Personalización IA | No en MVP1 |
| Wearables/social | Contratos preparados, implementación futura |
| Simulación de partido | Módulo futuro independiente |

## Reglas vigentes

| Tema | Decisión |
|---|---|
| Coste | Ningún pago de licencia/API necesario para construir o usar localmente |
| Tipo de licencia | Abierta o no abierta; gratuita y compatible con uso/ampliaciones evaluadas |
| Motor físico | Rapier + react-three-rapier |
| Demostración | Clips guiados revisados, no física libre para inferir técnica |
| Avatar | Reutilizar rig gratuito con derechos compatibles; primitivas solo para debug |
| Editor/rigging | Herramientas de Blender existentes, no un editor propio |
| Exportación futura | Fuera del MVP1; Remotion candidato condicionado permitido; revisar ADR 0008 |
| Audio | Señales/grabaciones locales; ninguna voz cloud obligatoria |
| Secuencia | Auditoría de costo/licencia/reutilización antes de código nuevo |
| Datos de entrenamiento | Ejemplo draft, duración validada no equivale a aprobación técnica/deportiva |

| Extensibilidad | Nuevas funciones sin pagos obligatorios; evaluar proveedor/contexto antes de integrar |
| Presupuesto | Excluye cuenta/tokens de Codex ya elegidos; no autoriza otros pagos |
