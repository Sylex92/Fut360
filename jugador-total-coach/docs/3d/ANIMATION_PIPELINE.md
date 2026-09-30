# Pipeline de animación: reutilizar y adaptar

1. Auditar candidato humanoide y clips: gratuidad, licencia, rig, editabilidad.
2. Adoptar un rig existente y crear solo un mapa semántico de huesos.
3. Cuando la adaptación lo necesite, importar en Blender y editar con sus herramientas existentes, después de preparar una versión concreta autorizada. No crear rig/editor propios ni exigir la variante Source de pago.
4. Exportar con las herramientas glTF existentes; no escribir un exportador glTF propio.
5. Crear un manifiesto de proyecto (ID, versión, cues, sides, bounds, origen, revisión).
6. Ejecutar un validador glTF existente, tras revisar su licencia, y nuestras reglas de catálogo.
7. Probar Three.js/AnimationMixer, cámaras, pausa y sincronización del balón.
8. Revisar vista lateral, frontal y 3/4; conservar evidencia y marcar estado correctamente.
9. Incorporar los archivos aprobados al proyecto local, sin CDNs. Esto no autoriza publicación externa.

## Primera prueba completa

Orden: hip-hinge sin carga en 04, después interior-interior para comprobar contacto guiado con balón. Rapier tiene su laboratorio separado en 05: suelo, pie cinemático y balón dinámico. No es una dependencia de la enseñanza guiada. No producir todo el catálogo antes de validar el primer gesto. [Entrada y aceptación de 04](../plans/first-visible-exercise-ready.md).

## Criterios del recorrido de autoría

1. Seleccionar el archivo Standard candidato según [ASSET_SELECTION](ASSET_SELECTION.md); conservar URL, fecha, hash y licencia interna. Comprobar que contiene un rig utilizable y materiales portables antes de adoptar sus convenciones.
2. Contrastar el recurso con la ficha: inicio, recorrido, apoyos, final, lateralidad y dosis visual. Inventariar cada necesidad como reutilizable, adaptable o faltante. Un clip de prueba del rig no cuenta como ejercicio terminado.
3. Guardar una fuente importable/editable y exportar un GLB de prueba. Comprobar escala, orientación, jerarquía, pesos, pies, desplazamiento de raíz y límites 2×2 durante todo el recorrido. No imponer un cambio masivo de nombres si un mapping basta.
4. Revisar el clip finito de práctica y su presentación previa por separado. La vista previa puede repetir con retorno/separación legibles; no declarar cíclico un gesto finito ni añadir repeticiones de fuerza para llenar el reloj.
5. Conectar la pose al tiempo del motor. Durante preparación, +30 s/+1 min prolongan el ejemplo y mantienen el inicio automático. Pausar todo congela ambos; cámaras y revisión lenta conservan el punto de práctica. Probarlo, no deducir sincronía de que el GLB se vea bien.
6. Registrar errores de representación y corregir el recurso conservando el objetivo del ejercicio adecuado. Contactos ilustrados, trayectorias o video complementario requieren explicación y derechos propios; no convierten la escena en una predicción física exacta.

Al cerrar 01, Blender estaba desinstalado según el usuario. En 04 autorizó expresamente Blender 4.5.14 LTS portable; se preparó dentro del proyecto y se probaron importación, autoría, exportación y render CPU. Su licencia y las del contenido son asuntos distintos: que la herramienta sea gratuita no concede derechos sobre cualquier modelo o complemento. No hay plugins adicionales elegidos ni drivers/configuración global modificados. [Informe de 04](../reviews/phase04-vertical-slice-review.md); GUI/GPU de Blender y rendimiento WebGL aún pendientes.

## Almacenamiento

Conservar fuente editable/importable legalmente accesible, clip GLB y manifiesto. Una fuente original de pago no es requisito aceptable. No renombrar todo el rig si un mapping resuelve la integración. Las animaciones específicas que falten se elaboran/adaptan con el rig elegido.

## Estados

`draft` -> `technical-reviewed` -> `coaching-reviewed`, con evidencias ligadas a versión/hash, ficha y alcance del revisor. El motor físico o la exportación exitosa no otorgan el último estado. Desde 2026-09-30, [ADR 0012](../architecture/adr/0012-documentary-training-review.md) permite fundamentación documental sin contratación externa obligatoria. Registrar por separado esa revisión, comprobaciones técnicas y claridad observada por el usuario; ninguna se etiqueta como evaluación profesional. Los recursos nuevos de 06 conservan draft hasta la revisión humana de su representación. Dudas concretas no resueltas permanecen vinculadas al recurso afectado.

## Recorrido disponible desde 06

Desde la raíz jugador-total-coach, con las herramientas ya preparadas:

```powershell
node tools/blender.mjs tools/build_glute_bridge.py
node tools/blender.mjs tools/build_glute_bridge.py dead-bug
node tools/blender.mjs tools/build_standing_movements.py
node tools/blender.mjs tools/build_ball_variants.py
node tools/review_movements.mjs
node tools/review_ball_contacts.mjs
node tools/pnpm.mjs test
node tools/pnpm.mjs build
```

Los cuatro primeros comandos regeneran fuentes/GLB del grupo correspondiente; no son lecturas. Revisar diferencias antes de aceptar una reexportación. `review_movements.mjs` usa el validador Khronos y skinning de Three a 30 Hz, incluye balón, apoyos, continuidad, inicio/final y límites del área. Crea manifiesto para un recurso nuevo; no actualiza hashes existentes por defecto. Solo después de revisar cambios, `--record-draft` registra hashes/bounds de derivados nuevos en draft; excluye bisagra y campanitas ya aceptadas. El informe conserva hash de cada fuente.

`review_ball_contacts.mjs` comprueba distancias entre esfera y triángulos deformados de las cuatro variantes nuevas a 30 Hz. Es una consulta geométrica de Three; no un solver. Tolerancias de inspección: no intersección mayor de 2 mm y separación de contacto menor de 10 mm. Estos umbrales no certifican técnica deportiva ni precisión física continua entre muestras.

Biblioteca: quince ejemplos, once patrones, variantes de lado explícitas; [catálogo](../../assets/phase06-catalog.json), [fundamento interno](../training/PHASE06_DOCUMENTARY_REVIEW.md), [informe](../reviews/phase06-pipeline-review.md). Cada reproducción es finita; volver al inicio es un control de revisión, no una transición enseñada. Respiración reutiliza una postura quieta. El empuje con silla espera sus condiciones reales. La secuencia completa de entrenamiento y sus transiciones se resolverán en 07, aún no autorizada.

## Entornos

MVP: suelo y referencias neutras 2×2, props simples reutilizados. Futuro: canchas de fut 5/7/11 como recursos separados. El entorno no define la autoridad del movimiento ni certifica realismo.
