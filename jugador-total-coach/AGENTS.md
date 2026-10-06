# AGENTS.md — Jugador Total Coach

## Propósito

Construir un producto local-first de entrenamiento de fútbol y fuerza con avatar 3D. El MVP1 reproduce una sesión fija de 60 minutos en un espacio de 2×2 m.

## Reglas prioritarias — costo cero, extensibilidad y reutilización

- Leer `docs/product/ZERO_COST_AND_GROWTH_POLICY.md` antes de proponer dependencias.
- El MVP local debe compilar y funcionar sin cuentas, claves, servicios de pago ni suscripción a Codex.
- Admitir software abierto, source-available o propietario gratuito: lo obligatorio es costo cero para el uso concreto y las ampliaciones previstas, no un tipo de licencia. No basar una función esencial en trials, créditos o cuotas temporales.
- «Autoescalable» se interpreta como extensible funcionalmente, no como infraestructura ilimitada. Revisar costo y derechos antes de cada función mediante FEATURE_COST_REVIEW.md. No contratar ni activar pagos.
- Preferir componentes sin restricciones que comprometan el roadmap. Los candidatos condicionados requieren límites, disparadores y estrategia de sustitución documentados. Unknown/pending no equivale a aprobado.
- Plugins propietarios gratuitos son admisibles tras revisar permisos y límites. No introducir modelos de pago ni APIs de video/voz que obliguen a pagar. Reutilizar antes de crear.
- Remotion es candidato condicionado para exportación local posterior al MVP1; ya no requiere excepción por no ser open source. Revisar ADR 0008 y evidencia de versión/uso. No instalarlo durante la fase documental ni confundir admisibilidad con implementación aprobada.
- Antes de construir infraestructura, completar `docs/architecture/REUSE_MATRIX.md`: reutilizar -> adaptar -> crear solo la pieza específica faltante.
- Mantener Three.js + React Three Fiber para visualización y Rapier + react-three-rapier para física. No escribir solvers, detección de colisiones ni controladores de ragdoll propios.
- Buscar primero un humanoide ya riggeado y editable, con licencia de contenido compatible y descarga gratuita concreta. Un maniquí de primitivas solo es un fallback técnico temporal, no el entregable final.
- Reutilizar herramientas de Blender para autoría/retargeting; no construir un editor o un sistema de rigging propio. Adaptar a un rig existente antes de imponer uno nuevo.
- Priorizar clips guiados revisados en el reproductor. La simulación física libre tiene su propia prueba técnica y no sustituye la técnica del ejercicio.
- Aclaración del usuario: conservar el objetivo de un ejercicio adecuado y corregir su representación; la dificultad de animarlo o la ausencia de física perfecta no justifican cambiarlo. Reutilizar/adaptar o preparar el clip específico, con detalles, trayectorias o video complementario cuando mejoren la explicación y sus derechos lo permitan. Sustituir un recurso defectuoso no equivale a sustituir el ejercicio. Cambiar el ejercicio requiere una razón de contenido, adecuación o contexto documentada. No prometer representación siempre trivial ni predicción exacta; si la solución sigue incompleta, mantener el contenido pendiente sin declararlo imposible ni rebajar la calidad de enseñanza.
- Cada objeto tiene una única autoridad de transformación por instante. No animar y resolver físicamente el mismo balón a la vez sin un cambio de estado explícito.
- Toda licencia desconocida queda pendiente/bloqueada. Mantener registro de origen, archivo, versión/hash, licencia y modificaciones; revisar dependencias transitivas.
- Empaquetar modelos, WASM, fuentes permitidas y audio para uso local. No depender de CDNs ni de una voz cloud.
- Los fallbacks solo sirven para desarrollo; impiden declarar el MVP de entrenamiento completo.
- No publicar el repositorio ni elegir una licencia pública para el código del usuario sin su autorización.
- No ejecutar descargas, instaladores o scripts de terceros antes de revisar su procedencia y licencia. No instalar herramientas globales ni modificar el sistema sin permiso.

## Forma de trabajo obligatoria

