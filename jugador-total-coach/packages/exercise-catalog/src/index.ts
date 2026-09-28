import { Ajv2020 } from 'ajv/dist/2020.js';
import type { ErrorObject } from 'ajv';
import { summarizeWorkout } from '@fut360/domain';
import type { WorkoutSummary, WorkoutV1 } from '@fut360/domain';
import schema from '../../../content/schemas/workout.schema.json';

export interface ContentIssue {
  readonly path: string;
  readonly message: string;
}
export type WorkoutValidation =
  | { readonly ok: true; readonly workout: WorkoutV1; readonly summary: WorkoutSummary }
  | { readonly ok: false; readonly issues: readonly ContentIssue[] };

const ajv = new Ajv2020({ allErrors: true, strict: true, ownProperties: true });
const validateStructure = ajv.compile<WorkoutV1>(schema);

function describeSchemaError(error: ErrorObject): ContentIssue {
  const messages: Record<string, string> = {
    required: 'Falta un campo obligatorio.',
    additionalProperties: 'El formato no admite este campo adicional.',
    type: 'El valor no tiene el tipo esperado.',
    enum: 'El valor no pertenece a las opciones admitidas.',
    minimum: 'El número está por debajo del mínimo permitido.',
    minItems: 'La lista debe contener al menos un elemento.',
    pattern: 'El identificador tiene un formato inválido.',
  };
  const field: unknown = error.params['missingProperty'] ?? error.params['additionalProperty'];
  return {
    path: (error.instancePath || '') + (typeof field === 'string' ? '/' + field : '') || '/',
    message: messages[error.keyword] ?? 'El valor no cumple el esquema de contenido.',
  };
}

/** Validates data, not coaching quality, referenced assets or personal suitability. */
export function validateWorkoutV1(input: unknown): WorkoutValidation {
  if (!validateStructure(input)) {
    return { ok: false, issues: (validateStructure.errors ?? []).map(describeSchemaError) };
  }
  const issues: ContentIssue[] = [];
  const add = (path: string, message: string) => issues.push({ path, message });
  if (input.version !== 1) add('/version', 'Esta base solo admite el formato histórico v1.');
  if (!input.displayName.trim()) add('/displayName', 'El nombre no puede estar vacío.');
  for (const dimension of ['widthM', 'lengthM'] as const) {
    if (!Number.isFinite(input.space[dimension]) || input.space[dimension] <= 0) {
      add('/space/' + dimension, 'La dimensión debe ser finita y mayor que cero.');
    }
  }
  const seenBlocks = new Set<string>();
  input.blocks.forEach((block, index) => {
    const path = '/blocks/' + index;
    if (!block.id.trim() || seenBlocks.has(block.id)) {
      add(path + '/id', 'Cada bloque necesita un identificador no vacío y único.');
    }
    seenBlocks.add(block.id);
    if (!block.displayName.trim())
      add(path + '/displayName', 'El nombre no puede estar vacío.');
    if (!Number.isSafeInteger(block.rounds))
      add(path + '/rounds', 'Las rondas exceden el rango de enteros seguros.');
    block.items.forEach((item, itemIndex) => {
      const itemPath = path + '/items/' + itemIndex;
      if (!item.exerciseId.trim())
        add(itemPath + '/exerciseId', 'Falta el identificador del ejercicio.');
      for (const field of ['workSeconds', 'restSeconds'] as const) {
        if (!Number.isSafeInteger(item[field]))
          add(itemPath + '/' + field, 'La duración excede el rango de enteros seguros.');
      }
    });
  });
  if (!Number.isSafeInteger(input.expectedDurationSeconds)) {
    add(
      '/expectedDurationSeconds',
      'La duración declarada excede el rango de enteros seguros.',
    );
  }
  if (issues.length) return { ok: false, issues };
  const summary = summarizeWorkout(input);
  if (
    ![
      summary.workSeconds,
      summary.restSeconds,
      summary.totalSeconds,
      summary.occurrences,
    ].every(Number.isSafeInteger)
  ) {
    add('/blocks', 'La suma o expansión excede el rango de enteros seguros.');
  } else if (summary.totalSeconds !== input.expectedDurationSeconds) {
    add(
      '/expectedDurationSeconds',
      'Se declaran ' +
        input.expectedDurationSeconds +
        ' s, pero los bloques suman ' +
        summary.totalSeconds +
        ' s.',
    );
  }
  return issues.length ? { ok: false, issues } : { ok: true, workout: input, summary };
}
