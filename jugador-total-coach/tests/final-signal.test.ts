import { afterEach, expect, it, vi } from 'vitest';
import { FinalSignal } from '../apps/coach-pwa/src/platform/final-signal';

class FakeContext {
  static tones = 0;
  static stopped = 0;
  static closed = 0;
  state = 'suspended';
  currentTime = 10;
  destination = {};
  async resume() {
    this.state = 'running';
  }
  async close() {
    FakeContext.closed++;
  }
  createOscillator() {
    FakeContext.tones++;
    return {
      frequency: { value: 0 },
      connect() {},
      disconnect() {},
      start() {},
      stop() {
        FakeContext.stopped++;
      },
      onended: null,
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime() {}, linearRampToValueAtTime() {} },
      connect() {},
      disconnect() {},
    };
  }
}
function setup() {
  FakeContext.tones = 0;
  FakeContext.stopped = 0;
  FakeContext.closed = 0;
  vi.stubGlobal('AudioContext', FakeContext);
  return new FinalSignal();
}
afterEach(() => vi.unstubAllGlobals());
it('un gesto habilita un único aviso por sesión aunque React repita el efecto', async () => {
  const signal = setup();
  expect(await signal.unlock()).toBe(true);
  expect(signal.finish('one')).toBe(true);
  expect(signal.finish('one')).toBe(false);
  expect(FakeContext.tones).toBe(1);
  expect(signal.finish('two')).toBe(true);
  expect(FakeContext.tones).toBe(2);
  signal.dispose();
});
it('silenciar evita sonido y no reproduce un final atrasado al activar', async () => {
  const signal = setup();
  await signal.unlock();
  signal.muted = true;
  expect(signal.finish('one')).toBe(false);
  signal.muted = false;
  expect(signal.finish('one')).toBe(false);
  expect(FakeContext.tones).toBe(0);
  signal.dispose();
});
it('no crea sonido sin activación y libera contexto/tono al desmontar', async () => {
  const signal = setup();
  expect(signal.finish('one')).toBe(false);
  await signal.unlock();
  signal.finish('two');
  signal.dispose();
  expect(FakeContext.stopped).toBe(2);
  expect(FakeContext.closed).toBe(1);
});
it('un navegador que impide audio no bloquea la finalización', async () => {
  vi.stubGlobal(
    'AudioContext',
    class {
      constructor() {
        throw new Error('No audio');
      }
    },
  );
  const signal = new FinalSignal();
  expect(await signal.unlock()).toBe(false);
  expect(signal.finish('one')).toBe(false);
  signal.dispose();
});