1. Lee primero `README.md`, `PROJECT_STATUS.md`, la política de costo cero y crecimiento, el PRD, la matriz de reutilización, el contrato de física y `docs/plans/ROADMAP.md`.
2. Antes de modificar código, escribe o actualiza un plan verificable.
3. Trabaja en cambios pequeños y revisables.
4. No mezcles una refactorización amplia con una funcionalidad.
5. Explica supuestos y registra decisiones duraderas como ADR.
6. No agregues dependencias de producción sin justificar su necesidad y alternativas.
7. Nunca declares una tarea terminada si no ejecutaste sus verificaciones.
8. No generes servicios vacíos “para el futuro”.

## Criterio permanente de evidencia y decisiones

Instrucción del usuario incorporada el 2026-09-25. Aplicar durante todo el proyecto, sin requerir que se repita en cada conversación.

- Las preferencias del usuario orientan objetivos, restricciones y experiencia; su agrado no demuestra superioridad técnica, eficacia ni seguridad. Comparar alternativas y explicar desacuerdos fundamentados, respetando el alcance autorizado.
- Aplicar este criterio a usabilidad, arquitectura, herramientas, licencias, costos, contenido deportivo y cualquier ampliación de salud, nutrición o aprendizaje. Investigar con profundidad proporcional al impacto; no convertir decisiones triviales en una auditoría interminable.
- Antes de recomendar, distinguir qué se pretende mejorar, qué evidencia lo respalda, a quién y en qué condiciones aplica, qué incertidumbre queda y cómo se comprobará. Preferir fuentes primarias y síntesis científicas pertinentes; no elegir por popularidad, una explicación plausible o una cita aislada. La ausencia de evidencia no prueba eficacia ni ineficacia.
- Mantener explícitos verificado, supuesto/propuesto y pendiente. Una preferencia declarada, un documento preparado, una evaluación del agente, una prueba observada y una revisión profesional son evidencias diferentes.
- El agente debe investigar y formular una recomendación razonada; no trasladar al usuario la responsabilidad de validar afirmaciones científicas o decidir dosis por falta de conocimiento especializado. Preguntar por objetivos, contexto y restricciones solo cuando cambien la decisión.
- El usuario delega expresamente las decisiones técnicas y deportivas: elegir y fundamentar ejercicios, variantes, secuencias y criterios de progresión dentro del alcance autorizado, sin pedirle que escoja entre métodos especializados. Desde el 2026-09-27 solicita avanzar autónomamente todo lo posible, documentando decisiones y resultados; sustituye la revisión paso a paso obligatoria. No bloquear la investigación documental por un cuestionario personal; tampoco inventar edad, condición física o antecedentes. Si un dato individual resulta indispensable para una decisión de salud posterior, explicar su efecto concreto y limitar la consulta a ese dato.
- Los perfiles Bellingham/Firmino se traducen a capacidades observables, no a imitación de cargas de élite o promesa de carrera profesional. Distinguir fundamentos practicables en casa de táctica, oposición y demandas físicas que requieren campo; justificar la transferencia en vez de asumirla. Consultar fuentes públicas pertinentes no implica haber leído currículos privados de academias ni autoriza incorporar su contenido protegido.
- En ejercicio y salud, separar información educativa general de valoración o prescripción individual. No diagnosticar ni presentar investigación documental como sustituto de revisión por el profesional competente. Una propuesta de ejercicio y su animación conservan draft hasta la revisión exigida; no atribuir revisión profesional a una aprobación del usuario.
- Separar facilidad de uso, técnica del movimiento, adecuación de la dosis y aprendizaje. No inferir retención, transferencia al fútbol o automatización porque el usuario siga una animación o termine la sesión; no prometer aprendizaje acelerado, resultados fisiológicos ni plazos sin evidencia aplicable.
- Si la evidencia contradice una propuesta anterior, explicar el motivo, corregir los documentos y probar lo que corresponda antes de declararlo validado. Informar avances relevantes sin pedir confirmación de cada decisión técnica rutinaria.
- Este criterio no amplía el MVP1, no autoriza fases posteriores ni añade consultas, servicios, compras o tratamientos. Registrar necesidades de revisión pendientes y sus posibles costos antes de comprometer una vía de ejecución.

## Reglas de arquitectura

