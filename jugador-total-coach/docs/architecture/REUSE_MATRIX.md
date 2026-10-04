# Matriz de reutilización

## Contexto y agenda — 2026-10-04

Se amplía Participant/IndexedDB para disponibilidad, semana tipo y versiones; mismo compilador y propuestas. Sin dependencia nueva ni calendario externo. IndexedDB v3 conserva almacenes y registros y evita escrituras de aplicaciones antiguas que perderían campos. Respaldos con agenda usan formato 2; los anteriores siguen legibles. [Plan y costo](../plans/context-and-week.md), [Sony A80J y límites](../reviews/sony-a80j-compatibility.md).

## Perfiles — 2026-10-04

Extensión de IndexedDB existente a v2, sin borrar v1: almacén de participantes, ámbito de persona y transacciones nativas. Reutiliza SessionEngine/journal, historial, componentes React y validación de archivos. No se añade proveedor de identidad, nube, librería de datos o dependencia. [Pruebas, costo y límites](../reviews/participant-isolation.md).

## Enseñanza con video y plan — 2026-10-03

[ADR 0016](adr/0016-human-reference-and-visible-plan.md): reutilizar YouTube oficial, SessionEngine/SessionClock/ExecutionPlan, IndexedDB/historial y Ajv existente. Adaptar 32 familias a 52 fichas y cinco recorridos variables; pantallas/esquemas propios. Sin reproductor audiovisual propio, solver, rig nuevo ni dependencias. El 3D conserva pruebas técnicas, con claridad reabierta. [Costo/derechos](../reviews/video-reference-cost-and-rights.md).

## Planificación conversacional — 2026-10-02

Reutilizar dominio, compilador, motor, React, visor/rig y autoría Blender. Extender formato/catálogo y persistencia por entregas, sin construir otro reproductor ni editor de animación. La carencia verificada: el esquema v2 fija duración/bloques y la composición importa un workout al compilar; no existen conversación, perfil persistido ni planes longitudinales. [Visión y comprobaciones](../product/ADAPTIVE_FOOTBALL_COACH_VISION.md), [alternativas de integración](../reviews/conversational-coach-feasibility.md). No se han seleccionado dependencias ni creado adaptadores vacíos.

## Actualización de fase 07 — 2026-10-01

La sesión completa reutiliza SessionEngine/SessionClock, React, Ajv, GLTFLoader/ClipDriver/AnimationMixer y las cámaras de 04–06. Precarga dieciséis recursos existentes para cambiar de ejercicio sin nueva red; solo un avatar/clip es visible y evalúa pose por instante. No cambia rig, geometría, física ni editor. La composición específica añade workout v2, resolución de lados/tiempos, instrucciones y timeline. Web Audio proporciona el aviso final local tras gesto; no hay archivo/servicio musical. [Costos y condiciones](../reviews/phase07-cost-and-reuse.md).

Decisiones iniciales y evidencias añadidas por fase. El inventario instalado está en los informes de 02/04. Repaso documental del 2026-09-25: véase la [auditoría de reutilización](../reviews/reuse-audit.md), con criterios de elección, límites de edición y recorrido del primer gesto.

