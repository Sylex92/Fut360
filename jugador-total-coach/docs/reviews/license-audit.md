# Auditoría de licencias y acceso — fase 00

Consulta inicial: 2026-09-24. Repaso guiado y comprobación complementaria: 2026-09-25. Política aplicada: ADR 0008. Software gratuito abierto o no abierto puede ser admisible. Cuenta/tokens de Codex quedan fuera del presupuesto; la aplicación final no los necesita.

## Alcance de la evidencia

**Verificado:** textos primarios consultados y metadatos publicados que se enlazan abajo. No se instalaron paquetes ni se descargaron assets. Los enlaces a main/master/dev son revisiones documentales móviles, no versiones fijadas. Salvo los tags expresamente indicados, versión exacta, hash y árbol transitivo siguen **pendientes**.

**Declarado por el usuario:** por ahora el proyecto es para su uso personal. Se evalúa ese escenario; no se necesita repetir esta pregunta para continuar. **Supuesto de la ruta propuesta:** operación local, sin servicio público de render ni colaboración empresarial. Un futuro cambio de titularidad, equipo o uso requiere revisar condiciones; el número de personas que entrenan no equivale al tamaño de la entidad que utiliza Remotion.

**Decisiones:** «admisible como candidato» significa que la licencia consultada no impone pago por el escenario evaluado; no autoriza instalación ni aprueba un artefacto desconocido. «Condicionado» identifica restricciones conocidas. Todo binario/asset/transitiva sin comprobar queda pendiente para incorporación.

## Recorrido guiado: qué significa para este proyecto

**Dictamen:** mantener Blender, Three.js/Fiber, Rapier y recursos gratuitos con licencia compatible como ruta principal. Las condiciones revisadas no introducen una tarifa obligatoria por construir o usar localmente el núcleo previsto. La viabilidad documental no certifica todavía todos los archivos, dependencias ni movimientos. No se aprueban paquetes Pro/Source por conveniencia ni se promete que una biblioteca contenga los ejercicios necesarios.

### 1. Separar herramienta, contenido y servicio

Blender es la herramienta con la que prepararíamos el personaje y sus movimientos; el avatar y cada animación son contenido; un renderizador en la nube sería un servicio. Sus permisos y precios son independientes. Un programa gratuito puede abrir un modelo comprado, y un modelo CC0 puede utilizarse en una herramienta de pago. La selección debe ser compatible en todas las capas.

En la ruta propuesta, Blender se usaría en la computadora de preparación cuando la fase 3D lo necesite. La aplicación entregada reproduciría los archivos exportados en Chrome; no se propone instalar Blender en el teléfono para entrenar. Su reinstalación en esta computadora sigue pendiente y no se realiza durante 00.

### 2. Entender las licencias que sí aparecen en la base

| Familia | Consecuencia práctica | Trabajo que asumirá el proyecto |
|---|---|---|
| MIT, por ejemplo Three.js | Permite utilizar, adaptar y distribuir, incluso comercialmente; exige conservar el aviso de copyright y permiso | Mantener los avisos correspondientes también en el producto empaquetado, según los componentes incorporados. No exige publicar el código propio de la aplicación. |
| Apache-2.0, por ejemplo Rapier | Uso sin regalías; al redistribuir exige licencia, avisos aplicables, NOTICE cuando corresponda e identificación de archivos modificados | Registrar obligaciones del paquete real, incluido WASM. No implica que todo el código propio deba publicarse. |
| GPL de Blender | Las condiciones de distribución del programa son distintas de las de las obras creadas con él | La exportación del avatar no hace GPL a la aplicación. Revisar aparte cualquier redistribución de Blender, complemento o script que use su API. |
| CC0 de contenido | Permite copiar, modificar y distribuir el recurso sin tarifa de copyright ni atribución obligatoria | Conservar procedencia por trazabilidad; comprobar que la declaración corresponde al archivo. No presumir derechos de marcas, imagen personal o respaldo del autor. |

