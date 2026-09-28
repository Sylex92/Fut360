# Prompt 04 — Rebanada vertical 3D de un ejercicio

Implementa una rebanada de extremo a extremo para un solo ejercicio de 60 segundos.

Debe incluir:
- escena 2×2;
- humanoide gratuito con licencia compatible, ya riggeado y aprobado para prototipo; primitivas solo como fallback técnico draft;
- un clip GLB con reproducción cíclica o finita según ficha, sin imponer bucle a toda la ventana;
- cámara frontal, lateral y 3/4;
- nombre del ejercicio;
- cronómetro;
- pausar/continuar;
- cambio de cámara sin reiniciar;
- inspección lenta estando pausado y repetición adicional según contrato del motor;
- vista previa automática y ampliación +30 s/+1 min con un toque, ejemplo independiente y autoinicio al acabar la cuenta; sin confirmación posterior. Probar Pausar todo y clips finitos con retorno/separación revisados;
- fallback si falla el asset;
- prueba de la máquina de estados;
- prueba E2E del flujo.

No intentes crear todavía la hora completa.
No añadas voz, persistencia ni diseño final.

Entrega evidencia visual y lista de limitaciones.

## Revisión de alcance

Reutilizar GLTFLoader/AnimationMixer, no hacer reproductor esquelético propio. Registrar licencia del asset concreto. Antes de ampliar a toda la hora, realizar `05-contact-spike.md` y revisar un clip guiado con balón. Los placeholders no cuentan como entrenamiento final.

Usar docs/plans/first-visible-exercise-ready.md: primer candidato hip-hinge, cámara lateral inicial. Los 60 s son un caso técnico declarado, no una dosis continua automática. Resolver ficha/clip/mapping antes de presentar práctica guiada. Preparar Blender aquí solo si resulta necesario y está autorizado; la fase 06 sistematiza el pipeline.


## Cierre de fase
Leer PROJECT_STATUS.md y comprobar que la fase anterior fue aceptada. Ejecutar únicamente esta fase. Antes de instalar o descargar, presentar necesidad, licencia, versión y permiso requerido. Al terminar, actualizar el estado con pruebas realmente ejecutadas y pendientes. No continuar automáticamente ni publicar/subir archivos.

La fase 03 ya entrega el motor; reutilízalo. Tras revisar el ejercicio de 60 segundos, comprobar una sesión corta de cinco minutos, sin sustituir la meta posterior de una hora. Ver un GLB cargado no basta: debe mostrar un movimiento comprensible.
