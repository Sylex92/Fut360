import type { CommandResult, SessionAction, SessionProjection } from '@fut360/domain';
import type { SessionEngine } from '@fut360/session-engine';

/** Browser policy separated from the deterministic engine; clock is injectable. */
export class SessionClock {
  private lastMs: number | null = null;
  private sequence = 0;
  private clockValid = true;
  private resourcesReady = true;
  private resumeOnVisible = false;
  constructor(
    readonly engine: SessionEngine,
    private readonly now: () => number,
    private visible = true,
    private readonly testRate = 1,
  ) {
    if (![1, 60].includes(testRate)) throw new Error('Velocidad de prueba no admitida.');
    this.sample();
  }

  sample(): SessionProjection {
    const reading = this.now();
    const time = Math.floor(reading);
    if (!Number.isFinite(reading) || !Number.isSafeInteger(time) || time < 0) {
      this.resumeOnVisible = false;
      this.engine.interrupt('clock-error');
      this.lastMs = null;
      this.clockValid = false;
      return this.engine.project();
    }
    const delta = this.lastMs === null ? 0 : time - this.lastMs;
    this.lastMs = time;
    this.clockValid = delta >= 0;
    if (delta < 0) {
      this.resumeOnVisible = false;
      this.engine.interrupt('clock-error');
    } else if (!this.visible) {
      // Hidden time must not replace a manual pause or a resource/clock failure.
      this.engine.interrupt(this.engine.project().pauseReason ?? 'hidden', delta);
    } else if (delta > 2000) {
      this.resumeOnVisible = false;
      this.engine.interrupt('clock-gap', delta);
    } else this.engine.advance(delta * this.testRate);
    return this.engine.project();
  }
  dispatch(action: SessionAction, observed = this.engine.project()): CommandResult {
    this.sample();
    if (action.type === 'Start' && (!this.visible || !this.resourcesReady || !this.clockValid))
      return {
        accepted: false,
        reason: 'La página, el reloj y los recursos deben estar disponibles.',
        controlRevision: this.engine.project().controlRevision,
      };
    const effective =
      action.type === 'Resume'
        ? {
            type: 'Resume' as const,
            visible: this.visible,
            resourcesReady: this.resourcesReady && this.clockValid,
          }
        : action;
    const result = this.engine.send({
      commandId: this.engine.sessionId + '/ui/' + ++this.sequence,
      sessionId: this.engine.sessionId,
      expectedControlRevision: observed.controlRevision,
      ...(observed.current ? { expectedOccurrenceId: observed.current.id } : {}),
      action: effective,
    });
    if (
      result.accepted &&
      (action.type === 'Pause' || action.type === 'Abort' || action.type === 'Resume')
    )
      this.resumeOnVisible = false;
    return result;
  }
  setVisible(visible: boolean): SessionProjection {
    const state = this.sample();
    if (visible === this.visible) return state;
    this.visible = visible;
    if (!visible) {
      this.resumeOnVisible =
        state.status === 'running' && this.resourcesReady && this.clockValid;
      if (state.status === 'running') this.engine.interrupt('hidden');
    } else {
      const resume =
        this.resumeOnVisible &&
        state.status === 'paused' &&
        state.pauseReason === 'hidden' &&
        this.resourcesReady &&
        this.clockValid;
      this.resumeOnVisible = false;
      if (resume)
        this.dispatch({ type: 'Resume', visible: true, resourcesReady: true }, state);
    }
    return this.engine.project();
  }
  setResourcesReady(ready: boolean): SessionProjection {
    this.sample();
    this.resourcesReady = ready;
    if (!ready) {
      this.resumeOnVisible = false;
      this.engine.interrupt('resource');
    }
    return this.engine.project();
  }
}
