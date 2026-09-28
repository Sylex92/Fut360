# Pruebas de aceptación: licencias, contacto y claridad

Esta es una especificación de pruebas. Todavía no se han ejecutado en una app.

## Licencias / coste

- Inventario de librerías y transitivas del lockfile: versión, licencia y origen.
- Inventario de assets descargados con hash/licencia; prohibido marcar conocido un archivo no revisado.
- Build local documentado sin servicio de IA.
- Reproducción del catálogo sin red y sin claves.
- No peticiones a terceros, anuncios, analítica ni CDNs necesarias.
- El núcleo y MVP1 no requieren exportador de video ni render de pago. Su incorporación futura se rige por ADR 0008.
- Aceptar licencias gratuitas compatibles aunque no sean open source; verificar restricciones reales.
- Cada funcionalidad nueva incluye revisión de costo/derechos. No prometer escala o gratuidad ilimitadas.
- Quitar/desactivar un adaptador opcional no debe impedir el entrenamiento local; probarlo cuando exista.

## Avatar / tutorial

- Esqueleto reutilizado; documentar mapping.
- Tres vistas muestran apoyos, rodilla y pie de contacto sin oclusiones relevantes.
- A un tiempo de clip igual se obtiene una pose equivalente dentro de tolerancia declarada.
- Pausa/reanudar no mueve solo el balón o solo el cuerpo.
- Repetir no acumula traslación ni sale del 2×2, incluyendo props.
- Identificación de izquierda/derecha no depende solo del color.
- Cues y animación representan el mismo ejercicio/variante.

## Demostración incorrecta, no reproducible o potencialmente peligrosa

Aclaración de fase 00, 2026-09-25, solicitada por el usuario. Son requisitos documentados para implementar y comprobar en las fases autorizadas; no controles ya existentes. Aplican tanto a animaciones preparadas como a resultados de simulación. Que algo sea sencillo visualmente no permite enseñar un apoyo falso, ocultar un contacto o exigir una trayectoria no reproducible.

**Regla de salida:** una demostración que enseña mal, presenta una imposibilidad relevante o tiene una duda de seguridad sin resolver no se habilita para entrenamiento ni cuenta como cobertura del MVP1. Un aviso de «borrador» no basta para incorporarla a una sesión que invita a imitarla. Puede conservarse como material de inspección técnica separado, sin instrucciones de práctica física.

**Precisión posterior del usuario:** el ejercicio debe quedar bien explicado aunque no se persiga física perfecta. «Bloquear» significa no ofrecer todavía el recurso defectuoso, no abandonar el ejercicio. La prioridad es corregir su demostración y conservar su objetivo. La falta de un clip gratuito ya hecho, una deformación del rig o un resultado físico inadecuado son problemas de producción a resolver; no demuestran que el movimiento real sea imposible de representar.

### Calidad suficiente sin exigir perfección física

La demostración debe permitir entender preparación, secuencia, apoyos, contacto relevante, ritmo orientativo, resultado buscado y errores que se pretenden evitar. La exactitud se concentra en lo que cambia la técnica o su interpretación. Se admiten apariencia estilizada y trayectoria ilustrativa coherente; no se admite esconder una contradicción de la animación con un texto o un video.

Se podrán proponer ampliaciones visuales concretas —detalle del contacto, fases del gesto, flechas o video del resultado— cuando resuelvan una necesidad de comprensión. Un video complementa la enseñanza del avatar; no convierte un avatar incorrecto en aceptable ni sustituye silenciosamente la cobertura 3D exigida. Cualquier recurso adicional requiere revisión de contenido, derechos y disponibilidad local; no se selecciona ni descarga ahora. Ver la [distinción entre gesto, resultado y simulación](../3d/PHYSICS_AND_ANIMATION.md).

### Evidencia exigida antes de habilitar

