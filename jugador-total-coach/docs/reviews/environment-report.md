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

### Aclaración de Blender durante la revisión guiada

Se repitió la búsqueda de comando y la inspección acotada del directorio habitual. También se consultaron exclusivamente los campos DisplayName, DisplayVersion e InstallLocation de entradas con nombre Blender en las claves Uninstall de HKLM (64/32 bits) y HKCU. No se obtuvieron coincidencias. **Confirmado por el usuario:** lo instaló anteriormente y después lo desinstaló. **Supuesto:** las subcarpetas observadas son restos de esa instalación. **Pendiente:** preparar una instalación utilizable cuando corresponda; no se ejecutó ni reinstaló Blender.

Blender se prevé para adaptar el avatar y sus animaciones. Su ausencia confirmada, si se confirma, no impediría la fase 01 documental; su preparación se resolverá antes de la primera adaptación 3D que lo necesite, con la autorización correspondiente.

## Compatibilidad y capacidad

**Verificado en documentación:** Vite declara Node 20.19+ o 22.12+; el Node detectado supera el mínimo de su rama. Esto no certifica compatibilidad con un conjunto de paquetes todavía sin elegir, ni que el parche instalado sea el adecuado para la fase 02. Fijar versiones mantenidas, revisar engines/peers y probar el conjunto antes del bootstrap. [Guía oficial de Vite](https://vite.dev/guide/).

**Inspección complementaria de la computadora, verificada en lectura:** después del acceso denegado de CIM se utilizaron el registro y APIs de Windows desde Python estándar, sin instalar herramientas ni elevar permisos.

| Dato | Resultado observado | Alcance de la comprobación |
|---|---|---|
| Procesador | 12th Gen Intel Core i5-1235U | Valor ProcessorNameString de HKLM/HARDWARE/DESCRIPTION/System/CentralProcessor/0. |
| Memoria física | 15,69 GiB totales visibles para Windows | GlobalMemoryStatusEx, totalPhys. No representa memoria libre ni certifica la capacidad nominal instalada de los módulos. |
| Adaptador gráfico | Intel UHD Graphics, primario y conectado al escritorio | EnumDisplayDevicesW. Se devolvieron también entradas del mismo nombre sin escritorio conectado; no se cuentan como GPU físicas adicionales. |

Una lectura general de la clave de CPU produjo un error de conversión en otro valor; la consulta posterior del único campo ProcessorNameString terminó correctamente. Controlador, memoria gráfica y capacidad efectiva siguen pendientes. **Confirmado por el usuario:** esta misma computadora será la usada para entrenar, además de desarrollar el proyecto. Queda resuelta la identificación básica del equipo de escritorio; su rendimiento aún no se ha medido.

El teléfono objetivo fue identificado por el usuario: Samsung Galaxy S24 FE con Android 16 y Chrome. En ambos equipos siguen pendientes las pruebas de WebGL, FPS, consumo de memoria, temperatura, tamaño de assets y audio. Los datos de inventario no demuestran rendimiento ni justifican compras.

**Supuesto de planificación:** utilizar el equipo existente y reducir materiales, polígonos o resolución si las mediciones posteriores lo requieren.

### Teléfono de referencia identificado durante la revisión guiada

- **Confirmado por el usuario:** Samsung Galaxy S24 FE con Android 16, para seguir los entrenamientos del MVP1 junto con la computadora. La versión instalada fue comunicada por el usuario durante la revisión guiada; no se inspeccionó el teléfono de forma remota.
- **Navegador confirmado por el usuario:** utiliza Google Chrome. Tiene Samsung Internet instalado, pero no lo utiliza; se registra como alternativa y no como requisito adicional de aceptación.
- **Verificado en documentación del fabricante:** el modelo se describe con pantalla de 6,7 pulgadas FHD+ y procesador Exynos 2400e. Son características publicadas, no mediciones de la unidad del usuario. [Informe oficial Samsung, ficha Galaxy S24 FE](https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2026_1Q_Interim_Report.pdf).
- **Pendiente:** versión exacta de Chrome al preparar las pruebas y rendimiento real de la aplicación. One UI no se consultó; ese dato no es un requisito para cerrar esta aclaración. No deducir el resto del software instalado de la versión de lanzamiento del modelo.
- **Pruebas futuras:** claridad del avatar y cues, controles táctiles, cambio de orientación, pausa, audio, funcionamiento offline y una sesión sostenida. Un buen resultado aquí no certifica otros teléfonos Android.

Consulta guiada realizada con el usuario: Ajustes → Acerca del teléfono → Información de software → Versión de Android; respuesta recibida: 16. No se pidió actualizar el teléfono ni cambiar configuración. [Instrucciones oficiales Samsung](https://www.samsung.com/es/support/mobile-devices/como-comprobar-la-version-de-android-de-tu-dispositivo/).

## Verificaciones ejecutadas

- Inventario con rg, Get-Command, metadatos de ejecutables y consultas acotadas del registro.
- Git status y log en lectura. El primer status falló por propiedad distinta del repositorio. Se repitió con git -c safe.directory=C:/Users/mario.sabaleta/Documents/GitHub/Fut360; la excepción se limita al proceso, sin escribir configuración.
- Parseo del fixture y ambos esquemas; recálculo con Python estándar: 3,600 s, 60 intervalos, 31 IDs distintos.
- Test-Json de PowerShell con workout.schema.json: True. Parseo JSON de exercise.schema.json: True; no existen definiciones de ejercicio para validar contra él.
- Tras leer su contenido, python -B tools/validate_blueprint.py: 3,600 s y 55 archivos del manifiesto original correctos **antes de editar documentos**.
- Búsqueda de package.json, lockfiles y archivos GLB/glTF/BLEND: ninguno. No hay dependencias instaladas en el proyecto ni assets incorporados.

El manifiesto describe el paquete importado, no los documentos nuevos. En la primera entrega solo diferían PROJECT_STATUS.md y REMOTION_LICENSE_REVIEW.md; las aclaraciones posteriores modificaron más documentos. Ese dato inicial no describe el estado final de la revisión guiada. No se reescribió el manifiesto para ocultar las diferencias. La comprobación de cierre distingue documentos modificados de fixture, esquemas y demás contenido original.

## No ejecutado

Build, lint, typecheck, tests de aplicación, E2E, ejecución 3D, validación de GLB, pruebas offline y de dispositivo: no existe aplicación ni assets. No se descargaron modelos, navegadores o paquetes, ni se ejecutaron instaladores. El cierre de 00 y autorización de 01 se registraron posteriormente en [PROJECT_STATUS](../../PROJECT_STATUS.md); no repetir el inicio de 00.

## Complemento de preparación — 2026-09-27

Recomprobados Node 22.14.0 y npm 10.9.2 mediante sus comandos de versión, con ejecutables en C:/Program Files/nodejs. Get-Command sigue localizando pnpm en el runtime privado de Codex. Se propone una copia fijada dentro del proyecto cuando se autorice 02 para que la construcción no dependa de ese runtime; no se creó aquí.

Se consultaron metadatos npm por HTTP en solo lectura: rangos declarados de herramientas candidatos compatibles con Node 22.14.0 y una incompatibilidad TypeScript/latest corregida en el plan. [Versiones y alcance](../plans/phase02-ready.md). La primera consulta quedó bloqueada por la restricción de socket del entorno; la consulta de red de solo lectura autorizada por la herramienta pudo completarse. No se modificaron políticas, archivos globales ni el sistema. Todavía faltan instalación, transitivas y ejecución real.

Blender continúa sin preparar; esta consulta no comprobó de nuevo ejecutables ni capacidad gráfica. El acceso directo a páginas blender.org volvió a fallar, y la información indexada oficial no resuelve una versión ni requisitos completos actuales. No deducir que cuesta dinero del error HTTP de consulta ni que Intel UHD basta para el proyecto por aparecer en el inventario. La decisión de versión y prueba práctica corresponden a la preparación del primer clip.