| Necesidad | Reutilizar | Trabajo propio permitido |
|---|---|---|
| Interfaz | React + Vite + TypeScript | Pantallas, accesibilidad, flujo de entrenamiento |
| Render 3D | Three.js + React Three Fiber | Escena, cámaras y adaptación de assets |
| Reproducción | AnimationMixer / clips GLB como base; Remotion Player como alternativa no adoptada, evaluada en la [revisión específica](../research/REMOTION_LICENSE_REVIEW.md) | Coordinar tiempo, lado, cues y pausas; una única autoridad temporal |
| Física | Rapier + react-three-rapier | Configurar colliders, materiales, eventos, snapshots |
| Avatar | Humanoide riggeado gratuito CC0/compatible | Ropa simple, escala, importación y mapa de huesos |
| Rig y animación | Blender y rig existente; ayudas de retarget/IK auditadas si hacen falta, sin complemento elegido | Adaptar gestos específicos no disponibles; comprobar controles conservados al importar y resultado exportado |
| Entorno/props | Assets CC0; primitivas de Three.js cuando sean más simples | Delimitar 2×2 y colocar recursos sin estorbar |
| Datos | IndexedDB; evaluar wrapper gratuito compatible solo si reduce trabajo | Modelo de sesión y adaptador pequeño |
| Tests | Vitest/Playwright, tras revisión de licencias y versión | Casos de tiempo, claridad, offline y contacto |
| Audio | Señales Web Audio y grabaciones propias | Cues cortos sincronizados |
| Video futuro | Remotion como candidato condicionado (ADR 0008), o captura local + FFmpeg revisado | Adaptación mínima; no un compositor completo propio si ya existe una solución compatible |

No crear un motor de animación, física o rigging. Sí crear el dominio de entrenamientos y las reglas de integración: no hay una biblioteca que por sí sola represente nuestros objetivos.

## Candidatos de recursos

- Quaternius Universal Base Characters: se anuncia CC0, rig humanoide y glTF; verificar el subconjunto gratuito. Los .blend Source no se presumen gratuitos.
- Quaternius Universal Animation Library: evaluar solo clips gratuitos concretos. No asumir que contiene ball mastery ni todos los ejercicios de fuerza.
- Kenney: recursos CC0 en sus páginas de assets; evaluar props o entorno antes de modelarlos.

Antes de elegir avatar, documentar acceso gratuito, malla editable/importable, huesos, pies/toes, exportación GLB, restricciones, tamaño y prueba de un clip. No forzar un rig nuevo si basta un mapa de huesos.

Estado del 2026-09-25: ningún archivo descargado ni clip aprobado. La compatibilidad anunciada entre packs no demuestra cobertura deportiva ni transferencia sin ajustes. Conciliar primero la propuesta de doce patrones con los 31 IDs del fixture antes de producir el catálogo completo. Empezar con hip-hinge como prueba de claridad propuesta; la preparación mínima en Blender puede ser necesaria antes del primer ejercicio de fase 04 y no debe aplazarse artificialmente hasta 06.

## Registro obligatorio para crear algo propio

Problema concreto / componentes evaluados / carencia verificada / adaptación descartada y motivo / mínima pieza nueva / pruebas.

Fuentes: S01–S17 en `docs/research/SOURCES.md`.

## Consolidación de módulos propios — fase 01

Fecha: 2026-09-27. Árbol normativo en [ARCHITECTURE](ARCHITECTURE.md). Son piezas previstas, ninguna implementada. Las carencias siguientes se deducen de las responsabilidades documentadas de las bibliotecas; no se ha comparado rendimiento ni probado una integración. Registrar nuevas evidencias al construir.