- Ficha y demostración coinciden en variante, apoyos, equipo, lado, cadencia, dosis y entrada/salida. Revisar también la transición y el retorno del bucle; un corte no debe aparentar un movimiento continuo imposible.
- Revisión técnica del archivo y reproducción final: articulaciones, deslizamiento, interpenetraciones, contacto cuerpo-balón, dimensiones, espacio 2×2 y materiales presentes. Las pruebas geométricas ayudan a encontrar errores, pero no certifican viabilidad humana.
- Revisión deportiva por una persona con competencia pertinente sobre ficha y clip final, con evidencia de versión, alcance y observaciones resueltas. La aceptación del usuario y el análisis del agente no sustituyen esa competencia. Si surge una cuestión clínica individual, su evaluación corresponde al ámbito adecuado; no convertir toda animación en consulta médica.
- Claridad en teléfono/computadora, a velocidad normal y desde las cámaras previstas. Primero se comprueba que la demostración pueda entenderse por observación; no se pide al usuario ejecutar un gesto dudoso para decidir si es correcto.
- La aprobación se refiere al contenido y contexto examinados, no garantiza que toda persona pueda repetir idéntico rango o ritmo. La adecuación individual y las alternativas revisadas son aspectos distintos de que el avatar funcione.

### Tratamiento del defecto

1. Registrar ejercicio, variante, versión del clip/ficha, momento y problema observado. Si hay sospecha razonable de peligro o imposibilidad, suspender su uso de entrenamiento mientras se investiga; no exigir una lesión ni una certeza absoluta para actuar.
2. Determinar si falla la animación, la instrucción, el ritmo, el apoyo, el ejercicio elegido o su contexto. Corregir en la capa que causa el problema. Una trayectoria físicamente calculada tampoco queda exenta de revisión.
3. Corregir primero la representación conservando el ejercicio: ajustar o rehacer el clip sobre el rig existente, cambiar el recurso incompatible, corregir cámara/ritmo/instrucciones y complementar lo que no se entienda. Sustituir el clip o avatar no es sustituir el ejercicio. Si aún no se consigue una demostración suficiente, mantenerla pendiente y explicar el obstáculo, sin cambiar automáticamente el objetivo para facilitar el desarrollo. Solo cambiar o retirar el ejercicio cuando una revisión justifique que su contenido, adecuación o contexto no corresponde, no por dificultad gráfica. En ese caso revisar la sesión sin sustituciones silenciosas, aceleraciones de otros ejercicios ni recortes de descanso para conservar 60 minutos.
4. Revisar de nuevo lo afectado y registrar la evidencia de la versión resultante. Un cambio de rig, proporciones, clip, lado, ritmo, contacto o instrucciones que altere lo enseñado invalida la evidencia afectada; no heredar automáticamente la aprobación anterior.
5. Hasta resolverlo, el ejercicio no cuenta como listo y la sesión que depende de él no se entrega como entrenamiento completo. Los estados exactos y su bloqueo técnico se definirán en fase 01; esta aclaración no cambia esquemas ni habilita código.

### Si el defecto aparece después de la entrega

Al conocerlo, indicar que no se siga esa demostración y retirar o deshabilitar la versión afectada mediante la corrección local correspondiente. Si ocurre durante una sesión, detener ese ejercicio y permitir interrumpirla, conservando un registro fiel de lo no completado; no iniciar automáticamente una sustitución sin revisión. Resolver el defecto y comprobar la actualización antes de rehabilitarlo.

El MVP1 no observa al usuario por cámara ni identifica en tiempo real si una ejecución es peligrosa. Tampoco se promete retirada remota instantánea de contenido en un dispositivo sin conexión: una corrección conocida requiere actualizar su copia local. El mecanismo de versión/cache y su comprobación se concretarán en las fases de arquitectura/offline. No añadir un servicio remoto obligatorio como solución implícita.

**Estado actual:** el usuario se ha ofrecido a realizar la revisión humana. Todavía no hay clips ni revisión realizada; esa asignación no acredita por sí sola competencia deportiva ni cambia el estado del contenido. El alcance se concreta en el apartado siguiente. No se promete riesgo cero ni detección de todos los defectos.

### Qué significa «revisión deportiva competente»

