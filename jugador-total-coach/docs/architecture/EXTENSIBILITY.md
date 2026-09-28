# Extensibilidad sin módulos vacíos

Actualización de arquitectura: 2026-09-27. [Árbol y dependencias vigentes](ARCHITECTURE.md).

El MVP1 conserva datos versionados, eventos locales y límites entre dominio, catálogo, motor, visor y almacenamiento. Eso permite ampliar el producto sin anticipar proveedores. No crear MetricSample, WearableAdapter, integraciones, telemetry, API, Authoring Studio ni Render Worker vacíos.

| Ampliación futura | Límite que se conserva ahora | Trabajo que espera su fase |
|---|---|---|
| Sesiones de 30/90 minutos y catálogo mayor | Duración declarada y plan inmutable | Nuevos contenidos, revisión de dosis y pruebas; no generador actual |
| Estadísticas | Eventos de reproducción y feedback opcional | Vistas sin inferir técnica, calorías o rendimiento medidos |
| Wearables | Dominio sin tipos de proveedores | Definir modelo canónico y conectores al concretar una métrica, costo/derechos y privacidad |
| Sincronización/social | Archivo portable, privado por defecto | Consentimiento, backend si hace falta, cuotas, borrado y seguridad |
| Escenas de partido | Ficha puede explicar transferencia y límites | Módulo táctico con oposición/contexto; no llamar táctica a una coreografía doméstica |
| IA/cámara | Contenido y manifiestos independientes de un generador | Evaluar modelo/pesos/salida, equipo, corrección y costos por caso |
| Video | Datos/assets reutilizables según derechos | Evaluar Remotion/exportador; no requiere backend por definición |
| TV | UI separada del dominio | Navegador/método de visualización, controles, legibilidad y pruebas del dispositivo |

Backend solo por necesidad demostrada; renderizar video local no es por sí solo una razón para un servicio. Aplicar [revisión de costo](../product/FEATURE_COST_REVIEW.md) y [matriz futura](../reviews/feature-cost-matrix.md) en cada ampliación. Software gratuito no abierto es admisible; cuotas, equipo, contexto comercial, APIs y derechos pueden cambiar el costo. Sustituir un proveedor puede requerir trabajo; no garantizar gratuidad ilimitada ni equivalencia automática.

No se implementa ninguna ampliación por documentarla.
