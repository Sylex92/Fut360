# Dependencias incorporadas en fase 02

Fecha: 2026-09-28. Autorización del usuario: código base y dependencias gratuitas revisadas, solo dentro del proyecto. Contexto: construcción y uso personal/local, sin distribución pública. La aceptación de este contexto no garantiza futuras versiones o usos ilimitados.

## Resultado y alcance de la comprobación

Se incorporó la combinación de versiones de [phase02-ready](../plans/phase02-ready.md), sin cambiar las versiones directas propuestas. Lockfile principal: 166 pares nombre/versión resueltos, 137 distintos instalados en Windows y 141 contextos de instalación por resolución de peers. Los otros 29 son opciones de plataforma no instaladas. pnpm 11.19.0 se guarda aparte en .tooling, con su propio package-lock.json.

[Inventario por paquete](phase02-dependencies.json): nombre, versión, licencia declarada, procedencia, integridad npm y SHA-256 de archivos de licencia/aviso o evidencia equivalente. No es una auditoría del código fuente de todos los paquetes ni de cada componente enlazado en binarios. Se conservan las declaraciones y avisos de sus distribuidores, incluidos avisos de terceros empaquetados.

Se consultaron metadatos de todo el lockfile antes de descargar sus paquetes: origen registry.npmjs.org, dist.integrity presente y ninguna versión marcada deprecated. Tras descargar, las 137 declaraciones de licencia coinciden con sus metadatos. Inspección de archivos instalados, pnpm licenses list --json y avisos complementarios; no se aprueba una actualización por heredar esta revisión.

## Licencias y condiciones

| Licencia declarada | Versiones instaladas | Tratamiento para este contexto |
|---|---:|---|
| MIT | 104 | Conservar copyright/licencia; sin tarifa obligatoria por este uso |
| Apache-2.0 | 15 | Conservar licencia y NOTICE cuando exista; marcar modificaciones si las hubiera. No se modificaron dependencias |
| BSD-2-Clause | 6 | Conservar avisos/condiciones en redistribución |
| ISC | 6 | Conservar copyright y permiso |
| BSD-3-Clause | 3 | Conservar avisos y condición de no aval publicitario |
| MPL-2.0 | 2 | Lightning CSS y binario Windows: uso como herramienta local. Una distribución del componente requiere revisar obligaciones sobre fuentes/avisos |
| BlueOak-1.0.0 | 1 | minimatch: conservar términos y asegurar aviso al distribuir copias |

Los dos últimos no se descartaron por ser distintos de MIT: se revisaron sus condiciones. Fuentes: [MPL FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/), [Blue Oak 1.0.0](https://blueoakcouncil.org/license/1.0.0), textos empaquetados y metadatos versionados del inventario. No se introduce una compra, cuenta o cuota para construir/usar esta base.

Cinco paquetes no traen LICENSE separado. Esrecurse incluye BSD en README; imurmurhash incluye MIT completo en README; natural-compare declara MIT en cabecera/README con copyright y referencia del autor. @humanfs/types declara Apache 2.0 en README/metadata; la consulta de LICENSE al commit publicado devolvió 404 y se registra ese límite, sin inventar un archivo. @rolldown/binding-win32-x64-msvc declara MIT; se contrastó con LICENSE del mismo upstream v1.2.11 y el wrapper, sin afirmar que el binario incluya un LICENSE que no trae. Esta evidencia permite el uso local documentado; antes de redistribuir herramientas/binarios, completar el paquete de avisos/fuentes aplicable.

La aplicación incorpora ocho dependencias de runtime: React, React DOM, scheduler, Ajv 8, fast-deep-equal, fast-uri, json-schema-traverse 1 y require-from-string. Sus textos de licencia se copiaron desde la instalación a [THIRD_PARTY_NOTICES](../../apps/coach-pwa/public/THIRD_PARTY_NOTICES.txt), que acompaña el build. Ajv 6 y json-schema-traverse 0.4 también existen, pero pertenecen al análisis de código y no al runtime de la pantalla.

## Scripts, seguridad y límites

- ignoreScripts=true durante resolución, instalación y verificación. El único script de instalación declarado encontrado en el lockfile fue fsevents/node-gyp, destinado a macOS y no instalado aquí. Build/tests de los paquetes propios no necesitan habilitar scripts de dependencias.
- pnpm audit --json informó cero avisos en todas las severidades para 166 versiones resueltas en esta consulta. Es una fotografía del registro, no prueba de ausencia de vulnerabilidades desconocidas. No se subió código ni información personal; la consulta usa nombres/versiones.
- pnpm local verificado 11.19.0; la licencia del artefacto coincide en MIT con upstream, aunque sus años de copyright impresos difieren. Se conserva el texto del archivo recibido, no se reemplaza por el del sitio.
- Solo se consultó/instaló software para 02. Sin Playwright instalado, navegador descargado, Blender, Remotion, modelos, avatar, cuentas o servicios activados.
- Cambiar de versión, publicar, redistribuir herramientas/binarios o añadir funciones/proveedores requiere revisar el costo y las obligaciones de ese cambio. No se eligió una licencia nueva para el código propio.

Los informes JSON temporales completos permanecen en .cache/review, excluida de Git. El inventario duradero conserva resultados y evidencias pertinentes sin incluir configuración personal ni credenciales.