Aclaración solicitada por el usuario el 2026-09-26. Es un criterio de calidad del contenido del proyecto, no una afirmación de obligación legal, certificación oficial o examen médico general. La competencia debe corresponder a la tarea: técnica y enseñanza del fútbol para los gestos de balón; preparación física para selección, dificultad, repeticiones, descansos y progresiones. Una persona podría cubrir varios aspectos si su formación y experiencia lo permiten; no se exige contratar un equipo de especialistas por defecto.

El agente prepara la investigación, recomienda y justifica las decisiones, redacta fichas, detecta contradicciones y organiza las comprobaciones. Esa labor ya está en curso y no se traslada al usuario. La revisión humana pertinente examina el contenido concreto, registra observaciones y permite resolverlas; consultar una fuente escrita por un especialista no significa que ese especialista haya revisado nuestra adaptación. La aceptación del usuario tampoco acredita ese trabajo.

Dos momentos propuestos: revisar fichas y organización de la sesión antes de producir extensamente; revisar después el clip y las instrucciones tal como se reproducen. El primer momento puede adelantarse sin aplicación. El segundo necesita una demostración real. Dejar constancia de quién revisa y su competencia pertinente, versión examinada, alcance, límites, hallazgos, correcciones y decisión; registrar solo datos profesionales autorizados, sin datos clínicos personales en Git.

Esta revisión no observa automáticamente al usuario ni certifica su condición física, una ejecución individual o resultados futuros. Una cuestión clínica individual tendría un alcance distinto si llegara a plantearse. No se abre aquí un cuestionario de salud.

La investigación y propuesta documental existen, pero la revisión deportiva especializada no se ha realizado. Se puede completar la auditoría documental dejando explícito este límite; no atribuir aprobación deportiva al contenido por haber asignado a una persona revisora.

### Revisión asumida por el usuario

El 2026-09-26 el usuario indica: «Yo la voy a revisar». Queda identificado como responsable de la revisión humana de las fichas y demostraciones junto con el agente. La asignación se registra como revisión del usuario, sin atribuirle formación deportiva no declarada ni darla por realizada. Su declaración anterior de no ser experto se mantiene; no convertir su participación en la obligación de resolver dosis, biomecánica o fundamentación científica.

Proceso propuesto para cada recurso:

1. El agente presenta ejercicio, finalidad, fundamento, referencia, instrucciones y límites conocidos, además de sus comprobaciones técnicas cuando haya clip.
2. El usuario examina el material y señala qué entiende, qué resulta confuso, qué observa distinto y qué necesita aclaración; puede solicitar correcciones antes de aceptarlo.
3. El agente analiza y resuelve los hallazgos. Una duda técnica o deportiva no se cierra por preferencia ni por pedir al usuario que pruebe un gesto dudoso.
4. Registrar versión, observaciones, correcciones y aceptación del usuario con su alcance real. No cambiar automáticamente a coaching-reviewed ni anunciar validación profesional a partir de esa aceptación; los contratos de revisión se concretarán en la fase documental correspondiente.

La revisión humana ya tiene responsable; una revisión especializada sigue sin evidencia acreditada. No se impone contratación ni se inicia búsqueda/contacto con terceros por esta asignación. Si una cuestión concreta excede lo que podamos fundamentar y comprobar, explicitarla en el recurso afectado y conservarla pendiente, sin inventar una aprobación. Esta decisión no acepta la fase 00 ni autoriza implementación.

## Laboratorio Rapier

- Balón dinámico cae al suelo fijo sin atravesarlo de forma visible en el caso documentado.
- Pie cinemático produce contacto sin teletransportar continuamente el balón.
- Fricción y restitución son configuración, no un solver casero.
- Pausa congela todo; reset restaura el estado.
- Pruebas a diferentes tasas de render conservan resultados dentro de tolerancia.
- CCD se evalúa en casos rápidos; límites conocidos se documentan.
- La escena no se vende como simulación validada de potencia, lesión o técnica humana.

## Salida MVP1

La hora suma 3,600 segundos y todos los ejercicios tienen recursos reales revisados. La prueba acelerada del reloj no sustituye la revisión de la reproducción a velocidad normal ni el ensayo en el dispositivo elegido.
