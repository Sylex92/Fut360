import { snapshotPlan } from '@fut360/domain';
import type { ExecutionPlan } from '@fut360/domain';
import { taskById } from './coaching-catalog';
import { personalSessions } from './personal-programs';
export interface CoachingBlock {
  taskId: string;
  rounds: number;
  preparation: number;
  work: number;
  rest: number;
  dose: string;
}
export interface CoachingSession {
  audience?: 'adult' | 'child';
  id: string;
  name: string;
  goal: string;
  place: string;
  context: string;
  blocks: CoachingBlock[];
}
const b = (
  taskId: string,
  rounds: number,
  preparation: number,
  work: number,
  rest: number,
  dose: string,
): CoachingBlock => ({ taskId, rounds, preparation, work, rest, dose });
const warm = (minutes: number) =>
  b(
    'W01',
    1,
    30,
    minutes * 60 - 60,
    30,
    'Progresivo y cómodo; el calentamiento debe preparar la tarea siguiente.',
  );
const cool = (minutes: number) =>
  b('C01', 1, 0, minutes * 60, 0, 'Baja el ritmo, camina y revisa cómo te encuentras.');
export const coachingSessions: CoachingSession[] = [
  {
    id: 'control-30',
    name: 'Control y combinaciones',
    goal: 'Encadenar contactos por ambos lados, cambiar dirección y conservar la siguiente acción.',
    place: 'Casa o cancha · individual',
    context:
      'No incluye tiros ni carrera. Acorta los recorridos a tu área libre. Las cadenas complejas se estudian despacio antes de aumentar ritmo.',
    blocks: [
      warm(5),
      ...['M03', 'M05', 'M07', 'M09', 'T01'].map((id) =>
        b(
          id,
          2,
          20,
          60,
          40,
          'Dos rondas: un lado por ronda. Haz secuencias controladas; recoloca el balón si lo pierdes.',
        ),
      ),
      cool(5),
    ],
  },
  {
    id: 'midfield-45',
    name: 'Recepción, pase y mediocentro',
    goal: 'Recibir con información y conectar con una opción útil; conservar cuando avanzar no conviene.',
    place: 'Cancha o campo · hasta 3 personas',
    context:
      'Requiere pasador/apoyos y pared apta o rebotador para el primer bloque. Las tareas con información necesitan compañeros reales.',
    blocks: [
      warm(8),
      b('T04', 2, 20, 100, 60, '6–10 recepciones por lado, calidad antes que velocidad.'),
      b('T05', 2, 30, 150, 60, '6 intentos por ronda; cambia salida y orientación.'),
      b('T06', 2, 30, 150, 60, '6 recepciones usando la posición real del apoyo.'),
      b('T08', 2, 30, 180, 90, 'Roten funciones; compara progresión útil con conservación.'),
      cool(5),
    ],
  },
  {
    id: 'attack-50',
    name: 'Extremo y gol',
    goal: 'Crear una salida, preparar el tiro y elegir cuándo finalizar o asistir.',
    place: 'Campo con portería · hasta 3 personas',
    context:
      'Portería y zona posterior seguras; compañero y defensor para la parte final. Empieza sin presión y añade oposición de forma gradual.',
    blocks: [
      warm(10),
      b('T10', 2, 20, 100, 60, '4 recorridos controlados por ronda; camina de regreso.'),
      b(
        'B02',
        2,
        30,
        150,
        60,
        '6 tiros colocados por ronda, alternando lado; recuperar caminando.',
      ),
      b('B01', 2, 30, 180, 90, '4–6 recepciones con finta y salida, alternando banda.'),
      b(
        'T14',
        2,
        30,
        180,
        90,
        '4–6 situaciones para tirar o asistir; no disparar por obligación.',
      ),
      cool(6),
    ],
  },
  {
    id: 'defense-45',
    name: 'Defensa y transiciones',
    goal: 'Frenar la progresión, coordinar presión/cobertura y reaccionar a pérdida y recuperación.',
    place: 'Cancha o campo · hasta 4 personas',
    context:
      'Sin barridas ni contacto de choque. Aumenta primero la libertad de decisión; la velocidad depende de la preparación.',
    blocks: [
      warm(8),
      b('T17', 2, 30, 150, 60, '4–6 aproximaciones por ronda; intercambia roles.'),
      b('T19', 2, 20, 100, 60, '6 pases observados; anticipa solo si hay oportunidad.'),
      b('T18', 2, 30, 150, 60, 'Situaciones cortas de 2v2 con reinicio y comunicación.'),
      b(
        'T20',
        2,
        30,
        180,
        90,
        'Juego con cambio real de posesión; pausa si se pierde organización.',
      ),
      cool(5),
    ],
  },
  {
    id: 'strength-40',
    name: 'Fuerza para sostener el juego',
    goal: 'Desarrollar piernas, cadera, tracción y control del tronco con series finitas.',
    place: 'Gimnasio · individual',
    context:
      'Plantilla general para una etapa de adaptación ya tolerada; ajustar variantes/resistencia antes de ejecutarla. No es una prueba al fallo.',
    blocks: [
      warm(7),
      b('F01', 2, 20, 70, 90, 'Una serie de 6–10 repeticiones por ronda, dejando margen.'),
      b(
        'T27',
        2,
        20,
        70,
        90,
        'Una serie de 6–8 por lado; el resto de la ventana es descanso.',
      ),
      b('F03', 2, 20, 50, 80, 'Una serie de 6–10; respira y controla el descenso.'),
      b('T28', 2, 20, 70, 90, 'Una serie de 6–10 con carga controlable; comprobar el equipo.'),
      b(
        'F06',
        2,
        20,
        50,
        80,
        'Sostención breve con control por lado; descansa el tiempo restante.',
      ),
      cool(5),
    ],
  },
  ...personalSessions,
];
export const developmentStages = [
  {
    id: 'prepare',
    label: 'Preparar el regreso',
    weeks: 'Sin fecha fija',
    focus: 'Comprender las tareas y ajustar el punto de partida.',
    criteria:
      'Aclarar las restricciones actuales que afecten al esfuerzo. Ver videos y planificar no requiere entrenar ahora.',
    sessions: [] as string[],
  },
  {
    id: 'reference',
    label: 'Referencia inicial',
    weeks: 'Semanas 1–2',
    focus: 'Reentrada ajustada y referencias por capacidad, sin máximos.',
    criteria:
      'Tolerar la actividad acordada y conocer la respuesta posterior. Las duraciones completas de las plantillas no son obligatorias para el retorno.',
    sessions: ['control-30'],
  },
  {
    id: 'base',
    label: 'Consistencia y fuerza',
    weeks: 'Semanas 3–8',
    focus: 'Dos objetivos técnicos centrales, fuerza gradual y recepción real.',
    criteria:
      'Calidad repetible y recuperación sostenible. Si una tarea ya está dominada, progresar su contexto.',
    sessions: ['control-30', 'midfield-45', 'strength-40'],
  },
  {
    id: 'decision',
    label: 'Resolver con oposición',
    weeks: 'Semanas 9–16',
    focus: 'Integrar primer toque, información, 1v1, gol y responsabilidad defensiva.',
    criteria:
      'Elegir y ejecutar acciones útiles ante cambios reales; mantener fuerza y recuperación.',
    sessions: ['midfield-45', 'attack-50', 'defense-45', 'strength-40'],
  },
  {
    id: 'transfer',
    label: 'Transferir al partido',
    weeks: 'Semanas 17–24',
    focus: 'Alternar énfasis de gol/extremo, mediocentro y defensa según el equipo.',
    criteria:
      'Observar mejoras repetidas en varios partidos comparables, incluyendo pérdidas y decisiones.',
    sessions: ['attack-50', 'midfield-45', 'defense-45', 'strength-40'],
  },
  {
    id: 'consolidate',
    label: 'Consolidar y competir',
    weeks: 'Semanas 25–52',
    focus: 'Ciclos de 4–6 semanas centrados en las limitaciones observadas.',
    criteria:
      'Revisar el nivel demostrado y el entorno competitivo disponible. No hay ascenso automático a nivel profesional.',
    sessions: ['attack-50', 'midfield-45', 'defense-45', 'strength-40'],
  },
];
export function compileCoachingSession(session: CoachingSession): ExecutionPlan {
  const occurrences = session.blocks.flatMap((block, index) => {
    const task = taskById.get(block.taskId);
    if (
      !task ||
      !Number.isInteger(block.rounds) ||
      block.rounds < 1 ||
      block.rounds > 20 ||
      task.id.startsWith('Y') !== (session.audience === 'child') ||
      ![block.preparation, block.work, block.rest].every(
        (n) => Number.isInteger(n) && n >= 0 && n <= 3600,
      ) ||
      block.work === 0
    )
      throw new Error('Tarea o rondas inválidas.');
    return Array.from({ length: block.rounds }, (_, round) => ({
      id: `${session.id}/${index}/${round}`,
      exerciseId: task.id,
      title: task.name,
      side: 'según ficha',
      demonstrationMs: block.preparation * 1000,
      workMs: block.work * 1000,
      restMs: block.rest * 1000,
    }));
  });
  return snapshotPlan({
    id: session.id,
    version: 1,
    title: session.name,
    purpose: 'training-draft',
    expectedDurationMs: occurrences.reduce(
      (n, o) => n + o.demonstrationMs + o.workMs + o.restMs,
      0,
    ),
    occurrences,
  });
}
export const coachingPlans = new Map(
  coachingSessions.map((s) => [s.id, compileCoachingSession(s)]),
);
