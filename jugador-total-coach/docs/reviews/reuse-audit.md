# Auditoría de reutilización — fase 00

Auditoría inicial: 2026-09-24. Repaso guiado y comprobación complementaria: 2026-09-25. Resultado: hay candidatos concretos para avatar, clips generales, props y motores. **No hay aún cobertura demostrada de los 31 ejercicios del fixture.** La propuesta posterior de doce patrones tampoco acredita clips existentes ni sustituye todavía ese fixture. No se descargó ni abrió ningún modelo.

Verificado significa evidencia de la ficha o documentación consultada. Supuesto significa adecuación propuesta. Pendiente significa inspección o prueba necesaria. Oferta de un archivo gratuito y validación de su contenido son verificaciones distintas.

## Recorrido guiado: qué aprovecharemos y qué falta producir

**Recomendación:** evaluar primero un personaje Standard de Quaternius, aprovechar su esqueleto y los movimientos compatibles que realmente sirvan, y usar Blender para la adaptación necesaria. Conservar Three/Fiber para mostrar el resultado y Rapier para la prueba física separada. La principal incertidumbre de reutilización es la cobertura y calidad de los gestos deportivos; la existencia de un pack no la resuelve.

### 1. Personaje, esqueleto y movimiento

El **modelo o malla** es la superficie visible. El **rig** prepara su movimiento mediante un esqueleto digital; puede incluir controles que no viajan en el archivo exportado. Un **clip** es una secuencia concreta: disponer de personaje y rig no demuestra que exista la bisagra de cadera o el control con la planta que necesitamos.

