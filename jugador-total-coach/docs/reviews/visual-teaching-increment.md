# Enseñanza visual: incremento del 2026-10-05

Continuación de los planes existentes. No cambia sesiones, dosis, perfiles, calendario, versiones o registros anteriores. No es cierre de los tres objetivos.

## Contenido incorporado

| Ficha | Recurso observado | Tramo | Alcance real |
|---|---|---|---|
| T29, talón alterno | [Peak Physio](https://www.peak-physio.com.au/exercise/heel-slides/) / YouTube WNUrEBrDwPc | 0–10,25 s | Gesto de deslizar y devolver el talón, incluidas ambas piernas. Fuente sobre camilla; adaptación a colchoneta explícita. No enseña la entrada al suelo |
| F01, sentadilla | [Peak Physio](https://www.peak-physio.com.au/exercise/squat/) / F7CQk7e8v50 | 0–8 s | Descenso y vuelta de pie. Cabeza parcialmente fuera del encuadre; no se usa la silla del fondo |
| S04, pase individual | [Unisport](https://www.youtube.com/watch?v=oIpRuzvsU80) | 159–167 s | Componente de apoyo, contacto interior y continuación. No muestra puerta y recuperación caminando |
| S02, conducción y finalización rasa | Mismo recurso anterior | 159–167 s | Solo contacto interior; conducción, objetivo y recogida conservan explicación propia. No se vende como secuencia completa |
| S01, conducción entre puertas | [Unisport](https://www.youtube.com/watch?v=naEccnjzLxM) | 76–86 s | Componente exterior y acompañamiento corporal. No demuestra todo el recorrido, giro o alternancia |
| W01, preparación | [British Heart Foundation](https://www.bhf.org.uk/informationsupport/heart-matters-magazine/activity/warm-up-exercises) / c41OYHF9BB8 | 102–109 s | Marcha suave de la persona de pie; no calentamiento completo ni dosis a copiar |

Se observaron muestras visuales en el reproductor público, no los videos completos. [Registro de tiempos y límites](../research/VIDEO_OBSERVATIONS.json), V09–V14. Se descartó el tramo de errores deliberados de Unisport alrededor de 224–240 s y un tutorial de tiro potente que no corresponde a S02. Los títulos, capítulos y popularidad no se toman como validación del gesto. NHS oLu9kwDzBdg permitió visionado público pero denegó la inserción real: se retiró del catálogo y se sustituyó por BHF, sin cambiar de host para eludirlo. Peak marching elevaba más las rodillas y no representaba bien el comienzo suave. Dos referencias de vuelta a la calma mostraron explicación hablada o pasos laterales; C01 sigue pendiente, sin rellenarla con un movimiento diferente.

## Reutilización y derechos

YouTube se reproduce mediante IFrame API oficial, controles/atribución/enlace conservados; medios sin descarga ni copia. Reutiliza dependencia y supervisor temporal existentes. No API de pago, cuenta obligatoria ni paquete nuevo. Se agrega velocidad usando `getAvailablePlaybackRates`, `setPlaybackRate` y `onPlaybackRateChange`; se muestra el valor confirmado, sin modificar reloj/dosis. [API oficial](https://developers.google.com/youtube/iframe_api_reference#Playback_rate), [condiciones previas](video-reference-cost-and-rights.md).

El contenido de Peak Physio y BHF se usa para observar la ejecución, no para heredar una prescripción clínica. No se adopta como universal el límite de profundidad/posición de rodilla de Peak. BHF publica una clase más larga que el calentamiento del plan; el fragmento no sustituye toda la preparación ni sus rótulos fijan nuestras repeticiones. No se copian transcripciones, capturas ni audio como archivos de producto.

## Alternativas infantiles investigadas

- YouTube conserva pendiente la designación aplicable: no cambiar el perfil a adulto ni añadir consentimiento para eludirla. [Designación](https://support.google.com/policies/answer/9664901).
- [FIFA, términos](https://www.fifatrainingcentre.com/en/terms-of-service.php): 6.4 contempla display no comercial con atribución y enlace, sin implicar patrocinio; 6.1 impide enmarcar la plataforma. Esto no acredita una licencia abierta general ni redistribución comercial. Los dos reproductores de [Speed and control](https://www.fifatrainingcentre.com/en/practice/grassroots/8-to-12/speed-and-control.php) ofrecen un botón de descarga; la primera duración comprobada es 67,499 s. La revisión automática rechazó el clic en ese botón por falta de autorización específica y condiciones insuficientemente verificadas en esa acción. No se descargó. Se solicitó aprobación limitada para revisar esos dos archivos mediante el botón oficial; pendiente de respuesta. No extraer playlists ni usar rutas alternativas para eludir el rechazo.
- [Sikana](https://www.sikana.tv/en/terms-conditions): reproducción autorizada íntegra y atribución, restricciones de recorte; la página observada usa YouTube. No resuelve los fragmentos infantiles actuales.
- Vimeo 1026276637 y wger mostraron comprobaciones de acceso; no se eludieron. MOJO/NSW también usan YouTube en las páginas inspeccionadas. No confundir otra marca de página con otro proveedor audiovisual.

## Verificaciones

Tipos, lint, formato, compilación y 282 pruebas correctas; una prueba opt-in omitida. Navegador independiente con proveedor simulado: activar una vez, carga/fallo, pausa manual, video pausado con reloj, prioridad de pausa manual y velocidad independiente. Se detectó una pausa por quedar el video fuera de pantalla al pulsar Comenzar; el inicio ahora centra la demostración, igual que Continuar. Los controles esperan al video preparado/reproduciendo, no solamente a que cargue la API. La prueba pasó después de ambas correcciones.

YouTube real: T29/F01/S01/S04/W01/S02 iniciaron dentro de su rango y quedaron pausados al final (desviación observada máxima de 0,020 s en estas seis ejecuciones; no garantía futura). S02 también reprodujo a 0,5× seleccionado desde la app y confirmado en el video real, deteniéndose a 167,009 s. Sin errores de página ni desbordamiento a 390×844. El aviso de bundles grandes permanece. [Evidencia](evidence/visual-teaching/checks.json), [prueba reproducible opt-in](../../tests/browser-visual-teaching.mjs). No se tocó el perfil real ni se probó un Samsung/Sony físico.

## Qué no queda cerrado

Ocho documentos revisados como UTF-8 y 252 enlaces locales comprobados, sin destinos ausentes; `git diff --check` correcto. Preview HTTP 200 en computadora y en la dirección LAN ya configurada. El servidor debe permanecer activo; no se creó un servicio global.

69 fichas: 17 con referencia del gesto y 11 con componente incrustado; 41 sin video incrustado. No equivalen a 28 demostraciones completas. En los recorridos individuales iniciales sigue faltando la vuelta a la calma humana; calentamiento y tres tareas de cancha tienen componentes, no secuencias completas. La biblioteca infantil aún no tiene reproducción humana integrada. Siguen pendientes otras variantes, adaptación por competencia, conversación real y pruebas físicas actuales Samsung/Sony. No culpar exclusivamente a las licencias por el trabajo de selección/enseñanza adulto que falta.
