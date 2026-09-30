import { useEffect, useId, useRef, useState } from 'react';
import type { ExecutionPlan, SessionAction, SessionProjection } from '@fut360/domain';
import { occurrenceDuration } from '@fut360/domain';
import { compileWorkoutV1 } from '@fut360/exercise-catalog';
import { prepareSession, shortTechnicalPlan } from '../composition/session';
import type { SessionClock } from '../platform/session-clock';

const time = (ms: number, kind: 'remaining' | 'elapsed' = 'remaining') => {
  const seconds = kind === 'elapsed' ? Math.floor(ms / 1000) : Math.ceil(ms / 1000);
  return (
    Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0') +
    ':' +
    (seconds % 60).toString().padStart(2, '0')
  );
};
const phases = {
  demonstration: 'Preparación',
  work: 'Trabajo de prueba',
  rest: 'Descanso',
  'preparation-extra': 'Preparación adicional',
};
const reasons = {
  manual: 'Pausa manual',
  hidden: 'Pausa al ocultar la página',
  'clock-gap': 'Pausa por interrupción del reloj',
  'clock-error': 'Pausa por lectura inválida del reloj',
  resource: 'Pausa por recurso no disponible',
};
const sideLabel = (side: string) =>
  side === 'left'
    ? 'izquierdo'
    : side === 'right'
      ? 'derecho'
      : side === 'alternate'
        ? 'alternado'
        : side;

export function SessionReadout({ state }: { state: SessionProjection }) {
  const finished = state.status === 'completed' || state.status === 'aborted';
  const label =
    state.status === 'ready'
      ? 'Lista para probar'
      : state.status === 'completed'
        ? 'Prueba completada'
        : state.status === 'aborted'
          ? 'Prueba terminada'
          : state.status === 'paused'
            ? reasons[state.pauseReason ?? 'manual']
            : state.phase
              ? phases[state.phase]
              : 'Preparando';
  return (
    <>
      <p className="session-state" role="status">
        {label}
      </p>
      {state.error && <p role="alert">{state.error}</p>}
      <div className="session-readout">
        <div>
          <h3>
            {finished ? 'Resultado de la prueba' : (state.current?.title ?? 'Preparando')}
          </h3>
          {state.current && state.current.side !== 'none' && (
            <p>Lado: {sideLabel(state.current.side)}</p>
          )}
          <p className="session-time" aria-label="Tiempo restante del intervalo">
            {time(
              finished
                ? 0
                : state.status === 'ready'
                  ? state.baseDurationMs
                  : state.phaseRemainingMs,
            )}
          </p>
          {state.status === 'paused' && (
            <p>El tiempo está detenido. Continúa cuando puedas.</p>
          )}
          {state.outcome === 'completed-with-omissions' && (
            <p>Completada con trabajo omitido.</p>
          )}
        </div>
        <div className="session-preview">
          {state.startsInMs !== null ? (
            <>
              <p className="eyebrow">
                {state.resumingWork ? 'RETOMA EL MISMO PUNTO' : 'PREPÁRATE PARA'}
              </p>
              <strong>{state.preparationTarget?.title}</strong>
              {state.preparationTarget && state.preparationTarget.side !== 'none' && (
                <p>Lado a preparar: {sideLabel(state.preparationTarget.side)}</p>
              )}
              <p>
                {state.resumingWork ? 'Reanuda' : 'Empieza'} automáticamente en{' '}
                <b>{time(state.startsInMs)}</b>
              </p>
              {state.status === 'running' &&
                state.startsInMs > 0 &&
                state.startsInMs <= 5000 && (
                  <p className="countdown-cue" role="status">
                    {state.resumingWork ? 'Reanudación' : 'Inicio'} en{' '}
                    {Math.ceil(state.startsInMs / 1000)}…
                  </p>
                )}
              <p>
                La demostración con avatar se incorporará después. Ahora comprobamos únicamente
                los tiempos.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">{finished ? 'REGISTRO TEMPORAL' : 'A CONTINUACIÓN'}</p>
              <strong>
                {finished
                  ? 'Esta prueba permanece solo en memoria'
                  : (state.next?.title ?? 'Fin de la prueba')}
              </strong>
              <p>
                {finished
                  ? 'Recargar la página descarta este resultado.'
                  : 'Las transiciones avanzan automáticamente.'}
              </p>
            </>
          )}
        </div>
      </div>
      <dl className="session-totals">
        <div>
          <dt>Base restante</dt>
          <dd>{time(state.baseRemainingMs)}</dd>
        </div>
        <div>
          <dt>Preparación extra restante</dt>
          <dd>{time(state.preparationRemainingMs)}</dd>
        </div>
        <div>
          <dt>Repeticiones extra restantes</dt>
          <dd>{time(state.extraRemainingMs)}</dd>
        </div>
        <div>
          <dt>Tiempo registrado</dt>
          <dd>{time(state.recordedMs, 'elapsed')}</dd>
        </div>
      </dl>
      <p className="table-note">
        Programado: {time(state.baseDurationMs)} · Preparación extra añadida:{' '}
        {time(state.counters.preparationAddedMs)} · Pausas observadas:{' '}
        {time(state.counters.observedPauseMs, 'elapsed')} · Huecos sin acreditar:{' '}
        {time(state.counters.unobservedMs, 'elapsed')}
      </p>
      <p className="table-note">
        Trabajo omitido:{' '}
        {time(state.counters.baseOmittedMs + state.counters.extraOmittedMs, 'elapsed')} ·
        Tiempo de reproducción, no actividad física medida.
      </p>
    </>
  );
}

