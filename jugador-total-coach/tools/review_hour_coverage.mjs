import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const workout = read('content/workouts/mvp1-60min-v2.json');
const catalog = read('assets/phase06-catalog.json');
const ids = [...new Set(workout.blocks.flatMap((b) => b.items.map((i) => i.exerciseId)))];
const assets = ids.map((id) => {
  const entry = catalog.entries.find((e) => e.exerciseId === id);
  if (!entry) throw new Error('Sin referencia: ' + id);
  const manifest = read(entry.manifest);
  const digest = hash(readFileSync(manifest.file));
  if (digest !== manifest.sha256) throw new Error('Hash diferente: ' + id);
  const items = workout.blocks.flatMap((b) => b.items).filter((i) => i.exerciseId === id);
  if (items.some((i) => !manifest.supportedSides.includes(i.side)))
    throw new Error('Lado no cubierto: ' + id);
  return {
    exerciseId: id,
    patternId: entry.patternId,
    file: manifest.file,
    sha256: digest,
    clipName: manifest.clipName,
    durationMs: manifest.durationMs,
    occurrences: items.length,
    technicalReady: true,
    releaseReady: false,
    reviewStatus: manifest.reviewStatus,
    fallback: false,
    humanReview: entry.humanReview,
    remainingReview:
      'Individual suitability/dosage and complete-session usability; professional review not claimed',
  };
});
const unchanged = ['content/examples/mvp1-60min.workout.json', 'pnpm-lock.yaml'].map(
  (path) => {
    const previous = execFileSync('git', [
      '-c',
      'safe.directory=C:/Users/mario.sabaleta/Documents/GitHub/Fut360',
      'show',
      'HEAD:jugador-total-coach/' + path,
    ]);
    const sha256 = hash(readFileSync(path));
    const unchanged = hash(previous) === sha256;
    if (!unchanged) throw new Error('Modificación no prevista: ' + path);
    return { path, sha256, unchanged };
  },
);
const totals = workout.blocks.reduce(
  (total, b) => {
    for (const item of b.items) {
      total.demonstrationSeconds += item.demonstrationSeconds;
      total.workSeconds += item.workSeconds;
      total.restSeconds += item.restSeconds;
      total.occurrences++;
    }
    return total;
  },
  { demonstrationSeconds: 0, workSeconds: 0, restSeconds: 0, occurrences: 0 },
);
if (totals.demonstrationSeconds + totals.workSeconds + totals.restSeconds !== 3600)
  throw new Error('Hora incorrecta');
const result = {
  checkedAt: new Date().toISOString(),
  workoutSha256: hash(readFileSync('content/workouts/mvp1-60min-v2.json')),
  totals,
  coverage: {
    patterns: new Set(assets.map((a) => a.patternId)).size,
    assets: assets.length,
    technicalReady: assets.length,
    releasedForTraining: 0,
    draft: assets.filter((a) => a.reviewStatus === 'draft').length,
    fallback: 0,
    missing: 0,
    professionalReviewClaimed: 0,
  },
  assets,
  unchanged,
};
mkdirSync('docs/reviews/evidence/phase07', { recursive: true });
writeFileSync(
  'docs/reviews/evidence/phase07/coverage.json',
  JSON.stringify(result, null, 2) + '\n',
);
console.log(JSON.stringify({ coverage: result.coverage, totals, unchanged }));
