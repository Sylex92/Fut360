import { beforeAll, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import RAPIER from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, SkinnedMesh, Texture, Vector3, Quaternion } from 'three';
import { ClipDriver } from '@fut360/viewer-3d/clip-driver';
import {
  authority,
  boneFootPose,
  contactClipName,
  contactConfig as cfg,
  debugFootPose,
} from './index';
import type { FootSource } from './index';

const bytes = readFileSync(
  new URL('../../../assets/runtime/inside-inside-v1.glb', import.meta.url),
);
let gltf: GLTF;
let driver: ClipDriver;
beforeAll(async () => {
  await RAPIER.init();
  gltf = await new GLTFLoader()
    .register(() => ({ name: 'CPU_NO_IMAGE_DECODE', loadTexture: async () => new Texture() }))
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  driver = new ClipDriver(gltf.scene, gltf.animations, contactClipName, 10000);
});
it('valida un clip único de avatar y balón, con 65 huesos y duración de 10 s', async () => {
  const { validateBytes } = createRequire(import.meta.url)('gltf-validator');
  const report = await validateBytes(bytes);
  expect(report.issues.numErrors).toBe(0);
  expect(report.issues.numWarnings).toBe(0);
  expect(gltf.animations).toHaveLength(1);
  expect(gltf.animations[0]?.duration).toBe(10);
  expect(gltf.animations[0]?.tracks.some((t) => t.name === 'TutorialBall.position')).toBe(
    true,
  );
  let bones = 0;
  gltf.scene.traverse((o) => {
    if (o.type === 'Bone') bones++;
  });
  expect(bones).toBe(65);
});
it('mantiene escala, apoyos y cuerpo dentro de 2×2 en todas las poses', () => {
  const all = new Box3();
  const point = new Vector3();
  let maxStep = 0;
  let previous: Vector3 | null = null;
  for (let frame = 0; frame <= 300; frame++) {
    driver.setTime((frame * 1000) / 30);
    const head = gltf.scene.getObjectByName('Head')!.getWorldPosition(new Vector3());
    if (previous) maxStep = Math.max(maxStep, head.distanceTo(previous));
    previous = head;
    expect(head.y).toBeGreaterThan(1.48);
    expect(head.y).toBeLessThan(1.54);
    for (const side of ['l', 'r'] as const) {
      const ankle = gltf.scene
        .getObjectByName('foot_' + side)!
        .getWorldPosition(new Vector3());
      expect(ankle.y).toBeGreaterThan(0.09);
      expect(ankle.y).toBeLessThan(0.12);
      const support = frame < 120 ? 'l' : 'r';
      if (side === support) expect(Math.abs(ankle.x)).toBeCloseTo(0.34, 3);
    }
    gltf.scene.traverse((o) => {
      if (o instanceof SkinnedMesh) {
        o.skeleton.update();
        for (let v = 0; v < o.geometry.attributes.position!.count; v++)
          all.expandByPoint(o.getVertexPosition(v, point).applyMatrix4(o.matrixWorld));
      }
    });
  }
  expect(maxStep).toBeLessThan(0.004);
  expect(all.min.y).toBeGreaterThan(-0.008);
  expect(all.max.y).toBeLessThan(1.83);
  expect(
    Math.max(
      Math.abs(all.min.x),
      Math.abs(all.max.x),
      Math.abs(all.min.z),
      Math.abs(all.max.z),
    ),
  ).toBeLessThan(1);
  if (process.env.CONTACT_REPORT === '1')
    writeFileSync(
      new URL('../../../docs/reviews/evidence/phase05/asset-bounds.json', import.meta.url),
      JSON.stringify(
        {
          min: all.min.toArray(),
          max: all.max.toArray(),
          maxHeadStepMeters: maxStep,
          samples: 301,
          kind: 'posed vertices in GLB; CPU without image decoding',
        },
        null,
        2,
      ) + '\n',
    );
});
it('evalúa contacto guiado, ida/vuelta y seek sin activar física sobre el balón', () => {
  const sphere = new RAPIER.Ball(cfg.radius);
  const foot = new RAPIER.Cuboid(...cfg.footHalfExtents);
  const minimum: Record<string, number> = { l: Infinity, r: Infinity };
  for (let frame = 0; frame <= 300; frame++) {
    driver.setTime((frame * 1000) / 30);
    const ball = gltf.scene.getObjectByName('TutorialBall')!.getWorldPosition(new Vector3());
    expect(ball.y).toBeCloseTo(cfg.radius, 5);
    expect(Math.abs(ball.x)).toBeLessThan(0.151);
    for (const side of ['l', 'r'] as const) {
      const pose = boneFootPose(gltf.scene, side);
      const contact = sphere.contactShape(
        ball,
        new Quaternion(),
        foot,
        pose.position,
        pose.rotation,
        1,
      );
      if (contact) minimum[side] = Math.min(minimum[side]!, contact.distance);
    }
  }
  for (const distance of Object.values(minimum)) {
    expect(distance).toBeLessThan(0.015);
    expect(distance).toBeGreaterThan(-0.025);
  }
  if (process.env.CONTACT_REPORT === '1')
    writeFileSync(
      new URL('../../../docs/reviews/evidence/phase05/guided-contact.json', import.meta.url),
      JSON.stringify(
        {
          minimumDistanceMeters: minimum,
          proxy: 'sphere/cuboid; does not certify the skin mesh or sports technique',
          samples: 301,
        },
        null,
        2,
      ) + '\n',
    );
  driver.setTime(1700);
  const ball = gltf.scene.getObjectByName('TutorialBall')!;
  const saved = ball.position.clone();
  driver.setTime(10000);
  driver.setTime(1700);
  expect(ball.position.distanceTo(saved)).toBeLessThan(1e-7);
  expect(authority('tutorial').ball).toBe('authored');
  expect(authority('physics-lab').ball).toBe('rapier');
});

