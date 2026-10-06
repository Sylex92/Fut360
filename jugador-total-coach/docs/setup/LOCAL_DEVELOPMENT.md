# Desarrollo local — base, reloj y primera demostración 3D

Continuación 2026-10-06: los originales locales de enseñanza quedan fuera de Git. [Preparación, archivos y condiciones](../reviews/local-human-video.md): usar los botones oficiales y las rutas indicadas, después `node tools/pnpm.mjs build`. El plugin comprueba hashes y copia a `public/media/` (ignorado); no descarga durante la compilación. No eludir un fallo de integridad. La copia offline incluye esos MP4 y responde rangos para seek. Vista de TV en la cabecera, sin SDK/APK nuevo. Datos existentes DB 4 / respaldo 3 se conservan: no borrar almacenamiento al actualizar.

Agenda 2026-10-04: IndexedDB v3 conserva datos de v1/v2 y protege campos frente a clientes antiguos. Aplicar la versión nueva mediante el panel offline si hay una copia anterior; **no borrar almacenamiento** para resolver un error de versión. Respaldos completos con agenda son formato 2, los anteriores siguen admitidos sin agenda. `tests/browser-planning.mjs` comprueba migración/contexto/versiones en contextos sintéticos; storage usa dev 4175 e interfaz usa preview 4173. [Evidencia](../reviews/context-and-week.md).

Actualización 2026-10-04: perfiles e historial separados en la aplicación compilada. PC: `http://127.0.0.1:4173/`. Wi-Fi observada actualmente: `192.168.68.101`, preview enlazado solo a esa dirección en `http://192.168.68.101:4174/`. Las IP de los párrafos históricos no son permanentes. La prueba de persistencia `tests/browser-participants.mjs` usa un contexto sintético nuevo y Vite dev local en `4175`; nunca ejecutarla sobre datos personales. No se han cambiado firewall ni certificados; el teléfono debe estar en la misma red accesible. Servidor LAN comprobado desde el navegador de PC; Samsung físico sigue pendiente para esta entrega.

## Actualización de fase 07 — 2026-10-01

La pantalla inicial abre la sesión v2 de 60 minutos. `?e2e=1` activa exclusivamente una prueba ×60 con aviso; no seguir movimientos a esa velocidad. Sin ese parámetro, usa tiempo real. Las pruebas normales no esperan una hora: para verificar el reloj real explícitamente, ejecutar desde el proyecto:

```powershell
$env:FUT360_REAL_HOUR='1'
node tools/pnpm.mjs exec vitest run tests/realtime-hour.test.ts
Remove-Item Env:FUT360_REAL_HOUR
```

Ese ensayo escribe evidencia del motor/reloj Node y tarda una hora real; no prueba renderizado. La evidencia separada de navegador está en el informe de 07. El entorno de la variable afecta solo al proceso PowerShell actual, no configuración global. No cerrar/suspender el equipo durante el ensayo; si un hueco supera 2 s, debe fallar y registrarse sin acreditar ese tiempo.

Preview PC: 127.0.0.1:4173. La Wi-Fi puede cambiar de dirección: el 2026-10-01 se encontró 192.168.18.6 y se enlazó el preview de teléfono únicamente a esa IPv4, puerto 4174. La dirección 192.168.68.105 de la mañana dejó de corresponder al equipo. No modificar firewall ni usar `0.0.0.0` por defecto. Ver `.cache/preview-lan/process.json` para el proceso actual; no considerar estas direcciones permanentes.

`tools/review_hour_coverage.mjs` verifica referencias, lados, hashes y conservación del fixture/lockfile. `tools/review_hour_delivery.mjs http://127.0.0.1:4173 http://192.168.18.6:4174` compara los bytes servidos con el build; admite solo direcciones presentes en las interfaces locales y esos puertos.

Las secciones siguientes conservan las instrucciones y límites históricos de fases anteriores.

Actualizado: 2026-09-29. Windows, Node 22.14.0 y npm 10.9.2 existentes. No requiere Codex, cuenta, nube ni instalación global de pnpm. Usar la carpeta jugador-total-coach, no la raíz Git superior.

## Abrir la aplicación ya instalada

