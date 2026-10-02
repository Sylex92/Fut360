# Revisión documental de la hora v2

2026-10-01. Documento interno; no se importa a la app. [Workout independiente](../../content/workouts/mvp1-60min-v2.json), [generador explícito](../../tools/build_workout_v2.mjs). Conserva el fixture v1 de 31 IDs sin renombrarlo ni convertir sus cargas. Selección y dosis propuestas por el agente conforme a la delegación del usuario; no revisión profesional ni prescripción individual.

## Fundamento y límites

Se mantiene el [fundamento de los doce patrones](PHASE06_DOCUMENTARY_REVIEW.md): FIFA/FA para contacto cercano con distintas superficies del pie, NHS/ACE/NASM para descripciones técnicas con las diferencias de variante allí declaradas. No se afirma acceso a currículos privados, ni que estas fuentes hayan probado nuestro programa. Consultar fuentes no acredita eficacia, seguridad individual o superioridad de la secuencia.

Reconsultados el 2026-10-01: [NHS, Strength exercises](https://www.nhs.uk/live-well/exercise/strength-exercises/) para apoyo de manos a altura del pecho, codos cerca del cuerpo y empuje contra pared; [AHA, Warm up, cool down](https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/warm-up-cool-down) para entrada y salida gradual de actividad. No trasladamos las dosis generales del NHS como receta individual ni afirmaciones amplias sobre prevención/lactato. AHA describe tramos generales de 5–10 minutos: respalda gradualidad, no valida nuestro reparto interno de pausas ni demuestra equivalencia de ocho minutos programados con ocho minutos activos.

**Propuesta:** primero familiarización, después contactos básicos por ambos lados; luego alternancia de control y reorientación, fuerza de pie seguida de suelo, retorno al balón y descenso gradual. Reduce cambios repetidos de material y evita añadir nuevas dificultades simultáneas. Es una decisión de diseño revisable, no una secuencia óptima demostrada. Bellingham/Firmino orientan capacidades amplias; aquí no hay oposición, desmarque, decisiones de partido, sprint ni preparación completa de un profesional.

## Reparto exacto

| Bloque | Intervalos | Preparación/demostración | Ventana de trabajo | Descanso | Total |
|---|---:|---:|---:|---:|---:|
| Preparación gradual | 8 | 130 s | 255 s | 95 s | 480 s |
| Fundamentos de balón | 12 | 180 s | 360 s | 180 s | 720 s |
| Orientación corporal | 10 | 170 s | 260 s | 170 s | 600 s |
| Preparación física general | 8 | 210 s | 340 s | 410 s | 960 s |
| Integración técnica | 8 | 155 s | 203 s | 122 s | 480 s |
| Descenso gradual | 6 | 80 s | 230 s | 50 s | 360 s |
| **Total** | **52** | **925 s / 15:25** | **1648 s / 27:28** | **1027 s / 17:07** | **3600 s** |

Las ventanas no miden actividad realizada. Parte del trabajo puede convertirse en descanso tras completar la serie; no se exige completar 27:28 de esfuerzo ni compensar pausas. Los 60 minutos no son una hora de ejercicio intenso. El motor conserva preparación extra, repeticiones adicionales, omisiones y pausas por separado.

## Dosis por variante y motivo

- Marcha: ventanas de 40 s a ritmo cómodo, con ejemplo finito de cinco secuencias de seis pasos. No obliga a sincronizar treinta pasos ni a mantener la cadencia del avatar. Dos apariciones al inicio y dos al cierre; al final, reducir altura/ritmo progresivamente.
- Tobillo: hasta cuatro balanceos por lado en 35 s; cada lado al principio y al cierre. Variante propia de pie ya documentada, no rehabilitación. Preparación 15 s y descanso 10 s; no forzar amplitud.
- Bisagra/sentadilla: hasta cuatro gestos completos por serie. Una familiarización en el calentamiento; dos series de cada patrón en el bloque físico, alternadas con empuje. Ventanas físicas de 40 s, preparación 20 s y descanso 60 s. La familiarización usa 35/30 s respectivamente: caben los cuatro ejemplos, con tiempo restante libre. El mayor descanso físico evita llenar el bloque con volumen obligatorio; no se afirma dosis óptima de fuerza o hipertrofia.
- Empuje contra pared: tras aceptación de claridad, propuesta inicial de hasta cuatro repeticiones en 40 s, dos series separadas por otros patrones, preparación 20 s y descanso 60 s. Se aplica el mismo límite inicial de familiarización de fuerza; cuatro es decisión de diseño, no dosis deducida de la guía NHS ni de mediciones del usuario. El rango del avatar y sus distancias a pared no son objetivos personales.
- Puente: una serie de hasta cuatro repeticiones en 40 s. Preparación previa de 60 s para colchoneta y colocación; después 20 s de descanso. Pierna alterna: hasta cuatro elevaciones por lado en ventana de 60 s; cuatro clips de 14 s muestran ocho elevaciones en total, sin confundir clip con una sola pierna. Preparación 30 s, descanso 30 s. Se agrupan ambos en suelo para evitar subidas/bajadas repetidas.
- Balón: ventanas principales de 30 s; el ejemplo contiene cuatro secuencias de 6,5 s (26 s), seguido de reposo visual. Las campanitas muestran cuatro toques por secuencia; planta muestra salida/regreso; interior/exterior, dos superficies de un mismo pie. La cantidad visual no cuenta toques realizados ni obliga a seguir su tempo. La primera vuelta al balón tras el suelo reserva 40 s de recolocación, 13 s de toques suaves y 7 s de descanso. Esta ventana reducida protege el presupuesto de transición, no prescribe un protocolo de mejora.
- Giro: hasta dos idas/regresos por sentido en ventana de 20 s; 20 s de preparación y 20 de descanso. Se realiza **sin balón entre los pies**. La app avisa de detenerlo y apartarlo antes. No es pivote sobre pie plantado ni giro con control orientado simultáneo.
- Respiración: dos ventanas de 40 s al final, postura cómoda estática, sin ciclos impuestos ni apneas. No asigna efectos metabólicos o de recuperación deportiva medidos.

Series limitadas y descansos amplios sirven para esta primera propuesta de observación/práctica controlada. No se multiplicaron las dosis del fixture para completar una hora ni se añadió velocidad máxima. El programa no cubre todos los componentes físicos o tácticos del fútbol; tracción, cargas progresivas y práctica en campo siguen fuera.

## Transiciones, lados y combinaciones

Todos los lados son anatómicos, independientes de la cámara. Lados izquierdo y derecho tienen recursos distintos revisados, sin reflejo por escala negativa. Los bloques de balón/orientación/integración son sucesiones de recursos existentes, con retorno/recolocación explícitos; **no se inventa un nuevo gesto de control + giro** ni se muestra un empalme que finja contacto continuo.

Antes de girar se detiene/aparta el balón; antes de volver al balón se recoloca. Antes del suelo se retira el balón y se coloca la colchoneta; la siguiente integración reserva tiempo para incorporarse y retirar la colchoneta. Los clips comienzan ya colocados. Las entradas/salidas se explican con texto estable y tiempo dedicado: no hay animación específica de tumbarse/levantarse ni se afirma su validación visual. +30 s/+1 min permiten ampliar sin perder el autoinicio; pausa completa permite parar indefinidamente. La transición no debe hacerse deprisa para copiar al modelo.

## Estado de revisión

**Verificado:** fuentes con alcance delimitado; cobertura de dieciséis variantes; comprensión de los movimientos aceptada cualitativamente por el usuario; suma y cabida temporal comprobadas por compilador/tests. **Propuesto:** dosis, orden, descansos y combinación entre intervalos. **Pendiente:** revisión del nuevo recorrido completo en Samsung, tolerancia/adecuación individual, aprendizaje y transferencia. No se conoce edad, antecedentes o condición física; «16» en el historial es Android 16. No atribuir `coaching-reviewed` ni convertir una aprobación de la interfaz en evidencia clínica/deportiva.
