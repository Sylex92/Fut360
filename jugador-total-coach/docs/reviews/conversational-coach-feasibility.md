# Conversación dentro de Fut360: viabilidad, costo y límites

2026-10-02. Revisión documental conforme a [FEATURE_COST_REVIEW](../product/FEATURE_COST_REVIEW.md). Función solicitada: diseñar y revisar entrenamientos con un asistente desde la app. Uso personal local inicial; cualquier distribución o crecimiento exige otra revisión. Sin instalaciones, autenticación, acceso a credenciales ni llamadas de inferencia realizadas.

## Evidencia actual

El repositorio contiene reproductor, catálogo y compilación de una hora fija. No hay proveedor conversacional, almacenamiento de perfil ni planificador longitudinal implementados. La suscripción usada en este chat no conecta automáticamente al asistente con una PWA. El desarrollo con Codex y el uso de IA dentro del producto son escenarios distintos bajo la política económica.

Documentación oficial de OpenAI consultada directamente, usando OpenAI Docs:

| Fuente | Hecho documentado y límite |
|---|---|
| [Uso de un plan de ChatGPT mediante Sign in with ChatGPT](https://developers.openai.com/siwc/token-sharing-open-source) | Describe uso opcional del plan para solicitudes elegibles y aplicaciones abiertas/alojadas localmente, mediante autorización OAuth. No concede acceso a chats previos. Elegibilidad concreta de Fut360 privado, cuenta y modalidad: pendiente; no publicar el código para satisfacer una condición sin autorización. |
| [Codex app-server para esa modalidad](https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server) | Documenta integración conversacional y gestión de token/historial. Un catálogo de modelos no acredita acceso: requiere una solicitud completada. No se ha probado aquí ni se han leído tokens locales. |
| [Limitaciones de la modalidad en preview](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations) | Existen restricciones de entradas, herramientas y estado. No asumir funciones multimedia ni almacenamiento remoto de conversaciones; app-server conserva su propia continuidad local. Revisión necesaria antes de escoger implementación. |
| [Solicitud de client ID](https://developers.openai.com/siwc/request-client-id) | La ruta comercial general indica acceso selectivo/lista de espera. No confundirla con disponibilidad universal ni con la ruta de aplicaciones locales; la distinción de elegibilidad debe resolverse para el caso concreto. |
| [Precios de la API](https://developers.openai.com/api/docs/pricing) | La API ordinaria tiene cobro por uso de modelos/herramientas. No se selecciona modelo ni se calcula un gasto inventado. Una clave API no se da por incluida en la suscripción del usuario. |

Son hechos de documentación, no aprobación contractual completa ni prueba de acceso de esta cuenta. La disponibilidad, límites y términos pueden cambiar. No se han seleccionado versiones instalables de SDK/app-server, pesos ni proveedor definitivo: sus licencias/versiones y derechos de distribución permanecen pendientes hasta elegir una vía concreta.

## Opciones y dictamen

| Vía | Costo/requisitos | Ventajas, límites y decisión |
|---|---|---|
| Preparar aquí e importar una propuesta estructurada | Usa la conversación existente; la reproducción de lo importado sería local. Importador aún no implementado. | Ruta de transición sin nueva API obligatoria. No cumple por sí sola conversación dentro de la app; no presentarla como resultado final equivalente. |
| Planificador por reglas y edición manual | Reutiliza dominio/catálogo/UI locales; complejidad y autoría propias. | Puede componer sin modelo y servir de respaldo. No llamarlo IA ni atribuirle la capacidad de razonar de este chat. Admisible como diseño, todavía no implementado. |
| ChatGPT plan usage / app-server | Cuenta y autorización; disponibilidad, límites, uso privado local y términos por confirmar. Equipo anfitrión/conexión según arquitectura final. | Candidato que merece prueba de elegibilidad, no descartarlo afirmando que toda integración exige otra factura API. No garantía de ausencia de pagos, acceso ilimitado o funcionamiento offline. **Pendiente**. |
| Modelo local | Motor y pesos con licencias separadas; memoria, almacenamiento, rendimiento y calidad por medir. | Sin tarifa de inferencia del proveedor si la combinación es elegible, pero no se garantiza calidad/capacidad. No se descarga ningún modelo. **Pendiente**. |
| API cloud ordinaria | Consumo facturable, conexión y gestión segura de credenciales; backend/servicio mediador según arquitectura. | No admisible como requisito obligatorio de la solución de costo cero. Solo alternativa opcional tras autorización económica concreta; no activada. |

No se elige proveedor definitivo. Primer camino: contratos de plan/validación y reproducción independientes de IA; después comprobar elegibilidad y calidad de la modalidad integrada apropiada. Si una vía no cumple, continuar el núcleo y comparar alternativas, sin esconder que la conversación integrada sigue pendiente.

## Reutilización y piezas específicas

Reutilizar React, esquema/validación existentes, compilador y motor temporal. Ampliar formatos versionados y resolver recursos; no reescribir el reproductor ni crear un editor de rigging. Persistencia local aprovechará el trabajo de 08 cuando se ejecute. El proveedor conversacional debe quedar detrás de un adaptador; todavía no crear paquetes vacíos.

El modelo propone datos. La aplicación comprueba estructura, duración, equipo, espacio, lados, recursos y restricciones declaradas antes de activar un plan. No se conceden shell, escritura libre de archivos o facultad de modificar historial a una conversación de entrenamiento. Un output bien formado no prueba técnica, dosis o validez clínica.

## Privacidad y disponibilidad

Credenciales fuera de frontend, Git y logs. No extraer sesión/cookies de otra aplicación ni reutilizar archivos de autenticación de Codex como atajo. La integración debe usar su flujo documentado y permisos mínimos. No se acepta un servicio, crea cuenta o transmite perfil por esta auditoría.

Usuario informado del contexto que sale del dispositivo; enviar lo mínimo necesario y conservar posibilidad de exportar/borrar datos. Peso, síntomas, antecedentes y estudios reales no se incorporan a documentos del repositorio. Si el usuario selecciona un proveedor externo, no afirmar que toda la conversación es local.

Los planes preparados deben funcionar aunque expire una cuota o falle el proveedor. Cambios de proveedor no deben modificar las sesiones ya guardadas. PC y Samsung necesitan comprobarse por separado: un servicio en la computadora no está automáticamente accesible ni funciona cuando esta se apaga. No abrir puertos públicos, tocar firewall ni añadir sincronización cloud por anticipación.

## Condiciones para una prueba de integración

Elegibilidad y términos de la modalidad; versión/licencia exactas; costo y límites observables; autenticación sin claves en cliente; contexto permitido; borrador estructurado y validación; permisos mínimos; manejo de errores/cuota; no conexión durante reproducción de un plan guardado; pruebas de propuesta inválida, recurso inexistente, restricción ignorada y cambio de versión. Calidad deportiva evaluada con casos documentados, no solo texto convincente.

El modo local sin nuevas tarifas obligatorias sigue siendo requisito. Acceso a campo, gimnasio, especialistas o equipo puede tener costos externos que el software no elimina. Ninguna suscripción, compra, publicación o descarga queda autorizada por esta revisión.
