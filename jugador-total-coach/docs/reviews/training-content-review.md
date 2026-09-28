# Revisión documental del contenido — fase 00

Fecha: 2026-09-25. Primer análisis detallado: bloque de activación, cinco ejercicios. Ampliación posterior del mismo día: [dirección deportiva recomendada](training-design-recommendation.md), con dictamen de pertinencia para los 31 IDs y decisiones asumidas por el agente. Esa ampliación actualiza las alternativas aún abiertas aquí; ninguna es una rutina individual aprobada.

## Alcance y resultado

Se adelanta la revisión que puede hacerse antes de programar: contrastar intención, definición de movimientos, tiempos, fuentes y requisitos de demostración. No se prescribe una sesión individual ni se ejecuta ejercicio como prueba. No se modifican el fixture, los esquemas ni los documentos normativos de entrenamiento.

**Dictamen documental del agente:** conservar marcha, bisagra y mini sentadilla como candidatos de preparación general, pendientes de precisar y revisar; redefinir movilidad de tobillo y giro con pasos antes de producir sus clips. Revisar la progresión del bloque y su reparto de movimiento/descanso. No aprobar los cinco minutos únicamente por la suma ni declarar que son insuficientes sin conocer intensidad y contexto.

**Cobertura actual:** 31/31 IDs con dictamen documental de pertinencia en el complemento; los cinco de activación tienen además el análisis preliminar desarrollado aquí. Esto no equivale a 31 fichas completas ni a revisión biomecánica o deportiva independiente. Fichas de runtime incorporadas: 0/31. Clips incorporados: 0/31. Ninguno cambia a `coaching-reviewed`.

## Lo verificado en el proyecto

Referencias: [fixture](../../content/examples/mvp1-60min.workout.json), [alcance del catálogo](../training/EXERCISE_CATALOG_SCOPE.md) y [sesión de prueba](../training/MVP1_60_MIN_SESSION.md).

El bloque `activation` tiene una ronda. Cada una de sus cinco entradas contiene 45 s de trabajo y 15 s de descanso. Resultado recalculado: 225 s de trabajo + 75 s de descanso = 300 s. Es decir, 3:45 de tiempo asignado al movimiento y 1:15 de descanso; no cinco minutos continuos de actividad. No se ha medido actividad física real.

SHA-256 del fixture conservado: `0967293497539f57f71d201e019d7203b9707ab4152b7a6be0ecb9b4021fc40e`. Estado: `draft`.

| ID | Nombre del catálogo | Lado declarado | Hallazgo verificable |
|---|---|---|---|
| active-march | Marcha activa | none | Falta cadencia, progresión e interpretación explícita de alternancia de pasos. `none` puede significar que no hay lado de serie, no que ambos pies se muevan simultáneamente. |
| ankle-mobility | Movilidad de tobillo | alternate | No precisa movimiento, postura, apoyos ni cómo se distribuyen los lados en 45 s. |
| hip-hinge | Bisagra de cadera | none | No precisa variante, recorrido, dosis ni criterios de diferenciación respecto a una sentadilla. |
| mini-squat | Mini sentadilla | none | No define qué significa «mini», ritmo, repeticiones ni apoyos. |
| soft-step-turn | Giro suave con pasos | alternate | Faltan ángulo, secuencia de pies, orientación final, velocidad y trayectoria. |

Los nombres no constituyen fichas completas. No hay aún evidencia para afirmar que cada variante cabe en 2×2; su posibilidad geométrica es una hipótesis hasta medir cuerpo, entradas/salidas y material.

## Evidencia consultada y sus límites

Consulta: 2026-09-25. Se distingue orientación institucional, explicación técnica y síntesis de estudios. Ninguna fuente evaluó nuestra secuencia exacta.