| Pieza mínima | Reutilizar/adaptar primero | Carencia concreta y límite de lo propio | Comprobación futura |
|---|---|---|---|
| domain | Tipos y JSON Schema; formatos existentes | Reglas específicas de ejercicios, dosis, lados, evidencias y sesiones; ningún motor 3D define esas políticas del producto | Contratos, sumas y referencias; sin imports de plataforma |
| exercise-catalog | Validador JSON Schema auditado, GLB/glTF estándar | Resolver versiones y referencias, expandir rondas/lados y calcular segmentos; schema valida estructura, no aprobación deportiva | Errores por ruta/ID, duración exacta y cobertura por variante |
| session-engine | Tiempo monotónico mediante adaptador; bibliotecas de animación para reproducir | Política propia de pausa/extras/omisiones, estados y eventos. Reductor pequeño sin framework nuevo; evaluar una librería solo si reduce complejidad demostrada | Reloj inyectable, fronteras, duplicados y huecos |
| viewer-3d | Three/Fiber, loaders y AnimationMixer | Escena, evaluación por cursor, cámaras y mapping. No crear loader, mixer, solver IK ni editor | Gesto real, escala, contactos, pausa/inspección y dispositivos |
| physics-lab | Rapier/react-three-rapier y colliders existentes | Configuración de suelo/pie/bola, debug y reinicio; no física propia | Paso fijo, tolerancias, contactos y autoridad única |
| persistence | IndexedDB; wrapper únicamente si simplifica transacciones | Eventos/checkpoint, archivo e historial; no base de datos o sincronizador propio | Recarga, concurrencia, importación y borrado |
| apps/coach-pwa | React/Vite, APIs y ayuda PWA auditada cuando corresponda | Pantallas, accesibilidad, composición, audio y adaptación de tiempo/visibilidad; no framework de plugins propio | Diagnóstico, comprensión, E2E y offline |
| Herramientas de autoría/validación | Blender/exportador/retarget y validador glTF existentes | Configuración, manifiestos y comprobaciones específicas. Script solo ante trabajo repetitivo identificado | Trazabilidad y cobertura; sin recrear rig/exportador |

Avatar y escena se agrupan en viewer-3d porque no tienen consumidores independientes en MVP1. Esquemas en content/schemas, sin paquete duplicado. No crear módulos vacíos de estadísticas, telemetría, wearables o exportación.

Remotion Player quedó evaluado y no adoptado para MVP1: comparte la necesidad de dominio y Three, añade sincronización por frames sin ahorro demostrado en este alcance. Es revisable, no una descalificación técnica/licenciataria; [ADR 0006](adr/0006-rapier-and-guided-clips.md). Exportación conserva evaluación posterior. No construir para evitarlo un compositor propio.

El [catálogo conciliado](../training/EXERCISE_CATALOG_SCOPE.md) distingue doce patrones objetivo de 31 IDs históricos. Cobertura de recursos sigue en cero. Asistencia IA se añade solo por carencia concreta según [herramientas de producción](../reviews/ai-production-tools-review.md), sin asumir que elimina corrección ni costos.

## Evidencia de fase 02 — 2026-09-28

Implementados solo domain (tipos v1/aritmética), exercise-catalog (Ajv 2020-12 y reglas semánticas) y app (React/Vite). No se escribió un validador de JSON Schema ni un framework de estado. La suma y errores específicos del proyecto se probaron con 24 casos junto con el render de diagnóstico. Versiones/licencias y límites de evidencia: [informe de 02](../reviews/phase02-bootstrap-review.md). Los demás módulos de la tabla siguen previstos, no implementados.

## Evidencia de fase 03 — 2026-09-28

- Problema: conservar programa, pausa, preparación adicional, omisión y repetición con un único cursor. Se reutilizan React/Vite para UI, Ajv para validar, Vitest para pruebas y performance.now/Page Visibility a través de un adaptador; ninguna dependencia externa nueva.
- Pieza propia mínima: compilación v1 a ocurrencias inmutables y SessionEngine sin plataforma, dependiente solo de domain. La API del reloj entrega tiempo, pero no decide las reglas de omisión/repetición de este producto; el motor de animación futuro tampoco debe ser autoridad del programa.
- Alternativa: añadir un framework de máquinas de estados no evita esas reglas ni sus pruebas. No hay benchmark que demuestre ahorro de complejidad en este alcance; se conserva la decisión de 01 y se evalúa de nuevo si crece el estado. No se construyen física, rigging, editor, loader, compositor ni almacenamiento propios.
- Evidencia: 85 pruebas totales, incluidas fronteras, conservación, duplicados, IDs de extras, reloj/visibilidad inyectados, HTML y redondeo. Reporte manual favorable de controles/consola/Tab/ancho y captura inspeccionada. Conector indisponible: no se afirma E2E automatizado. [Cierre y límites](../reviews/phase03-session-engine-review.md).

## Evidencia de fase 04 — 2026-09-29

