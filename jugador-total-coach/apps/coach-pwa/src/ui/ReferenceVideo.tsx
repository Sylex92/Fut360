import { useEffect, useRef, useState } from 'react';
import { loadYouTube, segmentRequest, videoFailure, videoLink } from '../platform/youtube';
import type { VideoSegment, YouTubePlayer } from '../platform/youtube';

export const videoTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`;

/** External media starts only after an explicit click; never cached by our service worker. */
export function ReferenceVideo({
  segment,
  paused = false,
}: {
  segment: VideoSegment;
  paused?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const [opened, setOpened] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [readyToPlay, setReadyToPlay] = useState(false);
  const [loop, setLoop] = useState(false);
  const loopRef = useRef(false);
  const pausedRef = useRef(paused);
  loopRef.current = loop;
  pausedRef.current = paused;
  useEffect(() => {
    if (paused) player.current?.pauseVideo();
  }, [paused]);
  useEffect(() => {
    if (!opened || !box.current) return;
    let cancelled = false;
    let instance: YouTubePlayer | null = null;
    let ready = false;
    let resumeHidden = false;
    let inViewport = true;
    const host = box.current;
    const mount = document.createElement('div');
    host.appendChild(mount);
    setStatus('Conectando con YouTube…');
    setError('');
    setReadyToPlay(false);
    const bounds = () => segmentRequest(segment);
    let restarting = false;
    const finish = () => {
      if (!instance || !ready || restarting) return;
      if (loopRef.current && !document.hidden && inViewport && !pausedRef.current) {
        restarting = true;
        instance.seekTo(segment.start, true);
        instance.playVideo();
      } else {
        instance.pauseVideo();
        setStatus('Fragmento terminado.');
      }
    };
    const timeout = setTimeout(() => {
      if (!ready && !cancelled) {
        setStatus('Video no disponible.');
        setError('La referencia tarda en responder. Puedes abrirla en YouTube o reintentar.');
      }
    }, 25000);
    void loadYouTube()
      .then((api) => {
        if (cancelled) return;
        instance = new api.Player(mount, {
          host: 'https://www.youtube-nocookie.com',
          videoId: segment.videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            controls: 1,
            playsinline: 1,
            origin: window.location.origin,
            start: segment.start,
            end: segment.end,
          },
          events: {
            onReady: ({ target }) => {
              if (cancelled) return;
              ready = true;
              setReadyToPlay(true);
              setError('');
              clearTimeout(timeout);
              player.current = target;
              target.getIframe().title = `${segment.title} — ${segment.channel}`;
              target.getIframe().referrerPolicy = 'strict-origin-when-cross-origin';
              target.cueVideoById(bounds());
              setStatus('Usa el botón de reproducción del video.');
            },
            onStateChange: ({ data }) => {
              if (cancelled) return;
              if (data === 0) finish();
              if (data === 1) {
                if (instance && instance.getCurrentTime() < segment.end) restarting = false;
                if (document.hidden || !inViewport || pausedRef.current)
                  instance?.pauseVideo();
                else setStatus('Reproduciendo el fragmento.');
              }
              if (data === 3) setStatus('Cargando video…');
              if (data === 2 && instance && instance.getCurrentTime() < segment.end)
                setStatus('Video en pausa.');
            },
            onError: ({ data }) => {
              if (!cancelled) {
                clearTimeout(timeout);
                setStatus('Video no disponible.');
                setError(videoFailure(data));
              }
            },
            onAutoplayBlocked: () => {
              if (!cancelled) setStatus('Pulsa reproducir dentro del video para continuar.');
            },
          },
        });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          clearTimeout(timeout);
          setStatus('Video no disponible.');
          setError(e instanceof Error ? e.message : 'No se pudo cargar el video.');
        }
      });
    const tick = setInterval(() => {
      if (ready && restarting && instance && instance.getCurrentTime() < segment.end)
        restarting = false;
      if (
        ready &&
        instance?.getPlayerState() === 1 &&
        instance.getCurrentTime() >= segment.end
      )
        finish();
    }, 200);
    const visibility = () => {
      if (!ready || !instance) return;
      if (document.hidden) {
        resumeHidden = instance.getPlayerState() === 1;
        instance.pauseVideo();
      } else if (resumeHidden && !pausedRef.current && inViewport) {
        resumeHidden = false;
        instance.playVideo();
      }
    };
    document.addEventListener('visibilitychange', visibility);
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            inViewport = Boolean(entry?.isIntersecting);
            if (!inViewport && ready) instance?.pauseVideo();
          });
    observer?.observe(host);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearInterval(tick);
      document.removeEventListener('visibilitychange', visibility);
      observer?.disconnect();
      player.current = null;
      instance?.destroy();
      mount.remove();
    };
  }, [opened, attempt, segment]);
  return (
    <section className="reference-video" aria-label="Video de referencia">
      <div className="reference-heading">
        <strong>{segment.title}</strong>
        <span>
          {videoTime(segment.start)}–{videoTime(segment.end)} · {segment.channel}
        </span>
      </div>
      {!opened ? (
        <div className="video-consent">
          <button type="button" className="primary" onClick={() => setOpened(true)}>
            Ver video del ejercicio
          </button>
          <p>Conecta con YouTube. Requiere Internet y puede mostrar anuncios.</p>
        </div>
      ) : (
        <>
          <div className="youtube-frame" ref={box} />
          <p className="quiet-note" role="status">
            {status}
          </p>
          <div className="video-actions">
            <button
              type="button"
              disabled={!readyToPlay || Boolean(error)}
              onClick={() => {
                box.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
                player.current?.seekTo(segment.start, true);
                player.current?.playVideo();
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
            <button type="button" onClick={() => setAttempt((n) => n + 1)}>
              Reintentar video
            </button>
          </div>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      {segment.note && <p>{segment.note}</p>}
      <p className="video-attribution">
        <a href={videoLink(segment)} target="_blank" rel="noopener noreferrer">
          Abrir referencia en YouTube desde {videoTime(segment.start)}
        </a>
        <span>El enlace externo no detiene el video al final del tramo.</span>
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacidad de Google
        </a>
      </p>
    </section>
  );
}
