# ADR 0006 — Reutilizar Rapier y conservar clips guiados

Estado: aceptado para el diseño; versiones y adaptación pendientes de prueba. Fecha: 2026-09-24.

## Decisión

No escribir física propia. Rapier + react-three-rapier para contactos/simulación; Three.js/AnimationMixer para clips. Tutorial reproducible con autoridad authored. Laboratorio de física con pie cinemático y balón dinámico, limitado a validar la integración.

## Consecuencias

Un objeto tiene una autoridad de transform a la vez. No suponer que colisiones producen técnica correcta ni que kinematic impide atravesar el suelo. Reutilizar un humanoide riggeado antes de construir otro.

## Alternativas

Otros motores libres pueden reconsiderarse si falla un criterio documentado, no por construir abstracciones genéricas de antemano. No se incorpora un segundo motor en MVP1.

## Fuentes

S01–S08 de SOURCES.md.
