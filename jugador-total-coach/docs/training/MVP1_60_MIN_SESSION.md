# Sesión MVP1 — presupuesto de 60 minutos

Actualización: 2026-09-27. Dos estados distintos: fixture histórico comprobable y programa objetivo documental. Ninguno está aprobado para entrenar.

## Fixture v1 conservado

Archivo: [mvp1-60min.workout.json](../../content/examples/mvp1-60min.workout.json). Draft, versión 1, 31 IDs. Distribución original 5/12/12/16/8/7 minutos. Suma: 2475 s de trabajo + 1125 s de descanso = 3600 s. Sirve para probar estructura, expansión de rondas y duración; sus nombres/intensidades no gobiernan el catálogo nuevo.

No sobrescribirlo durante fase 01 ni presentarlo como sesión revisada.

## Programa objetivo adoptado para autoría

Basado en [dirección deportiva](../reviews/training-design-recommendation.md) y [catálogo conciliado](EXERCISE_CATALOG_SCOPE.md). Es presupuesto de diseño; falta repartir dosis, demostraciones, trabajo, descansos y transiciones con fichas revisadas.

| Bloque | Minutos | Segundos | Intención |
|---|---:|---:|---|
| Preparación gradual | 8 | 480 | Marcha, movilidad y familiarización |
| Fundamentos de balón | 12 | 720 | Tres patrones controlados, ambos pies |
| Orientación corporal | 10 | 600 | Combinar control y giro por pasos; sin oposición |
| Preparación física general | 16 | 960 | Patrones de pie y después suelo; series finitas |
| Integración técnica | 8 | 480 | Reutilizar fundamentos; no sprint ni agilidad reactiva certificada |
| Descenso gradual de actividad | 6 | 360 | Marcha suave y respiración cómoda |
| **Total** | **60** | **3600** | Incluye explicación programada y recuperación |

No imponer actividad continua durante un bloque ni deducir intensidad de su duración. Este presupuesto puede revisarse por evidencia de contenido antes de publicar el nuevo workout; conservar siempre suma exacta y motivo del cambio.

En fase 06 se preparan fichas/recursos y se comprueba dosis, lados, espacio y tiempos de preparación. En 07 se compila una nueva versión del workout con cada referencia resuelta y exactamente 3600 s. El nuevo formato se implementará con validadores en fases técnicas; no hacer una conversión de nombres sobre el fixture original.

## Tiempo y experiencia

Pausa detiene programa y avatar; continuar recupera el punto exacto. Descanso muestra lo siguiente y su material, con avance automático al finalizar. Repetir añade una ocurrencia completa después del descanso actual. Omitir trabajo conserva el descanso y queda registrado. Detalles normativos en [motor](../architecture/SESSION_ENGINE_CONTRACT.md).

Corrección de revisión 01: vista previa y avance automáticos. +30 s/+1 min amplían preparación y mantienen el ejemplo, sin exigir pulsar al terminar. El tiempo se suma a lo que ya quedaba: 20 s + 30 s = inicio dentro de 50 s. Una ampliación de 30 s alarga una base de 3600 s a 3630 s, sin otros cambios. Trabajo y descanso programados quedan íntegros; preparación extra se registra aparte y el bucle no cuenta repeticiones. Pausar todo sigue siendo la interrupción indefinida explícita.

Los 60 minutos son tiempo programado. Pausas/extras alargan la ejecución; omisiones la acortan. Huecos de cierre/suspensión se distinguen de tiempo registrado. Nada de ello mide actividad física real automáticamente.

## Condiciones de entrega

Preparación y vuelta a la calma incluidas, dosis finita cuando corresponde, material dentro de 2×2 y posibilidad inmediata de pausar/terminar. Indicaciones de detenerse ya recogidas en las fichas, sin diagnóstico ni sustitución automática.

No afirmar entrenamiento profesional o aprendizaje táctico a partir de seguir el avatar. El usuario revisará fichas y demostraciones junto con el agente; atribuir únicamente las revisiones efectivamente realizadas. El programa conserva draft hasta completar las revisiones exigidas y las pruebas de reproducción.
