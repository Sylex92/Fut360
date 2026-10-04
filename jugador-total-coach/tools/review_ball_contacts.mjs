// Geometric inspection using Three's triangle queries, not a physics/contact solver.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(resolve(root, 'packages/viewer-3d/package.json'));
const { GLTFLoader } = await import(
  pathToFileURL(req.resolve('three/addons/loaders/GLTFLoader.js')).href
);
const { AnimationMixer, Texture, Vector3, Triangle, SkinnedMesh, LoopOnce } = await import(
  pathToFileURL(resolve(dirname(req.resolve('three')), 'three.module.js')).href
);
const reports = [];
const combination = process.argv.includes('--combination');
const soleV = process.argv.includes('--sole-v');
const version = process.argv.includes('--version=2') ? 2 : 1;
if (combination && version !== 1) throw new Error('Combination version must be 1');
const cases = (
  soleV
    ? ['sole-pull-push', 'v-pull']
    : combination
      ? ['inside-outside-sole']
      : ['lateral-sole-roll', 'inside-outside']
).flatMap((kind) => ['left', 'right'].map((side) => ({ kind, side })));
if (version === 2) cases.push({ kind: 'inside-inside', side: 'alternate' });
for (const { kind, side } of cases) {
  const stem = kind === 'inside-inside' ? kind : `${kind}-${side}`;
  const bytes = readFileSync(resolve(root, `assets/runtime/${stem}-v${version}.glb`));
  const gltf = await new GLTFLoader()
    .register(() => ({ name: 'CPU_GEOMETRY', loadTexture: async () => new Texture() }))
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const mixer = new AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.setLoop(LoopOnce, 1);
  action.clampWhenFinished = true;
  action.play();
  const body = [];
  gltf.scene.traverse((o) => {
    if (o instanceof SkinnedMesh) body.push(o);
  });
  const samples = [];
  const duration = gltf.animations[0].duration;
  for (let frame = 0; frame <= Math.round(duration * 30); frame++) {
    const time = frame / 30;
    mixer.setTime(time);
    gltf.scene.updateMatrixWorld(true);
    const center = gltf.scene.getObjectByName('TutorialBall').getWorldPosition(new Vector3());
    let nearest = Infinity,
      nearestBone = '';
    const closest = new Vector3(),
      triangle = new Triangle();
    for (const mesh of body) {
      mesh.skeleton.update();
      const g = mesh.geometry;
      const vertices = Array.from({ length: g.attributes.position.count }, (_, i) =>
        mesh.getVertexPosition(i, new Vector3()).applyMatrix4(mesh.matrixWorld),
      );
      const indices = g.index?.array ?? Array.from({ length: vertices.length }, (_, i) => i);
      for (let i = 0; i < indices.length; i += 3) {
        const ids = [indices[i], indices[i + 1], indices[i + 2]];
        if (ids.every((k) => vertices[k].y > 0.5)) continue;
        triangle.set(...ids.map((k) => vertices[k]));
        triangle.closestPointToPoint(center, closest);
        const distance = closest.distanceTo(center) - 0.11;
        if (distance < nearest) {
          nearest = distance;
          nearestBone = mesh.skeleton.bones[g.attributes.skinIndex.getX(ids[0])]?.name;
        }
      }
    }
    samples.push({ time, gapToAvatarSurfaceMeters: nearest, nearestBone });
  }
  const contacts = samples.filter((sample) => {
    if (kind === 'sole-pull-push') return sample.time >= 1.4 && sample.time <= 5.8;
    if (kind === 'v-pull')
      return (
        (sample.time >= 1.4 && sample.time <= 2.8) ||
        (sample.time >= 4 && sample.time <= 5.2) ||
        (sample.time >= 6.3 && sample.time <= 8)
      );
    if (kind === 'inside-outside-sole') {
      const t = sample.time;
      return (t >= 1.3 && t <= 1.95) || (t >= 3.25 && t <= 4.55) || (t >= 8.4 && t <= 11.65);
    }
    if (kind === 'inside-inside') {
      if (sample.time < 0.35 || sample.time >= 6.15) return false;
      const old = (((sample.time - 0.35) / 2.9) % 1) * 8;
      return (old >= 1.4 && old <= 2) || (old >= 5.4 && old <= 6);
    }
    const s = { time: (sample.time * 10) / duration };
    return kind === 'lateral-sole-roll'
      ? s.time >= 2 && s.time <= 7
      : (s.time >= 2 && s.time <= 3) || (s.time >= 5 && s.time <= 7);
  });
  reports.push({
    kind,
    side,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    minGap: Math.min(...samples.map((s) => s.gapToAvatarSurfaceMeters)),
    maxContactGap: Math.max(...contacts.map((s) => s.gapToAvatarSurfaceMeters)),
    samples,
  });
}
const reportFile = resolve(
  root,
  soleV
    ? 'docs/reviews/evidence/product-sole-v/ball-surface-check.json'
    : combination
      ? 'docs/reviews/evidence/phase07-library/ball-surface-check.json'
      : version === 2
        ? 'docs/reviews/evidence/phase06-natural-motion/ball-surface-check.json'
        : 'docs/reviews/evidence/phase06/ball-surface-check.json',
);
mkdirSync(dirname(reportFile), { recursive: true });
writeFileSync(
  reportFile,
  JSON.stringify(
    {
      method:
        'Sphere radius subtracted from distance to deformed avatar triangles at 30 Hz; negative means surface intersects sphere; not sports validation',
      reports,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify(
    reports.map(({ samples, ...summary }) => ({ ...summary, samples: samples.length })),
  ),
);
if (reports.some((r) => r.minGap < -0.002 || r.maxContactGap > 0.01)) process.exitCode = 1;
