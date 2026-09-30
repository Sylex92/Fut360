# Fase 05 — Contactos y comparación guiada

Fecha: 2026-09-30. Autorización explícita: «vamos con la fase 5». Fase 04 cerrada como prototipo técnico; se conserva intacta su bisagra y la aceptación de claridad/móvil. Solo se ejecuta prompts/05-contact-spike.md.

## Plan verificable previo a código

1. Auditar versiones exactas compatibles de react-three-rapier, Rapier y transitivas, licencias, procedencia, scripts y avisos. Documentar costos y reutilización antes de instalar localmente, sin scripts de terceros ni cambios globales.
2. Crear un laboratorio aislado del motor de sesión: suelo fijo, balón dinámico esférico y pie cinemático. Usar APIs existentes, paso fijo, fricción/restitución ilustrativas, CCD, controles de pausa/reinicio y colliders visibles opcionales. Empezar con forma de prueba y después seguir el hueso del avatar existente.
3. Reutilizar avatar Quaternius, rig, ropa y Blender portable ya autorizados. Preparar un clip separado de interior-interior con cuerpo y balón sincronizados. Mantener los ajustes de hombros/brazos; registrar fuente editable, hash, validación glTF y estado draft. No modificar el recurso de bisagra.
4. Comparar ambos modos en la aplicación, cargando solo la escena elegida. Tutorial: AnimationMixer controla avatar y balón. Laboratorio: AnimationMixer controla avatar; Rapier controla balón; el pie cinemático recibe la pose del hueso antes de cada paso. No compartir un balón simultáneamente entre autoridades ni corregirlo con teletransportes ocultos.
5. Probar contactos lentos/rápidos con render a 30/60/120 Hz, pausa/reinicio, carga y recuperación de errores, separación de autoridades y límites del área. Verificar build, tipos, lint, formato, tests, consola y capturas reales en navegador. Registrar mediciones y limitaciones, sin atribuirlas al móvil físico hasta comprobarlo allí.
6. Actualizar registros de licencias/assets/reutilización y PROJECT_STATUS, documentar mínimo necesario para tutorial, crear punto de control local. Detenerse antes de fase 06.

## Criterios de cierre

- Contacto real calculado por Rapier; entrada cinemática reproducible; evidencia del caso rápido y lento, incluida cualquier diferencia entre tasas.
- Clip guiado inspeccionable con pausa/tiempo exacto, contacto comprensible y trayectoria identificada como ilustrativa. No se presenta como predicción física ni ejercicio aprobado.
- Reinicio explícito y reloj propio del laboratorio; no acreditar entrenamiento, no alterar el motor de sesión.
- Dependencias y WASM empaquetados localmente; sin CDN, cuenta, pagos, publicación ni herramientas globales.
- Informar cualquier pendiente real de revisión visual/deportiva/dispositivo. El éxito técnico no acredita técnica, dosis, transferencia ni rendimiento garantizado.

## Fuera de alcance

Ragdoll, solver propio, controlador de drible, aerodinámica, partido, sesión completa, audio, persistencia, PWA/offline de servidor, exportación Remotion y fases 06–09.
