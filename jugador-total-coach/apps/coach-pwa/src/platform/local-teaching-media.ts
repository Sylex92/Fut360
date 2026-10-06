import manifest from '../../../../assets/manifests/local-teaching-media.json';
import type { VideoSegment } from './youtube';

export interface LocalVideoSegment {
  provider: 'local';
  id: string;
  assetId: string;
  title: string;
  start: number;
  end: number;
  match: 'demonstration' | 'component';
  note: string;
}
export type TeachingVideo = VideoSegment | LocalVideoSegment;
export const isLocalVideo = (video: TeachingVideo): video is LocalVideoSegment =>
  'provider' in video && video.provider === 'local';
export function localTeachingAsset(segment: LocalVideoSegment) {
  const asset = manifest.assets.find((asset) => asset.id === segment.assetId);
  if (
    !asset ||
    !/^[a-z0-9-]+\/[a-z0-9-]+\.mp4$/.test(asset.file) ||
    !Number.isFinite(segment.start) ||
    !Number.isFinite(segment.end) ||
    segment.start < 0 ||
    segment.end <= segment.start ||
    segment.end > asset.duration
  )
    throw new Error('Fragmento local inválido o recurso no registrado.');
  return { ...asset, src: `/media/${asset.file}` };
}
