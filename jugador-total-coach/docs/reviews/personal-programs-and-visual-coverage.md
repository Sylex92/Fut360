# Programas por perfil y revisión visual

2026-10-04. Entrega incremental comprobada; **no cierre de los tres objetivos ni de toda la biblioteca visual**. [Plan previo](../plans/personal-programs-and-visual-coverage.md).

## Implementado

- Cinco sesiones adultas individuales nuevas: control 20 min; conducción/pase/finalización 30 min; fuerza 24 min; desarrollo técnico y desplazamiento defensivo 40 min; fuerza 32 min. Se mantienen las cinco plantillas anteriores, con sus requisitos de compañeros/material.
- Tres complementos infantiles propios: conducción/frenada/gol 15 min; recepción/pase/apoyo 15 min; movimiento/equilibrio 10 min. Calentamiento y cierre propios, ventanas cortas y descanso, adulto acompañante o pasador; sin oponente adulto ni fuerza al fallo.
- Rutas de entrada, consistencia y transferencia con frecuencia propuesta, criterios de revisión y ajuste. No se pasa de nivel por el calendario. La exploración de etapa todavía no guarda una evaluación deportiva ni acredita dominio.
- Agenda propone inicio solo en días sin asignar, con tiempo y logística confirmados. Conserva club, gimnasio, partidos, descanso y sesiones existentes. No añade más de un complemento infantil al inicio; los otros juegos son alternativas. Deja separación de actividades incluso al envolver domingo/lunes. Si no cabe, no fuerza una inserción.
- Biblioteca por audiencia: 56 fichas adultas y 13 infantiles; nueve esquemas propios adicionales. El esquema representa organización, no movimiento humano. Las sesiones muestran cobertura de cada tarea antes de abrir su recorrido.
- Las sesiones nuevas usan el motor/historial existente: pausa, extensión, avance, cierre, recarga y recuperación. Agenda infantil admite solo IDs de propuestas infantiles conocidas; compilación rechaza mezcla de tareas por audiencia. No se cambian firmas de las cinco propuestas antiguas.
- Historial muestra el título guardado de la sesión. Infancia recoge notas del acompañante, sin trasladar escalas adultas de esfuerzo/rodilla. No se interpreta el tiempo reproducido como ejercicio efectivamente realizado.

## Investigación y cobertura visual

Catálogo total: **69 fichas / 32 familias**, **15 con referencia del gesto**, **7 con referencia de componente**, **47 sin video incrustado**. Ocho videos originales, no 22 videos diferentes. De las 47 fichas sin reproductor, siete enlazan ejemplos parciales en dos videos de una página oficial de FIFA; quedan 40 sin una de esas referencias visuales. Ninguna de esas siete se cuenta como demostración exacta. [Inventario generado](../training/COACHING_LIBRARY_INVENTORY.md).

Nuevas fuentes realmente inspeccionadas:

| Recurso | Observación realizada | Decisión |
|---|---|---|
| NHS inform, `4rgR6KtyHzI` | Fotogramas 2, 5, 9, 13 s: ambos talones suben/bajan con apoyo de manos. Video dura ~15,12 s. | F05, rango 0–15 s. No hereda la pauta de rehabilitación de la página. |
| NHFT, `PPNCe7nX3Fc` | 3 s título; 7/11/16 posición baja; 9/14 pelvis elevada, ambos pies apoyados sobre camilla; duración ~20,02 s. | F03, rango 6–17 s. Ficha explica colchoneta al suelo; no pedir subir a muebles. |
| FIFA, Speed and control, primer video | Reproducción iniciada, duración ~67,5 s; muestras 8/22/40/58 s muestran conducción y giros por puertas, con relevos. | Componentes para S01/Y01/Y02. No aparece la variante semáforo completa. |
| Misma página, segundo video | Reproducción iniciada, duración ~69,46 s; muestras 12/35/55 s: pases por puertas y desplazamiento en parejas. En 55 s también apareció indicador de carga. | Componentes S04/Y04/Y07/Y09; no declarar continuidad completa ni variante exacta. |
| OxPARC `EYkKlfiKiH4` | 2/6/10/14 s: elevación de talón **unilateral**. | Rechazado para F05 bilateral. |
| OxPARC `ZXhH1dzT0Tw` | 5/14/24/34 s: progresión de puente con una pierna levantada. | Rechazado para F03 bilateral; no añadir como si fuera la variante inicial. |

