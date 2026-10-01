import { beforeAll, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { SkinnedMesh, Texture, Vector3 } from 'three';
import catalog from '../../../assets/phase06-catalog.json';
import animationSchema from '../../../content/schemas/animation.schema.json';
import exerciseSchema from '../../../content/schemas/exercise.schema.json';
import { ClipDriver } from './clip-driver';
import { movements } from '../../../apps/coach-pwa/src/composition/movement-library';

const root = new URL('../../../', import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root));
const json = (file: string) => JSON.parse(read(file).toString());
// Compare the GLB's mesh/skin attributes and embedded appearance independently
// of animation channels, file offsets and resource hashes.
const appearance = (file: string, avatarOnly = false) => {
  const bytes = read(file);
  const jsonLength = bytes.readUInt32LE(12);
  const data = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
  const binary = bytes.subarray(28 + jsonLength);
  const viewHash = (index: number) => {
    const view = data.bufferViews[index];
    return createHash('sha256')
      .update(binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength))
      .digest('hex');
  };
  const accessor = (index: number, semantic?: string) => {
    const value = data.accessors[index];
    return {
      type: value.type,
      count: value.count,
      componentType: value.componentType,
      hash:
        avatarOnly && (semantic === 'POSITION' || semantic === 'NORMAL')
          ? 'compared-numerically-after-scene-placement'
          : viewHash(value.bufferView),
    };
  };
  const meshes = data.meshes.filter(
    (_mesh: unknown, index: number) =>
      !avatarOnly ||
      data.nodes.some(
        (node: { mesh?: number; skin?: number }) =>
          node.mesh === index && node.skin !== undefined,
      ),
  );
  const usedMaterials = new Set(
    meshes.flatMap((mesh: { primitives: { material: number }[] }) =>
      mesh.primitives.map((p) => p.material),
    ),
  );
  return {
    meshes: meshes.map(
      (mesh: {
        primitives: {
          attributes: Record<string, number>;
          indices: number;
          material: number;
        }[];
      }) =>
        mesh.primitives.map((p) => ({
          attributes: Object.fromEntries(
            Object.entries(p.attributes).map(([name, index]) => [name, accessor(index, name)]),
          ),
          indices: accessor(p.indices),
          material: p.material,
        })),
    ),
    materials: data.materials.filter(
      (_material: unknown, index: number) => !avatarOnly || usedMaterials.has(index),
    ),
    images: data.images.map((image: { bufferView: number }) => viewHash(image.bufferView)),
    joints: data.skins.map((skin: { joints: number[] }) =>
      skin.joints.map((index) => data.nodes[index].name),
    ),
  };
};
const { Ajv2020 } = createRequire(
  new URL('../../exercise-catalog/package.json', import.meta.url),
)('ajv/dist/2020.js');
const ajv = new Ajv2020({ strict: true, allErrors: true });
const validateAnimation = ajv.compile(animationSchema);
const validateExercise = ajv.compile(exerciseSchema);
const loaded = new Map<string, { gltf: GLTF; driver: ClipDriver }>();
beforeAll(async () => {
  for (const entry of catalog.entries) {
    const manifest = json(entry.manifest);
    const bytes = read(manifest.file);
    const gltf = await new GLTFLoader()
      .register(() => ({
        name: 'CPU_CONTRACT_NO_TEXTURE_DECODE',
        loadTexture: async () => new Texture(),
      }))
      .parseAsync(
        bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
        '',
      );
    loaded.set(entry.exerciseId, {
      gltf,
      driver: new ClipDriver(
        gltf.scene,
        gltf.animations,
        manifest.clipName,
        manifest.durationMs,
      ),
    });
  }
});

it('el empuje reutiliza la apariencia y el rig de la bisagra; la pared es un prop aparte', () => {
  expect(appearance('assets/runtime/wall-push-up-v1.glb', true)).toEqual(
    appearance('assets/runtime/hip-hinge-v1.glb', true),
  );
  const skins = (id: string) => {
    const meshes: SkinnedMesh[] = [];
    loaded.get(id)!.gltf.scene.traverse((obj) => {
      if (obj instanceof SkinnedMesh) meshes.push(obj);
    });
    return meshes.sort((a, b) => a.name.localeCompare(b.name));
  };
  const base = skins('hip-hinge');
  const current = skins('wall-push-up');
  expect(current.length).toBe(base.length);
  // Placement at the floor edge is baked as a translation into the rest mesh.
  // Applying it in Blender can change normal float rounding, not shape/weights.
  current.forEach((mesh, index) => {
    expect(mesh.name).toBe(base[index]!.name);
    for (const key of ['position', 'normal']) {
      const a = mesh.geometry.getAttribute(key);
      const b = base[index]!.geometry.getAttribute(key);
      let maxDifference = 0;
      for (let i = 0; i < a.count; i++) {
        const difference = new Vector3()
          .fromBufferAttribute(a, i)
          .sub(new Vector3().fromBufferAttribute(b, i));
        if (key === 'position') difference.z -= 0.5959;
        maxDifference = Math.max(maxDifference, difference.length());
      }
      // Unit-normal difference 0.001 is below 0.06 degrees; export recalculates
      // normals after translating the same float32 rest vertices.
      expect(maxDifference).toBeLessThan(key === 'position' ? 1e-6 : 0.001);
    }
  });
});

