# Extensibilidad sin sobreconstrucción

## Wearables

Preparar `MetricSample` y `WearableAdapter`, pero no implementar proveedores en MVP1.

Ejemplos de métricas futuras:

- frecuencia cardiaca;
- pasos;
- energía activa;
- sueño;
- HRV;
- carga estimada;
- GPS.

## Estadísticas

Los eventos de entrenamiento permiten construir vistas:

- consistencia;
- minutos;
- RPE;
- carga interna;
- ejercicios completados;
- evolución de dolor/inseguridad;
- precisión técnica declarada;
- rendimiento en partidos.

## Redes sociales

El dominio futuro debe separar:

- dato privado;
- resumen compartible;
- consentimiento;
- audiencia;
- eliminación.

Privado por defecto.

## Escenas de partido

No son una variante visual del entrenamiento. Son un módulo distinto:

```text
TransferScenario
- format: fut5 | fut7 | fut11
- phase: attack | defense | transition
- role
- initialPositions
- trigger
- playerPaths
- ballPath
- decisionOptions
- desiredOutcome
```

Un ejercicio puede referenciar uno o más `TransferScenario`, pero el reproductor de ejercicios no debe depender del simulador táctico.

## Crecimiento

Añadir backend solo cuando exista una necesidad real:

- sincronizar dispositivos;
- cuentas;
- entrenador remoto;
- equipos;
- compartir;
- procesamiento asíncrono;
- render MP4.

Hasta entonces, mantener la aplicación local-first.

## Crecimiento funcional sin dependencia económica obligatoria

Aplicar FEATURE_COST_REVIEW.md antes de cada integración. Ejercicios, horarios, estadísticas locales y escenas propias se diseñan sin módulos premium obligatorios. Para wearable/social/IA separar conectores de proveedores y mantener importación/exportación o modo manual cuando cubra la necesidad. No dar por hecho que una API específica es gratis. No construir todos los adaptadores ni garantizar que una sustitución será automática o sin trabajo.
