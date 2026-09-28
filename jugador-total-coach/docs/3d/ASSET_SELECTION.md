# Selección del avatar y las animaciones

## Orden

1. Buscar un humanoide existente gratuito y con licencia de contenido compatible.
2. Probar importación, rig, proporciones, huesos de pies, un clip y cámaras.
3. Evaluar recursos de animación gratuitos y retargeting con herramientas existentes.
4. Adaptar la animación faltante y revisar técnica; no fabricar un rig completo por comodidad.
5. Usar maniquí de primitivas solo para probar conexión técnica si no hay asset adecuado todavía.

Quaternius y Kenney son candidatos, no dependencias adoptadas. No se han descargado ni revisado sus archivos. Las funciones comerciales de sus sitios y las variantes Source no se incluyen.

## Decisión de evaluación para el primer gesto — 2026-09-27

Evaluar primero un humanoide de proporciones regulares de Universal Base Characters **Standard**, conservando su rig. Se prefiere por ofrecer un rig existente y una ruta de animaciones del mismo proveedor; la compatibilidad anunciada no demuestra importación ni técnica correcta. Elegir el archivo concreto después de inspeccionar el paquete, por legibilidad de cadera, rodilla, tobillo y apoyo; no por parecido con jugadores.

| Recurso | Verificado en la página del autor | Decisión y pendiente |
|---|---|---|
| [Universal Base Characters](https://quaternius.itch.io/universal-base-characters) | Standard 122 MB, precio libre; licencia anunciada CC0. Source 600 MB desde USD 19,99 e incluye archivos .blend | Standard es el primer candidato. No comprar Source ni asumir que sus fuentes están en Standard. Confirmar licencia interna, archivos, rig y editabilidad |
| [Universal Animation Library](https://quaternius.itch.io/universal-animation-library) | Standard 15 MB, precio libre; CC0. Pro desde USD 9,99 y Source desde USD 14,99 | Inventariar Standard; no atribuirle todos los clips anunciados para la biblioteca. Hip-hinge y técnica con balón todavía sin cobertura verificada |
| Kenney | Auditoría de 00 enlazada abajo; ningún archivo inspeccionado | Considerar props simples cuando el ejercicio los necesite; no añadir una biblioteca completa por anticipación |

Precios/tamaños son los publicados al consultar el 2026-09-27, no compromiso futuro ni archivos descargados. CC0 anunciado permite evaluar la vía sin pago obligatorio; la incorporación espera evidencia del archivo concreto en ASSET_LICENSES.md.

Una fuente editable puede ser el modelo riggeado importado legalmente en Blender y guardado con las adaptaciones del proyecto. No tiene que ser el .blend original de pago. Debe demostrarse una ida y vuelta de importación/edición/exportación que conserve rig, pesos y animación; si falla, corregir la importación o evaluar otro recurso compatible sin rehacer el rig entero.

La primera carencia a resolver es la representación de hip-hinge definida en la ficha. Un clip de saludo o caminar solo sirve para comprobar la conexión del rig. Si falta el gesto, adaptar o preparar esa animación sobre el rig adoptado con herramientas de Blender. No sustituir el ejercicio por el contenido más fácil de encontrar ni declarar que una biblioteca de locomoción enseña fútbol.

Blender es la herramienta de autoría prevista, no un requisito para el bootstrap 02. Su preparación corresponderá a 04 si la adaptación del primer gesto lo necesita. Versión, compatibilidad gráfica y distribución local concreta siguen pendientes; el equipo no ha ejecutado una prueba de Blender. Véanse [pipeline](ANIMATION_PIPELINE.md), [primer ejercicio](../plans/first-visible-exercise-ready.md) y [auditoría de reutilización](../reviews/reuse-audit.md).

## Calidad mínima del MVP

Pies y apoyos visibles; izquierda/derecha indicadas con texto además del color; suelo con referencia 2×2; contraste; no cortes de cámara sobre el contacto; nada de desenfoque o efectos que oculten articulaciones. La cámara no modifica la velocidad de la sesión.

El área de seguridad incluye avatar, balón y props, no solo el centro del modelo. Un ejercicio que necesita una silla debe mostrar dónde está y conservar espacio útil. No dibujar una sentadilla búlgara cuando se pide sentadilla dividida con ambos pies en el suelo. No convertir un giro suave con pasos en torsión sobre un pie fijo.

Cada archivo registra URL, autor, versión/fecha, hash, licencia, variante gratis, formato editable disponible, modificaciones y revisión. Si el contenido no tiene licencia verificable, no se incorpora.

## No prometer una biblioteca de técnica ya resuelta

La existencia de una biblioteca general de animación no demuestra que tenga los movimientos del catálogo. El inventario debe separar: reutilizable tal cual, requiere adaptación, falta, no redistribuible. Sin cobertura real no se declara completa la sesión.

Fuentes adicionales: S10, S11 y S12 en [SOURCES.md](../research/SOURCES.md). La [comparación de IA](../reviews/ai-production-tools-review.md) permanece como vía opcional para carencias concretas, sin cuenta, modelo ni salida incorporados.
