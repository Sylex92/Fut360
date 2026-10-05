import type { CoachingSession, CoachingBlock } from './development-plan';

const block = (
  taskId: string,
  rounds: number,
  preparation: number,
  work: number,
  rest: number,
  dose: string,
): CoachingBlock => ({ taskId, rounds, preparation, work, rest, dose });
const warm = (n: number) =>
  block(
    'W01',
    1,
    30,
    n * 60 - 60,
    30,
    'Camina, moviliza tobillos y caderas sin forzar y añade toques suaves. Puedes hablar con comodidad.',
  );
const cool = (n: number) =>
  block(
    'C01',
    1,
    0,
    n * 60,
    0,
    'Camina y baja el ritmo. Si aparece dolor, mareo o malestar, termina y busca orientación.',
  );
const strengthDose =
  'Una serie de 6 repeticiones controladas por ronda, sin contener el aire ni llegar al fallo. El tiempo sobrante es descanso; no obliga a repetir.';
export const personalSessions: CoachingSession[] = [
  {
    id: 'solo-control-20',
    name: 'Volver al balón · control cercano',
    audience: 'adult',
    goal: 'Recuperar control de ambos lados con una carga breve.',
    place: 'Casa o cancha · individual',
    context:
      'Propuesta de inicio suave. Las primeras sesiones sirven para observar tolerancia, no para probar tu máximo. Sin saltos.',
    blocks: [
      warm(4),
      ...['M03', 'M05', 'M07'].map((id) =>
        block(
          id,
          2,
          20,
          40,
          60,
          '4–6 secuencias por lado a ritmo cómodo. Para si se pierde la calidad y usa el resto para descansar.',
        ),
      ),
      cool(4),
    ],
  },
  {
    id: 'solo-court-30',
    name: 'Llevar, pasar y finalizar · individual',
    audience: 'adult',
    goal: 'Unir conducción, pase dirigido y preparación del golpeo.',
    place: 'Cancha o campo · individual',
    context:
      'Marcas planas y zona posterior libre. Sin portero, compañero ni pared. Golpeos rasos controlados; no mide decisiones ante rival.',
    blocks: [
      warm(6),
      ...['S01', 'S04', 'S02'].map((id) =>
        block(
          id,
          2,
          20,
          70,
          90,
          '4 intentos por ronda alternando lado. Recupera andando y descansa después de los intentos.',
        ),
      ),
      cool(6),
    ],
  },
  {
    id: 'solo-strength-24',
    name: 'Base de fuerza y control · sin máquinas',
    audience: 'adult',
    goal: 'Volver a practicar patrones de piernas, cadera y tronco con series finitas.',
    place: 'Casa o gimnasio · individual',
    context:
      'Sin lastre añadido. Recorre una amplitud cómoda y mantén margen para varias repeticiones más. No entrenar sobre dolor.',
    blocks: [
      warm(4),
      ...['F01', 'F03', 'F05', 'T29'].map((id) => block(id, 2, 20, 40, 60, strengthDose)),
      cool(4),
    ],
  },
  {
    id: 'solo-court-40',
    name: 'Conducción, gol y base defensiva · individual',
    audience: 'adult',
    goal: 'Encadenar calidad técnica con desplazamientos y frenadas controladas.',
    place: 'Cancha o campo · individual',
    context:
      'Etapa posterior a tolerar las sesiones breves. Zona amplia y despejada. No sprints máximos ni contacto; la defensa ante rival sigue necesitando oposición.',
    blocks: [
      warm(6),
      ...['S01', 'S02', 'S03', 'S04'].map((id) =>
        block(
          id,
          2,
          20,
          100,
          90,
          '4–6 intentos con recuperación andando. Cambia ángulo o pie; no aumentes potencia y velocidad a la vez.',
        ),
      ),
      cool(6),
    ],
  },
  {
    id: 'solo-strength-32',
    name: 'Fuerza y estabilidad · consolidar',
    audience: 'adult',
    goal: 'Sostener una ejecución controlada de piernas y tronco con algo más de volumen.',
    place: 'Casa o gimnasio · individual',
    context:
      'Usa la variante ya tolerada. Sin carga externa obligatoria; avanzar no significa trabajar al fallo.',
    blocks: [
      warm(5),
      ...['F01', 'F03', 'F05', 'T29'].map((id) =>
        block(
          id,
          2,
          20,
          55,
          90,
          'Una serie de 6–8 repeticiones por ronda, dejando margen. En alternados, reparte entre ambos lados; descansa el tiempo restante.',
        ),
      ),
      cool(5),
    ],
  },
  {
    id: 'youth-explore-15',
    name: 'Explorar, frenar y marcar · juego breve',
    audience: 'child',
    goal: 'Conducir con intención y disfrutar de llegar al gol.',
    place: 'Cancha · con adulto acompañante',
    context:
      'Complemento opcional, no trabajo extra después de cada entrenamiento. El adulto organiza y coopera; el niño puede terminar antes. No se busca cansarlo.',
    blocks: [
      block('Y12', 1, 20, 140, 20, 'Tres minutos de entrada suave al juego.'),
      ...['Y01', 'Y02', 'Y08'].map((id) =>
        block(
          id,
          2,
          15,
          35,
          50,
          'Dos o tres intentos tranquilos y luego descanso. El adulto deja decidir y da una indicación corta cuando hace falta.',
        ),
      ),
      block('Y13', 1, 0, 120, 0, 'Caminar, respirar y contar qué disfrutó.'),
    ],
  },
  {
    id: 'youth-pass-15',
    name: 'Recibir, pasar y ofrecerse · juego breve',
    audience: 'child',
    goal: 'Mirar un espacio, orientar el toque y volver a ser una opción.',
    place: 'Cancha · adulto pasador colaborador',
    context:
      'Pases suaves del adulto; sin rival adulto, choques ni potencia máxima. Preferir otro día al entrenamiento del club y reservar descanso.',
    blocks: [
      block('Y12', 1, 20, 140, 20, 'Entrada suave al juego con balón.'),
      ...['Y07', 'Y04', 'Y09'].map((id) =>
        block(
          id,
          2,
          15,
          35,
          50,
          'Tres intentos por lado; no hace falta llenar la ventana. Pausa para hablar o descansar.',
        ),
      ),
      block('Y13', 1, 0, 120, 0, 'Cerrar con una cosa aprendida, sin calificaciones.'),
    ],
  },
  {
    id: 'youth-move-10',
    name: 'Moverse y equilibrarse · en casa',
    audience: 'child',
    goal: 'Explorar coordinación y equilibrio con un adulto cerca.',
    place: 'Casa · 2×2 libres',
    context:
      'Alternativa a un juego con balón, no una tercera sesión extra obligatoria. Sin pesas, saltos ni muebles como apoyo.',
    blocks: [
      block('Y12', 1, 20, 140, 20, 'Caminar y explorar el espacio suavemente.'),
      block(
        'Y10',
        3,
        15,
        25,
        60,
        'Tres o cuatro intentos alternando lado; mucho descanso y sin competir por aguantar.',
      ),
      block('Y13', 1, 0, 120, 0, 'Cerrar tranquilo; el niño puede expresar cómo se sintió.'),
    ],
  },
  {
    id: 'youth-protect-15',
    name: 'Proteger, acompañar y marcar · juego breve',
    audience: 'child',
    goal: 'Colocar el cuerpo, cerrar un camino sin choque y encontrar salida hacia el gol.',
    place: 'Cancha · adulto colaborador',
    context:
      'El adulto señala o conduce andando; no disputa el balón ni usa su fuerza. Son primeras situaciones cooperativas. La oposición real se practica con compañeros compatibles.',
    blocks: [
      block('Y12', 1, 20, 140, 20, 'Entrada suave al juego; caminar y tocar sin saltar.'),
      ...['Y05', 'Y06', 'Y08'].map((id) =>
        block(
          id,
          2,
          15,
          35,
          50,
          'Dos o tres intentos controlados, alternando lado. Reinicia andando y descansa; no se busca cansancio ni robar a toda costa.',
        ),
      ),
      block('Y13', 1, 0, 120, 0, 'Caminar y compartir una cosa que salió bien.'),
    ],
  },
];

