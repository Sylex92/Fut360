# Fuerza, movilidad y protección con referencia humana

2026-10-06. Continúa la entrega autorizada; conserva perfiles, planes, dosis, calendario, historial y formato de respaldo. Siete fichas ganan referencia integrada: seis del gesto y una de un componente. La biblioteca contiene ahora 69 fichas, 23 con gesto, 18 con componente y 28 sin video integrado. No es cierre del producto ni demostración completa de todos los planes.

## Selección y correspondencia

| Ficha | Fuente pública | Tramo | Qué se observó y límite |
|---|---|---|---|
| F02 | [The Musculoskeletal Clinic](https://www.youtube.com/watch?v=qQ5KhRESzDs) | 180–188 s | Dos bisagras sin carga, vuelta de pie, cuerpo entero de lado. Brazos al frente como ayuda; no copiar la amplitud si se pierde control |
| F04 | [South Tees NHS](https://www.southtees.nhs.uk/resources/combined-press-ups/) / kmzcmFZ9NyY | 8–26,7 s | Colocación y flexiones; detalle separado de pies. Termina después de un retorno y antes de créditos. No todo el cuerpo en un solo encuadre |
| F06 | [Sports Rehab Expert](https://www.youtube.com/watch?v=JCVKPOdoA08) | 25–56,5 s | Elevar pelvis, sostener y descender a partir de rodillas flexionadas. Un lado y brazo superior alto. La duración del ejemplo no sustituye la sostención breve de la ficha |
| T27 | [North Bristol NHS](https://www.nbt.nhs.uk/our-services/a-z-services/physiotherapy/specialist-physiotherapy-service/therapy-erehab-video-resources/therapy-erehab-knee-instability) / jHtYBWfQX4M | 1–11 s | Base dividida fija y descensos/retornos, ambos pies sobre suelo, talón trasero elevado. Cabeza parcialmente fuera de plano; no búlgara ni obligación de tocar el suelo |
| T28 | [The BeFit Physio Method](https://www.youtube.com/watch?v=432xTSQpaG0) | 42–50,5 s | Tracción y devolución en polea, pies apoyados, cambio de cámara. La carga de la fuente no prescribe la del usuario |
| T30 | [Peak Physio](https://www.peak-physio.com.au/exercise/ankle-dorsiflexion-knee-to-wall/) / Y48sAE4m2Uc | 0–8,1 s | Dos avances/retornos de rodilla conservando talón. Detalle de tobillo, sin manos/cabeza. No forzar distancia ni heredar dosis clínica |
| T03 | [FIFA · Gary Phillips](https://www.fifatrainingcentre.com/en/practice/futsal/fitness/strength-through-shielding.php) | 176–187,5 s | Protección y giros bajo oposición. Solo componente: no recepción previa/descarga a un tercer jugador. No usarlo para la variante infantil sin choque |

Muestras y fronteras registradas en [VIDEO_OBSERVATIONS](../research/VIDEO_OBSERVATIONS.json), V15–V20; no visionado continuo íntegro. T03: muestras del original cada 5 s de 0 a 190, más cada segundo de 174 a 188, y reproducción real del fragmento. Su original dura 193,8 s, 1920×1080. No se adopta la tanda de 30 s de FIFA ni su contacto como dosis inicial infantil. En fuerza se observa representación de patrones ya elegidos; no se heredan promesas de rehabilitación, prevención, postura o rendimiento de los autores. Fundamentación y detalles de investigación quedan en documentos, no en el portal.

Se descartaron Peak Wall push up por encuadre sin pies, Good Vibes y CHA por no mostrar descenso final de plancha en las muestras, y Physio REHAB QRF0_7oR0u0 por acceso exclusivo de miembros. No se intentó eludirlo ni se adquirió una suscripción. El recurso elegido para F06 sí vuelve al apoyo al final.

## Derechos, costo y reutilización

Los seis YouTube se insertan mediante el reproductor oficial existente, sin descarga, transcripción o capturas redistribuidas. Permanecen atribución, controles y enlaces. La disponibilidad, anuncios y activación dependen del proveedor; [auditoría](video-reference-cost-and-rights.md). Infancia conserva su restricción independiente.

FIFA: original obtenido por el botón oficial de descarga, conservado íntegro en assets/downloads/fifa-shielding/strength-through-shielding.mp4 y fuera de Git. Archivo original Fitness_12_Philips_Screening_exercise_v2_ENG_srt_premium.mp4; 99.893.192 bytes; SHA-256 3d0825a467d11d07b549022286a824b52606a4d955e9331fa9dddf15e73df4c6. [Manifiesto](../../assets/manifests/local-teaching-media.json). Misma interpretación condicionada de exhibición personal no comercial del §6.4, atribución y enlace, integridad de marcas; sin iframe de plataforma ni licencia abierta inferida. [Términos](https://www.fifatrainingcentre.com/en/terms-of-service.php), [adquisición/reproducción](local-human-video.md). Antes de publicar, redistribuir o comercializar hay que revisar derechos. El build comprueba hash y presencia; no descarga archivos. La copia offline opcional completa ocupa aproximadamente 185 MiB con este incremento.

No dependencias, servicios de pago ni cambios globales nuevos. Reutiliza catálogo, YouTube, HTMLVideoElement, validación de archivos y caché con rangos. No modifica el motor temporal ni datos privados.

## Comprobaciones

[Evidencia](evidence/strength-human-video/checks.json): los seis YouTube se reprodujeron dentro de la app desde su inicio hasta su frontera y quedaron pausados, desvío observado máximo 0,018 s. T03 reprodujo el MP4 real de 176 a 187,5 s, sin solicitudes externas ni errores, con respuesta 206 al solicitar un rango. Pantalla de 390 px sin desbordamiento. No prueba física Samsung/Sony ni certificación de eficacia.

Una ejecución anterior de F04 requirió pulsar el control de reproducción del proveedor; se comprobó el arranque/fin después de activarlo. La repetición de la prueba con pantalla de 1280×1000 no lo requirió. No prometer autoplay universal. La prueba opt-in [browser-visual-teaching](../../tests/browser-visual-teaching.mjs) ahora registra esa activación y espera según la duración real del fragmento, para no cortar la comprobación del ejemplo largo de F06.

295 pruebas correctas, una opt-in omitida; tipos, lint y build correctos. El filtro de video se verifica contra referencias locales o YouTube, corrigiendo la antigua suposición de solo YouTube expuesta por T03. Persiste aviso de bundles >500 kB. Enseñanza restante, conversación/adaptación e integración física siguen abiertas; este informe no redefine esos compromisos.
