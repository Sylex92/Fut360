// CPU-only comparison after Blender's import/export. Does not simulate a browser.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fromViewer = createRequire(resolve(root, 'packages/viewer-3d/package.json'));
const { GLTFLoader } = await import(
  pathToFileURL(fromViewer.resolve('three/addons/loaders/GLTFLoader.js')).href
);
const { AnimationMixer, LoopOnce, Texture, Vector3 } = await import(
  pathToFileURL(resolve(dirname(fromViewer.resolve('three')), 'three.module.js')).href
);
const { validateBytes } = createRequire(import.meta.url)('gltf-validator');
async function load(file) {
  const bytes = readFileSync(resolve(root, file));
  const validation = await validateBytes(bytes, { uri: file });
  if (validation.issues.numErrors || validation.issues.numWarnings)
    throw new Error(JSON.stringify(validation.issues));
  const loader = new GLTFLoader().register(() => ({
    name: 'CPU_NO_IMAGE_DECODE',
    loadTexture: async () => new Texture(),
  }));
  const gltf = await loader.parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    '',
  );
  if (
    gltf.animations.length !== 1 ||
    gltf.animations[0].duration !== 8 ||
    gltf.animations[0].name !== 'EX_hip-hinge__neutral__v1'
  )
    throw new Error('Clip changed');
  const mixer = new AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.setLoop(LoopOnce, 1);
  action.clampWhenFinished = true;
  action.play();
  return { gltf, mixer, action, issues: validation.issues };
}
const original = await load('assets/runtime/hip-hinge-v1.glb');
const roundtrip = await load('.cache/phase04/hip-hinge-roundtrip.glb');
const names = [];
original.gltf.scene.traverse((o) => {
  if (o.isBone) names.push(o.name);
});
let maxBoneDifferenceMeters = 0;
for (let frame = 0; frame <= 240; frame++) {
  for (const item of [original, roundtrip]) {
    item.action.paused = false;
    item.action.enabled = true;
    item.mixer.setTime(frame / 30);
    item.gltf.scene.updateMatrixWorld(true);
  }
  for (const name of names) {
    const a = original.gltf.scene.getObjectByName(name),
      b = roundtrip.gltf.scene.getObjectByName(name);
    if (!b) throw new Error('Lost bone: ' + name);
    maxBoneDifferenceMeters = Math.max(
      maxBoneDifferenceMeters,
      a.getWorldPosition(new Vector3()).distanceTo(b.getWorldPosition(new Vector3())),
    );
  }
}
if (maxBoneDifferenceMeters > 0.001)
  throw new Error('Roundtrip changed the motion beyond 1 mm');
const report = {
  checkedAt: '2026-09-29',
  samples: 241,
  bones: names.length,
  maxBoneDifferenceMeters,
  toleranceMeters: 0.001,
  originalValidatorIssues: original.issues,
  roundtripValidatorIssues: roundtrip.issues,
  textureDecode: 'Verified separately by Blender import; CPU comparison skips image decoding',
  result: 'passed',
};
writeFileSync(
  resolve(root, 'docs/reviews/phase04-roundtrip.json'),
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    result: report.result,
    maxBoneDifferenceMeters,
    bones: names.length,
    samples: 241,
  }),
);
