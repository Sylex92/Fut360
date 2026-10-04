import { useState } from 'react';
import { useParticipant } from './ParticipantContext';
import { saveParticipant } from '../platform/participant-store';
import { validateParticipant } from '../platform/participant';
import {
  emptyPlanningContext,
  emptyWeek,
  facilities,
  places,
  weekdays,
  weekSummary,
} from '../platform/planning';
import type { PlanningContext, WeekSlot } from '../platform/planning';
import { coachingSessions } from '../composition/development-plan';
import { sessionAudience } from '../composition/personal-programs';
import { suggestProgramWeek } from '../composition/program-week';
import {
  proposalSlot,
  proposalUnchanged,
  sessionRequirements,
} from '../composition/session-eligibility';

export function WeeklyPlanner({ onBusyChange }: { onBusyChange: (value: boolean) => void }) {
  const { participant, refreshParticipant } = useParticipant();
  const [context, setContext] = useState<PlanningContext>(
    participant?.planning?.context ?? emptyPlanningContext(),
  );
  const [slots, setSlots] = useState<WeekSlot[]>(
    participant?.planning?.weeks.at(-1)?.slots ?? emptyWeek(),
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (!participant)
    return (
      <p className="quiet-note">Elige un perfil para guardar su disponibilidad y su semana.</p>
    );
  const child = participant.kind === 'child';
  const sessions = coachingSessions.filter((s) => sessionAudience(s) === participant.kind);
  const versions = participant.planning?.weeks ?? [];
  const summary = weekSummary(slots, context);
  const issues = slots.flatMap((slot, i) =>
    slot.kind !== 'session'
      ? []
      : [
          ...sessionRequirements(slot.sessionId, context),
          ...(proposalUnchanged(slot)
            ? []
            : ['El contenido cambió; vuelve a seleccionar y revisar la propuesta.']),
        ].map((issue) => weekdays[i] + ': ' + issue),
  );
  const setSlot = (i: number, slot: WeekSlot) =>
    setSlots(slots.map((s, j) => (j === i ? slot : s)));
  async function save(withWeek: boolean) {
    if (!participant || !refreshParticipant) return;
    setMessage('');
    setError('');
    if (withWeek && issues.length) {
      setError('Revisa los requisitos antes de guardar la semana.');
      return;
    }
    setBusy(true);
    onBusyChange(true);
    try {
      const next = validateParticipant({
        ...participant,
        planning: {
          context,
          weeks: withWeek
            ? [
                ...versions,
                {
                  version: versions.length + 1,
                  savedAt: new Date().toISOString(),
                  context,
                  slots,
                },
              ]
            : versions,
        },
      });
      await saveParticipant(next, participant);
      await refreshParticipant();
      setMessage(
        withWeek
          ? `Semana guardada · versión ${versions.length + 1}. Las anteriores se conservan.`
          : 'Disponibilidad guardada. No añade entrenamientos automáticamente.',
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar.');
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }
  return (
    <section className="panel weekly-planner" aria-labelledby="week-heading">
      <p className="eyebrow">ORGANIZAR LA PRÁCTICA Y EL DESCANSO</p>
      <h2 id="week-heading">La semana de {participant.alias}</h2>
      <p>
        Cuenta lo que ya haces fuera de la aplicación. Tener tiempo libre no obliga a llenarlo
        de entrenamiento.
      </p>
      <fieldset disabled={busy}>
        <details>
          <summary>Disponibilidad, compañía y lugares</summary>
          <div className="week-availability">
            {weekdays.map((day, i) => (
              <label key={day}>
                {day} · minutos disponibles
                <input
                  type="number"
                  min={0}
                  max={1440}
                  step={1}
                  value={context.availableMinutes[i] ?? ''}
                  placeholder="Sin indicar"
                  onChange={(e) =>
                    setContext({
                      ...context,
                      availableMinutes: context.availableMinutes.map((v, j) =>
                        i === j ? (e.target.value === '' ? null : Number(e.target.value)) : v,
                      ),
                    })
                  }
                />
              </label>
            ))}
          </div>
          <label>
            Personas que participan, incluyéndote
            <input
              type="number"
              min={1}
              max={22}
              step={1}
              value={context.participants ?? ''}
              placeholder="Sin indicar"
              onChange={(e) =>
                setContext({
                  ...context,
                  participants: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </label>
          <p className="quiet-note">
            Una persona significa práctica individual. Un adulto que acompaña no cuenta como
            rival del niño.
          </p>
          <fieldset>
            <legend>Lugares disponibles</legend>
            <div className="profile-checks">
              {(Object.keys(places) as (keyof typeof places)[]).map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={context.places.includes(key)}
                    onChange={(e) =>
                      setContext({
                        ...context,
                        places: e.target.checked
                          ? [...context.places, key]
                          : context.places.filter((p) => p !== key),
                      })
                    }
                  />
                  {places[key]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Recursos confirmados</legend>
            <div className="profile-checks">
              {(Object.keys(facilities) as (keyof typeof facilities)[]).map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={context.facilities.includes(key)}
                    onChange={(e) =>
                      setContext({
                        ...context,
                        facilities: e.target.checked
                          ? [...context.facilities, key]
                          : context.facilities.filter((p) => p !== key),
                      })
                    }
                  />
                  {facilities[key]}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="quiet-note">
            Una pared despejada para apoyarte no confirma que admita balonazos. Marca solo los
            recursos que realmente puedes utilizar.
          </p>
          <button type="button" onClick={() => void save(false)}>
            Guardar disponibilidad
          </button>
        </details>
        <details>
          <summary>
            Organizar semana tipo{versions.length ? ` · versión ${versions.length}` : ''}
          </summary>
          <p>
            {child
              ? 'Cuenta primero club, gimnasio y partidos. Los juegos breves son complementos opcionales; reserva dos días sin entrenamiento específico.'
              : 'Distribuye propuestas y actividad existente. Elegir una sesión organiza la agenda; no certifica que su dificultad sea adecuada.'}
          </p>
          <p className="quiet-note">
            Un bloque por día. Para varias actividades externas, indica el total y sus nombres.
            La agenda no inicia sesiones ni registra que las hayas realizado.
          </p>
          <button
            type="button"
            onClick={() => {
              const proposal = suggestProgramWeek(participant.kind, slots, context);
              setSlots(proposal.slots);
              setMessage(
                proposal.added.length
                  ? `Propuesta preparada: ${proposal.added.length} ${child ? 'juego breve' : 'sesiones'}. Revisa los días y guarda una nueva versión.`
                  : 'No se añadieron sesiones: revisa días libres, minutos, lugares y compañía. Se conserva tu agenda.',
              );
            }}
          >
            Proponer inicio en los días libres
          </button>
          <p className="quiet-note">
            Conserva tus actividades y descansos. Solo usa días sin asignar con tiempo
            confirmado y deja separación entre actividades. No guarda hasta que revises la
            semana.
          </p>
          <div className="week-days">
            {weekdays.map((day, i) => {
              const slot = slots[i]!;
              return (
                <fieldset key={day}>
                  <legend>{day}</legend>
                  <label>
                    Actividad del {day.toLowerCase()}
                    <select
                      value={slot.kind === 'session' ? slot.sessionId : slot.kind}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSlot(
                          i,
                          value === 'unassigned' || value === 'rest'
                            ? { kind: value, minutes: 0 }
                            : value === 'external'
                              ? { kind: 'external', label: '', minutes: 0 }
                              : proposalSlot(value),
                        );
                      }}
                    >
                      <option value="unassigned">Sin asignar</option>
                      <option value="rest">Descanso</option>
                      <option value="external">Actividad externa</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                          {sessionRequirements(s.id, context).length
                            ? ' · requisitos por resolver'
                            : ''}
                        </option>
                      ))}
                      {slot.kind === 'session' &&
                        !coachingSessions.some((s) => s.id === slot.sessionId) && (
                          <option value={slot.sessionId}>
                            {slot.label} · contenido no disponible
                          </option>
                        )}
                    </select>
                  </label>
                  {slot.kind === 'external' && (
                    <div className="week-external">
                      <label>
                        Descripción del {day.toLowerCase()}
                        <input
                          maxLength={80}
                          value={slot.label}
                          onChange={(e) => setSlot(i, { ...slot, label: e.target.value })}
                          placeholder="Por ejemplo, cancha"
                        />
                      </label>
                      <label>
                        Minutos del {day.toLowerCase()}
                        <input
                          type="number"
                          min={1}
                          max={1440}
                          step={1}
                          value={slot.minutes || ''}
                          onChange={(e) =>
                            setSlot(i, { ...slot, minutes: Number(e.target.value) })
                          }
                        />
                      </label>
                    </div>
                  )}
                  {slot.kind === 'session' && (
                    <p>{slot.minutes} min · propuesta de la aplicación</p>
                  )}
                </fieldset>
              );
            })}
          </div>
          <p className="week-total" role="status">
            Programado: {summary.minutes} min · Fuera de la app: {summary.externalMinutes} min
            · Días de descanso: {summary.restDays} · Sin asignar: {summary.unassignedDays}
          </p>
          {!!summary.overbooked.length && (
            <p className="reference-pending">
              Supera tu disponibilidad: {summary.overbooked.join(', ')}. Revisa si corresponde
              mover o sustituir una actividad.
            </p>
          )}
          {summary.restDays < (child ? 2 : 1) && (
            <p className="quiet-note">
              {child
                ? 'Reserva días sin entrenamiento específico y cuenta también club y gimnasio antes de añadir práctica.'
                : 'Deja espacio para recuperarte; siete días disponibles no significan siete sesiones exigentes.'}
            </p>
          )}
          {!!issues.length && (
            <ul className="reference-pending">
              {issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          )}
          <button type="button" disabled={!!issues.length} onClick={() => void save(true)}>
            Guardar nueva versión de la semana
          </button>
          <p className="quiet-note">
            Son minutos previstos, no esfuerzo medido. Esta agenda no marca automáticamente el
            cumplimiento.
          </p>
        </details>
      </fieldset>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      {!!versions.length && (
        <details>
          <summary>Versiones guardadas ({versions.length})</summary>
          {[...versions].reverse().map((week) => (
            <article key={week.version}>
              <h3>
                Versión {week.version} · {new Date(week.savedAt).toLocaleDateString()}
              </h3>
              <ul>
                {week.slots.map((s, i) => (
                  <li key={i}>
                    {weekdays[i]}:{' '}
                    {s.kind === 'rest'
                      ? 'Descanso'
                      : s.kind === 'unassigned'
                        ? 'Sin asignar'
                        : `${s.label} · ${s.minutes} min`}
                    {!proposalUnchanged(s) &&
                      ' · contenido actual diferente; versión conservada'}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </details>
      )}
    </section>
  );
}
