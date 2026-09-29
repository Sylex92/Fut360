import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExerciseScene } from './ExerciseScene';

const harness = vi.hoisted(() => ({
  effects: [] as Array<() => void | (() => void)>,
  load: vi.fn(() => new Promise<never>(() => undefined)),
}));

// Exercise mounting effects without adding a DOM/GPU dependency. This is not browser E2E.
vi.mock('react', async (original) => ({
  ...(await original<typeof import('react')>()),
  useEffect: (effect: () => void | (() => void)) => {
    harness.effects.push(effect);
  },
}));
vi.mock('@react-three/fiber', () => ({
  // Fiber 9.8.1 always mounts fallback inside the DOM canvas; it is not an error event.
  Canvas: ({ fallback }: { fallback?: ReactNode }) => <canvas>{fallback}</canvas>,
  useFrame: vi.fn(),
  useThree: vi.fn(),
}));
vi.mock('three/addons/loaders/GLTFLoader.js', () => ({
  GLTFLoader: class {
    loadAsync = harness.load;
  },
}));

const cleanups: Array<() => void> = [];
function mountScene() {
  const onFailure = vi.fn();
  const onReady = vi.fn();
  const html = renderToStaticMarkup(
    <ExerciseScene
      assetUrl="/test-avatar.glb"
      clipName="test-clip"
      durationMs={8000}
      cameraPreset="side"
      getPoseMs={() => 0}
      onReady={onReady}
      onFailure={onFailure}
    />,
  );
  for (const effect of harness.effects.splice(0)) {
    const cleanup = effect();
    if (cleanup) cleanups.push(cleanup);
  }
  return { html, onFailure, onReady };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('window', {
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
  });
  harness.effects.length = 0;
  harness.load.mockReset().mockImplementation(() => new Promise<never>(() => undefined));
});
afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse()) cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('scene loading and passive canvas fallback', () => {
  it('does not report an error just because canvas fallback content mounts', () => {
    const { html, onFailure, onReady } = mountScene();
    expect(html).toContain('<canvas>');
    expect(harness.load).toHaveBeenCalledWith('/test-avatar.glb');
    expect(onFailure).not.toHaveBeenCalled();
    expect(onReady).not.toHaveBeenCalled();
  });

  it('still reports a load timeout, without claiming the avatar became ready', () => {
    const { onFailure, onReady } = mountScene();
    vi.advanceTimersByTime(24999);
    expect(onFailure).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onFailure).toHaveBeenCalledExactlyOnceWith(
      'La carga del avatar tardó demasiado. Puedes volver a intentarlo.',
    );
    expect(onReady).not.toHaveBeenCalled();
  });

  it('reports an actual load rejection once and cancels its timeout', async () => {
    harness.load.mockRejectedValueOnce(new Error('Asset request failed'));
    const { onFailure, onReady } = mountScene();
    await vi.advanceTimersByTimeAsync(0);
    expect(onFailure).toHaveBeenCalledExactlyOnceWith(
      'No se pudo cargar el avatar local. Vuelve a intentarlo.',
    );
    vi.advanceTimersByTime(30000);
    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(onReady).not.toHaveBeenCalled();
  });
});