Fuentes: [MIT de Three.js](https://raw.githubusercontent.com/mrdoob/three.js/dev/LICENSE), [Apache de Rapier](https://raw.githubusercontent.com/dimforge/rapier/master/LICENSE), [manual oficial de Blender sobre GPL y obras, texto indexado](https://docs.blender.org/manual/en/4.2/getting_started/about/license.html), [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Conservar avisos no significa elegir MIT o Apache para todo el proyecto. La licencia pública del código propio sigue siendo una decisión del titular antes de publicar.

### 3. Blender: decisión recomendada y precisión del informe

Mantener Blender como herramienta de autoría. La página oficial distingue código mayoritariamente GPL-2.0-o-posterior y la distribución binaria combinada bajo GPL-3.0-o-posterior; el informe inicial solo explicitaba la primera parte. Se corrige esa precisión sin cambiar su admisibilidad. La versión/binario concreto continúa pendiente. El sitio también describe funcionamiento sin registro obligatorio y sin conexión para el uso básico oficial. [Licencia de Blender, recuperada mediante búsqueda en el dominio oficial](https://www.blender.org/about/license/).

Los derechos sobre modelos ajenos sobreviven a su edición: abrir un archivo en Blender no convierte ese recurso en propio ni elimina sus condiciones. Los complementos, servicios y recursos externos no quedan aprobados por la licencia de Blender.

### 4. Avatar, animaciones y silla: distinguir archivos gratuitos y de pago

Verificado en las fichas de los autores el 2026-09-25; no se descargó ni abrió ningún ZIP:

| Paquete | Variante publicada sin precio mínimo obligatorio | Extras que sí tienen precio mínimo publicado | Decisión |
|---|---|---|---|
| [Quaternius Universal Base Characters](https://quaternius.itch.io/universal-base-characters) | Standard, 122 MB, precio libre; ficha CC0 | Source, 600 MB, desde USD 19.99; incluye los `.blend` riggeados | Evaluar Standard primero. La posibilidad de importar y adaptar el exportado gratuito es una hipótesis pendiente de prueba. |
| [Quaternius Universal Animation Library](https://quaternius.itch.io/universal-animation-library) | Standard, 15 MB, precio libre; ficha CC0 | Pro, 41 MB, desde USD 9.99; Source, 46 MB, desde USD 14.99 | Inventariar solo los clips realmente incluidos. La cifra promocional de 120+ animaciones no acredita cobertura del Standard ni de nuestros ejercicios. |
| [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) | Pack 1.0; CC0, descarga con opción sin donación | Donación y paquete All-in-1 son ofertas separadas | Candidato para silla. Archivo concreto, escala y utilidad aún pendientes. |

**Criterio elegido:** si Standard no permite el resultado necesario, buscar otro recurso compatible o adaptar con herramientas existentes. No convertir la compra de Source en requisito silencioso. Licencia favorable, editabilidad y técnica deportiva se verifican por separado. La propuesta reciente de reducir patrones tampoco demuestra que ya existan sus animaciones.

### 5. Alternativas y exportación futura

Mixamo queda como alternativa: Adobe declara acceso gratuito con Adobe ID, sin suscripción Creative Cloud, y uso de personajes/animaciones en proyectos. Su FAQ no basta para cerrar las condiciones de redistribución del recurso separado o un GLB extraíble; ese punto sigue pendiente. No se interpreta esa incertidumbre como prohibición demostrada. La ruta principal evita depender de su cuenta/servicio. [FAQ de Adobe](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html).

MakeHuman/MPFB sigue como alternativa de avatar: assets base CC0, código de herramientas GPL/AGPL; ropa u otros recursos comunitarios requieren revisión individual. [Política del proyecto](https://static.makehumancommunity.org/about/license.html).

Para Remotion, el uso individual declarado encaja documentalmente en la categoría gratuita del LICENSE consultado. Eso permite mantenerlo como candidato futuro; versión, modalidad de exportación y condiciones aplicables se comprobarán al adoptarlo. No se necesita una suscripción solo por añadir ejercicios o producir sesiones más largas. Cambiar a operación por una entidad/equipo no elegible sí puede exigir otra licencia. El detalle de términos 4.0, texto futuro 5.0 y telemetría está en el apartado específico inferior. [LICENSE](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md).

La exportación no entra en MVP1. FFmpeg tampoco se adopta automáticamente como sustituto: compilación, componentes y codecs requieren su propia comprobación. Ninguna de estas decisiones compra, instala o activa un servicio.

### 6. Contenido deportivo, audio y decisión de salida

Las academias y publicaciones consultadas sirven de fuentes para fundamentar decisiones. El proyecto enlaza y redacta explicaciones propias; no empaqueta videos, libros, fotografías o ilustraciones ajenas por el hecho de poder consultarlas. El avatar sigue siendo genérico y no utiliza uniformes, rostro o identidad visual de futbolistas. Cualquier incorporación futura de contenido requiere derechos concretos.

Para el arranque se recomienda tipografía del sistema sin redistribuir archivos de fuentes, indicaciones escritas y señales sonoras generadas; grabaciones propias opcionales. Ningún catálogo de música, voz sintética o modelo descargable se da por licenciado sin elegirlo y revisarlo.

- **Verificado documentalmente:** permisos publicados y diferencias Standard/Pro/Source; el escenario personal declarado; ausencia de tarifas por duración/usuarios en las licencias MIT/Apache examinadas.
- **Propuesto:** mantener la ruta principal indicada y evaluar primero variantes gratuitas; conservar alternativas condicionadas fuera del camino crítico.
- **Pendiente de incorporación:** versiones exactas, archivos/hash/licencia interna, dependencias transitivas, avisos distribuidos, editabilidad y pruebas. Se cierran al seleccionar e incorporar artefactos en fases autorizadas; no se ocultan ni se declaran ya aprobados.

Este repaso se presenta para explicación y dudas. No acredita por sí mismo aceptación del usuario, cierre de 00 ni permiso de instalación. El siguiente bloque guiado es reutilización: comprobar qué piezas podremos aprovechar y qué adaptación específica falta.

## Herramientas y bibliotecas

| Candidato / versión o referencia | Licencia y costo obligatorio verificado | Uso y condiciones | Decisión documental |
|---|---|---|---|
| Node detectado 22.14.0; tag v22.14.0 | MIT y avisos de componentes incluidos; 0 de licencia del núcleo | Herramienta de desarrollo; conservar avisos si se redistribuye. [LICENSE del tag](https://raw.githubusercontent.com/nodejs/node/v22.14.0/LICENSE) | Admisible como candidato; procedencia/hash del binario y parche adecuado pendientes. |
| npm detectado 10.9.2; tag v10.9.2 | Artistic-2.0 para CLI; transitivas con términos propios | El registro es un servicio con términos separados; no confundir CLI con planes privados. [LICENSE](https://raw.githubusercontent.com/npm/cli/v10.9.2/LICENSE) | Uso local existente; auditoría completa de su distribución pendiente. |
| pnpm detectado 11.19.0; fuente main | MIT; 0 de licencia | Fijar versión de proyecto y revisar ejecutable; no depender exclusivamente de la entrada privada de Codex. [LICENSE](https://raw.githubusercontent.com/pnpm/pnpm/main/LICENSE) | Admisible como candidato; el texto de main no certifica el binario detectado. |
| React/react-dom; familia candidata 19 | MIT; 0 | Uso comercial, adaptación y distribución con avisos. [LICENSE](https://raw.githubusercontent.com/facebook/react/main/LICENSE) | Admisible como candidato; patches y peers pendientes. |
| Vite; versión por fijar | MIT; 0 | Toolchain local, sin servicio cloud obligatorio. [LICENSE](https://raw.githubusercontent.com/vitejs/vite/main/LICENSE) | Admisible como candidato. |
| TypeScript; versión por fijar | Apache-2.0; 0 | Licencia/avisos, NOTICE si existe, identificación de cambios distribuidos. [LICENSE](https://raw.githubusercontent.com/microsoft/TypeScript/main/LICENSE.txt) | Admisible como candidato. |
| Three.js; versión por fijar | MIT; 0 | Render, loaders y AnimationMixer; no concede derechos sobre modelos externos. [LICENSE](https://raw.githubusercontent.com/mrdoob/three.js/dev/LICENSE) | Admisible como candidato, motor previsto. |
| @react-three/fiber; familia candidata 9 | MIT; 0 | Conservar avisos; pareja con React 19. [LICENSE](https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/LICENSE) | Admisible como candidato. |
| Rapier; paquete JS/WASM y versión por fijar | Apache-2.0; 0 | Revisar paquete distribuido y WASM, además del motor Rust. [LICENSE](https://raw.githubusercontent.com/dimforge/rapier/master/LICENSE) | Admisible como candidato para fase 05. |
| @react-three/rapier; familia candidata 2 | MIT; 0 | Wrapper independiente del motor; auditar ambos. [LICENSE](https://raw.githubusercontent.com/pmndrs/react-three-rapier/main/LICENSE) | Admisible como candidato. |
| Blender; el usuario confirmó que lo desinstaló | GPL: código mayoritariamente GPL-2.0-o-posterior; distribución binaria combinada GPL-3.0-o-posterior según explicación oficial | Autoría comercial sin pago; la licencia del programa no impone GPL al arte creado. Assets y addons aparte. [Licencia oficial, consultada mediante resultado indexado](https://www.blender.org/about/license/) | Admisible como herramienta candidata; versión/distribución/addons pendientes. Sin autorización de reinstalación en 00. |
| Vitest; versión por fijar | MIT; 0 | Tests locales. [LICENSE](https://raw.githubusercontent.com/vitest-dev/vitest/main/LICENSE) | Admisible como candidato. |
| Playwright; versión por fijar | Apache-2.0; 0 | Navegadores/binarios y avisos se revisan aparte; no se descargaron. [LICENSE](https://raw.githubusercontent.com/microsoft/playwright/main/LICENSE) | Admisible como candidato. |
| Ajv; versión por fijar | MIT; 0 | Candidato necesario para reutilizar validación JSON Schema 2020-12; comprobar configuración del draft. [LICENSE](https://raw.githubusercontent.com/ajv-validator/ajv/master/LICENSE) | Admisible como candidato, sin instalación anticipada. |
| Khronos glTF Validator; versión por fijar | Apache-2.0; 0 | Valida formato, no técnica deportiva. [LICENSE](https://raw.githubusercontent.com/KhronosGroup/glTF-Validator/main/LICENSE) | Admisible como candidato para pipeline. |
| Lint, format, PWA y eventual wrapper IndexedDB | No se eligieron paquetes | Revisar licencia, necesidad, versión y transitivas antes de proponer incorporación | Pendiente; no se da por aprobado todo el ecosistema. |

MIT/Apache consultadas no contienen umbrales de ingresos, personas, minutos o renders que cobren por ampliar estos módulos. Esto no cubre futuras versiones, alojamiento, soporte contratado, plugins o contenido.

**Compatibilidad verificada a nivel de familia:** React 19 + Fiber 9 + react-three-rapier 2; alternativa documentada React 18 + Fiber 8 + wrapper 1. Se propone la primera para evaluar, sin fijar patches ni la versión de Three/Rapier hasta comprobar peers/engines y lockfile. [Fiber](https://github.com/pmndrs/react-three-fiber), [wrapper Rapier](https://github.com/pmndrs/react-three-rapier).

## Contenido y herramientas alternativas

| Recurso | Evidencia primaria | Condición y decisión |
|---|---|---|
| Quaternius Universal Base Characters Standard | Archivo publicado con modalidad de precio libre; CC0 en la ficha del autor. [Ficha](https://quaternius.itch.io/universal-base-characters) | Candidato condicionado a inspeccionar contenido, licencia incluida y rig. Source es de pago; no necesario si la importación del exportado permite adaptación. |
| Quaternius Universal Animation Library Standard | Variante gratuita diferenciada de Pro/Source, CC0. [Ficha](https://quaternius.itch.io/universal-animation-library) | Candidato condicionado. No afirmar que todos los clips promocionados estén en Standard o cubran fútbol/fuerza. |
| Kenney Furniture Kit v1.0 | CC0 y opción de continuar sin donación. [Ficha](https://kenney.nl/assets/furniture-kit) | Candidato para silla; archivo interno, escala y geometría pendientes. All-in-1/otras herramientas no están aprobados. |
| MakeHuman/MPFB, alternativa de avatar | Assets base CC0; código MPFB GPL y MakeHuman AGPL. [Política del proyecto](https://static.makehumancommunity.org/about/license.html) | Alternativa pendiente de versión, rig exportado y ropa concreta. No extender CC0 a recursos comunitarios sin revisar. |
| Mixamo, alternativa de animación gratuita no abierta | Adobe declara uso gratuito con Adobe ID y contenido royalty-free para proyectos; excluye IDs Enterprise/Federated y ciertas regiones. [FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html) | Pendiente: condiciones específicas del archivo y distribución de GLB extraíble. La FAQ, actualizada en 2021 y aún publicada, no basta para aprobar contenido concreto. No adoptado ni requerido. |
| Fuentes, voz, audio, texturas y logotipos | Sin archivos seleccionados | Pendientes. Primera ruta: fuente del sistema sin empaquetarla, beeps Web Audio y material propio autorizado; registrar por separado cualquier archivo distribuido. |

CC0 permite reutilización amplia sin tarifa de copyright ni atribución obligatoria; no sustituye revisión de marcas/personas ni prueba de procedencia. [Explicación oficial CC0](https://creativecommons.org/publicdomain/zero/1.0/). No se incorporó contenido a ASSET_LICENSES.md porque aún no existe un archivo descargado que registrar. Véase el [inventario de reutilización](reuse-audit.md).

## Herramientas IA de producción — ampliación 2026-09-26

Véase la [revisión de candidatos y fuentes](ai-production-tools-review.md). Se distingue licencia de herramienta/modelo, derechos de referencias y salidas, exportación, cuota y cómputo. Acceso gratuito para generar no acredita descarga ni uso posterior. Ninguna cuenta, aceptación de términos o recurso nuevo se incorpora con esta auditoría.

La revisión añade una condición relevante para Mixamo: sus términos adicionales restringen usar recursos/salidas para crear, entrenar, probar o mejorar IA/ML. Revisar cada proceso antes de mezclar recursos de ese origen con servicios generativos, especialmente programas que reutilizan cargas para mejorar modelos. Esto no modifica retroactivamente el estado pendiente de los archivos ni prohíbe por inferencia toda edición automatizada.

Los límites concretos e inconsistencias documentales de Meshy, DeepMotion y Cascadeur quedan en el informe enlazado; no se consideran resueltos por el anuncio de un plan Free. TRELLIS.2 ilustra la diferencia entre licencia gratuita y cómputo disponible. Runway no se adopta como vía imprescindible basada en créditos iniciales. La arquitectura del reproductor no cambia.

## Remotion: uso personal elegible; condiciones de crecimiento y elección técnica

**Revisión específica del 2026-09-25:** el uso personal declarado encaja en Free. Se contrastó el [LICENSE de v4.0.524](https://raw.githubusercontent.com/remotion-dev/remotion/v4.0.524/LICENSE.md) como referencia documental fija, sin seleccionar ese paquete para instalar. «Condicionado» describe los cambios de contexto previstos por la política; no identifica una licencia de pago pendiente para el caso actual. La [revisión detallada de Remotion](../research/REMOTION_LICENSE_REVIEW.md) separa elegibilidad, utilidad, alcance y pruebas pendientes.

La automatización está permitida bajo Free. Las tarifas publicadas Company son USD 25 por asiento/mes para Creators y USD 0.01 por render, mínimo USD 100/mes, para Automators. No son gastos aplicables al escenario personal evaluado ni autorizados. [FAQ](https://www.remotion.dev/docs/license/faq).

**Diferencia de vigencia:** /docs/terms muestra «Upcoming document», aplicable a 5.0 y posteriores, y enlaza los términos 4.0. El texto 5.0 agrega personal de partes que operan/poseen conjuntamente el proyecto; no cuenta igual a un receptor que solo recibe el MP4. No presentar esas definiciones futuras como auditoría cerrada de un paquete 4.x. [Términos 5.0](https://www.remotion.dev/docs/terms), [términos 4.0](https://www.remotion.pro/terms-4-0).

**Corrección técnica:** Remotion también ofrece Player e integración con Three/Fiber. Es una alternativa válida para reproducción interactiva, aunque no se adopta ahora. Su utilidad se compara en la revisión detallada; exportar sigue fuera del MVP1. No atribuir automáticamente a Player las comunicaciones de `@remotion/web-renderer`: son paquetes y funciones diferentes. [Telemetría por API](https://www.remotion.dev/docs/telemetry).

**Pendiente antes de adoptar:** versión y paquetes concretos, términos aplicables, transitivas, integración, rendimiento y funcionamiento offline. Para exportación, además contenido, codecs y comportamiento de red. El escenario personal ya está aclarado; solo reevaluar entidad/equipo si cambia. No se necesita una nueva confirmación para continuar esta auditoría.

Si cambia elegibilidad, versión, modo de render, distribución o servicio a terceros: detener esa incorporación, reevaluar y sustituir si exige un pago no autorizado. Mantener fuera del dominio; ruta alternativa de captura local + FFmpeg sujeta a auditoría propia. No se instala Remotion, Editor Starter ni plantillas en MVP1.

## Exportación alternativa y límites de crecimiento

FFmpeg publica LGPL-2.1-o-posterior; componentes opcionales pueden convertir la distribución en GPL. La compilación, bibliotecas y codecs determinan obligaciones; patentes no quedan resueltas por la licencia de software. No se eligió ni descargó binario; no hay aprobación automática de H.264/AAC ni de una compilación nonfree. [Información legal oficial](https://ffmpeg.org/legal.html).

La [matriz de costos](feature-cost-matrix.md) separa la licencia de herramientas de acceso a APIs, nube, contenido y hardware. No se promete alojamiento, capacidad o costos futuros ilimitados.

## Pendientes de incorporación y publicación

Antes de cada instalación autorizada: fijar versión exacta y origen, revisar scripts de instalación, registrar licencia/avisos, resolver transitivas y generar lockfile; verificar el artefacto realmente resuelto antes de aceptarlo. Antes de cada asset autorizado: origen, archivo, hash, licencia, variante, modificaciones y revisión técnica/humana. Un enlace a main no reemplaza ese registro.

Existe LICENSE MIT previo en la raíz Fut360. Se conserva sin cambios; su intención y alcance deben aclararse antes de publicar. No se eligió licencia pública para el código del usuario ni se publicó nada.

## Complemento de cierre de 01 — 2026-09-27

La [preparación de 02](../plans/phase02-ready.md) registra versiones candidatas concretas y enlaces a sus metadatos npm: MIT declarada para gestor, interfaz, build, validación y pruebas; Apache-2.0 para TypeScript. Es consulta de metadatos, no auditoría de archivos instalados. LICENSE/NOTICE de cada artefacto, transitivas, integridad y scripts siguen pendientes en la incorporación autorizada; no se aprobó todo un árbol inexistente ni se introdujo un pago.

Se reconsultaron las fichas del autor de Quaternius: [selección 3D](../3d/ASSET_SELECTION.md) distingue Standard de Source/Pro, costo publicado y editabilidad por demostrar. La vía propuesta conserva costo cero usando el contenido gratuito compatible, sin exigir las fuentes .blend de pago. No se descargó ningún archivo; la licencia anunciada CC0 no sustituye el registro del archivo concreto. Las demás filas de la auditoría conservan sus fechas y límites anteriores.

Limitaciones de consulta: la URL /docs/license/pricing de Remotion no se recuperó en la auditoría inicial; los importes anteriores proceden de la FAQ oficial, reconsultada el 2026-09-25. La página directa de Blender y su manual no se recuperaron en el repaso, pero sí su contenido indexado oficial. El HTTP 402 devuelto por la herramienta al abrir blender.org es un fallo de acceso de esta consulta, no evidencia de una licencia de pago. Reconsultados también textos Three/Rapier, CC0, fichas Quaternius/Kenney, FAQ Adobe, política MakeHuman/MPFB y documentos Remotion/FFmpeg. No se consultaron contratos privados ni se inspeccionaron archivos descargados. El resto del inventario conserva la evidencia inicial del 2026-09-24, sin afirmar una comprobación nueva de cada paquete.
