export interface VideoSegment {
  id: string;
  videoId: string;
  channel: string;
  title: string;
  start: number;
  end: number;
  match: 'demonstration' | 'component';
  note: string;
}
export function validateSegment(segment: VideoSegment): VideoSegment {
  if (
    !/^[\w-]{11}$/.test(segment.videoId) ||
    !Number.isFinite(segment.start) ||
    !Number.isFinite(segment.end) ||
    segment.start < 0 ||
    segment.end <= segment.start ||
    segment.end - segment.start > 1800
  )
    throw new Error('Fragmento de video inválido.');
  return segment;
}
export function segmentRequest(segment: VideoSegment) {
  validateSegment(segment);
  return { videoId: segment.videoId, startSeconds: segment.start, endSeconds: segment.end };
}
export function videoLink(segment: VideoSegment) {
  validateSegment(segment);
  return `https://www.youtube.com/watch?v=${segment.videoId}&t=${Math.floor(segment.start)}s`;
}
export interface YouTubePlayer {
  cueVideoById(value: ReturnType<typeof segmentRequest>): void;
  loadVideoById(value: ReturnType<typeof segmentRequest>): void;
  playVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  pauseVideo(): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  getIframe(): HTMLIFrameElement;
  destroy(): void;
}
interface YouTubeApi {
  Player: new (
    node: HTMLElement,
    options: {
      host: string;
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: { data: number; target: YouTubePlayer }) => void;
        onError: (event: { data: number }) => void;
        onAutoplayBlocked: () => void;
      };
    },
  ) => YouTubePlayer;
}
declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let loading: Promise<YouTubeApi> | null = null;
export function loadYouTube(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    const previous = window.onYouTubeIframeAPIReady;
    const failure = () => {
      clearTimeout(timer);
      script.remove();
      if (previous) window.onYouTubeIframeAPIReady = previous;
      else delete window.onYouTubeIframeAPIReady;
      loading = null;
      reject(
        new Error('No se pudo conectar con YouTube. Comprueba Internet o abre la referencia.'),
      );
    };
    const timer = setTimeout(failure, 20000);
    script.onerror = failure;
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else failure();
    };
    document.head.appendChild(script);
  });
  return loading;
}
export function videoFailure(code: number) {
  if ([100, 101, 150].includes(code))
    return 'El autor no permite reproducir este video aquí o ya no está disponible. Puedes probar el enlace de YouTube.';
  if (code === 153)
    return 'YouTube no pudo identificar este navegador. Abre la referencia en YouTube.';
  return 'YouTube no pudo reproducir el fragmento. Reintenta o abre la referencia.';
}
