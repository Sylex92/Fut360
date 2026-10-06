# Video humano local y vista de TV

2026-10-06. Continuación autorizada expresamente por el usuario. No se requiere otra autorización de implementación o los datos personales ya recibidos. La negativa automática a la descarga del turno anterior quedó resuelta por la respuesta del usuario; los botones oficiales funcionaron en esta ejecución.

## Entregado

- Dos originales de FIFA se reproducen localmente mediante HTMLVideoElement, con controles del navegador, velocidad, repetición, atribución y enlace a la fuente. Sin iframe de FIFA, extracción de YouTube, anuncios insertados por un proveedor ni conexión multimedia externa en estas fichas.
- Componentes humanos en S01/S04 y Y01/Y02/Y04/Y07/Y08/Y09. La demostración automática infantil ya tiene una vía compatible local. Las diferencias entre el fragmento y la tarea propia se explican junto al ejemplo. YouTube infantil continúa bloqueado; son decisiones independientes.
- Carga detiene el reloj; fallo conserva pausa hasta intervención. Pausa manual prevalece sobre recarga/disponibilidad. Velocidad del ejemplo no cambia tiempos/dosis. Ocultación se integra con el comportamiento vigente del recorrido.
- Caché opcional de los originales locales y búsqueda por rangos HTTP sin conexión. El panel muestra el tamaño estimado de la copia. No almacena videos de YouTube. La prueba inicial fue de 94.259.575 bytes; consultar `dist/offline.json` para el tamaño de cada build.
- Vista TV: texto/controles grandes, foco visible, flechas en orden de lectura, salida de listas sin alterar su valor, Escape y tecla multimedia. Reutiliza controles HTML; no es un APK ni un receptor Cast. No se acredita funcionamiento del mando Sony sin probar el aparato.

## Procedencia, derechos y costo

