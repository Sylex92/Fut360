# PRD — MVP1: sesión 3D de 60 minutos en 2×2 m

Actualización de visión del 2026-10-02: el usuario solicita [diseñar y seguir planes conversando desde la app](ADAPTIVE_FOOTBALL_COACH_VISION.md), con distintos objetivos, duraciones y entornos. Este PRD conserva el primer entregable y sus pruebas; sus exclusiones no son un veto permanente al producto ampliado. El planificador y la conversación todavía no están implementados.

## Resultado esperado

Una PWA instalable reproduce una sesión fija de 60 minutos. El usuario puede seguir un avatar 3D y completar la sesión sin consultar una hoja externa.

## Usuario

Persona que entrena fútbol en casa, en una zona libre de al menos 2×2 m, con balón, silla firme, bandas cortas y tapete según declaración del usuario. Edad, condición física y adecuación individual no están acreditadas. Teléfono objetivo: Samsung Galaxy S24 FE, Android 16, Chrome; computadora Windows actual. TV futura.

## Historias principales

1. Como usuario, quiero iniciar la sesión y ver claramente el ejercicio actual.
2. Quiero cambiar entre cámara frontal, lateral y 3/4.
3. Quiero saber cuánto falta y qué ejercicio sigue.
4. Quiero pausar, repetir, omitir o terminar de forma segura.
5. Quiero escuchar un aviso en los últimos cinco segundos.
6. Quiero poder registrar esfuerzo percibido y molestias declaradas al finalizar, de forma opcional.
7. Quiero que la sesión siga disponible sin conexión después de cargarla.

## Requisitos funcionales

- Pantalla previa con duración, material, espacio y advertencias.
- Timeline por bloques.
- Clips 3D: bucle solo para movimientos cíclicos revisados; series finitas y descanso cuando corresponde.
- Cronómetro determinista.
- Demostración programada opcional, trabajo y descanso. Vista previa/preparación del próximo ejercicio dentro del descanso; autoinicio al terminar y pausa para disponer de más tiempo.
- Nombre, lado, ronda y cues.
- Cámara frontal/lateral/3/4.
- Controles: iniciar, pausar, continuar, repetir, omitir, salir.
- Vista previa automática del próximo ejercicio durante preparación/descanso; acciones directas +30 s/+1 min para alargar preparación manteniendo ejemplo y autoinicio. Sin menú ni confirmación adicional. Pausar todo conserva una interrupción indefinida.
- Beeps opcionales con equivalente visible; voz no necesaria para completar el MVP1 y, si se incorpora, local y con derechos.
- Vuelta a la calma incluida.
- Registro local:
  - fecha;
  - completada o incompleta;
  - reproducción base, extras, omisiones, pausas y huecos separados, sin inferir actividad física medida;
  - RPE;
  - rodilla antes/después;
  - notas.

## Requisitos no funcionales

- Sin cuenta ni conexión obligatoria.
- Responsive.
- Subtítulos siempre visibles.
- Sin datos personales dentro del repositorio.
- Assets versionados y con licencia.
- Validación automática de la duración total.
- Recuperación razonable si se recarga la página durante la sesión.

Contrato normativo de fase 01: [motor](../architecture/SESSION_ENGINE_CONTRACT.md), [datos/recuperación](../architecture/DOMAIN_MODEL.md) y [arquitectura/dispositivos](../architecture/ARCHITECTURE.md). Pausar todo congela programa y visualización; repetir añade una ocurrencia tras el descanso actual; omitir conserva descanso. La demostración previa es automática; añadir +30 s/+1 min conserva lo programado y aumenta el tiempo hasta el trabajo, sin exigir otro toque. Al llegar a cero se cierra el ejemplo y comienza práctica en su inicio. Inspección de trabajo iniciado conserva su cursor. Ocultación pausa ambos; volver visible retoma automáticamente solo si estaba en marcha y la pausa se debió únicamente a ocultación. Pausa manual, fallos y recarga mantienen recuperación explícita; no acreditar tiempo cerrado. Corrección del usuario del 2026-09-29: [ADR 0010](../architecture/adr/0010-resume-on-visible.md).

## Criterios de aceptación

- La definición de sesión suma exactamente 3,600 segundos.
- Se puede completar una sesión de prueba acelerada de inicio a fin.
- La máquina de estados no salta ni duplica intervalos.
- Pausar todo congela tiempo y animación. Ampliar preparación mantiene el ejemplo y la duración íntegra de trabajo; comprobar autoinicio y ausencia de confirmación extra.
- Cambiar cámara no reinicia el intervalo.
- Cada ejercicio entregado para entrenamiento tiene ficha, variante, lados y asset compatible revisado. Un fallback identificado sirve únicamente para desarrollo y bloquea esa entrega.
- El usuario puede terminar y guardar su registro local.
- La PWA abre offline después de una primera carga correcta.
- No hay errores de consola durante el flujo principal.

## Fuera del alcance

- Generación dinámica de rutina.
- Diagnóstico o corrección médica.
- Conteo por cámara.
- Sincronización cloud.
- Autenticación.
- Integración con wearables.
- Feed social.
- Pagos.
- Exportación MP4.
- Simulación realista de fut 5, fut 7 o fut 11.

## Revisión de alcance — condiciones de aceptación adicionales

- Todo el flujo principal funciona sin pago, claves ni suscripción del desarrollador.
- Software, assets y dependencias transitivas tienen evidencia de licencia compatible.
- Rapier se reutiliza para la prueba de contacto; no se implementa física propia.
- El reproductor usa gestos claramente legibles y revisados, no un ragdoll ni hiperrealismo.
- Una repetición guiada conserva el mismo contacto/pose y cronómetro tras cambiar cámara.
- Los placeholders se permiten en desarrollo, pero el MVP final debe tener cobertura real de todos los ejercicios de la sesión.
- El JSON de 60 minutos se considera draft hasta revisión de contenido; validar tiempo no valida la sesión deportivamente.
- No se considera completa una sesión cuyos ejercicios están solo en fallback.

## Catálogo conciliado en fase 01

El [catálogo objetivo](../training/EXERCISE_CATALOG_SCOPE.md) adopta doce patrones con variantes/combinaciones como base de autoría, a partir de la investigación de 00. El [presupuesto de sesión](../training/MVP1_60_MIN_SESSION.md) es 8/12/10/16/8/6 minutos. Fichas completas, dosis y clips aún pendientes. El fixture v1 de 31 IDs se conserva como prueba estructural/temporal; no representa el programa nuevo aprobado ni obliga a fabricar ejercicios descartados por razones de contenido.

Comprensión se evalúa observando identificación del lado, apoyo, gesto, objetivo y acceso a pausa; preferencia no demuestra comprensión o aprendizaje. Las revisiones técnicas, humanas y deportivas se registran con su alcance real. No se promete llegar a profesional ni medir transferencia al campo desde esta sesión doméstica.

## Política económica vigente (v4)

Aplicar ZERO_COST_AND_GROWTH_POLICY.md y ADR 0008. No se exige software open source. El agente debe mostrar costo y disparadores por funcionalidad/proveedor. La preferencia por gratuidad no permite ocultar límites ni sustituye revisión de derechos. Ningún gasto está autorizado por este PRD.
