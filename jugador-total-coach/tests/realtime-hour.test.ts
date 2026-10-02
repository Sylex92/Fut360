import { test, expect } from 'vitest';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { compileWorkoutV2 } from '../packages/exercise-catalog/src/workout-v2';
import { prepareSession } from '../apps/coach-pwa/src/composition/session';
import workout from '../content/workouts/mvp1-60min-v2.json';
import catalog from '../assets/phase06-catalog.json';

test.skipIf(process.env['FUT360_REAL_HOUR'] !== '1')(
  'hora de reloj real, sin aceleración ni tiempo inyectado',
  async () => {
    const references = catalog.entries.map((entry) => {
      const manifest = JSON.parse(readFileSync(entry.manifest, 'utf8')) as {
        durationMs: number;
        assetId: string;
        version: number;
        sha256: string;
        clipName: string;
      };
      const exercise = JSON.parse(readFileSync(entry.exercise, 'utf8')) as {
        version: number;
        equipment: string[];
      };
      return {
        id: entry.exerciseId,
        name: entry.exerciseId,
        durationMs: manifest.durationMs,
        supportedSides: entry.supportedSides,
        exerciseVersion: exercise.version,
        assetId: manifest.assetId,
        assetVersion: manifest.version,
        sha256: manifest.sha256,
        clipName: manifest.clipName,
        equipment: exercise.equipment,
        sceneId: ['dead-bug', 'glute-bridge'].includes(entry.exerciseId)
          ? 'guided-floor-v1'
          : 'guided-standing-v1',
      };
    });
    const { plan } = compileWorkoutV2(workout, references);
    const workoutSha256 = createHash('sha256')
      .update(readFileSync('content/workouts/mvp1-60min-v2.json'))
      .digest('hex');
    const clock = prepareSession(
      plan,
      'real-hour-' + Date.now(),
      () => performance.now(),
      true,
    );
    const startedAt = new Date().toISOString();
    const start = performance.now();
    expect(clock.dispatch({ type: 'Start' }).accepted).toBe(true);
    const evidenceDir = 'docs/reviews/evidence/phase07';
    mkdirSync(evidenceDir, { recursive: true });
    const transitions: unknown[] = [];
    let last = '';
    let maximumSampleGapMs = 0;
    let sampled = start;
    while (clock.engine.project().status === 'running') {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const now = performance.now();
      maximumSampleGapMs = Math.max(maximumSampleGapMs, now - sampled);
      sampled = now;
      const state = clock.sample();
      const key = state.current?.id + '/' + state.phase;
      if (key !== last) {
        last = key;
        transitions.push({
          elapsedMs: now - start,
          current: state.current?.id,
          phase: state.phase,
          baseRemainingMs: state.baseRemainingMs,
        });
      }
    }
    const elapsedMs = performance.now() - start;
    const final = clock.engine.project();
    writeFileSync(
      evidenceDir + '/real-hour.json',
      JSON.stringify(
        {
          startedAt,
          endedAt: new Date().toISOString(),
          scope:
            'Node SessionClock + SessionEngine, real monotonic clock; no browser/rendering or exercise performed',
          playbackRate: 1,
          workoutSha256,
          elapsedMs,
          maximumSampleGapMs,
          transitions,
          final,
        },
        null,
        2,
      ) + '\n',
    );
    expect(final.status).toBe('completed');
    expect(final.counters.baseConsumedMs).toBe(3600000);
    expect(final.recordedMs).toBe(3600000);
    expect(final.counters.unobservedMs).toBe(0);
    expect(elapsedMs).toBeGreaterThanOrEqual(3600000);
    expect(elapsedMs).toBeLessThan(3601000);
  },
  3610000,
);
