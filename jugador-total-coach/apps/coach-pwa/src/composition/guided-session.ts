import type { ExecutionPlan, SessionAction } from '@fut360/domain';
import { SessionEngine } from '@fut360/session-engine';
import type { SessionJournal } from '@fut360/session-engine';
import { SessionClock } from '../platform/session-clock';
import { prepareSession } from './session';
export class GuidedSession {
  readonly clock: SessionClock;
  constructor(
    plan: ExecutionPlan,
    now: () => number,
    visible = true,
    rate: 1 | 60 = 1,
    journal?: SessionJournal,
  ) {
    if (journal) {
      const prepared = journal.entries.find(
        (entry) =>
          entry.kind === 'command' && entry.command.action.type === 'PreparationSucceeded',
      );
      if (
        !prepared ||
        prepared.kind !== 'command' ||
        prepared.command.action.type !== 'PreparationSucceeded' ||
        JSON.stringify(prepared.command.action.plan) !== JSON.stringify(plan)
      )
        throw new Error('El progreso pertenece a otra propuesta o versión.');
    }
    this.clock = journal
      ? new SessionClock(SessionEngine.fromJournal(journal), now, visible, rate)
      : prepareSession(
          plan,
          'guided-' + Date.now() + '-' + Math.random().toString(36).slice(2),
          now,
          visible,
          rate,
        );
    if (journal) this.clock.engine.interrupt('resource');
  }
  snapshot() {
    return { session: this.clock.engine.project() };
  }
  sample() {
    this.clock.sample();
    return this.snapshot();
  }
  act(action: SessionAction) {
    return this.clock.dispatch(action);
  }
  setVisible(visible: boolean) {
    this.clock.setVisible(visible);
  }
  exportJournal() {
    return this.clock.engine.exportJournal();
  }
}
