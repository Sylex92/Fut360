# ADR 0014 — Planes conversacionales sobre un núcleo local verificable

2026-10-02. Ampliación de visión solicitada expresamente por el usuario: diseñar, mostrar y dar seguimiento a entrenamientos de fútbol desde la app. Desarrolla ADR 0013 sin convertir la propuesta anual en prescripción clínica ni garantía de nivel.

## Decisión

El producto tendrá composición de planes, explicación visual y seguimiento, con conversación integrada como objetivo explícito. La hora de 60 minutos en 2×2 sigue siendo el primer caso, no el límite permanente. Casa, cancha y gimnasio son contextos diferenciados; los cuatro objetivos de gol, extremo, mediocentro y defensa reciben cobertura progresiva.

Reutilizar motor temporal, catálogo, validación y visor. Preparar formato nuevo para duración/composición flexibles sin reinterpretar silenciosamente el esquema v2 fijo. El asistente entrega propuestas; la aplicación comprueba contratos y recursos antes de activarlas. Salud, cobertura visual y adecuación no se certifican porque el JSON sea válido.

La reproducción e historial local no dependen de una respuesta del modelo. Proveedor intercambiable; conversación externa con contexto explícito y consentimiento, sin acceso automático a chats previos ni credenciales heredadas. No conceder ejecución arbitraria de comandos a la conversación de entrenamiento.

## Alternativas y alcance

Importar planes preparados en este chat es transición posible; no satisface por sí solo conversación integrada. Un planificador por reglas tampoco se presenta como IA. Modalidad ChatGPT elegible, modelo local y API opcional se comparan en la revisión de viabilidad; no se selecciona ni instala un proveedor ni se autorizan pagos/publicación.

La implementación se divide en corrección de contenido, continuidad local, composición flexible, conversación y seguimiento. Esta entrega desarrolla documentos y contratos; no ejecuta 08/09, no produce clips nuevos ni implementa esos módulos. La decisión de producto queda registrada sin pedir de nuevo al usuario que confirme su objetivo.

[Visión y aceptación](../../product/ADAPTIVE_FOOTBALL_COACH_VISION.md), [tareas por función](../../training/ROLE_AND_ENVIRONMENT_PLAN.md), [viabilidad/costos](../../reviews/conversational-coach-feasibility.md).
