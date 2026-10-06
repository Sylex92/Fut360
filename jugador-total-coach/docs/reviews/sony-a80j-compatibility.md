# Sony A80J: ruta concreta y condiciones

Incremento 2026-10-06: vista TV implementada dentro de la web, con controles/texto grandes, foco, navegación por flechas en orden de lectura y tecla multimedia. Comprobación de teclado y viewport 1920×1080 en Chromium; emulación a 390 px conserva layout. [Evidencia y límites](local-human-video.md). Todavía sin acceso/prueba del aparato, navegador instalado o mando físico. Las teclas dentro de iframes externos las gestiona el proveedor; esta vista no acredita una experiencia Android TV nativa ni resuelve distribución/sincronización.

Revisión documental 2026-10-04. Modelo declarado por el usuario: Sony A80J. No se han inspeccionado físicamente su firmware, aplicaciones, red ni mando. No se infiere tamaño de pantalla de la variante consultada.

## Verificado en documentación oficial

Sony identifica la familia A80J como Google TV; su ficha técnica identifica Android TV como sistema y Chromecast integrado. Son descripciones compatibles de la experiencia y plataforma. La ficha de la variante XR-77A80J indica Vewd como navegador no preinstalado; esto no acredita su disponibilidad actual en la tienda o región del aparato. [Producto Sony](https://electronics.sony.com/tv-video/televisions/all-tvs/p/xr77a80j), [especificaciones](https://www.sony.com/electronics/support/televisions-projectors-oled-tvs-android-/xr-77a80j/specifications).

Google permite enviar una pestaña de Chrome desde una computadora a un televisor con Google Cast conectado a la misma red. Esto ofrece una primera prueba de visualización usando el equipo existente, conservando los controles en la computadora. No equivale a instalar la PWA en TV ni demuestra que el mando opere todos sus botones. [Instrucciones oficiales](https://support.google.com/chromecast/answer/3228332?hl=es).

Registrar un receptor Cast propio requiere cuenta de desarrollador y la documentación indica una tarifa de registro de USD 5. No se adopta esa vía como dependencia del producto sin pagos nuevos. Enviar una pestaña mediante la función existente de Chrome es una vía diferente y no exige desarrollar ese receptor. [Registro y tarifa](https://developers.google.com/cast/docs/registration?hl=es-419).

## Decisión y costos

| Vía | Estado | Condiciones y límite |
|---|---|---|
| Pestaña de Chrome enviada desde PC | Primera candidata a prueba | Sin compra adicional propuesta; necesita computadora, TV y red. Latencia, audio, video delimitado y legibilidad pendientes. El control sigue en PC |
| Navegador directamente en TV | Pendiente de evaluación concreta | Verificar aplicación disponible, licencia/costo, motor, IndexedDB, mando, WebGL2 y videos. No asumir Chrome móvil ni PWA instalable |
| Aplicación Android TV propia | Alternativa por estudiar si navegador no cumple | Desarrollo, herramientas, distribución y permisos tienen auditoría propia. No instalar SDK, APK ni publicar por esta revisión |
| Receptor Cast personalizado | No elegido bajo costo cero | Tarifa de registro, infraestructura y mantenimiento por resolver; innecesario para la prueba inicial de pestaña |

La primera vía permite explorar la pantalla grande, pero **no cierra la entrega Smart TV** comprometida. Falta una experiencia manejable, evidencia del aparato y una continuidad de datos definida. La transmisión tampoco sincroniza automáticamente dos bases locales distintas.

## Prueba pendiente del aparato

Abrir la aplicación en Chrome de PC, seleccionar Enviar en el menú del navegador y elegir la A80J en la misma red. Mantener la pestaña visible: la pausa por ocultación del producto sigue vigente; no desactivarla solo para simular que Cast funciona. Comprobar reloj, preparación extra, demostración, audio, lectura a distancia y fin de conexión. No usar solo el botón Cast del video como evidencia de transmitir toda la aplicación.

Si se opta por navegador de TV, comprobar flechas/selección/volver, foco visible, posibilidad de pausar y añadir tiempo sin desplazarse por una página extensa, recuperación tras cierre, recurso no disponible y límites del proveedor de video. Un ensayo a 1920 px en PC no sustituye esas verificaciones. No se solicitan compras ni instalaciones en esta revisión.
