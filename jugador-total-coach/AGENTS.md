# AGENTS.md — Jugador Total Coach

## Propósito

Construir un producto local-first de entrenamiento de fútbol y fuerza con avatar 3D. El MVP1 reproduce una sesión fija de 60 minutos en un espacio de 2×2 m.

## Reglas prioritarias — costo cero, extensibilidad y reutilización

- Leer `docs/product/ZERO_COST_AND_GROWTH_POLICY.md` antes de proponer dependencias.
- El MVP local debe compilar y funcionar sin cuentas, claves, servicios de pago ni suscripción a Codex.
- Admitir software abierto, source-available o propietario gratuito: lo obligatorio es costo cero para el uso concreto y las ampliaciones previstas, no un tipo de licencia. No basar una función esencial en trials, créditos o cuotas temporales.
- «Autoescalable» se interpreta como extensible funcionalmente, no como infraestructura ilimitada. Revisar costo y derechos antes de cada función mediante FEATURE_COST_REVIEW.md. No contratar ni activar pagos.
- Preferir componentes sin restricciones que comprometan el roadmap. Los candidatos condicionados requieren límites, disparadores y estrategia de sustitución documentados. Unknown/pending no equivale a aprobado.
- Plugins propietarios gratuitos son admisibles tras revisar permisos y límites. No introducir modelos de pago ni APIs de video/voz que obliguen a pagar. Reutilizar antes de crear.
- Remotion es candidato condicionado para exportación local posterior al MVP1; ya no requiere excepción por no ser open source. Revisar ADR 0008 y evidencia de versión/uso. No instalarlo durante la fase documental ni confundir admisibilidad con implementación aprobada.
- Antes de construir infraestructura, completar `docs/architecture/REUSE_MATRIX.md`: reutilizar -> adaptar -> crear solo la pieza específica faltante.
- Mantener Three.js + React Three Fiber para visualización y Rapier + react-three-rapier para física. No escribir solvers, detección de colisiones ni controladores de ragdoll propios.
- Buscar primero un humanoide ya riggeado y editable, con licencia de contenido compatible y descarga gratuita concreta. Un maniquí de primitivas solo es un fallback técnico temporal, no el entregable final.
- Reutilizar herramientas de Blender para autoría/retargeting; no construir un editor o un sistema de rigging propio. Adaptar a un rig existente antes de imponer uno nuevo.
- Priorizar clips guiados revisados en el reproductor. La simulación física libre tiene su propia prueba técnica y no sustituye la técnica del ejercicio.
- Cada objeto tiene una única autoridad de transformación por instante. No animar y resolver físicamente el mismo balón a la vez sin un cambio de estado explícito.
- Toda licencia desconocida queda pendiente/bloqueada. Mantener registro de origen, archivo, versión/hash, licencia y modificaciones; revisar dependencias transitivas.
- Empaquetar modelos, WASM, fuentes permitidas y audio para uso local. No depender de CDNs ni de una voz cloud.
- Los fallbacks solo sirven para desarrollo; impiden declarar el MVP de entrenamiento completo.
- No publicar el repositorio ni elegir una licencia pública para el código del usuario sin su autorización.
- No ejecutar descargas, instaladores o scripts de terceros antes de revisar su procedencia y licencia. No instalar herramientas globales ni modificar el sistema sin permiso.

## Forma de trabajo obligatoria

1. Lee primero `README.md`, `PROJECT_STATUS.md`, la política de costo cero y crecimiento, el PRD, la matriz de reutilización, el contrato de física y `docs/plans/ROADMAP.md`.
2. Antes de modificar código, escribe o actualiza un plan verificable.
3. Trabaja en cambios pequeños y revisables.
4. No mezcles una refactorización amplia con una funcionalidad.
5. Explica supuestos y registra decisiones duraderas como ADR.
6. No agregues dependencias de producción sin justificar su necesidad y alternativas.
7. Nunca declares una tarea terminada si no ejecutaste sus verificaciones.
8. No generes servicios vacíos “para el futuro”.

## Reglas de arquitectura

- Empezar como monorepo y monolito modular.
- Mantener el dominio independiente de React, Three.js, almacenamiento y APIs externas.
- Separar:
  - motor de sesión;
  - catálogo de ejercicios;
  - runtime 3D;
  - persistencia;
  - telemetría;
  - integraciones.
