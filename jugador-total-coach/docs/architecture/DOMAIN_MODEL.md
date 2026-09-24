# Modelo de dominio

## Entidades principales

### ExerciseDefinition

Describe qué se hace, no cómo lo pinta React.

Campos esenciales:

- id y versión;
- nombre;
- categorías;
- objetivos;
- espacio;
- equipo;
- impacto;
- política de lado;
- cues;
- errores;
- regresión/progresión;
- transferencia al fútbol;
- referencia de animación;
- estado de revisión.

### WorkoutDefinition

- id;
- versión;
- duración esperada;
- bloques;
- rondas;
- intervalos;
- transiciones;
- equipo y espacio;
- reglas de seguridad.

### WorkoutSession

Instancia ejecutada:

- sessionId;
- workoutId/version;
- inicio;
- estado;
- intervalo actual;
- tiempo transcurrido;
- eventos.

### AnimationAsset

- assetId;
- uri;
- clipName;
- duration;
- fps;
- loopable;
- bounds;
- cameras;
- licenseId;
- reviewStatus.

### TrainingEvent

Eventos append-only:

- SessionStarted;
- IntervalStarted;
- IntervalPaused;
- IntervalResumed;
- IntervalSkipped;
- ExerciseRepeated;
- PainReported;
- SessionCompleted;
- SessionAborted;
- FeedbackSubmitted.

### MetricSample

Modelo canónico futuro para wearables:

- metricType;
- value;
- unit;
- measuredAt;
- source;
- quality;
- metadata.

No incluir tipos propios de Apple, Garmin, Polar, Google u otro proveedor dentro del dominio.
