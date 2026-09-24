# Entorno Windows: instalación gradual

## Ruta recomendada
Trabajar en Codex de escritorio, modo Local, con PowerShell y archivos en Windows. No hace falta montar Docker, WSL, nube o MCP para la auditoría. La documentación vigente de OpenAI describe Codex dentro de la app de escritorio de ChatGPT; los nombres de botones pueden variar por versión.

Iniciar sesión con la cuenta ChatGPT que incluye Pro. No configurar una API key para este flujo. El desarrollo mediante Codex utiliza las condiciones/límites del plan; la PWA final no necesita Codex ni una API.

## Comprobaciones no destructivas
Ejecutar por separado. Un comando ausente no confirma ausencia de la aplicación; puede faltar PATH.

```powershell
git --version
node --version
npm.cmd --version
Get-Command git,node,npm.cmd,pnpm.cmd,blender -ErrorAction SilentlyContinue | Select-Object Name,Source
```

Git es recomendado al iniciar. Node.js será necesario antes del bootstrap. Blender se agrega al entrar al pipeline 3D. No reinstalar versiones que ya funcionen ni actualizar globalmente otros proyectos.

La página oficial consultada el 24-09-2026 identifica Node 24 como LTS. Antes de instalar/fijar una versión, verificar compatibilidad real y conservarla en la configuración del proyecto. No usar “latest” como especificación permanente.

## Fuentes de instalación
- Git Windows: https://git-scm.com/install/windows
- Node.js: https://nodejs.org/en/download
- Blender: https://www.blender.org/download/
- Codex/Windows: https://learn.chatgpt.com/docs/windows/windows-app

El acceso directo a la página de descarga de Blender no pudo verificarse en esta revisión; Codex deberá verificar disponibilidad/versión cuando corresponda, sin inventar binarios ni espejos.

Si falta Git y usas winget, un comando documentado por OpenAI es:
```powershell
winget install --id Git.Git --exact
```
Revisa el instalador y permisos. No ejecutar como parte de un script automático del proyecto. Reabre la terminal después de instalar.

## Seguridad y posibles errores
- Sin permisos de instalación: informar y usar una vía autorizada, no desactivar controles.
- npm.ps1 bloqueado: `npm.cmd` invoca la entrada de comandos instalada; no modificar políticas globales para arreglarlo automáticamente.
- Antivirus bloquea herramientas: no desactivar ni evadir; usar equipo personal autorizado o resolver con quien lo administra.
- WebGL/assets: diagnosticar en el dispositivo objetivo; una prueba en navegador automatizado no demuestra rendimiento en teléfono.
- PWA móvil por LAN: preparar origen seguro cuando se implemente; HTTP local en un teléfono no equivale a localhost en el ordenador.
