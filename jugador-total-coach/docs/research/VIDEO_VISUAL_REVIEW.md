# Revisión visual de videos: acceso y método

## Actualización 2026-10-03: inventario ampliado y ocho videos observados

El nuevo [inventario](../training/CONTENT_INVENTORY.md) reúne **5.764 videos públicos únicos** de los siete canales. [JSON con títulos/URLs](VIDEO_CATALOGUE.json) y [CSV](VIDEO_CATALOGUE.csv). Se recorrieron las pestañas Videos; se excluyen Shorts, directos, privados, retirados y contenido de membresía. Que deje de cargar una lista durante una espera no garantiza exhaustividad. El catálogo conserva `complete: false`; ni el tamaño anunciado por un canal ni los enlaces recopilados equivalen a ejercicios vistos.

Ahora hay **ocho videos con observación de muestras**, procedentes de los siete canales, detallados en [VIDEO_OBSERVATIONS.json](VIDEO_OBSERVATIONS.json). Ningún video entero se declara validado. V01 amplía muestras a las diez tareas de 7mlc y revisa la V con mayor densidad; V03–V07 añaden Unisport, Joner Football, Become Elite, My Personal Football Coach y AllAttack; V08 añade pull-push de Futsal Movement. En varias muestras solo aparece explicación del presentador: no se contabilizan como un ciclo deportivo observado.

