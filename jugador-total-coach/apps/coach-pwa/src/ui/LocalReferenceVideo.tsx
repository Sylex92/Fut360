import { useEffect, useRef, useState } from 'react';
import { localTeachingAsset, type LocalVideoSegment } from '../platform/local-teaching-media';

/** Uses the browser decoder and native controls; files remain intact and attributed. */
export function LocalReferenceVideo({
  segment,
  paused = false,
  automatic = false,
  onAvailability,
}: {
  segment: LocalVideoSegment;
  paused?: boolean;
  automatic?: boolean;
  onAvailability?: ((ready: boolean, issue?: string) => void) | undefined;
}) {
  const asset = localTeachingAsset(segment);
  const video = useRef<HTMLVideoElement>(null);
  const play = useRef<(() => void) | null>(null);
  const stop = useRef<(() => void) | null>(null);
  const availability = useRef(onAvailability);
  const pausedRef = useRef(paused);
  const [opened, setOpened] = useState(automatic);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Cargando ejemplo…');
  const [loop, setLoop] = useState(automatic);
  const loopRef = useRef(loop);
  const [rate, setRate] = useState(1);
  availability.current = onAvailability;
  pausedRef.current = paused;
  loopRef.current = loop;
  useEffect(() => {
    if (paused) stop.current?.();
    else if (automatic && !document.hidden) play.current?.();
  }, [paused, automatic]);
  useEffect(() => {
    const v = video.current;
    if (!opened || !v) return;
    let disposed = false;
    let initialized = false;
    let positioned = false;
    let internalPause = false;
    let resumeHidden = false;
    let inViewport = true;
    let restarting = false;
    let finished = false;
    let autoplayBlocked = false;
    setReady(false);
    setError('');
    setStatus('Cargando ejemplo…');
    setRate(1);
    availability.current?.(false);
    if (automatic) v.scrollIntoView({ block: 'center', behavior: 'instant' });
    const pauseVideo = () => {
      if (!v.paused) {
        internalPause = true;
        v.pause();
      }
    };
    const fail = (message: string) => {
      if (disposed) return;
      pauseVideo();
      setError(message);
      setReady(false);
      availability.current?.(false, message);
    };
    const playVideo = () => {
      if (disposed || !initialized || pausedRef.current || document.hidden || !inViewport)
        return;
      if (v.currentTime < segment.start || v.currentTime >= segment.end)
        v.currentTime = segment.start;
      finished = false;
      void v.play().catch(() => {
        if (disposed || pausedRef.current || document.hidden || !inViewport) return;
        autoplayBlocked = true;
        setStatus('Pulsa reproducir dentro del video para preparar el ejemplo.');
        availability.current?.(false, 'Pulsa reproducir en el video y después Continuar.');
      });
    };
    play.current = playVideo;
    stop.current = pauseVideo;
    const timeout = setTimeout(
      () => fail('El video no respondió. Reintenta cargar el ejemplo.'),
      25000,
    );
    const available = () => {
      if (!positioned || v.readyState < 2 || v.seeking) return;
      clearTimeout(timeout);
      const first = !initialized;
      initialized = true;
      restarting = false;
      setReady(true);
      setError('');
      availability.current?.(!autoplayBlocked);
      if (first) {
        setStatus('Ejemplo preparado.');
        playVideo();
      }
    };
    const metadata = () => {
      if (!Number.isFinite(v.duration) || v.duration < segment.end) {
        fail('El archivo no contiene el fragmento esperado.');
        return;
      }
      positioned = true;
      v.currentTime = segment.start;
      available();
    };
    const playing = () => {
      if (!initialized) return;
      autoplayBlocked = false;
      availability.current?.(true);
      if (pausedRef.current || document.hidden || !inViewport) {
        pauseVideo();
        return;
      }
      setStatus('Reproduciendo el fragmento.');
    };
    const pauseEvent = () => {
      const programmatic = internalPause;
      internalPause = false;
      if (!finished) setStatus('Video en pausa.');
      if (
        automatic &&
        initialized &&
        !programmatic &&
        !pausedRef.current &&
        !document.hidden &&
        !restarting
      )
        availability.current?.(
          true,
          'El video está en pausa. Pulsa Continuar cuando estés preparado.',
        );
    };
    const waiting = () => {
      if (automatic && initialized && !v.paused) availability.current?.(false);
    };
    const mediaError = () => fail('No se pudo cargar el video local. Reintenta el ejemplo.');
    const bounds = () => {
      if (!initialized || v.seeking || restarting) return;
      if (v.currentTime < segment.start) v.currentTime = segment.start;
      if (v.currentTime < segment.end) finished = false;
      if (v.currentTime >= segment.end && !finished) {
        if (
          loopRef.current &&
          !pausedRef.current &&
          !document.hidden &&
          inViewport &&
          !v.paused
        ) {
          restarting = true;
          v.currentTime = segment.start;
          playVideo();
        } else {
          finished = true;
          pauseVideo();
          v.currentTime = segment.end;
          setStatus('Fragmento terminado.');
          if (automatic && !pausedRef.current)
            availability.current?.(true, 'Fragmento terminado. Repite el ejemplo o continúa.');
        }
      }
    };
    const visibility = () => {
      if (document.hidden) {
        resumeHidden = !v.paused;
        pauseVideo();
      } else if (resumeHidden) {
        resumeHidden = false;
        playVideo();
      }
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            inViewport = Boolean(entry?.isIntersecting);
            if (!inViewport && initialized && !v.paused) {
              pauseVideo();
              if (automatic)
                availability.current?.(
                  true,
                  'La demostración quedó fuera de pantalla. Vuelve a ella y continúa cuando estés preparado.',
                );
            }
          });
    observer?.observe(v);
    v.addEventListener('loadedmetadata', metadata);
    v.addEventListener('canplay', available);
    v.addEventListener('seeked', available);
    v.addEventListener('playing', playing);
    v.addEventListener('pause', pauseEvent);
    v.addEventListener('waiting', waiting);
    v.addEventListener('error', mediaError);
    v.addEventListener('timeupdate', bounds);
    document.addEventListener('visibilitychange', visibility);
    const interval = setInterval(bounds, 80);
    v.load();
    return () => {
      disposed = true;
      clearTimeout(timeout);
      clearInterval(interval);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      v.removeEventListener('loadedmetadata', metadata);
      v.removeEventListener('canplay', available);
      v.removeEventListener('seeked', available);
      v.removeEventListener('playing', playing);
      v.removeEventListener('pause', pauseEvent);
      v.removeEventListener('waiting', waiting);
      v.removeEventListener('error', mediaError);
      v.removeEventListener('timeupdate', bounds);
      v.pause();
      play.current = null;
      stop.current = null;
    };
  }, [opened, attempt, segment, automatic]);
  return (
    <section className="reference-video" aria-label="Video de referencia local">
      <div className="reference-heading">
        <strong>{segment.title}</strong>
        <span>{asset.attribution}</span>
      </div>
      {segment.match === 'component' && (
        <p className="quiet-note">Este video muestra una parte del ejercicio.</p>
      )}
      {!opened ? (
        <button className="primary" onClick={() => setOpened(true)}>
          Ver video del ejercicio
        </button>
      ) : (
        <>
          <video
            className="local-video-frame"
            ref={video}
            src={asset.src}
            controls
            muted
            playsInline
            preload="metadata"
            aria-label={segment.title}
          />
          <p className="quiet-note" role="status">
            {status}
          </p>
          <div className="video-actions">
            <label>
              Velocidad del ejemplo{' '}
              <select
                value={rate}
                disabled={!ready}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setRate(next);
                  if (video.current) video.current.playbackRate = next;
                }}
              >
                {[0.5, 0.75, 1, 1.25, 1.5].map((v) => (
                  <option key={v} value={v}>
                    {v === 1 ? 'Normal' : `${v}×`}
                  </option>
                ))}
              </select>
            </label>
            <button
              disabled={!ready}
              onClick={() => {
                if (video.current) {
                  video.current.scrollIntoView({ block: 'center', behavior: 'instant' });
                  video.current.currentTime = segment.start;
                  play.current?.();
                }
              }}
            >
              Repetir fragmento
            </button>
            <label>
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
              />{' '}
              Repetir en bucle
            </label>
            <button onClick={() => setAttempt((n) => n + 1)}>Reintentar video</button>
          </div>
          <p className="quiet-note">
            La velocidad del ejemplo no cambia el reloj ni las repeticiones de tu sesión.
          </p>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <p>{segment.note}</p>
      <p className="video-attribution">
        <a
          href={asset.source}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            stop.current?.();
            onAvailability?.(ready, 'Referencia abierta. Continúa cuando estés preparado.');
          }}
        >
          Fuente: {asset.attribution}
        </a>
        <span>Uso personal no comercial. FIFA no patrocina ni avala esta aplicación.</span>
      </p>
    </section>
  );
}
