import { describe, expect, it } from 'vitest';
import { snapshotPlan } from '../packages/domain/src/index';
import type {
  ExecutionPlan,
  SessionAction,
  SessionCommand,
} from '../packages/domain/src/index';
import { compileWorkoutV1 } from '../packages/exercise-catalog/src/index';
import { SessionEngine } from '../packages/session-engine/src/index';
import fixture from '../content/examples/mvp1-60min.workout.json';

let sequence = 0;
const plan = (count = 2, demo = 0, work = 40000, rest = 20000): ExecutionPlan => ({
  id: 'test',
  version: 1,
  title: 'Prueba',
  purpose: 'technical-test',
  expectedDurationMs: count * (demo + work + rest),
  occurrences: Array.from({ length: count }, (_, i) => ({
    id: 'o' + i,
    exerciseId: 'e' + i,
    title: 'Paso ' + i,
    side: i % 2 ? 'right' : 'left',
    demonstrationMs: demo,
    workMs: work,
    restMs: rest,
  })),
});
function send(
  engine: SessionEngine,
  action: SessionAction,
  overrides: Partial<SessionCommand> = {},
) {
  const view = engine.project();
  return engine.send({
    sessionId: engine.sessionId,
    commandId: 'command-' + ++sequence,
    expectedControlRevision: view.controlRevision,
    ...(view.current ? { expectedOccurrenceId: view.current.id } : {}),
    action,
    ...overrides,
  });
}
function ready(input = plan()): SessionEngine {
  const engine = new SessionEngine('test-session');
  send(engine, { type: 'Prepare' });
  send(engine, { type: 'PreparationSucceeded', plan: input });
  return engine;
}
function started(input = plan()): SessionEngine {
  const engine = ready(input);
  send(engine, { type: 'Start' });
  return engine;
}
const extend = (
  engine: SessionEngine,
  amountMs: 30000 | 60000 = 30000,
  overrides: Partial<SessionCommand> = {},
) =>
  send(
    engine,
    {
      type: 'ExtendPreparation',
      amountMs,
      targetOccurrenceId: engine.project().preparationTarget?.id ?? 'missing',
    },
    overrides,
  );
function invariant(engine: SessionEngine) {
  const p = engine.project();
  const c = p.counters;
  expect(c.baseConsumedMs + c.baseOmittedMs + p.baseRemainingMs).toBe(p.baseDurationMs);
  expect(c.extraConsumedMs + c.extraOmittedMs + c.extraCancelledMs + p.extraRemainingMs).toBe(
    c.extraAddedMs,
  );
  expect(c.preparationConsumedMs + c.preparationCancelledMs + p.preparationRemainingMs).toBe(
    c.preparationAddedMs,
  );
  expect(p.recordedMs).toBe(
    c.baseConsumedMs + c.extraConsumedMs + c.preparationConsumedMs + c.observedPauseMs,
  );
  expect(Object.values(c).every((n) => Number.isSafeInteger(n) && n >= 0)).toBe(true);
  const events = engine.getEvents();
  expect(new Set(events.map((e) => e.eventId)).size).toBe(events.length);
  const finishes = events
    .filter((e) => e.type === 'SegmentFinished')
    .map((e) => e.payload['segmentId']);
  expect(new Set(finishes).size).toBe(finishes.length);
  expect(events.filter((e) => e.type === 'SessionCompleted').length).toBeLessThanOrEqual(1);
}