export interface ProgramStage {
  id: string;
  name: string;
  horizon: string;
  rhythm: string;
  sessions: string[];
  advance: string[];
  adjust: string;
}
export const adultProgram: ProgramStage[] = [
  {
    id: 'return',
    name: 'Retomar con margen',
    horizon: 'Primeras 2 semanas de práctica tolerada',
    rhythm:
      'Hasta tres sesiones breves en días alternos: control, fuerza, cancha. Entre ellas descanso o paseo cómodo si apetece. Si ya hay partido o entrenamiento, sustituye una sesión; no la sumes.',
    sessions: ['solo-control-20', 'solo-strength-24', 'solo-court-30'],
    advance: [
      'Poder terminar sin perder técnica ni buscar el máximo.',
      'Recuperar tu sensación habitual al día siguiente, sin síntomas nuevos.',
      'Repetir esa tolerancia en varias sesiones; una buena sesión no basta.',
    ],
    adjust:
      'Acorta intentos o termina antes si la calidad o comodidad cae. Tras enfermedad recurrente o al reaparecer síntomas, una valoración sanitaria ayuda a decidir la vuelta a esfuerzos altos.',
  },
  {
    id: 'build',
    name: 'Construir consistencia',
    horizon: 'Siguientes 4–6 semanas; revisar cada dos',
    rhythm:
      'Tres o cuatro sesiones por semana: dos técnicas alternando casa/cancha y una o dos de fuerza separadas por un día. Mantén al menos un día sin entrenamiento planificado. Cada sesión cabe en una hora.',
    sessions: ['control-30', 'solo-court-40', 'solo-strength-32'],
    advance: [
      'Más aciertos con la misma puerta y distancia, en días distintos.',
      'Control por ambos lados sin depender de mirar continuamente al balón.',
      'Volumen sostenible y recuperación; aumentar una variable por vez.',
    ],
    adjust:
      'Una semana ocupada o una vuelta al partido reemplaza sesiones. En cemento conserva golpeos rasos y frenadas suaves; no agregues impactos para hacerla más difícil.',
  },
  {
    id: 'transfer',
    name: 'Llevar las habilidades al juego',
    horizon: 'Revisiones en semanas 8, 16 y 24; continuar según evidencia',
    rhythm:
      'Mantén técnica y fuerza. Incorpora recepción real y oposición cuando tengas pared apta, compañeros o equipo. Las sesiones colectivas del catálogo requieren esos recursos.',
    sessions: ['midfield-45', 'attack-50', 'defense-45', 'strength-40'],
    advance: [
      'Recepción útil observada con un pasador y después con presión.',
      'Elegir cuándo conducir, pasar o tirar ante un rival; no solo acertar sin oposición.',
      'Valorar defensa, pérdidas y acciones sin balón en partidos comparables.',
    ],
    adjust:
      'Mientras practiques solo, continúa la ruta individual. No acredites anticipación, presión coordinada ni nivel competitivo por hacer tareas con conos. Velocidad máxima y sprints repetidos requieren progresión específica posterior.',
  },
];
export const youthProgram: ProgramStage[] = [
  {
    id: 'play',
    name: 'Complementar con juego breve',
    horizon: 'Primeras 2 semanas; revisar disfrute y recuperación',
    rhythm:
      'Empieza con un complemento de 10–15 minutos en un día libre de club/gimnasio. Solo si lo disfruta y recupera bien, ofrece un segundo en otro día. Conserva dos días por semana sin entrenamiento específico; el juego libre no tiene que convertirse en tarea.',
    sessions: ['youth-explore-15', 'youth-pass-15', 'youth-protect-15', 'youth-move-10'],
    advance: [
      'Quiere repetir y puede terminar antes sin presión.',
      'No hay dolor, cansancio persistente ni pérdida de ganas.',
      'Encuentra una salida y controla el balón mejor, sin pedir máxima velocidad.',
    ],
    adjust:
      'Los entrenamientos del club y gimnasio ya cuentan. Si hay partido u otra actividad, sustituye el complemento o elimínalo; no llenes las horas disponibles.',
  },
  {
    id: 'vary',
    name: 'Cambiar el problema, no acumular minutos',
    horizon: 'Siguientes 4–6 semanas; revisar cada dos',
    rhythm:
      'Mantén uno o dos complementos breves. Alterna conducción/gol con recepción/pase. El juego con compañeros y la fuerza supervisada pertenecen también a sus sesiones existentes.',
    sessions: ['youth-explore-15', 'youth-pass-15', 'youth-protect-15', 'youth-move-10'],
    advance: [
      'Puede escoger una puerta y cambiar de dirección conservando el balón.',
      'Prueba el pie menos hábil sin castigo ni comparación.',
      'En el equipo ofrece apoyos y ensaya marcar y defender, sin fijar posición.',
    ],
    adjust:
      'Cambia solo una condición: puerta, dirección o señal. Si empieza a fallar por cansancio, simplifica y cierra; no añadas series para corregirlo.',
  },
];

export function sessionAudience(session: CoachingSession) {
  return session.audience ?? 'adult';
}
