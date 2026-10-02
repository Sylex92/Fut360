# Orden de ejecución

Completar el alcance autorizado sin pedir un mensaje por paso. El usuario solicitó avance autónomo el 2026-09-27; no ejecutar fases todavía no autorizadas. Leer PROJECT_STATUS.md para continuar.

| Fase | Prompt | Entrega y condición de avance |
|---|---|---|
| 00 | prompts/00-spec-only.md | Diagnóstico de entorno, auditoría, licencias/reutilización y plan. Sin código de aplicación. |
| 01 | prompts/01-architecture-review.md | Arquitectura, contratos y ADR consistentes. No construir aún UI. |
| 02 | prompts/02-repo-bootstrap.md | Herramientas mínimas aprobadas, proyecto base y validación del fixture. |
| 03 | prompts/03-session-engine.md | Motor con reloj inyectable, tests y duración correcta; aún independiente de 3D. |
| 04 | prompts/04-vertical-slice-3d.md | Un ejercicio de 60 s, avatar reutilizado, cámaras y pausa. Luego prueba de 5 min con el catálogo disponible. |
| 05 | prompts/05-contact-spike.md | Suelo, pie cinemático y balón dinámico; prueba aislada con Rapier. |
| 06 | prompts/06-avatar-pipeline.md | Adaptar clips existentes y crear solo lo faltante; previews, licencias y revisión humana. |
| 07 | prompts/07-expand-hour.md | Timeline completo de 60 min y reporte de cobertura real; no considerar fallbacks como terminado. |
| 08 | prompts/08-offline-and-feedback.md | Offline comprobado, persistencia, recuperación y feedback. |
| 09 | prompts/09-final-review.md | Matriz requisito/evidencia; ninguna funcionalidad nueva. |

El exportador MP4, una variante de 30 minutos, planificador dinámico, skills, MCP, wearables y escenas de partido se priorizan después del MVP1. No crear módulos vacíos para ellos.

Consolidación 01 del 2026-09-27: árbol/contratos en [arquitectura](../architecture/ARCHITECTURE.md) y requisitos del primer gesto en [Definition of Ready](first-visible-exercise-ready.md). El fixture de 31 IDs conserva valor de prueba; 06/07 producen el [catálogo conciliado](../training/EXERCISE_CATALOG_SCOPE.md) y una nueva versión de la hora. Los prompts 02–07 se armonizaron documentalmente, sin ejecutarlos ni autorizarlos.

El [alcance concreto de 02](phase02-ready.md) incluye versiones candidatas consultadas, instalación restringida al proyecto y verificaciones. Prepararlo no ejecuta ese prompt ni autoriza sus descargas.

## Instalar por necesidad
Fase documental: aplicación con Codex, acceso a carpeta y Git recomendado. No instalar motores ni Blender todavía.
Antes del bootstrap: Node.js LTS compatible y gestor de paquetes fijado. Comprobar primero herramientas existentes.
Antes de adaptar animaciones: Blender, cuando los assets y el pipeline lo requieran.

## Contrato de sesión vs. pared
3,600 segundos es la duración programada incluyendo descansos/transiciones declarados. Pausas del usuario y repeticiones extra aumentan el tiempo real; guardarlo por separado. Las instrucciones explicativas fuera de la sesión no se suman sin declararlo.

## Punto histórico al cerrar 04 — 2026-09-30

00–03 aceptadas como base; 04 autorizada e implementada con recurso real, Blender portable y verificaciones técnicas. Cinco minutos aceptados por reporte del usuario; controles, minuto completo y fallos comprobados con WebGL real en [navegador independiente](../reviews/phase04-browser-review.md). Samsung físico comprobado con resultado favorable por reporte, sin FPS instrumentales. El usuario acepta después la claridad del gesto. [04 cerrada como prototipo técnico](../reviews/phase04-closeout.md); ficha y clip siguen draft como contenido deportivo. Preview temporal LAN preparado para el teléfono, sin cambios de firewall. 05–09 no autorizadas. Las reglas de instalación por necesidad anteriores describen cada momento, no prohíben usar Blender ya preparado en 04.


## Estado histórico al cerrar 05 — 2026-09-30

00–04 aceptadas como base con sus límites. 05 autorizada, implementada y verificada técnicamente; el usuario confirma funcionamiento en computadora/Samsung y reconoce el nuevo ejemplo como campanitas. Se aclara el propósito del laboratorio, cuya trayectoria no enseña un control orientado. [Informe](../reviews/phase05-contact-review.md). No avanzar automáticamente a 06–09. PROJECT_STATUS es la referencia vigente; la tabla de fases sigue describiendo el plan global.

## Punto histórico de 06 — 2026-09-30

06 autorizada: once patrones/quince ejemplos producidos y revisados técnicamente, incluidos nueve recursos v2. Usuario confirma movimientos corregidos y detalle de pies en computadora/Samsung; fundamento exclusivamente documental según ADR 0012. Empuje en pared producido tras confirmar disponibilidad: ahora doce patrones/dieciséis ejemplos. Silla también declarada resistente/estable; no descartada por su material. Nuevo clip pendiente de aceptación visual/funcional; 183 pruebas y verificación geométrica/navegador correctas. No iniciar 07–09. [Informe y pendientes](../reviews/phase06-pipeline-review.md).

## Punto vigente de 07 — 2026-10-01

El usuario acepta claridad/visualización de pared y solicita continuar. [06 cerrada](../reviews/phase06-closeout.md); [07 autorizada](phase07-expand-hour.md), implementada y verificada técnicamente con dos pruebas independientes de una hora real. Seis bloques, 52 intervalos, todos los recursos existentes, sin nuevas dependencias ni cambios de assets. [Informe y evidencia](../reviews/phase07-hour-review.md). Pendiente aceptación del nuevo flujo en computadora/Samsung; la aceptación anterior no sustituye probar este nuevo recorrido. No iniciar 08–09.
