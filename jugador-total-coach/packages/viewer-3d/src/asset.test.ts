import { beforeAll, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, SkinnedMesh, Texture, Vector3 } from 'three';
import { ClipDriver, disposeScene } from './clip-driver';
import manifest from '../../../assets/manifests/hip-hinge-v1.json';
import mapping from '../../../assets/manifests/quaternius-male-rig.json';

const bytes = readFileSync(
  new URL('../../../assets/runtime/hip-hinge-v1.glb', import.meta.url),
);
let gltf: GLTF;
beforeAll(async () => {
  // Node contract tests inspect geometry/animation; texture decoding and WebGL need the browser.
  const loader = new GLTFLoader().register(() => ({
    name: 'CPU_TEST_NO_IMAGE_DECODE',
    loadTexture: async () => new Texture(),
  }));
  gltf = await loader.parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    '',
  );
});
it('el GLB pasa el validador reutilizado de Khronos sin errores', async () => {
  const { validateBytes } = createRequire(import.meta.url)('gltf-validator') as {
    validateBytes: (
      data: Uint8Array,
      options: { uri: string },
    ) => Promise<{ issues: { numErrors: number; numWarnings: number; messages: unknown[] } }>;
  };
  const report = await validateBytes(bytes, { uri: 'hip-hinge-v1.glb' });
  expect(report.issues.numErrors, JSON.stringify(report.issues.messages)).toBe(0);
  expect(report.issues.numWarnings, JSON.stringify(report.issues.messages)).toBe(0);
});
it('carga el clip único finito de 8 s y los 65 huesos reutilizados', () => {
  expect(gltf.animations).toHaveLength(1);
  expect(gltf.animations[0]?.name).toBe('EX_hip-hinge__neutral__v1');
  expect(gltf.animations[0]?.duration).toBe(8);
  let bones = 0;
  gltf.scene.traverse((object) => {
    if (object.type === 'Bone') bones++;
  });
  expect(bones).toBe(65);
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(manifest.sha256);
  expect(mapping.id).toBe(manifest.rigId);
  for (const name of Object.values(mapping.semantics))
    expect(gltf.scene.getObjectByName(name)).toBeDefined();
});
it('mantiene pies/toes y bounds dentro del suelo 2×2 a lo largo de las 241 muestras', () => {
  const driver = new ClipDriver(
    gltf.scene,
    gltf.animations,
    'EX_hip-hinge__neutral__v1',
    8000,
  );
  const supports = ['foot_l', 'foot_r', 'ball_l', 'ball_r'].map((name) =>
    gltf.scene.getObjectByName(name)!,
  );
  const initial = supports.map((bone) => bone.getWorldPosition(new Vector3()));
  const bounds = new Box3();
  const all = new Box3();
  for (let frame = 0; frame <= 240; frame++) {
    driver.setTime((frame * 1000) / 30);
    for (const [i, bone] of supports.entries())
      expect(bone.getWorldPosition(new Vector3()).distanceTo(initial[i]!)).toBeLessThan(0.001);
    // Compute from posed vertices, not the undeformed geometry's bounding box.
    bounds.makeEmpty();
    gltf.scene.traverse((object) => {
      if (object instanceof SkinnedMesh) {
        object.skeleton.update();
        for (let i = 0; i < object.geometry.attributes.position!.count; i++) {
          const point = object
            .getVertexPosition(i, new Vector3())
            .applyMatrix4(object.matrixWorld);
          bounds.expandByPoint(point);
        }
      }
    });
    expect(bounds.min.y).toBeGreaterThan(-0.001);
    expect(bounds.max.y).toBeLessThan(1.83);
    expect(
      Math.max(
        Math.abs(bounds.min.x),
        Math.abs(bounds.max.x),
        Math.abs(bounds.min.z),
        Math.abs(bounds.max.z),
      ),
    ).toBeLessThan(1);
    all.union(bounds);
  }
  expect(all.max.y).toBeGreaterThan(1.8); // Scale is metres, not centimetres.
  driver.dispose();
});
it('fin, retorno de preview e inspección inversa evalúan la pose correcta', () => {
  const driver = new ClipDriver(
    gltf.scene,
    gltf.animations,
    'EX_hip-hinge__neutral__v1',
    8000,
  );
  const head = gltf.scene.getObjectByName('Head')!;
  driver.setTime(0);
  const neutral = head.getWorldPosition(new Vector3());
  driver.setTime(3500);
  const hinged = head.getWorldPosition(new Vector3());
  expect(hinged.z).toBeGreaterThan(neutral.z + 0.15); // Front is +Z.
  expect(hinged.y).toBeLessThan(neutral.y - 0.15);
  driver.setTime(8000);
  expect(head.getWorldPosition(new Vector3()).distanceTo(neutral)).toBeLessThan(0.0001);
  driver.setTime(3500);
  expect(head.getWorldPosition(new Vector3()).distanceTo(hinged)).toBeLessThan(0.0001);
  driver.setTime(0);
  expect(head.getWorldPosition(new Vector3()).distanceTo(neutral)).toBeLessThan(0.0001);
  driver.dispose();
});
it('rechaza un clip o una duración incompatibles, sin aparentar una carga correcta', () => {
  expect(() => new ClipDriver(gltf.scene, gltf.animations, 'missing', 8000)).toThrow();
  expect(
    () => new ClipDriver(gltf.scene, gltf.animations, 'EX_hip-hinge__neutral__v1', 1000),
  ).toThrow();
  disposeScene(gltf.scene);
});
