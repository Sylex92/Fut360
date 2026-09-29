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
import {
  HingeDemo,
  hingeClip,
  hingeClipName,
  hingeExercise,
  hingePlan,
} from '../composition/hinge-demo';
import type { DemoSnapshot } from '../composition/hinge-demo';

const ExerciseScene = lazy(() =>
  import('@fut360/viewer-3d/scene').then((m) => ({ default: m.ExerciseScene })),
);
const assetUrl = new URL('../../../../assets/runtime/hip-hinge-v1.glb', import.meta.url).href;
const time = (ms: number) => {
  const seconds = Math.ceil(ms / 1000);
  return (
    Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0') +
    ':' +
    (seconds % 60).toString().padStart(2, '0')
  );
};
class ViewerBoundary extends Component<
  { children: ReactNode; onFailure: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure('No se pudo abrir la vista 3D. Vuelve a cargarla.');
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function DemoPanel() {
  const id = useId();
  const sequence = useRef(0);
  const demo = useRef<HingeDemo | null>(null);
  const loaded = useRef(false);
  const [state, setState] = useState<DemoSnapshot | null>(null);
  const [minutes, setMinutes] = useState<1 | 5>(1);
  const [camera, setCamera] = useState<CameraPreset>('side');
  const [failure, setFailure] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const next = new HingeDemo(
      hingePlan(minutes),
      id + '/' + ++sequence.current,
      () => performance.now(),
      !document.hidden,
    );
    demo.current = next;
    next.setReady(loaded.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      next.toggleReadyPreview();
    setState(next.snapshot());
    const interval = window.setInterval(() => {
      if (!document.hidden && demo.current) setState(demo.current.sample());
    }, 100);
    const visibility = () => {
      if (demo.current) setState(demo.current.setVisible(!document.hidden));
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', visibility);
      demo.current = null;
    };
  }, [id, minutes]);

  const onReady = useCallback(() => {
    loaded.current = true;
    if (demo.current) setState(demo.current.setReady(true));
  }, []);
  const onFailure = useCallback((message: string) => {
    loaded.current = false;
    if (demo.current) setState(demo.current.setReady(false));
    setFailure(message);
  }, []);
  const getPoseMs = useCallback(() => demo.current?.sample().poseMs ?? 0, []);
  const refresh = () => {
    if (demo.current) setState(demo.current.snapshot());
  };
  const act = (action: SessionAction) => {
    if (!demo.current || !state) return;
    setFeedback(demo.current.act(action, state.session));
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
    demo.current = new HingeDemo(
      hingePlan(minutes),
      id + '/' + ++sequence.current,
      () => performance.now(),
      !document.hidden,
    );
    demo.current.setReady(loaded.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      demo.current.toggleReadyPreview();
    setFeedback('');
    refresh();
  };
  const session = state?.session;
  const active = session?.status === 'running' || session?.status === 'paused';
  const finished = session?.status === 'completed' || session?.status === 'aborted';
  const visualLabel = state?.inspecting
    ? 'Inspección · sesión pausada'
    : session?.status === 'paused'
      ? 'Todo pausado'
      : finished
        ? 'Prueba terminada'
        : state?.mode === 'practice'
          ? 'Secuencia visual · 3 repeticiones'
          : state?.mode === 'rest'
            ? 'Reposo · secuencia visual terminada'
            : session?.phase === 'rest'
              ? 'Descanso · ejemplo siguiente'
              : 'Ejemplo de preparación';
  const cue =
    state && state.poseMs >= 1000 && state.poseMs < 3000
      ? 'Lleva la cadera hacia atrás.'
      : state && state.poseMs >= 3000 && state.poseMs < 4000
        ? 'Tronco y cuello alineados; pies apoyados.'
        : state && state.poseMs >= 4000 && state.poseMs < 6000
          ? 'Vuelve de forma controlada.'
          : 'Posición inicial · pies apoyados y rodillas suaves.';

  return (
    <section className="panel demo-panel" aria-labelledby="demo-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PRIMER MOVIMIENTO · SIN MATERIAL</p>
          <h2 id="demo-title">Bisagra de cadera</h2>
        </div>
        <span className="draft-tag">EN REVISIÓN</span>
      </div>
      <p>
        Observa cómo se explica el gesto. Esta demostración prueba el reproductor; todavía no
        es una rutina para seguir.
      </p>
      <div className="demo-layout">
        <div>
          <div
            className="avatar-stage"
            role="img"
            aria-label={'Avatar de la bisagra de cadera. ' + cue}
          >
            {!failure && (
              <ViewerBoundary key={attempt} onFailure={onFailure}>
                <Suspense fallback={<p className="scene-message">Preparando la vista 3D…</p>}>
                  <ExerciseScene
                    assetUrl={assetUrl}
                    clipName={hingeClipName}
                    durationMs={hingeClip.durationMs}
                    cameraPreset={camera}
                    getPoseMs={getPoseMs}
                    onReady={onReady}
                    onFailure={onFailure}
                  />
                </Suspense>
              </ViewerBoundary>
            )}
            {!state?.resourcesReady && !failure && (
              <p className="scene-message">Cargando el avatar local…</p>
            )}
            {failure && (
              <div className="scene-message">
                <p>Vista 3D no disponible.</p>
                <p>El reloj permanece detenido.</p>
              </div>
            )}
            <span className="scene-space">Área de referencia · 2 × 2 m</span>
          </div>
          <div className="camera-controls" role="group" aria-label="Vista del movimiento">
            {(['side', 'front', 'threeQuarter'] as const).map((view) => (
              <button
                key={view}
                aria-pressed={camera === view}
                onClick={() => setCamera(view)}
              >
                {view === 'side' ? 'Lateral' : view === 'front' ? 'Frontal' : 'Tres cuartos'}
              </button>
            ))}
          </div>
          <p className="movement-cue">{cue}</p>
        </div>
        <div className="demo-guide">
          <p className="session-state" role="status">
            {visualLabel}
          </p>
          <p className="session-time" aria-label="Tiempo restante de la fase 3D">
            {time(
              finished
                ? 0
                : session?.status === 'ready'
                  ? minutes * 60000
                  : (session?.phaseRemainingMs ?? minutes * 60000),
            )}
          </p>
          {session?.startsInMs !== null && session?.startsInMs !== undefined && (
            <p className="auto-start">
              {session.resumingWork
                ? 'Retoma el punto guardado'
                : 'La secuencia visual empieza'}{' '}
              automáticamente en <strong>{time(session.startsInMs)}</strong>.
            </p>
          )}
          {session?.status === 'paused' && (
            <p>
              {session.pauseReason === 'hidden'
                ? 'Se pausó al ocultar la página.'
                : session.pauseReason === 'clock-gap'
                  ? 'Se pausó por una interrupción del reloj.'
                  : 'La sesión conserva el punto detenido.'}{' '}
              «Continuar» lo retoma.
            </p>
          )}
          <ol className="movement-steps">
            {hingeExercise.cues.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ol>
          <p className="quiet-note">
            10 s de ejemplo · 30 s de secuencia · 20 s de descanso. Dentro de la secuencia: 3
            gestos de 8 s y 6 s de reposo. Son tiempos de prueba.
          </p>
        </div>
      </div>
      {failure && (
        <div className="viewer-failure" role="alert">
          <p>{failure}</p>
          <button
            onClick={() => {
              setFailure('');
              setAttempt((n) => n + 1);
            }}
          >
            Volver a cargar avatar
          </button>
        </div>
      )}
      <div className="session-controls">
        {(!session || session.can.start) && (
          <button
            className="primary-control"
            disabled={!state?.resourcesReady}
            onClick={() => act({ type: 'Start' })}
          >
            Iniciar prueba 3D
          </button>
        )}
        {session?.status === 'ready' && (
          <button
            disabled={!state?.resourcesReady}
            onClick={() => {
              demo.current?.toggleReadyPreview();
              refresh();
            }}
          >
            {state?.previewPlaying ? 'Pausar ejemplo' : 'Reproducir ejemplo'}
          </button>
        )}
        {session?.can.pause && (
          <button className="primary-control" onClick={() => act({ type: 'Pause' })}>
            Pausar todo
          </button>
        )}
        {session?.can.resume && (
          <button
            className="primary-control"
            disabled={!state?.resourcesReady}
            onClick={() => act({ type: 'Resume', visible: true, resourcesReady: true })}
          >
            Continuar
          </button>
        )}
        {session?.status === 'paused' && !state?.inspecting && (
          <button
            disabled={!state?.resourcesReady}
            onClick={() => {
              setFeedback(demo.current?.openInspection() ?? '');
              refresh();
            }}
          >
            Ver despacio
          </button>
        )}
        {active && (
          <>
            <button
              disabled={!session?.can.repeat || state?.inspecting}
              onClick={() => act({ type: 'QueueRepeat' })}
            >
              Repetir bloque (+1 min)
            </button>
            {session?.can.cancelRepeat && (
              <button onClick={() => act({ type: 'CancelQueuedRepeat' })}>
                Cancelar repetición
              </button>
            )}
            <button
              disabled={!session?.can.skip || state?.inspecting}
              onClick={() => act({ type: 'SkipCurrentWork' })}
            >
              Omitir secuencia actual
            </button>
            <button onClick={() => act({ type: 'Abort' })}>Terminar prueba 3D</button>
          </>
        )}
        {finished && <button onClick={reset}>Preparar otra prueba 3D</button>}
      </div>
      {session?.repeatQueued && (
        <p role="status">
          Repetición añadida después del descanso; conserva el programa base.
        </p>
      )}
      {active && (
        <div
          className="preparation-controls"
          role="group"
          aria-label="Más tiempo para prepararme"
        >
          <span>
            Más tiempo para prepararme · el ejemplo sigue y la secuencia comienza sola
          </span>
          <button
            disabled={!session?.can.extend || state?.inspecting}
            onClick={() => extend(30000)}
          >
            +30 s
          </button>
          <button
            disabled={!session?.can.extend || state?.inspecting}
            onClick={() => extend(60000)}
          >
            +1 min
          </button>
          {session?.status === 'paused' && (
            <p>«Pausar todo» mantiene detenida también la cuenta adicional hasta continuar.</p>
          )}
        </div>
      )}
      {state?.inspecting && (
        <section className="inspection" aria-labelledby="inspection-title">
          <h3 id="inspection-title">Revisar el movimiento sin avanzar la sesión</h3>
          <label>
            Posición del ejemplo · {(state.poseMs / 1000).toFixed(1)} s de 8 s
            <input
              type="range"
              min="0"
              max={hingeClip.durationMs}
              step="50"
              value={state.poseMs}
              onChange={(e) => {
                demo.current?.seekInspection(Number(e.target.value));
                refresh();
              }}
            />
          </label>
          <div className="session-controls">
            <button
              disabled={!state.resourcesReady}
              onClick={() => {
                demo.current?.playInspection(0.5);
                refresh();
              }}
            >
              Reproducir a ½ velocidad
            </button>
            <button
              disabled={!state.resourcesReady}
              onClick={() => {
                demo.current?.playInspection(1);
                refresh();
              }}
            >
              Reproducir a velocidad normal
            </button>
            <button
              disabled={!state.inspectionPlaying}
              onClick={() => {
                demo.current?.pauseInspection();
                refresh();
              }}
            >
              Pausar inspección
            </button>
            <button
              onClick={() => {
                demo.current?.closeInspection();
                refresh();
              }}
            >
              Volver al punto guardado
            </button>
          </div>
          <p>El ejemplo termina tras un gesto. La sesión sigue pausada al salir.</p>
        </section>
      )}
      <p className="check-feedback" role="status">
        {feedback}
      </p>
      <label className="session-selector">
        Duración del ensayo del reproductor
        <select
          value={minutes}
          disabled={active}
          onChange={(e) => {
            setMinutes(e.target.value === '5' ? 5 : 1);
            setFeedback('');
          }}
        >
          <option value="1">1 minuto · un bloque</option>
          <option value="5">5 minutos · cinco bloques del mismo gesto</option>
        </select>
      </label>
      <p className="quiet-note">
        Base restante: {time(session?.baseRemainingMs ?? minutes * 60000)} · Preparación
        añadida: {time(session?.counters.preparationAddedMs ?? 0)} · Bloques extra restantes:{' '}
        {time(session?.extraRemainingMs ?? 0)}.
      </p>
      <details>
        <summary>Ficha, errores a observar y límites de esta prueba</summary>
        <p>
          Variante bilateral sin carga ni apoyo. Regresión propuesta: reducir el recorrido;
          pendiente de revisión, sin otra variante cargada. Impacto bajo. No incorpora
          calentamiento ni vuelta a la calma porque es una prueba visual, no una sesión de
          entrenamiento.
        </p>
        <ul>
          {hingeExercise.commonErrors.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <p>{hingeExercise.safetyCues[1]}</p>
        <p>
          {hingeExercise.safetyCues[2]} No se miden tus movimientos ni repeticiones. Cambiar de
          pestaña pausa; recargar descarta la prueba.
        </p>
        <p>
          Avatar genérico de Quaternius (CC0), adaptado localmente; demostración pendiente de
          revisión humana y deportiva.
        </p>
      </details>
    </section>
  );
}
