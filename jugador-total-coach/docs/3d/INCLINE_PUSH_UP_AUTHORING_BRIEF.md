# Empuje — decisión de soporte y autoría

2026-09-30. Fase 06. Recurso actual: **wall-push-up**, [ficha](../../content/exercises/wall-push-up.json), [fuente editable](../../assets/source/wall-push-up/wall-push-up-v1.blend), [verificación](../reviews/phase06-wall-push-up-review.md). El nombre del documento conserva la consulta inicial sobre incline-push-up-chair; no confundirlo con el ID del recurso producido.

## Contexto resuelto

El usuario confirma una pared despejada junto al área y aclara que la silla también es resistente y estable. La miniatura solo era referencia de forma. Se acepta su declaración sin afirmar inspección física ni descartar la silla por ser plástica. Altura, ancho, fondo y agarre del asiento no se midieron; ya no bloquean la variante de pared. La mención de isometrías no se toma como prueba de tolerancia a flexiones dinámicas ni habilita una dosis.

La consulta previa era necesaria para resolver soporte real, no autorización de Blender ni compra. Pared disponible confirmada; los recursos anteriores fueron aceptados en computadora y Samsung. Este nuevo clip requiere su propia aceptación visual/funcional.

## Decisión y fundamento

Se conserva el patrón de empuje mediante una variante inicial de pie con soporte fijo disponible. Reduce la dependencia del asiento aún no caracterizado; no afirma que la silla sea inadecuada, que pared y silla tengan la misma carga ni que pared sea superior para el usuario. La silla permanece como alternativa futura con geometría/agarre a resolver. No se sustituye por dificultad de animación.

[NHS — Strength exercises, Wall press-up](https://www.nhs.uk/live-well/exercise/strength-exercises/), reconsultado el 2026-09-30: palmas a altura del pecho, dedos arriba, flexión controlada de brazos junto al cuerpo y regreso. [NASM — Incline Push-Up](https://www.nasm.org/resource-center/exercise-library/incline-push-up) fundamentó el patrón inicial de empuje elevado, distinto de certificar una silla concreta. Síntesis y límites en la [revisión documental por patrón](../training/PHASE06_DOCUMENTARY_REVIEW.md#9-empuje--wall-push-up-antecedente-incline-push-up-chair). No se trasladan sus series/repeticiones ni se incorporan sus imágenes o videos a la aplicación.

## Representación producida

- Misma morfología, rig de 65 huesos, materiales, ropa y pesos del avatar Quaternius. Herramientas existentes de Blender: IK de dos huesos para brazos/piernas, copia de rotación para palmas/pies, bake y exportador glTF. Sin nuevo rig, solver ni editor.
- Una flexión bilateral finita de 8 segundos: colocación ya preparada, acercamiento, regreso y posición final. No es una isometría ni una transición desde otro ejercicio. La duración es para observar, sin obligación de ejecutar al mismo ritmo.
- Plano y contorno propios de pared. Cara exterior sin relleno para conservar visibilidad frontal/¾; desde lateral se aprecia el plano de contacto. El modelo no certifica resistencia de una pared real.
- Pared en el borde del cuadrado 2×2; conjunto trasladado 0,5959 m con transformaciones nativas y geometría de reposo aplicada, manteniendo los nodos de malla skinned en la raíz conforme a glTF. Comprobación de forma después de descontar la traslación; no exigir hashes idénticos de posiciones recalculadas.
- Apertura de pulgares del rig y orientación de manos corregidas: la pose neutral anterior atravesaba el plano. Codos flexionan y extienden, manos estables, cuerpo alineado, pies apoyados. Ángulos y distancias son decisiones de autoría de este avatar, no objetivos personales.
- Recurso separado wall-push-up y sustitución contextual explícita en el catálogo. Fixture histórico con silla intacto; ningún archivo de movimientos previamente aceptados se reexporta.

## Verificado y pendiente

Verificado por herramientas/agente: glTF sin errores/advertencias, geometría y apoyos muestreados, 183 pruebas, 17 comprobaciones de navegador y capturas frontal/lateral/¾/390 px. Detalle reproducible, hashes y tolerancias en el [informe](../reviews/phase06-wall-push-up-review.md).

Pendiente: aceptación de claridad/funcionamiento del nuevo recurso en computadora y Samsung, dosis individual y composición/transiciones de la sesión posterior. Fuentes, geometría y aceptación del usuario son evidencias distintas; no se otorga coaching-reviewed. Fase 07 continúa sin iniciar. La animación permanece draft como contenido deportivo.
