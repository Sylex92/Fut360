import { useState } from 'react';
import { SessionEngine } from '@fut360/session-engine';
import {
  downloadRecords,
  MAX_ARCHIVE_BYTES,
  parseArchive,
  trainingStore,
} from '../platform/training-store';
import type {
  StoredTraining,
  TrainingFeedback,
  TrainingRecord,
} from '../platform/training-store';
export function TrainingHistory({
  records,
  finished,
  onFeedback,
  onChange,
  active,
}: {
  records: StoredTraining[];
  finished: boolean;
  onFeedback: (feedback: TrainingFeedback) => Promise<boolean>;
  onChange: () => Promise<unknown>;
  active: boolean;
}) {
  const [rpe, setRpe] = useState('');
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [incoming, setIncoming] = useState<TrainingRecord[] | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const scale = (value: string) => (value === '' ? null : Number(value));
  return (
    <section className="panel training-history" aria-labelledby="history-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SOLO EN ESTE NAVEGADOR</p>
          <h2 id="history-title">Tu historial</h2>
        </div>
        <button
          onClick={() => downloadRecords(records.map((r) => r.record))}
          disabled={!records.length}
        >
          Exportar historial
        </button>
      </div>
      {finished && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onFeedback({
              rpe: scale(rpe),
              kneeBefore: scale(before),
              kneeAfter: scale(after),
              notes,
            }).then((saved) =>
              setMessage(
                saved ? 'Sensaciones guardadas.' : 'No se pudieron guardar las sensaciones.',
              ),
            );
            setMessage('Guardando sensaciones…');
          }}
        >
          <h3>
            ¿Cómo te sentiste? <small>Opcional</small>
          </h3>
          <div className="history-feedback">
            {[
              { label: 'Esfuerzo percibido (0–10)', value: rpe, set: setRpe },
              { label: 'Molestia de rodilla antes (0–10)', value: before, set: setBefore },
              { label: 'Molestia de rodilla después (0–10)', value: after, set: setAfter },
            ].map((f) => (
              <label key={f.label}>
                {f.label}
                <select value={f.value} onChange={(e) => f.set(e.target.value)}>
                  <option value="">Sin registrar</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <label>
            Notas
            <textarea
              maxLength={2000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <button>Guardar sensaciones</button>
          <p className="quiet-note">
            Es un registro personal; las escalas no diagnostican ni modifican automáticamente
            tu plan.
          </p>
        </form>
      )}
      {!records.length ? (
        <p>Aquí aparecerán tus sesiones cuando empieces.</p>
      ) : (
        <ul className="history-list">
          {records.map(({ record: r }) => {
            const s = SessionEngine.fromJournal(r.journal).project();
            const seconds = Math.floor(s.recordedMs / 1000);
            return (
              <li key={r.id}>
                <div>
                  <strong>{new Date(r.startedAt).toLocaleString('es-MX')}</strong>
                  <p>
                    {s.status === 'completed'
                      ? 'Recorrido completado'
                      : s.status === 'aborted'
                        ? 'Finalizada antes de tiempo'
                        : 'Progreso guardado'}
                    {r.test ? ' · prueba acelerada' : ''}
                  </p>
                  <p>
                    {Math.floor(seconds / 60)} min {seconds % 60} s registrados ·{' '}
                    {Math.round((s.counters.baseOmittedMs + s.counters.extraOmittedMs) / 1000)}{' '}
                    s omitidos
                  </p>
                  {r.feedback && (
                    <p>
                      Esfuerzo: {r.feedback.rpe ?? 'sin registrar'} · Rodilla:{' '}
                      {r.feedback.kneeBefore ?? '—'} → {r.feedback.kneeAfter ?? '—'}
                      {r.feedback.notes && ' · ' + r.feedback.notes}
                    </p>
                  )}
                </div>
                {!active && (
                  <button onClick={() => setDeleting(r.id)}>Eliminar registro</button>
                )}
                {deleting === r.id && (
                  <div role="alert">
                    <p>Se borrará este registro de este navegador.</p>
                    <button
                      onClick={() => {
                        void trainingStore
                          .remove(r.id)
                          .then(onChange)
                          .then(() => {
                            setDeleting(null);
                            setMessage('Registro eliminado.');
                          })
                          .catch(() => setMessage('No se pudo eliminar.'));
                      }}
                    >
                      Confirmar eliminación
                    </button>
                    <button onClick={() => setDeleting(null)}>Conservar</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="quiet-note">
        Tiempo de reproducción, no actividad física medida. Exporta una copia: borrar los datos
        del navegador también elimina el historial.
      </p>
      <details>
        <summary>Importar una copia</summary>
        <label>
          Archivo JSON
          <input
            type="file"
            accept="application/json,.json"
            disabled={active}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > MAX_ARCHIVE_BYTES) {
                setMessage('El archivo supera 10 MiB.');
                return;
              }
              void f
                .text()
                .then((t) => {
                  setIncoming(parseArchive(t));
                  setMessage('Archivo comprobado. Revisa la cantidad antes de importar.');
                })
                .catch((err) => {
                  setIncoming(null);
                  setMessage(err instanceof Error ? err.message : 'Archivo inválido.');
                });
              e.target.value = '';
            }}
          />
        </label>
        {incoming && (
          <div>
            <p>
              {incoming.length} registros listos para importar. Los conflictos cancelan toda la
              importación.
            </p>
            <button
              disabled={active}
              onClick={() => {
                void trainingStore
                  .import(incoming)
                  .then(onChange)
                  .then(() => {
                    setIncoming(null);
                    setMessage(
                      'Copia importada. Los progresos pendientes se ofrecen al recargar.',
                    );
                  })
                  .catch((e) => setMessage(e.message));
              }}
            >
              Importar {incoming.length} registros
            </button>
            <button onClick={() => setIncoming(null)}>Cancelar</button>
          </div>
        )}
      </details>
      <p role="status">{message}</p>
    </section>
  );
}