Se verificó bloqueo privado del video de trabajo en V de My Personal Football Coach, [EFkGGLsHRhU](https://www.youtube.com/watch?v=EFkGGLsHRhU). Se utilizó su [alternativa pública de recepción y oposición](https://www.youtube.com/watch?v=fatWWf2Q4LY) para otro objetivo; no se presenta como desbloqueo del material privado.

Las notas separan observado, interpretación y pendiente. No se copiaron transcripciones ni se añadieron videos/capturas de terceros al producto o Git. Las imágenes de trabajo permanecen en .cache. Cuatro animaciones originales de planta longitudinal/V ya se produjeron con el rig y Blender existentes; [fundamento y diferencias respecto de las referencias](../training/SOLE_V_REVIEW.md). La observación no es extracción automática de rig/animación ni certificación biomecánica.

### Resultado por fuente

| Fuente | Evidencia visual | Qué falta |
|---|---|---|
| 7mlc | Diez tareas muestreadas; detalle de primera secuencia y V. | Ciclos completos de todas las variantes y resto del canal. |
| Become Elite | Seis segmentos de pase, recepción, información, finalización y juego con compañero. | Contactos completos, distancias y adaptación de carga. |
| Joner Football | Montajes y contexto de comparación de tareas. | Ejecuciones completas; no deducir eficacia del ranking. |
| My Personal Football Coach | Recepción/salida y oposición, seis muestras. | Contactos/carga adulta; V privada permanece inaccesible. |
| Unisport | Cuatro segmentos sobre recepción. | Secuencias completas y uso de información. |
| AllAttack | Postura defensiva y contexto de una entrada. | Frenado/temporización; no trasladar la entrada al hogar. |
| Futsal Movement | Recepción y segundo video de pull-push. | Liberación, salida y variantes completas. |

Lo que sigue debajo conserva el informe inicial de dos videos para trazabilidad; su apartado “estado de las siete fuentes” es histórico y queda sustituido por esta actualización.



2026-10-02. Seguimiento solicitado después del análisis inicial. Uso interno; no incorporar este fundamento al portal. [Informe inicial](TRAINING_SOURCE_ANALYSIS.md), [base estructurada](../training/FOOTBALL_KNOWLEDGE_BASE.json).

## Resultado comprobado

Playwright abrió y reprodujo dos videos públicos de las fuentes solicitadas, sin cuenta ni instalación. Se pudo pausar, buscar instantes, avanzar con la tecla de fotograma y observar las imágenes renderizadas. El backend del navegador integrado de Codex no estuvo disponible; eso no impidió la revisión con el navegador independiente.

La revisión anterior fue principalmente documental. Ahora hay observación visual acotada. No se ha revisado todo el contenido de los siete canales, no se conoce todavía el tamaño completo de ese inventario y no se declara ningún ejercicio listo para modelar solo por abrir un video.

Las imágenes se inspeccionan mediante capturas locales temporales bajo `.cache/source-observation/`, excluidas de Git. No se descargó el archivo de video, no se guardó una transcripción ni se incorporaron imágenes de terceros a la app. Las notas siguientes son propias.

## Registro de observación

### V01 · 7mlc · S01

[Video original](https://www.youtube.com/watch?v=e5RxAJM-oxc&t=50s). Muestras aproximadamente entre **0:50 y 1:01**, con avance por fotogramas y observación cada 0,5–1 s en parte del tramo. También se revisaron fotogramas de contexto. No visionado íntegro de los diez ejercicios.

**Observado:** combinación de planta e interior que desplaza el balón entre ambos lados, acompañada por cambios de apoyo. Los brazos también cambian de posición. No es una secuencia de interior-interior exclusivamente.

**Aplicación propuesta:** diferenciar los momentos de planta, liberación y empuje lateral; animar el apoyo y el acompañamiento corporal. **Pendiente:** revisar el inicio completo, ciclos a velocidad normal, ambos lados y cualquier contacto oculto antes de cerrar la ficha de autoría.

### V02 · Futsal Movement · S12

[Video original](https://www.youtube.com/watch?v=VkDQ4F9c6Fk&t=105s). Fotogramas de contexto en **0:30, 1:00, 1:30 y 2:00**; muestras aproximadamente entre **1:45 y 1:58**, incluida una acción con compañero.

**Observado:** postura de recepción, relación con otro participante y salida con balón; en la secuencia se aprecia una recepción con el pie sobre el balón antes del desplazamiento.

**Aplicación propuesta:** representar de dónde llega el pase y hacia dónde se sale, además del gesto del pie. **Pendiente:** completar la explicación y las alternativas; no deducir una orientación universal ni todas las fases del contacto de unas pocas vistas.

Los tiempos son referencias de navegación aproximadas. El contador visible redondea y una muestra no representa cada fotograma intermedio. Las capturas de contexto no acreditan movimientos que ocurren entre ellas. Subtítulos automáticos consultados puntualmente solo como apoyo; no se copiaron en estas notas.

## Método de revisión que continúa

1. **Inventario acotado por fecha:** canal, URL, título, duración, acceso y familias de ejercicios. Registrar duplicados, Shorts y variantes. No anunciar “todos revisados” sin un denominador comprobado.
2. **Localizar el ejercicio:** distinguir introducción, publicidad, explicación, demostración, errores y progresiones. Un capítulo genérico no identifica el movimiento por sí solo.
3. **Observar la secuencia:** reconocer inicio, preparación, contacto, trayectoria y recuperación. Revisar un ciclo entero y su repetición; muestrear más densamente donde el contacto o apoyo sea ambiguo.
4. **Combinar vistas:** pausa/fotogramas para detalle, reproducción normal para ritmo y coordinación. Separar lectura de subtítulos y observación de pies cuando se tapen entre sí. No reconstruir toda una transcripción.
5. **Resolver incertidumbres:** cambiar instante/encuadre, buscar otra explicación pública del gesto o una vista complementaria. Si no se ve un contacto, marcarlo pendiente; no inventarlo.
6. **Ficha propia:** objetivo, modalidad, espacio, material, lado, apoyos, superficies de contacto, secuencia, resultado, errores, regresión/progresión y límites. Separar observación, interpretación del agente y fundamento de la dosis.
7. **Autoría posterior:** adaptar rig y herramientas existentes en Blender; la referencia no proporciona automáticamente rig, mocap, profundidades, fuerza ni ángulos medidos. No copiar identidad o apariencia del instructor.
8. **Comprobar el recurso:** comparar con la ficha, revisar contactos/apoyos y legibilidad desde las cámaras del producto, y observar ritmo normal/lento. La simulación física no sustituye revisión del gesto.

El inventario y la revisión se harán por lotes con cobertura visible. Una sola muestra no cierra un canal; todas las variantes de un video tampoco equivalen a todos sus videos. Se priorizan necesidades del catálogo sin borrar los candidatos restantes.

## Qué hace falta y qué no

Para los dos videos públicos probados **no falta permiso, cuenta, contraseña, compra ni herramienta nueva**. El trabajo pendiente es observación y organización, no una barrera de acceso ya demostrada.

No existe una configuración que garantice acceso a videos privados, retirados, restringidos o cursos de pago. Si una referencia concreta exige acceso legítimo adicional, se registrará el enlace y el bloqueo y se buscará una alternativa pública. Solo se solicitará intervención cuando sea indispensable; no pedir credenciales por chat, eludir restricciones ni introducir pagos.

El conocimiento se conserva en fichas y fuentes del proyecto para reutilizarlo durante diseño y revisión. Estudiar el material no convierte automáticamente una imagen en una animación editable ni demuestra eficacia deportiva.

## Estado de las siete fuentes tras esta comprobación

| Fuente                     | Acceso/evidencia obtenida hasta ahora                       | Pendiente principal                                                  |
| -------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| 7mlc                       | Metadatos y muestras visuales V01.                          | Inventario y revisión completa por ejercicio; no solo capítulos.     |
| Become Elite               | Descripciones públicas de programas en la entrega anterior. | Seleccionar y observar entrenamiento audiovisual público concreto.   |
| Joner Football             | Texto público de metodología/tareas.                        | Contrastar las variantes seleccionadas mediante imágenes.            |
| My Personal Football Coach | Textos públicos de técnica y oposición.                     | Ver secuencia y apoyos del movimiento en V y las variantes elegidas. |
| Unisport                   | Artículos y capítulos públicos.                             | Observar recepción y continuidad completas de variantes concretas.   |
| AllAttack                  | Metadatos/capítulos originales confirmados.                 | Observar fragmentos de gesto/errores, con contraste contextual.      |
| Futsal Movement            | Descripción y muestras visuales V02.                        | Completar explicación, contactos y alternativas de recepción.        |

No se han producido nuevos GLB, cambiado la sesión, añadido dependencias o ejecutado pruebas de aplicación. Se actualiza la clasificación de acceso S01/S12 a `youtube-visual-samples`; la base conserva `draft`, dosis pendiente y ausencia de revisión profesional.
