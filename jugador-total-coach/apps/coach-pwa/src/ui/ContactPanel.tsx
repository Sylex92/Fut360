import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ContactMode, ContactView, FootSource, LabSample } from '@fut360/physics-lab';

const Scene = lazy(() =>
  import('@fut360/physics-lab/scene').then((m) => ({ default: m.ContactScene })),
);
const assetUrl = new URL('../../../../assets/runtime/inside-inside-v1.glb', import.meta.url)
  .href;
const initial: LabSample = {
  seconds: 0,
  contacts: 0,
  ball: [-0.15, 0.11, 0.035],
  ended: false,
  outside: false,
};
class Boundary extends Component<
  { children: ReactNode; onFailure: (s: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure('No se pudo abrir la prueba. Recarga la página para intentarlo.');
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ContactPanel() {
  const [mode, setMode] = useState<ContactMode>('tutorial');
  const [source, setSource] = useState<FootSource>('avatar');
  const [view, setView] = useState<ContactView>('threeQuarter');
  const [speed, setSpeed] = useState(1);
  const [debug, setDebug] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [running, setRunning] = useState(false);
  const [hidden, setHidden] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  );
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState('');
  const [sample, setSample] = useState<LabSample>(initial);
  const [seek, setSeek] = useState(0);
  useEffect(() => {
    let first = 0,
      second = 0;
    const visibility = () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      if (document.hidden) setHidden(true);
      // Discard the first visible render delta; never simulate the hidden interval.
      else
        first = requestAnimationFrame(() => {
          second = requestAnimationFrame(() => setHidden(false));
        });
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback((message: string) => {
    setFailure(message);
    setReady(false);
    setRunning(false);
  }, []);
  const onSample = useCallback((value: LabSample) => {
    setSample(value);
    if (value.ended) setRunning(false);
  }, []);
  useEffect(() => {
    if (ready || failure) return;
    const timeout = window.setTimeout(
      () => onFailure('No se pudo preparar la vista 3D. Vuelve a cargar la prueba.'),
      30000,
    );
    return () => window.clearTimeout(timeout);
  }, [ready, failure, attempt, onFailure]);
  const reset = () => {
    setRunning(false);
    setReady(false);
    setFailure('');
    setSample(initial);
    setSeek(0);
    setAttempt((n) => n + 1);
  };
  const changeMode = (value: ContactMode) => {
    if (value === mode) return;
    setMode(value);
    setSpeed(1);
    reset();
  };
  return (
    <section className="panel demo-panel contact-panel" aria-labelledby="contact-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PIE Y BALÓN · PRUEBA DE CONTACTOS</p>
          <h2 id="contact-heading">
            {mode === 'tutorial'
              ? 'Campanitas · interior-interior'
              : 'Prueba técnica de contactos'}
          </h2>
        </div>
        <span className="draft-tag">EN REVISIÓN</span>
      </div>
      <div className="camera-controls" aria-label="Tipo de prueba">
        <button
          type="button"
          aria-pressed={mode === 'tutorial'}
          onClick={() => changeMode('tutorial')}
        >
          Demostración guiada
        </button>
        <button
          type="button"
          aria-pressed={mode === 'physics-lab'}
          onClick={() => changeMode('physics-lab')}
        >
          Laboratorio de contactos
        </button>
      </div>
      <p>
        {mode === 'tutorial'
          ? 'Observa las campanitas: dos toques con el interior del pie. El cuerpo y el balón siguen el mismo ejemplo.'
          : 'Prueba de desarrollo: comprobamos cómo responde el balón al pie y al suelo. Este recorrido no es una demostración para imitar.'}{' '}
        Esta prueba todavía no es una rutina para seguir.
      </p>
      <div className="demo-layout">
        <div>
          <div className="camera-controls" aria-label="Vista del contacto">
            {(
              [
                ['front', 'Frontal'],
                ['threeQuarter', 'Tres cuartos'],
                ['detail', 'Detalle de pies'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="avatar-stage" aria-label="Animación de contacto pie balón">
            {!failure && (
              <Boundary key={attempt + mode} onFailure={onFailure}>
                <Suspense fallback={null}>
                  <Scene
                    key={attempt + mode}
                    assetUrl={assetUrl}
                    mode={mode}
                    source={source}
                    speed={speed}
                    running={running && !hidden && ready}
                    debug={debug}
                    view={view}
                    seekSeconds={seek}
                    onReady={onReady}
                    onFailure={onFailure}
                    onSample={onSample}
                  />
                </Suspense>
              </Boundary>
            )}
            {!ready && (
              <p className="scene-message">
                {failure ? 'Vista 3D detenida.' : 'Preparando la vista 3D…'}
              </p>
            )}
            <span className="scene-space">Área de referencia: 2 × 2 m</span>
          </div>
          <p className="movement-cue">
            {sample.outside
              ? 'El balón salió del área. Reinicia para observar otro contacto.'
              : sample.ended
                ? 'Ejemplo terminado. Puedes volver a verlo.'
                : mode === 'tutorial'
                  ? sample.seconds < 4
                    ? 'Interior del pie derecho: lleva el balón hacia el izquierdo.'
                    : 'Interior del pie izquierdo: devuelve el balón cerca del cuerpo.'
                  : running
                    ? 'Observa el contacto y el recorrido resultante del balón.'
                    : 'Prueba detenida. Puedes cambiar de vista.'}
          </p>
          <div className="contact-actions">
            <button
              type="button"
              className="primary"
              disabled={!ready || sample.ended}
              onClick={() => setRunning((v) => !v)}
            >
              {running
                ? 'Pausar prueba'
                : sample.seconds > 0
                  ? 'Continuar prueba'
                  : 'Reproducir prueba'}
            </button>
            <button type="button" onClick={reset}>
              {failure ? 'Volver a cargar prueba' : 'Reiniciar prueba'}
            </button>
            <span
              className="tabular"
              aria-label="Tiempo del ejemplo"
              data-testid="contact-time"
            >
              {sample.seconds.toFixed(1)} / 10 s
            </span>
          </div>
          {hidden && <p role="status">En pausa mientras la ventana está oculta.</p>}
          {failure && (
            <p className="viewer-failure" role="alert">
              {failure}
            </p>
          )}
          <label className="contact-option">
            {mode === 'tutorial' ? 'Velocidad de observación' : 'Velocidad del pie'}
            <select
              value={speed}
              onChange={(e) => {
                setSpeed(Number(e.target.value));
                if (mode === 'physics-lab') reset();
              }}
              disabled={running}
            >
              {mode === 'tutorial' ? (
                <>
                  <option value="1">Normal</option>
                  <option value="0.5">Despacio · ½ velocidad</option>
                </>
              ) : (
                <>
                  <option value="1">Contacto lento</option>
                  <option value="4">Contacto rápido · prueba técnica</option>
                </>
              )}
            </select>
          </label>
          {mode === 'tutorial' && (
            <label className="contact-option">
              Revisar un instante · pausa para mover
              <input
                type="range"
                min="0"
                max="10"
                step="0.05"
                aria-label="Instante del contacto"
                disabled={running || !ready}
                value={sample.seconds}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setSeek(value);
                  setSample({ ...initial, seconds: value, ended: value === 10 });
                }}
              />
            </label>
          )}
        </div>
        <div className="demo-guide">
          <h3>{mode === 'tutorial' ? 'Qué muestra el ejemplo' : 'Qué estamos comprobando'}</h3>
          {mode === 'tutorial' ? (
            <ol className="movement-steps">
              <li>
                Rodillas ligeramente flexionadas; balón entre los pies y cerca del cuerpo.
              </li>
              <li>
                El interior del pie derecho dirige el balón hacia el izquierdo. El otro pie
                sostiene el apoyo.
              </li>
              <li>El interior del pie izquierdo lo devuelve, con un recorrido corto.</li>
              <li>
                Observa el contacto de lado a lado. La velocidad del ejemplo sirve para verlo;
                no marca tu ritmo de entrenamiento.
              </li>
            </ol>
          ) : (
            <>
              <p>
                El avatar repite un movimiento preparado, pero no ajusta los pies si el balón
                se desvía. Por eso la devolución puede parecer un control orientado: no estamos
                enseñando ese ejercicio aquí.
              </p>
              <p>
                Probamos contactos lentos y rápidos para revisar que el pie empuje el balón sin
                atravesarlo y que el suelo lo sostenga. Si sale del cuadrado, la prueba
                termina.
              </p>
            </>
          )}
          <p className="quiet-note">
            {mode === 'tutorial'
              ? 'La trayectoria está preparada para explicar el gesto. Puedes detenerla y volver a cualquier instante.'
              : 'La trayectoria la calcula el motor de física con parámetros de prueba. No predice con exactitud un balón real ni define el ritmo de entrenamiento.'}
          </p>
          <details className="technical-details">
            <summary>Detalles de esta prueba</summary>
            <p>
              Tiempo propio del ejemplo; no registra entrenamiento. Cambiar de modo, recorrido
              o velocidad física reinicia la prueba.
            </p>
            <p>
              Control del balón:{' '}
              <strong>
                {mode === 'tutorial' ? 'clip sincronizado (AnimationMixer)' : 'Rapier 0.19.2'}
              </strong>
              . Avatar: clip. Suelo: fijo.
            </p>
            {mode === 'physics-lab' && (
              <>
                <label className="contact-option">
                  Origen del pie
                  <select
                    value={source}
                    disabled={running}
                    onChange={(e) => {
                      setSource(e.target.value as FootSource);
                      reset();
                    }}
                  >
                    <option value="avatar">Huesos del avatar</option>
                    <option value="debug">Forma de prueba aislada</option>
                  </select>
                </label>
                <label className="contact-checkbox">
                  <input
                    type="checkbox"
                    checked={debug}
                    onChange={(e) => setDebug(e.target.checked)}
                  />
                  Mostrar formas de contacto
                </label>
                <p>
                  Paso fijo: 1/60 s · CCD activado · parámetros ilustrativos, sin calibración
                  deportiva.
                </p>
                <output
                  data-testid="contact-metrics"
                  data-seconds={sample.seconds}
                  data-contacts={sample.contacts}
                  data-ball={JSON.stringify(sample.ball)}
                  data-outside={sample.outside}
                >
                  Contactos pie–balón: {sample.contacts}. Posición del balón (m):{' '}
                  {sample.ball.map((v) => v.toFixed(3)).join(', ')}.
                </output>
              </>
            )}
            <p>
              Recurso y técnica en borrador. La inspección técnica de colisiones no aprueba el
              ejercicio ni su adecuación personal.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
