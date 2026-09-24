# Empieza aquí — Jugador Total Coach

Este documento es tu guía desde cero. El paquete contiene documentos y un fixture, NO una aplicación ejecutable. Usa únicamente este paquete v4; no combines carpetas anteriores.

## 1. Preparación mínima
Abre Codex de escritorio e inicia sesión con tu cuenta ChatGPT Pro. Para el proyecto usa un equipo/carpeta personal. Git es recomendado para guardar cambios; Node y Blender pueden esperar a las fases que los necesitan. Ver `docs/setup/WINDOWS.md`.

## 2. Extrae el paquete
Descarga `jugador-total-coach-inicio-v4.zip` en Descargas. La carpeta raíz del ZIP se llama `jugador-total-coach`.

Pega esto en PowerShell. Cambia $zip solo cuando tu carpeta real de descargas sea otra. El comando se detiene si ya existe la carpeta destino; no sobrescribe un trabajo anterior.

```powershell
$zip = Join-Path $HOME 'Downloads\jugador-total-coach-inicio-v4.zip'
$base = Join-Path $HOME 'source'
$proyecto = Join-Path $base 'jugador-total-coach'
if (-not (Test-Path -LiteralPath $zip)) { throw "No se encuentra el ZIP: $zip" }
if (Test-Path -LiteralPath $proyecto) { throw "Ya existe $proyecto. Elige otra carpeta; no sobrescribas." }
New-Item -ItemType Directory -Path $base -Force | Out-Null
Expand-Archive -LiteralPath $zip -DestinationPath $base
Set-Location $proyecto
Get-ChildItem
```

También puedes usar “Extraer todo” del explorador. La carpeta a abrir en Codex es la que contiene `AGENTS.md`, `README.md`, `START_HERE.md`, `docs`, `prompts` y `content`, no la carpeta superior.

## 3. Guarda el punto inicial en Git
Comprobar primero `git --version`. En la raíz extraída:

```powershell
git init -b main
git status
git add .
git commit -m "docs: define MVP1 and start-from-zero guide"
```

Si Git informa falta de identidad, configura nombre y correo para este repositorio y repite el commit. No incluyas credenciales. GitHub no es necesario para comenzar; no se publica ni se crea un remoto con estos comandos.

## 4. Abre la carpeta en Codex
En escritorio, selecciona Codex, abre la carpeta y elige Local. Mantén solicitudes de aprobación y permisos acotados al proyecto. No Full access.
No es necesario crear una skill, plugin, agente autónomo ni proyecto en la nube. AGENTS.md y los documentos son el contexto de Codex; no asumas que lee automáticamente esta conversación.

## 5. Primer mensaje exacto

```text
Este proyecto empieza desde cero.
Lee AGENTS.md, README.md, START_HERE.md y PROJECT_STATUS.md.
Ejecuta únicamente prompts/00-spec-only.md.

Solo autorizo inspección, investigación y documentos.
No generes código de aplicación, no instales dependencias, no descargues
modelos ni modifiques configuración del sistema.

La meta es una sesión de 60 minutos en 2x2 con avatar 3D claro,
reutilizando herramientas y assets gratuitos con licencias compatibles.
Las herramientas pueden ser open source o no: deben usarse sin costo
obligatorio y permitir las ampliaciones evaluadas. Lee ADR 0008.
Remotion se puede evaluar sin excepción FOSS; no se instala por ahora
porque la exportación sigue fuera del MVP1.
Añade una matriz de costos/licencias por cada función del roadmap.
No prometas gratuidad universal ni autorices pagos.

Entrega los informes y el plan solicitados, actualiza PROJECT_STATUS.md
y detente antes de implementar.
```

## 6. Qué revisar al terminar
Debe haber `environment-report.md`, `spec-audit.md`, `license-audit.md`, `reuse-audit.md` y `feature-cost-matrix.md` en `docs/reviews/`, y `mvp1-execution-plan.md` en `docs/plans/`.
El informe debe distinguir confirmado, pendiente y supuesto. Lo desconocido no se aprueba automáticamente. No debería haber una aplicación ni dependencias instaladas todavía.

## 7. Siguiente mensaje, después de revisar la fase 00

```text
Acepto la fase 00 y sus conclusiones salvo las observaciones que indico.
Ejecuta únicamente prompts/01-architecture-review.md.
Todavía no construyas la aplicación ni instales dependencias.
Actualiza PROJECT_STATUS.md y detente al completar esta fase.
```

No copies “acepto” sin revisar el resultado. `docs/plans/ROADMAP.md` enumera todas las fases 00–09.

## 8. Patrón para cada fase posterior

```text
Lee AGENTS.md y PROJECT_STATUS.md. La fase anterior fue revisada.
Ejecuta únicamente el prompt de la fase que indico a continuación.
Primero presenta un plan breve. Mantén el alcance y la política de licencias.
No instales ni descargues sin la autorización correspondiente.
Al terminar, ejecuta las verificaciones, registra las pendientes,
actualiza PROJECT_STATUS.md y detente.
```

## 9. Cuando abras un chat nuevo en Codex

```text
Continúa este repositorio, no lo reconstruyas.
Lee AGENTS.md, PROJECT_STATUS.md, los ADR vigentes y docs/plans/ROADMAP.md.
Resume la última fase aceptada y la siguiente tarea. No implementes
otra fase hasta que te indique cuál ejecutar.
```

## 10. La definición práctica de éxito
Primero un ejercicio comprensible con cámara y pausa; después cinco minutos; al final la hora completa. Un cronómetro funcionando con movimientos incorrectos no cumple el MVP. Los assets y la técnica requieren revisión humana, además de pruebas de software.

## Remotion
Ver ADR 0008 y REMOTION_LICENSE_REVIEW.md. Es candidato condicionado permitido; no obliga a cambiar la secuencia. La etapa documental no autoriza instalaciones ni pagos. El estado de revisión de una herramienta es distinto de su incorporación al producto.
