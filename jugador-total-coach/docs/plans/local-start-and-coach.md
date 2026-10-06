# Inicio autónomo y conversación local

2026-10-06. Trabajo autorizado para completar el producto. Se suma a los planes/calendarios y la enseñanza existente, sin cambiar dosis ni guardar datos privados en Git.

## Inicio de la aplicación

Problema observado: la aplicación deja de responder si no existe un proceso que sirva el build. La IP Wi-Fi también cambia. Crear un lanzador local para Windows usando Node y Vite ya disponibles: comprobar build/dependencias, reutilizar un servidor Fut360 existente o iniciarlo oculto, comprobar respuesta y mostrar las direcciones vigentes. Abrir la URL local en el navegador. No servicio global, arranque de Windows, firewall, instaladores ni descarga automática. Si otro proceso ocupa el puerto, informar sin detenerlo. LAN solo sobre una dirección privada identificada; no enlazar indiscriminadamente todas las interfaces.

Verificar inicio idempotente, detección de servidor/puerto incorrecto, URLs válidas y respuesta real de localhost/LAN. Conservar el acceso actual 4173/4174 y todo el almacenamiento de navegador. Una dirección LAN nueva no migra los datos de un origen anterior.

**Implementado y comprobado:** `Abrir Fut360.cmd`, `tools/start-local.mjs` y comando `start`. Cuatro pruebas cubren selección de interfaz privada, identidad/versión del servidor y distinción entre puerto libre y error de acceso. Ensayo real en puerto efímero: Vite arrancó, respondió con el build esperado y la segunda llamada reutilizó el mismo servidor; se detuvo solo el proceso creado para esa prueba. Los servidores de uso en 4173/4174 respondieron `ready` y el lanzador los reutilizó sin duplicarlos. No se atribuye doble clic físico en Windows ni prueba del teléfono/TV. Typecheck/lint y 299 pruebas aprobadas, una opt-in omitida. No cambian aplicación compilada, calendario, dosis, DB 4 ni respaldos 3.

## Candidato conversacional

Antes de integrar un modelo, comprobar origen/licencia, hash, memoria/latencia y calidad con casos sintéticos; no usar datos reales durante evaluación. [Auditoría](../reviews/local-coach-candidate.md). El motor interpretaría solicitudes sobre el catálogo; el dominio conservaría audiencia, logística, dosis permitidas y validación. Sin herramientas de shell, escritura de archivos arbitrarios, llamadas cloud, credenciales de Codex o capacidad de sobrescribir historial. Las sugerencias no se adoptan silenciosamente. La revisión documental no es alta deportiva ni certificación de nivel.

Bloqueo material observado: espacio libre insuficiente. No iniciar la descarga de pesos hasta verificar margen suficiente. El trabajo independiente del modelo continúa. Un planificador por reglas puede ayudar, pero no se presentará como conversación con IA ni como sustituto de todo el requisito.
