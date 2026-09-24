# Pruebas de aceptación: licencias, contacto y claridad

Esta es una especificación de pruebas. Todavía no se han ejecutado en una app.

## Licencias / coste

- Inventario de librerías y transitivas del lockfile: versión, licencia y origen.
- Inventario de assets descargados con hash/licencia; prohibido marcar conocido un archivo no revisado.
- Build local documentado sin servicio de IA.
- Reproducción del catálogo sin red y sin claves.
- No peticiones a terceros, anuncios, analítica ni CDNs necesarias.
- El núcleo y MVP1 no requieren exportador de video ni render de pago. Su incorporación futura se rige por ADR 0008.
- Aceptar licencias gratuitas compatibles aunque no sean open source; verificar restricciones reales.
- Cada funcionalidad nueva incluye revisión de costo/derechos. No prometer escala o gratuidad ilimitadas.
- Quitar/desactivar un adaptador opcional no debe impedir el entrenamiento local; probarlo cuando exista.

## Avatar / tutorial

- Esqueleto reutilizado; documentar mapping.
- Tres vistas muestran apoyos, rodilla y pie de contacto sin oclusiones relevantes.
- A un tiempo de clip igual se obtiene una pose equivalente dentro de tolerancia declarada.
- Pausa/reanudar no mueve solo el balón o solo el cuerpo.
- Repetir no acumula traslación ni sale del 2×2, incluyendo props.
- Identificación de izquierda/derecha no depende solo del color.
- Cues y animación representan el mismo ejercicio/variante.

## Laboratorio Rapier

- Balón dinámico cae al suelo fijo sin atravesarlo de forma visible en el caso documentado.
- Pie cinemático produce contacto sin teletransportar continuamente el balón.
- Fricción y restitución son configuración, no un solver casero.
- Pausa congela todo; reset restaura el estado.
- Pruebas a diferentes tasas de render conservan resultados dentro de tolerancia.
- CCD se evalúa en casos rápidos; límites conocidos se documentan.
- La escena no se vende como simulación validada de potencia, lesión o técnica humana.

## Salida MVP1

La hora suma 3,600 segundos y todos los ejercicios tienen recursos reales revisados. La prueba acelerada del reloj no sustituye la revisión de la reproducción a velocidad normal ni el ensayo en el dispositivo elegido.
