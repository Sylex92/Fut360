# Tres objetivos del producto y del entrenamiento

Avance técnico posterior a su definición: [perfiles e historial por persona](../reviews/participant-isolation.md) implementados el 2026-10-04. [Cobertura mínima y pendientes](../reviews/three-objective-coverage.md). No se declara completa la biblioteca ni ninguno de los tres objetivos por este incremento.

Fecha: 2026-10-04. Requisitos adicionales del usuario, incorporados al alcance acumulado. **Los tres objetivos se suman a lo acordado y construido; no son una nueva base ni sustituyen el proyecto anterior.** Este documento no declara implementadas las funciones pendientes. Los datos personales y antropométricos recibidos permanecen en la conversación, fuera del repositorio, fixtures, capturas y búsquedas externas.

## Continuidad del alcance

Esta tabla conecta la ampliación con compromisos anteriores; no es una lista exhaustiva que elimine lo no enumerado. Se conservan los requisitos compatibles, avances y pendientes de las especificaciones enlazadas. Un cambio de prioridad no cancela una función ni convierte su estado pendiente en terminado. Toda sustitución real de alcance debe tener motivo y decisión explícitos; una ampliación no la autoriza por omisión.

| Compromiso que se conserva | Cómo se integra con los tres objetivos | Referencia |
|---|---|---|
| Construcción y uso local sin nuevos pagos obligatorios, licencias auditadas y reutilización | Se aplica también a perfiles, infancia, conversación y TV; sin prometer servicios ilimitados | [Política de costo](ZERO_COST_AND_GROWTH_POLICY.md), [reutilización](../architecture/REUSE_MATRIX.md) |
| Sesión de 60 minutos en casa 2×2 m | Permanece como escenario y regresión; convive con otras duraciones, cancha, gimnasio y tareas con compañeros | [MVP1](MVP1_PRD.md), [visión ampliada](ADAPTIVE_FOOTBALL_COACH_VISION.md) |
| Enseñanza clara y fluida, avatar y videos por fragmentos | Corregir representaciones confusas; conservar el 3D en revisión y usar referencias pertinentes. El laboratorio físico sigue separado de enseñar un ejercicio | [Entrega visual y pendientes](../reviews/video-guided-delivery.md), [ADR 0016](../architecture/adr/0016-human-reference-and-visible-plan.md) |
| Mínima interacción y avance automático | Mantener preparación extra, demostración, pausa y recuperación sin acreditar tiempo oculto. El encadenado audiovisual automático sigue pendiente | [Flujo esperado](ADAPTIVE_FOOTBALL_COACH_VISION.md), [estado vigente](../../PROJECT_STATUS.md) |
| Investigar las siete fuentes, ampliar ejercicios y jugadas, fundamentar progresiones | Conservar todo el inventario y su cobertura real; distinguir localizado, observado, explicado y revisado. Añadir tareas infantiles y variantes sin perder las adultas | [Ampliación autorizada](../plans/product-completion.md), [inventario](../training/COACHING_LIBRARY_INVENTORY.md) |
| Desarrollo polivalente FUT 5, FUT 7 y FUT 11, con referencias de estilo | Mantener objetivos técnicos, físicos, tácticos y de decisión; sumar una ruta infantil propia, sin imponer posición ni cargas adultas | [Funciones y entornos](../training/ROLE_AND_ENVIRONMENT_PLAN.md), [rutas](../training/ADULT_AND_YOUTH_PATHWAYS.md) |
| Planes, seguimiento, estadísticas y continuidad local | Reutilizar reloj, historial, recuperación, respaldos y recursos locales offline; extenderlos por persona y capacidad. Medios externos y sincronización conservan sus límites | [Visión](ADAPTIVE_FOOTBALL_COACH_VISION.md), [ADR 0015](../architecture/adr/0015-local-recovery-offline.md) |
| Crecimiento posterior auditado, incluida exportación local candidata con Remotion | Conservarlo en el roadmap con sus condiciones y prioridad; no instalar ni declarar una ampliación aprobada por mencionarla | [Matriz de costos futura](../reviews/feature-cost-matrix.md) |

El agente asume investigar, diseñar, crear, revisar, corregir, comprobar y mantener el seguimiento del trabajo autorizado. Puede aprobar técnicamente una entrega con evidencia registrada, sin pedir autorización por cada decisión rutinaria. La aprobación técnica, la revisión documental deportiva, la comprensión observada y una valoración clínica son estados diferentes. La exigencia de “1000%” se traduce en criterios comprobables y corrección de defectos, no en una garantía literal de perfección o rendimiento deportivo. [Responsabilidades y cierre](../plans/three-objectives-delivery.md).