Desde esta carpeta:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/ en Chrome. Ctrl+C detiene el servidor. Solo escucha en la propia computadora: no abre el firewall ni sirve al teléfono. Sección «Bisagra de cadera»: ensayos técnicos con avatar de uno o cinco minutos. «Iniciar prueba 3D» comprueba tiempos y controles; no indica aprobación de una rutina. El diagnóstico histórico de una hora sigue disponible en un desplegable. No hace falta tener Blender abierto para usar esta vista. PWA/offline y prueba del Samsung siguen pendientes.

Preparación +30 s/+1 min conserva autoinicio, sin confirmar al final. Pausar todo detiene el cursor; ocultar la página también pausa, y al volver hay que continuar. Recargar pierde el estado: todavía no hay historial/recuperación. El diagnóstico del archivo conserva su contador independiente.

## Preparar otra vez desde los lockfiles

Los paquetes de npm fueron autorizados e inventariados en 02 y ampliados con recursos auditados en 04. El bloque siguiente conserva la preparación reproducible con lockfiles; puede descargar paquetes si no están en caché. En 03 solo se enlazó session-engine con --offline; en 04 se incorporaron Three/Fiber y herramientas del recurso. [Licencias de 04](../reviews/phase04-dependencies.md). No copiar los comandos a otro proyecto.

```powershell
$taskProject = (Get-Location).Path
$taskPreviousTemp = $env:TEMP
$taskPreviousTmp = $env:TMP
New-Item -ItemType Directory -Force -Path .cache/tmp | Out-Null
try {
  $env:TEMP = Join-Path $taskProject '.cache/tmp'
  $env:TMP = $env:TEMP
  Push-Location .tooling
  try {
    npm.cmd ci --cache ../.cache/npm --userconfig ./npmrc --globalconfig ./npm-globalrc --ignore-scripts --no-audit --no-fund --no-update-notifier
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar pnpm local.' }
  } finally { Pop-Location }
} finally {
  $env:TEMP = $taskPreviousTemp
  $env:TMP = $taskPreviousTmp
}
node tools/pnpm.mjs install --frozen-lockfile --ignore-scripts
```

El primer comando debe ejecutarse desde .tooling como muestra el bloque. npm install con --prefix desde el directorio padre añadió inicialmente un enlace innecesario al proyecto; se corrigió antes de cerrar y el lockfile final solo contiene pnpm. No repetir esa variante.

tools/pnpm.mjs usa la copia fijada en .tooling y dirige store, cache, state y temporales al proyecto. La configuración es local y los cambios de entorno del proceso hijo no alteran el perfil del usuario. No habilitar scripts de dependencias en bloque: esta combinación funciona con ignoreScripts=true. Los avisos y las licencias permanecen dentro de los paquetes y en el inventario.

Con paquetes ya guardados, añadir --offline a ambos comandos de instalación permite comprobar la caché local. Eso no convierte la aplicación en PWA offline.

## Comandos de aceptación

```powershell
node tools/pnpm.mjs run format:check
node tools/pnpm.mjs run lint
node tools/pnpm.mjs run typecheck
node tools/pnpm.mjs run test
node tools/pnpm.mjs run build
node tools/pnpm.mjs run preview
```

Preview sirve el build en http://127.0.0.1:4173/. No ejecutarlo a la vez que otra instancia en ese puerto; strictPort evita cambiar la dirección sin avisar. Build genera apps/coach-pwa/dist y copia los avisos de terceros. No publicar ese directorio como parte de esta fase.

### Si aparece ERR_CONNECTION_REFUSED

La dirección local necesita un servidor activo. El 2026-09-28 el usuario encontró este error después de la entrega; se comprobó que no había un proceso escuchando en el puerto 4173. Se volvió a iniciar preview como proceso independiente en segundo plano y una comprobación posterior confirmó el puerto y HTTP 200. No se determinó la causa exacta de la detención anterior.

Recargar la página después de iniciar el servidor. Si vuelve a detenerse, abrir una terminal en jugador-total-coach, ejecutar `node tools/pnpm.mjs run preview` y dejar esa terminal abierta mientras se usa la página. No hace falta reinstalar dependencias ni recompilar si el build no cambió. Si el puerto ya está ocupado, no iniciar otra copia.

