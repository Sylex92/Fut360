# Física y animación: separar enseñanza de simulación

## Elección

Three.js reproduce clips; Rapier resuelve física. Ambos se integran mediante React Three Fiber y react-three-rapier. La física no conoce la intención de un arrastre en V ni genera una técnica válida de sentadilla.

## 1. Reproductor de enseñanza (MVP obligatorio)

Avatar y balón siguen un clip sincronizado, reutilizado/adaptado o producido con las herramientas de Blender. Se muestran poses claras, cámara lateral/frontal y reproducción lenta. En cada repetición el punto de contacto y las indicaciones aparecen en el mismo instante.

La trayectoria puede prepararse usando física y guardarse como animación, o animarse directamente. No fingir que una trayectoria de enseñanza predefinida es un resultado de física libre. Los colliders/consultas pueden ayudar a revisar interpenetraciones, pero no certifican técnica humana.

Autoridad del movimiento: `authored`. No activar un cuerpo dinámico que escriba a la vez sobre el mismo nodo animado. Debe ser posible pausar, repetir y saltar a una pose sin re-simular una física no guardada.

## 2. Prueba de contactos (spike acotado, no videojuego)

Un pie con collider cinemático sigue una trayectoria; un balón dinámico interactúa con él y con un suelo fijo. Rapier calcula contactos, fricción y restitución. Mostrar colliders en modo debug. Configurar `setNextKinematicTranslation/Rotation` o equivalentes de la versión elegida, no teletransportar un dinámico en cada frame.

Usar formas simples existentes: esfera para balón, cápsula/caja o convexa sencilla para pie, caja para suelo. No exigir colisión exacta por triángulo de la piel. Los cuerpos cinemáticos no son detenidos automáticamente por fuerzas: validar su recorrido contra la geometría cuando corresponda.

Mantener paso fijo (punto inicial propuesto: 1/60 s), actualización de la pose/colliders antes del paso físico e interpolación del render. Configurar CCD para las pruebas rápidas que lo requieran, no asumir que resuelve toda interpenetración. Documentar límites.

No escribir un controlador que aprenda a driblar ni un ragdoll completo. No intentar corregir el balón con teletransportes invisibles cuando falle: reiniciar el ejemplo de forma explícita o corregirlo en autoría.

## 3. Futuro modo libre

Balón dinámico y acciones del jugador, con cambio explícito de autoridad si se pasa de una secuencia guiada a física. No está dentro de la sesión de una hora. La simulación táctica tampoco debe depender de una física libre si su propósito es enseñar decisiones.

## Contratos de diseño

- `mode`: tutorial o physics-lab.
- `transformAuthority`: authored o rapier por objeto.
- `sourceClipId`, `assetVersion`, `rigMappingVersion`.
- `ballProfile`: identificador y parámetros visuales/físicos documentados.
- `contactWindows`: pie, región, comienzo/fin y tolerancia de revisión.
- `simulationConfig`: versión de motor, paso, estado inicial, parámetros y secuencia de entradas.
- `reviewStatus`: draft / technical-reviewed / coaching-reviewed; con evidencia, nunca autodeclarado.

Los parámetros de fricción, rebote y damping iniciales son ilustrativos, no mediciones de un balón de futsal. No prometer calibración real, velocidad de tiro o potencia humana a partir de esta escena. Fútbol 5 sobre cemento no implica necesariamente reglas o balón reglamentario de futsal: el perfil se configura, no se deduce solo del nombre.

## Tiempo, bucles y verificaciones

Pausa congela motor de sesión, animación, audio y física. Repetir reinicia estado y tiempo de ejemplo. La curva predefinida puede evaluarse a un tiempo exacto; una simulación dinámica requiere restaurar estado y reproducir pasos o usar la trayectoria ya guardada.

Paso fijo ayuda a reproducir; no basta para prometer identidad binaria en todos los dispositivos. Registrar versión, WASM, configuración y entradas, y medir tolerancias en los entornos soportados.

No exigir físicamente un bucle perfecto a un rebote que pierde energía. Solo clips cíclicos son loopables; acciones finitas tienen final y retorno explícito que no debe confundirse con técnica.

## Fuentes

S01: función y tipos de cuerpos rígidos; S02: colliders y materiales; S04: wrapper y paso fijo; S07: reproducción/pausa/tiempo exacto de clips. Ver SOURCES.md.
