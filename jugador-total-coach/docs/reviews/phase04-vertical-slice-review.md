# Fase 04 — demostración 3D implementada, aceptación pendiente

Trabajo iniciado el 2026-09-28 y continuado el 2026-09-29. Alcance autorizado: «adelante con la siguiente fase» y, para la herramienta, «Sí, autorizar Blender portable». Se ejecutó únicamente 04. La revisión humana del nuevo gesto y el recorrido en navegador todavía no están realizados; no cerrar la fase ni avanzar a 05 por tener pruebas automáticas correctas.

## Resultado disponible

Una bisagra de cadera sin carga, con avatar masculino genérico riggeado, ropa neutra y escena de referencia 2×2 m. La aplicación inicia en vista lateral y permite frontal y tres cuartos. Conserva el motor de 03; ofrece preparación automática, +30 s/+1 min, pausa/continuación, omisión, repetición después del descanso y revisión lenta con la sesión pausada. La ficha y la pantalla dicen **en revisión**; no ofrecen una rutina aprobada para seguir.

El ensayo de un minuto contiene 10 s de ejemplo, 30 s de secuencia visual y 20 s de descanso. Dentro de los 30 s se representan tres gestos de 8 s y después 6 s de reposo. No se impone un bucle durante toda la ventana. El selector de cinco minutos repite cinco bloques del mismo recurso para probar integración; no es una rutina deportiva variada ni la sesión final de una hora.

Se conserva el diagnóstico del fixture bajo un desplegable. La vista 3D reemplaza el panel temporal de texto en la pantalla principal; el componente anterior y sus pruebas permanecen en código. No se presentan dos relojes de sesión simultáneos.

## Reutilización y archivo concreto

- Base adoptada: `Superhero_Male_FullBody.gltf` de Universal Base Characters **Standard** de Quaternius. El archivo gratuito trae Superhero masculino/femenino; no trae el Regular que se había propuesto al leer la página comercial. Se corrigió la selección con evidencia del ZIP, sin comprar Source ni inventar un recurso ausente.
- Rig original de 65 huesos, incluidos pies y dedos. Se conserva jerarquía, pesos y nombres; [mapping](../../assets/manifests/quaternius-male-rig.json). Altura neutral aproximada: 1,81959 m. Runtime +Y vertical/+Z frontal/derecha anatómica −X.
- Se inspeccionó también Standard de Universal Animation Library: 43 acciones, incluidas locomoción, interacción y T-pose; ninguna es una bisagra de cadera identificada. No se incorporan sus clips a la app. El maniquí riggeado de esa biblioteca se comparó visualmente y se eligió el cuerpo humano de Base Characters por la lectura de cadera, rodilla y pie. Esa elección no demuestra superioridad pedagógica.
- Se creó únicamente el gesto faltante sobre el rig existente, mediante IK, keyframes, bake y exportador glTF de Blender. No se creó rig, solver, editor ni exportador propios. Los scripts acotados están en `tools/build_hip_hinge.py`, `tools/roundtrip_hip_hinge.py` y las herramientas de comprobación; no constituyen un Authoring Studio ni ejecución de 06.
- Clip `EX_hip-hinge__neutral__v1`: 30 FPS de autoría, 8000 ms, finito. Inicio y final neutrales; el preview repite después de 2000 ms adicionales de separación. Ficha, clip y mapping conservan `draft`.
- [GLB](../../assets/runtime/hip-hinge-v1.glb): 825240 bytes. SHA-256 `45466b100e7f1aa3d6d66643f9cdcd612a83de3d0b6a22257b960d82969ac4fe`.
- [Fuente Blender](../../assets/source/hip-hinge/hip-hinge-v1.blend): 1543502 bytes, comprimida, editable. Fuente glTF/bin/texturas disponibles conservada sin cambios en `assets/source/hip-hinge/original`; no se necesita la edición Source de pago.
- Los dos mapas normales referenciados pero ausentes en el paquete original se registran en la [evidencia](phase04-asset-evidence.json). Se reemplazaron los materiales del prototipo, con ropa neutra horneada mediante las herramientas de Blender. El GLB final contiene una textura de 512×512 y no solicita imágenes externas faltantes. Los avisos de la importación original no se ocultan ni se atribuyen al runtime final.