- Empezar como monorepo y monolito modular.
- Mantener el dominio independiente de React, Three.js, almacenamiento y APIs externas.
- Separar:
  - motor de sesión;
  - catálogo de ejercicios;
  - runtime 3D;
  - persistencia;
  - telemetría;
  - integraciones.
- Las integraciones futuras se conectan mediante puertos/adaptadores.
- El MVP1 no requiere backend, autenticación ni nube.
- La persistencia inicial es local y debe poder exportarse/importarse.
- Los eventos de entrenamiento son append-only; las vistas estadísticas pueden reconstruirse.

## Reglas 3D

- El avatar debe ser genérico. No copiar rostro, cuerpo, tatuajes, uniforme ni identidad visual de jugadores reales.
- Bellingham y Firmino son referencias de características de juego, no de apariencia.
- Unidad de mundo: metros.
- Runtime: eje Y vertical. La orientación frontal del avatar debe quedar documentada y normalizada por el exportador.
- Formato de distribución: GLB/glTF 2.0.
- Todo clip debe:
  - tener nombre estable;
  - indicar FPS y duración;
  - declarar si es cíclico; solo entonces reproducirse en bucle sin salto visible;
  - mantener el movimiento dentro del área declarada;
  - incluir estado de revisión.
- Los assets temporales deben llevar `reviewStatus: draft`.
- Ningún movimiento se marca como validado sin revisión humana.
- Registrar licencia y procedencia de cada asset en `ASSET_LICENSES.md`.

## Reglas de entrenamiento y seguridad

- No diagnosticar lesiones ni enfermedades.
- Si una definición incluye dolor, bloqueo, inflamación o inestabilidad real, la interfaz debe mostrar la acción de detenerse y buscar valoración.
- Siempre incluir calentamiento y vuelta a la calma.
- La suma de intervalos debe coincidir exactamente con la duración declarada.
- Cada ejercicio debe declarar espacio, equipo, impacto, lado, regresión, cues y errores comunes.
- No presentar una animación como garantía de ejecución segura.
- Las indicaciones de respiración deben evitar contener el aire durante fuerza.

## Privacidad

- No incluir en Git datos personales, fotos médicas, medidas clínicas, tokens ni secretos.
- Los datos reales del usuario se guardan fuera del repositorio.
- El modo social futuro debe ser opt-in y privado por defecto.
- Los wearables deben entrar por un modelo canónico; nunca contaminar el dominio con tipos de un proveedor.

## Calidad

- TypeScript estricto.
- Validación de contenido contra JSON Schema.
- Pruebas unitarias del reloj y la máquina de estados.
- Pruebas de contrato para assets y catálogos.
- Pruebas E2E del flujo de una sesión corta.
- Accesibilidad: controles por teclado, subtítulos, contraste y opción de silenciar.
- Rendimiento objetivo del MVP: experiencia fluida en un teléfono Android de gama media razonable; documentar el dispositivo usado para la medición.

## Definition of Done mínima

- Criterios de aceptación cumplidos.
- Lint, typecheck y pruebas en verde.
- Documentación actualizada.
- Sin errores nuevos en consola.
- Assets y licencias registrados.
- Evidencia visual o E2E del comportamiento.
- Limitaciones conocidas registradas.


