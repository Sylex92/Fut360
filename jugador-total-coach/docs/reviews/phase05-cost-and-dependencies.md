# Fase 05: costo, dependencias y reutilización

Revisión: 2026-09-30, previa a instalación. Función autorizada: laboratorio de contactos y comparación con clip guiado. Beneficio: comprobar el mínimo de física necesario sin confundir rebote con enseñanza correcta.

## Decisión y derechos

Admisible para el uso local actual. No hay cuentas, APIs, cuotas, pagos iniciales/recurrentes ni límites de usuarios, ingresos o minutos en las licencias seleccionadas. No se promete infraestructura gratuita ilimitada: soporte contratado, distribución con otros recursos, hardware y servicios futuros requieren revisión propia. No se activan.

| Dependencia exacta | Licencia verificada | Motivo |
|---|---|---|
| @react-three/rapier 2.2.0 | MIT, LICENSE del gitHead publicado | Integración oficial React/Fiber, paso fijo, interpolación, depuración |
| @dimforge/rapier3d-compat 0.19.2 | Apache-2.0 | Versión fijada por el wrapper; solver WASM local |
| three-stdlib 2.36.1 | MIT | Transitiva del wrapper |
| suspend-react 0.1.3 | MIT | Transitiva ya presente |
| fflate 0.6.10 | MIT | Transitiva de stdlib |
| draco3d 1.5.7 | Apache-2.0 | Transitiva de stdlib; no se usa compresión Draco en estos assets |
| potpack 1.0.2 | ISC | Transitiva de stdlib |
| @types/webxr 0.5.24, @types/draco3d 1.4.10, @types/offscreencanvas 2019.7.3 | MIT | Tipos transitivos |

Fuentes: metadatos de cada versión del [registro npm oficial](https://registry.npmjs.org/@react-three%2Frapier/2.2.0), [LICENSE MIT en el commit publicado](https://github.com/pmndrs/react-three-rapier/blob/ae5c3fede5ca489fd7eaa8271e9d9c5eabc88e98/LICENSE), [Rapier 0.19.2](https://registry.npmjs.org/@dimforge%2Frapier3d-compat/0.19.2). Se conservan integridades en lockfile e inventario. El paquete del wrapper omite el campo license: se resuelve con su fuente exacta, no por suposición. Los avisos internos se comprobarán tras instalación, antes de integrar.

Peers compatibles: React 19.3.0, Fiber 9.8.1 y Three 0.186.1 existentes. No se adopta Rapier 0.21.0 latest porque el wrapper especifica 0.19.2. Rapier 0.12.0 de @types/three permanece solo como dependencia de desarrollo.

MIT/ISC requieren conservar copyright/licencia; Apache 2.0 requiere licencia y avisos aplicables, marcar modificaciones si las hubiera y respetar sus condiciones de patentes/marcas. Permiten modificación, automatización y distribución, incluida comercial, con esas obligaciones; no se cambia la licencia del código del usuario ni se publica. Instalación con scripts desactivados y caché/configuración locales. Los scripts build/test/prepack declarados no se ejecutarán.

## Reutilizar → adaptar → crear

- Reutilizar Rapier y wrapper; alternativa sin costo: Rapier directo, con mayor integración manual. No sustituirlos por solver propio ni por servicio cloud.
- Reutilizar Quaternius CC0, rig de 65 huesos, ropa y corrección de brazos/hombros ya auditados. Crear solo poses/clip de interior-interior y balón geométrico sencillo. No descargar otro avatar ni entrenar modelos.
- Reutilizar Blender 4.5.14 portable y su IK/bake/exportador glTF. Su GPL no impone GPL al recurso de salida creado; se preserva atribución/procedencia CC0 y autoría de modificaciones. No redistribuir la herramienta en la app.
- Mantener domain y session-engine sin dependencia física. Añadir physics-lab utilizado realmente y panel separado; cambiar de modo desmonta escena/mundo. No guardar datos de entrenamiento ni conectar servidores.
- El GLB y WASM se empaquetan en build local; no CDN. Si el recurso no carga, se detiene la prueba y se informa; el ejercicio previo sigue accesible.

Rendimiento, colisiones y calidad visual: pendientes de las pruebas de esta fase. Ninguna licencia acredita técnica deportiva. La aceptación móvil de 04 no se transfiere automáticamente a 05.


## Resultado de incorporación

Instalación local completada con pnpm 11.19.0 y scripts desactivados; lockfile actualizado con transitivas fijadas. Diez versiones revisadas contra el contenido instalado; ocho paquetes nuevos. Todas con avisos conservados en docs/licenses/phase05 y THIRD_PARTY_NOTICES del build. Rapier compat y Draco también omiten LICENSE en npm: se obtuvo desde [commit oficial de Rapier](https://github.com/dimforge/rapier.js/blob/f072e6efa75f4f61a290bd0b58b61c443685ec01/LICENSE) y [etiqueta oficial Draco 1.5.7](https://github.com/google/draco/blob/1.5.7/LICENSE). No se asumió que la ausencia equivalía a permiso. Inventario/hashes en phase05-dependencies.json; es revisión de metadatos/avisos del grafo JavaScript/WASM publicado, no auditoría de seguridad de todo su código fuente.

Build y recorrido normal usan recursos del origen local, sin CDN. Rapier compat incorpora su WASM; hashes del archivo de la versión en phase05-asset-evidence.json. Resultado técnico, tamaño, avisos y muestra de rendimiento en phase05-contact-review.md. Aceptación móvil del nuevo caso pendiente.
