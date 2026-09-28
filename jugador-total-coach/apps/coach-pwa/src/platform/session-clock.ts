import type { CommandResult, SessionAction, SessionProjection } from '@fut360/domain';
import type { SessionEngine } from '@fut360/session-engine';

/** Browser policy separated from the deterministic engine; clock is injectable. */
export class SessionClock {
  private lastMs: number | null = null;
  private sequence = 0;
  private clockValid = true;
  private resourcesReady = true;
  constructor(
    readonly engine: SessionEngine,
    private readonly now: () => number,
    private visible = true,
  ) {
    this.sample();
  }

  sample(): SessionProjection {
    const reading = this.now();
    const time = Math.floor(reading);
    if (!Number.isFinite(reading) || !Number.isSafeInteger(time) || time < 0) {
      this.engine.interrupt('clock-error');
      this.lastMs = null;
      this.clockValid = false;
      return this.engine.project();
    }
    const delta = this.lastMs === null ? 0 : time - this.lastMs;
    this.lastMs = time;
    this.clockValid = delta >= 0;
    if (delta < 0) this.engine.interrupt('clock-error');
    else if (!this.visible) this.engine.interrupt('hidden', delta);
    else if (delta > 2000) this.engine.interrupt('clock-gap', delta);
    else this.engine.advance(delta);
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
    return this.engine.send({
      commandId: this.engine.sessionId + '/ui/' + ++this.sequence,
      sessionId: this.engine.sessionId,
      expectedControlRevision: observed.controlRevision,
      ...(observed.current ? { expectedOccurrenceId: observed.current.id } : {}),
      action: effective,
    });
  }
  setVisible(visible: boolean): SessionProjection {
    this.sample();
    this.visible = visible;
    if (!visible) this.engine.interrupt('hidden');
    return this.engine.project();
  }
  setResourcesReady(ready: boolean): SessionProjection {
    this.sample();
    this.resourcesReady = ready;
    if (!ready) this.engine.interrupt('resource');
    return this.engine.project();
  }
}
