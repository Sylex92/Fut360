# Fase 04 — primer ejercicio 3D verificable

Fecha: 2026-09-28. Autorización del usuario: «adelante con la siguiente fase», después del cierre de 03 (b3fb216). Se acepta 03 como base y se autoriza 04; 05–09 no se ejecutan. Plan escrito antes de código.

Estado al 2026-09-30: [04 cerrada como prototipo técnico](../reviews/phase04-closeout.md), tras pruebas de escritorio y aceptación del usuario de funcionamiento en Samsung y claridad de la demostración. Los apartados siguientes conservan planes/pendientes históricos con su fecha; no repetir sus solicitudes ya resueltas. Ficha/clip draft como contenido deportivo; 05 todavía no autorizada.

## Resultado y límites

Una bisagra de cadera sin carga, con humanoide genérico riggeado reutilizado, clip finito GLB y fuente editable. Demostración en revisión, no prescripción ni rutina aprobada. Caso técnico de 60 s y, cuando el recurso esté revisado técnicamente, secuencia de prueba de cinco minutos del mismo gesto. No confundir repetición técnica con variedad deportiva.

Escena en metros, 2×2, +Y vertical/+Z frontal, cámaras lateral inicial/frontal/3⁄4. Reutilizar el motor de 03: pausa exacta, repetir tras descanso, omisión, preparación automática +30 s/+1 min, ejemplo independiente y retorno al trabajo. Inspección lenta solo con sesión pausada y restauración del cursor. Sin voz, persistencia, exportación de video, simulación física ni catálogo de una hora.

## Recursos y autorización

| Recurso candidato | Necesidad, versión y licencia verificadas antes de descargar | Preparación |
|---|---|---|
| three 0.186.1 | GLTFLoader, AnimationMixer y render; MIT según registro oficial npm | Dependencia local de viewer-3d |
| @react-three/fiber 9.8.1 | Integración React; MIT; peer React >=19 <19.4 compatible con 19.3.0 existente | Dependencia local; sin drei ni Rapier runtime |
| @types/three 0.186.0 | Tipos estrictos; MIT | Desarrollo; revisar transitivas, incluye tipos/paquete Rapier sin implementar laboratorio |
| gltf-validator 2.0.0-dev.3.10 | Validación reutilizada de GLB por Khronos; Apache-2.0 | Herramienta de desarrollo; sin exportador propio |
| Universal Base Characters Standard | Quaternius, 122 MB anunciado; CC0 en página del autor/itch.io; variante Source de pago excluida | Plan inicial: Regular masculino. Inspección real: Standard solo trae Superhero; seleccionado masculino, conservando rig y licencia interna |
| Universal Animation Library Standard | Quaternius, 15 MB anunciado; CC0; historial v3.0 publicado 2026-06-16 | Inventariar cobertura real. No afirmar que locomoción enseña hip-hinge ni adquirir Pro/Source |
| Blender 4.5.14 LTS Windows x64 portable | Autoría/revisión/importación/exportación con herramientas existentes; binario GPL-3.0-or-later, contenido creado con derechos independientes | Permiso específico recibido: «Sí, autorizar Blender portable». ZIP oficial 398661046 bytes (~399 MB), hash verificado y ejecutable local probado. Configuración, caché y temporales locales; sin instalador/global/actualizar drivers |

El permiso de 04 cubre sus cambios y dependencias/recursos locales auditados necesarios. La autorización específica de Blender prevista en first-visible-exercise-ready y ANIMATION_PIPELINE se recibió antes de descargarlo/ejecutarlo. No se necesita volver a pedirla para este alcance.

