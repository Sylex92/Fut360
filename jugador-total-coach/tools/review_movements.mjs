// Reuse Khronos validation and Three's actual skinning/mixer for the authored catalog.
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fromViewer = createRequire(resolve(root, 'packages/viewer-3d/package.json'));
const { GLTFLoader } = await import(
  pathToFileURL(fromViewer.resolve('three/addons/loaders/GLTFLoader.js')).href
);
const { AnimationMixer, LoopOnce, Texture, Vector3, Box3, SkinnedMesh } = await import(
  pathToFileURL(resolve(dirname(fromViewer.resolve('three')), 'three.module.js')).href
);
const { validateBytes } = createRequire(import.meta.url)('gltf-validator');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const write = (file, value) =>
  writeFileSync(resolve(root, file), JSON.stringify(value, null, 2) + '\n');
const reports = [];
const recordDraft = process.argv.includes('--record-draft');
const versionFilter =
  process.argv.find((a) => a.startsWith('--version='))?.split('=')[1] ?? '1';
const assetFilter = process.argv.find((a) => a.startsWith('--asset='))?.split('=')[1];
if (assetFilter && !/^[a-z0-9-]+$/.test(assetFilter)) throw new Error('Invalid asset name');
if (!['1', '2'].includes(versionFilter)) throw new Error('Supported versions: 1 or 2');
const reportGroup = process.argv.find((a) => a.startsWith('--report-group='))?.split('=')[1];
if (reportGroup && !/^[a-z0-9-]+$/.test(reportGroup)) throw new Error('Invalid report group');
const reportDirectory = reportGroup
  ? 'docs/reviews/evidence/' + reportGroup
  : assetFilter
    ? 'docs/reviews/evidence/phase06-' + assetFilter
    : versionFilter === '2'
      ? 'docs/reviews/evidence/phase06-natural-motion'
      : 'docs/reviews/evidence/phase06';
