import { useEffect, useRef, useState } from 'react';
import { loadYouTube, segmentRequest, videoFailure, videoLink } from '../platform/youtube';
import type { VideoSegment, YouTubePlayer } from '../platform/youtube';
import { useParticipant } from './ParticipantContext';
import { isLocalVideo, type TeachingVideo } from '../platform/local-teaching-media';
import { LocalReferenceVideo } from './LocalReferenceVideo';

export const videoTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`;

/** External media starts only after an explicit click; never cached by our service worker. */
export function ReferenceVideo({
  segment,
  paused = false,
  automatic = false,
  onAvailability,
}: {
  segment: TeachingVideo;
  paused?: boolean;
  automatic?: boolean;
  onAvailability?: ((ready: boolean, issue?: string) => void) | undefined;
}) {
  const { participant } = useParticipant();
  if (isLocalVideo(segment))
    return (
      <LocalReferenceVideo
        segment={segment}
        paused={paused}
        automatic={automatic}
        onAvailability={onAvailability}
      />
    );
  if (participant?.kind === 'child')
    return (
      <p className="reference-pending">
        La reproducción de YouTube dentro del perfil infantil todavía no está habilitada.
      </p>
    );
  return (
    <AdultReferenceVideo
      segment={segment}
      paused={paused}
      automatic={automatic}
      onAvailability={onAvailability}
    />
  );
}
function AdultReferenceVideo({
  segment,
  paused = false,
  automatic = false,
  onAvailability,
}: {
  segment: VideoSegment;
  paused?: boolean;
  automatic?: boolean;
  onAvailability?: ((ready: boolean, issue?: string) => void) | undefined;
}) {
  const box = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const [opened, setOpened] = useState(automatic);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [readyToPlay, setReadyToPlay] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [availableRates, setAvailableRates] = useState<number[]>([1]);
  const [loop, setLoop] = useState(automatic);
  const availability = useRef(onAvailability);
  availability.current = onAvailability;
  const loopRef = useRef(false);
  const pausedRef = useRef(paused);
  loopRef.current = loop;
  pausedRef.current = paused;
  useEffect(() => {
    if (paused) player.current?.pauseVideo();
    else if (automatic && !document.hidden) player.current?.playVideo();
  }, [paused, automatic]);
  useEffect(() => {
    if (!opened || !box.current) return;
    if (automatic) {
      availability.current?.(false);
      box.current.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
    let cancelled = false;
    let instance: YouTubePlayer | null = null;
    let ready = false;
    let mediaAvailable = false;
    let resumeHidden = false;
    let inViewport = true;
    const host = box.current;
    const mount = document.createElement('div');
    host.appendChild(mount);
    setStatus('Conectando con YouTube…');
    setError('');
    setReadyToPlay(false);
    setPlaybackRate(1);
    setAvailableRates([1]);
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
      if (!mediaAvailable && !cancelled) {
        setStatus('Video no disponible.');
        setError('La referencia tarda en responder. Puedes abrirla en YouTube o reintentar.');
        availability.current?.(
          false,
          'El video tarda en responder. El recorrido queda en pausa.',
        );
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
              setError('');
              player.current = target;
              target.getIframe().title = `${segment.title} — ${segment.channel}`;
              target.getIframe().referrerPolicy = 'strict-origin-when-cross-origin';
              if (automatic && !pausedRef.current && !document.hidden) {
                target.mute();
                target.loadVideoById(bounds());
              } else {
                target.cueVideoById(bounds());
              }
              setStatus(
                automatic
                  ? 'Iniciando demostración sin sonido…'
                  : 'Usa el botón de reproducción del video.',
              );
            },
            onStateChange: ({ data, target }) => {
              if (cancelled) return;
              if (data === 1 || data === 5) {
                mediaAvailable = true;
                setReadyToPlay(true);
                clearTimeout(timeout);
                setAvailableRates(target.getAvailablePlaybackRates());
                setPlaybackRate(target.getPlaybackRate());
              }
              if (data === 5 && automatic) availability.current?.(true);
              if (data === 0) finish();
              if (data === 1) {
                if (instance && instance.getCurrentTime() < segment.end) restarting = false;
                if (document.hidden || !inViewport || pausedRef.current) {
                  instance?.pauseVideo();
                  if (automatic && inViewport) availability.current?.(true);
                } else {
                  setStatus('Reproduciendo el fragmento.');
                  availability.current?.(true);
                }
              }
              if (data === 3) {
                setStatus('Cargando video…');
                if (automatic) availability.current?.(false);
              }
              if (data === 2 && instance && instance.getCurrentTime() < segment.end)
                setStatus('Video en pausa.');
              if (
                data === 2 &&
                automatic &&
                !document.hidden &&
                !pausedRef.current &&
                !restarting &&
                instance &&
                instance.getCurrentTime() < segment.end
              )
                availability.current?.(
                  true,
                  'El video está en pausa. Reprodúcelo y pulsa Continuar cuando estés preparado.',
                );
            },
            onPlaybackRateChange: ({ data, target }) => {
              if (cancelled) return;
              setAvailableRates(target.getAvailablePlaybackRates());
              setPlaybackRate(data);
            },
            onError: ({ data }) => {
              if (!cancelled) {
                clearTimeout(timeout);
                setStatus('Video no disponible.');
                setError(videoFailure(data));
                availability.current?.(false, videoFailure(data));
              }
            },
            onAutoplayBlocked: () => {
              if (!cancelled) {
                setStatus('Pulsa reproducir dentro del video para continuar.');
                availability.current?.(
                  false,
                  'El navegador requiere reproducir el video manualmente. El reloj queda en pausa.',
                );
              }
            },
          },
        });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          clearTimeout(timeout);
          setStatus('Video no disponible.');
          setError(e instanceof Error ? e.message : 'No se pudo cargar el video.');
          availability.current?.(
            false,
            'No se pudo cargar la demostración. El recorrido queda en pausa.',
          );
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
      } else if ((resumeHidden || automatic) && !pausedRef.current && inViewport) {
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
            if (!inViewport && ready) {
              instance?.pauseVideo();
              if (automatic)
                availability.current?.(
                  true,
                  'La demostración quedó fuera de pantalla. Vuelve a ella y continúa cuando estés preparado.',
                );
            }
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
  }, [opened, attempt, segment, automatic]);
  return (
    <section className="reference-video" aria-label="Video de referencia">
      <div className="reference-heading">
        <strong>{segment.title}</strong>
        <span>
          {videoTime(segment.start)}–{videoTime(segment.end)} · {segment.channel}
        </span>
      </div>
      {segment.match === 'component' && (
        <p className="quiet-note">Este video muestra una parte del ejercicio.</p>
      )}
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
            <label>
              Velocidad del ejemplo{' '}
              <select
                value={playbackRate}
                disabled={!readyToPlay || Boolean(error) || availableRates.length < 2}
                onChange={(event) =>
                  player.current?.setPlaybackRate(Number(event.target.value))
                }
              >
                {availableRates.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate === 1 ? 'Normal' : `${rate}×`}
                  </option>
                ))}
              </select>
            </label>
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
          <p className="quiet-note">
            La velocidad del ejemplo no cambia el reloj ni las repeticiones de tu sesión.
          </p>
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