Fuentes de herramientas: [npm three](https://registry.npmjs.org/three/0.186.1), [Fiber](https://registry.npmjs.org/@react-three%2ffiber/9.8.1), [tipos](https://registry.npmjs.org/@types%2fthree/0.186.0), [validador](https://registry.npmjs.org/gltf-validator/2.0.0-dev.3.10), [compatibilidad Fiber](https://r3f.docs.pmnd.rs/getting-started/installation), [Blender 4.5](https://download.blender.org/release/Blender4.5/), [licencia Blender](https://www.blender.org/about/license/), [directorio portable](https://docs.blender.org/manual/en/4.5/advanced/blender_directory_layout.html). Hash oficial ZIP Blender 4.5.14: b9533d2397ac1984db4466fb23a7a4649391cca93f6e84209f9bcc60d071c8b9. Consulta 2026-09-28; elegir una versión fijada, no latest como dependencia.

Fuentes de assets: [Base Characters](https://quaternius.itch.io/universal-base-characters), [Animation Library](https://quaternius.itch.io/universal-animation-library). Licencia anunciada no sustituye comprobación interna; recursos aún pendientes de descarga/inspección al escribir el plan. Sin cuenta, pago, créditos o servicio generativo necesario.

## Pasos y comprobaciones

1. Resolver/auditar versiones y licencias de transitivas antes de instalar, scripts desactivados, lockfile y avisos locales. Registrar origen, hashes y copia de licencias de los archivos incorporados.
2. Ficha draft: variante bilateral sin carga, fases/cues/errores, material/espacio, parada y límites. Contrastar fuentes públicas primarias y distinguir el patrón documentado de decisiones de representación. Duración/cadencia visual elegidas para examinar el gesto, no dosis personal.
3. Inspeccionar el rig, malla, materiales, pies/toes y animaciones Standard. Conservar fuente importable. Si falta el gesto, preparar poses/clip sobre ese rig en Blender autorizado, sin crear editor/rig/solver/exportador. Mapear nombres existentes.
4. Validar GLB con Khronos y reglas propias de nombre/duración/lados/bounds. Renderizar vistas/poses para revisar apoyos, penetraciones, escala y fin de clip; corregir antes de presentarlo. Estado draft hasta evidencia suficiente; revisión humana/deportiva tiene su alcance explícito.
5. viewer-3d solo depende de domain y bibliotecas auditadas. Evaluar pose con AnimationMixer a tiempo explícito; no crear reloj de práctica independiente. La app controla el cursor de preview/inspección y pausa por recursos/WebGL/contexto perdido; sin fallback que permita acreditar entrenamiento.
6. Integrar una pantalla legible de demostración con ficha, estado de revisión, controles y cámaras. Serie finita seguida de reposo durante el resto de la ventana. Preview puede repetir con separación/retorno declarado. Guardar y restaurar la pose de sesión al cerrar inspector.
7. Pruebas de selección de cursor, clip finito, preview/pausa, inspector/retorno, cámaras sin reinicio, carga/fallo y contratos de recursos; ejecutar formato, lint, tipos, test y build. Intentar E2E mediante herramienta de navegador disponible. Declarar indisponibilidad si continúa, sin afirmar prueba móvil/visual automática no realizada.
8. Conservar evidencia visual, informe de revisión, licencias, limitaciones y estado del proyecto; punto de control local. No publicar ni ejecutar 05. Si falta permiso/recurso/revisión indispensable, completar lo independiente y documentar el bloqueo concreto.

## Costos y crecimiento

Herramientas locales propuestas sin tarifa de uso. Assets Standard CC0 anunciados; paquetes de pago del mismo autor no necesarios ni autorizados. Avisos de MIT/Apache y licencias de recursos se conservan al distribuir; publicación/licencia del código propio no decididas. Blender portable no se empaqueta en la app; sus scripts bpy requerirán revisar obligaciones GPL antes de publicación. Ampliar ejercicios implica trabajo de autoría/revisión y almacenamiento, no gratuidad ilimitada de toda producción. Revisiones deportivas, nube, video o proveedores nuevos mantienen su revisión propia.

Estado inicial: investigación y plan. Actualización: el usuario autoriza explícitamente Blender portable en respuesta a la pregunta concreta. ZIP oficial descargado, hash correcto, extracción dentro de .local/blender y versión 4.5.14 LTS comprobada. Sin instalador. Configuración portable y variables del proceso dirigidas al proyecto. Recursos y dependencias en preparación; resultados pendientes de verificar.

Actualización 2026-09-29: implementación y verificaciones registradas en el [informe de 04](../reviews/phase04-vertical-slice-review.md). El estado inicial anterior se conserva como historial. 105 pruebas correctas, recurso real, fuente editable y renders disponibles. Aceptación de navegador/humana pendiente; 04 no cerrada y 05 no autorizada.

## Corrección del aviso falso de WebGL — 2026-09-29

Las dos capturas del usuario muestran la pantalla nueva con «La vista 3D necesita WebGL 2 disponible en este navegador» y controles de inicio deshabilitados; informa además que no ve errores en consola. La implementación instalada de Fiber 9.8.1 monta `fallback` como hijo DOM de `<canvas>` (dist/react-three-fiber.esm.js, líneas 177–183). Su montaje no certifica un fallo de WebGL. Nuestro componente Unavailable ejecuta onFailure en useEffect al montarse, cerrando incondicionalmente el visor.

Plan acotado antes de modificar código: reproducir con una prueba de montaje del fallback dentro de canvas y efectos de la escena; comprobar también el timeout/fallo real de carga. Sustituir el fallback por texto pasivo, manteniendo el boundary de errores reales, el bloqueo de inicio y el manejo de pérdida de contexto. No instalar dependencias ni tocar navegador, GPU o configuración global. Ejecutar la regresión antes/después, verificaciones de código/build y servir la corrección. Conservar capturas sin cambios y registrar que el resultado visual posterior sigue pendiente hasta observarlo.

## Lectura de indicaciones — 2026-09-29

El usuario confirma que ya ve el modelo después de la corrección; comenta que se ve «medio raro» y que las indicaciones inferiores pasan demasiado rápido. Aparición comprobada por reporte manual; no aprobar por ello apariencia, técnica ni controles.

Plan previo al cambio: sustituir la frase que se reemplaza según poseMs (ventanas de 1–2 s) por los cuatro cues existentes, siempre presentes bajo el modelo y sin duplicarlos a la derecha. Mantener reloj, clip, preparación automática y controles. Descripción accesible estable del avatar enlazada a esa guía; sin anuncios continuos, animaciones de texto ni nuevo botón. Verificar con controles de formato/lint/tipos, suite existente, build y recursos servidos; no añadir pruebas que solo repitan este cambio de presentación.

Fundamento: el [W3C, explicación de 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html), describe las barreras de lectura de contenido que se actualiza o desaparece automáticamente. Se adopta texto persistente para eliminar su plazo de lectura; no se presenta un tiempo universal de lectura ni una certificación WCAG. Mantener una frase desfasada respecto de la pose o exigir pausas frecuentes no resuelve bien el objetivo de observar con mínima interacción. La comodidad resultante y el aspecto del avatar necesitan revisión posterior; no se cambia el recurso a ciegas.

### Aclaración del usuario: conservar la descripción en su posición original

La corrección anterior interpretó demasiado ampliamente la observación. El usuario aclara que la explicación completa estaba bien donde estaba; el problema era solo la frase dinámica inferior. Antes de modificar código: devolver los cuatro cues a la columna de la cuenta y restaurar el texto breve bajo el avatar. Agrupar ese texto en dos indicaciones para las dos mitades de 4 s del clip: llevar cadera atrás (incluye preparación inicial/descenso/posición inclinada) y volver a posición inicial (incluye retorno/asentamiento). En reposo final mostrar la posición inicial. El texto depende de la pose, sin reloj propio: pausa/inspección conservan su correspondencia. Los 4 s son una elección de presentación por comprobar, no un tiempo de lectura validado para todas las personas. Mantener descripción accesible estable y verificar con la suite existente/build; no añadir dependencias ni alterar clip/motor.

## Controles próximos al avatar y revisión de hombros — 2026-09-29

Evidencia del usuario: «sí se detiene el avatar y el reloj». Se acepta la detención sincronizada por reporte; no se presume una comprobación específica de reanudación que no describió. Precisa que el aspecto extraño se concentra en los hombros. Solicita cámaras arriba del modelo, controles de sesión debajo, preparación compacta y menos explicación técnica. Informa además que abrió la revisión lenta y creyó que no había ocurrido nada porque el panel apareció fuera de pantalla.

Plan previo a implementación:

1. Mover las cámaras encima del canvas y agrupar pausa/continuación y demás controles debajo del avatar. Conservar explicación completa junto al reloj y frase dinámica bajo el modelo; no moverla de nuevo.
2. Preparación en una fila compacta, con +30 s/+1 min y texto breve sobre autoinicio. Conservar botones de al menos 44 px de alto y posibilidad de envolver filas en móvil; reducir espacio y texto, no la superficie táctil.
3. Situar el inspector junto a su activador, antes de controles secundarios, con título breve «Revisar movimiento», estado expandido asociado al botón, foco al abrir y desplazamiento solo lo necesario para hacerlo visible. Al cerrar, devolver el foco al activador; no reanudar la sesión. No usar ventana modal que cubra el avatar ni barra fija que tape contenido. Verificar también salida mediante Continuar/terminación sin foco perdido.
4. Reducir textos de uso a lo necesario y agrupar desglose temporal/contadores en un desplegable «Detalles de la prueba». Mantener aviso visible de demostración en revisión, duración y guía del gesto; no aparentar rutina aprobada. Las explicaciones de implementación permanecen en documentos.
5. Inspeccionar hombros en fuente y poses de Blender. Probar una corrección local de superficie con herramientas existentes solo si mejora el defecto observado, conservando rig/pesos, gesto y apoyo. Comparar antes/después antes de sustituir recursos. Si se adopta un recurso corregido, regenerar manifiesto/hashes/evidencias y comprobar Khronos, poses, ida/vuelta y vistas. No cambiar de avatar ni descargar nuevos recursos por defecto.
6. Ejecutar formato/lint/tipos, suite existente y build; comprobar recurso servido. Intentar navegador mediante el conector disponible y conservar la limitación si falla. No declarar probado el foco/scroll real mediante HTML estático ni aumentar tests que solo copien el nuevo orden de elementos. Actualizar revisión, estado y punto de control local.

Fundamento de accesibilidad: [W3C, patrón de mostrar/ocultar](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) para el estado expandido y relación control/contenido; [MDN, focus](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) para dirigir el teclado al contenido recién abierto. Acercar controles y compactar la preparación responden a una incidencia real de descubrimiento y a la tarea observada; no se afirma una validación universal de usabilidad. El nuevo intento de IAB volvió a fallar antes de adquirir una pestaña.

Comparación de hombros antes de sustituir el recurso: suavizar localmente la malla produjo separaciones visibles y se descarta. Un ajuste de pose de 12° descendentes en las clavículas existentes, manteniendo la orientación global de los brazos, reduce el contorno elevado/angular en renders frontal y tres cuartos. Se adopta esa corrección de autoría para comprobarla en todas las muestras y vistas; no se modifica la malla, pesos, jerarquía ni pose de referencia del rig. Es una decisión de representación, no un ángulo prescrito al usuario ni aprobación deportiva. El cuerpo sigue siendo el recurso estilizado Superhero; no prometer anatomía hiperrealista.

## Restituir tamaño y revisar brazos — 2026-09-29

El usuario acepta expresamente el ajuste visual de hombros, pero pide el tamaño anterior del visor: la reducción introducida al compactar controles no era necesaria. Señala ahora aspecto de flexión hacia fuera en la zona del bíceps («conejo»), sin certeza de si procede de postura o musculatura. No atribuir este reporte a una lesión ni a la anatomía del usuario.

Plan previo al cambio: restaurar 460 px de alto en escritorio y 380 px bajo el breakpoint original de 850 px, conservando cámaras/controles reubicados. Mantener la corrección aceptada de clavículas. Inspeccionar ejes de brazo/antebrazo y renders para separar abducción, flexión y volumen estilizado; comparar una postura menos abierta usando el rig existente antes de cambiar el recurso. No adelgazar la malla a ciegas ni reducir el modelo para acomodar controles. Si se adopta una corrección de pose, comprobar vistas/intersecciones, integridad de malla/pesos/clavículas, pies, duración, Khronos e ida/vuelta; actualizar fuente, manifiestos, evidencia y build. Conservar el carácter draft y aceptación visual posterior pendiente. Sin descargas, dependencias, nuevo rig ni cambios globales.

Comparación previa: en las poses muestreadas el ángulo entre brazo y antebrazo es aproximadamente 3,52°; no se reproduce una flexión grande del codo. El descenso del brazo desde la T-pose era de 78° (12° de apertura lateral). Se compara 84° (6° de apertura), conservando clavículas y eje longitudinal del gesto. El desplazamiento lateral hombro-codo se reduce de unos 5,22 a 2,62 cm y hombro-muñeca de 10,28 a 5,17 cm; el ángulo del codo permanece igual. Renders frontal, lateral y tres cuartos muestran brazos menos abiertos sin nuevas separaciones visibles; se adopta ese ajuste para el recurso completo. La musculatura estilizada permanece: se corrige postura, sin atribuir el volumen muscular a una deformación diagnosticada ni convertir las medidas del avatar en prescripción.

## Recuperación de carga — 2026-09-29

Continuación autorizada dentro de 04. El conector IAB vuelve a fallar antes de adquirir la pestaña; la revisión de pantalla sigue pendiente y se solicita un recorrido agrupado de preparación automática e inspector, sin repetir preguntas sobre pausa/hombros.

Hallazgo por lectura del código: el boundary exterior y el fallo del archivo GLB ofrecen el mismo reintento. React 19.3.0 conserva el rechazo de `lazy` en su payload (implementación local `react.development.js`, función `lazyInitializer`); cambiar la key del boundary no vuelve a cargar ese módulo. No es un fallo observado por el usuario ni del GLB actual.

Plan previo al cambio: distinguir el fallo del módulo del visor del fallo recuperable de recurso/contexto. Para el primero, ofrecer «Recargar página» e indicar antes del botón que descarta la prueba actual; nunca recargar automáticamente. Para el segundo, conservar «Volver a cargar avatar», el punto de sesión y continuación explícita. Reutilizar los boundaries y APIs del navegador, sin nuevas dependencias, URLs artificiales para eludir cachés ni otra autoridad temporal. Añadir comprobaciones de carga tardía/desmontaje y un reintento tras fallo al harness existente, con recursos Three reales y callbacks simulados. Verificar formato, lint, tipos, pruebas y build; estas pruebas siguen siendo de CPU y no sustituyen WebGL real ni aceptación humana.

## Regreso automático tras ocultar la ventana — 2026-09-29

El usuario informa una pausa al pulsar +30 s, sin certeza de si había minimizado. Confirma recarga/inicio del ensayo de un minuto y apertura visible/controles del inspector. Solicita mantener pausa al minimizar y reanudar automáticamente al volver; pregunta si las tres repeticiones significan tres bisagras completas. La causa de la pausa reportada no se puede atribuir a +30 s ni a visibilidad sin registro de esa ejecución.

Plan verificable antes de modificar código:

1. Registrar la nueva regla en ADR 0010 y actualizar las referencias normativas que exigían continuar después de toda ocultación. Implementar en SessionClock, conservando el motor puro y el uso de Page Visibility, sin listeners de blur/focus ni dependencias nuevas.
2. Recordar si la sesión estaba corriendo cuando se ocultó. Al volver visible, retomar ese punto solo si la pausa fue por ocultación y no hubo pausa manual, fin, fallo de recursos o lectura inválida del reloj. Eventos duplicados no deben duplicar reanudaciones. Conservar el motivo de pausas previas al contabilizar tiempo oculto; no consumir programa ni extras durante ese tiempo.
3. Probar regreso desde preparación, trabajo y descanso; pausa manual/inspección, recursos y reloj; estados sin iniciar/terminados; eventos duplicados y +30 s antes/durante la ocultación. Reproducir primero el incumplimiento actual y después comprobar la corrección, incluyendo pose y autoinicio en la composición 3D.
4. Aclarar el texto de la secuencia: tres repeticiones completas de bisagra, sin modificar el clip, su cadencia ni el bloque técnico. Una repetición es llevar cadera atrás y regresar; no es repetir todo el bloque ni la sesión.
5. Ejecutar suite, formato, lint, tipos y build, comprobar entrega HTTP, registrar evidencia manual recibida y límites. La revisión posterior del comportamiento real de minimizar/restaurar queda pendiente; no inferir E2E ni conclusión de 60/300 s del reporte de inicio.

## Comprobación en navegador independiente — 2026-09-30

El usuario comunica que el recorrido de cinco minutos terminó sin anomalías. Se registra como evidencia manual. Aunque el conector del navegador integrado sigue sin responder, se descubre una herramienta Playwright disponible y se abre una pestaña independiente: Chrome 153, WebGL 2 y ANGLE sobre Intel UHD. No se instala software ni se modifica el navegador del usuario.

Plan verificable para completar las comprobaciones técnicas pendientes de 04:

1. Recorrer la prueba corta con tiempo real y controles visibles: preparación +30 s/+1 min, autoinicio, pausa, inspector y retorno; repetición/cancelación y omisión conservando descanso. No acelerar ni sustituir el reloj de la app.
2. Comprobar cámaras, teclado/foco del inspector y distribución a ancho reducido; guardar capturas del WebGL real. La emulación de ancho no sustituye al Samsung físico ni certifica accesibilidad completa.
3. Provocar de forma controlada un fallo de descarga y pérdida de contexto WebGL; comprobar reloj detenido, reintento y continuación explícita. Separar los errores inducidos de la consola en uso normal. Comprobar el timeout y la recuperación del módulo si la herramienta permite interceptar sus solicitudes.
4. Registrar resultados reproducibles y limitaciones en el informe, la lista manual y PROJECT_STATUS; actualizar las afirmaciones históricas de indisponibilidad de E2E. Si aparece un defecto, documentar su corrección antes de tocar código y ejecutar las verificaciones pertinentes. Si solo cambia documentación/evidencia, conservar el resultado previo de 128 pruebas sin fingir otra ejecución.

No se amplía el alcance a 05 ni se aprueba contenido deportivo. La prueba en el teléfono real y la revisión del gesto conservan su estado independiente.

Hallazgos de la revisión: la guía manual esperaba erróneamente conservar una repetición al omitir trabajo, pero el contrato vigente cancela esa repetición para evitar repetir por sorpresa lo omitido. Corregir la guía, conservando el motor. Las capturas reales muestran además «empieza automáticamente en…» mientras la sesión está pausada: aunque el reloj se detiene correctamente, el mensaje resulta contradictorio. Antes de editar código: mostrar «Preparación pendiente: …» y que el tiempo avanza al continuar en ese estado; conservar la frase de autoinicio mientras corre. Cambio solo de texto condicionado por el estado existente, sin modificar tiempos ni añadir dependencias. Verificar controles existentes y build, y observar ambos mensajes en el navegador.

Preparación móvil: el usuario confirma que PC y Samsung están en la misma red Wi-Fi de confianza. Completar la prueba móvil prevista en 04 mediante un segundo preview temporal del build, enlazado únicamente a la IPv4 Wi-Fi actual y puerto 4174, conservando el servicio loopback de 4173. Comprobar disponibilidad del puerto, HTTP y bytes servidos; guardar logs/PID solo en .local. No modificar configuración persistente, firewall, router, certificados ni instalar la app. Esta URL HTTP sirve para la demostración WebGL en LAN, no para aceptar PWA, origen seguro ni offline. Si el teléfono no conecta, detener el diagnóstico antes de cambiar reglas globales. Solicitar un recorrido agrupado de un minuto, cámaras, +30 s, pausa y aspecto/claridad desde el teléfono, sin ejercicio físico; registrar versión real de Chrome si se obtiene.
