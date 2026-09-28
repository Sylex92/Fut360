import { snapshotPlan } from '@fut360/domain';
import type { ExecutionPlan, PlanOccurrence } from '@fut360/domain';
import { validateWorkoutV1 } from './validate';

/** Historical content may run only as a labelled technical timing test. */
export function compileWorkoutV1(input: unknown): ExecutionPlan {
  const result = validateWorkoutV1(input);
  if (!result.ok) throw new Error(result.issues.map((issue) => issue.message).join(' '));
  if (
    result.summary.occurrences > 10000 ||
    !Number.isSafeInteger(result.summary.totalSeconds * 1000)
  )
    throw new Error('El plan excede los límites de expansión o milisegundos seguros.');
  const occurrences: PlanOccurrence[] = [];
  for (const block of result.workout.blocks) {
    for (let round = 0; round < block.rounds; round++) {
      block.items.forEach((item, index) => {
        occurrences.push({
          id: JSON.stringify([block.id, round, index, item.side ?? 'none']),
          exerciseId: item.exerciseId,
          title: item.exerciseId,
          side: item.side ?? 'none',
          demonstrationMs: 0,
          workMs: item.workSeconds * 1000,
          restMs: item.restSeconds * 1000,
        });
      });
    }
  }
  return snapshotPlan({
    id: result.workout.id,
    version: result.workout.version,
    title: result.workout.displayName,
    purpose: 'technical-test',
    expectedDurationMs: result.summary.totalSeconds * 1000,
    occurrences,
  });
}
