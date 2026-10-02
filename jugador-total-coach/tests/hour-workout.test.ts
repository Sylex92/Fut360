import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { compileWorkoutV2 } from '../packages/exercise-catalog/src/workout-v2';
import {
  HourWorkout,
  hourWorkout,
  hourReferences,
} from '../apps/coach-pwa/src/composition/hour-workout';
import { movements } from '../apps/coach-pwa/src/composition/movement-library';
import catalog from '../assets/phase06-catalog.json';
import input from '../content/workouts/mvp1-60min-v2.json';

const references = hourReferences;
function setup(rate: 1 | 60 = 1) {
  let now = 0;
  const controller = new HourWorkout('hour', () => now, true, rate);
  const advance = (ms: number) => {
    const until = now + ms;
    while (now < until) {
      now = Math.min(until, now + 100);
      controller.sample();
    }
    return controller.snapshot();
  };
  return {
    controller,
    advance,
    jump: (ms: number) => {
      now += ms;
      return controller.sample();
    },
  };
}
describe('programa v2 y cobertura', () => {
  it('compila seis bloques, 52 ocurrencias y 3600 s incluyendo preparación', () => {
    expect(hourWorkout.plan.expectedDurationMs).toBe(3600000);
    expect(hourWorkout.plan.occurrences).toHaveLength(52);
    expect(hourWorkout.workout.blocks.map((b) => b.expectedSeconds)).toEqual([
      480, 720, 600, 960, 480, 360,
    ]);
    expect(hourWorkout.plan.purpose).toBe('training-draft');
    expect(new Set(hourWorkout.plan.occurrences.map((o) => o.exerciseId)).size).toBe(16);
    const used = new Set(hourWorkout.plan.occurrences.map((o) => o.exerciseId));
    expect(
      new Set(catalog.entries.filter((e) => used.has(e.exerciseId)).map((e) => e.patternId))
        .size,
    ).toBe(12);
    expect(used.has('inside-outside-sole-left')).toBe(false);
  });
  it('cada clip/variante realmente existe y coincide con el manifiesto y la ficha', () => {
    for (const m of movements) {
      const entry = catalog.entries.find((e) => e.exerciseId === m.id)!;
      const manifest = JSON.parse(readFileSync(entry.manifest, 'utf8')) as {
        durationMs: number;
        clipName: string;
        reviewStatus: string;
      };
      const exercise = JSON.parse(readFileSync(entry.exercise, 'utf8')) as {
        animation: { clipName: string };
        reviewStatus: string;
      };
      expect(m.durationMs).toBe(manifest.durationMs);
      expect(m.clipName).toBe(exercise.animation.clipName);
      expect(exercise.reviewStatus).toBe('draft');
    }
  });
  it('crea una copia inmutable de instrucciones y tiempos', () => {
    const source = structuredClone(input);
    const result = compileWorkoutV2(source, references);
    source.blocks[0]!.items[0]!.dose = 'changed';
    expect(result.workout.blocks[0]!.items[0]!.dose).not.toBe('changed');
    expect(Object.isFrozen(result.workout.blocks[0]!.items[0])).toBe(true);
  });
  it.each([
    'missing',
    'wrong-side',
    'too-long',
    'duplicate',
    'round',
    'total',
    'extra-field',
  ] as const)('rechaza %s sin fallback silencioso', (kind) => {
    const source = structuredClone(input);
    const first = source.blocks[0]!.items[0]!;
    if (kind === 'missing') first.exerciseId = 'unknown';
    if (kind === 'wrong-side') first.side = 'left';
    if (kind === 'too-long') first.exampleRepetitions = 10;
    if (kind === 'duplicate') source.blocks[1]!.items[0]!.id = first.id;
    if (kind === 'round') first.round = 2;
    if (kind === 'total') source.blocks[0]!.expectedSeconds = 481;
    if (kind === 'extra-field') Object.assign(first, { hiddenProperty: true });
    expect(() => compileWorkoutV2(source, references)).toThrow();
  });
});
describe('composición de sesión completa', () => {
  it('no inicia sin recursos; después termina exactamente la hora y muestra el cierre correcto', () => {
    const { controller: c, advance } = setup();
    expect(c.act({ type: 'Start' })).not.toBe('');
    c.setReady(true);
    expect(c.act({ type: 'Start' })).toBe('');
    advance(3599999);
    expect(c.snapshot().session.status).toBe('running');
    advance(1);
    const s = c.snapshot();
    expect(s.session.status).toBe('completed');
    expect(s.session.recordedMs).toBe(3600000);
    expect(s.movement.id).toBe('slow-breathing');
  });
  it('durante descanso presenta el siguiente movimiento y conserva la fase actual', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    advance(55000);
    const s = c.snapshot();
    expect(s.session.phase).toBe('rest');
    expect(s.movement.id).toBe('ankle-mobility-left');
    expect(s.session.current?.exerciseId).toBe('active-march');
    advance(5000);
    expect(c.snapshot().session.phase).toBe('demonstration');
    expect(c.snapshot().movement.id).toBe('ankle-mobility-left');
  });
  it('pausa inmoviliza pose y reloj; inspección no consume trabajo y devuelve el mismo punto', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    advance(17345);
    c.act({ type: 'Pause' });
    const before = c.snapshot();
    advance(4000);
    expect(c.snapshot().poseMs).toBe(before.poseMs);
    expect(c.snapshot().session.baseRemainingMs).toBe(before.session.baseRemainingMs);
    c.openInspection();
    c.seek(7000);
    c.playInspection(0.5);
    advance(500);
    expect(c.snapshot().poseMs).toBe(7250);
    expect(c.snapshot().session.baseRemainingMs).toBe(before.session.baseRemainingMs);
    c.closeInspection();
    expect(c.snapshot().poseMs).toBe(before.poseMs);
    c.act({ type: 'Resume', visible: true, resourcesReady: true });
    advance(10);
    expect(c.snapshot().session.baseRemainingMs).toBe(before.session.baseRemainingMs - 10);
  });
  it('extra en trabajo muestra ejemplo y retoma automáticamente el cursor sin perder trabajo', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    advance(19000);
    const before = c.snapshot();
    c.act({
      type: 'ExtendPreparation',
      targetOccurrenceId: before.session.preparationTarget!.id,
      amountMs: 30000,
    });
    expect(c.snapshot().session.phase).toBe('preparation-extra');
    expect(c.snapshot().mode).toBe('preview');
    advance(1000);
    expect(c.snapshot().poseMs).toBe(1000);
    advance(29000);
    expect(c.snapshot().session.phase).toBe('work');
    expect(c.snapshot().poseMs).toBe(before.poseMs);
    expect(c.snapshot().session.baseRemainingMs).toBe(before.session.baseRemainingMs);
    advance(3581000);
    expect(c.snapshot().session.status).toBe('completed');
    expect(c.snapshot().session.recordedMs).toBe(3630000);
  });
  it('ocultación detiene y vuelve automáticamente; pausa manual y fallos no', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    advance(1000);
    c.setVisible(false);
    advance(5000);
    expect(c.snapshot().session.baseRemainingMs).toBe(3599000);
    c.setVisible(true);
    expect(c.snapshot().session.status).toBe('running');
    c.act({ type: 'Pause' });
    c.setVisible(false);
    advance(5000);
    c.setVisible(true);
    expect(c.snapshot().session.status).toBe('paused');
    c.act({ type: 'Resume', visible: true, resourcesReady: true });
    c.setReady(false);
    advance(1000);
    c.setReady(true);
    expect(c.snapshot().session.status).toBe('paused');
    expect(c.snapshot().session.pauseReason).toBe('resource');
  });
  it('una repetición extra conserva indicaciones/variante y añade solo su intervalo', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    c.act({ type: 'QueueRepeat' });
    advance(60000);
    const s = c.snapshot();
    expect(s.session.current?.kind).toBe('extra');
    expect(s.item.id).toBe('warmup-1');
    expect(s.movement.id).toBe('active-march');
    expect(s.session.baseRemainingMs).toBe(3540000);
    expect(s.session.extraRemainingMs).toBe(60000);
  });
  it('omitir conserva descanso y el ejemplo siguiente, cancelando repetición pendiente', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    advance(20000);
    c.act({ type: 'QueueRepeat' });
    c.act({ type: 'SkipCurrentWork' });
    const s = c.snapshot();
    expect(s.session.phase).toBe('rest');
    expect(s.movement.id).toBe('ankle-mobility-left');
    expect(s.session.repeatQueued).toBe(false);
    expect(s.session.counters.baseOmittedMs).toBe(35000);
  });
  it('repetir durante descanso muestra el anterior desde el inicio; cancelar restaura el siguiente', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    advance(56000);
    expect(c.snapshot().movement.id).toBe('ankle-mobility-left');
    expect(c.snapshot().poseMs).toBe(1000);
    c.act({ type: 'QueueRepeat' });
    expect(c.snapshot().movement.id).toBe('active-march');
    expect(c.snapshot().poseMs).toBe(0);
    advance(500);
    c.act({ type: 'CancelQueuedRepeat' });
    expect(c.snapshot().movement.id).toBe('ankle-mobility-left');
    expect(c.snapshot().poseMs).toBe(0);
  });
  it('serie visual finita termina aunque quede ventana disponible', () => {
    const { controller: c, advance } = setup();
    c.setReady(true);
    c.act({ type: 'Start' });
    // Warmup hinge starts at 180s, work at 195s, fourth gesture ends at 227s.
    advance(227000);
    const s = c.snapshot();
    expect(s.session.phase).toBe('work');
    expect(s.movement.id).toBe('hip-hinge');
    expect(s.mode).toBe('rest');
    expect(s.poseMs).toBe(8000);
  });
  it('modo acelerado conserva duración lógica y detecta huecos del reloj real', () => {
    const { controller: c, advance, jump } = setup(60);
    c.setReady(true);
    c.act({ type: 'Start' });
    advance(500);
    expect(c.snapshot().session.baseRemainingMs).toBe(3570000);
    jump(2100);
    expect(c.snapshot().session.pauseReason).toBe('clock-gap');
    expect(c.snapshot().session.baseRemainingMs).toBe(3570000);
    c.act({ type: 'Resume', visible: true, resourcesReady: true });
    advance(59500);
    expect(c.snapshot().session.status).toBe('completed');
    expect(c.snapshot().session.counters.baseConsumedMs).toBe(3600000);
  });
});

