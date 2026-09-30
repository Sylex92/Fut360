# ADR 0012 — Fundamento deportivo documental separado del producto

Fecha: 2026-09-30. Decisión autorizada por el usuario al iniciar 06.

El usuario indica que probablemente no contará con una persona especialista que valide el contenido y pide fundamentarlo mediante las fuentes, el motivo de selección y qué se trabaja, exclusivamente en documentación, sin mostrarlo en la app.

Se adopta una revisión documental por recurso: variante exacta, propósito, capacidades o grupos musculares implicados, fundamento trazable, calidad/alcance de la fuente, adaptación a 2×2, dosis propuesta y límites. El agente prepara y contrasta; el usuario puede revisar claridad y observaciones sin asumir tareas científicas. Esta vía permite continuar el desarrollo sin contratación obligatoria ni bloquear todo el catálogo por ausencia de un revisor externo.

La revisión documental no equivale a observación profesional del clip o del usuario ni demuestra resultados individuales. No se concede automáticamente `coaching-reviewed`; se registra evidencia documental separada del estado técnico y de aceptación humana. Una cuestión concreta no resuelta se registra en el recurso afectado, no como un pendiente genérico repetido indefinidamente.

Los documentos de fundamento viven en docs/training y docs/reviews y no se importan ni se copian al build. La interfaz conserva instrucciones breves para entender y controlar la demostración; bibliografía, justificación de selección y análisis científico quedan fuera. No ocultar una limitación material del recurso tras esta separación.

Esta decisión sustituye la interpretación de una revisión externa como requisito universal para avanzar. No autoriza 07–09, no certifica una rutina completa ni cambia la política de costo cero. [Plan](../../plans/phase06-avatar-pipeline.md).
