import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AnimationClip,
  Bone,
  BoxGeometry,
  Group,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Texture,
} from 'three';
import { ExerciseScene } from './ExerciseScene';

type LoadedAvatar = { scene: Group; animations: AnimationClip[] };
const harness = vi.hoisted(() => ({
  effects: [] as Array<() => void | (() => void)>,
  load: vi.fn<(url: string) => Promise<LoadedAvatar>>(),
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
function unmountScenes() {
  for (const cleanup of cleanups.splice(0).reverse()) cleanup();
}
function pendingResource() {
  let resolve!: (resource: LoadedAvatar) => void;
  const promise = new Promise<LoadedAvatar>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}
function resourceFixture() {
  // Minimal resource contract, not a visual avatar or a WebGL render.
  const scene = new Group();
  const bones = ['pelvis', 'Head', 'foot_l', 'foot_r', 'ball_l', 'ball_r'].map((name) => {
    const bone = new Bone();
    bone.name = name;
    scene.add(bone);
    return bone;
  });
  const texture = new Texture();
  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial({ map: texture });
  const mesh = new SkinnedMesh(geometry, material);
  mesh.bind(new Skeleton(bones));
  scene.add(mesh);
  return {
    gltf: { scene, animations: [new AnimationClip('test-clip', 8, [])] },
    geometryDisposed: vi.spyOn(geometry, 'dispose'),
    materialDisposed: vi.spyOn(material, 'dispose'),
    textureDisposed: vi.spyOn(texture, 'dispose'),
    skeletonDisposed: vi.spyOn(mesh.skeleton, 'dispose'),
  };
}
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
  unmountScenes();
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

  it('disposes a resource arriving after timeout without reviving the failed scene', async () => {
    const resource = resourceFixture();
    const pending = pendingResource();
    harness.load.mockReturnValueOnce(pending.promise);
    const { onFailure, onReady } = mountScene();
    vi.advanceTimersByTime(25000);
    pending.resolve(resource.gltf);
    await vi.advanceTimersByTimeAsync(0);
    unmountScenes();
    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(onReady).not.toHaveBeenCalled();
    expect(resource.geometryDisposed).toHaveBeenCalledTimes(1);
    expect(resource.materialDisposed).toHaveBeenCalledTimes(1);
    expect(resource.textureDisposed).toHaveBeenCalledTimes(1);
    expect(resource.skeletonDisposed).toHaveBeenCalledTimes(1);
  });

  it('releases a late resource after unmount without reporting a stale error', async () => {
    const resource = resourceFixture();
    const pending = pendingResource();
    harness.load.mockReturnValueOnce(pending.promise);
    const { onFailure, onReady } = mountScene();
    unmountScenes();
    pending.resolve(resource.gltf);
    await vi.advanceTimersByTimeAsync(30000);
    expect(onFailure).not.toHaveBeenCalled();
    expect(onReady).not.toHaveBeenCalled();
    expect(resource.geometryDisposed).toHaveBeenCalledTimes(1);
    expect(resource.textureDisposed).toHaveBeenCalledTimes(1);
  });

  it('rejects an incompatible clip and releases the loaded resource', async () => {
    const resource = resourceFixture();
    harness.load.mockResolvedValueOnce({ ...resource.gltf, animations: [] });
    const { onFailure, onReady } = mountScene();
    await vi.advanceTimersByTimeAsync(30000);
    expect(onFailure).toHaveBeenCalledExactlyOnceWith(
      'El avatar o su animación no cumplen el contrato de esta demostración.',
    );
    expect(onReady).not.toHaveBeenCalled();
    expect(resource.geometryDisposed).toHaveBeenCalledTimes(1);
    expect(resource.materialDisposed).toHaveBeenCalledTimes(1);
    expect(resource.textureDisposed).toHaveBeenCalledTimes(1);
  });

  it('loads a fresh resource after failure and releases it on unmount', async () => {
    harness.load.mockRejectedValueOnce(new Error('Transient resource failure'));
    const failed = mountScene();
    await vi.advanceTimersByTimeAsync(0);
    expect(failed.onFailure).toHaveBeenCalledTimes(1);
    unmountScenes();
    const resource = resourceFixture();
    harness.load.mockResolvedValueOnce(resource.gltf);
    const retried = mountScene();
    await vi.advanceTimersByTimeAsync(30000);
    expect(harness.load).toHaveBeenCalledTimes(2);
    expect(retried.onFailure).not.toHaveBeenCalled();
    // The loader alone cannot declare ready; an actual Avatar frame must present it.
    expect(retried.onReady).not.toHaveBeenCalled();
    expect(resource.geometryDisposed).not.toHaveBeenCalled();
    unmountScenes();
    expect(resource.geometryDisposed).toHaveBeenCalledTimes(1);
    expect(resource.materialDisposed).toHaveBeenCalledTimes(1);
    expect(resource.textureDisposed).toHaveBeenCalledTimes(1);
    expect(resource.skeletonDisposed).toHaveBeenCalledTimes(1);
  });
});
