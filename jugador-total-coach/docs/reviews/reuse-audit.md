# Auditoría de reutilización — fase 00

Fecha: 2026-09-24. Resultado: hay candidatos concretos para avatar, clips generales, props y motores. **No hay aún cobertura demostrada de los 31 ejercicios del fixture.** No se descargó ni abrió ningún modelo.

Verificado significa evidencia de la ficha o documentación consultada. Supuesto significa adecuación propuesta. Pendiente significa inspección o prueba necesaria. Oferta de un archivo gratuito y validación de su contenido son verificaciones distintas.

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

Las licencias y versiones pendientes están en [license-audit.md](license-audit.md). El manual glTF de Blender no pudo recuperarse por la herramienta web en esta consulta; la compatibilidad exacta del exportador/addons se verificará con la versión elegida. No se considera aprobado un plugin por pertenecer al ecosistema Blender.

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

1. Evaluar Base Characters Standard y animación hip-hinge.
2. Probar 60 s y después 5 min con el catálogo efectivamente disponible.
3. Comparar inside-inside guiado con laboratorio Rapier aislado.
4. Completar pipeline inicial con glute-bridge y después cerrar los 31 IDs/variantes.
5. Si falla rig, licencia o claridad, evaluar el segundo candidato antes de modelar/riggear desde cero.

Supuesto principal: el exportado gratuito conserva suficiente editabilidad. Si no se cumple, esa ruta se descarta sin comprar Source ni dar por terminado el MVP con un maniquí.
