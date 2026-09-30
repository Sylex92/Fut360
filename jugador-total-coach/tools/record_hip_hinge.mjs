// Record measured asset provenance and geometry after Blender authoring.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const formatting = JSON.parse(readFileSync(resolve(root, '.prettierrc.json'), 'utf8'));
const writeJson = async (path, value) =>
  writeFileSync(
    resolve(root, path),
    await format(JSON.stringify(value), { ...formatting, parser: 'json' }),
  );
const authoring = JSON.parse(
  readFileSync(resolve(root, '.cache/phase04/clip-authoring-report.json'), 'utf8'),
);
const hash = (path) =>
  createHash('sha256')
    .update(readFileSync(resolve(root, path)))
    .digest('hex');
const min = [Infinity, Infinity, Infinity],
  max = [-Infinity, -Infinity, -Infinity];
let maxFootDrift = 0;
for (const sample of authoring.samples) {
  const [lo, hi] = sample.boundsBlenderXYZ;
  const runtimeLo = [lo[0], lo[2], -hi[1]],
    runtimeHi = [hi[0], hi[2], -lo[1]];
  for (let axis = 0; axis < 3; axis++) {
    min[axis] = Math.min(min[axis], runtimeLo[axis]);
    max[axis] = Math.max(max[axis], runtimeHi[axis]);
  }
  for (const side of ['l', 'r'])
    maxFootDrift = Math.max(
      maxFootDrift,
      Math.hypot(
        ...sample.feet[side].map(
          (value, axis) => value - authoring.samples[0].feet[side][axis],
        ),
      ),
    );
}
const mapping = {
  id: 'quaternius-superhero-male-65-v1',
  reviewStatus: 'draft',
  sourceFile: 'assets/source/hip-hinge/original/Superhero_Male_FullBody.gltf',
  sourceSha256: hash('assets/source/hip-hinge/original/Superhero_Male_FullBody.gltf'),
  referencePose: 'T-pose imported; runtime clip starts standing with arms down',
  boneCount: authoring.bones.length,
  meters: true,
  upAxis: '+Y',
  forwardAxis: '+Z',
  anatomicalRightAxisAtRest: '-X',
  semantics: {
    root: 'root',
    hips: 'pelvis',
    spine: 'spine_01',
    chest: 'spine_03',
    neck: 'neck_01',
    head: 'Head',
    leftUpperArm: 'upperarm_l',
    leftLowerArm: 'lowerarm_l',
    leftHand: 'hand_l',
    rightUpperArm: 'upperarm_r',
    rightLowerArm: 'lowerarm_r',
    rightHand: 'hand_r',
    leftUpperLeg: 'thigh_l',
    leftLowerLeg: 'calf_l',
    leftFoot: 'foot_l',
    leftToes: 'ball_l',
    rightUpperLeg: 'thigh_r',
    rightLowerLeg: 'calf_r',
    rightFoot: 'foot_r',
    rightToes: 'ball_r',
  },
  corrections: [
    'Ground lift ' + authoring.groundLiftMeters + ' m',
    'Blender Z-up/-Y-front to glTF Y-up/+Z-front by existing exporter',
    'Original bone names/weights/hierarchy retained',
    'Clavicle pose lowered ' +
      authoring.shoulderPoseCorrectionDegrees +
      ' degrees; rest rig retained',
    'Arms lowered ' +
      authoring.armLoweringFromTPoseDegrees +
      ' degrees from T-pose to reduce lateral spread',
    'Skin meshes made identity scene roots without changing evaluated positions',
  ],
};
for (const bone of Object.values(mapping.semantics))
  if (!authoring.bones.includes(bone)) throw new Error('Missing mapping bone: ' + bone);
const manifest = {
  assetId: 'quaternius-hip-hinge-v1',
  version: 1,
  file: 'assets/runtime/hip-hinge-v1.glb',
  sha256: hash('assets/runtime/hip-hinge-v1.glb'),
  rigId: mapping.id,
  rigMapping: 'assets/manifests/quaternius-male-rig.json',
  clipName: 'EX_hip-hinge__neutral__v1',
  fps: 30,
  durationMs: 8000,
  loopable: false,
  startPose: 'neutral-standing-arms-down',
  endPose: 'neutral-standing-arms-down',
  boundingBoxMeters: { min, max },
  requiredProps: [],
  supportedSides: ['none'],
  previewSeparationMs: 2000,
  practiceRepetitions: 3,
  authority: 'animation',
  reviewStatus: 'draft',
};
mkdirSync(resolve(root, 'assets/manifests'), { recursive: true });
await writeJson('assets/manifests/quaternius-male-rig.json', mapping);
await writeJson('assets/manifests/hip-hinge-v1.json', manifest);
const files = [];
function inventory(directory) {
  for (const entry of readdirSync(resolve(root, directory), { withFileTypes: true })) {
    const path = directory + '/' + entry.name;
    if (entry.isDirectory()) inventory(path);
    else if (!/\.blend\d+$/.test(path))
      files.push({ path, bytes: statSync(resolve(root, path)).size, sha256: hash(path) });
  }
}
inventory('assets/source/hip-hinge');
inventory('assets/runtime');
inventory('assets/manifests');
const report = {
  checkedAt: '2026-09-29',
  authoringTool: 'Blender ' + authoring.blenderVersion,
  clipName: manifest.clipName,
  samples: authoring.samples.length,
  fps: 30,
  durationMs: 8000,
  sourceMissingImages: authoring.sourceMissingImages,
  finalMaterial: 'Local baked neutral sportswear; no missing external textures',
  rigBoneCount: authoring.bones.length,
  meshVertices: authoring.meshVertices,
  shoulderPoseCorrectionDegrees: authoring.shoulderPoseCorrectionDegrees,
  armLoweringFromTPoseDegrees: authoring.armLoweringFromTPoseDegrees,
  boundsRuntimeMeters: manifest.boundingBoxMeters,
  maxFootDriftMeters: maxFootDrift,
  technicalToleranceMeters: 0.001,
  sportingReview: 'pending',
  browserReview: 'pending',
  files,
};
writeFileSync(
  resolve(root, 'docs/reviews/phase04-asset-evidence.json'),
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    glbBytes: files.find((file) => file.path === manifest.file).bytes,
    sha256: manifest.sha256,
    bounds: manifest.boundingBoxMeters,
    maxFootDriftMeters: maxFootDrift,
    sourceFiles: files.length,
  }),
);
