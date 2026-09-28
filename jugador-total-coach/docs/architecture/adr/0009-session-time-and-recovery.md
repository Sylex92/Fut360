# ADR 0009 — Un reloj de sesión y recuperación explícita

Fecha: 2026-09-27. Actualización: 2026-09-28. Estado: política temporal implementada y probada en 03; inspector/3D y recuperación durable pendientes. [Evidencia y límites de 03](../../reviews/phase03-session-engine-review.md). Pruebas con reloj simulado correctas; validación visual/interactiva nueva todavía pendiente.

## Problema

Cronómetro, animación y audio podrían avanzar por separado; repetir o recargar podría recortar programa, duplicar ejercicio o atribuir entrenamiento durante un cierre. El usuario exige pausa exacta y tiempo adicional real al repetir.

## Decisión

Motor puro con plan versionado inmutable, avance monotónico inyectado y comandos serializados. La app adapta navegador, visor y almacenamiento. Un único cursor gobierna el entrenamiento. Pausa congela; visibilidad oculta pausa automáticamente, regreso visible exige continuar. Cámara no cambia tiempo/lado. Inspección lenta solo estando pausado, con restauración del cursor de sesión.

Corrección explícita del usuario durante 01: avance automático también después de necesitar más preparación. La vista previa se muestra sin activarla manualmente; +30 s/+1 min amplían el tiempo con un toque y el motor empieza práctica al agotarlo. Se retira la propuesta de espera indefinida con confirmación de estar listo. Programa base inmutable, extensión temporizada registrada aparte y cursor visual sin crédito de trabajo. Pausar todo sigue disponible para una interrupción indefinida y congela ambas reproducciones.

Repetir encola una ocurrencia completa después del descanso actual; omitir trabajo conserva descanso y registra omisión. Separar tiempo base, extras, pausas y huecos no observados. No inferir ejecución corporal a partir de reproducción.

Eventos y checkpoints locales consistentes. Recuperar al último punto confirmado, pausado y con versiones de contenido fijadas. No derivar trabajo de la fecha del sistema ni prometer guardado perfecto ante cierres. Importación valida antes de escribir y no ejecuta contenido.

## Alternativas y consecuencias

Relojes separados facilitan componentes aislados, pero arriesgan deriva y requieren correcciones. Reiniciar inmediatamente al repetir descarta trabajo actual; encolar conserva el programa y permite preparación. Avanzar oculto evita interrupciones, pero el teléfono puede suspender render/timers y nadie ve la demostración; se elige pausa explícita.

Costos de la decisión: compilador de programa, comandos idempotentes, registro de huecos y tests de fronteras. Es lógica propia del entrenador, no un nuevo reproductor multimedia. Parámetros de detección y frecuencia de guardado se validarán en dispositivos, sin convertirlos en leyes universales.

Preparación requiere duración adicional, reproducción explicativa y tests de fronteras/autoinicio. Se elige una extensión temporizada porque resuelve la necesidad con un toque; una espera manual añadiría otra intervención para empezar, rechazada por el usuario. Mostrar cuenta resultante y mantener descanso/trabajo completos. La duración 30/60 s procede de la propuesta del usuario, no de una dosis médica o de una superioridad de usabilidad demostrada.

## Contratos y evidencia

[Motor de sesión](../SESSION_ENGINE_CONTRACT.md), [datos/persistencia](../DOMAIN_MODEL.md) y [arquitectura](../ARCHITECTURE.md). Fuentes técnicas consultadas el 2026-09-27: [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) y [transacciones IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB). Las fuentes explican las capacidades/límites; las reglas de producto son decisiones del proyecto.
