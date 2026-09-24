# Pipeline de animación: reutilizar y adaptar

1. Auditar candidato humanoide y clips: gratuidad, licencia, rig, editabilidad.
2. Adoptar un rig existente y crear solo un mapa semántico de huesos.
3. Importar en Blender y adaptar clips con herramientas de autoría existentes.
4. Exportar con las herramientas glTF existentes; no escribir un exportador glTF propio.
5. Crear un manifiesto de proyecto (ID, versión, cues, sides, bounds, origen, revisión).
6. Ejecutar un validador glTF existente, tras revisar su licencia, y nuestras reglas de catálogo.
7. Probar Three.js/AnimationMixer, cámaras, pausa y sincronización del balón.
8. Revisar vista frontal/lateral; conservar evidencia y marcar estado correctamente.
9. Publicar los archivos aprobados localmente, sin CDNs.

## Primera prueba completa

Un ejercicio de fuerza y un interior-interior sincronizado. En paralelo, un laboratorio mínimo con Rapier: suelo, pie cinemático y balón dinámico. No crear una hora de física libre ni esperar a completar todo el arte para validar el reproductor.

## Almacenamiento

Conservar fuente editable/importable legalmente accesible, clip GLB y manifiesto. Una fuente original de pago no es requisito aceptable. No renombrar todo el rig si un mapping resuelve la integración. Las animaciones específicas que falten se elaboran/adaptan con el rig elegido.

## Estados

`draft` -> `technical-reviewed` -> `coaching-reviewed`, con evidencias. El motor físico o la exportación exitosa no otorgan el último estado.

## Entornos

MVP: suelo y referencias neutras 2×2, props simples reutilizados. Futuro: canchas de fut 5/7/11 como recursos separados. El entorno no define la autoridad del movimiento ni certifica realismo.
