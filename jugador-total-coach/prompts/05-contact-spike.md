# Prompt 05 — Prueba mínima de contactos sin reinventar física

Ejecutar solo cuando estén aprobados el diseño de costo cero y crecimiento y el bootstrap. Lee PHYSICS_AND_ANIMATION.md.

Reutiliza Rapier y react-three-rapier con versiones compatibles auditadas.

Crea un laboratorio pequeño: suelo fijo, balón esférico dinámico y pie/collider cinemático. Primero puede ser una forma de debug; después sigue un hueso del avatar ya seleccionado. Configura fricción, restitución y paso fijo con APIs existentes.

Incluye debug de colliders, pausa/reset y caso de contacto lento y rápido. Prueba distintas tasas de render. No construyas ragdoll, solver, control de drible, aerodinámica o simulación de partido.

Después compara con un interior-interior guiado por clip sincronizado. Declara qué objeto controla AnimationMixer y cuál Rapier. No escribir a la vez desde los dos sistemas sobre el balón.

Entrega evidencia, versiones/configuración, limitaciones y decisión documentada del mínimo necesario para tutorial. No marques técnica humana validada. No expandas el scope al resto de la aplicación.


## Cierre de fase
Leer PROJECT_STATUS.md y comprobar que la fase anterior fue aceptada. Ejecutar únicamente esta fase. Antes de instalar o descargar, presentar necesidad, licencia, versión y permiso requerido. Al terminar, actualizar el estado con pruebas realmente ejecutadas y pendientes. No continuar automáticamente ni publicar/subir archivos.
