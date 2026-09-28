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

Blender sigue desinstalado según el usuario. Su licencia y las del contenido son asuntos distintos: que la herramienta sea gratuita no concede derechos sobre cualquier modelo o complemento. No hay plugins adicionales elegidos. La [auditoría de licencias](../reviews/license-audit.md) y el [diagnóstico](../reviews/environment-report.md) registran evidencias y límites; comprobar versión y GPU antes de preparar la herramienta, sin actualizar drivers ni configuración global implícitamente.

## Almacenamiento

Conservar fuente editable/importable legalmente accesible, clip GLB y manifiesto. Una fuente original de pago no es requisito aceptable. No renombrar todo el rig si un mapping resuelve la integración. Las animaciones específicas que falten se elaboran/adaptan con el rig elegido.

## Estados

`draft` -> `technical-reviewed` -> `coaching-reviewed`, con evidencias ligadas a versión/hash, ficha y alcance del revisor. El motor físico o la exportación exitosa no otorgan el último estado. El usuario está asignado a la revisión humana; no se registra como realizada ni profesional por esa asignación. Si faltan evidencias, la vista sigue identificada como demostración en revisión y no se libera como entrenamiento aprobado.

## Entornos

MVP: suelo y referencias neutras 2×2, props simples reutilizados. Futuro: canchas de fut 5/7/11 como recursos separados. El entorno no define la autoridad del movimiento ni certifica realismo.
