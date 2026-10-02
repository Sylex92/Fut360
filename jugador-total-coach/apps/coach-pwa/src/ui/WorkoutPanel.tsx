import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { SessionAction } from '@fut360/domain';
import type { CameraPreset } from '@fut360/viewer-3d/scene';
import { HourWorkout, hourWorkout } from '../composition/hour-workout';
import type { HourSnapshot } from '../composition/hour-workout';
import { movements } from '../composition/movement-library';
import { FinalSignal } from '../platform/final-signal';

const Scene = lazy(() =>
  import('@fut360/viewer-3d/workout-scene').then((m) => ({ default: m.WorkoutScene })),
);
const time = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return (
    Math.floor(s / 60)
      .toString()
      .padStart(2, '0') +
    ':' +
    (s % 60).toString().padStart(2, '0')
  );
};
class Boundary extends Component<
  { children: ReactNode; onFailure: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure(
      'No se pudo abrir la vista 3D. Recarga la página para recuperar el módulo.',
    );
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function WorkoutPanel({
  onActiveChange,
}: {
  onActiveChange: (active: boolean) => void;
}) {
  const id = useId();
  const controller = useRef<HourWorkout | null>(null);
  const loaded = useRef(false);
  const sequence = useRef(0);
  const signal = useRef<FinalSignal | null>(null);
  const [state, setState] = useState<HourSnapshot | null>(null);
  const [camera, setCamera] = useState<CameraPreset>('side');
  const [failure, setFailure] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [muted, setMuted] = useState(false);
  const [moduleFailed, setModuleFailed] = useState(false);
  const [rate] = useState<1 | 60>(() =>
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('e2e') === '1'
      ? 60
      : 1,
  );
  const inspection = useRef<HTMLElement>(null);
  const inspectionButton = useRef<HTMLButtonElement>(null);
  const playbackButton = useRef<HTMLButtonElement>(null);
  const previouslyInspecting = useRef(false);
  const inspecting = state?.inspecting ?? false;
  const active = state?.session.status === 'running' || state?.session.status === 'paused';
  useEffect(() => {
    onActiveChange(active);
  }, [active, onActiveChange]);
  useEffect(() => {
    if (inspecting) {
      inspection.current?.focus({ preventScroll: true });
      inspection.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    } else if (previouslyInspecting.current)
      (inspectionButton.current ?? playbackButton.current)?.focus({ preventScroll: true });
    previouslyInspecting.current = inspecting;
  }, [inspecting]);
  useEffect(() => {
    const next = new HourWorkout(
      id + '/' + ++sequence.current,
      () => performance.now(),
      !document.hidden,
      rate,
    );
    next.setReady(loaded.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) next.togglePreview();
    controller.current = next;
    setState(next.snapshot());
    signal.current = new FinalSignal();
    const timer = window.setInterval(() => {
      if (!document.hidden && controller.current) setState(controller.current.sample());
    }, 100);
    const visibility = () => {
      if (controller.current) setState(controller.current.setVisible(!document.hidden));
      if (document.hidden) signal.current?.stop();
    };
    const unload = (event: BeforeUnloadEvent) => {
      if (
        controller.current &&
        ['running', 'paused'].includes(controller.current.snapshot().session.status)
      ) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('beforeunload', unload);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('beforeunload', unload);
      signal.current?.dispose();
      controller.current = null;
    };
  }, [id, rate]);
  useEffect(() => {
    if (state?.session.status === 'completed') signal.current?.finish(state.session.sessionId);
  }, [state?.session.status, state?.session.sessionId]);
  const onReady = useCallback(() => {
    loaded.current = true;
    if (controller.current) setState(controller.current.setReady(true));
  }, []);
  const onFailure = useCallback((message: string) => {
    loaded.current = false;
    if (controller.current) setState(controller.current.setReady(false));
    signal.current?.stop();
    setFailure(message);
  }, []);
  const getFrame = useCallback(() => {
    const s = controller.current?.sample();
    return { exerciseId: s?.movement.id ?? 'active-march', poseMs: s?.poseMs ?? 0 };
  }, []);
  const refresh = () => {
    if (controller.current) setState(controller.current.snapshot());
  };
  const act = (action: SessionAction) => {
    if (!controller.current || !state) return;
    if (action.type === 'Start' || action.type === 'Resume')
      void signal.current?.unlock().then((ok) => {
        if (!ok)
          setFeedback('El sonido no está disponible; el aviso de final seguirá visible.');
      });
    const error = controller.current.act(action, state.session);
    setFeedback(
      error ||
        (action.type === 'QueueRepeat'
          ? 'Se repetirá ' + state.session.current?.title + ' después del descanso.'
          : ''),
    );
    if (action.type === 'Pause' || action.type === 'Abort') signal.current?.stop();
    refresh();
  };
  const extend = (amountMs: 30000 | 60000) => {
    if (state?.session.preparationTarget)
      act({
        type: 'ExtendPreparation',
        targetOccurrenceId: state.session.preparationTarget.id,
        amountMs,
      });
  };
  const reset = () => {
    const next = new HourWorkout(
      id + '/' + ++sequence.current,
      () => performance.now(),
      !document.hidden,
      rate,
    );
    next.setReady(loaded.current);
    controller.current = next;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) next.togglePreview();
    setState(next.snapshot());
    setFeedback('');
  };
  const s = state?.session;
  const finished = s?.status === 'completed' || s?.status === 'aborted';
  const currentBlock = hourWorkout.workout.blocks.find((b) =>
    b.items.some((i) => i.id === s?.current?.sourceOccurrenceId),
  );
  const blockIndex = currentBlock
    ? hourWorkout.workout.blocks.indexOf(currentBlock)
    : finished
      ? 5
      : 0;
  const effectiveCamera = camera === 'detail' && !state?.movement.footDetail ? 'side' : camera;
  const modeLabel = inspecting
    ? 'Revisión · sesión pausada'
    : s?.status === 'paused'
      ? 'Todo pausado'
      : s?.status === 'completed'
        ? 'Sesión terminada'
        : s?.status === 'aborted'
          ? 'Sesión finalizada antes de tiempo'
          : s?.status === 'ready'
            ? 'Observa antes de empezar'
            : s?.phase === 'work'
              ? 'Tu turno'
              : s?.phase === 'rest'
                ? 'Descansa'
                : s?.phase === 'preparation-extra'
                  ? 'Preparación extra'
                  : 'Prepárate';
  return (
    <section
      className="panel demo-panel hour-panel"
      aria-labelledby={id + '-title'}
      data-testid="hour-session"
      data-status={s?.status ?? 'loading'}
      data-phase={s?.phase ?? ''}
      data-occurrence={s?.current?.sourceOccurrenceId ?? ''}
      data-base-remaining={s?.baseRemainingMs ?? 3600000}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">SESIÓN COMPLETA · 2 × 2 M</p>
          <h2 id={id + '-title'}>Fundamentos en casa</h2>
        </div>
        <span className="draft-tag">EN REVISIÓN</span>
      </div>
      <p>
        Recorrido de 60 minutos en revisión. Balón, pared despejada y colchoneta. Los cambios
        son automáticos; añade tiempo cuando lo necesites.
      </p>
      {rate === 60 && (
        <p className="viewer-failure" role="status">
          PRUEBA ACELERADA ×60 · Solo para comprobar el recorrido. No sigas los ejercicios a
          esta velocidad.
        </p>
      )}
      <ol className="hour-timeline" aria-label="Bloques de la sesión">
        {hourWorkout.workout.blocks.map((b, i) => (
          <li
            key={b.id}
            aria-current={i === blockIndex ? 'step' : undefined}
            className={i < blockIndex ? 'complete' : ''}
          >
            <span>
              {i + 1}. {b.title}
            </span>
            <strong>{b.expectedSeconds / 60} min</strong>
          </li>
        ))}
      </ol>
      <div className="hour-progress">
        <span>
          {finished
            ? 'Recorrido finalizado'
            : `Bloque ${blockIndex + 1} de 6 · ${currentBlock?.title ?? hourWorkout.workout.blocks[0]?.title}`}
        </span>
        <strong>Restante {time(s?.executionRemainingMs ?? 3600000)}</strong>
      </div>
      <div className="demo-layout">
        <div className="demo-viewer">
          <div className="hour-mobile-status" aria-hidden="true">
            <div>
              <span>{modeLabel}</span>
              <strong>{finished ? 'Recorrido finalizado' : state?.movement.name}</strong>
            </div>
            <b>{time(s?.status === 'ready' ? 3600000 : (s?.phaseRemainingMs ?? 3600000))}</b>
          </div>
          <div className="camera-controls" role="group" aria-label="Vista del movimiento">
            {(['side', 'front', 'threeQuarter', 'detail'] as const)
              .filter((v) => v !== 'detail' || state?.movement.footDetail)
              .map((v) => (
                <button
                  key={v}
                  aria-pressed={effectiveCamera === v}
                  onClick={() => setCamera(v)}
                >
                  {v === 'side'
                    ? 'Lateral'
                    : v === 'front'
                      ? 'Frontal'
                      : v === 'detail'
                        ? 'Detalle de pies'
                        : 'Tres cuartos'}
                </button>
              ))}
          </div>
          <div
            className="avatar-stage"
            role="img"
            aria-label={'Avatar: ' + (state?.movement.name ?? 'preparando movimientos')}
            aria-describedby={id + '-cues'}
            data-movement={state?.movement.id}
          >
            {!failure && (
              <Boundary
                key={attempt}
                onFailure={(message) => {
                  setModuleFailed(true);
                  onFailure(message);
                }}
              >
                <Suspense fallback={<p className="scene-message">Preparando vista 3D…</p>}>
                  <Scene
                    assets={movements}
                    cameraPreset={effectiveCamera}
                    framing={state?.movement.framing ?? 'standing'}
                    getFrame={getFrame}
                    onReady={onReady}
                    onFailure={onFailure}
                  />
                </Suspense>
              </Boundary>
            )}
            {!state?.resourcesReady && (
              <p className="scene-message">
                {failure
                  ? 'Vista 3D detenida. El reloj no avanza.'
                  : 'Cargando los movimientos de la sesión…'}
              </p>
            )}
            <span className="scene-space">Área de referencia · 2 × 2 m</span>
          </div>
          <p className="movement-cue">
            {inspecting
              ? 'Revisa el gesto sin avanzar el entrenamiento.'
              : state?.mode === 'rest' && s?.phase === 'work'
                ? 'El ejemplo terminó. Descansa cuando completes tu objetivo.'
                : s?.phase === 'work'
                  ? state?.item.dose
                  : state?.item.preparation}
          </p>
          {failure && (
            <div className="viewer-failure" role="alert">
              <p>{failure}</p>
              <button
                onClick={() => {
                  if (moduleFailed) {
                    window.location.reload();
                    return;
                  }
                  setFailure('');
                  setAttempt((n) => n + 1);
                }}
              >
                {moduleFailed ? 'Recargar página' : 'Volver a cargar movimientos'}
              </button>
            </div>
          )}
          <div className="session-controls">
            {(!s || s.can.start) && (
              <button
                ref={playbackButton}
                className="primary-control"
                disabled={!state?.resourcesReady}
                onClick={() => act({ type: 'Start' })}
              >
                Iniciar sesión
              </button>
            )}
            {s?.status === 'ready' && (
              <button
                disabled={!state?.resourcesReady}
                onClick={() => {
                  controller.current?.togglePreview();
                  refresh();
                }}
              >
                {state?.previewPlaying ? 'Pausar ejemplo' : 'Reproducir ejemplo'}
              </button>
            )}
            {s?.can.pause && (
              <button
                ref={playbackButton}
                className="primary-control"
                onClick={() => act({ type: 'Pause' })}
              >
                Pausar todo
              </button>
            )}
            {s?.can.resume && (
              <button
                ref={playbackButton}
                className="primary-control"
                disabled={!state?.resourcesReady}
                onClick={() => act({ type: 'Resume', visible: true, resourcesReady: true })}
              >
                Continuar
              </button>
            )}
            {s?.status === 'paused' && (
              <button
                ref={inspectionButton}
                disabled={!state?.resourcesReady}
                aria-expanded={inspecting}
                aria-controls={id + '-inspection'}
                onClick={() => {
                  if (inspecting) controller.current?.closeInspection();
                  else controller.current?.openInspection();
                  refresh();
                }}
              >
                {inspecting ? 'Cerrar revisión' : 'Ver despacio'}
              </button>
            )}
            {finished && (
              <button ref={playbackButton} onClick={reset}>
                Preparar otra sesión
              </button>
            )}
          </div>
          {inspecting && state && (
            <section
              ref={inspection}
              tabIndex={-1}
              className="inspection"
              id={id + '-inspection'}
              aria-label="Revisar movimiento"
            >
              <h3>Revisar movimiento</h3>
              <p>La sesión sigue pausada.</p>
              <label>
                Posición del ejemplo · {(state.poseMs / 1000).toFixed(1)} s
                <input
                  type="range"
                  min={0}
                  max={state.movement.durationMs}
                  step={50}
                  value={state.poseMs}
                  onChange={(e) => {
                    controller.current?.seek(Number(e.target.value));
                    refresh();
                  }}
                />
              </label>
              <div className="session-controls">
                <button
                  onClick={() => {
                    controller.current?.playInspection(0.5);
                    refresh();
                  }}
                >
                  Ver a media velocidad
                </button>
                <button
                  onClick={() => {
                    controller.current?.playInspection(1);
                    refresh();
                  }}
                >
                  Ver a velocidad normal
                </button>
                <button
                  disabled={!state.inspectionPlaying}
                  onClick={() => {
                    controller.current?.pauseInspection();
                    refresh();
                  }}
                >
                  Detener ejemplo
                </button>
              </div>
            </section>
          )}
          {active && (
            <div className="preparation-controls preparation-compact">
              <span>Más tiempo para prepararme</span>
              <button disabled={!s?.can.extend} onClick={() => extend(30000)}>
                +30 s
              </button>
              <button disabled={!s?.can.extend} onClick={() => extend(60000)}>
                +1 min
              </button>
            </div>
          )}
          {active && (
            <div className="session-controls secondary-controls">
              <button disabled={!s?.can.skip} onClick={() => act({ type: 'SkipCurrentWork' })}>
                Omitir trabajo actual
              </button>
              <button
                disabled={!s?.can.repeat && !s?.can.cancelRepeat}
                onClick={() =>
                  act({ type: s?.repeatQueued ? 'CancelQueuedRepeat' : 'QueueRepeat' })
                }
              >
                {s?.repeatQueued
                  ? 'Cancelar repetición extra'
                  : s?.phase === 'rest'
                    ? 'Repetir ejercicio anterior'
                    : 'Repetir ejercicio'}
              </button>
              <button onClick={() => act({ type: 'Abort' })}>Terminar sesión</button>
            </div>
          )}
          <button
            aria-pressed={muted}
            onClick={() => {
              const value = !muted;
              setMuted(value);
              if (signal.current) {
                signal.current.muted = value;
                if (value) signal.current.stop();
                else void signal.current.unlock();
              }
            }}
          >
            {muted ? 'Activar sonido final' : 'Silenciar sonido final'}
          </button>
          <p className="check-feedback" role="status">
            {feedback}
          </p>
        </div>
        <div className="demo-guide">
          <p className="eyebrow" role="status">
            {modeLabel}
          </p>
          <strong className="session-time" aria-label="Tiempo del tramo">
            {time(s?.status === 'ready' ? 3600000 : (s?.phaseRemainingMs ?? 3600000))}
          </strong>
          {s?.status === 'completed' ? (
            <p role="status">
              Terminaste el recorrido.{' '}
              {s.outcome === 'completed-with-omissions'
                ? 'Se omitieron algunos tramos de trabajo.'
                : ''}
            </p>
          ) : s?.status === 'aborted' ? (
            <p>La sesión quedó terminada. Puedes preparar otra cuando quieras.</p>
          ) : (
            <>
              <p className="eyebrow">
                {s?.phase === 'rest' && s.next ? 'A CONTINUACIÓN' : 'MOVIMIENTO'}
              </p>
              <h3>{state?.movement.name ?? 'Marcha en el sitio'}</h3>
              {state && (
                <p>
                  {state.item.side === 'left'
                    ? 'Lado izquierdo'
                    : state.item.side === 'right'
                      ? 'Lado derecho'
                      : state.item.side === 'alternate'
                        ? 'Lados alternos'
                        : 'Ambos apoyos'}{' '}
                  · Ronda {state.item.round} de {state.block.rounds}
                  {(s?.phase === 'rest' ? s.next?.kind : s?.current?.kind) === 'extra' &&
                    ' · Repetición extra'}
                </p>
              )}
              <p className="hour-dose">{state?.item.dose}</p>
              {s?.phase !== 'work' && <p>{state?.item.preparation}</p>}
              <p className="quiet-note">{state?.movement.equipment}</p>
              <ol id={id + '-cues'}>
                {state?.movement.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ol>
              {active && s?.startsInMs !== null && s?.startsInMs !== undefined && (
                <p className="hour-countdown">
                  {s.status === 'paused'
                    ? 'Preparación pendiente'
                    : s.resumingWork
                      ? 'Retomas en'
                      : 'Empiezas en'}{' '}
                  {time(s.startsInMs)}
                </p>
              )}
              {s?.phase === 'work' && s.next && (
                <p className="hour-next">
                  Después: <strong>{s.next.title}</strong>
                </p>
              )}
            </>
          )}
          <p className="quiet-note">
            El avatar es un ejemplo: no cuenta tus repeticiones. Si aparecen dolor, bloqueo,
            inflamación o inestabilidad, detente y busca valoración.
          </p>
        </div>
      </div>
      <details className="technical-details">
        <summary>Resumen de tiempos de esta sesión</summary>
        <p>
          Base: 60:00 · Preparación añadida: {time(s?.counters.preparationAddedMs ?? 0)} ·
          Trabajo omitido:{' '}
          {time((s?.counters.baseOmittedMs ?? 0) + (s?.counters.extraOmittedMs ?? 0))} · Pausas
          observadas: {time(s?.counters.observedPauseMs ?? 0)}.
        </p>
        <p>
          Tiempo reproducido: {time(s?.recordedMs ?? 0)}. Pausas y extras alargan el recorrido;
          omisiones lo acortan. No mide actividad física ni guarda historial todavía.
        </p>
      </details>
    </section>
  );
}