Blender 4.5.14 LTS se descargó del distribuidor oficial en ZIP portable de 398661046 bytes, SHA-256 `b9533d2397ac1984db4466fb23a7a4649391cca93f6e84209f9bcc60d071c8b9`, coincidente con el listado oficial. Ejecutable comprobado: build `62c1db4208e8`, 2026-09-15. Configuración, cachés y temporales dentro del proyecto; sin instalador, drivers, cambios globales ni complemento externo. Render de revisión por CPU; no se probó la interfaz interactiva/GPU de Blender.

## Ficha y fundamento del gesto

[Ficha ejecutable](../../content/exercises/hip-hinge.json). La [ficha de ACE](https://www.acefitness.org/resources/everyone/exercise-library/33/hip-hinge/) explica el patrón con un bastón como referencia: cadera hacia atrás, ligera flexión de rodillas y continuidad del tronco. El proyecto adapta la ilustración a la variante bilateral sin carga ni bastón; no atribuye a ACE la validación de esa adaptación ni de esta animación.

Decisiones de autoría: inclinación de pelvis/tronco de aproximadamente 40°, traslado de cadera hacia atrás, pies fijos, brazos al costado y cuello acompañando el tronco. Un gesto muestra 1 s neutral, 2 s de descenso, 1 s en el extremo, 2 s de retorno y 2 s neutral. Es una cadencia elegida para inspeccionar la representación, no una recomendación individual de profundidad, velocidad, carga o número de repeticiones. No se infiere edad, salud, nivel ni capacidad del usuario.

Se muestran indicaciones de respiración sin contener el aire, errores comunes y acción de detenerse/buscar valoración ante dolor, bloqueo, inflamación o inestabilidad. Reducir el recorrido es una regresión propuesta pendiente; no se simula otro clip ya aprobado. La prueba visual no incorpora calentamiento/vuelta a la calma y por eso no se ofrece como sesión de entrenamiento. La sesión deportiva posterior sí los requiere. No se afirma transferencia al fútbol, aprendizaje, corrección de la ejecución del usuario ni eficacia personal a partir de una animación.

## Sincronización y fallos

`HingeDemo` compone el reloj de 03 y los cursores de ejemplo/inspección. La pose de trabajo depende de `phaseElapsedMs`; el visor recibe milisegundos explícitos y reutiliza AnimationMixer/GLTFLoader. No importa el motor ni puede acreditar trabajo. Cambiar cámara modifica solamente la cámara.

La preparación extra conserva el cursor de trabajo; el ejemplo tiene cursor independiente y al agotarse el extra se vuelve automáticamente al mismo punto. Pausar todo congela cuenta y pose. Añadir preparación estando pausado conserva esa pausa. El inspector funciona solo con la sesión pausada, permite ½ velocidad/velocidad normal y búsqueda de posición; termina tras un gesto y salir restaura la pose guardada sin reanudar por sí solo. Continuar desde el inspector retoma la sesión.

La pérdida de visibilidad, huecos del reloj >2000 ms y pérdida del recurso pausan sin acreditar ese hueco. Carga fallida, clip incompatible, WebGL no disponible, pérdida de contexto y demora de carga tienen tratamiento de error; iniciar/continuar quedan bloqueados mientras falte el recurso. Reintentar carga no reanuda automáticamente. No aparece un cubo o imagen suplente que se contabilice como entrenamiento válido. La respuesta real de WebGL/context-loss todavía necesita prueba en navegador.

El ejemplo previo al inicio también se puede pausar. Se respeta `prefers-reduced-motion` desactivando su reproducción inicial; una prueba iniciada expresamente sigue su secuencia. Botones nativos, foco visible, controles fuera del canvas y textos del movimiento. La accesibilidad y los tamaños nuevos aún necesitan revisión real; la aceptación manual de 03 no se transfiere a esta interfaz.

## Verificaciones realizadas

| Comprobación | Resultado y alcance |
|---|---|
| Vitest | **128 pruebas, nueve archivos, correctas**: base, motor/adaptador, composición 3D, recurso/Mixer, ficha/manifiesto y montaje/carga. Incluyen 16 casos nuevos de regreso tras ocultación y conservación de pausas/tiempos. CPU, HTML y efectos controlados, no E2E de navegador. |
| Programa | Ensayos lógicos de 60/300 s, extras/repetición, fin de clip/reposo, pausa, inspector/retorno, visibilidad, recurso y huecos. Cinco minutos comprobados con reloj inyectado; no recorrido humano de cinco minutos. |
| glTF Validator de Khronos | Original final y reexportado: cero errores, advertencias, informaciones o hints. Se corrigieron tres advertencias iniciales de jerarquía de mallas y se quitaron UVs no usados. |
| Geometría/AnimationMixer | 241 muestras a 30 FPS, 65 huesos y apoyos. AABB mundial dentro del cuadrado; altura máxima 1,81959 m. Desplazamiento máximo medido del origen de los pies en autoría: 0,00003591 m. Margen técnico de prueba: 1 mm; no umbral clínico ni análisis completo de biomecánica/autocolisiones. |
| Importar/editar/exportar | GLB importado en Blender, textura decodificada, rig/acción conservados y reexportación correcta. Comparación CPU de 65 huesos × 241 muestras: diferencia máxima ≈0,00000115 m, inferior a 1 mm. [Registro](phase04-roundtrip.json). |
| Visual del recurso | Ocho imágenes de Blender CPU inspeccionadas directamente: cinco poses laterales, frontal neutral/inclinada y tres cuartos inclinada. Cuerpo y pies legibles; retorno neutral. No son capturas de Chrome ni certificación deportiva. |
| Código | Lint, TypeScript, format:check y build correctos; instalación offline con lockfile congelado correcta. Cinco scripts Python analizados sintácticamente sin ejecutar su autoría. La resolución local de React en viewer-3d se corrigió enlazando la misma versión ya instalada como dependencia de desarrollo, sin nueva descarga/versiones. |
| Integridad documental | 71 documentos UTF-8 y 244 enlaces locales correctos; 13 hashes de recursos y 20 de avisos de licencia coincidentes. Fixture y esquemas históricos sin cambios. Git conserva sin conversión de saltos de línea los originales y licencias importados, incluidos sus espacios finales; el aviso ensamblado normaliza solo esos espacios. |
| Licencias/seguridad | 20 pares adicionales revisados; avisos preservados. Consulta pnpm audit: cero avisos conocidos el 2026-09-29; no auditoría forense. [Detalle](phase04-dependencies.md). |
| Servicio local | Preview reiniciado tras detectar que 4173 no escuchaba; HTTP 200 para HTML y GLB, hash servido idéntico. Solo 127.0.0.1. Abrir en Codex quedó en cola; eso no demuestra visualización. |
| Navegador | Dos intentos del conector IAB sin conexión, incluido el posterior a reabrir preview. El inventario alternativo solo mostró IAB; sin Chrome automatizable. No se afirma E2E, ausencia de errores de consola ni rendimiento WebGL observado. |

El build separa el visor en carga diferida: JavaScript principal ≈397 KB y módulo 3D ≈959 KB sin comprimir (≈120/256 KB gzip), CSS ≈10 KB y GLB ≈825 KB. Vite advierte que el módulo 3D supera 500 KB. No se ocultó esa advertencia ni se cambió su umbral. DPR limitado a 1,5, sin sombras ni postprocesado; el resultado en el teléfono sigue sin medir.

## Evidencia visual del recurso

Renderizados en Blender, no capturas de la aplicación. [Inicio lateral](evidence/phase04/hinge-side-000.png), [descenso](evidence/phase04/hinge-side-060.png), [retorno](evidence/phase04/hinge-side-150.png), [final](evidence/phase04/hinge-side-240.png) y [frontal inicial](evidence/phase04/hinge-front-000.png).

![Bisagra, vista lateral en Blender](evidence/phase04/hinge-side-105.png)
![Bisagra, vista frontal en Blender](evidence/phase04/hinge-front-105.png)
![Bisagra, vista tres cuartos en Blender](evidence/phase04/hinge-threeQuarter-105.png)

## Corrección del aviso falso de WebGL — 2026-09-29

El usuario aporta [vista sin avatar](evidence/phase04/user-avatar-unavailable.png) y [aviso WebGL con inicio deshabilitado](evidence/phase04/user-webgl-fallback-message.png), y comunica que no observa errores en consola. Copias sin cambios: SHA-256 `bf9a6c8a5753487b114f4c6008cfc69d33d1302d39f256dcd27879a8a4d20396` (39961 bytes) y `362caffe6969a963b52ea68448b35f71b42f78f9dffdac94350978dab9b134b7` (23706 bytes). Inspección directa de ambas imágenes por el agente; la ausencia de errores es reporte del usuario, no captura de consola. Queda confirmada la pantalla nueva, sin visualización del avatar.

Causa comprobada en Fiber 9.8.1 instalado: `fallback` se monta como hijo HTML de `<canvas>` aun con soporte gráfico. Nuestro componente Unavailable llamaba onFailure en su efecto de montaje y hacía desaparecer el visor. No se había consultado ni constatado falta de WebGL 2. El [código oficial de Canvas](https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/web/Canvas.tsx) corrobora esa relación; la comprobación de versión se hizo sobre el paquete local fijado, no suponiendo que master sea 9.8.1.

Corrección acotada: eliminar ese componente con efecto y usar texto de respaldo pasivo. Los errores reales de render conservan SceneBoundary; carga fallida/timeout y context-loss conservan su tratamiento y el inicio no se habilita hasta presentar el avatar. No se cambian recursos, dependencias, GPU, políticas ni configuración del navegador.

Regresión: tres pruebas reproducen el mensaje falso con el código anterior y pasan después. Simulan únicamente el contrato DOM de Canvas y ejecutan los efectos de montaje capturados: sin error al montar el respaldo, timeout a 25 s y rechazo real de carga sin duplicación. No crean contexto WebGL ni equivalen a navegador real. Suite total 108/9, lint, tipos, formato y build correctos. La advertencia previa de tamaño del módulo 3D sigue documentada. El reporte posterior del usuario confirma la aparición del modelo, según la sección siguiente.

Versión corregida servida: HTML referencia `index-BPDITU30.js`; módulo `ExerciseScene-DdQw1qym.js`. Ambos y el GLB responden HTTP 200 y coinciden byte a byte con el build local; el hash del avatar no cambia. Para recibir el código corregido se debe recargar la página; reintentar solo el avatar desde una pestaña con el código anterior no actualiza JavaScript.

## Avatar visible y lectura de indicaciones — 2026-09-29

Después de babc701 el usuario confirma «ya veo el modelo 3d», comenta «se ve medio raro pero creo que funciona» y señala que las indicaciones inferiores pasan demasiado rápido. La incidencia de no aparición queda resuelta por reporte manual, sin captura nueva ni revisión directa del agente. La apariencia sigue abierta: no se infiere si su observación corresponde a proporciones, materiales, postura o deformación del movimiento. No equivale a aprobación técnica/deportiva del gesto ni comprobación de todos los botones.

Se verificó en DemoPanel que una frase reemplazaba a otra según poseMs, con tramos de 1–2 s. El primer ajuste (71d7ff9) trasladó la guía completa debajo del modelo y eliminó esa frase; el usuario aclara que quería conservar la guía donde estaba y que su observación era solo sobre el texto dinámico. Se corrige esa interpretación: los cuatro cues vuelven junto al cronómetro y se restaura la frase inferior, agrupada en dos mitades de 4 s del clip. «Cadera hacia atrás; mantén los pies apoyados» cubre preparación/descenso/posición inclinada; «Vuelve despacio a la posición inicial» cubre retorno/asentamiento. En reposo final se muestra la posición inicial. La separación adicional del preview prolonga la segunda indicación; no hay mensaje intermedio de solo un segundo.

El texto dinámico sigue la pose: se congela al pausar y acompaña la inspección lenta, sin temporizador independiente. Se mantiene el nombre accesible estable y su enlace a la guía completa, sin anuncios continuos. Sin cambios de motor, clip, autoinicio ni dosis. El [plan con alternativas y aclaración](../plans/phase04-vertical-slice.md) registra el fundamento; cuatro segundos es una elección de presentación pendiente de validar, no un tiempo de lectura universal.

Verificaciones tras la aclaración: 108 pruebas/9 archivos, formato, lint, tipos y build correctos. No se crean pruebas adicionales para un cambio de presentación reversible. Build `index-MeT-dI9f.js` y CSS original `index-RsD1Ph5B.css`; se conserva la advertencia conocida de tamaño del módulo 3D. Lectura/disposición visual posteriores, rendimiento y aspecto aún pendientes de observación.

## Controles y hombros tras el recorrido del usuario — 2026-09-29

El usuario confirma detención simultánea de avatar/reloj, identifica los hombros como zona extraña y describe un fallo de descubrimiento: «Ver despacio» abría contenido tan abajo que parecía no funcionar. Pide cámaras arriba del modelo, controles debajo y preparación compacta. Se registra como reporte manual; no se infiere aceptación completa ni continuación comprobada específicamente.

Cambios de interfaz: cámaras encima del canvas; controles principales, inspector y preparación debajo del texto dinámico; repetir/omitir/terminar en una fila secundaria. La guía completa sigue junto al reloj. Preparación conserva +30 s/+1 min y autoinicio con texto breve, sin panel amplio; botones con mínimo de 44 px. Se reduce la altura del visor según el alto disponible y se coloca el selector de duración junto a la guía. Desglose de tiempos y contadores pasa a «Detalles de la prueba»; se mantiene visible «Demostración en revisión. Todavía no es una rutina para seguir».

El inspector «Revisar movimiento» queda junto al activador. Al abrir recibe foco visible y desplazamiento inmediato mínimo; al cerrar vuelve el foco al activador. El botón indica su estado expandido y permite cerrar la revisión. Continuar/terminar conservan una salida con foco en el control de reproducción. No se cambian motor, tiempos, velocidad del clip ni regla de pausa. Fundamento y alternativas en el [plan](../plans/phase04-vertical-slice.md); comportamiento real del foco/scroll pendiente de observación porque IAB volvió a fallar.

Hombros: los renders permiten reproducir el contorno elevado/angular. Se probó un suavizado local y se descartó por abrir separaciones; no se incorporó al recurso. La corrección adoptada baja 12° la pose de las clavículas existentes, conservando la dirección global de los brazos. La [comparación CPU](phase04-shoulders-comparison.json) confirma posición/normal/UV/color, índices de triángulos y pesos de las tres mallas idénticos, y jerarquía ósea intacta. Se modifica la animación, no el rig de referencia ni el modelo base. Ángulo elegido para esta representación, sin convertirlo en indicación anatómica/deportiva para el usuario.

Se conservaron [frontal anterior](evidence/phase04/shoulders-before/hinge-front-000.png) y [tres cuartos anterior](evidence/phase04/shoulders-before/hinge-threeQuarter-105.png). Los ocho renders de revisión enlazados arriba corresponden ahora al clip corregido: inspección directa por el agente, con mejora del contorno de hombros en frontal y tres cuartos, sin separaciones como las del candidato descartado. El modelo mantiene musculatura estilizada; satisfacción del usuario y valoración del gesto siguen pendientes. Son imágenes de Blender CPU, no capturas de la aplicación.

Verificación tras estos cambios: 108 pruebas/9 archivos, formato, lint, tipos y build correctos. Validador Khronos sin incidencias; ida/vuelta de 65 huesos por 241 muestras conserva diferencia máxima de 0,0000011473 m y deriva de origen de pies 0,00003591 m. GLB de 825704 bytes, hash 29e7c0b20d73ba170787c96b91e6b30946a23ff7bb17b517bb9c08ae58875ab0; fuente Blender de 1552640 bytes y registro de 13 hashes actualizado. El script de comparación CPU emitió una advertencia de importación CommonJS de Three; pertenece a esa comprobación puntual, no a la app. No se instalan dependencias ni se altera configuración global.

Build: index-BinoZfBL.js, index-B93dQdUF.css, ExerciseScene-CIjk0Fyg.js y hip-hinge-v1-CothXE7r.glb. La advertencia de tamaño del módulo 3D sigue presente. No hay evidencia de navegador posterior al cambio; no se crean pruebas que solo repliquen el orden del JSX ni se sustituye la comprobación visual por HTML estático.

Servicio verificado después del build: HTML y los cuatro recursos anteriores responden HTTP 200 y coinciden byte a byte con los archivos locales. Se comprobaron seis documentos UTF-8, 82 enlaces locales y los 13 hashes del inventario actualizado; git diff --check correcto. Recargar la pestaña es necesario para recibir esta versión. No se atribuye a estas peticiones HTTP una comprobación visual del navegador.

## Tamaño restituido y menor apertura de brazos — 2026-09-29

El usuario acepta el ajuste de hombros («está perfecto»), pide recuperar el tamaño anterior y señala apariencia de flexión hacia fuera en el bíceps. Aceptación registrada solo para el aspecto de hombros, sin cerrar la revisión del movimiento ni acreditar evaluación deportiva.

Se restablece la altura original del visor: 460 px en escritorio y 380 px bajo 850 px de ancho. No se cambian cámaras, escala física del avatar ni orden de controles. La reducción según altura disponible, introducida en el ajuste anterior, queda retirada por perjudicar el tamaño que el usuario ya consideraba adecuado.

Inspección: el ángulo entre los ejes de brazo y antebrazo es aproximadamente 3,52° en las muestras, mientras la postura anterior dejaba los brazos abiertos unos 12° lateralmente. La nueva pose reduce esa apertura a 6° (descenso desde la T-pose de 78° a 84°). En neutral, la separación lateral hombro-codo pasa de unos 5,22 a 2,62 cm; hombro-muñeca, de 10,28 a 5,17 cm. El volumen del bíceps sigue formando parte de la malla estilizada; su contribución a la percepción se considera una interpretación visual, no un diagnóstico de deformación ni una evaluación anatómica del usuario.

La [comparación de revisiones](phase04-arms-comparison.json), frente a 3c86b32, comprueba atributos e índices de las tres mallas idénticos, pesos/jerarquía sin cambios y matrices mundiales idénticas de 17 huesos protegidos durante las 241 muestras: clavículas, torso, cabeza y piernas/pies. La pose aceptada de clavículas se conserva. Renders nuevos de cinco poses laterales, dos frontales y tres cuartos inspeccionados por el agente, sin nuevas separaciones visibles; no es análisis exhaustivo de autocolisión ni prueba de navegador. Comparación visual anterior conservada en [frontal previo](evidence/phase04/arms-before/hinge-front-000.png) y [tres cuartos previo](evidence/phase04/arms-before/hinge-threeQuarter-105.png).

Verificación: 108 pruebas/9 archivos, formato, lint, tipos y build correctos. Khronos e ida/vuelta correctos, 65 huesos y duración de 8 s; diferencia máxima de ida/vuelta 0,0000011473 m. Fuente editable, manifiestos, registro de 13 hashes y ocho renders actualizados. GLB actual: 825240 bytes, SHA-256 45466b100e7f1aa3d6d66643f9cdcd612a83de3d0b6a22257b960d82969ac4fe. No se modifica el motor ni se añaden dependencias. Se conserva la limitación previa del conector, sin nuevo intento de navegador ni aceptación visual posterior atribuida al agente.

Build actual: index-BTrAK_iK.js, index-Bmh7R24Y.css, ExerciseScene-BavP0bMV.js y hip-hinge-v1-BNOtzeRP.glb. Advertencia conocida de módulo 3D >500 KB sin cambios.

Entrega comprobada: HTML y esos cuatro recursos responden HTTP 200 y son idénticos al build local. Seis documentos UTF-8, 86 enlaces locales y 13 hashes de recursos correctos; git diff --check sin incidencias. La apariencia posterior al cambio sigue pendiente de observación del usuario; HTTP, render de Blender y pruebas CPU no equivalen a captura o interacción real del navegador.

## Recuperación de carga y continuación — 2026-09-29

Revisión del agente: React conserva un import `lazy` rechazado; volver a montar el boundary con otra key no reintenta su carga. La pantalla ofrecía para ese fallo la misma acción que para un archivo GLB fallido. Se corrige el boundary exterior para ofrecer «Recargar página», con aviso previo de que descarta la prueba. Solo ocurre tras pulsar; no hay recarga automática. Fallos del GLB, contrato, timeout y contexto conservan el reintento del avatar y la continuación explícita. Es un defecto hallado por lectura de código, no una incidencia informada por el usuario.

Cuatro pruebas nuevas de efectos/carga con recursos Three verifican: liberar un recurso que llega después del timeout; liberar una carga pendiente que termina después del desmontaje sin notificar un fallo obsoleto; rechazar/liberar un clip incompatible; y cargar otro recurso después de un fallo, liberándolo al desmontar. El callback de listo sigue reservado al frame del avatar. Son pruebas de CPU con callbacks controlados, sin GPU ni observación de interacción real.

Resultado: 112 pruebas en nueve archivos; formato, lint, tipos y build correctos. No se cambian avatar, layout, motor, dependencias ni licencias. Persiste la advertencia conocida de módulo 3D >500 KB. El nuevo intento del conector IAB falla antes de adquirir pestaña. Se solicita al usuario comprobar +30 s durante el ejemplo, autoinicio e inspector visible; respuesta pendiente. «Listo continuamos» autoriza seguir trabajando, sin constituir evidencia de esos casos.

Entrega local: HTML y los cuatro recursos del build responden HTTP 200 con bytes idénticos. Build de esta corrección: `index-C5m4AveH.js`, `ExerciseScene-DR4Dq4Mw.js`, `index-Bmh7R24Y.css` y `hip-hinge-v1-BNOtzeRP.glb`; el GLB conserva su hash. No se recarga la pestaña del usuario desde el agente ni se atribuye una prueba de WebGL a esta comprobación HTTP.

## Regreso automático y respuesta del usuario — 2026-09-29

Fuente: reporte del usuario después del checkpoint 20c6e6a. Confirma recarga/inicio del ensayo de un minuto y que «Ver despacio» aparece a la vista y sus controles funcionan. No declara fin continuo de un minuto ni cinco minutos, medición de foco por teclado o aprobación deportiva. Reporta una pausa al pulsar +30 s y duda si minimizó: no se conoce la causa concreta. Usó Continuar; no hay traza de ese momento que permita atribuirlo al botón.

Solicita pausa al minimizar y reanudación al regresar. [ADR 0010](../architecture/adr/0010-resume-on-visible.md) sustituye la exigencia anterior de continuar tras toda ocultación. SessionClock recuerda si estaba corriendo, preserva el motivo de pausas previas y emite Resume al volver solo si la pausa se debe exclusivamente a ocultación y no hubo fallos. Pausas manuales/inspector, recursos/reloj y estados sin iniciar/terminados no se reactivan automáticamente. Se siguen registrando los huecos sin acreditar trabajo ni descontar preparación; no se modifica el motor puro.

Pruebas: antes del cambio fallaron diez expectativas nuevas de regreso/motivo; después pasan 128 casos en nueve archivos (16 casos añadidos). Incluyen preparación +30 s, conservación de pose/cuenta, trabajo/descanso, inspección, pausa manual previa/posterior, errores de recurso/reloj y eventos duplicados. Formato, lint, tipos y build correctos. CPU/HTML/reloj inyectado, no interacción real con visibilidad del navegador. En la suite apareció una advertencia de Node `THREE_CJS_DEPRECATED`; no se reprodujo al ejecutar aisladamente App.test.tsx con trace-warnings. Origen exacto no identificado; no se oculta ni se atribuye a la consola del navegador. Persiste el aviso conocido de build del módulo 3D >500 KB.

Texto aclarado: «Secuencia · 3 repeticiones de bisagra» y definición de una repetición en detalles. Son tres gestos completos de 8 s, seguidos de 6 s de reposo en la ventana técnica de 30 s; no tres ciclos del bloque ni dosis deportiva validada. El clip, tamaño y postura del avatar no cambian.

Entrega HTTP: HTML y cuatro recursos responden 200 con bytes idénticos al build. JavaScript principal `index-BsGX2eQT.js`, escena `ExerciseScene-11u1SfKs.js`; CSS/GLB sin cambios. No nuevo intento de navegador ni E2E atribuido al agente. Regreso real al minimizar/restaurar y el caso +30 s quedan pendientes tras esta corrección.

## Pendientes vigentes de aceptación

**Validación posterior del 2026-09-29:** el usuario responde «listo ya valide las modificaciones, continuamos» a la entrega e8457ee y la solicitud de comprobar minimizar/restaurar. Se acepta el regreso automático por reporte manual. La causa histórica de la pausa tras +30 s sigue sin estar determinada; el reporte no la demuestra. No se reabre la misma comprobación ni se atribuyen pruebas de recursos, mediciones o cinco minutos completos. Esta actualización es documental; conserva las 128 pruebas de la implementación anterior sin afirmar otra ejecución.

[Guía de comprobación en pantalla](phase04-manual-check.md): controles exactos, resultados esperados y estado de cada caso. El usuario confirma aparición, detención sincronizada, corrección de hombros, recarga/inicio e inspector visible con controles correctos. No repetir esas preguntas. La incidencia de +30 s no tiene causa confirmada y el regreso automático se implementó después del reporte. El conector IAB sigue sin conectar.

1. Aparición, detención sincronizada y ajuste visual de hombros confirmados por el usuario. Completar observación de continuación y calidad del movimiento, brazos/tamaño restituido, lectura del texto y nueva disposición de controles; mantener separados funcionamiento y comprensión/aprobación del gesto.
2. Recorrido completo de cinco minutos solicitado, con cinco bloques, cámaras sin reinicio y final único. Ampliación +60 y escenarios de extra durante trabajo/pausa, repetir/omitir, reintento y pérdida de recursos/contexto conservan sus pendientes de pantalla. Regreso automático e inspector/controles aceptados por reporte; consola y captura de aplicación, teclado/foco y ancho reducido aún pendientes. La prueba del motor y los renders no sustituyen ese E2E. No se acredita un ensayo continuo independiente de 60 s a partir del reporte de inicio/modificaciones.
3. Revisión humana de comprensión/técnica de esta ficha y este clip, asignada al usuario con apoyo del agente. Una aprobación personal no se registrará como revisión profesional. Mantener `draft` hasta resolver el alcance y las observaciones.
4. Comprobación de rendimiento/legibilidad en PC real y Galaxy S24 FE, con versiones, dimensiones y método. La URL loopback solo funciona en esta computadora; acceso móvil/origen seguro y offline siguen pendientes, sin cambios de firewall/certificados implícitos.

No hay voz, persistencia, PWA/offline, simulación de balón, Remotion, contenido de una hora ni fases 05–09. No hubo pagos ni publicación. El siguiente trabajo es resolver estos pendientes de 04; no pedir permiso nuevamente para lo ya autorizado ni iniciar 05 automáticamente.
