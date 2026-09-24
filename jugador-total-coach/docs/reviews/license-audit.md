# Auditoría de licencias y acceso — fase 00

Consulta: 2026-09-24. Política aplicada: ADR 0008. Software gratuito abierto o no abierto puede ser admisible. Cuenta/tokens de Codex quedan fuera del presupuesto; la aplicación final no los necesita.

## Alcance de la evidencia

**Verificado:** textos primarios consultados y metadatos publicados que se enlazan abajo. No se instalaron paquetes ni se descargaron assets. Los enlaces a main/master/dev son revisiones documentales móviles, no versiones fijadas. Salvo los tags expresamente indicados, versión exacta, hash y árbol transitivo siguen **pendientes**.

**Supuesto:** uso personal local de un solo titular, sin servicio público de render ni colaboración empresarial. El número de usuarios del entrenamiento no permite deducir el tamaño de la entidad que usaría Remotion.

**Decisiones:** «admisible como candidato» significa que la licencia consultada no impone pago por el escenario evaluado; no autoriza instalación ni aprueba un artefacto desconocido. «Condicionado» identifica restricciones conocidas. Todo binario/asset/transitiva sin comprobar queda pendiente para incorporación.

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
| Blender; binario local no confirmado | GPL; fuente oficial indica GPL-2.0-o-posterior como licencia por defecto | Autoría comercial sin pago; la licencia del programa no impone GPL al arte creado. Derechos de assets y addons se revisan aparte. [Licencia oficial, consultada mediante resultado indexado](https://www.blender.org/about/license/) | Admisible como herramienta candidata; versión/distribución/addons pendientes. |
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

## Remotion: candidato condicionado, posterior al MVP1

**Verificado:** el LICENSE publicado permite creación comercial o personal y modificación para el uso autorizado a individuos y entidades elegibles; excluye revender o relicenciar un derivado de Remotion como producto. El mismo archivo avisa de un cambio en 5.0. No se seleccionó versión. [LICENSE](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md).

La FAQ permite Free a individuos y equipos de hasta tres personas; no reduce funcionalidades y permite automatización al elegible. Anuncia Company Creators a USD 25 por asiento/mes, y Automators a USD 0.01 por render con mínimo de USD 100/mes. Son condiciones publicadas, no un gasto autorizado. Añadir ejercicios no dispara por sí solo el pago. [FAQ](https://www.remotion.dev/docs/license/faq).

**Diferencia de vigencia:** /docs/terms muestra «Upcoming document», aplicable a 5.0 y posteriores, y enlaza los términos 4.0. El texto 5.0 agrega personal de partes que operan/poseen conjuntamente el proyecto; no cuenta igual a un receptor que solo recibe el MP4. No presentar esas definiciones futuras como auditoría cerrada de un paquete 4.x. [Términos 5.0](https://www.remotion.dev/docs/terms), [términos 4.0](https://www.remotion.pro/terms-4-0).

**Pendiente antes de adoptar:** confirmar entidad/equipo y colaboraciones, paquete/tag y texto aplicable, operación offline y telemetría, contenido, codecs y distribución. La FAQ distingue telemetría obligatoria del render en cliente de la situación del render en servidor/local; no asumir que cualquier API «local» funciona sin comunicaciones. [FAQ](https://www.remotion.dev/docs/license/faq).

Si cambia elegibilidad, versión, modo de render, distribución o servicio a terceros: detener esa incorporación, reevaluar y sustituir si exige un pago no autorizado. Mantener fuera del dominio; ruta alternativa de captura local + FFmpeg sujeta a auditoría propia. No se instala Remotion, Editor Starter ni plantillas en MVP1.

## Exportación alternativa y límites de crecimiento

FFmpeg publica LGPL-2.1-o-posterior; componentes opcionales pueden convertir la distribución en GPL. La compilación, bibliotecas y codecs determinan obligaciones; patentes no quedan resueltas por la licencia de software. No se eligió ni descargó binario; no hay aprobación automática de H.264/AAC ni de una compilación nonfree. [Información legal oficial](https://ffmpeg.org/legal.html).

La [matriz de costos](feature-cost-matrix.md) separa la licencia de herramientas de acceso a APIs, nube, contenido y hardware. No se promete alojamiento, capacidad o costos futuros ilimitados.

## Pendientes de incorporación y publicación

Antes de cada instalación autorizada: fijar versión exacta y origen, revisar scripts de instalación, registrar licencia/avisos, resolver transitivas y generar lockfile; verificar el artefacto realmente resuelto antes de aceptarlo. Antes de cada asset autorizado: origen, archivo, hash, licencia, variante, modificaciones y revisión técnica/humana. Un enlace a main no reemplaza ese registro.

Existe LICENSE MIT previo en la raíz Fut360. Se conserva sin cambios; su intención y alcance deben aclararse antes de publicar. No se eligió licencia pública para el código del usuario ni se publicó nada.

Limitaciones de consulta: la URL /docs/license/pricing de Remotion no se recuperó; los importes anteriores proceden de la FAQ oficial. La página directa de Blender no se recuperó, pero sí su contenido indexado en su dominio. No se consultaron contratos privados de proveedores ni términos de APIs no seleccionadas.