it('el empuje flexiona los codos y vuelve sin desplazar manos ni pies', () => {
  const { gltf, driver } = loaded.get('wall-push-up')!;
  const position = (name: string) =>
    gltf.scene.getObjectByName(name)!.getWorldPosition(new Vector3());
  const angle = (side: string) => {
    const elbow = position('lowerarm_' + side);
    return (
      (position('upperarm_' + side)
        .sub(elbow)
        .angleTo(position('hand_' + side).sub(elbow)) *
        180) /
      Math.PI
    );
  };
  driver.setTime(0);
  const names = ['hand_l', 'hand_r', 'foot_l', 'foot_r', 'ball_l', 'ball_r'];
  const initial = names.map(position);
  const head = position('Head');
  for (const side of ['l', 'r']) expect(angle(side)).toBeGreaterThan(150);
  for (let time = 0; time <= 8000; time += 1000 / 60) {
    driver.setTime(time);
    names.forEach((name, i) =>
      expect(position(name).distanceTo(initial[i]!)).toBeLessThan(0.001),
    );
  }
  driver.setTime(3500);
  for (const side of ['l', 'r']) {
    expect(angle(side)).toBeLessThan(105);
    expect(angle(side)).toBeGreaterThan(65);
  }
  expect(position('Head').z - head.z).toBeGreaterThan(0.2);
  driver.setTime(8000);
  expect(position('Head').distanceTo(head)).toBeLessThan(0.001);
});

it.each(catalog.entries)(
  'resuelve ficha, lado, recurso y fuente de $exerciseId sin sustitutos',
  (entry) => {
    const manifest = json(entry.manifest),
      exercise = json(entry.exercise);
    expect(validateAnimation(manifest), JSON.stringify(validateAnimation.errors)).toBe(true);
    expect(validateExercise(exercise), JSON.stringify(validateExercise.errors)).toBe(true);
    expect(exercise.id).toBe(entry.exerciseId);
    expect(exercise.animation.assetId).toBe(manifest.assetId);
    expect(exercise.animation.clipName).toBe(manifest.clipName);
    const preview = movements.find((item) => item.id === entry.exerciseId)!;
    expect(preview).toBeDefined();
    expect(preview.clipName).toBe(manifest.clipName);
    expect(preview.durationMs).toBe(manifest.durationMs);
    expect(preview.cues).toEqual(exercise.cues);
    expect(preview.footDetail === true).toBe(
      exercise.animation.cameraPresets.includes('detail'),
    );
    expect(exercise.equipment).toEqual(manifest.requiredProps);
    expect(entry.supportedSides).toEqual(manifest.supportedSides);
    expect(createHash('sha256').update(read(manifest.file)).digest('hex')).toBe(
      manifest.sha256,
    );
    expect(existsSync(new URL(entry.source, root))).toBe(true);
    expect(exercise.reviewStatus).not.toBe('coaching-reviewed');
    expect(manifest.loopable).toBe(false);
    for (const window of manifest.contactWindows ?? []) {
      expect(window.startMs).toBeLessThan(window.endMs);
      expect(window.endMs).toBeLessThanOrEqual(manifest.durationMs);
    }
    if (manifest.sourceFile) {
      expect(manifest.sourceFile).toBe(entry.source);
      expect(createHash('sha256').update(read(entry.source)).digest('hex')).toBe(
        manifest.sourceSha256,
      );
    }
  },
);

it.each(catalog.entries.filter((entry) => 'previousManifest' in entry))(
  'la corrección de $exerciseId conserva malla, pesos, materiales, texturas y huesos',
  (entry) => {
    const current = json(entry.manifest);
    const previous = json((entry as { previousManifest: string }).previousManifest);
    expect(appearance(current.file)).toEqual(appearance(previous.file));
  },
);

it.each(catalog.entries)(
  'conserva la pose al pausar, llegar al final y volver atrás: $exerciseId',
  (entry) => {
    const { gltf, driver } = loaded.get(entry.exerciseId)!;
    expect(gltf.animations).toHaveLength(1);
    const head = gltf.scene.getObjectByName('Head')!;
    const foot = gltf.scene.getObjectByName('foot_r')!;
    const sample = () => [head, foot].map((bone) => bone.getWorldPosition(new Vector3()));
    driver.setTime(driver.durationMs * 0.4);
    const mid = sample();
    driver.setTime(driver.durationMs * 0.4);
    sample().forEach((v, i) => expect(v.distanceTo(mid[i]!)).toBeLessThan(1e-7));
    driver.setTime(driver.durationMs);
    driver.setTime(driver.durationMs * 0.4);
    sample().forEach((v, i) => expect(v.distanceTo(mid[i]!)).toBeLessThan(1e-6));
  },
);

