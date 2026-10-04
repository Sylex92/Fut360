import { occurrenceDuration, snapshotPlan } from '@fut360/domain';
import type {
  CommandResult,
  ExecutionPlan,
  PauseReason,
  RunOccurrence,
  SessionCommand,
  SessionCounters,
  SessionEvent,
  SessionPhase,
  SessionProjection,
  SessionStatus,
} from '@fut360/domain';

const emptyCounters = (): SessionCounters => ({
  baseConsumedMs: 0,
  baseOmittedMs: 0,
  extraAddedMs: 0,
  extraConsumedMs: 0,
  extraOmittedMs: 0,
  extraCancelledMs: 0,
  preparationAddedMs: 0,
  preparationConsumedMs: 0,
  preparationCancelledMs: 0,
  observedPauseMs: 0,
  unobservedMs: 0,
});
const phases = ['demonstration', 'work', 'rest'] as const;
type Preparation = {
  targetId: string;
  remainingMs: number;
  consumedMs: number;
  active: boolean;
};

export type SessionJournalEntry =
  | { kind: 'advance'; ms: number }
  | { kind: 'interrupt'; reason: PauseReason; ms: number }
  | { kind: 'command'; command: SessionCommand };

/** Portable input log. Adjacent clock samples are coalesced, never animation frames. */
export interface SessionJournal {
  version: 1;
  sessionId: string;
  entries: SessionJournalEntry[];
}

/** Deterministic session state. All time is supplied explicitly by a caller. */
export class SessionEngine {
  private status: SessionStatus = 'idle';
  private plan: ExecutionPlan | null = null;
  private runs: RunOccurrence[] = [];
  private index = 0;
  private phaseIndex = 0;
  private elapsedMs = 0;
  private segmentStarted = false;
  private revision = 0;
  private repeatSequence = 0;
  private queuedId: string | null = null;
  private preparation: Preparation | null = null;
  private counters = emptyCounters();
  private pauseReason: PauseReason | null = null;
  private error: string | null = null;
  private readonly events: SessionEvent[] = [];
  private readonly commands = new Map<string, CommandResult>();
  private readonly journal: SessionJournalEntry[] = [];

  exportJournal(): SessionJournal {
    return structuredClone({ version: 1, sessionId: this.sessionId, entries: this.journal });
  }

  static fromJournal(value: unknown): SessionEngine {
    if (!value || typeof value !== 'object') throw new Error('Registro inválido.');
    const log = value as SessionJournal;
    if (
      log.version !== 1 ||
      typeof log.sessionId !== 'string' ||
      log.sessionId.length > 200 ||
      !Array.isArray(log.entries) ||
      log.entries.length > 100000
    )
      throw new Error('Versión o tamaño de registro no admitido.');
    const engine = new SessionEngine(log.sessionId);
    const actions = [
      'Prepare',
      'PreparationSucceeded',
      'PreparationFailed',
      'Start',
      'Pause',
      'Resume',
      'QueueRepeat',
      'CancelQueuedRepeat',
      'SkipCurrentWork',
      'ExtendPreparation',
      'Abort',
      'Discard',
    ];
    for (const entry of log.entries) {
      if (!entry || typeof entry !== 'object') throw new Error('Evento inválido.');
      if (entry.kind === 'advance' || entry.kind === 'interrupt') {
        if (!Number.isSafeInteger(entry.ms) || entry.ms < 0 || entry.ms > 31536000000)
          throw new Error('Tiempo fuera de límites.');
        if (entry.kind === 'advance') engine.advance(entry.ms);
        else {
          if (
            !['manual', 'hidden', 'clock-gap', 'clock-error', 'resource'].includes(
              entry.reason,
            )
          )
            throw new Error('Motivo de pausa no admitido.');
          engine.interrupt(entry.reason, entry.ms);
        }
      } else if (entry.kind === 'command') {
        const c = entry.command;
        if (
          !c ||
          typeof c.commandId !== 'string' ||
          c.commandId.length > 300 ||
          c.sessionId !== log.sessionId ||
          !Number.isSafeInteger(c.expectedControlRevision) ||
          !c.action ||
          !actions.includes(c.action.type)
        )
          throw new Error('Comando inválido.');
        if (c.action.type === 'PreparationSucceeded') snapshotPlan(c.action.plan);
        if (c.action.type === 'PreparationFailed' && typeof c.action.message !== 'string')
          throw new Error('Mensaje inválido.');
        if (
          c.action.type === 'Resume' &&
          (typeof c.action.visible !== 'boolean' ||
            typeof c.action.resourcesReady !== 'boolean')
        )
          throw new Error('Continuidad inválida.');
        if (!engine.send(c).accepted) throw new Error('Registro inconsistente.');
      } else throw new Error('Evento desconocido.');
    }
    return engine;
  }

