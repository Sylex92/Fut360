import { SessionEngine } from '@fut360/session-engine';
import { transact } from './local-database';
import { validateParticipant } from './participant';
import type { Participant } from './participant';
import { MAX_ARCHIVE_BYTES, parseArchive, validateRecord } from './training-store';
import type { StoredTraining, TrainingRecord } from './training-store';

export interface ParticipantBackup {
  format: 'fut360-participant';
  version: 1;
  participant: Participant;
  records: TrainingRecord[];
}
const isActive = (r: TrainingRecord) =>
  ['running', 'paused'].includes(SessionEngine.fromJournal(r.journal).project().status);

export function parseParticipantBackup(text: string): ParticipantBackup {
  if (new TextEncoder().encode(text).byteLength > MAX_ARCHIVE_BYTES)
    throw new Error('El archivo supera 10 MiB.');
  const value = JSON.parse(text) as ParticipantBackup | null;
  if (!value || value.format !== 'fut360-participant' || value.version !== 1)
    throw new Error('Selecciona un respaldo completo de perfil de Fut360.');
  const participant = validateParticipant(value.participant);
  const records = parseArchive(
    JSON.stringify({
      formatVersion: 2,
      participantId: participant.id,
      records: value.records,
    }),
  );
  if (records.filter(isActive).length > 1)
    throw new Error('Hay más de un recorrido pendiente.');
  return { format: 'fut360-participant', version: 1, participant, records };
}

export function listParticipants(): Promise<Participant[]> {
  return transact(['participants'], 'readonly', (tx, result) => {
    const req = tx.objectStore('participants').getAll();
    req.onsuccess = () =>
      result(
        (req.result as Participant[]).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      );
  });
}

export function saveParticipant(
  value: Participant,
  expected: Participant | null = null,
): Promise<void> {
  const p = validateParticipant(value);
  return transact(['participants'], 'readwrite', (tx, result, fail) => {
    const store = tx.objectStore('participants');
    const req = store.get(p.id);
    req.onsuccess = () => {
      const prior = req.result as Participant | undefined;
      if (
        JSON.stringify(prior ?? null) !== JSON.stringify(expected) ||
        (prior && (prior.kind !== p.kind || prior.createdAt !== p.createdAt))
      ) {
        fail('El perfil cambió en otra ventana. Recarga para revisarlo.');
        return;
      }
      store.put(p);
      result(undefined);
    };
  });
}

export function participantBackup(id: string): Promise<ParticipantBackup> {
  return transact(['participants', 'sessions'], 'readonly', (tx, result, fail) => {
    const p = tx.objectStore('participants').get(id);
    const rows = tx.objectStore('sessions').getAll();
    rows.onsuccess = () => {
      if (!p.result) {
        fail('El perfil ya no existe.');
        return;
      }
      result({
        format: 'fut360-participant',
        version: 1,
        participant: p.result as Participant,
        records: (rows.result as StoredTraining[])
          .filter((r) => r.record.participantId === id)
          .map((r) => validateRecord(r.record)),
      });
    };
  });
}

export function restoreParticipant(value: ParticipantBackup): Promise<void> {
  const checked = parseParticipantBackup(JSON.stringify(value));
  return transact(['participants', 'sessions', 'meta'], 'readwrite', (tx, result, fail) => {
    const participants = tx.objectStore('participants');
    const sessions = tx.objectStore('sessions');
    const meta = tx.objectStore('meta');
    const p = checked.participant;
    const prior = participants.get(p.id);
    prior.onsuccess = () => {
      if (prior.result && JSON.stringify(prior.result) !== JSON.stringify(p)) {
        fail('El perfil existente difiere de la copia. No se reemplazó ningún dato.');
        return;
      }
      if (!prior.result) participants.add(p);
    };
    const current = meta.get('active:' + p.id);
    current.onsuccess = () => {
      const pending = checked.records.find(isActive);
      if (pending && current.result && current.result !== pending.id) {
        fail('El perfil ya tiene otro recorrido pendiente.');
        return;
      }
      if (pending) meta.put(pending.id, 'active:' + p.id);
    };
    for (const record of checked.records) {
      const req = sessions.get(record.id);
      req.onsuccess = () => {
        const old = req.result as StoredTraining | undefined;
        if (old && JSON.stringify(validateRecord(old.record)) !== JSON.stringify(record)) {
          fail('Conflicto de sesiones: no se importó ningún dato.');
          return;
        }
        if (!old) sessions.add({ record, owner: 'imported', revision: 1 });
      };
    }
    result(undefined);
  });
}

export function removeParticipant(id: string): Promise<void> {
  return transact(['participants', 'sessions', 'meta'], 'readwrite', (tx, result) => {
    const sessions = tx.objectStore('sessions');
    const rows = sessions.openCursor();
    rows.onsuccess = () => {
      const cursor = rows.result;
      if (!cursor) return;
      if ((cursor.value as StoredTraining).record.participantId === id) cursor.delete();
      cursor.continue();
    };
    tx.objectStore('participants').delete(id);
    tx.objectStore('meta').delete('active:' + id);
    result(undefined);
  });
}

/** Explicit assignment preserves event journals, identity and timestamps. */
export function assignLegacyHistory(id: string): Promise<number> {
  return transact(['participants', 'sessions', 'meta'], 'readwrite', (tx, result, fail) => {
    const p = tx.objectStore('participants').get(id);
    const sessions = tx.objectStore('sessions');
    const meta = tx.objectStore('meta');
    const current = meta.get('active:' + id);
    const rows = sessions.getAll();
    rows.onsuccess = () => {
      if (!p.result || (p.result as Participant).kind !== 'adult') {
        fail('El historial anterior solo puede asignarse explícitamente a un perfil adulto.');
        return;
      }
      const legacy = (rows.result as StoredTraining[]).filter((r) => !r.record.participantId);
      const pending = legacy.filter((r) => isActive(r.record));
      if (pending.length > 1 || (pending.length && current.result)) {
        fail('Resuelve los recorridos pendientes antes de asignar el historial.');
        return;
      }
      for (const row of legacy)
        sessions.put({
          record: { ...row.record, participantId: id },
          revision: row.revision + 1,
          owner: 'reassigned',
        });
      meta.delete('active');
      if (pending[0]) meta.put(pending[0].record.id, 'active:' + id);
      result(legacy.length);
    };
  });
}

export function downloadParticipant(backup: ParticipantBackup): void {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'fut360-perfil.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
