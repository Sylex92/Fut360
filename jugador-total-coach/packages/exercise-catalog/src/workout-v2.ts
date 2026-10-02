import { Ajv2020 } from 'ajv/dist/2020.js';
import { snapshotPlan } from '@fut360/domain';
import type { ExecutionPlan } from '@fut360/domain';
import schema from '../../../content/schemas/workout-v2.schema.json';

export interface WorkoutItem {
  readonly id: string;
  readonly exerciseId: string;
  readonly exerciseVersion: number;
  readonly side: 'none' | 'left' | 'right' | 'alternate';
  readonly round: number;
  readonly demonstrationSeconds: number;
  readonly workSeconds: number;
  readonly restSeconds: number;
  readonly exampleRepetitions: number;
  readonly dose: string;
  readonly doseKind: 'time-based' | 'repetition-based';
  readonly targetRepetitions: number | null;
  readonly repetitionUnit: 'complete-movement' | 'per-side' | 'out-and-back' | null;
  readonly preparation: string;
}
export interface WorkoutBlock {
  readonly id: string;
  readonly title: string;
  readonly rounds: number;
  readonly expectedSeconds: number;
  readonly items: readonly WorkoutItem[];
}
export interface WorkoutV2 {
  readonly schemaVersion: 2;
  readonly locale: 'es-MX';
  readonly space: { readonly widthM: 2; readonly lengthM: 2 };
  readonly equipment: readonly string[];
  readonly safety: readonly string[];
  readonly resources: readonly WorkoutResource[];
  readonly id: string;
  readonly version: 2;
  readonly title: string;
  readonly reviewStatus: 'draft';
  readonly expectedDurationSeconds: 3600;
  readonly blocks: readonly WorkoutBlock[];
}
export interface WorkoutResource {
  readonly exerciseId: string;
  readonly exerciseVersion: number;
  readonly assetId: string;
  readonly assetVersion: number;
  readonly sha256: string;
  readonly clipName: string;
  readonly sceneId: 'guided-standing-v1' | 'guided-floor-v1';
}
export interface MovementReference {
  readonly id: string;
  readonly name: string;
  readonly durationMs: number;
  readonly supportedSides: readonly string[];
  readonly exerciseVersion: number;
  readonly assetId: string;
  readonly assetVersion: number;
  readonly sha256: string;
  readonly clipName: string;
  readonly sceneId: string;
  readonly equipment: readonly string[];
}
export interface CompiledWorkout {
  readonly workout: WorkoutV2;
  readonly plan: ExecutionPlan;
}
const validate = new Ajv2020({
  strict: true,
  allErrors: true,
  ownProperties: true,
}).compile<WorkoutV2>(schema);
/** This compiles timing/references, never coaching approval. */
export function compileWorkoutV2(
  input: unknown,
  references: readonly MovementReference[],
): CompiledWorkout {
  if (!validate(input))
    throw new Error(
      'El programa v2 no cumple su esquema: ' +
        validate.errors?.map((e) => e.instancePath).join(', '),
    );
  const owned = structuredClone(input);
  const refs = new Map(references.map((r) => [r.id, r]));
  if (refs.size !== references.length) throw new Error('Referencias duplicadas.');
  const resourceIds = new Set<string>();
  for (const resource of owned.resources) {
    const ref = refs.get(resource.exerciseId);
    if (!ref || resourceIds.has(resource.exerciseId))
      throw new Error('/resources: referencia ausente/duplicada: ' + resource.exerciseId);
    for (const key of [
      'exerciseVersion',
      'assetId',
      'assetVersion',
      'sha256',
      'clipName',
      'sceneId',
    ] as const)
      if (resource[key] !== ref[key])
        throw new Error(
          '/resources/' + resource.exerciseId + '/' + key + ': versión incompatible.',
        );
    resourceIds.add(resource.exerciseId);
    Object.freeze(resource);
  }
  const requiredEquipment = new Set<string>();
  const usedResources = new Set<string>();
  const blocks = new Set<string>();
  const occurrences = owned.blocks.flatMap((block) => {
    if (!block.id.trim() || !block.title.trim() || blocks.has(block.id))
      throw new Error('Bloque inválido o duplicado.');
    blocks.add(block.id);
    let sum = 0;
    const rounds = new Set<number>();
    let previousRound = 0;
    const items = block.items.map((item) => {
      const ref = refs.get(item.exerciseId);
      if (!ref || !ref.supportedSides.includes(item.side))
        throw new Error('Recurso/lado no resuelto: ' + item.exerciseId);
      if (!resourceIds.has(item.exerciseId) || item.exerciseVersion !== ref.exerciseVersion)
        throw new Error('Versión no resuelta: ' + item.id);
      usedResources.add(item.exerciseId);
      ref.equipment.forEach((e) => requiredEquipment.add(e));
      if (
        item.doseKind === 'time-based' &&
        (item.targetRepetitions !== null || item.repetitionUnit !== null)
      )
        throw new Error('Una dosis temporal no exige repeticiones: ' + item.id);
      if (
        item.doseKind === 'repetition-based' &&
        (!item.targetRepetitions ||
          !item.repetitionUnit ||
          item.targetRepetitions !== item.exampleRepetitions ||
          (item.repetitionUnit === 'per-side' && item.side !== 'alternate'))
      )
        throw new Error('Dosis finita incompatible: ' + item.id);
      if (
        !Number.isFinite(ref.durationMs) ||
        ref.durationMs <= 0 ||
        ref.durationMs * item.exampleRepetitions > item.workSeconds * 1000
      )
        throw new Error('La secuencia visual no cabe en el trabajo: ' + item.id);
      if (
        item.round > block.rounds ||
        item.round < previousRound ||
        !item.dose.trim() ||
        !item.preparation.trim()
      )
        throw new Error('Ronda o instrucciones inválidas: ' + item.id);
      previousRound = item.round;
      rounds.add(item.round);
      sum += item.demonstrationSeconds + item.workSeconds + item.restSeconds;
      Object.freeze(item);
      return {
        id: item.id,
        exerciseId: item.exerciseId,
        title: ref.name,
        side: item.side,
        demonstrationMs: item.demonstrationSeconds * 1000,
        workMs: item.workSeconds * 1000,
        restMs: item.restSeconds * 1000,
      };
    });
    if (sum !== block.expectedSeconds || rounds.size !== block.rounds)
      throw new Error('Duración/rondas del bloque incorrectas: ' + block.id);
    Object.freeze(block.items);
    Object.freeze(block);
    return items;
  });
  Object.freeze(owned.blocks);
  if (usedResources.size !== resourceIds.size)
    throw new Error('Hay recursos sin usar en la definición.');
  if ([...requiredEquipment].sort().join(',') !== [...owned.equipment].sort().join(','))
    throw new Error('El material no coincide con las fichas utilizadas.');
  Object.freeze(owned.resources);
  Object.freeze(owned.space);
  Object.freeze(owned.equipment);
  Object.freeze(owned.safety);
  Object.freeze(owned);
  const plan = snapshotPlan({
    id: owned.id,
    version: 2,
    title: owned.title,
    purpose: 'training-draft',
    expectedDurationMs: 3600000,
    occurrences,
  });
  return Object.freeze({ workout: owned, plan });
}