Problema: mostrar la bisagra y conservar las reglas temporales de 03. Se reutilizaron Three/Fiber, GLTFLoader/AnimationMixer, el rig CC0 de 65 huesos de Quaternius y las operaciones de IK/bake/exportación de Blender. Carencia comprobada: Regular no estaba en Base Standard y no había hip-hinge entre las 43 acciones del Animation Standard inspeccionado. Se adoptó Superhero masculino genérico y se creó solo el gesto sobre ese rig; no se compró Source ni se sustituyó el ejercicio.

Piezas propias: escena/cámaras, composición de cursores, ficha/manifiesto/mapping y scripts acotados de autoría/comprobación. No nuevo rig, solver, loader o editor. El visor recibe pose explícita y no importa el motor. Pruebas de recurso, composición y retorno tras reexportar; [informe y límites](../reviews/phase04-vertical-slice-review.md). Licencias concretas en [ASSET_LICENSES](../../ASSET_LICENSES.md). La fase 06 no se ejecutó; otros gestos y balón siguen pendientes.


## Evidencia de fase 05 — 2026-09-30

physics-lab implementado con Rapier 0.19.2/react-three-rapier 2.2.0: paso fijo, interpolación, CCD, consultas de formas y debug existentes. Adaptación propia limitada a configuración, muestreo de huesos antes del paso, panel y estado terminal. No solver, ragdoll ni controlador de drible.

Avatar, rig de 65 huesos, ropa, correcciones de brazos/hombros y ClipDriver reutilizados. Blender IK/bake/exportador prepara únicamente el clip interior-interior faltante, con balón geométrico propio y fuente editable. La bisagra y el motor de sesión no cambian. La matriz de pruebas demuestra contactos y continuidad, sin afirmar técnica deportiva validada.

La física libre no conserva automáticamente la trayectoria didáctica: se mantiene un clip sincronizado para enseñar y un laboratorio separado para inspeccionar. [ADR 0011](adr/0011-contact-spike-result.md), [costos/alternativas](../reviews/phase05-cost-and-dependencies.md), [evidencia](../reviews/phase05-contact-review.md).

## Evidencia de fase 06 — 2026-09-30

Seguimiento de biblioteca 07 (2026-10-02): dos variantes de una combinación reutilizan íntegramente malla/rig/materiales y poses coordinadas v2, con unión y exportación en Blender. Búsqueda/filtros con React/HTML/TypeScript existentes; ninguna dependencia nueva. Validadores del proyecto ampliados para el recurso y sus ventanas de contacto. [Decisión, costos y límites](../reviews/phase07-library-review.md).

Se reutilizan rig, pesos, ropa, clips de 04/05, Blender IK/bake/exportador, Three/Fiber y validador Khronos. Inventario de 43 acciones Standard revisado: ninguna cubre sin adaptación los nuevos patrones. Trece derivados locales cubren nueve patrones adicionales, con lados separados; no se añade motor/editor/solver ni dependencias. Fuentes editables y scripts de grupo, validación a 30 Hz y previsualización finita. [Decisión, límites y costos](../reviews/phase06-cost-and-reuse.md). No se ejecuta 07.

Corrección posterior de naturalidad: un clip completo de caminar no cumple la marcha estacionaria, pero sus curvas de brazos sí son reutilizables. Se extraen 129 muestras de Walk_Loop del Standard CC0 existente y se adaptan al ritmo de los apoyos de marcha/giro, sin retargetear sus piernas ni alterar el cuerpo. Se conservan mallas, pesos, materiales, texturas y huesos; nueve versiones v2 corrigen coordinación con Blender IK/bake. Balón y apoyos conservan autoría guiada, con pequeñas correcciones de contacto. No nuevo motor de locomoción, solver, modelo IA o dependencia. [Evidencia y límites](../reviews/phase06-natural-motion-review.md), [origen/licencia](../../ASSET_LICENSES.md).
