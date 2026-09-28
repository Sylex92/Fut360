# Preparación de fase 02 — alcance técnico listo para autorizar

Preparado: 2026-09-27. **Autorizado por el usuario el 2026-09-28**, mediante «De acuerdo y autorizo» en respuesta al alcance concreto de código e instalación local. Implementación y verificaciones técnicas de 02 realizadas. Recorrido manual del usuario de controles, teclado, ancho reducido y consola completado; captura conservada e inspeccionada por el agente. Integración Git pendiente y límites de evidencia en el [resultado observado](../reviews/phase02-bootstrap-review.md). 03 y posteriores no autorizadas. Las secciones siguientes conservan el alcance previsto antes de ejecutar.

## Resultado que se entregará

Una base React/Vite local con pantalla de diagnóstico: identidad y estado draft del fixture, duración calculada, validación y errores legibles. Importará un tipo del paquete domain y validará mediante exercise-catalog. Todavía no será una sesión para entrenar. No se necesitan decisiones deportivas del usuario para construirla.

Crear solamente app, domain, exercise-catalog, configuración local y pruebas necesarias. Conservar el fixture v1 y su hash; el nuevo catálogo se produce en sus fases. Nada de backend, cuentas, servicios ni módulos vacíos. El motor 03 y el visor 04 se implementarán después de la autorización que corresponda.

## Versiones candidatas concretas

Se consultaron metadatos públicos del registro npm, sin descargar tarballs ni ejecutar paquetes. Las rutas enlazadas fijan la versión consultada; no se instalará usando latest. Compatibilidad declarada no equivale a instalación probada ni auditoría de todo el árbol.