La evidencia visual consiste en muestras inspeccionadas y comprobación del reproductor; no equivale a ver cada fotograma ni a evaluar biomecánica, dosificación o comprensión del usuario. No se descargaron videos ni se incorporaron capturas ajenas al repositorio. Capturas temporales de inspección permanecen en `.cache` ignorado.

## Derechos y costos

- Sin dependencias ni cuentas nuevas. Costo adicional obligatorio de esta implementación local: ninguno.
- Videos NHS/NHFT: reproducción oficial de YouTube, con controles y atribución. Publicación pública no concede derecho de descarga/redistribución. Los enlaces y rangos son metadatos, no una copia del video. Disponibilidad, anuncios y restricciones futuras pertenecen al proveedor; no se promete acceso ilimitado u offline.
- YouTube exige declarar los sitios/apps dirigidos a niños, incluso en modo de privacidad mejorada. La [guía de incrustación](https://support.google.com/youtube/answer/171780?hl=en) remite a [designación y plataformas](https://support.google.com/policies/answer/9664901), con verificación de propiedad web o configuración de una app publicada. La instalación local actual no tiene esa vía configurada. No inventar un parámetro de iframe ni tratar consentimiento del tutor como equivalente. La reproducción está bloqueada dentro del perfil infantil; continuar evaluación de audiencia mixta y ruta compatible antes de habilitarla/publicar. Las páginas FIFA se consultan fuera de la app con acompañamiento, sin incrustar YouTube infantil como atajo.
- [FIFA, términos §§5–6](https://www.fifatrainingcentre.com/en/terms-of-service.php): titularidad reservada, condiciones de enlace/atribución y uso; §6.1 impide enmarcar su plataforma. §6.4 describe uso no comercial bajo condiciones, pero no se deduce de ello permiso general para extraer sus archivos multimedia, redistribuirlos o usar su marca como aval. Este incremento solo enlaza su página, identifica sección/rango orientativo y no afirma asociación.
- Si hacen falta videos propios, permiso de descarga, explotación comercial o distribución de fuentes distintas, revisar derechos/costos antes. Las instrucciones propias y el historial funcionan localmente; la ausencia de video no se oculta ni se presenta como enseñanza final completa.

## Pruebas

Tipos, lint, formato y compilación correctos; **275 pruebas aprobadas y una opt-in omitida**. Trece documentos modificados, 339 enlaces locales comprobados sin destinos ausentes y `git diff --check` correcto. Preview local y LAN responden HTTP 200 con el mismo bundle actualizado. La captura móvil usa un perfil sintético y muestra nuestra interfaz, no contenido audiovisual de terceros.

Ver [evidencia técnica](evidence/programs/checks.json). Flujo sintético de adulto e infancia en navegador separado: agenda, persistencia, extensión automática, recuperación infantil tras recargar, finalización y aislamiento; ancho 390 px, cero errores y ninguna solicitud externa antes de abrir una fuente. En los dos videos nuevos se pulsó reproducción en el reproductor oficial: puente inició en 6 s y pausó en 17,012 s; talones inició ~0,018 s y pausó ~15,013 s. No se atribuye esta prueba a Samsung físico o Sony A80J.

## Lo que impide declarar el producto terminado

1. No todas las tareas de los dos recorridos tienen demostración humana suficiente. La biblioteca infantil tiene explicaciones, organización y ejemplos parciales, **no 13 videos exactos**. Completar producción o referencias pertinentes y comprobar comprensión/fluidez; no resolverlo solo agregando enlaces.
2. Resolver integración audiovisual infantil compatible y el encadenado automático de videos con el reloj. Los enlaces externos no se detienen automáticamente al final. Estudiar video durante recorrido todavía exige continuar después de la pausa explícita.
3. Los recorridos son propuestas reutilizables ajustadas a tipo de perfil y contexto; faltan observaciones deportivas para ajustar competencia/dosis de manera individual. No existe evaluación médica, garantía de profesionalización o progreso adaptativo automático.
4. Calendario fechado, mediciones de capacidades, conversación desde app y operación real en TV siguen en la matriz de los tres objetivos. No se desplazan a extras opcionales para declarar cierre.