describe('compilación y snapshot', () => {
  it('preserva fixture, expande rondas/lados y fija 3600000 ms', () => {
    const before = JSON.stringify(fixture);
    const compiled = compileWorkoutV1(fixture);
    expect(compiled.expectedDurationMs).toBe(3600000);
    expect(compiled.occurrences).toHaveLength(60);
    expect(new Set(compiled.occurrences.map((o) => o.id)).size).toBe(60);
    expect(JSON.stringify(fixture)).toBe(before);
    expect(compiled.purpose).toBe('technical-test');
    expect(Object.isFrozen(compiled.occurrences[0])).toBe(true);
  });
  it('rechaza datos inválidos y expansión desmedida antes de generarla', () => {
    expect(() => compileWorkoutV1({})).toThrow();
    expect(() =>
      compileWorkoutV1({
        ...fixture,
        expectedDurationSeconds: 600060,
        blocks: [
          {
            id: 'big',
            displayName: 'Big',
            rounds: 10001,
            items: [{ exerciseId: 'e', workSeconds: 40, restSeconds: 20 }],
          },
        ],
      }),
    ).toThrow('límites');
  });
  it.each([NaN, Infinity, -1, 1.5, Number.MAX_SAFE_INTEGER])(
    'rechaza duración work %s',
    (workMs) => {
      const input = plan(1);
      expect(() =>
        snapshotPlan({ ...input, occurrences: [{ ...input.occurrences[0]!, workMs }] }),
      ).toThrow();
    },
  );
  it('rechaza identidad repetida y suma discordante', () => {
    const input = plan();
    expect(() =>
      snapshotPlan({ ...input, occurrences: [input.occurrences[0]!, input.occurrences[0]!] }),
    ).toThrow();
    expect(() => snapshotPlan({ ...input, expectedDurationMs: 1 })).toThrow();
  });
  it('posee el plan y expone objetos inmutables', () => {
    const input = plan();
    const engine = started(input);
    Object.assign(input.occurrences[0]!, { workMs: 1 });
    expect(engine.project().phaseRemainingMs).toBe(40000);
    expect(Object.isFrozen(engine.project().current)).toBe(true);
    expect(Object.isFrozen(engine.project().counters)).toBe(true);
  });
});
describe('ciclo de vida y tiempo', () => {
  it('valida antes de empezar y permite reintentar preparación fallida', () => {
    const engine = new SessionEngine('s');
    expect(send(engine, { type: 'Start' }).accepted).toBe(false);
    send(engine, { type: 'Prepare' });
    send(engine, { type: 'PreparationSucceeded', plan: { ...plan(), expectedDurationMs: 1 } });
    expect(engine.project().status).toBe('error');
    send(engine, { type: 'Prepare' });
    send(engine, { type: 'PreparationSucceeded', plan: plan() });
    expect(engine.project().status).toBe('ready');
  });
  it('un fallo explícito puede descartarse', () => {
    const engine = new SessionEngine('s');
    send(engine, { type: 'Prepare' });
    send(engine, { type: 'PreparationFailed', message: 'No disponible' });
    expect(engine.project().error).toBe('No disponible');
    send(engine, { type: 'Discard' });
    expect(engine.project().status).toBe('idle');
  });
  it('la frontera exacta pasa a descanso y a siguiente ocurrencia', () => {
    const engine = started();
    engine.advance(40000);
    expect(engine.project()).toMatchObject({ phase: 'rest', phaseRemainingMs: 20000 });
    engine.advance(20000);
    expect(engine.project()).toMatchObject({
      phase: 'work',
      current: { id: 'o1' },
      phaseElapsedMs: 0,
    });
    invariant(engine);
  });
  it('avance grande finaliza una sola vez y no consume exceso', () => {
    const engine = started();
    engine.advance(200000);
    engine.advance(200000);
    expect(engine.project()).toMatchObject({ status: 'completed', recordedMs: 120000 });
    expect(engine.getEvents().filter((e) => e.type === 'SegmentFinished')).toHaveLength(4);
    invariant(engine);
  });
  it('descanso cero no crea segmentos vacíos', () => {
    const engine = started(plan(2, 0, 1, 0));
    engine.advance(2);
    expect(engine.project().status).toBe('completed');
    expect(engine.getEvents().filter((e) => e.payload['phase'] === 'rest')).toHaveLength(0);
    invariant(engine);
  });
  it('pausa conserva 12345 ms y registra 300000 ms observados', () => {
    const engine = started();
    engine.advance(12345);
    send(engine, { type: 'Pause' });
    engine.advance(300000);
    expect(engine.project()).toMatchObject({
      phaseElapsedMs: 12345,
      counters: { observedPauseMs: 300000, baseConsumedMs: 12345 },
    });
    send(engine, { type: 'Resume', visible: true, resourcesReady: true });
    engine.advance(655);
    expect(engine.project().phaseElapsedMs).toBe(13000);
    invariant(engine);
  });
  it('hora base + extra 60 s + pausa 300 s registra 3960 s', () => {
    const engine = started(plan(60));
    send(engine, { type: 'QueueRepeat' });
    send(engine, { type: 'Pause' });
    engine.advance(300000);
    send(engine, { type: 'Resume', visible: true, resourcesReady: true });
    engine.advance(3660000);
    expect(engine.project()).toMatchObject({
      status: 'completed',
      recordedMs: 3960000,
      counters: { baseConsumedMs: 3600000, extraConsumedMs: 60000 },
    });
    invariant(engine);
  });
  it.each([-1, NaN, Infinity, 0.5])('avance inválido %s pausa sin consumir', (value) => {
    const engine = started();
    engine.advance(value);
    expect(engine.project()).toMatchObject({
      status: 'paused',
      pauseReason: 'clock-error',
      recordedMs: 0,
    });
  });
  it('abortar antes de Start no crea SessionStarted ni permite reinicio', () => {
    const engine = ready();
    send(engine, { type: 'Abort' });
    expect(engine.getEvents().some((e) => e.type === 'SessionStarted')).toBe(false);
    expect(send(engine, { type: 'Start' }).accepted).toBe(false);
  });
  it('no reanuda oculto o sin recursos', () => {
    const engine = started();
    engine.interrupt('hidden');
    expect(
      send(engine, { type: 'Resume', visible: false, resourcesReady: true }).accepted,
    ).toBe(false);
    expect(
      send(engine, { type: 'Resume', visible: true, resourcesReady: false }).accepted,
    ).toBe(false);
    expect(engine.project().status).toBe('paused');
  });
});
describe('omitir, repetir y comandos', () => {
  it('no colisiona la identidad de un extra con un ID del plan base', () => {
    const input = plan();
    const collision = JSON.stringify(['extra', 1, 'o0']);
    const engine = started({
      ...input,
      occurrences: input.occurrences.map((item, index) =>
        index === 1 ? { ...item, id: collision } : item,
      ),
    });
    send(engine, { type: 'QueueRepeat' });
    expect(engine.project().next?.id).not.toBe(collision);
    engine.advance(180000);
    expect(engine.project().status).toBe('completed');
    invariant(engine);
  });
  it('omite restante, conserva descanso y cancela repetición pendiente', () => {
    const engine = started(plan(1));
    engine.advance(10000);
    send(engine, { type: 'QueueRepeat' });
    send(engine, { type: 'SkipCurrentWork' });
    expect(engine.project()).toMatchObject({
      phase: 'rest',
      phaseRemainingMs: 20000,
      counters: { baseOmittedMs: 30000, extraCancelledMs: 60000 },
    });
    engine.advance(20000);
    expect(engine.project().outcome).toBe('completed-with-omissions');
    invariant(engine);
  });
  it('omitir pausado conserva la pausa durante el descanso', () => {
    const engine = started();
    send(engine, { type: 'Pause' });
    send(engine, { type: 'SkipCurrentWork' });
    expect(engine.project()).toMatchObject({
      status: 'paused',
      phase: 'rest',
      phaseRemainingMs: 20000,
    });
    invariant(engine);
  });
  it('repetir a mitad del descanso añade ocurrencia completa del mismo lado', () => {
    const engine = started(plan(2, 5000));
    engine.advance(55000);
    send(engine, { type: 'QueueRepeat' });
    engine.advance(10000);
    expect(engine.project()).toMatchObject({
      phase: 'demonstration',
      current: { kind: 'extra', side: 'left', sourceOccurrenceId: 'o0' },
    });
    engine.advance(65000);
    expect(engine.project().current?.id).toBe('o1');
    invariant(engine);
  });
  it('solo una repetición pendiente, permite otra dentro del extra', () => {
    const engine = started();
    expect(send(engine, { type: 'QueueRepeat' }).accepted).toBe(true);
    expect(send(engine, { type: 'QueueRepeat' }).accepted).toBe(false);
    engine.advance(60000);
    expect(send(engine, { type: 'QueueRepeat' }).accepted).toBe(true);
    expect(engine.project().counters.extraAddedMs).toBe(120000);
    invariant(engine);
  });
  it('omitir extra no omite base', () => {
    const engine = started();
    send(engine, { type: 'QueueRepeat' });
    engine.advance(60000);
    send(engine, { type: 'SkipCurrentWork' });
    expect(engine.project().counters).toMatchObject({
      baseOmittedMs: 0,
      extraOmittedMs: 40000,
    });
    invariant(engine);
  });
  it('reintento del mismo commandId devuelve resultado previo sin duplicar', () => {
    const engine = started();
    const first = send(engine, { type: 'QueueRepeat' }, { commandId: 'same' });
    expect(send(engine, { type: 'QueueRepeat' }, { commandId: 'same' })).toBe(first);
    expect(engine.project().counters.extraAddedMs).toBe(60000);
    invariant(engine);
  });
  it('dos omisiones con revisión antigua no saltan dos trabajos', () => {
    const engine = started(plan(2, 0, 40000, 0));
    const old = engine.project();
    const guard = {
      expectedControlRevision: old.controlRevision,
      expectedOccurrenceId: old.current!.id,
    };
    send(engine, { type: 'SkipCurrentWork' }, guard);
    expect(send(engine, { type: 'SkipCurrentWork' }, guard).accepted).toBe(false);
    expect(engine.project()).toMatchObject({ current: { id: 'o1' }, phaseElapsedMs: 0 });
    invariant(engine);
  });
  it.each(['Pause', 'Abort'] as const)('%s no se pierde por una frontera', (type) => {
    const engine = started();
    const old = engine.project();
    engine.advance(60000);
    expect(
      send(
        engine,
        { type },
        {
          expectedControlRevision: old.controlRevision,
          expectedOccurrenceId: old.current!.id,
        },
      ).accepted,
    ).toBe(true);
    expect(engine.project().status).toBe(type === 'Pause' ? 'paused' : 'aborted');
  });
  it('otra sesión o una ocurrencia antigua no cambian el estado', () => {
    const engine = started();
    expect(send(engine, { type: 'Abort' }, { sessionId: 'other' }).accepted).toBe(false);
    expect(
      send(engine, { type: 'QueueRepeat' }, { expectedOccurrenceId: 'other' }).accepted,
    ).toBe(false);
    expect(engine.project().status).toBe('running');
  });
  it('abort cancela extras activos/pendientes y preparación sin acreditarlos', () => {
    const engine = started();
    send(engine, { type: 'QueueRepeat' });
    engine.advance(65000);
    extend(engine);
    engine.advance(1000);
    send(engine, { type: 'Abort' });
    expect(engine.project()).toMatchObject({
      extraRemainingMs: 0,
      preparationRemainingMs: 0,
      counters: {
        extraConsumedMs: 5000,
        extraCancelledMs: 55000,
        preparationConsumedMs: 1000,
        preparationCancelledMs: 29000,
      },
    });
    const events = engine.getEvents().length;
    engine.advance(100000);
    send(engine, { type: 'QueueRepeat' });
    send(engine, { type: 'Abort' });
    expect(engine.getEvents()).toHaveLength(events);
    invariant(engine);
  });
});
describe('preparación automática', () => {
  it('20 s + 30 s da 50 s y trabajo completo desde cero', () => {
    const engine = started();
    engine.advance(40000);
    extend(engine);
    expect(engine.project().startsInMs).toBe(50000);
    engine.advance(20000);
    expect(engine.project()).toMatchObject({
      phase: 'preparation-extra',
      phaseRemainingMs: 30000,
      current: { id: 'o1' },
    });
    engine.advance(30000);
    expect(engine.project()).toMatchObject({
      phase: 'work',
      phaseElapsedMs: 0,
      phaseRemainingMs: 40000,
    });
    invariant(engine);
  });
  it('5 + 30 + 60 da 95, revisiones compartidas y reintento sin duplicar', () => {
    const engine = started();
    engine.advance(55000);
    const revision = engine.project().controlRevision;
    extend(engine, 30000, { expectedControlRevision: revision, commandId: 'a' });
    extend(engine, 60000, { expectedControlRevision: revision, commandId: 'b' });
    extend(engine, 60000, { expectedControlRevision: revision, commandId: 'b' });
    expect(engine.project().startsInMs).toBe(95000);
    engine.advance(97000);
    expect(engine.project()).toMatchObject({
      phase: 'work',
      phaseElapsedMs: 2000,
      counters: { preparationConsumedMs: 90000 },
    });
    invariant(engine);
  });
  it('demostración se consume una vez antes de preparación extra', () => {
    const engine = started(plan(1, 5000));
    extend(engine);
    engine.advance(36000);
    expect(engine.project()).toMatchObject({
      phase: 'work',
      phaseElapsedMs: 1000,
      counters: { baseConsumedMs: 6000, preparationConsumedMs: 30000 },
    });
    invariant(engine);
  });
  it('un comando tardío conserva cursor y lo retoma automáticamente', () => {
    const engine = started();
    engine.advance(60025);
    extend(engine);
    engine.advance(30000);
    expect(engine.project()).toMatchObject({ phase: 'work', phaseElapsedMs: 25 });
    expect(
      engine
        .getEvents()
        .filter(
          (e) =>
            e.type === 'SegmentStarted' &&
            e.occurrenceId === 'o1' &&
            e.payload['phase'] === 'work',
        ),
    ).toHaveLength(1);
    invariant(engine);
  });
  it('pausa congela preparación y ampliar no reanuda por sorpresa', () => {
    const engine = started();
    extend(engine);
    engine.advance(1000);
    send(engine, { type: 'Pause' });
    engine.advance(5000);
    extend(engine, 60000);
    expect(engine.project()).toMatchObject({
      status: 'paused',
      startsInMs: 89000,
      counters: { preparationConsumedMs: 1000, observedPauseMs: 5000 },
    });
    send(engine, { type: 'Resume', visible: true, resourcesReady: true });
    engine.advance(89000);
    expect(engine.project()).toMatchObject({ phase: 'work', phaseElapsedMs: 0 });
    invariant(engine);
  });
  it('encolar/cancelar extra transfiere segundos al objetivo nuevo', () => {
    const engine = started();
    engine.advance(40000);
    extend(engine);
    send(engine, { type: 'QueueRepeat' });
    expect(engine.project().preparationTarget?.kind).toBe('extra');
    expect(engine.project().startsInMs).toBe(50000);
    send(engine, { type: 'CancelQueuedRepeat' });
    expect(engine.project().preparationTarget?.id).toBe('o1');
    engine.advance(50000);
    expect(engine.project()).toMatchObject({
      phase: 'work',
      current: { id: 'o1' },
      phaseElapsedMs: 0,
    });
    invariant(engine);
  });
  it('preparación del extra conserva la base íntegra', () => {
    const engine = started();
    engine.advance(40000);
    extend(engine);
    send(engine, { type: 'QueueRepeat' });
    engine.advance(50000);
    expect(engine.project()).toMatchObject({
      phase: 'work',
      current: { kind: 'extra' },
      phaseElapsedMs: 0,
    });
    engine.advance(120000);
    expect(engine.project()).toMatchObject({
      status: 'completed',
      recordedMs: 210000,
      counters: {
        baseConsumedMs: 120000,
        extraConsumedMs: 60000,
        preparationConsumedMs: 30000,
      },
    });
    invariant(engine);
  });
  it('cancelar el último objetivo cancela preparación huérfana', () => {
    const engine = started(plan(1));
    engine.advance(40000);
    send(engine, { type: 'QueueRepeat' });
    extend(engine);
    send(engine, { type: 'CancelQueuedRepeat' });
    expect(engine.project()).toMatchObject({
      preparationTarget: null,
      preparationRemainingMs: 0,
      counters: { preparationCancelledMs: 30000 },
    });
    invariant(engine);
  });
  it('objetivo viejo, repetir y omitir durante preparación se rechazan', () => {
    const engine = started();
    engine.advance(60000);
    expect(
      send(engine, { type: 'ExtendPreparation', targetOccurrenceId: 'o0', amountMs: 30000 })
        .accepted,
    ).toBe(false);
    extend(engine);
    expect(send(engine, { type: 'QueueRepeat' }).accepted).toBe(false);
    expect(send(engine, { type: 'SkipCurrentWork' }).accepted).toBe(false);
    invariant(engine);
  });
  it.each([30000, 90000])('hora intacta + %s de preparación', (extra) => {
    const engine = started(compileWorkoutV1(fixture));
    extend(engine);
    if (extra === 90000) extend(engine, 60000);
    engine.advance(3600000 + extra);
    expect(engine.project()).toMatchObject({
      status: 'completed',
      baseDurationMs: 3600000,
      recordedMs: 3600000 + extra,
      counters: { baseConsumedMs: 3600000, preparationConsumedMs: extra },
    });
    invariant(engine);
  });
  it('secuencias reproducibles de comandos conservan contadores y eventos', () => {
    let seed = 781;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed;
    };
    for (let trial = 0; trial < 20; trial++) {
      const engine = started(plan(3, 500, 2000, 700));
      for (let step = 0; step < 100; step++) {
        const action = random() % 9;
        if (action === 0) send(engine, { type: 'Pause' });
        else if (action === 1)
          send(engine, { type: 'Resume', visible: true, resourcesReady: true });
        else if (action === 2) send(engine, { type: 'QueueRepeat' });
        else if (action === 3) send(engine, { type: 'CancelQueuedRepeat' });
        else if (action === 4) send(engine, { type: 'SkipCurrentWork' });
        else if (action === 5) extend(engine);
        else engine.advance(random() % 15000);
        invariant(engine);
      }
      send(engine, { type: 'Resume', visible: true, resourcesReady: true });
      engine.advance(100000000);
      expect(engine.project().status).toBe('completed');
      invariant(engine);
    }
  });
});