for (const name of readdirSync(resolve(root, 'assets/runtime'))
  .filter(
    (n) =>
      n.endsWith('.glb') &&
      n.endsWith('-v' + versionFilter + '.glb') &&
      (!assetFilter || n === assetFilter + '-v' + versionFilter + '.glb'),
  )
  .sort()) {
  const file = 'assets/runtime/' + name;
  const bytes = readFileSync(resolve(root, file));
  const validation = await validateBytes(bytes, { uri: name });
  const gltf = await new GLTFLoader()
    .register(() => ({ name: 'CPU_GEOMETRY_ONLY', loadTexture: async () => new Texture() }))
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const clip = gltf.animations[0];
  if (!clip || gltf.animations.length !== 1)
    throw new Error('Se requiere un clip por recurso: ' + name);
  const match = /^EX_(.+)__(.+)__v([1-9][0-9]*)$/.exec(clip.name);
  if (!match) throw new Error('Nombre de clip incompatible: ' + name);
  const [, kind, variant, version] = match;
  const mixer = new AnimationMixer(gltf.scene);
  const action = mixer.clipAction(clip);
  action.setLoop(LoopOnce, 1);
  action.clampWhenFinished = true;
  action.play();
  const jointNames = [
    'pelvis',
    'Head',
    'foot_l',
    'foot_r',
    'ball_l',
    'ball_r',
    'hand_l',
    'hand_r',
    'calf_l',
    'calf_r',
  ];
  const bones = jointNames.map((n) => gltf.scene.getObjectByName(n));
  if (bones.some((b) => !b)) throw new Error('Huesos ausentes: ' + name);
  const meshes = [];
  let boneCount = 0;
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) meshes.push(obj);
    if (obj.type === 'Bone') boneCount++;
  });
  const all = new Box3(),
    point = new Vector3(),
    samples = [];
  let previous,
    maxJointStep = 0,
    maxJointStepAt;
  for (let frame = 0; frame <= Math.round(clip.duration * 30); frame++) {
    action.paused = false;
    action.enabled = true;
    mixer.setTime(frame / 30);
    gltf.scene.updateMatrixWorld(true);
    const bounds = new Box3();
    for (const mesh of meshes) {
      if (mesh instanceof SkinnedMesh) mesh.skeleton.update();
      for (let i = 0; i < mesh.geometry.attributes.position.count; i++)
        bounds.expandByPoint(mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld));
    }
    all.union(bounds);
    const joints = Object.fromEntries(
      bones.map((b, i) => [jointNames[i], b.getWorldPosition(new Vector3()).toArray()]),
    );
    if (previous)
      for (const key of jointNames) {
        const distance = Math.hypot(...joints[key].map((v, i) => v - previous[key][i]));
        if (distance > maxJointStep) {
          maxJointStep = distance;
          maxJointStepAt = { frame, key };
        }
      }
    previous = joints;
    samples.push({ frame, joints });
  }
  const fixed = [
    'hip-hinge',
    'mini-squat',
    'ankle-mobility',
    'slow-breathing',
    'glute-bridge',
    'wall-push-up',
  ].includes(kind)
    ? ['foot_l', 'foot_r', 'ball_l', 'ball_r']
    : [];
  if (['glute-bridge', 'dead-bug'].includes(kind)) fixed.push('Head');
  if (kind === 'wall-push-up') fixed.push('hand_l', 'hand_r');
  if (['lateral-sole-roll', 'inside-outside', 'inside-outside-sole'].includes(kind)) {
    const support = variant === 'left' ? 'r' : 'l';
    fixed.push('foot_' + support, 'ball_' + support);
  }
  const drift = Object.fromEntries(
    fixed.map((n) => [
      n,
      Math.max(
        ...samples.map((s) =>
          Math.hypot(...s.joints[n].map((v, i) => v - samples[0].joints[n][i])),
        ),
      ),
    ]),
  );
  const first = samples[0].joints,
    last = samples.at(-1).joints;
  const returnError = Math.max(
    ...jointNames.map((n) => Math.hypot(...last[n].map((v, i) => v - first[n][i]))),
  );
  const bounds = { min: all.min.toArray(), max: all.max.toArray() };
  const issues = [];
  if (validation.issues.numErrors || validation.issues.numWarnings)
    issues.push('glTF validation');
  if (boneCount !== 65) issues.push('rig bone count');
  if (
    bounds.min[1] < -0.002 ||
    Math.max(...[bounds.min[0], bounds.min[2], bounds.max[0], bounds.max[2]].map(Math.abs)) > 1
  )
    issues.push('floor/2x2 bounds');
  if (maxJointStep > 0.08) issues.push('joint discontinuity');
  if (Object.values(drift).some((v) => v > 0.002)) issues.push('support drift');
  if (returnError > 0.002) issues.push('return pose');
  const manifestFile = 'assets/manifests/' + name.replace('.glb', '.json');
  if (!existsSync(resolve(root, manifestFile))) {
    const floor = ['glute-bridge', 'dead-bug'].includes(kind);
    write(manifestFile, {
      assetId: 'quaternius-' + name.replace('.glb', ''),
      version: Number(version),
      file,
      sha256: sha(bytes),
      rigId: 'quaternius-superhero-male-65-v1',
      rigMapping: 'assets/manifests/quaternius-male-rig.json',
      clipName: clip.name,
      fps: 30,
      durationMs: Math.round(clip.duration * 1000),
      loopable: false,
      startPose: floor ? 'supine-bent-knees-arms-supported' : kind + '-' + variant + '-start',
      endPose: floor ? 'supine-bent-knees-arms-supported' : kind + '-' + variant + '-start',
      boundingBoxMeters: bounds,
      requiredProps: floor
        ? ['mat']
        : gltf.scene.getObjectByName('TutorialWall')
          ? ['wall']
          : gltf.scene.getObjectByName('TutorialBall')
            ? ['ball']
            : [],
      supportedSides: [
        ['left', 'right', 'alternate', 'alternating'].includes(variant)
          ? variant === 'alternating'
            ? 'alternate'
            : variant
          : kind === 'dead-bug'
            ? 'alternate'
            : 'none',
      ],
      previewSeparationMs: 2000,
      practiceRepetitions: 1,
      authority: 'animation',
      reviewStatus: 'draft',
    });
  } else {
    const existing = JSON.parse(readFileSync(resolve(root, manifestFile), 'utf8'));
    // Explicit opt-in for newly authored drafts only; accepted legacy resources stay pinned.
    if (
      recordDraft &&
      existing.reviewStatus === 'draft' &&
      !(version === '1' && ['hip-hinge', 'inside-inside'].includes(kind)) &&
      issues.length === 0
    ) {
      existing.sha256 = sha(bytes);
      existing.boundingBoxMeters = bounds;
      write(manifestFile, existing);
    }
    if (existing.sha256 !== sha(bytes))
      issues.push('manifest hash changed; review before updating');
  }
  const source = 'assets/source/' + kind + '/' + name.replace('.glb', '.blend');
  if (!existsSync(resolve(root, source))) issues.push('editable source missing');
  reports.push({
    file,
    sha256: sha(bytes),
    bytes: bytes.length,
    source,
    sourceSha256: existsSync(resolve(root, source))
      ? sha(readFileSync(resolve(root, source)))
      : null,
    clipName: clip.name,
    kind,
    variant,
    durationMs: Math.round(clip.duration * 1000),
    boneCount,
    samples: samples.length,
    bounds,
    maxJointStep,
    maxJointStepAt,
    returnError,
    supportDrift: drift,
    gltf: { errors: validation.issues.numErrors, warnings: validation.issues.numWarnings },
    issues,
    keyPoses: samples.filter((s) => s.frame % 30 === 0),
  });
  mixer.stopAllAction();
  mixer.uncacheRoot(gltf.scene);
}
if (!reports.length) throw new Error('No GLB matched the requested asset/version');
mkdirSync(resolve(root, reportDirectory), { recursive: true });
write(reportDirectory + '/asset-validation.json', {
  checkedAt: new Date().toISOString(),
  method:
    'GLTFLoader/AnimationMixer + posed vertices at 30 Hz; texture decode excluded; not sporting certification',
  reports,
});
console.log(
  JSON.stringify(
    reports.map(({ file, samples, issues, bounds }) => ({ file, samples, issues, bounds })),
  ),
);
if (reports.some((r) => r.issues.length)) process.exitCode = 1;