| Paquete/herramienta | Versión propuesta | Licencia declarada | Necesidad |
|---|---|---|---|
| Node ya instalado | 22.14.0 | Diagnóstico y auditoría existentes | Ejecutar herramientas; no actualizar globalmente |
| [pnpm](https://registry.npmjs.org/pnpm/11.19.0) | 11.19.0 | MIT | Workspaces y lockfile; copia del gestor dentro del proyecto para no depender de Codex |
| [react](https://registry.npmjs.org/react/19.3.0) / [react-dom](https://registry.npmjs.org/react-dom/19.3.0) | 19.3.0 / 19.3.0 | MIT | Pantalla local |
| [vite](https://registry.npmjs.org/vite/8.3.1) / [plugin-react](https://registry.npmjs.org/@vitejs%2fplugin-react/6.1.1) | 8.3.1 / 6.1.1 | MIT | Desarrollo y build |
| [typescript](https://registry.npmjs.org/typescript/6.0.3) | 6.0.3 | Apache-2.0 | Tipos estrictos |
| [vitest](https://registry.npmjs.org/vitest/5.0.2) | 5.0.2 | MIT | Pruebas de esquema/duración |
| [ajv](https://registry.npmjs.org/ajv/8.20.0) | 8.20.0 | MIT | Reutilizar validación JSON Schema 2020-12; no escribir otro validador de esquema |
| [eslint](https://registry.npmjs.org/eslint/10.11.0) / [@eslint/js](https://registry.npmjs.org/@eslint%2fjs/10.0.1) | 10.11.0 / 10.0.1 | MIT | Análisis de código |
| [typescript-eslint](https://registry.npmjs.org/typescript-eslint/8.70.1) | 8.70.1 | MIT | Análisis de TypeScript |
| [prettier](https://registry.npmjs.org/prettier/3.9.9) | 3.9.9 | MIT | Formato del código nuevo |
| [@types/react](https://registry.npmjs.org/@types%2freact/19.3.0) / [@types/react-dom](https://registry.npmjs.org/@types%2freact-dom/19.3.0) | 19.3.0 / 19.3.0 | MIT | Tipos de React |
| [@types/node](https://registry.npmjs.org/@types%2fnode/22.20.4) | 22.20.4 | MIT | Tipos acordes al Node instalado |

**Hallazgo corregido antes de instalar:** el latest consultado de TypeScript fue 7.0.2, mientras typescript-eslint 8.70.1 declara >=4.8.4 y <6.1.0. Se propone 6.0.3 por estar dentro de ese intervalo. No se adopta la versión más nueva automáticamente. Tampoco se elige @types/node 26 para un runtime 22.

Node 22.14.0 satisface los mínimos declarados de Vite/plugin-react (22.12), Vitest (22.12), ESLint (22.13) y pnpm 11.19.0 (22.13). El plugin admite Vite 8; React DOM y tipos corresponden a React 19.3. Los peers de transformación/compilador adicional del plugin son opcionales: no se añaden por defecto. Esto verifica rangos de metadatos, no corrección, rendimiento ni ausencia de vulnerabilidades de la instalación futura.

## Incorporación controlada dentro del proyecto

1. Revisar otra vez metadatos, textos de licencia y avisos pertinentes antes de incorporar. MIT y Apache-2.0 no anuncian pago obligatorio para este uso; conservar avisos y obligaciones aplicables. La declaración license del registro no sustituye el LICENSE/NOTICE del archivo real ni aprueba transitivas.
2. Preparar una copia local de pnpm fijada en .tooling usando el npm existente; dirigir caché a .cache dentro del proyecto. No usar instalador global, Corepack global, npx/dlx ni plantilla ejecutable remota. Esa copia hace reproducible el trabajo fuera de Codex sin cambiar el Node del sistema.
3. Crear manifests privados, workspaces, scripts y configuración local de store/cache/state/temp dentro del proyecto. Confirmar sus rutas resueltas antes de instalar; excluir dependencias, caches y temporales de Git. No modificar HOME, perfil de shell ni configuración global.
4. Resolver lockfile y paquetes con scripts automáticos desactivados inicialmente. Inspeccionar licencias, procedencia, integridad, dependencias opcionales de Windows y scripts necesarios; permitir solo los imprescindibles revisados. No ejecutar en bloque scripts de terceros ni eludir un fallo de compatibilidad. El tamaño final de dependencias sigue sin medir.
5. Registrar versiones exactas, árbol resuelto, avisos y decisión de cada hallazgo relevante. Las consultas al registro transmiten nombres/versiones, no requieren subir código ni datos personales. No contratar servicios de auditoría.
6. Instalar y probar la combinación autorizada. Si hay incompatibilidades o vulnerabilidades relevantes, elegir una alternativa compatible gratuita dentro del mismo alcance, documentarla antes de instalar y repetir los controles afectados. Un cambio que requiera pago, cuenta, instalación global o nueva funcionalidad necesita detenerse; una corrección rutinaria de versión no requiere otra aprobación general.

El permiso futuro debe cubrir descargas e instalación local de estas familias y sus dependencias necesarias revisadas. No puede prometerse un árbol completo aprobado antes de resolverlo; lo desconocido permanece pendiente hasta inspección. No actualizar herramientas ajenas al proyecto para superar un error.

## Verificación de aceptación

- Lint, formato del código nuevo, TypeScript estricto, tests y build sin errores. No reformatear toda la documentación histórica.
- Fixture válido bajo su esquema 2020-12, duración declarada y calculada de 3600 s; casos inválidos de estructura y suma rechazados con mensajes claros. El resultado no cambia draft ni acredita revisión deportiva.
- La pantalla usa realmente domain/catalog y muestra resultado/error; comprobar en el Chrome existente cuando sea posible, conservando evidencia y limitaciones. No instalar un navegador por defecto. La prueba Playwright queda diferida hasta que aporte una necesidad concreta y sus descargas estén autorizadas.
- Repetir instalación desde lockfile dentro del proyecto y registrar comandos reales y resultados. Scripts previstos: lint, format:check, typecheck, test y build; todavía no existen ni se han ejecutado.
- Sin cambios fuera del proyecto, sin dependencias desconocidas declaradas aprobadas, sin publicación/CI remoto y sin afirmar que hay un entrenador terminado.

## Lo que no necesita esta autorización

Blender, avatares/animaciones, Three/Fiber, Rapier, Remotion, IA de generación, modelos y exportación permanecen para sus fases. Tampoco incluye cambios de firewall, certificados, drivers o configuración de red para el móvil. Estas condiciones evitan ampliar silenciosamente un bootstrap a la producción 3D.

## Punto de decisión

El usuario aceptó el cierre de 01 y autorizó **02 con código base e instalación local de dependencias revisadas** el 2026-09-28. La restricción documental de [prompt 01](../../prompts/01-architecture-review.md) queda superada únicamente para este alcance. Avanzar en todo 02 sin pedir confirmaciones rutinarias.

## Plan de ejecución autorizado

1. Registrar autorización, conservar cambios documentales previos y comprobar origen/licencias de las versiones propuestas.
2. Preparar pnpm y sus caches solo dentro del proyecto; resolver dependencias con scripts desactivados, revisar árbol/avisos/licencias y fijar lockfiles.
3. Crear domain y exercise-catalog mínimos: contrato v1, validación con Ajv y sumas/errores semánticos. Pantalla React de diagnóstico accesible con resultado real y sin inicio de entrenamiento.
4. Ejecutar formato, lint, typecheck, casos válidos/inválidos, build y reinstalación desde lockfile; inspeccionar la pantalla con navegador disponible.
5. Documentar resultados y limitaciones, actualizar PROJECT_STATUS y detenerse antes de 03. No incluir Blender, 3D, modelos, publicación ni cambios globales.
