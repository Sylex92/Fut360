# PRD — MVP1: sesión 3D de 60 minutos en 2×2 m

## Resultado esperado

Una PWA instalable reproduce una sesión fija de 60 minutos. El usuario puede seguir un avatar 3D y completar la sesión sin consultar una hoja externa.

## Usuario

Adulto que entrena fútbol en casa, dispone de un espacio aproximado de 2×2 m, balón, silla, bandas cortas y tapete.

## Historias principales

1. Como usuario, quiero iniciar la sesión y ver claramente el ejercicio actual.
2. Quiero cambiar entre cámara frontal, lateral y 3/4.
3. Quiero saber cuánto falta y qué ejercicio sigue.
4. Quiero pausar, repetir, omitir o terminar de forma segura.
5. Quiero escuchar un aviso en los últimos cinco segundos.
6. Quiero registrar esfuerzo percibido y estado de rodilla al finalizar.
7. Quiero que la sesión siga disponible sin conexión después de cargarla.

## Requisitos funcionales

- Pantalla previa con duración, material, espacio y advertencias.
- Timeline por bloques.
- Animación 3D en bucle.
- Cronómetro determinista.
- Trabajo, descanso y transición.
- Nombre, lado, ronda y cues.
- Cámara frontal/lateral/3/4.
- Controles: iniciar, pausar, continuar, repetir, omitir, salir.
- Beeps y voz opcional.
- Vuelta a la calma incluida.
- Registro local:
  - fecha;
  - completada o incompleta;
  - duración realizada;
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

## Criterios de aceptación

- La definición de sesión suma exactamente 3,600 segundos.
- Se puede completar una sesión de prueba acelerada de inicio a fin.
- La máquina de estados no salta ni duplica intervalos.
- Pausar congela el tiempo y la animación.
- Cambiar cámara no reinicia el intervalo.
- Cada ejercicio encuentra un asset compatible o muestra fallback explícito.
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

## Política económica vigente (v4)

Aplicar ZERO_COST_AND_GROWTH_POLICY.md y ADR 0008. No se exige software open source. El agente debe mostrar costo y disparadores por funcionalidad/proveedor. La preferencia por gratuidad no permite ocultar límites ni sustituye revisión de derechos. Ningún gasto está autorizado por este PRD.
