# Empieza aquí — Jugador Total Coach

**Último incremento 2026-10-06:** [fuerza, movilidad y protección humanas](docs/reviews/strength-human-video.md). Cobertura vigente 69/23 gesto/18 componente/28 sin video integrado. Seis YouTube adicionales y un tercer original FIFA local adulto; seis componentes infantiles sin cambios. Planes/dosis/historial conservados. Continuar pendientes acumulados sin repetir permisos generales.

**Continuación vigente 2026-10-06:** [video humano local y vista TV](docs/reviews/local-human-video.md). Descarga FIFA expresamente autorizada y ejecutada, no volver a pedirla. Dos MP4 locales con manifiesto, originales fuera de Git y licencia no comercial condicionada. Ocho fichas con componentes locales, seis infantiles; biblioteca 69/17 gesto/17 componente/35 sin video integrado. Reproducción, offline/seek y controles TV verificados en navegador; Sony/Samsung físicos pendientes en este incremento. Conservar planes/historial y restricción independiente de YouTube infantil. No declarar producto completo; seguir carencias reales de enseñanza/conversación/adaptación. Los apartados siguientes son antecedentes.

**Continuación vigente 2026-10-05:** [calendario fechado y seguimiento por perfil](docs/reviews/dated-personal-plan.md) implementados, con preservación de datos (DB 4 / respaldo 3), rotación infantil de ocho semanas, cuatro complementos y video automático adulto comprobado. Horario/contexto ya recibidos: no repetir preguntas. La propuesta privada se revisa y guarda desde el perfil elegido; no está hardcodeada. Continuar enseñanza de ejercicios sin demostración suficiente e integración infantil compatible. No rehacer calendario/perfiles ni declarar completos los tres objetivos. Los párrafos siguientes conservan antecedentes.


Continuación actual: [rutas adultas individuales y complementos infantiles](docs/reviews/personal-programs-and-visual-coverage.md), agenda por perfil, 69 fichas y cobertura visual explícita. Contexto y aclaración de disponibilidad recibidos: no repetir preguntas. Biblioteca humana todavía incompleta y YouTube infantil sin habilitar; no declarar cierre de los tres objetivos. Sony A80J identificada, [ruta documental](docs/reviews/sony-a80j-compatibility.md), prueba física pendiente. Consultar primero PROJECT_STATUS; datos reales fuera de Git.

Última entrega técnica 2026-10-04: [perfiles e historiales aislados](docs/reviews/participant-isolation.md) implementados, con respaldo/restauración y conservación del legado. Continuar desde la [cobertura pendiente de los tres objetivos](docs/reviews/three-objective-coverage.md) y PROJECT_STATUS, no rehacer perfiles ni confundirlos con planes personales completos. El menú infantil sigue documental y la biblioteca visual incompleta.

Corrección de continuidad 2026-10-04: los tres objetivos nuevos se suman al alcance acumulado. Conservar requisitos, avances y pendientes anteriores; no reiniciar el proyecto. El usuario delega crear, investigar, revisar, aprobar técnicamente y dar seguimiento al trabajo autorizado con [criterios verificables](docs/plans/three-objectives-delivery.md). Continuar sin pedir aprobación por paso; consultar solo información o permisos indispensables que no estén resueltos.

Continuidad 2026-10-04: leer [PROJECT_STATUS](PROJECT_STATUS.md) y [tres objetivos](docs/product/THREE_OBJECTIVES.md). El destino incluye móvil/web/TV y rutas adulta/infantil separadas. Hay biblioteca y recorridos de la entrega anterior; no perfiles aislados ni plan infantil ejecutable. El texto de fases iniciales siguiente es histórico, no una orden de reiniciar ni un veto al alcance posteriormente autorizado.

Continuidad del 2026-10-02: leer primero [PROJECT_STATUS](PROJECT_STATUS.md) y la [visión ampliada](docs/product/ADAPTIVE_FOOTBALL_COACH_VISION.md). El objetivo ya incluye creación conversacional de planes, explicación y seguimiento en varios entornos. Las referencias históricas a una hora fija describen el primer entregable; no descartan esa evolución. El plan anual, conversación y seguimiento no están implementados todavía.

Este documento conserva la guía histórica desde cero del paquete v4. Desde el 2026-09-28 sí existe una base web de diagnóstico: consultar [desarrollo local](docs/setup/LOCAL_DEVELOPMENT.md) y el estado actual antes de usar las instrucciones históricas. No combines carpetas anteriores.

Continuidad del proyecto ya abierto: leer [PROJECT_STATUS.md](PROJECT_STATUS.md). Al 2026-10-01, 00–06 aceptadas con sus límites documentados; 07 implementada y verificada técnicamente, incluidas dos pruebas independientes de una hora real. El usuario considera correcto el flujo, pero cuestiona repetición/nivel: [revisión de contenido abierta](docs/reviews/phase07-content-reassessment.md). [Cierre de 06](docs/reviews/phase06-closeout.md), [informe de 07](docs/reviews/phase07-hour-review.md). No iniciar 08–09 ni repetir extracción, Git init o preparación global.

La guía siguiente describe el inicio original. Tras revisar los pendientes de 02 uno a uno, el usuario restablece el avance autónomo y pide interrumpir únicamente por preguntas indispensables. [Resultado de 02](docs/reviews/phase02-bootstrap-review.md): controles, teclado, ancho reducido y consola revisados manualmente por el usuario; captura conservada e inspeccionada por el agente. Puntos de control locales: 7ea6b02 y 2d3c993; cierre de 03 en b3fb216. Las autorizaciones posteriores están en PROJECT_STATUS. La evidencia visual previa no valida la pantalla nueva. No pedir confirmación de cada operación rutinaria del alcance vigente.

Último seguimiento documental: [plan gradual](docs/training/GRADUAL_DEVELOPMENT_PLAN.md) y [siguiente contenido de 07](docs/plans/phase07-progressive-content.md). El usuario prepara la aplicación antes de entrenar. Las semanas propuestas no son una fecha garantizada de nivel profesional; no asumir acceso a datos médicos de otros chats ni guardarlos en Git. Continuar desde esas decisiones sin repetir los objetivos ya respondidos.

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