El candidato sigue siendo [Universal Base Characters Standard](https://quaternius.itch.io/universal-base-characters), separado de Source. La [ficha técnica](https://quaternius.com/packs/universalbasecharacters.html) anuncia rig humanoide, glTF y compatibilidad con su biblioteca de animaciones; los `.blend` riggeados corresponden a Source. Esto justifica examinar juntos ambos recursos, pero no demuestra que las variantes gratuitas encajen sin ajustes.

**Criterio propuesto:** avatar genérico con proporciones y ropa que permitan distinguir apoyos, rodillas, cadera y tronco. Preferir Regular si está incluida y cumple esos criterios. Nombre interno, huesos de pie/dedos y editabilidad del gratuito siguen pendientes. No elegir por apariencia promocional ni comprar Source para resolver una carencia sin comparar alternativas.

### 2. Biblioteca de movimientos

La [Universal Animation Library](https://quaternius.itch.io/universal-animation-library) publica Standard separado de Pro/Source y anuncia movimientos generales. No se ha comprobado un clip gratuito exacto de hip-hinge o inside-inside. Un desplazamiento puede servir de base, pero no acredita una demostración de fútbol o fuerza.

Para cada gesto: buscar e inspeccionar; reutilizar si coincide; adaptar si conserva una base útil; crear únicamente el movimiento faltante sobre el rig existente cuando la carencia esté documentada. Autoría específica no significa fabricar motor, esqueleto o editor. Cambiar velocidad o reflejar izquierda/derecha tampoco valida automáticamente otra variante deportiva.

### 3. Función de Blender

Blender se usaría en la computadora de preparación para importar el personaje, examinar articulaciones, adaptar movimientos, revisar contactos y exportar. La aplicación reproduciría el resultado sin necesitar Blender abierto. Su reinstalación sigue pendiente hasta la fase que lo necesite; no se ejecuta ahora.

**Verificado documentalmente:** el [manual glTF de Blender 4.2](https://docs.blender.org/manual/en/4.2/addons/import_export/scene_gltf2.html), recuperado mediante contenido indexado oficial, documenta mallas, materiales, animación y skinning, además de muestreo/exportación del movimiento. Acredita capacidades, no elige esa versión para instalar.

**Pendiente:** un GLB importado puede conservar los huesos que deforman el cuerpo sin recuperar todos los controles del `.blend` original. Debe comprobarse que basta para adaptar poses. Transferir una animación entre esqueletos —retargeting— puede requerir mapa de huesos y corrección de apoyos/proporciones. No se ha elegido un complemento ni se promete transferencia automática. Las ayudas de pose se reutilizarán de herramientas existentes y su resultado deberá exportarse a una animación reproducible.

### 4. Enseñanza y contactos

[AnimationMixer de Three.js](https://threejs.org/docs/pages/AnimationMixer.html) reproduce clips y permite evaluar un tiempo concreto. Nuestra parte coordina trabajo, descanso, pausa, lado e instrucciones; no se escribirá un motor de animación. Remotion Player conserva su estado de alternativa en la [revisión específica](../research/REMOTION_LICENSE_REVIEW.md).

En la demostración, cuerpo y balón seguirían una secuencia revisada y sincronizada. En el laboratorio separado, [Rapier](https://rapier.rs/docs/user_guides/javascript/rigid_bodies/) aporta cuerpos dinámicos/cinemáticos para probar contactos. Un rebote calculado no determina si el ejercicio está bien enseñado. Clip y física no controlarán simultáneamente el mismo balón.

**Aclaración solicitada por el usuario:** esta separación no permite mostrar gestos incorrectos, imposibles o peligrosos como entrenamiento. Rapier documenta que una trayectoria cinemática es impuesta por la aplicación y puede atravesar obstáculos; su cálculo no valida por sí mismo al humanoide. Una demostración defectuosa se bloquea mientras se corrige, conservando el objetivo del ejercicio adecuado. Sustituir el clip defectuoso no equivale a cambiar el ejercicio; una dificultad gráfica no basta para retirarlo. Se podrán proponer detalles, trayectorias o video complementario para explicar el resultado, con recursos revisados y sin exigir física perfecta. Véanse [gesto, resultado y simulación](../3d/PHYSICS_AND_ANIMATION.md) y el [criterio de aceptación](../quality/ACCEPTANCE_OSS_PHYSICS.md). Son requisitos documentales, sin implementación ni detección automática del movimiento del usuario.

### 5. Objetos y escena

[Furniture Kit de Kenney](https://kenney.nl/assets/furniture-kit) sigue como candidato de silla: ficha con esa categoría y descarga sin donación; silla concreta sin inspeccionar. Para suelo, límite de 2×2, balón neutro y tapete se proponen formas básicas existentes del motor. La banda se representará en los ejercicios que la utilicen, sin necesitar una simulación de sus propiedades materiales para la demostración guiada.

Medidas y colocación deben representar el espacio ocupado. Una silla visible no acredita el apoyo previsto; un balón que atraviesa el pie impide considerar listo ese clip. Simplificar decoración no reduce la exigencia de claridad del movimiento.

### 6. Comprobación antes de ampliar

Primer hito propuesto: avatar y demostración breve de bisagra de cadera, sin balón ni apoyo, para examinar importación, articulaciones, encuadre y pausa. No es una rutina aprobada. Revisar de frente, de lado y en tres cuartos a velocidad normal; el modo lento complementa la inspección.

Después, inside-inside examinaría coordinación pie-balón y glute-bridge la claridad en el suelo. Son casos complementarios propuestos, no clips ya encontrados. Solo después de comprobar esta preparación y conciliar el catálogo corresponde producir muchos gestos. Registrar origen, licencia, hash, modificaciones y estados separados de revisión técnica y deportiva.

No falta una elección especializada del usuario para continuar 00. Las pruebas de archivos/ejecución corresponden a fases posteriores autorizadas. La [dirección deportiva recomendada](training-design-recommendation.md) debe conciliarse con el contrato vigente antes de convertir los 31 IDs originales en una lista de producción.

## IA como ayuda de producción — ampliación 2026-09-26

La [comparación específica](ai-production-tools-review.md) incorpora generación 3D, auto-rigging, captura desde video, asistencia a poses/física y video generativo. No se habían contrastado con suficiente detalle en la propuesta previa. Mantener la base local no excluye preparar recursos con IA: evaluar una ruta asistida pertinente si falta un clip, contabilizando también correcciones e integración. El ahorro y la calidad no están medidos; no se cambia el ejercicio adecuado para acomodar un resultado defectuoso.

Meshy y DeepMotion quedan como candidatos auxiliares con límites y términos pendientes; Mixamo conserva su papel alternativo y exige revisar restricciones IA. Cascadeur Free no acredita exportación útil para este flujo y TRELLIS.2 no cuenta con hardware requerido acreditado en este equipo. Ninguna opción es una dependencia nueva aprobada. No se han producido ni inspeccionado salidas.

## Inventario de recursos concretos

| Candidato y origen | Acceso/archivo publicado verificado | Adecuación y límites pendientes |
|---|---|---|
| [Universal Base Characters, Quaternius](https://quaternius.itch.io/universal-base-characters) | Universal Base Characters[Standard].zip, 122 MB, precio libre sin mínimo indicado; CC0. Source.zip, 600 MB, exige USD 19.99 o más. Ficha actualizada 16-09-2026. No se completó una descarga. | Primera opción propuesta: humanoide adulto genérico disponible en Standard, por identificar. Rig humanoide anunciado; pies/toes, proporciones, ropa, materiales y nombre interno no inspeccionados. |
| [Página técnica del mismo pack](https://quaternius.com/packs/universalbasecharacters.html) | Publica FBX/glTF, rig humanoide, promedio de 13 mil triángulos; .blend riggeado se reserva a Source | Importar el exportado gratuito a Blender sería la ruta editable propuesta; que se importen bien piel, pesos y clips queda pendiente. No exigir Source de pago. |
| [Universal Animation Library, Quaternius](https://quaternius.itch.io/universal-animation-library) | Universal Animation Library[Standard].zip, 15 MB, precio libre sin mínimo indicado; Pro.zip, 41 MB, desde USD 9.99; Source.zip, 46 MB, desde USD 14.99. CC0. Changelog publica v3.0 y variantes con/sin root motion. | Locomoción general anunciada; inventario de clips gratuitos exactos pendiente. El cambio previo de FPS descrito por el autor refuerza medir duración real. No se atribuye al Standard la totalidad del catálogo anunciado. |
| [Ultimate Animated Character Pack, Quaternius](https://quaternius.com/packs/ultimatedanimatedcharacter.html) | Página del autor: CC0, FBX/OBJ/Blend, personajes animados y uso gratuito; edición anunciada noviembre 2019 | Segunda opción de avatar. Archivo/variante descargable exacta y rig no comprobados; **pendiente**, no alternativa ya aprobada. Evaluar articulaciones y estética deportiva antes de elegir. |
| [MakeHuman/MPFB](https://static.makehumancommunity.org/about/license.html) | Política separa assets base CC0 del código de las herramientas | Tercera ruta: reutilizar generador y rig existentes. Exportado específico, ropa y huesos pendientes; requiere más preparación y no se propone instalar ahora. |
| [Mixamo, Adobe](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html) | FAQ oficial: gratuito con Adobe ID, sin suscripción Creative Cloud; personajes/animaciones para proyectos personales y comerciales | Alternativa de biblioteca, **pendiente**: ningún clip/archivo concreto inspeccionado ni términos de redistribución del recurso bruto cerrados. No se abrió cuenta ni se subieron assets; no se propone depender de su auto-rigging. |
| [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) | Edición 1.0 de 2018, 140 recursos, categoría 3D, etiqueta chair, CC0 y descarga sin donación | Candidato concreto de pack para silla. No se conoce todavía el nombre del archivo de silla ni su estabilidad representada. No afirmar que tenga balón, bandas o tapete. |
| Props mínimos | Geometrías existentes de Three.js para suelo, cuadrado, línea, esfera y tapete | Propuesta: reutilizar primitivas para objetos simples, con medidas explícitas y balón visual neutro. No usarlas como sustituto final del avatar. Banda deformable solo si un ejercicio revisado la necesita. |

Los archivos Standard están diferenciados públicamente de los archivos con precio mínimo; eso es más específico que un anuncio de «pack gratis». **No se han probado** acceso extremo a extremo, listado interno, licencia dentro del ZIP, hash, rig o animaciones. Cualquier divergencia entre ficha y archivo bloquea su incorporación. No se inicia checkout, pago, cuenta ni descarga en esta fase.

## Reutilizar → adaptar → crear lo específico

| Necesidad | Reutilización concreta | Adaptación mínima / evidencia para permitir trabajo propio |
|---|---|---|
| Render y cámara | Three.js + React Three Fiber | Tres presets, encuadre y contraste; sin motor gráfico propio. |
| Reproducción | GLTFLoader + AnimationMixer | Tiempo común de sesión/clip/ball; pausa, repeat y evaluación de pose. [API oficial](https://threejs.org/docs/pages/AnimationMixer.html). |
| Contactos | Rapier + react-three-rapier | Configurar suelo fijo, esfera dinámica y pie cinemático, materiales, timestep y debug. Sin solver, ragdoll ni controlador de drible. [Cuerpos Rapier](https://rapier.rs/docs/user_guides/javascript/rigid_bodies/). |
| Avatar | Standard gratuito auditado, rig existente | Mapping semántico, escala y materiales. Cambiar de candidato si carece de huesos necesarios; no reconstruir un rig por conveniencia. |
| Clips | Biblioteca gratuita inventariada, herramientas de Blender | Retarget/IK y ajustes sobre rig existente. Un clip técnico faltante se anima solo después de registrar búsqueda y carencia; no crear editor ni exportador propios. |
| Validación | glTF Validator, JSON Schema y reglas del proyecto | Reglas específicas de duración, cobertura, lados, espacio y revisión humana. |
| Audio | Web Audio; grabaciones propias opcionales | Beeps sincronizados y texto siempre visible. No voz cloud obligatoria. |
| Persistencia | IndexedDB y exportación JSON | Adaptador pequeño; no backend preventivo. |
| Futuro MP4 | Exportador existente elegible | Composición mínima separada; no construir un compositor completo por evitar revisar licencias. |

Las licencias y versiones pendientes están en [license-audit.md](license-audit.md). El 2026-09-25 se reconsultaron fichas de Base Characters, Universal Animation Library y Kenney, y APIs de Three/Rapier. El acceso directo al manual glTF de Blender volvió a fallar con HTTP 402; se recuperó contenido indexado oficial 4.2. Ese fallo no indica una tarifa de Blender. La compatibilidad exacta del exportador/opciones/complementos se verificará con la versión elegida; no se aprueba un plugin por pertenecer al ecosistema Blender. MakeHuman/MPFB, Mixamo y Ultimate Animated Character Pack conservan la evidencia anterior; no se afirma una nueva inspección de sus archivos.

## Cobertura real del fixture

Estado común hoy: **0/31 definiciones de ejercicio existentes, 0/31 IDs con recurso incorporado y revisado; 0 clips aprobados**. La tabla agrupa los IDs sin atribuir movimientos específicos a una biblioteca no inspeccionada.

| Grupo | IDs del fixture | Estado y trabajo propuesto |
|---|---|---|
| Activación (5) | active-march, ankle-mobility, hip-hinge, mini-squat, soft-step-turn | Pendiente. Locomoción puede servir de base para marcha, pero no prueba movilidad/bisagra/sentadilla. Hip-hinge propuesto como primer gesto. |
| Técnica con balón (5) | inside-inside, alternating-sole-taps, lateral-sole-roll, v-pull, inside-outside | Pendiente. No se verificó ningún clip exacto gratuito. Inventariar, luego adaptar/autorizar gesto faltante y trayectoria sincronizada del balón. |
| Transferencia en espacio pequeño (6) | scan-plant-turn, shield-and-exit, pause-feint-accelerate, false-nine-check-turn, late-arrival-no-shot, press-recover-protect | Pendiente. Producir variantes estacionarias solo tras revisar técnica y límites; movimientos de combate/carrera no equivalen a estos ejercicios. |
| Fuerza (6) | supported-split-squat, single-leg-rdl-supported, incline-push-up-chair, prone-ytw, glute-bridge, dead-bug | Pendiente. Apoyos, dosis y lado requieren ficha y revisión. No se verificó cobertura gratuita exacta. |
| Acondicionamiento (4) | inside-inside-fast, alternating-sole-taps-fast, v-pull-fast, quick-feet-line | Pendiente. Reutilización de clips base a distinta cadencia es una hipótesis, no validación. |
| Vuelta a la calma (5) | slow-breathing, calf-stretch, hip-flexor-stretch, recovery-pose, chest-shoulder-opener | Pendiente. Poses sostenidas no son necesariamente clips cíclicos; lados y entrada/salida explícitos. |

Lados derecha/izquierda se validan por variante. El espejo no se aprueba automáticamente para balón, apoyos o colliders.

## Puerta de selección futura

En una fase autorizada, descargar únicamente el Standard seleccionado; guardar archivo/origen/fecha/hash/licencia; inspeccionar malla, piel, pesos, rig y toes; importar sin perder fuente y exportar GLB en metros/Y vertical. Medir tamaño y comprobar una animación con las tres cámaras, pausa y vuelta al mismo tiempo. Registrar draft o technical-reviewed con evidencia. Coaching-reviewed requiere revisión humana real.

Antes de crear un gesto, registrar: problema, candidatos y clips inspeccionados, por qué no sirven, adaptación descartada, pieza mínima nueva y pruebas. Un modelo visible sin gesto comprensible no cierra el hito. El laboratorio físico no puede sustituir el clip de enseñanza.

## Recomendación de orden, no selección definitiva

1. Conciliar la propuesta de doce patrones con el catálogo/fixture vigente antes de autoría extensa; no modificar la rutina durante este repaso.
2. Evaluar Base Characters Standard y buscar/inspeccionar una base para hip-hinge; no presuponer que el pack la contiene. Preparar Blender antes de adaptar el primer clip si hace falta, incluso para el hito de fase 04.
3. Probar 60 s y después 5 min con el catálogo efectivamente disponible.
4. Comparar inside-inside guiado con laboratorio Rapier aislado.
5. Completar la preparación inicial con glute-bridge y después ampliar al catálogo conciliado. Los 31 IDs describen el fixture original, no una obligación de producir gestos descartados ni una cobertura aprobada.
6. Si falla rig, licencia o claridad, evaluar el segundo candidato antes de modelar/riggear desde cero.

Supuesto principal: el exportado gratuito conserva suficiente editabilidad. Si no se cumple, esa ruta se descarta sin comprar Source ni dar por terminado el MVP con un maniquí.