export function SessionPanel({ content }: { content: unknown }) {
  const instanceId = useId();
  const clock = useRef<SessionClock | null>(null);
  const run = useRef(0);
  const [selection, setSelection] = useState('short');
  const [state, setState] = useState<SessionProjection | null>(null);
  const [feedback, setFeedback] = useState('');
  const [failure, setFailure] = useState('');
  const initialPlan = useRef<ExecutionPlan>(shortTechnicalPlan);
  const reset = (plan: ExecutionPlan) => {
    clock.current = prepareSession(
      plan,
      instanceId + '/' + ++run.current,
      () => performance.now(),
      !document.hidden,
    );
    setState(clock.current.engine.project());
    setFeedback('');
    setFailure('');
  };
  useEffect(() => {
    // The effect owns only the sampling schedule; elapsed time comes from the monotonic clock.
    clock.current = prepareSession(
      initialPlan.current,
      instanceId + '/' + ++run.current,
      () => performance.now(),
      !document.hidden,
    );
    setState(clock.current.engine.project());
    const interval = window.setInterval(() => {
      if (clock.current && !document.hidden) setState(clock.current.sample());
    }, 100);
    const visibility = () => {
      if (clock.current) setState(clock.current.setVisible(!document.hidden));
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', visibility);
      clock.current = null;
    };
  }, [instanceId]);
  const active = state?.status === 'running' || state?.status === 'paused';
  const select = (value: string) => {
    if (active) return;
    try {
      const plan = value === 'short' ? shortTechnicalPlan : compileWorkoutV1(content);
      setSelection(value);
      initialPlan.current = plan;
      reset(plan);
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'No se pudo preparar el plan.');
    }
  };
  const act = (action: SessionAction) => {
    if (!clock.current || !state) return;
    const result = clock.current.dispatch(action, state);
    setState(clock.current.engine.project());
    setFeedback(result.accepted ? '' : (result.reason ?? 'Acción no disponible.'));
  };
  return (
    <section className="panel session-panel" aria-labelledby="session-test-title">
      <p className="eyebrow">FASE 03 · PRUEBA DEL RELOJ</p>
      <h2 id="session-test-title">Prueba el avance automático</h2>
      <p>
        Esta pantalla verifica el reloj y sus controles. No sigas los intervalos como una
        rutina: todavía faltan las fichas y demostraciones revisadas.
      </p>
      <label className="session-selector">
        Secuencia de prueba
        <select
          value={selection}
          onChange={(event) => select(event.target.value)}
          disabled={active}
        >
          <option value="short">Prueba de 1 minuto · pasos A y B</option>
          <option value="historical">Archivo histórico · 60 minutos · borrador</option>
        </select>
      </label>
      {failure && <p role="alert">{failure}</p>}
      {state ? <SessionReadout state={state} /> : <p>Preparando la prueba local…</p>}
      <div className="session-controls">
        {state?.can.start && (
          <button onClick={() => act({ type: 'Start' })}>Iniciar prueba</button>
        )}
        {state?.can.pause && (
          <button className="primary-control" onClick={() => act({ type: 'Pause' })}>
            Pausar todo
          </button>
        )}
        {state?.can.resume && (
          <button
            className="primary-control"
            onClick={() => act({ type: 'Resume', visible: true, resourcesReady: true })}
          >
            Continuar
          </button>
        )}
        {active && (
          <>
            <button
              disabled={!state?.can.skip}
              onClick={() => act({ type: 'SkipCurrentWork' })}
            >
              Omitir trabajo actual
            </button>
            <button disabled={!state?.can.repeat} onClick={() => act({ type: 'QueueRepeat' })}>
              Repetir ejercicio
              {state?.current ? ' (+' + time(occurrenceDuration(state.current)) + ')' : ''}
            </button>
            {state?.can.cancelRepeat && (
              <button onClick={() => act({ type: 'CancelQueuedRepeat' })}>
                Cancelar repetición
              </button>
            )}
          </>
        )}
        {state?.can.abort && (
          <button onClick={() => act({ type: 'Abort' })}>Terminar prueba</button>
        )}
        {(state?.status === 'completed' || state?.status === 'aborted') && (
          <button onClick={() => select(selection)}>Preparar otra prueba</button>
        )}
      </div>
      {state?.repeatQueued && (
        <p role="status">Repetición añadida después del descanso actual.</p>
      )}
      {active && (
        <div
          className="preparation-controls"
          role="group"
          aria-label="Más tiempo para prepararme"
        >
          <span>Más tiempo para prepararme</span>
          <button
            disabled={!state?.can.extend}
            onClick={() => {
              if (state?.preparationTarget)
                act({
                  type: 'ExtendPreparation',
                  targetOccurrenceId: state.preparationTarget.id,
                  amountMs: 30000,
                });
            }}
          >
            +30 s
          </button>
          <button
            disabled={!state?.can.extend}
            onClick={() => {
              if (state?.preparationTarget)
                act({
                  type: 'ExtendPreparation',
                  targetOccurrenceId: state.preparationTarget.id,
                  amountMs: 60000,
                });
            }}
          >
            +1 min
          </button>
        </div>
      )}
      <p role="status" className="check-feedback">
        {feedback}
      </p>
      <p className="table-note">
        Cambiar de pestaña pausa la prueba; volver la retoma si estaba en marcha. Una pausa
        manual espera «Continuar». Recargar la página pierde la prueba actual; todavía no se
        guarda historial.
      </p>
    </section>
  );
}
