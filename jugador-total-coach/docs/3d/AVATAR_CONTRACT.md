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
- orientación frontal elegida y normalizada por el exportador;
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

## Clips

Convención:

```text
EX_<exercise-id>__<variant>__v<version>
```

Ejemplos:

```text
EX_hip-hinge__neutral__v1
EX_split-squat__right__v1
EX_inside-touches__neutral__v1
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

## Cámaras

- front;
- side;
- threeQuarter.

El cambio de cámara no debe alterar el estado de animación.

## Ball mastery

Para movimientos con balón, el balón debe ser un nodo animado dentro del mismo asset o un asset sincronizado mediante una línea de tiempo declarada. El contacto visual pie-balón requiere revisión humana.

## Reglas de reutilización

Prioridad a un asset riggeado gratuito ya existente, con licencia compatible para editar y distribuir lo necesario. El contrato se adapta con un mapping a ese rig; no obliga a diseñar uno desde cero. Registrar las unidades/orientación reales al importar y normalizar sin destruir la fuente.

Cada objeto declara su autoridad de transformación. En el tutorial, cuerpo y balón comparten tiempo de clip. No aplicar Rapier dinámico al balón mientras AnimationMixer escribe su transform. No espejar automáticamente colliders, labels o clips sin probar lados y contactos.

Solo movimientos cíclicos llevan `loopable: true`; acciones finitas necesitan transición visible. Ver PHYSICS_AND_ANIMATION.md y ASSET_SELECTION.md.
