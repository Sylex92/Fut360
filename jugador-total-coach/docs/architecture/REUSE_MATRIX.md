# Matriz de reutilización

Decisiones iniciales, sujetas a validar versiones y archivos concretos. No es un inventario de dependencias ya instaladas.

| Necesidad | Reutilizar | Trabajo propio permitido |
|---|---|---|
| Interfaz | React + Vite + TypeScript | Pantallas, accesibilidad, flujo de entrenamiento |
| Render 3D | Three.js + React Three Fiber | Escena, cámaras y adaptación de assets |
| Reproducción | AnimationMixer / clips GLB | Coordinar tiempo, lado, cues y pausas |
| Física | Rapier + react-three-rapier | Configurar colliders, materiales, eventos, snapshots |
| Avatar | Humanoide riggeado gratuito CC0/compatible | Ropa simple, escala, importación y mapa de huesos |
| Rig y animación | Blender, herramientas existentes de retarget/IK | Adaptar gestos específicos no disponibles |
| Entorno/props | Assets CC0; primitivas de Three.js cuando sean más simples | Delimitar 2×2 y colocar recursos sin estorbar |
| Datos | IndexedDB; evaluar wrapper gratuito compatible solo si reduce trabajo | Modelo de sesión y adaptador pequeño |
| Tests | Vitest/Playwright, tras revisión de licencias y versión | Casos de tiempo, claridad, offline y contacto |
| Audio | Señales Web Audio y grabaciones propias | Cues cortos sincronizados |
| Video futuro | Remotion como candidato condicionado (ADR 0008), o captura local + FFmpeg revisado | Adaptación mínima; no un compositor completo propio si ya existe una solución compatible |

No crear un motor de animación, física o rigging. Sí crear el dominio de entrenamientos y las reglas de integración: no hay una biblioteca que por sí sola represente nuestros objetivos.

## Candidatos de recursos

- Quaternius Universal Base Characters: se anuncia CC0, rig humanoide y glTF; verificar el subconjunto gratuito. Los .blend Source no se presumen gratuitos.
- Quaternius Universal Animation Library: evaluar solo clips gratuitos concretos. No asumir que contiene ball mastery ni todos los ejercicios de fuerza.
- Kenney: recursos CC0 en sus páginas de assets; evaluar props o entorno antes de modelarlos.

Antes de elegir avatar, documentar acceso gratuito, malla editable/importable, huesos, pies/toes, exportación GLB, restricciones, tamaño y prueba de un clip. No forzar un rig nuevo si basta un mapa de huesos.

## Registro obligatorio para crear algo propio

Problema concreto / componentes evaluados / carencia verificada / adaptación descartada y motivo / mínima pieza nueva / pruebas.

Fuentes: S01–S17 en `docs/research/SOURCES.md`.