## 1. Aplicación de desarrollo futbolístico

Una aplicación para celular, web de computadora y Smart TV que permita crear rutinas por objetivos, enseñarlas, seguir la práctica y revisar progreso. La TV vuelve a formar parte explícita del objetivo; su soporte no se deduce de que la web funcione en Chrome. Confirmar marca/modelo/plataforma al comenzar esa integración, sin bloquear el resto.

La persona puede combinar referencias de estilo: Bellingham, Firmino u otros. Cada referencia se traduce en capacidades y comportamientos de juego, nunca en copia de apariencia, cargas de profesionales o promesa de equivalencia. “Anderson” queda sin atribución a un futbolista concreto hasta desambiguarlo. El plan puede construirse por capacidades aunque falte ese nombre.

El flujo esperado es: perfil y objetivos → propuesta versionada → calendario compatible con partidos/recuperación → enseñanza → práctica → registro → revisión y ajuste. El usuario no tiene que seleccionar métodos especializados ni editar JSON. La conversación dentro de la app sigue pendiente de integración viable a costo permitido.

La representación puede ser original o un video existente delimitado. Recurso original exige autoría y derechos; video existente exige correspondencia del ejercicio, rango revisado y reproducción permitida. Un componente parcial no se presenta como demostración completa. Crear una rutina nueva no vuelve disponibles automáticamente su video o animación.

## 2. Ruta adulta polivalente

Conservar todas las funciones solicitadas, con una base común y énfasis alternos. No limitar el plan permanentemente a mediocentro ni sumar programas completos de cuatro posiciones.

| Función | Capacidad que se quiere desarrollar | Evidencia útil |
|---|---|---|
| Defensa central que también aporta gol | Anticipar, orientar, temporizar, cubrir, progresar con balón y elegir incorporaciones | Progresiones/tiros impedidos, coberturas, pérdidas por incorporarse y llegadas útiles; no solo robos o goles |
| Mediocentro de ida y vuelta | Recibir con información, girar o descargar, conducir para progresar, apoyar y recuperar posición | Decisiones ante presión, conservación/progresión, apoyos y retorno defensivo en contexto |
| Delantero dinámico | Proteger, asociarse, desmarcarse, crearse espacio y finalizar distintas llegadas | Recepciones conservadas, ocasiones creadas, intentos y resultado según dificultad |
| Extremo/medio con velocidad y gol | Conducción a ritmo variable, aceleración/frenada, 1v1, pase final/tiro y recuperación | Salidas útiles, calidad de última acción y transición defensiva, además de velocidad |

FUT 5 en superficie dura, FUT 7 y FUT 11 en césped comparten fundamentos. Cambian espacio, reglas, balón, superficie, compañeros, distancias y demanda competitiva. Fútbol rápido sobre cemento no se etiqueta automáticamente futsal reglamentario. Los ejercicios de casa no acreditan sprint, oposición o táctica de campo.

El horizonte adulto 24/52 semanas sigue siendo revisable desde un retorno viable, no un plazo de profesionalización. El objetivo de aprovechar ocasiones se traduce en mejorar creación, selección y eficacia: no se promete anotar todas ni generar siempre el gol sin compañeros. Dosis inicial, calendario y estado actual necesitan confirmación; el diseño puede continuar sin realizar pruebas físicas ahora.

## 3. Ruta infantil propia

Programa de aprendizaje, disfrute y capacidad motriz apropiado al desarrollo, con un adulto responsable. Deseo de marcar goles y disposición a pasar son puntos de partida compatibles. No encasillar al niño en mediocentro por una impresión ni descartar su interés por ser goleador. Ofrecer experiencias de atacar, defender y apoyar.

Prioridades propuestas: conducir con control a distinta velocidad; percibir espacio/compañero/oponente; elegir conducir/pasar/tirar; proteger con colocación y equilibrio; acercarse/frenar/interceptar; golpear con coordinación; desarrollar fuerza general y estabilidad mediante tareas enseñadas y supervisadas. Respetar el pie preferido y trabajar ambos lados sin obligar a cambiar su lateralidad.

“Lento”, “sin fuerza” o “pisa demasiado” se conservan como observaciones por comprobar, no diagnósticos. Usar la planta puede ser útil; se revisa si esa elección permite continuar o lo detiene innecesariamente. La meta física es función, control y salud; no tamaño corporal, hipertrofia, adelgazamiento ni una talla objetivo.

No copiar sesiones adultas con menos minutos. No usar carreras agotadoras, contacto de choque ni levantamientos máximos como evaluación inicial doméstica. La fuerza infantil no está prohibida: requiere progresión por competencia y supervisión adecuada. [Base documental y tareas](../training/ADULT_AND_YOUTH_PATHWAYS.md).

