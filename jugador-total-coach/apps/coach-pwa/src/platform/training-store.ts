import { SessionEngine } from '@fut360/session-engine';
import type { SessionJournal } from '@fut360/session-engine';
import { transact } from './local-database';
import { validParticipantId } from './participant';

export interface TrainingFeedback {
  rpe: number | null;
  kneeBefore: number | null;
  kneeAfter: number | null;
  notes: string;
}
export interface TrainingRecord {
  id: string;
  participantId?: string;
  startedAt: string;
  updatedAt: string;
  contentStamp: string;
  journal: SessionJournal;
  test: boolean;
  feedback: TrainingFeedback | null;
}
export interface StoredTraining {
  record: TrainingRecord;
  revision: number;
  owner: string;
}
export interface TrainingStore {
  list(): Promise<StoredTraining[]>;
  save(
    record: TrainingRecord,
    owner: string,
    revision: number,
    takeover?: boolean,
  ): Promise<number>;
  remove(id: string): Promise<void>;
  import(records: TrainingRecord[]): Promise<void>;
}
export const MAX_ARCHIVE_BYTES = 10 * 1024 * 1024;
export function validateRecord(value: unknown): TrainingRecord {
  if (!value || typeof value !== 'object') throw new Error('Registro inválido.');
  const r = value as TrainingRecord;
  if (
    typeof r.id !== 'string' ||
    (r.participantId !== undefined && !validParticipantId(r.participantId)) ||
    typeof r.startedAt !== 'string' ||
    typeof r.updatedAt !== 'string' ||
    !Number.isFinite(Date.parse(r.startedAt)) ||
    !Number.isFinite(Date.parse(r.updatedAt)) ||
    typeof r.contentStamp !== 'string' ||
    r.contentStamp.length > 100000 ||
    typeof r.test !== 'boolean'
  )
    throw new Error('Datos de registro inválidos.');
  const engine = SessionEngine.fromJournal(r.journal);
  if (
    engine.sessionId !== r.id ||
    !['running', 'paused', 'completed', 'aborted'].includes(engine.project().status)
  )
    throw new Error('La sesión no tiene un progreso recuperable.');
  if (r.feedback !== null) {
    const f = r.feedback;
    if (
      !f ||
      typeof f.notes !== 'string' ||
      f.notes.length > 2000 ||
      ![f.rpe, f.kneeBefore, f.kneeAfter].every(
        (n) => n === null || (Number.isInteger(n) && n >= 0 && n <= 10),
      )
    )
      throw new Error('Feedback fuera de límites.');
  }
  return structuredClone({
    id: r.id,
    ...(r.participantId ? { participantId: r.participantId } : {}),
    startedAt: r.startedAt,
    updatedAt: r.updatedAt,
    contentStamp: r.contentStamp,
    journal: r.journal,
    test: r.test,
    feedback: r.feedback,
  });
}
export function parseArchive(text: string): TrainingRecord[] {
  if (new TextEncoder().encode(text).byteLength > MAX_ARCHIVE_BYTES)
    throw new Error('El archivo supera 10 MiB.');
  const data: unknown = JSON.parse(text);
  if (!data || typeof data !== 'object') throw new Error('Archivo inválido.');
  const archive = data as {
    formatVersion: number;
    participantId?: string;
    records: unknown[];
  };
  if (
    ![1, 2].includes(archive.formatVersion) ||
    (archive.formatVersion === 2 && !validParticipantId(archive.participantId)) ||
    !Array.isArray(archive.records) ||
    archive.records.length > 1000
  )
    throw new Error('Versión o cantidad de sesiones no admitida.');
  const records = archive.records.map(validateRecord);
  if (
    records.some(
      (r) =>
        (r.participantId ?? null) !==
        (archive.formatVersion === 2 ? archive.participantId : null),
    ) ||
    new Set(records.map((r) => r.id)).size !== records.length ||
    records.reduce((n, r) => n + r.journal.entries.length, 0) > 100000
  )
    throw new Error('Sesiones duplicadas o demasiados eventos.');
  return records;
}
export function exportArchive(records: TrainingRecord[]): string {
  const scope = records[0]?.participantId;
  if (records.some((r) => r.participantId !== scope))
    throw new Error('Exporta cada perfil por separado.');
  return JSON.stringify(
    {
      formatVersion: scope ? 2 : 1,
      ...(scope ? { participantId: scope } : {}),
      exportedAt: new Date().toISOString(),
      records,
    },
    null,
    2,
  );
}
const active = (r: TrainingRecord) =>
  ['running', 'paused'].includes(SessionEngine.fromJournal(r.journal).project().status);

