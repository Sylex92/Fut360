import { expect, it } from 'vitest';
import { HingeDemo, hingePlan } from '../apps/coach-pwa/src/composition/hinge-demo';

function setup(minutes: 1 | 5 = 1) {
  let now = 0;
  const demo = new HingeDemo(hingePlan(minutes), 'hinge-test', () => now);
  const tick = (ms: number) => {
    while (ms > 0) {
      const step = Math.min(ms, 1000);
      now += step;
      ms -= step;
      demo.sample();
    }
    return demo.snapshot();
  };
  return {
    demo,
    tick,
    jump: (ms: number) => {
      now += ms;
      return demo.sample();
    },
  };
}
it('no inicia sin avatar y la vista previa no acredita tiempo de sesión', () => {
  const { demo, tick } = setup();
  expect(demo.act({ type: 'Start' })).not.toBe('');
  demo.setReady(true);
  expect(tick(2500)).toMatchObject({
    poseMs: 2500,
    mode: 'preview',
    session: { recordedMs: 0, baseRemainingMs: 60000 },
  });
  demo.toggleReadyPreview();
  expect(tick(1500).poseMs).toBe(2500);
  demo.toggleReadyPreview();
  expect(tick(1000).poseMs).toBe(3500);
});
it('presenta tres gestos finitos y reposa antes del descanso, sin bucle de 30 s', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  expect(demo.act({ type: 'Start' })).toBe('');
  expect(tick(10000)).toMatchObject({ poseMs: 0, mode: 'practice' });
  expect(tick(7999).poseMs).toBe(7999);
  expect(tick(1).poseMs).toBe(0);
  expect(tick(16000)).toMatchObject({
    poseMs: 8000,
    mode: 'rest',
    session: { phase: 'work', phaseRemainingMs: 6000 },
  });
  expect(tick(6000).session.phase).toBe('rest');
  expect(tick(20000).session).toMatchObject({
    status: 'completed',
    recordedMs: 60000,
    outcome: 'completed',
  });
});
it('preview sostiene el retorno 2 s y vuelve a empezar sin consumir trabajo', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  expect(tick(8500).poseMs).toBe(8000);
  expect(tick(1500).poseMs).toBe(0);
});
it('sumar +30/+60 durante el ejemplo mantiene autoinicio y la ventana completa', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(7000);
  for (const amountMs of [30000, 60000] as const)
    expect(
      demo.act({ type: 'ExtendPreparation', targetOccurrenceId: 'hinge-1', amountMs }),
    ).toBe('');
  expect(demo.snapshot().session.startsInMs).toBe(93000);
  expect(tick(92000).mode).toBe('preview');
  expect(tick(1000)).toMatchObject({
    mode: 'practice',
    poseMs: 0,
    session: { phaseRemainingMs: 30000 },
  });
  expect(tick(50000).session).toMatchObject({
    status: 'completed',
    recordedMs: 150000,
    counters: { baseConsumedMs: 60000, preparationConsumedMs: 90000 },
  });
});
it('añadir preparación durante trabajo conserva exactamente su cursor', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(12250);
  demo.act({ type: 'ExtendPreparation', targetOccurrenceId: 'hinge-1', amountMs: 30000 });
  expect(tick(2000)).toMatchObject({ mode: 'preview', poseMs: 2000 });
  expect(tick(28000)).toMatchObject({
    mode: 'practice',
    poseMs: 2250,
    session: { phaseRemainingMs: 27750 },
  });
});
it('pausa congela ejemplo, cuenta adicional y trabajo hasta Continuar', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(2200);
  demo.act({ type: 'Pause' });
  const pose = demo.snapshot().poseMs;
  demo.act({ type: 'ExtendPreparation', targetOccurrenceId: 'hinge-1', amountMs: 30000 });
  const saved = demo.snapshot();
  expect(saved.poseMs).toBe(pose);
  expect(tick(5000)).toMatchObject({
    poseMs: saved.poseMs,
    session: { startsInMs: saved.session.startsInMs, counters: { baseConsumedMs: 2200 } },
  });
  expect(pose).toBe(2200);
  demo.act({ type: 'Resume', visible: true, resourcesReady: true });
  expect(tick(37800).mode).toBe('practice');
});
it('inspección lenta recorre un gesto y regresa a la pose original, sin consumir base', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(13250);
  expect(demo.openInspection()).not.toBe('');
  demo.act({ type: 'Pause' });
  expect(demo.openInspection()).toBe('');
  demo.seekInspection(0);
  demo.playInspection(0.5);
  expect(tick(5000)).toMatchObject({
    mode: 'inspection',
    poseMs: 2500,
    session: { phaseElapsedMs: 3250, counters: { baseConsumedMs: 13250 } },
  });
  expect(tick(11000)).toMatchObject({ poseMs: 8000, inspectionPlaying: false });
  demo.closeInspection();
  expect(demo.snapshot()).toMatchObject({
    poseMs: 3250,
    mode: 'practice',
    session: { status: 'paused' },
  });
  demo.act({ type: 'Resume', visible: true, resourcesReady: true });
  expect(tick(500).poseMs).toBe(3750);
});
it('Continuar desde inspector restaura el trabajo, no la pose de inspección', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(15000);
  demo.act({ type: 'Pause' });
  demo.openInspection();
  demo.seekInspection(1000);
  demo.act({ type: 'Resume', visible: true, resourcesReady: true });
  expect(demo.snapshot()).toMatchObject({
    poseMs: 5000,
    inspecting: false,
    session: { status: 'running' },
  });
});
it('fallo y recuperación del avatar no reanudan ni acreditan tiempo automáticamente', () => {
  const { demo, tick } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(14000);
  demo.setReady(false);
  expect(tick(7000)).toMatchObject({
    poseMs: 4000,
    session: { status: 'paused', pauseReason: 'resource', phaseElapsedMs: 4000 },
  });
  expect(demo.act({ type: 'Resume', visible: true, resourcesReady: true })).not.toBe('');
  demo.setReady(true);
  expect(tick(1000).session.status).toBe('paused');
  demo.act({ type: 'Resume', visible: true, resourcesReady: true });
  expect(tick(500).poseMs).toBe(4500);
});
it('ocultar y huecos del reloj detienen también la inspección', () => {
  const { demo, tick, jump } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(11000);
  demo.act({ type: 'Pause' });
  demo.openInspection();
  demo.playInspection(0.5);
  demo.setVisible(false);
  jump(60000);
  demo.setVisible(true);
  expect(demo.snapshot()).toMatchObject({ poseMs: 1000, inspectionPlaying: false });
  demo.playInspection(0.5);
  expect(jump(2001)).toMatchObject({ poseMs: 1000, inspectionPlaying: false });
});
it('una pausa larga del navegador congela el programa sin contar repeticiones no vistas', () => {
  const { demo, tick, jump } = setup();
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(12000);
  expect(jump(60000)).toMatchObject({
    poseMs: 2000,
    session: {
      status: 'paused',
      pauseReason: 'clock-gap',
      counters: { baseConsumedMs: 12000, unobservedMs: 60000 },
    },
  });
});
it('repetir añade bloque después del descanso y 5 min concluyen sin perder base', () => {
  const { demo, tick } = setup(5);
  demo.setReady(true);
  demo.act({ type: 'Start' });
  tick(12000);
  demo.act({ type: 'QueueRepeat' });
  tick(48000);
  expect(demo.snapshot().session.current?.kind).toBe('extra');
  expect(tick(60000).session.current?.id).toBe('hinge-2');
  expect(tick(240000).session).toMatchObject({
    status: 'completed',
    recordedMs: 360000,
    counters: { baseConsumedMs: 300000, extraConsumedMs: 60000 },
  });
});
it('resto previo de 5 min muestra el siguiente ejemplo sin mover el cursor del trabajo', () => {
  const { demo, tick } = setup(5);
  demo.setReady(true);
  demo.act({ type: 'Start' });
  expect(tick(40500)).toMatchObject({
    mode: 'preview',
    poseMs: 500,
    session: { phase: 'rest' },
  });
  expect(tick(29500)).toMatchObject({
    mode: 'practice',
    poseMs: 0,
    session: { current: { id: 'hinge-2' }, phaseElapsedMs: 0 },
  });
});
