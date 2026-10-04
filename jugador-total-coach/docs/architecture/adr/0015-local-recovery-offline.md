# ADR 0015 — Recuperación local y copia sin conexión
Fecha: 2026-10-03. Estado: implementado con límites registrados. Autorización: petición del usuario de completar el producto y las animaciones; conserva prohibiciones de pagos, publicación y cambios globales.

## Decisión
Reutilizar IndexedDB, Cache Storage y Service Worker nativos; sin dependencias nuevas ni backend. Guardar cada sesión en una transacción junto a revision/propietario y puntero a la sesión activa. Revisión compare-and-swap impide que una ventana antigua sobrescriba la más reciente; tomar control requiere pulsar Recuperar.

El archivo portable v1 contiene el journal versionado del motor (comandos aceptados, avances e interrupciones), definición compilada de contenido y feedback opcional. El motor reconstruye su proyección y eventos de forma determinista; las pruebas comparan ambos antes/después. Avances contiguos se compactan: el journal no es una tabla literal de TrainingEvent. Los eventos de dominio reconstruidos conservan orden/identidad; el feedback actual es un dato editable aparte, no se declara event-sourcing completo de notas. Esta precisión sustituye el formato físico anticipado por DOMAIN_MODEL sin alterar el contrato del reloj.

Guardar en comandos, ocultación y cada segundo; no depender de unload. Una terminación brusca puede perder el último intervalo/escritura pendiente, sin garantía absoluta ante fallo de disco. Mostrar guardado solo tras completar IndexedDB; un error pausa y permite exportar el candidato recuperable. Al recargar se solicita recuperación y se restaura pausado, sin acreditar tiempo cerrado. Referencia de contenido/mode diferente bloquea reanudación, permite exportar/cerrar incompleta. No hay migración silenciosa.

Importación: máximo 10 MiB, 1.000 registros y 100.000 entradas de journal en total. Validar versión, forma, plan y replay; resumen antes de escribir. Idéntica sesión es no-op; mismo ID con contenido distinto cancela toda la transacción. Eliminar un registro completo es explícito y no debe recrearlo el guardado periódico.

## Offline
El build calcula versión desde bytes/rutas y genera lista de todos los recursos distribuibles (sin sourcemaps). Preparación explícita guarda app, GLB y motores locales. Confirmación comprueba presencia de todos los archivos; permite volver a prepararlos si fueron eliminados. Cache.addAll conserva atomicidad del lote. Actualización espera una acción explícita, deshabilitada mientras la sesión de esta ventana está activa; no prometer coordinación de actualización entre todas las ventanas.

Se ha probado recarga con red bloqueada en Chromium. HTTP de LAN no es contexto seguro: el Samsung puede probar la app por LAN, pero instalación/SW exigen HTTPS o un origen local seguro. No se modifican certificados, firewall o configuración global. La instalación nativa desde el menú y la nueva versión en Samsung físico siguen pendientes de prueba. El navegador puede eliminar almacenamiento; exportar sigue siendo necesario.

## Costos y límites
Sin claves, cuentas, nuevas instalaciones ni medios externos. Espacio en disco y almacenamiento del navegador finitos; sin promesa de respaldo permanente, nube gratuita o sincronización entre dispositivos. Conversación, composición flexible y nueva dosificación continúan pendientes, no simuladas con un formulario.