it.each([
  'format',
  'exercise-version',
  'resource-version',
  'hash',
  'scene',
  'equipment',
  'timed-dose',
  'finite-dose',
  'count',
] as const)('impide una definición incompatible: %s', (kind) => {
  const source = structuredClone(input);
  if (kind === 'format') source.schemaVersion = 3;
  if (kind === 'exercise-version') source.blocks[0]!.items[0]!.exerciseVersion++;
  if (kind === 'resource-version') source.resources[0]!.assetVersion++;
  if (kind === 'hash') source.resources[0]!.sha256 = '0'.repeat(64);
  if (kind === 'scene') source.resources[0]!.sceneId = 'guided-floor-v1';
  if (kind === 'equipment') source.equipment = ['ball'];
  if (kind === 'timed-dose') source.blocks[0]!.items[0]!.targetRepetitions = 5;
  if (kind === 'finite-dose') source.blocks[0]!.items[1]!.targetRepetitions = null;
  if (kind === 'count') source.blocks[0]!.items[1]!.targetRepetitions = 3;
  expect(() => compileWorkoutV2(source, references)).toThrow();
});

it('la definición completada conserva exactamente identidades, lados y tiempos de la hora ya iniciada', () => {
  const baseline = JSON.parse(
    readFileSync('docs/reviews/evidence/phase07/workout-timing-baseline.json', 'utf8'),
  ) as typeof input;
  const timing = (workout: typeof input) =>
    workout.blocks.flatMap((b) =>
      b.items.map((i) => ({
        id: i.id,
        exerciseId: i.exerciseId,
        side: i.side,
        demonstrationSeconds: i.demonstrationSeconds,
        workSeconds: i.workSeconds,
        restSeconds: i.restSeconds,
        exampleRepetitions: i.exampleRepetitions,
        dose: i.dose,
        preparation: i.preparation,
      })),
    );
  expect(timing(input)).toEqual(timing(baseline));
});