/** Native IndexedDB adapter. Each CAS write and the active-session pointer are atomic. */
export class IndexedTrainingStore implements TrainingStore {
  constructor(readonly participantId: string | null = null) {
    if (participantId !== null && !validParticipantId(participantId))
      throw new Error('Perfil inválido.');
  }
  private get activeKey() {
    return this.participantId ? 'active:' + this.participantId : 'active';
  }
  private belongs(record: TrainingRecord) {
    return (record.participantId ?? null) === this.participantId;
  }
  private checkParticipant(tx: IDBTransaction, fail: (reason: string) => void) {
    if (!this.participantId) return;
    const request = tx.objectStore('participants').get(this.participantId);
    request.onsuccess = () => {
      if (!request.result) fail('Este perfil fue eliminado. Recarga antes de continuar.');
    };
  }
  async list(): Promise<StoredTraining[]> {
    return transact(['sessions', 'participants'], 'readonly', (tx, result, fail) => {
      this.checkParticipant(tx, fail);
      const request = tx.objectStore('sessions').getAll();
      request.onsuccess = () => {
        result(
          (request.result as StoredTraining[])
            .filter((r) => this.belongs(r.record))
            .sort((a, b) => b.record.updatedAt.localeCompare(a.record.updatedAt)),
        );
      };
    });
  }
  async save(
    record: TrainingRecord,
    owner: string,
    revision: number,
    takeover = false,
  ): Promise<number> {
    record = validateRecord(record);
    if (!this.belongs(record)) throw new Error('El registro pertenece a otro perfil.');
    const isActive = active(record);
    return transact(['sessions', 'meta', 'participants'], 'readwrite', (tx, result, fail) => {
      this.checkParticipant(tx, fail);
      const sessions = tx.objectStore('sessions');
      const meta = tx.objectStore('meta');
      const prior = sessions.get(record.id);
      const current = meta.get(this.activeKey);
      current.onsuccess = () => {
        const old = prior.result as StoredTraining | undefined;
        if (
          (old &&
            (!this.belongs(old.record) ||
              old.revision !== revision ||
              (!takeover && old.owner !== owner))) ||
          (!old && revision !== 0) ||
          (isActive && current.result && current.result !== record.id)
        ) {
          fail('Otra ventana tiene el progreso más reciente. Recarga para recuperarlo.');
          return;
        }
        sessions.put({ record, owner, revision: revision + 1 });
        if (isActive) meta.put(record.id, this.activeKey);
        else if (current.result === record.id) meta.delete(this.activeKey);
        result(revision + 1);
      };
    });
  }
  async remove(id: string): Promise<void> {
    return transact(['sessions', 'meta', 'participants'], 'readwrite', (tx, result, fail) => {
      this.checkParticipant(tx, fail);
      const sessions = tx.objectStore('sessions');
      const prior = sessions.get(id);
      prior.onsuccess = () => {
        const old = prior.result as StoredTraining | undefined;
        if (old && !this.belongs(old.record)) {
          fail('El registro pertenece a otro perfil.');
          return;
        }
        sessions.delete(id);
      };
      const meta = tx.objectStore('meta');
      const req = meta.get(this.activeKey);
      req.onsuccess = () => {
        if (req.result === id) meta.delete(this.activeKey);
      };
      result(undefined);
    });
  }
  async import(records: TrainingRecord[]): Promise<void> {
    const checked = parseArchive(exportArchive(records));
    if (checked.some((r) => !this.belongs(r)))
      throw new Error(
        'La copia pertenece a otro perfil. Usa su respaldo completo para restaurarlo.',
      );
    if (checked.filter(active).length > 1)
      throw new Error('La copia tiene más de un recorrido pendiente.');
    return transact(['sessions', 'meta', 'participants'], 'readwrite', (tx, result, fail) => {
      this.checkParticipant(tx, fail);
      const store = tx.objectStore('sessions');
      const meta = tx.objectStore('meta');
      const current = meta.get(this.activeKey);
      current.onsuccess = () => {
        const incomingActive = checked.find(active);
        if (incomingActive && current.result && current.result !== incomingActive.id) {
          fail('Ya hay otro recorrido pendiente en este perfil.');
          return;
        }
        if (incomingActive) meta.put(incomingActive.id, this.activeKey);
      };
      for (const record of checked) {
        const req = store.get(record.id);
        req.onsuccess = () => {
          const prior = req.result as StoredTraining | undefined;
          if (
            prior &&
            JSON.stringify(validateRecord(prior.record)) !== JSON.stringify(record)
          ) {
            fail('Conflicto de identidad: no se importó ningún registro.');
            return;
          }
          if (!prior) store.put({ record, revision: 1, owner: 'imported' });
        };
      }
      result(undefined);
    });
  }
}
export const trainingStore: TrainingStore = new IndexedTrainingStore();
export function downloadRecords(records: TrainingRecord[]): void {
  const url = URL.createObjectURL(
    new Blob([exportArchive(records)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fut360-historial.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
