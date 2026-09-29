# Dependencias, licencias y costo — fase 04

Revisión 2026-09-28/29. Complementa el [inventario de 02](phase02-dependencies.md), sin sustituir sus evidencias. [20 incorporaciones exactas](phase04-dependencies.json), versiones fijadas en lockfile y metadatos oficiales leídos antes de instalar. Instalación local con scripts desactivados y peers estrictos; React/DOM 19.3.0 existentes satisfacen el rango de Fiber 9.8.1. React/DOM se enlazan también como dependencias de desarrollo del paquete privado viewer-3d para resolver el build; no se añadió otra versión.

| Componente directo | Versión | Licencia/evidencia | Necesidad |
|---|---|---|---|
| Three.js | 0.186.1 | MIT, aviso dentro del paquete | GLTFLoader, AnimationMixer, escena/cámaras; no reproductor esquelético propio |
| React Three Fiber | 9.8.1 | MIT en metadatos; el paquete omite LICENSE. Se conservó el [texto oficial](../licenses/react-three-fiber-9.8.1-MIT.txt) de su npm gitHead `53ec672ac4a7189711766b87ece18889abbb32d4` | Integración del render con React existente |
| @types/three | 0.186.0 | MIT, archivo local | Tipos de desarrollo |
| gltf-validator | 2.0.0-dev.3.10 | Apache-2.0, archivo local | Validador de Khronos para GLB; solo desarrollo |
| Blender portable | 4.5.14 LTS Windows x64 | GPL-3.0-or-later; distribuidor oficial, hash verificado | Autoría, IK/bake, importación y exportación del único gesto faltante |

Las 20 incorporaciones npm: @babel/runtime 7.29.7, @dimforge/rapier3d-compat 0.12.0, @react-three/fiber 9.8.1, @tweenjs/tween.js 23.1.3, @types/react-reconciler 0.28.9, @types/stats.js 0.17.4, @types/three 0.186.0, @types/webxr 0.5.24, base64-js 1.5.1, buffer 6.0.3, fflate 0.8.3, gltf-validator 2.0.0-dev.3.10, ieee754 1.2.1, its-fine 2.1.1, meshoptimizer 1.1.1, react-use-measure 2.1.7, suspend-react 0.1.3, three 0.186.1, use-sync-external-store 1.7.0 y zustand 5.0.15.

MIT salvo Rapier/validador (Apache-2.0) e ieee754 (BSD-3-Clause). Ninguno de estos paquetes declara preinstall/install/postinstall. Trece aparecen en el grafo de dependencias de producción, incluidos dos paquetes de tipos; pertenecer al grafo no significa que todo su código se incluya en el bundle. El resto es desarrollo. Avisos de esas trece incorporaciones más Quaternius añadidos a `apps/coach-pwa/public/THIRD_PARTY_NOTICES.txt`, conservando los de 02. El build copia el archivo.

`@dimforge/rapier3d-compat` llega como dependencia transitiva **de desarrollo** de @types/three. Está instalado, pero no se importa ni se empaqueta como laboratorio de física; no se ejecutó 05. `meshoptimizer` y fflate aparecen por tipos/herramientas, no porque este GLB necesite decodificadores descargados de una CDN. No se añadieron drei, servicios cloud ni generadores de IA.

Consulta `pnpm audit --json` del 2026-09-29: cero avisos conocidos, 186 dependencias resueltas incluyendo variantes opcionales. No certifica ausencia de vulnerabilidades ni sustituye análisis del código. Los hashes de avisos/metadata se conservan en el JSON; integridades de paquetes en lockfile. No se ejecutaron scripts de terceros para instalar.

## Revisión de funcionalidad según FEATURE_COST_REVIEW

- **Función/beneficio:** observar un gesto 3D y comprobar su sincronización en 04. Uso local personal, con ampliación futura del catálogo.
- **Derechos y costo actual:** software MIT/Apache/BSD y Blender GPL sin tarifa de ejecución para este flujo; [base Standard CC0](../../ASSET_LICENSES.md) descargada sin compra. Sin cuenta, API, clave, cuotas de renders/minutos o servicio de suscripción necesarios para ejecutar la app. Internet se necesitó para preparar herramientas/paquetes, no para solicitar el avatar durante la ejecución local.
- **Contenido y publicación:** licencia de Blender y derechos de lo producido son distintos. La herramienta no impone GPL a las imágenes/GLB creados por su mero uso. Revisar obligaciones de scripts que usan bpy antes de publicar; no se eligió una licencia pública nueva para las aportaciones del proyecto. La distribución de herramientas/binarios completos tendría obligaciones distintas a servir el GLB. Blender y sus ZIP no se incluyen en el build ni en Git.
- **Límites/disparadores:** más ejercicios requieren autoría y revisión; Base Standard no trae todos los cuerpos y Animation Standard no cubre este gesto. Pro/Source y complementos de pago no son requisitos. Nuevos assets, IA, video, servicios, publicación o cambios de versión necesitan su propia revisión. Capacidad de hardware, energía, almacenamiento y trabajo humano no son ilimitados.
- **Sustitución:** mantener glTF/GLB, fuente importable, .blend, mapping y manifiesto permite corregir/cambiar recurso. Migrarlo o adaptar otra anatomía exige trabajo; no se promete costo de trabajo cero. No hay un servicio remoto cuya caída impida cargar el recurso local ya conservado.
- **Datos/módulos:** app/composición y viewer-3d; sin backend, datos personales, telemetría ni persistencia. Falla del recurso bloquea la prueba y preserva su cursor en memoria.
- **Rendimiento:** tamaño final y CPU de autoría comprobados; WebGL en PC/móvil pendiente. No se propone compra de hardware.
- **Decisión:** admisible para construir y ejecutar esta demostración local con los avisos conservados. La calidad deportiva y la aceptación del flujo siguen pendientes; admisibilidad de licencia no las concede.

Fuentes primarias: [Three npm](https://registry.npmjs.org/three/0.186.1), [Fiber npm](https://registry.npmjs.org/@react-three%2ffiber/9.8.1), [LICENSE de la revisión exacta](https://raw.githubusercontent.com/pmndrs/react-three-fiber/53ec672ac4a7189711766b87ece18889abbb32d4/LICENSE), [tipos](https://registry.npmjs.org/@types%2fthree/0.186.0), [validador](https://registry.npmjs.org/gltf-validator/2.0.0-dev.3.10), [licencia Blender](https://www.blender.org/about/license/), [distribuidor Blender 4.5](https://download.blender.org/release/Blender4.5/), [directorio portable](https://docs.blender.org/manual/en/4.5/advanced/blender_directory_layout.html). Los términos de Remotion conservan su revisión independiente; no se instaló.
