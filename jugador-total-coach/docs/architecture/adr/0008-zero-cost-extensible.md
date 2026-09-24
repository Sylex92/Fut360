# ADR 0008 — Costo cero y extensibilidad; software gratuito no abierto permitido

Fecha: 2026-09-24. Estado: aceptado como requisito del usuario.
Sustituye las restricciones FOSS de ADR 0005 y la excepción pendiente de ADR 0007.

## Decisión

Aceptar herramientas gratuitas de cualquier modelo de licencia cuando cubran el uso previsto y las ampliaciones funcionales evaluadas sin pago obligatorio. No aprobar una herramienta solo por anunciarse gratis. No descartar una herramienta solo por no ser open source.

Remotion vuelve a ser candidato admisible condicionado para exportación local posterior al MVP1. No requiere excepción FOSS. La revisión de elegibilidad, versión, derechos y costo es obligatoria antes de incorporarlo; no se ha instalado.

## Arquitectura

Conservar el núcleo local-first. El dominio y formato de sesión no importan tipos ni proyectos de un exportador. Los módulos de exportación e integraciones se añadirán cuando una fase los necesite. Los assets editables y datos deberán ser portables dentro de los derechos disponibles.

## Consecuencias

- Más opciones de reutilización, sin rehacer lo ya resuelto.
- Revisión de costo/derechos para cada ampliación; no promesa de gratuidad universal.
- Ningún pago sin autorización expresa.
- El componente condicionado es reemplazable, pero sustituirlo requiere trabajo y respetar su licencia.
- Proveedor, equipo, operación pública, distribución y versión son disparadores de nueva evaluación.
- El alcance MVP1 no cambia: sesión fija 60 min en 2×2, PWA/avatar, sin exportación ni conectores.

## Referencias
`docs/product/ZERO_COST_AND_GROWTH_POLICY.md`
`docs/product/FEATURE_COST_REVIEW.md`
`docs/research/REMOTION_LICENSE_REVIEW.md`
