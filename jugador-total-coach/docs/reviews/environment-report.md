# Diagnóstico del entorno — fase 00

Fecha de comprobación: 2026-09-24. Solo lectura; sin instalaciones ni cambios de configuración.

## Resultado

**Verificado:** el entorno permite completar la auditoría documental. Hay Git, Node, npm, Python y navegadores detectables. No existe aún una aplicación que compilar o probar. La disponibilidad de herramientas dentro de Codex no garantiza su disponibilidad en una terminal independiente.

Raíz Git: C:/Users/mario.sabaleta/Documents/GitHub/Fut360.
Raíz del proyecto: C:/Users/mario.sabaleta/Documents/GitHub/Fut360/jugador-total-coach.
No inicializar otro repositorio dentro de esa carpeta. Estado Git inicial limpio; último commit existente: 2004c49, «init project agents». No se creó un commit.

## Inventario observado

| Componente | Evidencia local | Estado y límite |
|---|---|---|
| Windows | PowerShell informa Microsoft Windows 10.0.26200; registro: Professional, DisplayVersion 25H2, build 26200.9550, arquitectura amd64 | Verificado. ProductName conserva «Windows 10 Pro»; no usar ese valor aislado para deducir la denominación comercial. |
| PowerShell | 7.6.5, Core | Verificado por PSVersionTable. |
| Git | 2.40.0.windows.1; C:/Program Files/Git/cmd/git.exe | Verificado por --version y Get-Command. Existe otra entrada en el runtime de Codex; la de Program Files tiene prioridad. |
| Node | v22.14.0; C:/Program Files/nodejs/node.exe | Verificado. También hay una entrada alternativa del runtime de Codex. |
| npm | 10.9.2; C:/Program Files/nodejs/npm.cmd y npm.ps1 | Verificado; --version funciona. No se cambiaron políticas de ejecución. |
| pnpm | 11.19.0; C:/Users/mario.sabaleta/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd | Verificado dentro de esta sesión. Es una entrada del entorno de Codex, no evidencia de una instalación global utilizable por el usuario. |
| Python | 3.13.3; C:/Python313/python.exe | Verificado; usado con -B para no generar bytecode. jsonschema no está disponible en este intérprete. |
| Blender | No encontrado en PATH. Existe C:/Program Files/Blender Foundation/Blender 4.5, con subcarpetas; la búsqueda allí no encontró blender.exe | **Pendiente:** instalación completa/ejecutable y versión. Una carpeta residual no prueba que esté instalado; tampoco se afirma ausencia absoluta en otros lugares. |
| Chrome | C:/Program Files/Google/Chrome/Application/chrome.exe; ProductVersion 153.0.8010.53 | Verificado por metadatos; no se abrió ni se probó WebGL. |
| Edge | C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe; 153.0.4234.48 | Igual alcance. |
| Firefox | C:/Program Files/Mozilla Firefox/firefox.exe; 137.0.2 | Igual alcance; no se determina aquí su vigencia de seguridad. |

Los tres navegadores no aparecieron como comandos en PATH; sí se encontraron en rutas de instalación conocidas. No se inspeccionaron perfiles, historial, credenciales ni archivos personales.

## Compatibilidad y capacidad

**Verificado en documentación:** Vite declara Node 20.19+ o 22.12+; el Node detectado supera el mínimo de su rama. Esto no certifica compatibilidad con un conjunto de paquetes todavía sin elegir, ni que el parche instalado sea el adecuado para la fase 02. Fijar versiones mantenidas, revisar engines/peers y probar el conjunto antes del bootstrap. [Guía oficial de Vite](https://vite.dev/guide/).

**Pendiente:** CPU, RAM, GPU y controlador. Las tres consultas CIM devolvieron acceso denegado; no se elevaron permisos ni se dedujeron capacidades gráficas. También quedan pendientes WebGL, FPS, memoria, temperatura, tamaño de assets, audio y dispositivo Android objetivo. No hay base para recomendar compras ni prometer rendimiento.

**Supuesto de planificación:** utilizar el equipo existente y reducir materiales, polígonos o resolución si las mediciones posteriores lo requieren.

## Verificaciones ejecutadas

- Inventario con rg, Get-Command, metadatos de ejecutables y consultas acotadas del registro.
- Git status y log en lectura. El primer status falló por propiedad distinta del repositorio. Se repitió con git -c safe.directory=C:/Users/mario.sabaleta/Documents/GitHub/Fut360; la excepción se limita al proceso, sin escribir configuración.
- Parseo del fixture y ambos esquemas; recálculo con Python estándar: 3,600 s, 60 intervalos, 31 IDs distintos.
- Test-Json de PowerShell con workout.schema.json: True. Parseo JSON de exercise.schema.json: True; no existen definiciones de ejercicio para validar contra él.
- Tras leer su contenido, python -B tools/validate_blueprint.py: 3,600 s y 55 archivos del manifiesto original correctos **antes de editar documentos**.
- Búsqueda de package.json, lockfiles y archivos GLB/glTF/BLEND: ninguno. No hay dependencias instaladas en el proyecto ni assets incorporados.

El manifiesto describe el paquete importado, no los documentos nuevos. Después de esta fase cambia PROJECT_STATUS.md y se añade una nota a REMOTION_LICENSE_REVIEW.md; esos dos hashes históricos dejan de coincidir. No se reescribió el manifiesto para ocultar la diferencia. La comprobación final debe distinguir cambios documentales esperados de alteraciones de contenido.

## No ejecutado

Build, lint, typecheck, tests de aplicación, E2E, ejecución 3D, validación de GLB, pruebas offline y de dispositivo: no existe aplicación ni assets. No se descargaron modelos, navegadores o paquetes, ni se ejecutaron instaladores. La siguiente tarea es revisar la fase 00; la fase 01 requiere una nueva instrucción del usuario.

