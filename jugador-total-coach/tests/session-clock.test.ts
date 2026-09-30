import { expect, it } from 'vitest';
import { prepareSession, shortTechnicalPlan } from '../apps/coach-pwa/src/composition/session';

function setup() {
  let time = 0;
  const clock = prepareSession(shortTechnicalPlan, 'clock-test', () => time);
  clock.dispatch({ type: 'Start' });
  return {
    clock,
    at: (ms: number) => {
      time = ms;
    },
    tick: (ms: number) => {
      time += ms;
      return clock.sample();
    },
  };
}
it('muestrea milisegundos monotónicos, no descuenta un segundo por callback', () => {
  const { clock, at } = setup();
  at(123.7);
  clock.sample();
  at(999.9);
  clock.sample();
  expect(clock.engine.project().phaseElapsedMs).toBe(999);
});
it('el límite de 2000 ms es confiable, 2001 es un hueco sin trabajo', () => {
  const { clock, tick } = setup();
  tick(2000);
  tick(2001);
  expect(clock.engine.project()).toMatchObject({
    status: 'paused',
    pauseReason: 'clock-gap',
    counters: { baseConsumedMs: 2000, unobservedMs: 2001 },
  });
  clock.dispatch({ type: 'Resume', visible: true, resourcesReady: true });
  tick(500);
  expect(clock.engine.project().counters.baseConsumedMs).toBe(2500);
});
it('ocultar congela en último instante confiable y volver retoma sin consumir lo oculto', () => {
  const { clock, tick, at } = setup();
  tick(1000);
  at(1500);
  clock.setVisible(false);
  expect(clock.engine.project()).toMatchObject({ status: 'paused', phaseElapsedMs: 1500 });
  at(101500);
  clock.setVisible(true);
  expect(clock.engine.project()).toMatchObject({
    status: 'running',
    phaseElapsedMs: 1500,
    counters: { unobservedMs: 100000, observedPauseMs: 0 },
  });
  tick(500);
  expect(clock.engine.project().phaseElapsedMs).toBe(2000);
});
it('ocultar una pausa manual conserva su motivo y no la reanuda al volver', () => {
  const { clock, tick } = setup();
  tick(1000);
  clock.dispatch({ type: 'Pause' });
  clock.setVisible(false);
  tick(30000);
  expect(clock.setVisible(true)).toMatchObject({
    status: 'paused',
    pauseReason: 'manual',
    phaseElapsedMs: 1000,
    counters: { unobservedMs: 30000, baseConsumedMs: 1000 },
  });
});
it('una pausa manual recibida estando oculto cancela el regreso automático', () => {
  const { clock, tick } = setup();
  tick(1000);
  clock.setVisible(false);
  clock.dispatch({ type: 'Pause' });
  tick(30000);
  expect(clock.setVisible(true)).toMatchObject({
    status: 'paused',
    pauseReason: 'manual',
    phaseElapsedMs: 1000,
  });
});
it.each([false, true])(
  'un fallo de recurso oculto exige continuar aunque se recupere: %s',
  (recovered) => {
    const { clock, tick } = setup();
    tick(1000);
    clock.setVisible(false);
    tick(5000);
    clock.setResourcesReady(false);
    if (recovered) clock.setResourcesReady(true);
    tick(5000);
    expect(clock.setVisible(true)).toMatchObject({
      status: 'paused',
      pauseReason: 'resource',
      phaseElapsedMs: 1000,
      counters: { unobservedMs: 10000, baseConsumedMs: 1000 },
    });
    clock.setResourcesReady(true);
    expect(clock.engine.project().status).toBe('paused');
  },
);
it('un hueco visible detectado al ocultar no se convierte en pausa recuperable automática', () => {
  const { clock, at, tick } = setup();
  tick(1000);
  at(6000);
  clock.setVisible(false);
  tick(5000);
  expect(clock.setVisible(true)).toMatchObject({
    status: 'paused',
    pauseReason: 'clock-gap',
    phaseElapsedMs: 1000,
    counters: { unobservedMs: 10000 },
  });
});
it.each([NaN, Infinity, 500])(
  'una lectura inválida/retroceso oculto (%s) cancela el regreso automático',
  (reading) => {
    const { clock, at, tick } = setup();
    tick(1000);
    clock.setVisible(false);
    at(reading);
    clock.sample();
    at(2000);
    expect(clock.setVisible(true)).toMatchObject({
      status: 'paused',
      pauseReason: 'clock-error',
      phaseElapsedMs: 1000,
    });
  },
);
it('eventos de visibilidad repetidos no desarman ni duplican la reanudación', () => {
  const { clock, tick } = setup();
  tick(1000);
  clock.setVisible(false);
  tick(5000);
  clock.setVisible(false);
  tick(5000);
  const resumed = clock.setVisible(true);
  expect(resumed.status).toBe('running');
  expect(clock.setVisible(true).controlRevision).toBe(resumed.controlRevision);
  expect(tick(500).phaseElapsedMs).toBe(1500);
});
it.each(['ready', 'completed', 'aborted'] as const)(
  'mostrar la ventana no inicia ni reinicia una sesión %s',
  (status) => {
    const clock = prepareSession(shortTechnicalPlan, 'not-running', () => 0);
    if (status !== 'ready') {
      clock.dispatch({ type: 'Start' });
      if (status === 'completed') clock.engine.advance(60000);
      else clock.dispatch({ type: 'Abort' });
    }
    expect(clock.engine.project().status).toBe(status);
    clock.setVisible(false);
    expect(clock.setVisible(true).status).toBe(status);
  },
);
it('Pausar muestrea el instante del clic y el anclaje no consume la pausa', () => {
  const { clock, tick, at } = setup();
  at(500);
  clock.dispatch({ type: 'Pause' });
  tick(1500);
  clock.dispatch({ type: 'Resume', visible: true, resourcesReady: true });
  tick(500);
  expect(clock.engine.project()).toMatchObject({
    phaseElapsedMs: 1000,
    counters: { observedPauseMs: 1500 },
  });
});
it('resuelve frontera antes de omitir y rechaza el control obsoleto', () => {
  const { clock, at } = setup();
  at(4000);
  clock.sample(); // gap pauses; resume explicitly
  clock.dispatch({ type: 'Resume', visible: true, resourcesReady: true });
  for (let i = 1; i <= 14; i++) {
    at(4000 + i * 1000);
    clock.sample();
  }
  const old = clock.engine.project(); // work ends at logical 15000
  at(19000);
  expect(clock.dispatch({ type: 'SkipCurrentWork' }, old).accepted).toBe(false);
  expect(clock.engine.project().phase).toBe('rest');
});
it('extensión emitida antes de frontera se aplica al mismo trabajo ya iniciado', () => {
  const { clock, tick, at } = setup();
  tick(2000);
  tick(2000);
  tick(990);
  const observed = clock.engine.project();
  at(5010);
  expect(
    clock.dispatch(
      {
        type: 'ExtendPreparation',
        amountMs: 30000,
        targetOccurrenceId: observed.preparationTarget!.id,
      },
      observed,
    ).accepted,
  ).toBe(true);
  expect(clock.engine.project()).toMatchObject({
    phase: 'preparation-extra',
    resumingWork: true,
    counters: { baseConsumedMs: 5010 },
  });
  clock.engine.advance(30000);
  expect(clock.engine.project()).toMatchObject({ phase: 'work', phaseElapsedMs: 10 });
});
it.each([-1, NaN, Infinity])('lectura %s no consume tiempo y pausa', (value) => {
  const { clock, at } = setup();
  at(value);
  clock.sample();
  expect(clock.engine.project()).toMatchObject({
    status: 'paused',
    pauseReason: 'clock-error',
    recordedMs: 0,
  });
});
it('no inicia oculta; fallo de recursos exige disponibilidad antes de continuar', () => {
  const clock = prepareSession(shortTechnicalPlan, 'hidden', () => 0, false);
  expect(clock.dispatch({ type: 'Start' }).accepted).toBe(false);
  clock.setVisible(true);
  clock.dispatch({ type: 'Start' });
  clock.setResourcesReady(false);
  expect(clock.engine.project().pauseReason).toBe('resource');
  expect(
    clock.dispatch({ type: 'Resume', visible: true, resourcesReady: true }).accepted,
  ).toBe(false);
  clock.setResourcesReady(true);
  expect(
    clock.dispatch({ type: 'Resume', visible: true, resourcesReady: true }).accepted,
  ).toBe(true);
});
