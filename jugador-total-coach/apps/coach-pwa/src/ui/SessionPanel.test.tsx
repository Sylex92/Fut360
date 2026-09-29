import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { prepareSession, shortTechnicalPlan } from '../composition/session';
import { SessionPanel, SessionReadout } from './SessionPanel';
import { compileWorkoutV1 } from '@fut360/exercise-catalog';
import fixture from '../../../../content/examples/mvp1-60min.workout.json';

it('identifica la prueba, la pérdida por recarga y el selector de una hora', () => {
  const html = renderToStaticMarkup(<SessionPanel content={{}} />);
  expect(html).toContain('No sigas los intervalos como una rutina');
  expect(html).toContain('60 minutos');
  expect(html).toContain('Recargar la página pierde');
  expect(html).not.toContain('Estoy listo');
});
it('no acredita visualmente segundos incompletos del tiempo registrado', () => {
  const clock = prepareSession(compileWorkoutV1(fixture), 'rounding', () => 0);
  clock.dispatch({ type: 'Start' });
  clock.engine.advance(3200);
  const state = clock.engine.project();
  const html = renderToStaticMarkup(<SessionReadout state={state} />);
  expect(html).toContain('<dt>Base restante</dt><dd>59:57</dd>');
  expect(html).toContain('<dt>Tiempo registrado</dt><dd>00:03</dd>');
  expect(state.recordedMs).toBe(3200);
  expect(state.baseRemainingMs).toBe(3596800);
});
it('presenta una cuenta de preparación que se inicia automáticamente', () => {
  const clock = prepareSession(shortTechnicalPlan, 'render', () => 0);
  clock.dispatch({ type: 'Start' });
  clock.dispatch({ type: 'ExtendPreparation', targetOccurrenceId: 'step-a', amountMs: 30000 });
  const html = renderToStaticMarkup(<SessionReadout state={clock.engine.project()} />);
  expect(html).toContain('Empieza');
  expect(html).toContain('automáticamente en');
  expect(html).toContain('00:35');
});
it('muestra pausa, huecos y omisiones sin atribuir actividad física', () => {
  const clock = prepareSession(shortTechnicalPlan, 'pause-render', () => 0);
  clock.dispatch({ type: 'Start' });
  clock.engine.interrupt('clock-gap', 5000);
  const html = renderToStaticMarkup(<SessionReadout state={clock.engine.project()} />);
  expect(html).toContain('Pausa por interrupción');
  expect(html).toContain('00:05');
  expect(html).toContain('no actividad física medida');
});
it('anuncia el lado del próximo objetivo durante el descanso', () => {
  const compiled = compileWorkoutV1(fixture);
  const current = compiled.occurrences[0]!;
  const next = compiled.occurrences[1]!;
  const clock = prepareSession(
    {
      ...compiled,
      expectedDurationMs: 4000,
      occurrences: [
        { ...current, side: 'left', demonstrationMs: 0, workMs: 1000, restMs: 1000 },
        { ...next, side: 'right', demonstrationMs: 0, workMs: 1000, restMs: 1000 },
      ],
    },
    'preview-side',
    () => 0,
  );
  clock.dispatch({ type: 'Start' });
  clock.engine.advance(1000);
  const html = renderToStaticMarkup(<SessionReadout state={clock.engine.project()} />);
  expect(html).toContain('Lado: izquierdo');
  expect(html).toContain('Lado a preparar: derecho');
});
