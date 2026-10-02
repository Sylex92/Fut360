/** Executable timing only; this does not approve exercise technique or dosage. */
export interface PlanOccurrence {
  readonly id: string;
  readonly exerciseId: string;
  readonly title: string;
  readonly side: string;
  readonly demonstrationMs: number;
  readonly workMs: number;
  readonly restMs: number;
}
export interface ExecutionPlan {
  readonly id: string;
  readonly version: number;
  readonly title: string;
  readonly purpose: 'technical-test' | 'training-draft';
  readonly expectedDurationMs: number;
  readonly occurrences: readonly PlanOccurrence[];
}
export type SessionStatus =
  'idle' | 'preparing' | 'ready' | 'running' | 'paused' | 'completed' | 'aborted' | 'error';
export type SessionPhase = 'demonstration' | 'work' | 'rest' | 'preparation-extra';
export type PauseReason = 'manual' | 'hidden' | 'clock-gap' | 'clock-error' | 'resource';
export interface SessionCounters {
  baseConsumedMs: number;
  baseOmittedMs: number;
  extraAddedMs: number;
  extraConsumedMs: number;
  extraOmittedMs: number;
  extraCancelledMs: number;
  preparationAddedMs: number;
  preparationConsumedMs: number;
  preparationCancelledMs: number;
  observedPauseMs: number;
  unobservedMs: number;
}
export interface RunOccurrence extends PlanOccurrence {
  readonly kind: 'base' | 'extra';
  readonly sourceOccurrenceId: string;
}
export type SessionAction =
  | { readonly type: 'Prepare' }
  | { readonly type: 'PreparationSucceeded'; readonly plan: ExecutionPlan }
  | { readonly type: 'PreparationFailed'; readonly message: string }
  | { readonly type: 'Start' }
  | { readonly type: 'Pause' }
  | { readonly type: 'Resume'; readonly visible: boolean; readonly resourcesReady: boolean }
  | { readonly type: 'QueueRepeat' }
  | { readonly type: 'CancelQueuedRepeat' }
  | { readonly type: 'SkipCurrentWork' }
  | {
      readonly type: 'ExtendPreparation';
      readonly targetOccurrenceId: string;
      readonly amountMs: 30000 | 60000;
    }
  | { readonly type: 'Abort' }
  | { readonly type: 'Discard' };
export interface SessionCommand {
  readonly commandId: string;
  readonly sessionId: string;
  readonly expectedControlRevision: number;
  readonly expectedOccurrenceId?: string;
  readonly action: SessionAction;
}
export interface CommandResult {
  readonly accepted: boolean;
  readonly reason: string | null;
  readonly controlRevision: number;
}
export interface SessionEvent {
  readonly eventId: string;
  readonly sessionId: string;
  readonly seq: number;
  readonly type: string;
  readonly occurrenceId: string | null;
  readonly logicalMs: number;
  readonly payload: Readonly<Record<string, string | number | boolean | null>>;
}
export interface SessionProjection {
  readonly sessionId: string;
  readonly status: SessionStatus;
  readonly phase: SessionPhase | null;
  readonly controlRevision: number;
  readonly current: RunOccurrence | null;
  readonly next: RunOccurrence | null;
  readonly preparationTarget: RunOccurrence | null;
  readonly startsInMs: number | null;
  readonly resumingWork: boolean;
  readonly phaseElapsedMs: number;
  readonly phaseRemainingMs: number;
  readonly baseDurationMs: number;
  readonly baseRemainingMs: number;
  readonly extraRemainingMs: number;
  readonly preparationRemainingMs: number;
  readonly executionRemainingMs: number;
  readonly recordedMs: number;
  readonly counters: Readonly<SessionCounters>;
  readonly repeatQueued: boolean;
  readonly pauseReason: PauseReason | null;
  readonly error: string | null;
  readonly outcome: 'completed' | 'completed-with-omissions' | null;
  readonly can: Readonly<{
    start: boolean;
    pause: boolean;
    resume: boolean;
    abort: boolean;
    repeat: boolean;
    cancelRepeat: boolean;
    skip: boolean;
    extend: boolean;
  }>;
}

export const occurrenceDuration = (occurrence: PlanOccurrence): number =>
  occurrence.demonstrationMs + occurrence.workMs + occurrence.restMs;

/** Boundary validation and owned, immutable snapshot; no hash or persistence implied. */
export function snapshotPlan(plan: ExecutionPlan): ExecutionPlan {
  if (
    !plan ||
    !plan.id?.trim() ||
    !plan.title?.trim() ||
    !['technical-test', 'training-draft'].includes(plan.purpose) ||
    !Number.isSafeInteger(plan.version) ||
    plan.version < 1 ||
    !Array.isArray(plan.occurrences) ||
    plan.occurrences.length < 1 ||
    plan.occurrences.length > 10000
  )
    throw new Error('Plan técnico inválido o fuera del límite de 10000 ocurrencias.');
  const ids = new Set<string>();
  let total = 0;
  const occurrences = plan.occurrences.map((item) => {
    if (
      !item.id?.trim() ||
      ids.has(item.id) ||
      !item.exerciseId?.trim() ||
      !item.title?.trim() ||
      !item.side?.trim()
    )
      throw new Error('Identidad de ocurrencia inválida o duplicada.');
    ids.add(item.id);
    if (
      ![item.demonstrationMs, item.workMs, item.restMs].every(
        (n) => Number.isSafeInteger(n) && n >= 0,
      ) ||
      item.workMs === 0
    )
      throw new Error(
        'Duraciones inválidas: trabajo positivo y milisegundos enteros seguros.',
      );
    total += occurrenceDuration(item);
    if (!Number.isSafeInteger(total))
      throw new Error('La duración excede los enteros seguros.');
    return Object.freeze({
      id: item.id,
      exerciseId: item.exerciseId,
      title: item.title,
      side: item.side,
      demonstrationMs: item.demonstrationMs,
      workMs: item.workMs,
      restMs: item.restMs,
    });
  });
  if (total !== plan.expectedDurationMs)
    throw new Error('La duración del plan no coincide con sus segmentos.');
  return Object.freeze({
    id: plan.id,
    version: plan.version,
    title: plan.title,
    purpose: plan.purpose,
    expectedDurationMs: total,
    occurrences: Object.freeze(occurrences),
  });
}
