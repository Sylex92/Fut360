import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ParticipantContext, useParticipant } from './ParticipantContext';
import { IndexedTrainingStore, MAX_ARCHIVE_BYTES } from '../platform/training-store';
import type { StoredTraining } from '../platform/training-store';
import { participantGoals, validateParticipant } from '../platform/participant';
import type { Participant, ParticipantGoal } from '../platform/participant';
import {
  assignLegacyHistory,
  downloadParticipant,
  listParticipants,
  parseParticipantBackup,
  participantBackup,
  removeParticipant,
  restoreParticipant,
  saveParticipant,
} from '../platform/participant-store';
import type { ParticipantBackup } from '../platform/participant-store';
import { TrainingHistory } from './TrainingHistory';

const ManagementContext = createContext<{
  profiles: Participant[];
  selectedId: string;
  select: (id: string) => void;
  refresh: () => Promise<void>;
  setBusy: (value: boolean) => void;
} | null>(null);
const selectionKey = 'fut360-participant';

export function ParticipantBoundary({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Participant[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refresh = async () => {
    setProfiles(await listParticipants());
    setRevision((v) => v + 1);
  };
  useEffect(() => {
    let mounted = true;
    void listParticipants()
      .then((rows) => {
        if (!mounted) return;
        let saved = '';
        try {
          saved = sessionStorage.getItem(selectionKey) ?? '';
        } catch {
          /* Optional preference. */
        }
        setProfiles(rows);
        setSelectedId(rows.some((p) => p.id === saved) ? saved : '');
        setReady(true);
      })
      .catch((e: unknown) => {
        if (mounted)
          setError(e instanceof Error ? e.message : 'No se pudieron abrir los perfiles.');
      });
    return () => {
      mounted = false;
    };
  }, []);
  const participant = profiles.find((p) => p.id === selectedId) ?? null;
  const store = useMemo(
    () => new IndexedTrainingStore(selectedId || null),
    [selectedId, revision],
  );
  function select(id: string) {
    setSelectedId(id);
    try {
      sessionStorage.setItem(selectionKey, id);
    } catch {
      /* Session data still lives in IndexedDB. */
    }
  }
  if (!ready)
    return (
      <main className="app-shell">
        <h1>Fut360</h1>
        <p role={error ? 'alert' : 'status'}>{error || 'Abriendo tus datos locales…'}</p>
        {error && <button onClick={() => window.location.reload()}>Volver a intentar</button>}
      </main>
    );
  return (
    <ManagementContext.Provider value={{ profiles, selectedId, select, refresh, setBusy }}>
      <ParticipantContext.Provider value={{ participant, store, refreshParticipant: refresh }}>
        <fieldset className="profile-application" disabled={busy} aria-busy={busy}>
          <div key={selectedId || 'legacy'}>{children}</div>
        </fieldset>
      </ParticipantContext.Provider>
    </ManagementContext.Provider>
  );
}

export function ParticipantManager({ active }: { active: boolean }) {
  const management = useContext(ManagementContext);
  const { participant } = useParticipant();
  const [editing, setEditing] = useState<Participant | 'new' | null>(null);
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState<'delete' | 'assign' | null>(null);
  const [incoming, setIncoming] = useState<ParticipantBackup | null>(null);
  if (!management) return null;
  const { profiles, selectedId, select, refresh, setBusy } = management;
  async function perform(work: () => Promise<void>, success: string) {
    setBusy(true);
    setMessage('');
    try {
      await work();
      await refresh();
      setMessage(success);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'No se pudo completar.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="participant-manager" aria-label="Perfiles de entrenamiento">
      <div className="participant-bar">
        <label>
          Perfil actual
          <select
            value={selectedId}
            disabled={active}
            onChange={(e) => select(e.target.value)}
          >
            <option value="">Sin asignar · historial anterior</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.alias} · {p.kind === 'child' ? 'Infantil' : 'Adulto'}
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={active}
          onClick={() => {
            setEditing('new');
            setConfirmation(null);
          }}
        >
          Crear perfil
        </button>
        {participant && (
          <button disabled={active} onClick={() => setEditing(participant)}>
            Editar perfil
          </button>
        )}
      </div>
      <p className="quiet-note">
        {active
          ? 'Termina el recorrido antes de cambiar de persona.'
          : participant
            ? 'Plan e historial para ' +
              participant.alias +
              '. Guardados solo en este navegador.'
            : 'El historial anterior se conserva sin asignarlo automáticamente a una persona.'}
      </p>
      {editing && (
        <fieldset disabled={active}>
          <ParticipantForm
            key={editing === 'new' ? 'new' : editing.id}
            value={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onSave={(p) =>
              perform(async () => {
                await saveParticipant(p, editing === 'new' ? null : editing);
                await refresh();
                setEditing(null);
                select(p.id);
              }, 'Perfil guardado. Sus objetivos no cambian automáticamente la dosis.')
            }
          />
        </fieldset>
      )}
      <details>
        <summary>Respaldos y administración de perfiles</summary>
        <p>
          Usa un alias. No necesitas guardar medidas ni datos médicos. Los perfiles no tienen
          contraseña: otra persona que use este navegador puede abrirlos.
        </p>
        {participant && (
          <div className="camera-controls">
            <button
              disabled={active}
              onClick={() =>
                void perform(
                  async () => downloadParticipant(await participantBackup(participant.id)),
                  'Respaldo preparado.',
                )
              }
            >
              Exportar perfil e historial
            </button>
            {participant.kind === 'adult' && (
              <button disabled={active} onClick={() => setConfirmation('assign')}>
                Asignar historial anterior
              </button>
            )}
            <button disabled={active} onClick={() => setConfirmation('delete')}>
              Eliminar este perfil
            </button>
          </div>
        )}
        {confirmation && participant && (
          <div className="recovery-card" role="alert">
            <p>
              {confirmation === 'delete'
                ? 'Se eliminarán ' +
                  participant.alias +
                  ' y todas sus sesiones de este navegador. Exporta su respaldo si deseas conservarlos.'
                : 'Asignar todos los registros anteriores sin dueño a ' +
                  participant.alias +
                  '. Sus eventos y fechas se conservarán. No se asignarán al perfil infantil.'}
            </p>
            <button
              disabled={active}
              onClick={() =>
                void perform(
                  async () => {
                    if (confirmation === 'delete') {
                      await removeParticipant(participant.id);
                      select('');
                    } else await assignLegacyHistory(participant.id);
                    setConfirmation(null);
                  },
                  confirmation === 'delete'
                    ? 'Perfil eliminado.'
                    : 'Historial anterior asignado.',
                )
              }
            >
              {confirmation === 'delete'
                ? 'Confirmar eliminación de perfil'
                : 'Confirmar asignación'}
            </button>
            <button onClick={() => setConfirmation(null)}>Cancelar</button>
          </div>
        )}
        <label className="profile-import">
          Restaurar respaldo completo
          <input
            type="file"
            accept="application/json,.json"
            disabled={active}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              setIncoming(null);
              if (!file) return;
              if (file.size > MAX_ARCHIVE_BYTES) {
                setMessage('El archivo supera 10 MiB.');
                return;
              }
              void file
                .text()
                .then((text) => setIncoming(parseParticipantBackup(text)))
                .catch((error: unknown) =>
                  setMessage(error instanceof Error ? error.message : 'Archivo inválido.'),
                );
            }}
          />
        </label>
        {incoming && (
          <div className="recovery-card">
            <p>
              {incoming.participant.alias} ·{' '}
              {incoming.participant.kind === 'child' ? 'Infantil' : 'Adulto'} ·{' '}
              {incoming.records.length} registros. Los conflictos cancelan toda la
              restauración.
            </p>
            <button
              disabled={active}
              onClick={() =>
                void perform(async () => {
                  await restoreParticipant(incoming);
                  await refresh();
                  select(incoming.participant.id);
                  setIncoming(null);
                }, 'Perfil restaurado.')
              }
            >
              Restaurar este perfil
            </button>
            <button onClick={() => setIncoming(null)}>Cancelar restauración</button>
          </div>
        )}
        <p className="quiet-note">
          El archivo conserva identidad y datos del perfil. No se envía a la nube ni se
          sincroniza automáticamente con otro dispositivo.
        </p>
      </details>
      <p role="status">{message}</p>
    </section>
  );
}

function ParticipantForm({
  value,
  onSave,
  onCancel,
}: {
  value: Participant | null;
  onSave: (p: Participant) => Promise<void>;
  onCancel: () => void;
}) {
  const [alias, setAlias] = useState(value?.alias ?? '');
  const [kind, setKind] = useState<Participant['kind']>(value?.kind ?? 'adult');
  const [foot, setFoot] = useState<Participant['foot']>(value?.foot ?? 'unknown');
  const [modalities, setModalities] = useState<Participant['modalities']>(
    value?.modalities ?? [],
  );
  const [goals, setGoals] = useState<ParticipantGoal[]>(value?.goals ?? []);
  const [responsible, setResponsible] = useState(false);
  const [error, setError] = useState('');
  return (
    <form
      className="participant-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (kind === 'child' && !responsible) {
          setError('El perfil infantil lo debe administrar un adulto.');
          return;
        }
        try {
          const id =
            value?.id ??
            'p-' +
              Array.from(crypto.getRandomValues(new Uint8Array(16)), (v) =>
                v.toString(16).padStart(2, '0'),
              ).join('');
          const p = validateParticipant({
            ...value,
            id,
            alias,
            kind,
            foot,
            modalities,
            goals,
            createdAt: value?.createdAt ?? new Date().toISOString(),
          });
          setError('');
          void onSave(p);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Revisa los datos.');
        }
      }}
    >
      <h2>{value ? 'Editar perfil' : 'Nuevo perfil'}</h2>
      <div className="profile-fields">
        <label>
          Alias
          <input
            required
            maxLength={40}
            autoComplete="off"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </label>
        <label>
          Tipo de perfil
          <select
            disabled={!!value}
            value={kind}
            onChange={(e) => setKind(e.target.value as Participant['kind'])}
          >
            <option value="adult">Adulto</option>
            <option value="child">Infantil</option>
          </select>
        </label>
        <label>
          Pie preferido
          <select
            value={foot}
            onChange={(e) => setFoot(e.target.value as Participant['foot'])}
          >
            <option value="unknown">Sin indicar</option>
            <option value="left">Izquierdo</option>
            <option value="right">Derecho</option>
            <option value="both">Ambos</option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Modalidades</legend>
        <div className="profile-checks">
          {(['5', '7', '11'] as const).map((m) => (
            <label key={m}>
              <input
                type="checkbox"
                checked={modalities.includes(m)}
                onChange={(e) =>
                  setModalities(
                    e.target.checked ? [...modalities, m] : modalities.filter((v) => v !== m),
                  )
                }
              />
              FUT {m}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Objetivos</legend>
        <div className="profile-checks">
          {(Object.keys(participantGoals) as ParticipantGoal[]).map((g) => (
            <label key={g}>
              <input
                type="checkbox"
                checked={goals.includes(g)}
                onChange={(e) =>
                  setGoals(e.target.checked ? [...goals, g] : goals.filter((v) => v !== g))
                }
              />
              {participantGoals[g]}
            </label>
          ))}
        </div>
      </fieldset>
      {kind === 'child' && (
        <label className="profile-checks">
          <input
            type="checkbox"
            required
            checked={responsible}
            onChange={(e) => setResponsible(e.target.checked)}
          />
          Soy el adulto responsable que administra este perfil.
        </label>
      )}
      <p className="quiet-note">
        Estos datos organizan el perfil. El plan y la dificultad requieren su propia
        preparación.
      </p>
      <button type="submit">Guardar perfil</button>{' '}
      <button type="button" onClick={onCancel}>
        Cancelar edición
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export function ParticipantHistory() {
  const { store } = useParticipant();
  const [records, setRecords] = useState<StoredTraining[]>([]);
  const [error, setError] = useState('');
  const refresh = async () => {
    setRecords(await store.list());
  };
  useEffect(() => {
    let mounted = true;
    void store
      .list()
      .then((r) => {
        if (mounted) setRecords(r);
      })
      .catch((e: unknown) => {
        if (mounted)
          setError(e instanceof Error ? e.message : 'No se pudo leer el historial.');
      });
    return () => {
      mounted = false;
    };
  }, [store]);
  return (
    <>
      {error && <p role="alert">{error}</p>}
      <TrainingHistory
        records={records}
        finished={false}
        active={false}
        onFeedback={async () => false}
        onChange={refresh}
      />
    </>
  );
}
