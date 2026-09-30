import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { CameraPreset } from '@fut360/viewer-3d/scene';
import { movements } from '../composition/movement-library';
import type { MovementPreview } from '../composition/movement-library';

const Scene = lazy(() =>
  import('@fut360/viewer-3d/scene').then((m) => ({ default: m.ExerciseScene })),
);

class PreviewBoundary extends Component<
  { children: ReactNode; onFailure: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure('No se pudo abrir el visor. Vuelve a cargar el movimiento.');
  }
  render() {
    return this.state.failed ? (
      <p role="alert">No se pudo abrir el visor. Recarga la página para intentarlo.</p>
    ) : (
      this.props.children
    );
  }
}

function Preview({ movement }: { movement: MovementPreview }) {
  const [camera, setCamera] = useState<CameraPreset>('threeQuarter');
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [hidden, setHidden] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  );
  const cursor = useRef(0);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback((message: string) => {
    setFailure(message);
    setReady(false);
    setRunning(false);
  }, []);
  const getPoseMs = useCallback(() => cursor.current, []);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);
  useEffect(() => {
    if (ready || failure) return;
    const timer = window.setTimeout(
      () => onFailure('No se pudo preparar la vista 3D. Recarga la página.'),
      30000,
    );
    return () => window.clearTimeout(timer);
  }, [ready, failure, onFailure, attempt]);
  useEffect(() => {
    if (!running || !ready || hidden) return;
    let previous: number | undefined;
    let raf = 0;
    const tick = (now: number) => {
      if (document.hidden) {
        previous = undefined;
        raf = requestAnimationFrame(tick);
        return;
      }
      const delta = previous === undefined ? 0 : Math.max(0, now - previous);
      previous = now;
      // Never jump across a suspended/blocked interval in an inspection preview.
      if (delta <= 250)
        cursor.current = Math.min(movement.durationMs, cursor.current + delta * speed);
      setSeconds(cursor.current / 1000);
      if (cursor.current >= movement.durationMs) setRunning(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, ready, hidden, speed, movement.durationMs]);
  const start = () => {
    if (cursor.current >= movement.durationMs) {
      cursor.current = 0;
      setSeconds(0);
    }
    setRunning(true);
  };
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{movement.equipment}</p>
          <h2>{movement.name}</h2>
        </div>
        <span className="draft-tag">EN REVISIÓN</span>
      </div>
      <p>{movement.preparation}</p>
      <div className="demo-layout">
        <div className="demo-stage">
          <div className="camera-controls" aria-label="Vista del movimiento">
            {(
              [
                ['front', 'Frontal'],
                ['side', 'Lateral'],
                ['threeQuarter', 'Tres cuartos'],
                ...(movement.footDetail ? ([['detail', 'Detalle de pies']] as const) : []),
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={camera === key}
                onClick={() => setCamera(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="avatar-stage" aria-label={'Animación de ' + movement.name}>
            {failure ? (
              <div className="avatar-fallback">
                <p role="alert">{failure}</p>
                <button
                  type="button"
                  onClick={() => {
                    setFailure('');
                    setReady(false);
                    setAttempt((n) => n + 1);
                  }}
                >
                  Volver a cargar
                </button>
              </div>
            ) : (
              <PreviewBoundary key={attempt} onFailure={onFailure}>
                <Suspense fallback={<p>Preparando el avatar…</p>}>
                  <Scene
                    key={attempt}
                    assetUrl={movement.assetUrl}
                    clipName={movement.clipName}
                    durationMs={movement.durationMs}
                    framing={movement.framing}
                    cameraPreset={camera}
                    getPoseMs={getPoseMs}
                    onReady={onReady}
                    onFailure={onFailure}
                  />
                </Suspense>
              </PreviewBoundary>
            )}
          </div>
          <div className="contact-actions library-actions">
            <button
              className="button-primary"
              type="button"
              disabled={!ready || !!failure}
              onClick={() => (running ? setRunning(false) : start())}
            >
              {running
                ? 'Pausar ejemplo'
                : cursor.current >= movement.durationMs
                  ? 'Ver de nuevo'
                  : 'Reproducir ejemplo'}
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => {
                setRunning(false);
                cursor.current = 0;
                setSeconds(0);
              }}
            >
              Volver al inicio
            </button>
          </div>
          <label className="contact-option">
            Velocidad de observación
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
              <option value="0.5">Despacio · ½×</option>
              <option value="1">Detalle · 1×</option>
              {movement.id === 'inside-inside' && <option value="2">Más ágil · 2×</option>}
            </select>
          </label>
          <label className="contact-option">
            Revisar un instante
            <input
              type="range"
              aria-label="Instante del movimiento"
              min="0"
              max={movement.durationMs / 1000}
              step="0.05"
              disabled={!ready || running}
              value={seconds}
              onChange={(e) => {
                cursor.current = Number(e.target.value) * 1000;
                setSeconds(Number(e.target.value));
              }}
            />
          </label>
          <output className="quiet-note" data-testid="movement-cursor" data-seconds={seconds}>
            {seconds.toFixed(1)} / {movement.durationMs / 1000} s del ejemplo
            {hidden && running ? ' · en pausa mientras la ventana está oculta' : ''}
          </output>
        </div>
        <div className="demo-guide">
          <h3>Cómo es el movimiento</h3>
          <ol className="movement-steps">
            {movement.cues.map((cue) => (
              <li key={cue}>{cue}</li>
            ))}
          </ol>
          <p className="quiet-note">
            La velocidad permite observar el gesto; no marca tu ritmo de entrenamiento.
          </p>
          <p className="quiet-note">
            Demostración en revisión. No inicia ni registra una sesión.
          </p>
        </div>
      </div>
    </>
  );
}

export function MovementLibrary() {
  const [selected, setSelected] = useState('active-march');
  const movement = movements.find((item) => item.id === selected)!;
  return (
    <section
      className="panel demo-panel movement-library"
      aria-label="Biblioteca de movimientos"
    >
      <label className="contact-option">
        Movimiento
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {movements.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <Preview key={movement.id} movement={movement} />
    </section>
  );
}
