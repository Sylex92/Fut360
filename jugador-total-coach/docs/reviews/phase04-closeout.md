# Cierre de fase 04 — 2026-09-30

**Fase 04 cerrada como prototipo técnico de un ejercicio.** La comprobación móvil y la claridad de la demostración quedaron aceptadas por el usuario. Esto no habilita todavía una rutina de entrenamiento ni autoriza 05.

## Criterios y evidencia

| Entrega | Evidencia que permite cerrar |
|---|---|
| Avatar riggeado, clip y escena 2×2 | Recurso concreto de Quaternius Standard CC0; fuente editable, rig conservado, GLB validado, escala/apoyos y muestras revisados. [Informe](phase04-vertical-slice-review.md). |
| Demostración comprensible | El usuario confirma «La demostración se entiende claramente» al revisar avatar e indicaciones de una bisagra completa. Es aceptación de claridad, sin atribuirle validación biomecánica profesional. |
| Reloj, cámaras, preparación e inspector | 128 pruebas en nueve archivos, E2E real de un minuto, preparación adicional, pausa/retorno de pose/foco, cámaras, repetición/cancelación/omisión. [Informe del navegador](phase04-browser-review.md). |
| Recorrido de cinco minutos | Usuario confirma que no hubo anomalías después del ensayo solicitado de cinco bloques y final único. No se inventa medición de FPS o cronometría externa. |
| Recuperación de fallos | GLB fallido, timeout, módulo y pérdida de contexto WebGL inducidos; bloqueo de avance, reintento y continuación explícita comprobados. |
| PC y móvil | Capturas/E2E de escritorio y muestra RAF al frente; [Samsung físico](phase04-mobile-review.md) con resultado «Todas salieron bien» para fluidez, lectura, cámaras y +30 s/autoinicio. |
| Verificaciones de código | Lint, tipos, formato, build y 128 pruebas correctos en b63a325; código y recursos sin cambios durante este cierre documental. No se finge otra ejecución. |
| Licencias y costos | [Dependencias auditadas](phase04-dependencies.md), [recursos](../../ASSET_LICENSES.md), herramientas locales y sin pagos/servicios nuevos. |
| Reproducibilidad | Fuente Blender, hashes, capturas, datos de navegador y puntos de control locales. Revisión de texto de pausa y E2E guardados en b63a325; aceptación documental guardada en un punto de control posterior. |

## Límites conservados

- Ficha y clip siguen **draft como contenido deportivo**. La aceptación de claridad y funcionamiento no valida dosis, adecuación individual, eficacia, aprendizaje, transferencia al fútbol ni revisión profesional. Conservar la demostración identificada como «en revisión» mientras esos aspectos sigan pendientes para el producto de entrenamiento.
- Un gesto de 8 s, tres repeticiones por ventana técnica y ensayos de 1/5 minutos. No existe todavía la hora completa, una biblioteca de ejercicios aprobada, voz, persistencia, PWA/offline o simulación de balón.
- Móvil aceptado por reporte cualitativo; versión exacta de Chrome, FPS, temperatura/batería y uso prolongado no medidos. La muestra RAF de escritorio al frente es breve; se conserva también la muestra inicial lenta.
- Cero errores normales de consola de escritorio; aviso de THREE.Clock de Fiber. Advertencias de CommonJS de Three en tests y chunk 3D >500 KB conservadas. No se atribuye revisión de consola al teléfono.
- Preview LAN temporal en puerto 4174, con dirección dependiente de la Wi-Fi y logs/PID en .local. No es publicación, instalación PWA ni acceso offline. Sin cambios de firewall/router/certificados.

## Siguiente alcance para autorización, todavía no ejecutado

La fase 05 de [la hoja de ruta](../plans/ROADMAP.md), según [su prompt](../../prompts/05-contact-spike.md), consiste en una prueba pequeña de contactos con suelo, balón y pie, reutilizando Rapier y react-three-rapier. Se revisarán versiones compatibles, procedencia y licencias antes de incorporar dependencias locales necesarias; no se presupone válida la versión transitiva de desarrollo ya presente.

El laboratorio tendrá pausa/reset, colliders visibles para depuración y contactos lentos/rápidos; se contrastará a distintas tasas de render. El pie empezará como forma de prueba y después seguirá un hueso del avatar. Se comparará con un interior-interior guiado por clip sincronizado, declarando quién controla cada objeto en cada momento. No se combinarán AnimationMixer y Rapier como autoridades simultáneas del balón.

Entrega prevista: evidencia, configuración/versiones, límites y decisión fundamentada de qué física aporta al tutorial. El rebote calculado no certifica la enseñanza ni obliga a convertir la demostración en física libre. Sin ragdoll, aerodinámica, partido, pagos, publicación, configuración global ni ampliación de la hora completa. Este texto prepara una autorización concreta; no ejecuta 05 ni incorpora software.

Verificación de este cierre documental: 76 documentos UTF-8 y 323 enlaces locales correctos, git diff --check sin incidencias. Solo diez documentos modificados/nuevos; sin cambios de código, dependencias o recursos desde b63a325 ni otra ejecución de las pruebas técnicas.
