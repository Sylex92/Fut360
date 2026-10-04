# Planta longitudinal y arrastre en V
Fecha: 2026-10-03. Fundamento interno; no se incorpora a la interfaz.

## Recursos originales producidos
- Planta atrás/adelante, pie izquierdo y derecho: 8 s por ejemplo. Ida y vuelta con planta, sin salto.
- Arrastre y salida en V, pie izquierdo y derecho: 10 s. Arrastre con planta, liberación/recolocación, empuje diagonal con interior; recogida posterior con planta para preparar otra muestra. La recogida no cuenta como una segunda V.

Se reutilizan humanoide, rig y aspecto Quaternius CC0 existentes, coordinación de planta lateral v2 y Blender portable ya autorizado. Autoría con keyframes, restricciones IK de Blender y bake; no captura de movimiento extraída de videos. GLB en metros, Y arriba, 30 FPS, una acción finita, autoridad del balón por animación.

## Evidencia y decisión
[7mlc, diez tareas de dominio](https://www.youtube.com/watch?v=e5RxAJM-oxc&t=215s): observación de la tarea 4 alrededor de 3:35–3:40, con muestras cada segundo. Se distinguen planta, cambio de dirección y acompañamiento del cuerpo. El material no proporciona profundidades, fuerzas ni ángulos medidos. Nuestra V es una ilustración aislada y lenta del principio; no reproducción exacta de la secuencia, intensidad o programa del autor.

[Futsal Movement, pull-push](https://www.youtube.com/watch?v=dr4PbJwtsaI): muestras de contexto 0:08, 0:16, 0:24, 0:32, 0:40, 0:48, 0:56, 1:04 y 1:12. Muestra un gesto con balón y salida, además de contexto con un rival. No denominar nuestro ejemplo longitudinal con planta como ejecución completa del engaño competitivo: faltan oposición y desplazamiento de salida.

La planta longitudinal permite separar el control de distancia del cambio de superficie. La V añade una salida diagonal con interior. Son objetivos de práctica propuestos, no evidencia de mejora individual ni transferencia automática al partido. Se conserva el regreso explícito para que se entienda qué prepara la siguiente repetición. No se fuerzan giros de tronco/rodilla sobre un apoyo fijo ni se añade salto como requisito.

## Progresión propuesta, no dosis prescrita
Reconocer las superficies y separar los contactos; enlazarlos manteniendo el balón disponible; practicar ambos pies. Después, en espacio suficiente y con otra ficha, añadir salida, información de dirección y oposición. En FUT 5 prima disponibilidad cercana y protección; FUT 7 puede añadir aceleración/pase; FUT 11 recepción orientada según presión. Estos desarrollos no están animados en los cuatro recursos entregados.

Regresión: menor recorrido y recolocación entre fases. Errores a observar: cargar peso sobre el balón, perder el apoyo, empujar antes de liberar la planta, perseguir un balón que se escapó para cumplir la cadencia del avatar. Duración del clip y velocidad del visor son parámetros de observación, no dosis individual.

## Verificación
Cuatro GLB comprobados con Khronos y muestreo real de skinning a 30 Hz: sin errores/adver­tencias reportados; límites espaciales, regreso a pose y apoyo revisados. Contacto geométrico de esfera frente a triángulos deformados: penetración máxima aproximada 1,63 mm; mayor separación en ventanas de contacto 3,69 mm. Tolerancias técnicas: 2 mm y 10 mm respectivamente. Esto no acredita física real, fuerzas, biomecánica ni seguridad individual. Evidencia: `docs/reviews/evidence/product-sole-v/ball-surface-check.json` y los cuatro informes `product-sole-*` / `product-v-*`.

Estado deportivo **draft**. Revisión visual en navegador y aceptación de claridad se registran por separado en el informe de entrega; nunca se atribuye una revisión profesional por consultar estas fuentes.
