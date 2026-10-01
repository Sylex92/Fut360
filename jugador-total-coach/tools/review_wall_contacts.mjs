// Reuse Three's skinning to measure authored contact. No force/stability solver.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(resolve(root, 'packages/viewer-3d/package.json'));
const { GLTFLoader } = await import(
  pathToFileURL(req.resolve('three/addons/loaders/GLTFLoader.js'))
);
const { Texture, Vector3, AnimationMixer, LoopOnce } = await import(
  pathToFileURL(resolve(dirname(req.resolve('three')), 'three.module.js'))
);
const bytes = readFileSync(resolve(root, 'assets/runtime/wall-push-up-v1.glb'));
const gltf = await new GLTFLoader()
  .register(() => ({
    name: 'CPU_GEOMETRY_ONLY',
    loadTexture: async () => new Texture(),
  }))
  .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const mixer = new AnimationMixer(gltf.scene);
const action = mixer.clipAction(gltf.animations[0]).setLoop(LoopOnce, 1);
action.clampWhenFinished = true;
action.play();
gltf.scene.updateMatrixWorld(true);
const wall = gltf.scene.getObjectByName('TutorialWall');
const wallZ = wall.localToWorld(
  new Vector3().fromBufferAttribute(wall.geometry.attributes.position, 0),
).z;
const meshes = [];
gltf.scene.traverse((obj) => {
  if (!obj.isSkinnedMesh) return;
  const at = obj.geometry.attributes;
  const regions = Array.from({ length: at.position.count }, (_, i) => {
    const weights = [0, 1, 2, 3].map((c) => at.skinWeight.getComponent(i, c));
    const slot = weights.indexOf(Math.max(...weights));
    return obj.skeleton.bones[at.skinIndex.getComponent(i, slot)].name;
  });
  meshes.push({ mesh: obj, regions });
});
const samples = [];
const point = new Vector3();
for (let frame = 0; frame <= 480; frame++) {
  action.enabled = true;
  action.paused = false;
  mixer.setTime(frame / 60);
  gltf.scene.updateMatrixWorld(true);
  const closestByRegion = {};
  const sole = { l: Infinity, r: Infinity };
  let nearestBodyToWall = Infinity,
    nearestHeadToWall = Infinity;
  for (const { mesh, regions } of meshes) {
    mesh.skeleton.update();
    for (let i = 0; i < regions.length; i++) {
      mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld);
      const name = regions[i];
      const gap = wallZ - point.z;
      nearestBodyToWall = Math.min(nearestBodyToWall, gap);
      if (name === 'Head') nearestHeadToWall = Math.min(nearestHeadToWall, gap);
      if (/^(hand|index|middle|ring|pinky|thumb)_/.test(name))
        closestByRegion[name] = Math.min(closestByRegion[name] ?? Infinity, gap);
      for (const s of ['l', 'r'])
        if (name === 'foot_' + s || name === 'ball_' + s) sole[s] = Math.min(sole[s], point.y);
    }
  }
  samples.push({
    frame,
    timeSeconds: frame / 60,
    nearestBodyToWall,
    nearestHeadToWall,
    sole,
    closestByRegion,
  });
}
const minGap = Math.min(...samples.map((s) => s.nearestBodyToWall));
const maxPalmGap = Math.max(
  ...samples.flatMap((s) => ['l', 'r'].map((side) => s.closestByRegion['hand_' + side])),
);
const maxFingerGap = Math.max(
  ...samples.flatMap((s) =>
    Object.entries(s.closestByRegion)
      .filter(([name]) => /^(index|middle|ring|pinky)_03_/.test(name))
      .map(([, gap]) => gap),
  ),
);
const minHeadGap = Math.min(...samples.map((s) => s.nearestHeadToWall));
const maxSoleGap = Math.max(...samples.flatMap((s) => Object.values(s.sole)));
const minSoleGap = Math.min(...samples.flatMap((s) => Object.values(s.sole)));
const issues = [];
if (minGap < -0.001) issues.push('avatar crosses the wall');
if (maxPalmGap > 0.01) issues.push('palm separates from the wall guide');
if (maxFingerGap > 0.015) issues.push('finger pad separates from the wall guide');
if (minHeadGap < 0.04) issues.push('head too close to the wall');
if (minSoleGap < -0.002 || maxSoleGap > 0.003) issues.push('sole support');
const summary = {
  samples: samples.length,
  wallZ,
  minGap,
  maxPalmGap,
  maxFingerGap,
  minHeadGap,
  minSoleGap,
  maxSoleGap,
  issues,
};
writeFileSync(
  resolve(root, 'docs/reviews/evidence/phase06-wall-push-up/wall-contacts.json'),
  JSON.stringify(
    {
      checkedAt: '2026-09-30',
      sha256: createHash('sha256').update(bytes).digest('hex'),
      method:
        'Three posed vertices, 60 Hz; regions by greatest skin weight. Graphic tolerances, not force, pressure, equilibrium or sporting certification.',
      summary,
      samples,
    },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify(summary));
if (issues.length) process.exitCode = 1;
