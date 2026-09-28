# Desarrollo local — base de fase 02

Fecha: 2026-09-28. Windows, Node 22.14.0 y npm 10.9.2 existentes. No requiere Codex, cuenta, nube ni instalación global de pnpm. Usar la carpeta jugador-total-coach, no la raíz Git superior.

## Abrir la aplicación ya instalada

Desde esta carpeta:

```powershell
node tools/pnpm.mjs dev
```

Abrir http://127.0.0.1:5173/ en Chrome. Ctrl+C detiene el servidor. Solo escucha en la propia computadora: no abre el firewall ni sirve al teléfono. Pantalla de diagnóstico, sin avatar ni botón para entrenar. PWA/offline y prueba del Samsung corresponden a fases posteriores.

## Preparar otra vez desde los lockfiles

Los paquetes de npm ya fueron autorizados para esta fase y están inventariados en el informe de dependencias. Esto descarga herramientas de desarrollo locales; no es un instalador de Blender o modelos. No copiar los comandos a otro proyecto.

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

format solo aplica al código/configuración nuevos; no reescribe documentos, fixture ni esquemas históricos. Domain y exercise-catalog son privados y sus APIs apuntan al código fuente TypeScript, que Vite procesa; no son librerías distribuidas a npm.

## Estructura y límites

- apps/coach-pwa: diagnóstico accesible del archivo original; CSS local sin fuentes externas.
- packages/domain: tipos v1 y aritmética pura, sin plataforma ni UI.
- packages/exercise-catalog: Ajv 2020-12 y comprobaciones semánticas; errores con ruta, sin red propia.
- tests y pruebas de pantalla: original intacto, suma de rondas, datos inválidos, enteros seguros, errores y estado draft. La prueba de pantalla usa render de React a HTML, no un navegador.
- .tooling: gestor fijado y lockfile separado. .cache y node_modules están excluidos de Git.

No hay session-engine, visor 3D, simulación, almacenamiento de entrenamiento, PWA ni recurso deportivo aprobado. El tipo WorkoutV1 no implementa todavía los contratos futuros de fase 01; sus campos no se inventan en este bootstrap.
