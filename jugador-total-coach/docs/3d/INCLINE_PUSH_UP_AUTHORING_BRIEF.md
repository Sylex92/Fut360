# Empuje inclinado con silla — ficha de autoría pendiente

2026-09-30. Documento interno de fase 06. ID previsto: `incline-push-up-chair`. No hay clip, manifiesto ni ficha de entrenamiento liberada; el catálogo conserva el patrón como no resuelto. Esta ficha prepara su producción sin inventar el mueble del usuario. [Fundamento por patrón](../training/PHASE06_DOCUMENTARY_REVIEW.md#9-empuje-inclinado--incline-push-up-chair).

**Actualización de contexto:** el usuario declara una silla estándar de plástico similar a la [referencia que compartió](https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRwGm6UTZzWF_frpTMB3h3QOohGCnqEt0Vm9n0GhmHw5LMjU31aNpGHu_MWxVaNR4WLHx82sTS1-YhuxjXNODPCw0UgmneFtiJyz5DuBfH68xb_qchbUXzL1TUrD8te6KwJc-mvaSxM&usqp=CAc). La miniatura se inspeccionó en navegador: silla azul con apoyabrazos, cuatro patas, apariencia monobloque; no es una ficha de fabricante ni una inspección de su silla. Medidas, resistencia y agarre siguen sin comprobar. No se incorpora la fotografía al producto ni a los assets versionados. No se afirma que todas las sillas de plástico sean inadecuadas ni que esta vaya a romperse.

Se propone conservar el patrón de empuje con una variante contra pared firme, por incertidumbre del soporte disponible. No se atribuye a una imposibilidad de animar la silla. Disponibilidad de pared junto al área de 2×2 consultada; pendiente de respuesta antes de producir o cambiar el catálogo.

## Base documental y objetivo

[NASM — Incline Push-Up](https://www.nasm.org/resource-center/exercise-library/incline-push-up), reconsultado directamente el 2026-09-30, describe manos sobre una superficie elevada, pies en el suelo, descenso flexionando codos y regreso mediante empuje. Participan pectoral, tríceps y estabilización del tronco. La referencia utiliza banco/superficie elevada; no demuestra que una silla doméstica concreta sea apropiada. No se adoptan sus series/repeticiones ni afirmaciones generales de rehabilitación o prevención.

Objetivo propuesto del ejemplo: distinguir un empuje con manos elevadas de una flexión en suelo o con pies elevados, y mostrar apoyos, descenso y regreso. La elección cubre el patrón de empuje del catálogo; no acredita preparación física completa para fútbol. La dosis continúa sin habilitar. Fuente técnica, decisión de autoría, geometría comprobada y tolerancia personal son evidencias diferentes.

## Datos de entrada

| Dato | Estado | Uso concreto |
|---|---|---|
| Disponibilidad de silla firme | Declarada por el usuario | Punto de partida; no certificación para cargarla lateralmente |
| Material y referencia | Plástico declarado; imagen de silla con apoyabrazos inspeccionada | Contexto para reconsiderar el soporte, sin inventar dimensiones |
| Altura del asiento desde el suelo | Solicitada, pendiente | Plano de apoyo de manos y postura inclinada |
| Ancho y fondo del asiento | Solicitados, pendientes | Superficie útil de las manos y espacio del mueble |
| Ruedas, mecanismo plegable, apoyabrazos | Solicitados, pendientes | Posibles interferencias, desplazamiento o restricciones del apoyo |
| Forma del borde, respaldo y huella de patas | Pendiente de resolver tras descripción inicial | Decidir si hace falta información adicional para representar agarre y cabida |
| Estabilidad frente a deslizamiento/vuelco | No verificada | Condición de uso, distinta de tamaño o apariencia del modelo |
| Zona libre | Al menos 2×2 m declarada | Debe contener mueble y cuerpo, sin asumir espacio junto al cuadrado |

La consulta inicial pide solo medidas aproximadas y descripción, sin que el usuario ejecute el ejercicio o haga una prueba con peso. No solicitar datos personales o médicos para modelar el mueble. Si las medidas no resuelven agarre/huella, identificar la duda concreta antes de producir una representación que parezca válida. No interpretar el silencio como confirmación de estabilidad.

## Autoría prevista, condicionada a esos datos

1. Revisar la correspondencia entre superficie disponible, apoyos y variante. Si el mueble no sirve, documentar la razón contextual y resolver alternativa con el usuario; no sustituirlo por dificultad de animación.
2. Reutilizar avatar Quaternius, mallas, pesos, ropa y huesos actuales. Usar IK, bake y exportación glTF de Blender portable existente. El rig tiene brazos, manos y dedos; no crear un rig ni un solver. El inventario de animaciones disponible no acredita un empuje inclinado sobre esta silla por contener una acción llamada Push.
3. Representar un prop sencillo a partir de los datos confirmados con herramientas existentes; no exige hiperrealismo ni descargar otro pack. Un modelo de silla inmóvil sirve para enseñar ubicación, no para demostrar resistencia del mueble real.
4. Preparar postura de manos sobre superficie y pies en suelo; un descenso/regreso finito con coordinación de hombros, codos y tronco. Los ángulos, profundidad y duración se revisan como decisiones visuales, no como una prescripción personal. Inicio/final claros, sin teletransportar manos ni introducir saltos.
5. Comprobar palmas/dedos sobre la superficie útil, muñecas, trayectoria de codos y ausencia de paso del cuerpo por asiento/respaldo. Manos y antepiés conservan contacto durante la repetición. Considerar silla completa, cuerpo y manos en la medición del área, no solo la raíz del avatar.
6. Exportar fuente editable, GLB finito y manifiesto; registrar procedencia, modificaciones y hashes. Capturas frontal/lateral/¾, pausa/reinicio y revisión por instante; corregir la representación antes de incorporarla a la biblioteca. Separar contacto ilustrado de simulación de vuelco o fricción, que no está incluida.

## Condición para incorporarlo

Datos y variante resueltos, apoyos representados, geometría dentro del espacio y validación técnica documentada. El usuario revisará comprensión de la demostración. Ni una exportación correcta ni esa aceptación otorgan certificación profesional o aprobación automática de una dosis.

Continúan pendientes: medidas/condiciones reales y su interpretación, recurso/validaciones, tolerancia y dosis individual. El documento no cuenta como el duodécimo clip ni completa la fase 06. Preparación de la sesión y transiciones entre ejercicios pertenecen al alcance posterior autorizado por separado. [Estado](../../PROJECT_STATUS.md).

## Alternativa propuesta tras conocer el material: empuje en pared

[NHS — Strength exercises, Wall press-up](https://www.nhs.uk/live-well/exercise/strength-exercises/), consultado directamente el 2026-09-30, describe palmas en pared a altura del pecho, postura de pie, flexión controlada de brazos y retorno. Esa descripción permite contrastar la variante; no valida una pared concreta ni prescribe una dosis personal. No se trasladan automáticamente sus series/repeticiones. Tampoco se equipara la carga de pared a la del asiento.

Decisión propuesta del agente: mantener un empuje de tren superior con soporte fijo y retirar la dependencia de una silla cuyo agarre/resistencia no se han resuelto. Si la pared está disponible, registrar el cambio de variante con ID propio `wall-push-up`, conservando `incline-push-up-chair` como antecedente contextual y el fixture histórico intacto. Adaptar ficha, fuente y clip, sin disfrazar una flexión contra pared bajo el nombre de silla.

Plan de representación condicionado a respuesta: pared como plano de referencia en el borde del cuadrado, cuerpo y manos dentro del área, apoyo de palmas/dedos, descenso y vuelta finitos. Reutilizar rig/Blender IK, controlar hombros/codos y evitar atravesar la pared o deslizar manos/pies; vistas lateral/¾ que no oculten el cuerpo detrás del plano. Una repetición ilustrativa, sin ritmo o dosis exigidos. No producir la variante hasta confirmar que el soporte existe en el contexto del usuario.
