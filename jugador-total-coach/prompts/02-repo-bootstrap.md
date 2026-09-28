# Prompt 02 — Bootstrap técnico mínimo

Implementa solo el esqueleto técnico aceptado.

Requisitos:
- monorepo pnpm;
- TypeScript estricto;
- app React + Vite;
- paquetes domain y exercise-catalog según ARCHITECTURE.md; esquemas existentes en content/schemas, sin paquete duplicado ni módulos vacíos;
- Vitest;
- prueba de humo de la pantalla con Playwright solo cuando su necesidad/licencia/descarga estén revisadas y autorizadas;
- lint y format;
- scripts locales de lint, typecheck, tests y build; sin activar CI remoto;
- no backend;
- no autenticación;
- no dependencias no justificadas.

Primero escribe un plan corto.
Después implementa.
Al final ejecuta todas las verificaciones y documenta los comandos.

Criterios:
- la base web muestra una pantalla de diagnóstico; PWA/cache/offline completo se implementan y prueban en 08;
- importa un tipo desde `domain`;
- valida el JSON de ejemplo;
- una prueba confirma que la duración es exactamente 3,600 segundos.

Leer la consolidación documental de 01. No crear session-engine hasta 03 ni viewer-3d hasta 04. El fixture v1 sigue como regresión técnica de 31 IDs; el catálogo objetivo nuevo no se inventa durante bootstrap. Preparar la validación de formato v1 y reglas temporales sin declarar implementados todos los contratos futuros.

## Revisión de alcance

Solo después de aprobar auditoría de costo/licencia. Fijar versiones compatibles y auditar lockfile/transitivas; no hardcodear que todas las futuras versiones tienen la licencia actual. Tests locales no dependen de un CI cloud. No instalar dependencias que aún no necesita esta fase.


## Cierre de fase
Leer PROJECT_STATUS.md y comprobar que la fase anterior fue aceptada. Ejecutar únicamente esta fase. Antes de instalar o descargar, presentar necesidad, licencia, versión y permiso requerido. Al terminar, actualizar el estado con pruebas realmente ejecutadas y pendientes. No continuar automáticamente ni publicar/subir archivos.
