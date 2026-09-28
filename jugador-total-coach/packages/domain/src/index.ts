/** Historical format only. Future session/asset contracts are not implemented here. */
export type SideV1 = 'none' | 'right' | 'left' | 'alternate';
export interface WorkoutItemV1 {
  readonly exerciseId: string;
  readonly side?: SideV1;
  readonly workSeconds: number;
  readonly restSeconds: number;
}
export interface WorkoutBlockV1 {
  readonly id: string;
  readonly displayName: string;
  readonly rounds: number;
  readonly items: readonly WorkoutItemV1[];
}
export interface WorkoutV1 {
  readonly id: string;
  readonly version: 1;
  readonly displayName: string;
  readonly expectedDurationSeconds: number;
  readonly space: { readonly widthM: number; readonly lengthM: number };
  readonly equipment?: readonly string[];
  readonly blocks: readonly WorkoutBlockV1[];
  readonly reviewStatus: 'draft' | 'coaching-reviewed';
}
export interface BlockSummary {
  readonly id: string;
  readonly name: string;
  readonly rounds: number;
  readonly occurrences: number;
  readonly totalSeconds: number;
}
export interface WorkoutSummary {
  readonly workSeconds: number;
  readonly restSeconds: number;
  readonly totalSeconds: number;
  readonly occurrences: number;
  readonly uniqueExercises: number;
  readonly blocks: readonly BlockSummary[];
}

/** Arithmetic only, no scheduling or inference of physical activity. */
export function summarizeWorkout(workout: WorkoutV1): WorkoutSummary {
  let workSeconds = 0;
  let restSeconds = 0;
  let occurrences = 0;
  const exerciseIds = new Set<string>();
  const blocks = workout.blocks.map((block) => {
    let blockSeconds = 0;
    for (const item of block.items) {
      workSeconds += item.workSeconds * block.rounds;
      restSeconds += item.restSeconds * block.rounds;
      blockSeconds += (item.workSeconds + item.restSeconds) * block.rounds;
      exerciseIds.add(item.exerciseId);
    }
    const blockOccurrences = block.items.length * block.rounds;
    occurrences += blockOccurrences;
    return {
      id: block.id,
      name: block.displayName,
      rounds: block.rounds,
      occurrences: blockOccurrences,
      totalSeconds: blockSeconds,
    };
  });
  return {
    workSeconds,
    restSeconds,
    totalSeconds: workSeconds + restSeconds,
    occurrences,
    uniqueExercises: exerciseIds.size,
    blocks,
  };
}
