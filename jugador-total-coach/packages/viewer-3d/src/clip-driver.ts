import { AnimationMixer, LoopOnce, Mesh, SkinnedMesh, Texture } from 'three';
import type { AnimationClip, Material, Object3D } from 'three';

/** Evaluates an owned GLTF scene at an explicit app cursor; never advances session time. */
export class ClipDriver {
  private readonly mixer;
  private readonly action;
  readonly durationMs: number;

  constructor(
    readonly scene: Object3D,
    clips: AnimationClip[],
    clipName: string,
    expectedMs: number,
  ) {
    const clip = clips.find((entry) => entry.name === clipName);
    let skinned = false;
    scene.traverse((object) => {
      if (object instanceof SkinnedMesh) skinned = true;
    });
    if (!skinned || !clip || Math.abs(clip.duration * 1000 - expectedMs) > 34)
      throw new Error('El avatar o su animación no cumplen el contrato de esta demostración.');
    for (const name of ['pelvis', 'Head', 'foot_l', 'foot_r', 'ball_l', 'ball_r'])
      if (!scene.getObjectByName(name))
        throw new Error('Falta un apoyo o hueso requerido del avatar.');
    this.durationMs = clip.duration * 1000;
    this.mixer = new AnimationMixer(scene);
    this.action = this.mixer.clipAction(clip);
    this.action.setLoop(LoopOnce, 1);
    this.action.clampWhenFinished = true;
    this.action.play();
    this.setTime(0);
  }
  setTime(ms: number): void {
    if (!Number.isFinite(ms)) throw new Error('Cursor de animación inválido.');
    // LoopOnce pauses at the end. Re-enable before seeking back for preview/inspection.
    this.action.paused = false;
    this.action.enabled = true;
    this.mixer.setTime(Math.max(0, Math.min(this.durationMs, ms)) / 1000);
    this.scene.updateMatrixWorld(true);
  }
  dispose(): void {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.scene);
  }
}

/** Only for privately loaded scenes, never a shared GLTF cache. */
export function disposeScene(scene: Object3D): void {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material])
        materials.add(material);
    }
    if (object instanceof SkinnedMesh) object.skeleton.dispose();
  });
  for (const material of materials) {
    for (const value of Object.values(material))
      if (value instanceof Texture) textures.add(value);
    material.dispose();
  }
  for (const texture of textures) {
    const data = texture.source.data as { close?: () => void } | undefined;
    data?.close?.();
    texture.dispose();
  }
}
