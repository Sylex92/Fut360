# Video original como referencia de enseñanza

2026-10-03. Decisión: admisible condicionado para reproducción online desde el reproductor oficial; no descarga ni redistribución. Autorización del usuario: priorizar video delimitado cuando el avatar no enseñe con claridad. El modo local conserva fichas/plan y recursos propios; no se declara que los videos estén disponibles offline.

## Fuentes comprobadas
- [IFrame API](https://developers.google.com/youtube/iframe_api_reference): `loadVideoById`/`cueVideoById` admiten inicio y fin. El inicio puede ajustarse a un keyframe; `seekTo` elimina la garantía nativa de endSeconds. La primera reproducción se prepara con ambos límites; las repeticiones usan seekTo/playVideo y un supervisor independiente cada 200 ms detiene/repite al alcanzar el final. Se adoptó tras observar que recargar el mismo video a veces quedaba en buffering. No se promete precisión de fotograma ni ausencia de anuncios. Errores 100/101/150/153 distinguen disponibilidad, inserción e identificación.
- [Parámetros oficiales](https://developers.google.com/youtube/player_parameters): controles visibles, playsinline, origen de la aplicación y viewport mínimo. La app conserva el reproductor sin superponer instrucciones ni ocultar marca/controles.
- [Ayuda de inserción](https://support.google.com/youtube/answer/171780): youtube-nocookie para privacidad mejorada. No elimina toda comunicación ni publicidad; el autor puede impedir inserción. Vídeos con restricciones pueden exigir abrir YouTube.
- [Políticas](https://developers.google.com/youtube/terms/developer-policies): no descargar/cachear medios de YouTube ni alterar anuncios o componentes. Enlaces y atribución visibles; sin audio alternativo ni extracción de transcripciones.

## Costos y límites
Sin claves de Data API, npm nuevo, cuentas obligatorias ni tarifa integrada. Internet/datos, publicidad, cambios del proveedor, retirada/privatización, limitaciones regionales y dispositivos son condiciones reales. No usar planes Premium como requisito de funcionamiento. Iniciar el proveedor solo después de pulsar Ver video; aviso corto de conexión externa. Los datos de plan/seguimiento no se envían al video; se solicita el video elegido con origen HTTP normal. Política de privacidad enlazada.

Crecer en número de ejercicios no implica acceso ilimitado a todos los cursos, ni permiso para generar un archivo offline de los canales. Video propio/CC compatible puede resolver una futura necesidad offline tras auditoría concreta. No se contrata ni se instala nada ahora. La precisión del movimiento se obtiene mostrando la referencia humana original; no se promete extraer automáticamente una animación 3D idéntica.

## Separación temporal
El reloj de práctica y el video son distintos. Ver un tutorial no acredita trabajo. El video puede estudiarse antes de comenzar; los anuncios y buffering no se convierten en repeticiones. Las fichas conservan instrucciones propias y una alternativa visible si falla la referencia. Si no hay fragmento observado, se indica pendiente en vez de vincular un ejercicio parecido como si fuera el mismo.