  constructor(readonly sessionId: string) {
    if (!sessionId.trim()) throw new Error('Falta identidad de sesión.');
  }
  private current(): RunOccurrence | null {
    return this.runs[this.index] ?? null;
  }
  private phase(): 'demonstration' | 'work' | 'rest' {
    return phases[this.phaseIndex] ?? 'work';
  }
  private duration(): number {
    const current = this.current();
    if (!current) return 0;
    return this.phase() === 'demonstration'
      ? current.demonstrationMs
      : this.phase() === 'work'
        ? current.workMs
        : current.restMs;
  }
  private active(): boolean {
    return this.status === 'running' || this.status === 'paused';
  }
  private terminal(): boolean {
    return this.status === 'completed' || this.status === 'aborted';
  }
  private recordedMs(): number {
    return (
      this.counters.baseConsumedMs +
      this.counters.extraConsumedMs +
      this.counters.preparationConsumedMs +
      this.counters.observedPauseMs
    );
  }
  private emit(
    type: string,
    payload: SessionEvent['payload'] = {},
    occurrenceId = this.current()?.id ?? null,
  ): void {
    const seq = this.events.length + 1;
    this.events.push(
      Object.freeze({
        eventId: this.sessionId + ':' + seq,
        sessionId: this.sessionId,
        seq,
        type,
        occurrenceId,
        logicalMs: this.recordedMs(),
        payload: Object.freeze({ ...payload }),
      }),
    );
  }
  getEvents(afterSeq = 0): readonly SessionEvent[] {
    return Object.freeze(this.events.slice(afterSeq));
  }
  private target(): RunOccurrence | null {
    if (!this.active()) return null;
    if (this.preparation?.active) return this.current();
    return this.phase() === 'rest' ? (this.runs[this.index + 1] ?? null) : this.current();
  }
  private retargetPreparation(): void {
    if (!this.preparation || this.preparation.active) return;
    const target = this.target();
    if (!target) {
      this.cancelPreparation();
      return;
    }
    if (this.preparation.targetId !== target.id) {
      this.preparation.targetId = target.id;
      this.emit('PreparationRetargeted', {
        targetOccurrenceId: target.id,
        remainingMs: this.preparation.remainingMs,
      });
    }
  }
  private cancelPreparation(): void {
    if (!this.preparation) return;
    this.counters.preparationCancelledMs += this.preparation.remainingMs;
    this.emit('PreparationCancelled', {
      remainingMs: this.preparation.remainingMs,
      targetOccurrenceId: this.preparation.targetId,
    });
    this.preparation = null;
  }
  private enterSegment(): void {
    // Zero-length demonstration/rest never start; a positive work always terminates this loop.
    while (this.current()) {
      if (this.duration() > 0) {
        if (
          this.phase() === 'work' &&
          this.preparation &&
          this.preparation.targetId === this.current()?.id
        ) {
          this.preparation.active = true;
          this.emit('PreparationStarted', { remainingMs: this.preparation.remainingMs });
        } else {
          this.segmentStarted = true;
          this.emit('SegmentStarted', {
            phase: this.phase(),
            segmentId: this.current()?.id + ':' + this.phase(),
          });
        }
        return;
      }
      this.phaseIndex++;
      if (this.phaseIndex > 2) this.nextOccurrence();
    }
    this.complete();
  }
  private nextOccurrence(): void {
    this.index++;
    this.phaseIndex = 0;
    this.elapsedMs = 0;
    this.segmentStarted = false;
    this.queuedId = null;
  }
  private finishSegment(): void {
    this.emit('SegmentFinished', {
      phase: this.phase(),
      segmentId: this.current()?.id + ':' + this.phase(),
      durationMs: this.duration(),
    });
    this.revision++;
    this.phaseIndex++;
    this.elapsedMs = 0;
    this.segmentStarted = false;
    if (this.phaseIndex > 2) this.nextOccurrence();
    this.enterSegment();
  }
  private complete(): void {
    if (this.terminal()) return;
    this.status = 'completed';
    this.pauseReason = null;
    this.revision++;
    this.emit('SessionCompleted', {
      withOmissions: this.counters.baseOmittedMs + this.counters.extraOmittedMs > 0,
    });
  }
  /** Trusted elapsed time; browser suspension must be filtered by the adapter first. */
  advance(deltaMs: number): void {
    if (!this.active()) return;
    if (
      !Number.isSafeInteger(deltaMs) ||
      deltaMs < 0 ||
      !Number.isSafeInteger(this.recordedMs() + deltaMs)
    ) {
      this.interrupt('clock-error');
      return;
    }
    if (deltaMs > 0) {
      const last = this.journal.at(-1);
      if (last?.kind === 'advance') last.ms += deltaMs;
      else this.journal.push({ kind: 'advance', ms: deltaMs });
    }
    if (this.status === 'paused') {
      this.counters.observedPauseMs += deltaMs;
      return;
    }
    let remaining = deltaMs;
    while (remaining > 0 && this.status === 'running') {
      if (this.preparation?.active) {
        const amount = Math.min(remaining, this.preparation.remainingMs);
        this.preparation.remainingMs -= amount;
        this.preparation.consumedMs += amount;
        this.counters.preparationConsumedMs += amount;
        remaining -= amount;
        if (this.preparation.remainingMs === 0) {
          this.emit('PreparationFinished', { consumedMs: this.preparation.consumedMs });
          this.preparation = null;
          this.revision++;
          if (!this.segmentStarted) {
            this.segmentStarted = true;
            this.emit('SegmentStarted', {
              phase: 'work',
              segmentId: this.current()?.id + ':work',
            });
          } else this.emit('WorkResumed', { cursorMs: this.elapsedMs });
        }
      } else {
        const amount = Math.min(remaining, this.duration() - this.elapsedMs);
        this.elapsedMs += amount;
        if (this.current()?.kind === 'base') this.counters.baseConsumedMs += amount;
        else this.counters.extraConsumedMs += amount;
        remaining -= amount;
        if (this.elapsedMs === this.duration()) this.finishSegment();
      }
    }
  }
  interrupt(reason: PauseReason, unobservedMs = 0): void {
    if (!this.active()) return;
    if (
      !Number.isSafeInteger(unobservedMs) ||
      unobservedMs < 0 ||
      !Number.isSafeInteger(this.counters.unobservedMs + unobservedMs)
    )
      unobservedMs = 0;
    if (this.status !== 'paused' || this.pauseReason !== reason || unobservedMs > 0)
      this.journal.push({ kind: 'interrupt', reason, ms: unobservedMs });
    if (
      Number.isSafeInteger(unobservedMs) &&
      unobservedMs > 0 &&
      Number.isSafeInteger(this.counters.unobservedMs + unobservedMs)
    ) {
      this.counters.unobservedMs += unobservedMs;
      this.emit('ClockGapDetected', { unobservedMs });
    }
    if (this.status !== 'paused' || this.pauseReason !== reason) {
      this.status = 'paused';
      this.pauseReason = reason;
      this.revision++;
      this.emit('SessionPaused', { reason, cursorMs: this.elapsedMs });
    }
  }
  private cancelRepeat(): void {
    if (!this.queuedId) return;
    const next = this.runs[this.index + 1];
    if (next?.id === this.queuedId) {
      this.counters.extraCancelledMs += occurrenceDuration(next);
      this.runs.splice(this.index + 1, 1);
      this.emit('RepeatCancelled', { cancelledOccurrenceId: next.id });
    }
    this.queuedId = null;
    this.retargetPreparation();
  }
  send(command: SessionCommand): CommandResult {
    const result = (accepted: boolean, reason: string | null): CommandResult =>
      Object.freeze({ accepted, reason, controlRevision: this.revision });
    if (command.sessionId !== this.sessionId || !command.commandId.trim())
      return result(false, 'Comando de otra sesión o sin identidad.');
    const previous = this.commands.get(command.commandId);
    if (previous) return previous;
    const reject = (reason: string): CommandResult => {
      const rejected = result(false, reason);
      this.commands.set(command.commandId, rejected);
      return rejected;
    };
    const action = command.action;
    if (this.terminal()) return reject('La sesión ya terminó.');
    const tolerant = ['Pause', 'Abort', 'ExtendPreparation'].includes(action.type);
    if (!tolerant && command.expectedControlRevision !== this.revision)
      return reject('La vista cambió; revisa el estado actual.');
    if (
      ['QueueRepeat', 'CancelQueuedRepeat', 'SkipCurrentWork'].includes(action.type) &&
      command.expectedOccurrenceId !== this.current()?.id
    )
      return reject('La ocurrencia indicada ya no es la actual.');
    const journalStart = this.journal.length;
    switch (action.type) {
      case 'Prepare':
        if (this.status !== 'idle' && this.status !== 'error')
          return reject('La preparación no está disponible.');
        this.status = 'preparing';
        this.error = null;
        break;
      case 'PreparationSucceeded': {
        if (this.status !== 'preparing') return reject('No se está preparando el plan.');
        try {
          this.plan = snapshotPlan(action.plan);
        } catch (error) {
          this.status = 'error';
          this.error = error instanceof Error ? error.message : 'Plan inválido.';
          this.emit('PreparationFailed', { message: this.error });
          break;
        }
        this.runs = this.plan.occurrences.map((item) =>
          Object.freeze({ ...item, kind: 'base', sourceOccurrenceId: item.id }),
        );
        this.status = 'ready';
        break;
      }
      case 'PreparationFailed':
        if (this.status !== 'preparing') return reject('No se está preparando el plan.');
        this.status = 'error';
        this.error = action.message;
        this.emit('PreparationFailed', { message: action.message });
        break;
      case 'Discard':
        if (this.status !== 'error')
          return reject('Solo se descarta una preparación fallida.');
        this.status = 'idle';
        this.plan = null;
        this.runs = [];
        this.error = null;
        break;
      case 'Start':
        if (this.status !== 'ready') return reject('El plan aún no está listo.');
        this.status = 'running';
        this.emit('SessionStarted');
        this.enterSegment();
        break;
      case 'Pause':
        if (!this.active()) return reject('No hay sesión en curso.');
        this.interrupt('manual');
        break;
      case 'Resume':
        if (this.status !== 'paused' || !action.visible || !action.resourcesReady)
          return reject('Continuar requiere página visible y recursos listos.');
        this.status = 'running';
        this.pauseReason = null;
        this.emit('SessionResumed', { cursorMs: this.elapsedMs });
        break;
      case 'QueueRepeat': {
        if (!this.active() || this.preparation?.active || this.queuedId)
          return reject('No se puede añadir otra repetición ahora.');
        const current = this.current();
        if (
          !current ||
          this.runs.length >= 10000 ||
          !Number.isSafeInteger(
            (this.plan?.expectedDurationMs ?? 0) +
              this.counters.extraAddedMs +
              this.counters.preparationAddedMs +
              occurrenceDuration(current),
          )
        )
          return reject('Límite de ejecución alcanzado.');
        let id: string;
        do {
          id = JSON.stringify(['extra', ++this.repeatSequence, current.sourceOccurrenceId]);
        } while (this.runs.some((run) => run.id === id));
        const copy = Object.freeze({ ...current, kind: 'extra' as const, id });
        this.runs.splice(this.index + 1, 0, copy);
        this.queuedId = copy.id;
        this.counters.extraAddedMs += occurrenceDuration(copy);
        this.emit('RepeatQueued', {
          extraOccurrenceId: copy.id,
          durationMs: occurrenceDuration(copy),
        });
        this.retargetPreparation();
        break;
      }
      case 'CancelQueuedRepeat':
        if (!this.active() || !this.queuedId) return reject('No hay repetición pendiente.');
        this.cancelRepeat();
        break;
      case 'SkipCurrentWork': {
        if (!this.active() || this.phase() !== 'work' || this.preparation?.active)
          return reject('Solo puede omitirse el trabajo actual.');
        const omittedMs = this.duration() - this.elapsedMs;
        if (this.current()?.kind === 'base') this.counters.baseOmittedMs += omittedMs;
        else this.counters.extraOmittedMs += omittedMs;
        this.emit('WorkSkipped', { omittedMs });
        this.cancelRepeat();
        this.finishSegment();
        break;
      }
      case 'ExtendPreparation': {
        const target = this.target();
        if (
          !target ||
          target.id !== action.targetOccurrenceId ||
          ![30000, 60000].includes(action.amountMs)
        )
          return reject('El objetivo de preparación ya cambió.');
        if (
          !Number.isSafeInteger(
            (this.plan?.expectedDurationMs ?? 0) +
              this.counters.extraAddedMs +
              this.counters.preparationAddedMs +
              action.amountMs,
          )
        )
          return reject('La preparación excede los enteros seguros.');
        this.preparation ??= {
          targetId: target.id,
          remainingMs: 0,
          consumedMs: 0,
          active: false,
        };
        this.preparation.remainingMs += action.amountMs;
        this.counters.preparationAddedMs += action.amountMs;
        this.emit('PreparationExtended', {
          targetOccurrenceId: target.id,
          amountMs: action.amountMs,
        });
        if (this.phase() === 'work' && !this.preparation.active) {
          this.preparation.active = true;
          this.emit('PreparationStarted', {
            remainingMs: this.preparation.remainingMs,
            returnCursorMs: this.elapsedMs,
          });
        }
        break;
      }
      case 'Abort':
        if (this.status !== 'ready' && !this.active())
          return reject('No hay una sesión preparada o en curso.');
        this.cancelPreparation();
        this.counters.extraCancelledMs =
          this.counters.extraAddedMs -
          this.counters.extraConsumedMs -
          this.counters.extraOmittedMs;
        this.queuedId = null;
        this.status = 'aborted';
        this.pauseReason = null;
        this.emit('SessionAborted');
        break;
    }
    this.revision++;
    const accepted = result(true, null);
    this.commands.set(command.commandId, accepted);
    // Pause already records its internal interruption. Keep only the command so replay
    // preserves the original expected revision and the exact event sequence.
    if (action.type === 'Pause') this.journal.splice(journalStart);
    this.journal.push({ kind: 'command', command: structuredClone(command) });
    return accepted;
  }
  project(): SessionProjection {
    const current = this.current();
    const next = this.runs[this.index + 1] ?? null;
    const extraRemainingMs =
      this.counters.extraAddedMs -
      this.counters.extraConsumedMs -
      this.counters.extraOmittedMs -
      this.counters.extraCancelledMs;
    const preparationRemainingMs =
      this.counters.preparationAddedMs -
      this.counters.preparationConsumedMs -
      this.counters.preparationCancelledMs;
    const baseDurationMs = this.plan?.expectedDurationMs ?? 0;
    const baseRemainingMs =
      baseDurationMs - this.counters.baseConsumedMs - this.counters.baseOmittedMs;
    const phase: SessionPhase | null = this.active()
      ? this.preparation?.active
        ? 'preparation-extra'
        : this.phase()
      : null;
    const preparationTarget = this.target();
    let startsInMs: number | null = null;
    if (phase === 'preparation-extra') startsInMs = preparationRemainingMs;
    else if (phase === 'demonstration')
      startsInMs = this.duration() - this.elapsedMs + preparationRemainingMs;
    else if (phase === 'rest' && next)
      startsInMs =
        this.duration() - this.elapsedMs + next.demonstrationMs + preparationRemainingMs;
    return Object.freeze({
      sessionId: this.sessionId,
      status: this.status,
      phase,
      controlRevision: this.revision,
      current,
      next,
      preparationTarget,
      startsInMs,
      resumingWork: !!this.preparation?.active && this.segmentStarted,
      phaseElapsedMs: this.preparation?.active ? this.preparation.consumedMs : this.elapsedMs,
      phaseRemainingMs: this.preparation?.active
        ? this.preparation.remainingMs
        : Math.max(0, this.duration() - this.elapsedMs),
      baseDurationMs,
      baseRemainingMs,
      extraRemainingMs,
      preparationRemainingMs,
      executionRemainingMs: baseRemainingMs + extraRemainingMs + preparationRemainingMs,
      recordedMs: this.recordedMs(),
      counters: Object.freeze({ ...this.counters }),
      repeatQueued: this.queuedId !== null,
      pauseReason: this.pauseReason,
      error: this.error,
      outcome:
        this.status === 'completed'
          ? this.counters.baseOmittedMs + this.counters.extraOmittedMs > 0
            ? 'completed-with-omissions'
            : 'completed'
          : null,
      can: Object.freeze({
        start: this.status === 'ready',
        pause: this.status === 'running',
        resume: this.status === 'paused',
        abort: this.status === 'ready' || this.active(),
        repeat: this.active() && !this.preparation?.active && !this.queuedId,
        cancelRepeat: this.active() && !!this.queuedId,
        skip: this.active() && phase === 'work',
        extend: this.active() && !!preparationTarget,
      }),
    });
  }
}