function simulate(source: FootSource, speed: number, renderHz: number) {
  driver.setTime(0);
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = cfg.step;
  world.integrationParameters.maxCcdSubsteps = cfg.maxCcdSubsteps;
  const queue = new RAPIER.EventQueue(true);
  const floor = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(1, 0.05, 1)
      .setTranslation(0, -0.05, 0)
      .setFriction(cfg.groundFriction)
      .setRestitution(cfg.restitution),
    floor,
  );
  const ball = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(...cfg.ballStart)
      .setCcdEnabled(cfg.ccd)
      .setLinearDamping(cfg.linearDamping)
      .setAngularDamping(cfg.angularDamping),
  );
  const ballCollider = world.createCollider(
    RAPIER.ColliderDesc.ball(cfg.radius)
      .setMass(cfg.mass)
      .setFriction(cfg.ballFriction)
      .setRestitution(cfg.restitution)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
    ball,
  );
  const sides: ('r' | 'l')[] = source === 'debug' ? ['r'] : ['r', 'l'];
  const feet = sides.map((side) => {
    const pose = source === 'debug' ? debugFootPose(0) : boneFootPose(gltf.scene, side);
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased()
        .setTranslation(pose.position.x, pose.position.y, pose.position.z)
        .setRotation(pose.rotation),
    );
    const collider = world.createCollider(
      RAPIER.ColliderDesc.cuboid(...cfg.footHalfExtents)
        .setFriction(cfg.footFriction)
        .setRestitution(cfg.restitution),
      body,
    );
    return { side, body, collider };
  });
  let steps = 0,
    contacts = 0,
    firstContact = -1,
    maxHeight = 0,
    outside = false;
  const trace: number[][] = [];
  // Group the exact same fixed steps by synthetic render cadence. This tests the
  // solver/input contract; the wrapper's accumulator is verified in browser separately.
  for (
    let frame = 1;
    steps < Math.round(cfg.duration / speed / cfg.step) && !outside;
    frame++
  ) {
    const due = Math.min(
      Math.round(cfg.duration / speed / cfg.step),
      Math.floor((frame * 60) / renderHz + 1e-9),
    );
    while (steps < due && !outside) {
      steps++;
      const t = steps * cfg.step * speed;
      driver.setTime(t * 1000);
      for (const { side, body } of feet) {
        const pose = source === 'debug' ? debugFootPose(t) : boneFootPose(gltf.scene, side);
        body.setNextKinematicTranslation(pose.position);
        body.setNextKinematicRotation(pose.rotation);
      }
      world.step(queue);
      queue.drainCollisionEvents((a, b, started) => {
        if (
          started &&
          (a === ballCollider.handle || b === ballCollider.handle) &&
          feet.some((f) => f.collider.handle === a || f.collider.handle === b)
        ) {
          contacts++;
          if (firstContact < 0) firstContact = t;
        }
      });
      const p = ball.translation();
      maxHeight = Math.max(maxHeight, p.y);
      expect(Number.isFinite(p.x + p.y + p.z)).toBe(true);
      expect(p.y).toBeGreaterThan(cfg.radius - 0.01);
      trace.push([p.x, p.y, p.z]);
      outside = Math.abs(p.x) + cfg.radius > 1 || Math.abs(p.z) + cfg.radius > 1;
    }
  }
  const result = {
    source,
    speed,
    renderHz,
    steps,
    contacts,
    firstContact,
    maxHeight,
    outside,
    final: trace.at(-1)!,
    trace,
  };
  // Terminal pause must survive additional steps already queued by a render frame.
  const terminal = { ...ball.translation() };
  ball.sleep();
  for (let extra = 0; extra < 3; extra++) world.step(queue);
  expect(ball.translation()).toEqual(terminal);
  queue.free();
  world.free();
  return result;
}
it('calcula contactos lentos/rápidos a 30/60/120 Hz y reproduce el reinicio', () => {
  const report = [];
  for (const source of ['debug', 'avatar'] as const)
    for (const speed of [1, 4]) {
      const runs = [30, 60, 120].map((hz) => simulate(source, speed, hz));
      for (const run of runs) {
        expect(run.contacts).toBeGreaterThan(0);
        expect(run.firstContact).toBeGreaterThan(0.8);
        expect(run.trace).toEqual(runs[0]!.trace);
        report.push({ ...run, trace: undefined });
      }
      const reset = simulate(source, speed, 60);
      expect(reset.trace).toEqual(runs[0]!.trace);
    }
  if (process.env.CONTACT_REPORT === '1')
    writeFileSync(
      new URL('../../../docs/reviews/evidence/phase05/physics-matrix.json', import.meta.url),
      JSON.stringify(
        {
          rapier: RAPIER.version(),
          config: cfg,
          environment: process.version,
          kind: 'CPU WASM; synthetic render grouping, not GPU FPS',
          runs: report,
        },
        null,
        2,
      ) + '\n',
    );
});
