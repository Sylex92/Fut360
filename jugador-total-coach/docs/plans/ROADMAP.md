# Orden de ejecución

Una fase por mensaje. No ejecutar todos los prompts seguidos. Leer PROJECT_STATUS.md para continuar.

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

## Instalar por necesidad
Fase documental: aplicación con Codex, acceso a carpeta y Git recomendado. No instalar motores ni Blender todavía.
Antes del bootstrap: Node.js LTS compatible y gestor de paquetes fijado. Comprobar primero herramientas existentes.
Antes de adaptar animaciones: Blender, cuando los assets y el pipeline lo requieran.

## Contrato de sesión vs. pared
3,600 segundos es la duración programada incluyendo descansos/transiciones declarados. Pausas del usuario y repeticiones extra aumentan el tiempo real; guardarlo por separado. Las instrucciones explicativas fuera de la sesión no se suman sin declararlo.
