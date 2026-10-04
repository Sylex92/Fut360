import { SessionEngine } from '@fut360/session-engine';
import type { SessionJournal } from '@fut360/session-engine';

export interface TrainingFeedback {
  rpe: number | null;
  kneeBefore: number | null;
  kneeAfter: number | null;
  notes: string;
}
export interface TrainingRecord {
  id: string;
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
  const archive = data as { formatVersion: number; records: unknown[] };
  if (
    archive.formatVersion !== 1 ||
    !Array.isArray(archive.records) ||
    archive.records.length > 1000
  )
    throw new Error('Versión o cantidad de sesiones no admitida.');
  const records = archive.records.map(validateRecord);
  if (
    new Set(records.map((r) => r.id)).size !== records.length ||
    records.reduce((n, r) => n + r.journal.entries.length, 0) > 100000
  )
    throw new Error('Sesiones duplicadas o demasiados eventos.');
  return records;
}
export function exportArchive(records: TrainingRecord[]): string {
  return JSON.stringify(
    { formatVersion: 1, exportedAt: new Date().toISOString(), records },
    null,
    2,
  );
}
const active = (r: TrainingRecord) =>
  ['running', 'paused'].includes(SessionEngine.fromJournal(r.journal).project().status);

/** Native IndexedDB adapter. Each CAS write and the active-session pointer are atomic. */
export class IndexedTrainingStore implements TrainingStore {
  private async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('fut360-training', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('sessions', { keyPath: 'record.id' });
        request.result.createObjectStore('meta');
      };
      request.onerror = () => reject(new Error('No se pudo abrir el guardado local.'));
      request.onblocked = () =>
        reject(new Error('Cierra las otras ventanas de Fut360 para abrir el guardado.'));
      request.onsuccess = () => resolve(request.result);
    });
  }
  async list(): Promise<StoredTraining[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readonly');
      const request = tx.objectStore('sessions').getAll();
      tx.oncomplete = () => {
        db.close();
        resolve(
          (request.result as StoredTraining[]).sort((a, b) =>
            b.record.updatedAt.localeCompare(a.record.updatedAt),
          ),
        );
      };
      tx.onabort = () => {
        db.close();
        reject(new Error('No se pudo leer el historial.'));
      };
    });
  }
  async save(
    record: TrainingRecord,
    owner: string,
    revision: number,
    takeover = false,
  ): Promise<number> {
    const db = await this.open();
    const isActive = active(record);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['sessions', 'meta'], 'readwrite');
      const sessions = tx.objectStore('sessions');
      const meta = tx.objectStore('meta');
      let reason =
        'No se pudo guardar. La sesión está pausada; exporta una copia antes de cerrar.';
      const prior = sessions.get(record.id);
      const current = meta.get('active');
      current.onsuccess = () => {
        const old = prior.result as StoredTraining | undefined;
        if (
          (old && (old.revision !== revision || (!takeover && old.owner !== owner))) ||
          (!old && revision !== 0) ||
          (isActive && current.result && current.result !== record.id)
        ) {
          reason = 'Otra ventana tiene el progreso más reciente. Recarga para recuperarlo.';
          tx.abort();
          return;
        }
        sessions.put({ record, owner, revision: revision + 1 });
        if (isActive) meta.put(record.id, 'active');
        else if (current.result === record.id) meta.delete('active');
      };
      tx.oncomplete = () => {
        db.close();
        resolve(revision + 1);
      };
      tx.onabort = () => {
        db.close();
        reject(new Error(reason));
      };
    });
  }
  async remove(id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['sessions', 'meta'], 'readwrite');
      tx.objectStore('sessions').delete(id);
      const meta = tx.objectStore('meta');
      const req = meta.get('active');
      req.onsuccess = () => {
        if (req.result === id) meta.delete('active');
      };
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onabort = () => {
        db.close();
        reject(new Error('No se pudo borrar.'));
      };
    });
  }
  async import(records: TrainingRecord[]): Promise<void> {
    const checked = records.map(validateRecord);
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readwrite');
      const store = tx.objectStore('sessions');
      for (const record of checked) {
        const req = store.get(record.id);
        req.onsuccess = () => {
          const prior = req.result as StoredTraining | undefined;
          if (prior && JSON.stringify(prior.record) !== JSON.stringify(record)) {
            tx.abort();
            return;
          }
          if (!prior) store.put({ record, revision: 1, owner: 'imported' });
        };
      }
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onabort = () => {
        db.close();
        reject(new Error('Conflicto de identidad: no se importó ningún registro.'));
      };
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
