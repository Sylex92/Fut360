# Costos y reutilización — fase 07

2026-10-01. Aplicación de [FEATURE_COST_REVIEW](../product/FEATURE_COST_REVIEW.md). Función: integrar el recorrido local de una hora y sus controles para el usuario actual. Ampliación necesaria dentro de 07, sin contratar ni instalar.

| Recurso | Reutilización y estado | Costo obligatorio adicional / límites |
|---|---|---|
| Motor de sesión propio existente | Misma máquina de estados, eventos y contadores; añadir propósito explícito `training-draft` | Ninguno. La nueva etiqueta no otorga aprobación deportiva. |
| React 19.3.0, Three 0.186.1, Fiber 9.8.1 y Ajv existentes | Misma UI, visor, AnimationMixer y validación JSON Schema | Ninguno; mismas versiones/licencias del lockfile y [registro](../../ASSET_LICENSES.md). No nuevas dependencias transitivas. |
| 16 GLB, rig y ropa de 04–06 | Reproducción finita y vistas previas; archivos sin editar | Ninguno; fuentes/hash/derechos siguen en [ASSET_LICENSES](../../ASSET_LICENSES.md). No distribución/publicación nueva. Precarga consume RAM, transferencia y GPU locales; medir Samsung del nuevo flujo. |
| Web Audio del navegador | Oscilador breve creado localmente; activación por gesto, silenciable | Ninguno; no cuenta, archivo musical, cuota ni servicio. Políticas del navegador pueden impedir sonido; aviso visual siempre disponible. |
| JSON/compilador/composición de sesión | Crear solo secuencia, resolución de referencias, presentación y comprobaciones específicas | Trabajo de autoría/mantenimiento local; no prometer que futuros encargos profesionales o equipos sean gratuitos. |

Documentación técnica consultada: [MDN, Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices), 2026-10-01, para activación tras gesto y disponibilidad variable del sonido. No se incorpora contenido multimedia ajeno ni se depende de MDN al ejecutar.

Sin cuentas, claves, CDNs, modelos IA, exportadores ni telemetría añadidos. Un fallo de carga detiene el reloj y permite reintentar; no depende de que un proveedor remoto siga funcionando. No se habilita todavía offline/persistencia: eso requiere 08. El evento de fin y resumen viven en memoria; recargar descarta el recorrido y un aviso del navegador previene salida accidental durante ejecución si la plataforma lo admite.

**Admisible para uso local autorizado**, con revisión de rendimiento pendiente en hardware Samsung del flujo completo. Futuros sonidos de terceros, exportación/video, servicios o cambios de distribución requieren otra auditoría de derechos/contexto. Remotion sigue fuera del MVP1 y no se instala. La solución de sonido nativa conserva una alternativa visual sin pagos; no promete audio universal.
