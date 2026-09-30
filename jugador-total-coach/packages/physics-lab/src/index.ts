import { Quaternion, Vector3 } from 'three';
import type { Object3D } from 'three';

export const contactConfig = {
  step: 1 / 60,
  duration: 10,
  gravity: [0, -9.81, 0] as const,
  radius: 0.11,
  mass: 0.43,
  ballStart: [-0.15, 0.11, 0.035] as const,
  footHalfExtents: [0.055, 0.045, 0.12] as const,
  ballFriction: 0.5,
  groundFriction: 0.65,
  footFriction: 0.5,
  restitution: 0.25,
  linearDamping: 0.15,
  angularDamping: 0.2,
  ccd: true,
  maxCcdSubsteps: 4,
} as const;
export const contactClipName = 'EX_inside-inside__alternating__v1';
export type ContactMode = 'tutorial' | 'physics-lab';
export type FootSource = 'avatar' | 'debug';
export type ContactView = 'front' | 'threeQuarter' | 'detail';
export interface LabSample {
  seconds: number;
  contacts: number;
  ball: readonly number[];
  ended: boolean;
  outside: boolean;
}
export function authority(mode: ContactMode) {
  return {
    avatar: 'authored',
    ball: mode === 'tutorial' ? 'authored' : 'rapier',
    floor: 'static',
  } as const;
}

/** A simple authored input for the first isolated collider test; never moves the ball. */
export function debugFootPose(seconds: number) {
  const t = Math.max(0, Math.min(1, (seconds - 0.8) / 1.6));
  const travel = t * t * (3 - 2 * t);
  return {
    position: new Vector3(-0.36 + 0.24 * travel, 0.065, 0.035),
    rotation: new Quaternion(),
  };
}

/** Collider follows the evaluated ankle/toe bones, without changing their transforms. */
export function boneFootPose(scene: Object3D, side: 'l' | 'r') {
  const ankle = scene.getObjectByName('foot_' + side);
  const toe = scene.getObjectByName('ball_' + side);
  if (!ankle || !toe) throw new Error('El clip no contiene los huesos del pie.');
  const a = ankle.getWorldPosition(new Vector3());
  const b = toe.getWorldPosition(new Vector3());
  const forward = b.clone().sub(a);
  return {
    position: a.lerp(b, 0.65),
    rotation: new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      Math.atan2(forward.x, forward.z),
    ),
  };
}
