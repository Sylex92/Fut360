# ADR 0006 — Reutilizar Rapier y conservar clips guiados

Estado: decisión de diseño consolidada en fase 01; versiones y adaptación pendientes de prueba. Fecha inicial: 2026-09-24. Actualización: 2026-09-27.

## Decisión

No escribir física propia. Rapier + react-three-rapier para contactos/simulación; Three.js/AnimationMixer para clips. Tutorial reproducible con autoridad authored. Laboratorio de física con pie cinemático y balón dinámico, limitado a validar la integración.

El MVP1 usa Three/Fiber + AnimationMixer. Remotion Player es una alternativa admisible, pero añadiría composición por fotogramas y coordinación sin ahorro demostrado para esta escena GLB; ambas rutas necesitan el dominio de sesión. No es un descarte por licencia ni un benchmark de rendimiento. La exportación futura puede justificar reconsiderarlo conforme a ADR 0008. No crear ahora un compositor o adaptador vacío.

Tutorial y laboratorio son escenas independientes; no transferir el mismo balón en caliente entre motores durante una sesión. El pie cinemático se dirige mediante la API de Rapier, sin otro escritor del nodo. El visor consume la proyección del reloj del dominio. La simulación tiene su propio paso fijo y reinicio explícito; no determina qué técnica debe enseñarse.

## Consecuencias

Un objeto tiene una autoridad de transform a la vez. No suponer que colisiones producen técnica correcta ni que kinematic impide atravesar el suelo. Reutilizar un humanoide riggeado antes de construir otro.

Un recurso difícil o defectuoso se adapta/corrige conservando el ejercicio adecuado. Clips de fuerza finitos y descansos explícitos; solo movimientos cíclicos se repiten en bucle. La inspección lenta ocurre con la sesión pausada. Faltan archivos y pruebas, por lo que esta decisión no acredita calidad deportiva ni compatibilidad real.

## Alternativas

Otros motores libres pueden reconsiderarse si falla un criterio documentado, no por construir abstracciones genéricas de antemano. No se incorpora un segundo motor en MVP1.

## Fuentes

S01–S08 de SOURCES.md.

Contratos: [arquitectura](../ARCHITECTURE.md), [motor](../SESSION_ENGINE_CONTRACT.md), [física/animación](../../3d/PHYSICS_AND_ANIMATION.md) y [Remotion](../../research/REMOTION_LICENSE_REVIEW.md).
