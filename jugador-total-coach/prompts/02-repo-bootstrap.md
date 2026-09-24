# Prompt 02 — Bootstrap técnico mínimo

Implementa solo el esqueleto técnico aceptado.

Requisitos:
- monorepo pnpm;
- TypeScript estricto;
- app React + Vite;
- paquetes de dominio, schemas, session-engine y avatar-runtime;
- Vitest;
- Playwright preparado;
- lint y format;
- CI con lint, typecheck y tests;
- no backend;
- no autenticación;
- no dependencias no justificadas.

Primero escribe un plan corto.
Después implementa.
Al final ejecuta todas las verificaciones y documenta los comandos.

Criterios:
- la PWA muestra una pantalla vacía de diagnóstico;
- importa un tipo desde `domain`;
- valida el JSON de ejemplo;
- una prueba confirma que la duración es exactamente 3,600 segundos.

## Revisión de alcance

Solo después de aprobar auditoría de costo/licencia. Fijar versiones compatibles y auditar lockfile/transitivas; no hardcodear que todas las futuras versiones tienen la licencia actual. Tests locales no dependen de un CI cloud. No instalar dependencias que aún no necesita esta fase.


## Cierre de fase
Leer PROJECT_STATUS.md y comprobar que la fase anterior fue aceptada. Ejecutar únicamente esta fase. Antes de instalar o descargar, presentar necesidad, licencia, versión y permiso requerido. Al terminar, actualizar el estado con pruebas realmente ejecutadas y pendientes. No continuar automáticamente ni publicar/subir archivos.