| Fuente | Qué aporta | Qué no demuestra |
|---|---|---|
| [American Heart Association: Warm Up, Cool Down](https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/warm-up-cool-down) | Orientación general de preparación gradual; propone 5–10 minutos y actividad semejante a la posterior a menor ritmo | Que 5×45/15 sea una dosis adecuada o que un calentamiento elimine lesiones. No se adoptan automáticamente otras afirmaciones de la página. |
| [NHS: How to warm up before exercising](https://www.nhs.uk/live-well/exercise/how-to-warm-up-before-exercising/) | Ejemplo general con marcha y flexión breve de rodillas; su secuencia escrita indica al menos seis minutos | Que seis minutos sean un mínimo universal. Sus cantidades y recorridos pertenecen a ese ejemplo; no validan los 45 s de nuestras entradas. |
| [Fradkin y colaboradores, 2010](https://pubmed.ncbi.nlm.nih.gov/19996770/) | Resumen de revisión sistemática y metaanálisis de 32 estudios: hay evidencia de beneficios de calentamientos adecuados sobre rendimiento, con limitaciones de los ensayos | Duración ideal para este usuario, eficacia de nuestros cinco gestos o prevención de lesiones. Solo se examinó resumen, no texto completo ni todos los estudios. |
| [ACE: Two Classic Exercises Everyone Should Master, 2016](https://www.acefitness.org/resources/everyone/blog/5983/two-classic-exercises-everyone-should-master/) | Explicación técnica del patrón de bisagra y un método de enseñanza con pared y bastón | Una dosis para nuestra sesión o que dispongamos de pared libre/bastón. No se importan esos requisitos ni promesas generales de resultados. |
| [ACE: The Two-handed Kettlebell Swing, 2025](https://www.acefitness.org/continuing-education/certified/january-2025/8788/the-ace-do-it-better-series-the-two-handed-kettlebell-swing/) | Su apartado de enseñanza distingue bisagra y sentadilla y contempla preparar el patrón de bisagra | No justifica añadir kettlebells, movimientos balísticos ni su prescripción a este calentamiento. Se utiliza únicamente la distinción del patrón. |
| [Berkshire Healthcare NHS: ankle sprains](https://www.berkshirehealthcare.nhs.uk/advice/ankle-sprains) | Permite identificar que una variante de movilidad consultada pertenece a material para esguince | No permite trasladar esa pauta clínica al usuario ni seleccionar una variante solo por compartir el nombre «movilidad de tobillo». |

Se localizaron también referencias a FIFA 11+, pero no se adopta ni se equipara nuestra adaptación en 2×2 a ese programa. No se reutilizaron fotos, videos o ilustraciones ni se auditaron sus derechos de incorporación; acceso público no autoriza empaquetarlos.

## Propuestas por movimiento

Son especificaciones preliminares para revisar, no instrucciones para que el usuario entrene ahora. La selección, intensidad y dosis siguen pendientes. Los ejemplos de simplificación son candidatos que requieren evaluación, no tratamientos.

### 1. Marcha activa — conservar como candidata

- **Intención propuesta:** comenzar con una tarea general de baja complejidad y aumentar gradualmente la actividad antes de las tareas siguientes.
- **Variante propuesta:** marcha en el sitio con pasos alternados y acompañamiento de brazos; evitar avance/retroceso para conservar el límite espacial. Es una adaptación del patrón de marcha de la fuente NHS, no una reproducción de su rutina.
- **Para la ficha:** explicitar alternancia, cadencia inicial/final y función de los 15 s siguientes. La palabra «activa» no cuantifica intensidad.
- **Demostración por revisar:** pie de apoyo identificable, ausencia de fase aérea propia de carrera, orientación constante y desplazamiento total acotado. Mostrar cuerpo y pies completos.
- **Posible simplificación:** reducir amplitud y ritmo, sin convertir la simplificación en una dosis individual ya aprobada.
- **Límite:** no atribuir a 45 s aislados preparación suficiente para toda la sesión.

### 2. Movilidad de tobillo — redefinir antes de animar

- **Intención propuesta:** preparar el movimiento de tobillo que resulte relevante para los ejercicios posteriores.
- **Problema:** círculos con pie libre, balanceos en apoyo y elevaciones de talón no son la misma tarea. Una biblioteca podría ofrecer cualquiera de ellos bajo una etiqueta genérica.
- **Propuesta actual del agente:** balanceo corto en posición escalonada con ambos pies apoyados y talón delantero en contacto, con cambio de lado. Se elige para concretar una tarea en apoyo sin asumir pared disponible; no se adopta un protocolo clínico. Recorrido, eventual apoyo externo y dosis requieren ficha y revisión. La selección es una hipótesis de diseño, no una superioridad demostrada frente a otras variantes.
- **Para la ficha:** decidir posición inicial, pie que trabaja, contacto del talón, carga/apoyo, cambio de lado y espacio ocupado por el eventual apoyo. No agregar pared o silla implícitamente.
- **Demostración por revisar:** vista lateral y frontal, pie completo y contacto claramente visibles. La transformación del esqueleto debe representar el movimiento elegido.
- **Simplificación candidata:** menor recorrido conservando apoyos; si necesita apoyo externo, definirlo y comprobar su cabida antes de ofrecer la variante. No aprobarla solo por llamarla más sencilla.

### 3. Bisagra de cadera — conservar como candidata de familiarización

- **Intención propuesta:** distinguir el patrón de llevar la cadera hacia atrás del descenso propio de la sentadilla.
- **Variante candidata:** bisagra bilateral sin carga. La explicación de ACE sirve de referencia del patrón; su enseñanza con pared/bastón no es equivalente a esta variante ni añade ese material al inventario.
- **Para la ficha:** definir recorrido observable, flexión de rodillas, retorno, ritmo y cantidad revisada. No imponer torso paralelo al suelo o ángulos universales a partir de una ilustración.
- **Demostración por revisar:** comparar vistas lateral y 3/4; cadera se desplaza hacia atrás y pies mantienen apoyo. Diferenciar una bisagra de una flexión aislada del tronco o una sentadilla.
- **Posible simplificación:** menor recorrido con la misma intención, sujeta a revisión. Si necesita apoyo o enseñanza adicional, registrarlo antes de darla por lista.
- **Límite:** 45 s no demuestran dominio del patrón. Continúa como candidata al primer ejercicio visible, no como elección cerrada.

### 4. Mini sentadilla — conservar como candidata, precisar recorrido

- **Intención propuesta:** familiarización con una flexión y extensión bilateral de rodillas/caderas de recorrido acotado.
- **Fundamento limitado:** NHS incluye una flexión breve de rodillas en su ejemplo; no prueba nuestra dosis ni prescribe idéntica profundidad para todas las personas.
- **Para la ficha:** sustituir la ambigüedad de «mini» por una descripción observable de inicio, recorrido y retorno; decidir cantidad, cadencia y criterios de simplificación.
- **Demostración por revisar:** apoyos, alineación observable, descenso/ascenso controlados y diferencia clara con la bisagra. No elegir un clip de sentadilla profunda y recortarlo sin revisión.
- **Posible simplificación:** menor recorrido o apoyo revisado; introducir apoyo cambia material, colocación y ocupación del área.
- **Límite:** la animación por sí sola no identifica la variante apropiada para una persona.

### 5. Giro suave con pasos — precisar antes de animar

- **Intención propuesta:** cambiar orientación mediante pasos dentro del área, preparando las transiciones del programa.
- **Problema:** «suave» no define velocidad y `alternate` no especifica secuencia. No se verificó una fuente que validara exactamente esta combinación bajo este ID.
- **Variante propuesta para revisión:** reorientación por varios pasos, con levantamiento y recolocación de pies, sin representar un pivote rápido sobre un pie inmóvil. Es una propuesta técnica; no una garantía de menor riesgo.
- **Para la ficha:** ángulo, número/secuencia de pasos, lado inicial, regreso, pausa y límites del recorrido. Comparar primero reorientación pequeña frente a giro completo; no fijar grados solo para facilitar un bucle.
- **Demostración por revisar:** frente y vista oblicua, trayectoria de cada pie, apoyos y posición final. Un corte de cámara no puede ocultar desplazamiento fuera del área.
- **Posible simplificación:** disminuir giro/velocidad una vez definido el gesto; revisión todavía pendiente.

## Revisión del bloque completo

**Hallazgo:** aplicar 45 s + 15 s a cinco tareas distintas simplifica el fixture, pero no fundamenta su contenido. La progresión de esfuerzo y el propósito de cada descanso/transición no están especificados. No hay evidencia de que esos 75 s de pausa sean necesarios, excesivos o inocuos para cualquier intensidad.

**Recomendación documental:** diseñar una secuencia progresiva que combine preparación general y ensayo de los patrones próximos; contrastar cuánto movimiento real, enseñanza y descanso necesita. Conservar pausas accesibles, sin confundirlas con el tiempo de preparación programado ni eliminarlas automáticamente.

**Decisión documental posterior:** el complemento recomienda presupuestar ocho minutos para preparación progresiva y familiarización, redistribuyendo el conjunto a 8/12/10/16/8/6 minutos. Es una elección de diseño explicada, no una dosis óptima demostrada. No se convierte ese tiempo en actividad continua ni se valida automáticamente por coincidir con pautas generales. El fixture original de 3600 s permanece intacto; la propuesta suma también 3600 s y requiere desarrollar su cronograma y revisión.

## Revisión deportiva que puede adelantarse

No es necesario esperar a tener la aplicación para revisar fichas y planificación. Preparar para la persona revisora este bloque, sus fuentes, objetivos, alternativas, dudas y tabla temporal. La revisión debe dejar fecha, versión examinada, competencia pertinente, observaciones, cambios pedidos y alcance de su dictamen. Su identidad/documentación personal se gestiona fuera del repositorio.

Separar dictamen sobre ficha escrita, revisión del clip y adecuación individual. Un dictamen favorable de la ficha no aprueba automáticamente una animación posterior. No es necesario transformar cada revisión deportiva en una consulta médica; los asuntos clínicos se derivan al ámbito competente cuando corresponda.

**Actualización del 2026-09-26:** el usuario asume la revisión humana de fichas y demostraciones, con fundamento y comprobaciones preparados por el agente. Responsable asignado no equivale a revisión realizada ni acredita competencia especializada. Se registra su revisión con el alcance definido en los [criterios de aceptación](../quality/ACCEPTANCE_OSS_PHYSICS.md). No se contrató a terceros; una eventual intervención especializada conserva condiciones y costo por verificar si resulta necesaria.

## Contexto y próximo paso

El usuario solicita que el agente investigue, seleccione y fundamente las decisiones deportivas sin trasladarle preguntas técnicas. La consulta anterior sobre actividad reciente queda retirada como requisito para continuar la fase documental. No se repite ni se interpreta el silencio como un nivel de entrenamiento; la adecuación individual permanece sin acreditar. No se guarda historial físico en Git.

La [dirección recomendada](training-design-recommendation.md) ya examina la pertinencia de los 31 IDs, selecciona un núcleo más sencillo y distingue fundamentos domésticos de capacidades que necesitan campo. El siguiente trabajo de contenido es concretar fichas verificables y conciliar contratos cuando corresponda; las pruebas visuales, revisión humana y dosis individual siguen pendientes. Los repasos de licencias, reutilización, costos y plan se presentaron; el [estado del proyecto](../../PROJECT_STATUS.md) distingue propuesta de cierre documental de aprobación del entrenamiento.