it('el puente eleva la cadera, mantiene cabeza/pies y vuelve al apoyo sin repetición automática', () => {
  const { gltf, driver } = loaded.get('glute-bridge')!;
  const position = (name: string) =>
    gltf.scene.getObjectByName(name)!.getWorldPosition(new Vector3());
  driver.setTime(0);
  const hips = position('pelvis');
  const supports = ['Head', 'foot_l', 'foot_r', 'ball_l', 'ball_r'];
  const initial = supports.map(position);
  for (let time = 0; time <= 8000; time += 100) {
    driver.setTime(time);
    supports.forEach((name, i) =>
      expect(position(name).distanceTo(initial[i]!)).toBeLessThan(0.001),
    );
  }
  driver.setTime(3000);
  expect(position('pelvis').y - hips.y).toBeGreaterThan(0.2);
  driver.setTime(8000);
  expect(position('pelvis').distanceTo(hips)).toBeLessThan(0.001);
});

it('la variante supina mueve una pierna por vez sin desplazar pelvis ni pie contrario', () => {
  const { gltf, driver } = loaded.get('dead-bug')!;
  const position = (name: string) =>
    gltf.scene.getObjectByName(name)!.getWorldPosition(new Vector3());
  driver.setTime(0);
  const initial = Object.fromEntries(
    ['pelvis', 'foot_l', 'foot_r'].map((name) => [name, position(name)]),
  );
  for (const [time, active, support] of [
    [3000, 'foot_r', 'foot_l'],
    [9000, 'foot_l', 'foot_r'],
  ] as const) {
    driver.setTime(time);
    expect(position(active).y - initial[active]!.y).toBeGreaterThan(0.14);
    expect(position(support).distanceTo(initial[support]!)).toBeLessThan(0.001);
    expect(position('pelvis').distanceTo(initial.pelvis!)).toBeLessThan(0.001);
  }
});

it('la marcha coordina seis pasos con el brazo contrario y conserva un apoyo, sin saltos', () => {
  const { gltf, driver } = loaded.get('active-march')!;
  const position = (name: string) =>
    gltf.scene.getObjectByName(name)!.getWorldPosition(new Vector3());
  driver.setTime(0);
  const ground = { l: position('foot_l').y, r: position('foot_r').y };
  for (let step = 0; step < 6; step++) {
    driver.setTime((0.5 + (step + 0.5) * 1.1) * 1000);
    const leg = step % 2 === 0 ? 'r' : 'l';
    const support = leg === 'r' ? 'l' : 'r';
    expect(position('foot_' + leg).y - ground[leg]).toBeGreaterThan(0.12);
    expect(Math.abs(position('foot_' + support).y - ground[support])).toBeLessThan(0.002);
    expect(position('hand_' + support).z - position('hand_' + leg).z).toBeGreaterThan(0.08);
  }
  for (let time = 0; time <= driver.durationMs; time += 1000 / 60) {
    driver.setTime(time);
    expect(
      Math.min(
        Math.abs(position('foot_l').y - ground.l),
        Math.abs(position('foot_r').y - ground.r),
      ),
    ).toBeLessThan(0.002);
  }
});

it.each(
  catalog.entries.filter((e) =>
    ['inside-inside', 'lateral-sole-roll', 'inside-outside'].includes(e.patternId),
  ),
)(
  'la variante básica $exerciseId acompaña con brazos y conserva un pie en el suelo',
  (entry) => {
    const { gltf, driver } = loaded.get(entry.exerciseId)!;
    const pos = (n: string) => gltf.scene.getObjectByName(n)!.getWorldPosition(new Vector3());
    driver.setTime(0);
    const ground = [pos('foot_l').y, pos('foot_r').y];
    const handStart = pos('hand_l').sub(pos('pelvis'));
    let handExcursion = 0;
    for (let time = 0; time <= driver.durationMs; time += 1000 / 60) {
      driver.setTime(time);
      expect(
        Math.min(
          Math.abs(pos('foot_l').y - ground[0]!),
          Math.abs(pos('foot_r').y - ground[1]!),
        ),
      ).toBeLessThan(0.002);
      handExcursion = Math.max(
        handExcursion,
        pos('hand_l').sub(pos('pelvis')).distanceTo(handStart),
      );
    }
    expect(handExcursion).toBeGreaterThan(0.12);
  },
);
