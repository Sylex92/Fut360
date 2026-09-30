# ADR 0011 — Resultado de la prueba de contactos

Fecha: 2026-09-30. Estado: aceptado como decisión técnica dentro de fase 05; no aprobación deportiva. Complementa ADR 0006 y PHYSICS_AND_ANIMATION.

El caso pie cinemático–balón dinámico–suelo funciona con Rapier 0.19.2/react-three-rapier 2.2.0 y paso fijo 1/60 s. Los casos lentos/rápidos conservan resultados al variar la agrupación de pasos y el scheduler de render en el entorno comprobado. Sin embargo, el balón simulado deriva respecto del patrón interior-interior que se quiere explicar. Un contacto numérico correcto no determina la calidad del gesto.

Decidimos conservar **clip sincronizado con autoridad authored** para enseñanza y **laboratorio con autoridad rapier sobre otra instancia del balón** para probar contactos. No hay transferencia implícita entre autoridades. El laboratorio se desmonta al elegir tutorial; no es dependencia del motor de sesión. Reiniciar es explícito y no corrige el balón durante la simulación.

Se reutiliza el acumulador/paso/interpolación de react-three-rapier y las consultas/colliders de Rapier. Al terminar el ensayo se duerme el balón con su API para que pasos ya acumulados no añadan desplazamiento antes de la pausa de React. No se construye solver, detector, controlador de drible, rig ni editor.

Consecuencias: el tutorial se puede inspeccionar sin re-simular; la física tiene pruebas y reloj separados. La trayectoria de enseñanza se declara ilustrativa. Preparar un clip adicional sigue requiriendo revisión de poses, contacto, legibilidad y contenido. No garantiza generación fácil de cualquier gesto ni técnica segura. Si en el futuro se aprovecha una simulación para enseñar, se podrá guardar/revisar su trayectoria como clip, bajo una decisión de alcance posterior.

Alternativas: física libre como único tutorial descartada para este caso porque no conserva el objetivo didáctico automáticamente; integrar ambos controladores sobre un mismo balón descartado por autoridad ambigua. Añadir ragdoll o aerodinámica no resuelve la revisión del gesto y está fuera de fase.

Evidencia, configuración y límites: [informe de fase 05](../../reviews/phase05-contact-review.md). Los contratos previos permanecen vigentes.
