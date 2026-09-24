# ADR 0001 — Monorepo y monolito modular

## Estado
Aceptado inicialmente.

## Decisión
Usar un monorepo con paquetes de dominio y una sola PWA desplegable.

## Razón
Reduce complejidad operacional y mantiene límites claros. No existen necesidades reales de escalado independiente en MVP1.

## Consecuencia
No se crearán microservicios ni una API hasta que una función concreta lo necesite.