## Continuidad y autorizaciones
- Continuidad audiovisual 2026-10-06: docs/reviews/local-human-video.md. El usuario autorizó expresamente lo necesario para terminar, incluida la descarga consultada. Dos originales FIFA adquiridos por botones oficiales e integrados localmente con atribución, hashes y uso personal no comercial condicionado; originales fuera de Git. Un tercer candidato se inspeccionó y excluyó de Y08 por tiro elevado. No repetir permisos ni datos recibidos. HTMLVideoElement y caché Range permiten video infantil local, pausas/velocidad/bucle y offline; YouTube infantil continúa condicionado independientemente. Biblioteca vigente 69/17 gesto/17 componente/35 sin video integrado; seis fichas infantiles con componentes locales, no demostraciones completas. Vista TV con foco/flechas/tecla multimedia probada en PC, no Sony física. Planes/dosis/calendarios/DB4/respaldos3 e historial se preservan. Enseñanza completa, conversación/adaptación e integración/aceptación física continúan abiertas. La negativa automática de descarga del turno anterior quedó resuelta; no tratarla como bloqueo actual.
- Continuidad 2026-10-05: horario infantil recibido; no repetir preguntas ni transcribirlo a Git. Calendario fechado, versiones/resultados append-only, observaciones homogéneas y propuesta privada por fragmento implementados; docs/reviews/dated-personal-plan.md. DB 4 / respaldo 3; conservar migración/aislamiento/CAS. Cuatro complementos infantiles, incluida protección/defensa cooperativa sin contacto adulto, rotación sin sumar minutos. Videos automáticos adultos: carga pausa reloj, pausa manual prevalece, video cargado en pausa permite Continuar. YouTube infantil bloqueado y biblioteca humana incompleta. No confundir calendario con adaptación automática o alta. No afirmar guardado real si solo se abrió la propuesta. Datos reales solo en conversación/almacenamiento privado; pruebas sintéticas. Prioridad: enseñanza suficiente e integración infantil, requisitos acumulados, sin reinstalar herramientas ni rehacer avances.
- Continuidad 2026-10-04: contexto y aclaración de disponibilidad infantil recibidos; no repetir preguntas sobre objetivos, medidas, estado adulto, disponibilidad o compañía. Datos privados fuera de Git. Sesiones individuales adultas y complementos infantiles propios incorporados: docs/reviews/personal-programs-and-visual-coverage.md. Biblioteca 69 fichas (56 adultas/13 infantiles), 15 referencias de gesto, siete componentes, 47 sin video incrustado (siete con enlace parcial FIFA). No confundir explicación/esquema con demostración humana ni declarar completos los tres objetivos. Conservar semanas anteriores, guardado CAS, DB v3 y respaldos de perfil formato 2. YouTube bloqueado dentro del perfil infantil hasta resolver integración compatible; no usar consentimiento como sustituto de designación. TV Sony A80J conocida: docs/reviews/sony-a80j-compatibility.md; no volver a pedir modelo ni declarar mando/TV probados.
- Entrega técnica 2026-10-04: perfiles/historial aislado, respaldos/restauración y legado explícito implementados; ver docs/reviews/participant-isolation.md. El usuario exige cumplir los tres objetivos antes de dejar ampliaciones accesorias para después: aplicar docs/reviews/three-objective-coverage.md. La biblioteca 52/20 y menú infantil documental no bastan. No rehacer aislamiento ni declarar completo el plan infantil por tener su perfil. Conservar datos v1, propiedad de participante, revisión de ventana y espera del guardado final; respaldos v2/perfil nuevo no se importan silenciosamente en otra persona. Datos reales fuera de Git y resto del alcance acumulado conservado.
- Aclaración del usuario del 2026-10-04: los tres objetivos se SUMAN al alcance acumulado; no son una nueva base ni reemplazan requisitos, avances o pendientes anteriores. Aplicar la trazabilidad de docs/product/THREE_OBJECTIVES.md y el cierre de docs/plans/three-objectives-delivery.md. El usuario delega crear, investigar, revisar, aprobar técnicamente, corregir y seguir el trabajo autorizado hasta su entrega con calidad, sin aprobación por paso. Conservar las autorizaciones de implementación posteriores a la fase 00 y las restricciones de costo, privacidad, publicación y cambios globales. “1000%” expresa exigencia de calidad, no una garantía literal: pruebas y evidencia antes de cerrar; no atribuir a la autoevaluación revisión independiente, comprensión humana observada o alta clínica. No descartar objetivos por omisión en un roadmap nuevo ni bloquear tareas independientes por datos personales pendientes.
- Requisito del 2026-10-04: aplicar docs/product/THREE_OBJECTIVES.md. Tres objetivos: plataforma móvil/web/Smart TV, ruta adulta polivalente y ruta infantil propia. La TV vuelve al destino explícito, con soporte concreto pendiente. Separar persona/estilo, plan/dosis/historial/estadísticas; no extrapolar carga adulta a infancia ni convertir observaciones en diagnósticos. Respetar interés del niño en marcar goles y evitar encasillarlo. Medir capacidades con contexto; no garantizar profesionalización, todos los goles ni tamaño corporal. Datos reales/medidas fuera de Git. Pendientes de dosificación acotados en PROJECT_STATUS; no repetir objetivos o antropometría. Revisar terceros en modo infantil antes de habilitarlos. Esta especificación no declara implementados perfiles, plan infantil, métricas ni TV.
- Ampliación del usuario del 2026-10-02: el destino es diseñar, mostrar y dar seguimiento a planes de fútbol conversando desde la app, con gol, extremo, mediocentro y defensa y contextos casa/cancha/gimnasio. La hora de 60 minutos es el primer caso, no el límite permanente. Aplicar docs/product/ADAPTIVE_FOOTBALL_COACH_VISION.md y ADR 0014. No volver a pedir estos objetivos; separar actividad histórica de capacidad actual. Datos de salud y medidas reales siguen fuera de Git. No prometer cobertura instantánea de cualquier ejercicio, acceso a chats previos, IA ilimitada o alta deportiva. Esta ampliación no autoriza gastos, publicación, descargas ni cambios globales; descomponer implementación sin declarar funciones futuras realizadas.
- Instrucción del usuario del 2026-09-30 al autorizar 06: fundamentar la revisión deportiva con fuentes, motivo de elección y qué se trabaja; conservar ese análisis solo en documentación, sin mostrarlo en el portal/app. No exigir contratación externa para avanzar. Separar revisión documental de comprobación técnica, aceptación de claridad y revisión profesional; no otorgar `coaching-reviewed` por consultar fuentes. Aplicar ADR 0012 y dejar incertidumbres concretas vinculadas al recurso.
- Corrección del usuario del 2026-09-29: ocultar/minimizar pausa automáticamente; volver visible retoma el mismo punto solo si la sesión estaba corriendo y la única causa de pausa fue ocultación. Pausa manual, inspección, fallo de recursos/reloj, recarga y estado sin iniciar/terminado no se reanudan por mostrar la ventana. No consumir tiempo oculto. Sustituye la exigencia anterior de continuar tras toda ocultación; detalle en ADR 0010.
- Tras completar el repaso manual de 02, el usuario restablece el avance normal/autónomo: «ya podemos avanzar con normalidad, solo interrumpir con preguntas muy necesarias por favor». Queda superada la revisión obligatoria de un pendiente por mensaje. Completar el trabajo autorizado, incluido el punto de control local propuesto, y preguntar únicamente ante información indispensable o una ampliación no autorizada del alcance.
- En el flujo de entrenamiento, priorizar avance y demostración previa automáticos con mínima interacción. Si falta preparación, +30 s/+1 min deben añadir tiempo con un toque y mantener autoinicio, sin exigir después «Estoy listo». Pausar todo sigue disponible como interrupción indefinida explícita. Esta corrección del usuario sustituye la propuesta de preparación con espera manual; su comprensión y suficiencia se prueban, no se presumen.
- Completar autónomamente todo el alcance autorizado; no exigir un mensaje por paso o decisión rutinaria. La instrucción de avanzar del 2026-09-27 cambia el acompañamiento, pero no levanta por sí sola la restricción expresa de no implementar ni instalar. Detenerse únicamente ante una decisión indispensable, un cambio de alcance o permiso nuevo; agrupar el siguiente alcance concreto para evitar autorizaciones repetidas. No iniciar fases no autorizadas.
- Al cerrar la fase, actualizar PROJECT_STATUS.md con archivos, pruebas realmente ejecutadas, pendientes y siguiente paso.
- No atribuir a Codex acceso automático a conversaciones o memorias de ChatGPT: el repositorio es la fuente de contexto.
- No instalar herramientas globales, cambiar políticas de PowerShell, desactivar antivirus, publicar o subir archivos sin autorización específica.
- Usar versiones compatibles verificadas y lockfile; no depender de `latest` como especificación reproducible.
- Auditar no equivale a entrenar: el fixture no se ofrece como rutina aprobada mientras continúe draft.
- En ejercicios de fuerza, un intervalo indica una ventana disponible: permitir un número objetivo de repeticiones y descanso del tiempo restante, no obligar a repeticiones continuas ni al fallo.
- La silla del escenario no debe reducir ficticiamente el espacio disponible ni utilizarse como apoyo sin definir estabilidad y variante. No mostrar una búlgara cuando el ejercicio pide ambos pies en el suelo.