Fuentes oficiales: [Speed and control](https://www.fifatrainingcentre.com/en/practice/grassroots/8-to-12/speed-and-control.php) y [términos de FIFA Training Centre](https://www.fifatrainingcentre.com/en/terms-of-service.php), revisados el 2026-10-06. El apartado 6.4 contempla exhibición no comercial, condicionada a atribución/enlace y ausencia de respaldo implícito. Nuestra decisión es **admisible condicionado para el uso personal local no comercial actual**; no equivale a licencia abierta, permiso comercial o redistribución general. Los botones oficiales descargaron sin cuenta ni pago. Se conservan marcas y originales íntegros; los intervalos se aplican solo durante reproducción.

El [manifiesto](../../assets/manifests/local-teaching-media.json) registra fuente estable, archivo original, bytes, SHA-256, duración y fecha. Nunca guardar URLs firmadas. `assets/downloads/` y `apps/coach-pwa/public/media/` están excluidos de Git. Vite verifica hashes antes de copiar; no descarga al compilar. Una copia pública/comercial del producto necesita reevaluar derechos o sustituir estos medios por recursos propios/licenciados; no se promete un costo futuro nulo. Sin dependencia, API, cuenta, instalador ni configuración global nueva. Espacio, decodificación MP4 y cuota de caché dependen del equipo/navegador; ante fallo se informa y pausa.

Para reconstruir esta copia local: usar en la página oficial el botón `download-video` de Warm-up y Skill development; guardar respectivamente en `assets/downloads/fifa-speed-control/warm-up.mp4` y `skill-development.mp4`, conservando los bytes registrados. Ejecutar `node tools/pnpm.mjs build`. Si la fuente cambia el archivo, revisar y actualizar la evidencia; no omitir el control de integridad. Sin el original permitido no se declara esa demostración disponible.

## Correspondencia y revisión visual

Inspección por muestras, sin afirmar revisión de todos los fotogramas ni validación biomecánica profesional. Se examinó el contexto de todo el original mediante una muestra cada tres segundos y muestras adicionales: Warm-up 8/22/36/50 s; Skill development 12/22/35/55 s. El antiguo bloqueo/buffering de 55 s quedó resuelto con el archivo local. Los tramos seleccionados se reprodujeron en la app y se probaron sus fronteras. Las muestras muestran niños conduciendo/pasando en un campo, relevos por colores y variantes posteriores; no una rutina individual completa.

| Archivo / duración | Tramo usado | Correspondencia y límite |
|---|---|---|
| Warm-up · 67,48 s | 8–24 s | Conducción y paso por puertas. S01/Y01 adaptan a un recorrido individual. Y02 solo comparte la conducción: señales y parada del semáforo no aparecen |
| Skill development · 69,44 s | 12–40 s | Conducción, pases rasos y recepción por parejas. Y04 añade elección de puerta; S04 cambia a recepción de balón propio; Y07 usa adulto fijo; Y08 usa la puerta como meta sin portero; Y09 cambia a desplazamiento lateral pautado. No marcar como secuencias exactas |

Se investigaron además Together towards goal (20/27/34/43 s) y Shooting / Skill development. El primero incluye defensores y portero; no se incorporó como variante cooperativa. El segundo se descargó oficialmente para inspección, con autorización: `TCSession037_2PR_ENG_premium.mp4`, 30.863.695 bytes, SHA-256 `1cb897b11d16865b6ae39d5f6cfae96457fd256639c3008e6e1cb2ab33398a05`, 60,04 s. Revisión cada tres segundos y cada 0,5 s entre 43–50,5. Se observa golpeo elevado; **excluido de Y08**, que pide pase raso con interior. Original en `assets/downloads/fifa-shooting/skill-development.mp4`, sin empaquetar ni sumar al inventario. No confundir adquirir un candidato con aprobarlo.

La biblioteca queda en **69 fichas / 32 familias: 17 referencias del gesto, 17 componentes, 35 sin video integrado**. Seis infantiles tienen componentes locales; ninguna se reclasifica como demostración exacta. [Inventario generado](../training/COACHING_LIBRARY_INVENTORY.md). Los textos/esquemas propios explican la tarea, pero no cubren por sí solos la petición de demostraciones humanas completas.

## Verificación

Typecheck, lint, formato y build correctos; 295 pruebas aprobadas y una opt-in omitida. Advertencia existente de bundles >500 kB. Inspección visual de la ficha Y08 en vista TV a 1920 px; originales y privacidad conservados.

Evidencia en [checks.json](evidence/local-human-video/checks.json). Navegador Chromium independiente, perfiles sintéticos; no se tocó la propuesta de la pestaña IAB ni los perfiles reales. IAB no expuso backend accesible.

- Reproducción MP4 real: Y01/Y07, límites, bucle y 0,5×; recorrido infantil con pausa manual, pausa desde controles nativos, recarga y ocultación simulada. Sin solicitudes externas ni errores de página.
- Fallo de descarga simulado: reloj detenido, Continuar bloqueado hasta carga correcta; reintento conserva pausa explícita.
- Offline real en un contexto aislado: preparar copia, desconectar contexto, recargar, reproducir y buscar a 30 s. Respuesta 206 `bytes 5000-5099/35714115`, 100 bytes, desde caché.
- Regresión YouTube simulada: carga, pausa, recuperación y velocidad aprobadas. Una aserción inmediata detectó una espera de render; se corrigió el test para esperar el estado visible, conservando la aserción de pausa y disponibilidad. No se modificó esa política de producción para hacer pasar el test.
- TV: navegación con teclado, valor de selector preservado, Escape, tecla multimedia simulada y ausencia de desbordamiento a 1920×1080 y 390×844. Esto no es prueba de mando, navegador o instalación de la Sony.

El calendario, las dosis, versiones de planes, observaciones e historial existentes no cambian. Continúan pendientes: variantes con demostración insuficiente, adaptación fundada en competencia, conversación desde la app, integración y prueba física de la TV, y comprobación física del incremento en Samsung. No se declara el producto completo ni revisión deportiva profesional por esta entrega.
