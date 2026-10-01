# Fase 06 — costo, licencias y reutilización

2026-09-30. Aplicación concreta de FEATURE_COST_REVIEW, sin ampliación de presupuesto ni servicios. Decisión: admisible para el prototipo local autorizado con los archivos existentes. No se instaló, descargó ni contrató nada en esta fase.

| Necesidad | Recurso reutilizado | Adaptación específica / carencia | Costo obligatorio adicional |
|---|---|---|---|
| Avatar editable | Quaternius Superhero masculino Standard, CC0; rig de 65 huesos ya probado | Conservar malla, pesos, ropa y correcciones; poses de los patrones faltantes | Ninguno |
| Autoría | Blender 4.5.14 LTS portable ya auditado/autorizado, IK, bake, exportador glTF integrado | Tres scripts de lote y lanzador con configuración/temporales dentro del proyecto | Ninguno; tiempo de autoría/corrección y recursos del equipo |
| Reproducción | Three/Fiber, GLTFLoader, AnimationMixer y ClipDriver existentes | Biblioteca de ejemplos, encuadre de suelo, controles y cámaras existentes | Ninguno; no CDN ni cuenta |
| Contactos ilustrados | Balón local, un clip para cuerpo y balón | Planta e interior/exterior, cada lado; Rapier conserva laboratorio independiente | Ninguno |
| Validación | Khronos glTF Validator, Three, Ajv, Vitest, Playwright disponibles | Reglas de cobertura, apoyos, espacio, continuidad y contactos por superficie | Ninguno |
| Fundamento | Fuentes públicas consultadas | Síntesis y límites internos; sin redistribuir medios protegidos | Ninguno para lo consultado; no se promete acceso permanente a toda fuente |

## Búsqueda de reutilización antes de autoría

Se inspeccionó de nuevo el inventario del GLB Animation Library Standard ya descargado: 43 acciones. Incluye Walk/Jog/Sprint, Crouch, Jump, Sitting, Push, Punch, Sword, Pistol, Swim, Spell, Dance, etc. No incluye bisagra, puente, marcha supina, campanitas, planta o interior/exterior que cumplan estas fichas. Walk/Jog no son marcha estacionaria; Crouch y Push no acreditan por su nombre una sentadilla corta o empuje inclinado sobre nuestra silla. No se sustituye el ejercicio por un clip de videojuego.

Se reutilizan esqueleto, pose base, pesos, materiales, ropa y herramientas de IK. Se anima únicamente la trayectoria específica faltante. Para respiración se conserva una postura cómoda, sin inventar una expansión torácica como guía obligatoria. Trece nuevos GLB más dos existentes cubren once patrones; lados explícitos donde corresponde. La silla sigue pendiente de dimensiones/condiciones.

## Derechos y condiciones futuras

**Corrección de naturalidad dentro de 06:** se reutiliza parcialmente Walk_Loop del mismo GLB Standard ya descargado y auditado (CC0), concretamente sus curvas de brazos/codos para marcha y giro. No haber encontrado un ejercicio completo no impide aprovechar esa coordinación. Nueve derivados v2 conservan el avatar y corrigen apoyos/torso/brazos; tres usan esa referencia de caminata. Extracción reproducible y referencia JSON local, sin acceso adicional, créditos, captura comercial ni modelos IA. Las versiones v1 se conservan para comparación y la prueba de 05. [Registro de procedencia](../../ASSET_LICENSES.md), [resultado](phase06-natural-motion-review.md). Coste obligatorio adicional: ninguno en este uso; persisten recursos del equipo y trabajo de revisión.

Los hashes de fuentes y exportaciones están en [evidencia](evidence/phase06/asset-validation.json) y el registro en [ASSET_LICENSES](../../ASSET_LICENSES.md). Se conservan licencia CC0 y originales. Las aportaciones del proyecto no adquieren automáticamente una licencia pública. Blender como herramienta y licencia de su salida son asuntos separados, ya auditados en 04; no se reaudita como si fuera una nueva adquisición.

No cambia el lockfile ni los avisos de dependencias. No se incorpora Remotion, API de generación, modelo local ni complemento. Añadirlos posteriormente exige revisar versión, licencia de herramienta y salida, uso personal/comercial, distribución, créditos/cuotas, cuenta, datos y necesidad real. Packs Source/Pro, contenidos exclusivos, render cloud y servicios de revisión son opciones que pueden costar; no son dependencias de esta entrega.

Más clips aumentan almacenamiento, transferencia local y trabajo de revisión. Todos se empaquetan en el build, pero el visor carga el elegido; no se promete memoria ilimitada ni buen rendimiento en cualquier dispositivo. El usuario confirmó revisión favorable de movimientos corregidos/detalle de pies en computadora y Samsung, sin FPS instrumentales nuevos. Tampoco se declara PWA offline, exportación, sincronización o entrenamiento completo por disponer de estos archivos.

La revisión documental autorizada en [ADR 0012](../architecture/adr/0012-documentary-training-review.md) evita una contratación obligatoria para avanzar; no se convierte en certificación profesional ni elimina dudas individuales. Su costo en cuenta/tokens Codex está fuera de la restricción del usuario. No se promete gratuidad ilimitada ante cambios de contexto.

## Empuje con soporte confirmado

Se añade un GLB de 840760 bytes y fuente .blend, sin instalar o adquirir recursos: mismo avatar/rig Quaternius CC0, Blender IK/bake/exportador y Three existentes. El inventario de acciones no contiene una flexión de pared contrastada con la ficha; se anima únicamente el gesto faltante, con un plano y contorno propios. Dieciséis ejemplos de doce patrones; fixture de silla sin modificar. Pared disponible y silla resistente/estable declaradas por usuario. No se exige compra ni revisor contratado. [Revisión](phase06-wall-push-up-review.md). La comprobación móvil previa sigue cerrada para los recursos anteriores; el nuevo clip no hereda esa aceptación.
