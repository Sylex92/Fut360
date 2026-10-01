# Contrato del avatar 3D

## Apariencia

- humanoide masculino genérico y estilizado;
- ropa deportiva neutra;
- alto contraste entre cuerpo, fondo, balón y props;
- sin parecido deliberado con una persona real;
- materiales simples para móvil.

## Escala y coordenadas

- unidad: metro;
- altura de referencia: configurable;
- Y es vertical en runtime;
- orientación frontal normalizada a +Z; derecha anatómica del avatar en pose inicial hacia −X (cámara frontal mira hacia −Z);
- origen del ejercicio en el centro del cuadrado 2×2.

## Esqueleto existente + mapa semántico

Adoptar primero un rig existente. Documentar un mapping estable, sin recrear el rig, para:

- root;
- hips;
- spine;
- chest;
- neck;
- head;
- upper/lower arms;
- hands;
- upper/lower legs;
- feet;
- toes.

Cada mapping registra rigId/versión/hash, nombre real de nodo por función, jerarquía, pose de referencia, escala/orientación y correcciones aplicadas. Si falta un hueso, justificar su equivalencia o declarar incompatibilidad para el gesto; no inventar que hay toes ni rehacer el rig automáticamente. No cambiar alturas/proporciones por clip para ocultar deslizamientos.

## Clips

Convención:

```text
EX_<exercise-id>__<variant>__v<version>
```

Ejemplos:

```text
EX_hip-hinge__neutral__v1
EX_inside-outside__right__v1
EX_inside-inside__alternating__v1
```

## Propiedades obligatorias

- clipName;
- fps;
- durationSeconds;
- loopable;
- startPose;
- endPose;
- boundingBoxMeters;
- requiredProps;
- supportedSides;
- reviewStatus.

Los ejemplos son nombres propuestos, no archivos existentes. El [contrato de dominio de fase 01](../architecture/DOMAIN_MODEL.md) precisa variantes, lados, manifiestos, hashes/licencias, autoridad y revisión. durationSeconds del recurso se normaliza a durationMs del contrato; fps indica autoría, no velocidad independiente del reloj. El nombre del clip dentro del GLB debe coincidir exactamente con su manifiesto.

## Cámaras

- front;
- side;
- threeQuarter;
- detail: encuadre de pies y balón cuando la ficha lo ofrezca; incorporado a la biblioteca en fase 06.

El cambio de cámara no debe alterar el estado de animación.

El primer hip-hinge propone cámara lateral para observar el patrón; las otras siguen accesibles. El resto inicia en 3/4 salvo justificación de ficha. La etiqueta izquierda/derecha siempre nombra el lado del practicante, no el lado de la pantalla.

## Ball mastery

Para movimientos con balón, el balón debe ser un nodo animado dentro del mismo asset o un asset sincronizado mediante una línea de tiempo declarada. El contacto visual pie-balón requiere revisión humana.

## Reglas de reutilización

Prioridad a un asset riggeado gratuito ya existente, con licencia compatible para editar y distribuir lo necesario. El contrato se adapta con un mapping a ese rig; no obliga a diseñar uno desde cero. Registrar las unidades/orientación reales al importar y normalizar sin destruir la fuente.

Cada objeto declara su autoridad de transformación. En el tutorial, cuerpo y balón comparten tiempo de clip. No aplicar Rapier dinámico al balón mientras AnimationMixer escribe su transform. No espejar automáticamente colliders, labels o clips sin probar lados y contactos.

Solo movimientos cíclicos llevan `loopable: true`; acciones finitas necesitan transición visible. Ver PHYSICS_AND_ANIMATION.md y ASSET_SELECTION.md.
