import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { SessionEngine } from '@fut360/session-engine';
import type { HourWorkout } from '../composition/hour-workout';
import { hourWorkout } from '../composition/hour-workout';
import { trainingStore } from '../platform/training-store';
import type {
  StoredTraining,
  TrainingFeedback,
  TrainingRecord,
} from '../platform/training-store';

export const contentStamp = JSON.stringify(hourWorkout);
export function useTrainingHistory(controller: RefObject<HourWorkout | null>, test: boolean) {
  const owner = useRef('window-' + Math.random().toString(36).slice(2));
  const known = useRef(new Map<string, StoredTraining>());
  const savedJournals = useRef(new Map<string, string>());
  const queue = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [records, setRecords] = useState<StoredTraining[]>([]);
  const [recovery, setRecovery] = useState<StoredTraining | null>(null);
  const [unsaved, setUnsaved] = useState<TrainingRecord | null>(null);
  const refresh = useCallback(async () => {
    const rows = await trainingStore.list();
    known.current = new Map(rows.map((r) => [r.record.id, r]));
    setRecords(rows);
    return rows;
  }, []);
  useEffect(() => {
    let mounted = true;
    void refresh()
      .then((rows) => {
        if (!mounted) return;
        setRecovery(
          rows.find((r) =>
            ['running', 'paused'].includes(
              SessionEngine.fromJournal(r.record.journal).project().status,
            ),
          ) ?? null,
        );
        setReady(true);
      })
      .catch(() => {
        if (mounted) setError('No se pudo leer el guardado local. Recarga antes de iniciar.');
      });
    return () => {
      mounted = false;
    };
  }, [refresh]);
  const save = useCallback(
    (target = controller.current, feedback?: TrainingFeedback) => {
      if (!target) return Promise.resolve(false);
      const journal = target.exportJournal();
      const s = target.snapshot().session;
      if (!['running', 'paused', 'completed', 'aborted'].includes(s.status))
        return Promise.resolve(false);
      const updatedAt = new Date().toISOString();
      let saved = false;
      let candidate: TrainingRecord | null = null;
      const work = queue.current.then(async () => {
        const previous = known.current.get(s.sessionId);
        const journalText = JSON.stringify(journal);
        if (
          feedback === undefined &&
          (savedJournals.current.get(s.sessionId) === journalText ||
            (previous && JSON.stringify(previous.record.journal) === journalText))
        )
          return;
        const record: TrainingRecord = {
          id: s.sessionId,
          startedAt: previous?.record.startedAt ?? updatedAt,
          updatedAt,
          contentStamp,
          journal,
          test,
          feedback: feedback ?? previous?.record.feedback ?? null,
        };
        candidate = record;
        const revision = await trainingStore.save(
          record,
          owner.current,
          previous?.revision ?? 0,
        );
        saved = true;
        savedJournals.current.set(record.id, journalText);
        setUnsaved(null);
        known.current.set(record.id, { record, revision, owner: owner.current });
        setSavedAt(updatedAt);
        setError('');
        setRecords(
          [...known.current.values()].sort((a, b) =>
            b.record.updatedAt.localeCompare(a.record.updatedAt),
          ),
        );
      });
      queue.current = work.catch((e) => {
        target.act({ type: 'Pause' });
        setUnsaved(candidate);
        setError(e instanceof Error ? e.message : 'No se pudo guardar; sesión pausada.');
      });
      return queue.current.then(() => saved);
    },
    [controller, test],
  );
  useEffect(() => {
    if (!ready || recovery) return;
    const timer = setInterval(() => {
      void save();
    }, 1000);
    const visibility = () => {
      if (document.hidden) void save();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [ready, recovery, save]);
  const recover = async () => {
    if (!recovery) return null;
    if (recovery.record.contentStamp !== contentStamp || recovery.record.test !== test) {
      setError(
        'El contenido o modo cambió. Exporta este registro; no se puede reanudar con otra versión.',
      );
      return null;
    }
    try {
      const revision = await trainingStore.save(
        recovery.record,
        owner.current,
        recovery.revision,
        true,
      );
      known.current.set(recovery.record.id, { ...recovery, revision, owner: owner.current });
      setRecovery(null);
      setError('');
      return recovery.record;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo recuperar.');
      return null;
    }
  };
  const closeRecovery = async () => {
    if (!recovery) return;
    try {
      const e = SessionEngine.fromJournal(recovery.record.journal);
      e.send({
        commandId: 'close-' + Date.now(),
        sessionId: e.sessionId,
        expectedControlRevision: e.project().controlRevision,
        action: { type: 'Abort' },
      });
      await trainingStore.save(
        {
          ...recovery.record,
          journal: e.exportJournal(),
          updatedAt: new Date().toISOString(),
        },
        owner.current,
        recovery.revision,
        true,
      );
      await refresh();
      setRecovery(null);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cerrar el registro.');
    }
  };
  return {
    ready,
    error,
    unsaved,
    savedAt,
    records,
    recovery,
    save,
    recover,
    closeRecovery,
    refresh,
    setError,
  };
}