El proceso iniciado por Codex deja registros en `.cache/preview/stdout.log`, `.cache/preview/stderr.log` y `.cache/preview/process.json`; este último registra el proceso lanzado, no garantiza que siga vivo. No se configuró arranque automático con Windows ni reinicio del servidor ante fallos. Esta dirección solo funciona en la computadora que ejecuta el servidor.

format aplica al código/configuración y los metadatos nuevos de 04; no reescribe documentos, fixture ni esquemas históricos. Los paquetes propios son privados y sus APIs apuntan al código TypeScript que Vite procesa; no se distribuyeron a npm.

## Estructura y límites

- apps/coach-pwa: demostración 3D y diagnóstico; composición de sesión/preview/inspector y adaptador de reloj/visibilidad separados de UI. CSS local sin fuentes externas.
- packages/domain: tipos v1, aritmética y contratos/snapshot de ejecución, sin plataforma ni UI.
- packages/exercise-catalog: Ajv 2020-12, reglas semánticas y compilador v1; errores con ruta, sin red propia.
- packages/session-engine: motor puro que recibe tiempo/comandos y proyecta estado/eventos; solo depende de domain.
- packages/viewer-3d: GLTFLoader/AnimationMixer, escena y cámaras; recibe pose explícita sin importar el motor.
- tests y pruebas de pantalla/recurso: 108 casos en nueve archivos; [cobertura y límites de 04](../reviews/phase04-vertical-slice-review.md). Reloj inyectado, contratos GLB, render React a HTML y efectos de carga/fallback con adaptadores simulados; no un navegador E2E.
- .tooling: gestor fijado y lockfile separado. .cache y node_modules están excluidos de Git.

No hay simulación, almacenamiento de entrenamiento, PWA ni recurso deportivo aprobado. WorkoutV1 se conserva intacto; el plan técnico de 04 es independiente y no convierte la hora histórica en una rutina 3D. El conector sigue indisponible; la revisión manual de 03 no se transfiere a la pantalla nueva.

## Editar el único recurso con Blender ya autorizado

La copia portable está en `.local/blender/blender-4.5.14-windows-x64`, ignorada por Git. El avatar final y su fuente importable/.blend sí se conservan. Los scripts de autoría usan ese rig y operaciones existentes; no descargan nada ni requieren la edición Source comercial. La fuente original referencia dos normales ausentes; la importación inicial los advierte y el recurso final sustituye esos materiales. Ver el informe antes de interpretar esos mensajes como un fallo del GLB final.

Solo para volver a generar el recurso en este proyecto, con esa copia portable disponible:

```powershell
$previousBlenderResources = $env:BLENDER_USER_RESOURCES
$previousBlenderTemp = $env:TEMP
$previousBlenderTmp = $env:TMP
try {
  $env:BLENDER_USER_RESOURCES = Join-Path (Get-Location) '.cache/blender/user'
  $env:TEMP = Join-Path (Get-Location) '.cache/tmp'
  $env:TMP = $env:TEMP
  & ./.local/blender/blender-4.5.14-windows-x64/blender.exe --background --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 --python tools/build_hip_hinge.py
  if ($LASTEXITCODE -ne 0) { throw 'Falló la autoría; no actualizar evidencias como si hubiera terminado.' }
  & ./.local/blender/blender-4.5.14-windows-x64/blender.exe --background --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 --python tools/roundtrip_hip_hinge.py
  if ($LASTEXITCODE -ne 0) { throw 'Falló la prueba de ida y vuelta.' }
} finally {
  $env:BLENDER_USER_RESOURCES = $previousBlenderResources
  $env:TEMP = $previousBlenderTemp
  $env:TMP = $previousBlenderTmp
}
node tools/record_hip_hinge.mjs
node tools/verify_hip_hinge_roundtrip.mjs
```

Después, ejecutar las verificaciones de aceptación y revisar las nuevas imágenes de `.cache/phase04`; un hash o render regenerado exige actualizar su evidencia, no hereda aprobación anterior. Los ZIP de herramientas/packs, cachés y backups `.blend1` no se añaden a Git. `review_phase04_dependencies.mjs` usa las consultas de registro guardadas en la caché de esta preparación; el informe versionado conserva el resultado sin exigir red para ejecutar la app.
