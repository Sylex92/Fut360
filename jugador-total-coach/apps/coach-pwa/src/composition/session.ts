import { snapshotPlan } from '@fut360/domain';
import type { ExecutionPlan } from '@fut360/domain';
import { SessionEngine } from '@fut360/session-engine';
import { SessionClock } from '../platform/session-clock';

export const shortTechnicalPlan = snapshotPlan({
  id: 'clock-check-60s',
  version: 1,
  title: 'Prueba de un minuto',
  purpose: 'technical-test',
  expectedDurationMs: 60000,
  occurrences: [
    {
      id: 'step-a',
      exerciseId: 'technical-a',
      title: 'Paso A',
      side: 'none',
      demonstrationMs: 5000,
      workMs: 10000,
      restMs: 15000,
    },
    {
      id: 'step-b',
      exerciseId: 'technical-b',
      title: 'Paso B',
      side: 'none',
      demonstrationMs: 5000,
      workMs: 20000,
      restMs: 5000,
    },
  ],
});

export function prepareSession(
  plan: ExecutionPlan,
  sessionId: string,
  now: () => number,
  visible = true,
  testRate = 1,
): SessionClock {
  const engine = new SessionEngine(sessionId);
  engine.send({
    commandId: 'prepare',
    sessionId,
    expectedControlRevision: 0,
    action: { type: 'Prepare' },
  });
  engine.send({
    commandId: 'prepared',
    sessionId,
    expectedControlRevision: engine.project().controlRevision,
    action: { type: 'PreparationSucceeded', plan },
  });
  return new SessionClock(engine, now, visible, testRate);
}