- Las integraciones futuras se conectan mediante puertos/adaptadores.
- El MVP1 no requiere backend, autenticación ni nube.
- La persistencia inicial es local y debe poder exportarse/importarse.
- Los eventos de entrenamiento son append-only; las vistas estadísticas pueden reconstruirse.

## Reglas 3D

- El avatar debe ser genérico. No copiar rostro, cuerpo, tatuajes, uniforme ni identidad visual de jugadores reales.
- Bellingham y Firmino son referencias de características de juego, no de apariencia.
- Unidad de mundo: metros.
- Runtime: eje Y vertical. La orientación frontal del avatar debe quedar documentada y normalizada por el exportador.
- Formato de distribución: GLB/glTF 2.0.
- Todo clip debe:
  - tener nombre estable;
  - indicar FPS y duración;
  - declarar si es cíclico; solo entonces reproducirse en bucle sin salto visible;
  - mantener el movimiento dentro del área declarada;
  - incluir estado de revisión.
- Los assets temporales deben llevar `reviewStatus: draft`.
- Ningún movimiento se marca como validado sin revisión humana.
- Registrar licencia y procedencia de cada asset en `ASSET_LICENSES.md`.

## Reglas de entrenamiento y seguridad

- No diagnosticar lesiones ni enfermedades.
- Si una definición incluye dolor, bloqueo, inflamación o inestabilidad real, la interfaz debe mostrar la acción de detenerse y buscar valoración.
- Siempre incluir calentamiento y vuelta a la calma.
- La suma de intervalos debe coincidir exactamente con la duración declarada.
- Cada ejercicio debe declarar espacio, equipo, impacto, lado, regresión, cues y errores comunes.
- No presentar una animación como garantía de ejecución segura.
- Las indicaciones de respiración deben evitar contener el aire durante fuerza.

## Privacidad

- No incluir en Git datos personales, fotos médicas, medidas clínicas, tokens ni secretos.
- Los datos reales del usuario se guardan fuera del repositorio.
- El modo social futuro debe ser opt-in y privado por defecto.
- Los wearables deben entrar por un modelo canónico; nunca contaminar el dominio con tipos de un proveedor.

## Calidad

- TypeScript estricto.
- Validación de contenido contra JSON Schema.
- Pruebas unitarias del reloj y la máquina de estados.
- Pruebas de contrato para assets y catálogos.
- Pruebas E2E del flujo de una sesión corta.
- Accesibilidad: controles por teclado, subtítulos, contraste y opción de silenciar.
- Rendimiento objetivo del MVP: experiencia fluida en un teléfono Android de gama media razonable; documentar el dispositivo usado para la medición.

## Definition of Done mínima

- Criterios de aceptación cumplidos.
- Lint, typecheck y pruebas en verde.
- Documentación actualizada.
- Sin errores nuevos en consola.
- Assets y licencias registrados.
- Evidencia visual o E2E del comportamiento.
- Limitaciones conocidas registradas.


## Continuidad y autorizaciones
- Ejecutar una fase por mensaje; no pasar automáticamente a la siguiente.
- Al cerrar la fase, actualizar PROJECT_STATUS.md con archivos, pruebas realmente ejecutadas, pendientes y siguiente paso.
- No atribuir a Codex acceso automático a conversaciones o memorias de ChatGPT: el repositorio es la fuente de contexto.
- No instalar herramientas globales, cambiar políticas de PowerShell, desactivar antivirus, publicar o subir archivos sin autorización específica.
- Usar versiones compatibles verificadas y lockfile; no depender de `latest` como especificación reproducible.
- Auditar no equivale a entrenar: el fixture no se ofrece como rutina aprobada mientras continúe draft.
- En ejercicios de fuerza, un intervalo indica una ventana disponible: permitir un número objetivo de repeticiones y descanso del tiempo restante, no obligar a repeticiones continuas ni al fallo.
- La silla del escenario no debe reducir ficticiamente el espacio disponible ni utilizarse como apoyo sin definir estabilidad y variante. No mostrar una búlgara cuando el ejercicio pide ambos pies en el suelo.