## Enseñanza y medición: significado de “asegurar”

La aplicación debe ofrecer evidencia de sus comprobaciones, en lugar de garantías fisiológicas. Criterios de aceptación propuestos:

1. Se entiende dónde empezar, qué mover, qué hace el balón, cuándo termina una repetición y qué resultado se busca.
2. La demostración corresponde a variante/lado/material y permite ver apoyos y contactos; se revisa lenta y a velocidad normal. Fluidez gráfica por sí sola no acredita técnica.
3. Explicación, demostración y práctica tienen tiempos distintos. Puede repetirse/estudiarse sin acreditar ejercicio; añadir preparación conserva el autoinicio acordado.
4. Se comprueba comprensión con explicación propia o ejecución observada cuando proceda, nunca solo con “me gusta” o completar el video. El adulto responsable acompaña la prueba infantil.
5. Un recurso que confunde queda en revisión y se corrige o reemplaza por otra representación del mismo objetivo; la dificultad de animarlo no rebaja la tarea.
6. Progreso usa condiciones comparables, intentos/oportunidades, lado, fecha, origen y contexto. Faltantes se muestran como no medidos; reproducción y actividad corporal se separan.
7. La app no certifica “nivel profesional” ni calcula un porcentaje de semejanza con un futbolista. Cualquier comparación con población/competición necesita referencia válida y protocolo compatible, hoy pendientes.

## Perfiles, datos y estadísticas

Propuesta: `participantId` estable para contexto, plan, sesión y resultado; `planVersion`/`taskVersion`/`protocolVersion` para comparaciones. Separar adulto/infantil en selección, biblioteca elegible, dosis, historial, exportación y métricas. Los registros históricos sin dueño se preservan como legado sin asignarlos automáticamente a un niño. Probar aislamiento entre perfiles y navegadores antes de activar esta función.

La primera implementación utilizará almacenamiento local ya disponible, con exportación/eliminación por perfil. No nombres completos, expediente clínico, fecha de nacimiento exacta o fotos obligatorias. El perfil infantil lo administra un adulto; participación del niño sin ranking corporal, rachas punitivas, comparaciones públicas ni mensajes de vergüenza. Los datos actuales no se escriben en código ni se envían al proveedor de video.

Separar: cumplimiento de reproducción; práctica declarada; resultado medido; observación técnica; y comportamiento en partido. El panel muestra cambios por capacidad y evidencia disponible, no una puntuación universal que esconda incertidumbre. [Criterios de seguimiento](../training/ADULT_AND_YOUTH_PATHWAYS.md).

## Plataformas y costo

Reutilizar React/PWA, motor temporal, historial local, catálogo y reproductor oficial. TV necesita interfaz legible a distancia, foco visible con mando, atrás/selección/pausa/preparación accesibles y prueba de video en el aparato. Vista web en TV, duplicación de pantalla y app nativa son entregables diferentes. No asegurar instalación universal ni sincronización: hoy los datos permanecen por navegador/origen.

Verificados: [Samsung: entrada por mando](https://developer.samsung.com/smarttv/develop/guides/user-interaction/user-interaction.html) y [LG: diferencias de motor por versión](https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine). Pendientes: aparato concreto, ruta de distribución, restricciones y costos de cada plataforma. Sin nuevas cuentas, SDK, certificados, nube ni suscripciones contratadas.

La ruta infantil obliga a revisar medios externos antes de habilitarla. [YouTube exige designar sitios/apps dirigidos a niños, incluso con privacy-enhanced](https://support.google.com/youtube/answer/171780?hl=en). La adecuación de una integración para adultos no aprueba automáticamente la infantil. No afirmar ausencia de anuncios/rastreo ni que la supervisión elimine obligaciones; recurso propio/licencia compatible es alternativa a evaluar, sin descargar videos ajenos.

## Estado real al definir estos objetivos

**Implementado anteriormente:** app web probada en computadora y entregas previas en Samsung, 52 fichas, 20 con referencia total del gesto o parcial, cinco propuestas, reloj e historial local. **No implementado:** dos perfiles aislados, planes personales adoptados, catálogo infantil revisado, estadísticas por capacidad, conversación real y soporte TV. Las 257 pruebas del incremento anterior no validan estas funciones nuevas.

Siguiente entrega: [secuencia verificable](../plans/three-objectives-delivery.md). Las dos consultas pendientes se limitan al estado actual del adulto y carga/contexto/supervisión infantil; no se repiten medidas, objetivos o lugares ya declarados.
