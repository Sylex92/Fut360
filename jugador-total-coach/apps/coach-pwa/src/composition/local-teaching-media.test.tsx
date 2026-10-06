import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { coachingTasks, findTasks, teachingVideos } from './coaching-catalog';
import {
  isLocalVideo,
  localTeachingAsset,
  type LocalVideoSegment,
} from '../platform/local-teaching-media';
import { ReferenceVideo } from '../ui/ReferenceVideo';
// @ts-expect-error Build helper intentionally runs in Node and in the generated worker.
import { cachedRangeResponse } from '../../../../tools/cached-range-response.mjs';

describe('Medios locales auditados', () => {
  const segment: LocalVideoSegment = {
    provider: 'local',
    id: 'synthetic',
    assetId: 'fifa-speed-control-warmup',
    title: 'Ejemplo',
    start: 8,
    end: 24,
    match: 'component',
    note: 'Componente de la tarea.',
  };
  it('solo resuelve originales registrados y rechaza rangos fuera del archivo', () => {
    expect(localTeachingAsset(segment).src).toBe('/media/fifa-speed-control/warm-up.mp4');
    for (const invalid of [
      { assetId: 'https://example.com/other.mp4' },
      { start: -1 },
      { end: 100 },
      { start: NaN },
      { end: 8 },
    ])
      expect(() => localTeachingAsset({ ...segment, ...invalid })).toThrow();
  });
  it('el catálogo infantil selecciona medios locales y mantiene la cobertura parcial explícita', () => {
    expect(findTasks('', '', '', true, 'child').map((t) => t.id)).toEqual([
      'Y01',
      'Y02',
      'Y04',
      'Y07',
      'Y08',
      'Y09',
    ]);
    for (const task of coachingTasks.filter((t) => t.id.startsWith('Y')))
      for (const video of teachingVideos(task)) {
        expect(isLocalVideo(video)).toBe(true);
        expect(video.match).toBe('component');
      }
    const html = renderToStaticMarkup(<ReferenceVideo segment={segment} automatic />);
    expect(html).toContain('src="/media/fifa-speed-control/warm-up.mp4"');
    expect(html).toContain('FIFA');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('youtube.com');
  });
});
describe('Video offline con rangos HTTP reales', () => {
  const source = () =>
    new Response('0123456789', { headers: { 'Content-Type': 'video/mp4' } });
  it.each([
    ['bytes=2-5', '2345', 'bytes 2-5/10'],
    ['bytes=7-', '789', 'bytes 7-9/10'],
    ['bytes=-3', '789', 'bytes 7-9/10'],
    ['bytes=8-999', '89', 'bytes 8-9/10'],
    ['bytes=-999', '0123456789', 'bytes 0-9/10'],
  ])('sirve %s sin necesitar red', async (range, content, header) => {
    const response = await cachedRangeResponse(source(), range);
    expect(response.status).toBe(206);
    expect(response.headers.get('Content-Range')).toBe(header);
    expect(response.headers.get('Content-Length')).toBe(String(content.length));
    expect(response.headers.get('Content-Type')).toBe('video/mp4');
    expect(await response.text()).toBe(content);
  });
  it.each(['bytes=10-', 'bytes=7-3', 'bytes=-0'])(
    'rechaza un rango insatisfacible %s',
    async (range) => {
      const response = await cachedRangeResponse(source(), range);
      expect(response.status).toBe(416);
      expect(response.headers.get('Content-Range')).toBe('bytes */10');
    },
  );
  it.each([null, 'items=1-2', 'bytes=1-2,5-6'])(
    'ignora unidades o rangos múltiples no implementados',
    async (range) => {
      const response = await cachedRangeResponse(source(), range);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('0123456789');
    },
  );
});
