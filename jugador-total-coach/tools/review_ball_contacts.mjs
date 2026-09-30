// Geometric inspection using Three's triangle queries, not a physics/contact solver.
import { readFileSync, writeFileSync } from 'node:fs';
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
for (const kind of ['lateral-sole-roll', 'inside-outside'])
  for (const side of ['left', 'right']) {
    const bytes = readFileSync(resolve(root, `assets/runtime/${kind}-${side}-v1.glb`));
    const gltf = await new GLTFLoader()
      .register(() => ({ name: 'CPU_GEOMETRY', loadTexture: async () => new Texture() }))
      .parseAsync(
        bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
        '',
      );
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
    for (let frame = 0; frame <= 300; frame++) {
      const time = frame / 30;
      mixer.setTime(time);
      gltf.scene.updateMatrixWorld(true);
      const center = gltf.scene
        .getObjectByName('TutorialBall')
        .getWorldPosition(new Vector3());
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
    const contacts = samples.filter((s) =>
      kind === 'lateral-sole-roll'
        ? s.time >= 2 && s.time <= 7
        : (s.time >= 2 && s.time <= 3) || (s.time >= 5 && s.time <= 7),
    );
    reports.push({
      kind,
      side,
      minGap: Math.min(...samples.map((s) => s.gapToAvatarSurfaceMeters)),
      maxContactGap: Math.max(...contacts.map((s) => s.gapToAvatarSurfaceMeters)),
      samples,
    });
  }
writeFileSync(
  resolve(root, 'docs/reviews/evidence/phase06/ball-surface-check.json'),
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
