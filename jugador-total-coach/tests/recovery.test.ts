import { describe, expect, it } from 'vitest';
import { SessionEngine } from '../packages/session-engine/src/index';
import type { SessionAction } from '../packages/domain/src/index';
import { shortTechnicalPlan, prepareSession } from '../apps/coach-pwa/src/composition/session';
import {
  exportArchive,
  parseArchive,
  validateRecord,
} from '../apps/coach-pwa/src/platform/training-store';
const create = () => prepareSession(shortTechnicalPlan, 'recover-test', () => 0).engine;
function act(e: SessionEngine, action: SessionAction) {
  const s = e.project();
  return e.send({
    sessionId: e.sessionId,
    commandId: 'command-' + e.exportJournal().entries.length,
    expectedControlRevision: s.controlRevision,
    ...(s.current ? { expectedOccurrenceId: s.current.id } : {}),
    action,
  });
}
function roundtrip(e: SessionEngine) {
  const restored = SessionEngine.fromJournal(JSON.parse(JSON.stringify(e.exportJournal())));
  expect(restored.project()).toEqual(e.project());
  expect(restored.getEvents()).toEqual(e.getEvents());
  return restored;
}
describe('portable recovery', () => {
  it('restores work cursor, queued repeat and added preparation with exact counters', () => {
    const e = create();
    act(e, { type: 'Start' });
    e.advance(6000);
    act(e, { type: 'QueueRepeat' });
    act(e, {
      type: 'ExtendPreparation',
      targetOccurrenceId: e.project().current!.id,
      amountMs: 30000,
    });
    e.advance(2500);
    roundtrip(e);
  });
  it('preserves manual pause and hidden gaps without crediting closed time', () => {
    const e = create();
    act(e, { type: 'Start' });
    for (let i = 0; i < 100; i++) e.advance(10);
    act(e, { type: 'Pause' });
    e.advance(1000);
    e.interrupt('hidden', 60000);
    roundtrip(e);
    expect(e.project().counters.baseConsumedMs).toBe(1000);
    expect(e.exportJournal().entries.length).toBeLessThan(12);
  });
  it('restores repeated pauses without dropping previous interruptions', () => {
    const e = create();
    act(e, { type: 'Start' });
    e.interrupt('manual');
    act(e, { type: 'Pause' });
    roundtrip(e);
  });
  it('does not persist invalid clock-gap numbers into an otherwise valid journal', () => {
    const e = create();
    act(e, { type: 'Start' });
    e.interrupt('clock-error', Number.NaN);
    roundtrip(e);
    expect(e.project().counters.unobservedMs).toBe(0);
  });
  it('round-trips omission, cancellation, abort and completion', () => {
    const e = create();
    act(e, { type: 'Start' });
    e.advance(5000);
    act(e, { type: 'QueueRepeat' });
    act(e, { type: 'SkipCurrentWork' });
    e.advance(100000);
    roundtrip(e);
    const b = create();
    act(b, { type: 'Start' });
    b.advance(1200);
    act(b, { type: 'Abort' });
    roundtrip(b);
  });
  it('recovery constructor does not auto-resume or consume missing time', () => {
    const e = create();
    act(e, { type: 'Start' });
    e.advance(10000);
    const restored = roundtrip(e);
    restored.interrupt('resource');
    expect(restored.project().status).toBe('paused');
    expect(restored.project().phaseElapsedMs).toBe(5000);
  });
  it('rejects malformed and future logs', () => {
    expect(() =>
      SessionEngine.fromJournal({ version: 2, sessionId: 'x', entries: [] }),
    ).toThrow();
    expect(() =>
      SessionEngine.fromJournal({
        version: 1,
        sessionId: 'x',
        entries: [{ kind: 'advance', ms: -1 }],
      }),
    ).toThrow();
    expect(() =>
      SessionEngine.fromJournal({
        version: 1,
        sessionId: 'x',
        entries: [
          {
            kind: 'command',
            command: {
              commandId: 'x',
              sessionId: 'x',
              expectedControlRevision: 0,
              action: { type: 'invented' },
            },
          },
        ],
      }),
    ).toThrow();
  });
  it('validates portable archive and rejects duplicate identity and invalid feedback', () => {
    const e = create();
    act(e, { type: 'Start' });
    e.advance(1000);
    act(e, { type: 'Abort' });
    const record = {
      id: e.sessionId,
      startedAt: '2026-10-02T00:00:00Z',
      updatedAt: '2026-10-02T00:00:01Z',
      contentStamp: 'fixture',
      journal: e.exportJournal(),
      test: true,
      feedback: null,
    };
    expect(parseArchive(exportArchive([record]))).toEqual([record]);
    expect(() => parseArchive(exportArchive([record, record]))).toThrow();
    expect(() =>
      validateRecord({
        ...record,
        feedback: { rpe: 11, kneeBefore: null, kneeAfter: null, notes: '' },
      }),
    ).toThrow();
    expect(() => parseArchive('{"formatVersion":2,"records":[]}')).toThrow();
  });
});
