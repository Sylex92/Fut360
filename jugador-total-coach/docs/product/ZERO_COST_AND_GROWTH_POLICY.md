# Política vigente — costo cero y crecimiento funcional

Fecha: 2026-09-24. Requisito confirmado del usuario. Sustituye la obligación anterior de usar exclusivamente software open source.

## Objetivo y alcance

Construir y ejecutar el MVP local sin nuevos pagos obligatorios de software, servicios o contenido. Se excluyen del presupuesto la cuenta Pro y los tokens de Codex que el usuario ya decidió utilizar para desarrollar. La aplicación entregada no dependerá de esa suscripción.

Se admite software abierto, source-available o propietario con licencia gratuita, siempre que el uso concreto esté permitido, resuelva la necesidad y no obligue a pagar por las ampliaciones funcionales previstas. El código abierto es una preferencia de portabilidad, no una condición excluyente.

«Autoescalable» significa aquí extensible: poder añadir funcionalidades sin bloquear la licencia gratuita. No significa servidores que crecen automáticamente ni capacidad ilimitada de cómputo, usuarios o almacenamiento.

## Condiciones de selección

- El flujo local básico debe seguir funcionando sin API de pago, cuenta de terceros, créditos temporales ni renovación pagada obligatoria.
- No elegir trials, ofertas de duración limitada o un free tier consumible como única vía para una función esencial.
- Las herramientas gratuitas no abiertas son admisibles si permiten los usos previstos. Registrar condiciones de equipo, ingresos, automatización, distribución, uso comercial, contenido y versiones. No confundir número de funciones con elegibilidad de licencia.
- Un límite ajeno a las funciones no descarta automáticamente la herramienta, pero exige una evaluación explícita y una estrategia de sustitución. No aprobar crecimiento ilimitado que la licencia no cubra.
- Preferir recursos editables/exportables con derechos compatibles. Las licencias de modelos, voces, texturas, fuentes, codecs y plugins se revisan por separado de la herramienta.
- Ningún agente puede contratar, activar un plan de pago o introducir una obligación de gasto sin autorización expresa.

## Tres decisiones posibles

**Admisible:** uso y ampliaciones previstas cubiertos a costo cero, con evidencia.
**Admisible condicionado:** cubre el escenario actual, pero tiene disparadores conocidos de nueva evaluación; debe quedar aislado y documentado.
**Pendiente/bloqueado:** derechos o costo desconocidos, o requisito que fuerza pago sin alternativa gratuita aceptable.

Admisible no equivale a instalado, probado o incorporado al MVP. La fase de trabajo y la utilidad técnica se aprueban aparte.

## Remotion

Puede evaluarse como exportador local opcional bajo esta política, sin solicitar una excepción por no ser open source. Ver `docs/research/REMOTION_LICENSE_REVIEW.md` y ADR 0008. La exportación continúa fuera del MVP1 por alcance, no por veto de licencia. No se instala durante la auditoría.

## Ampliaciones y costos externos

Antes de cada función nueva, completar `FEATURE_COST_REVIEW.md`. Ejemplos: más ejercicios, sesiones de otra duración, estadísticas locales, escenas de cancha, importación manual de métricas, conectores de wearables, publicación social y exportación de video.

Cada proveedor nuevo se revisa de forma independiente. Que el motor de video sea gratuito no aprueba automáticamente el costo o acceso de una API de redes sociales, voz, IA o wearables.

Mantener formatos neutrales y módulos reemplazables. Desacoplar reduce trabajo de migración; no elimina obligaciones legales ni hace gratuito el tiempo de migrar. No crear adaptadores vacíos antes de necesitarlos.

La primera ruta debe utilizar el equipo existente y comprobar su rendimiento. Si resulta insuficiente, reducir calidad/carga o presentar alternativas antes de proponer compras. Hardware, energía y trabajo humano son recursos reales, no pagos que un software pueda garantizar eliminar. No se promete alojamiento público o capacidad infinita sin costo.

## Control y actualización

Fijar versiones, lockfile, fuentes y evidencias. Auditar actualizaciones y cambios de modelo de negocio. Conservar versiones no congela todas las condiciones ni autoriza usos que la licencia no cubra. No omitir parches de seguridad únicamente para evitar revisar una licencia.

El proyecto no se publica ni recibe una licencia pública para el código propio sin autorización. Sus datos locales son privados por defecto. No presentar el fixture deportivo como validado por haber calculado su duración.
