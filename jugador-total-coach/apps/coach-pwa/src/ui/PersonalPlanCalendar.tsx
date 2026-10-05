import { useEffect, useRef, useState } from 'react';
import { useParticipant } from './ParticipantContext';
import { saveParticipant } from '../platform/participant-store';
import { validateParticipant } from '../platform/participant';
import {
  addDays,
  emptyPersonalPlan,
  localDate,
  monday,
  observationComparison,
  parsePlanOffer,
  planStages,
  stageForAudience,
} from '../platform/personal-plan';
import type {
  PersonalPlan,
  PlanStage,
  DayReport,
  SkillObservation,
} from '../platform/personal-plan';
import { emptyPlanningContext, emptyWeek, weekdays, weekSummary } from '../platform/planning';
import type { PlanningContext, WeekSlot } from '../platform/planning';
import { coachingSessions } from '../composition/development-plan';
import { sessionAudience } from '../composition/personal-programs';
import {
  proposalSlot,
  proposalUnchanged,
  sessionRequirements,
} from '../composition/session-eligibility';
import { coachingTasks, taskAudience, taskById } from '../composition/coaching-catalog';
import { visualCoverage } from '../composition/visual-coverage';
import {
  calendarSlots,
  childBallCycle,
  childReviewFocus,
} from '../composition/calendar-cycle';

export function PersonalPlanCalendar({
  onSelect,
  onBusyChange,
}: {
  onSelect: (id: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const { participant, refreshParticipant } = useParticipant();
  const personal = participant?.personalPlan ?? emptyPersonalPlan();
  const latest = personal.versions.at(-1);
  const child = participant?.kind === 'child';
  const [start, setStart] = useState(latest?.start ?? monday(localDate()));
  const [stage, setStage] = useState<PlanStage>(latest?.stage ?? (child ? 'play' : 'entry'));
  const [weeks, setWeeks] = useState(latest?.weeks ?? (child ? 8 : 2));
  const [context, setContext] = useState(
    latest?.context ?? participant?.planning?.context ?? emptyPlanningContext(),
  );
  const [slots, setSlots] = useState<WeekSlot[]>(
    structuredClone(
      latest?.slots ?? participant?.planning?.weeks.at(-1)?.slots ?? emptyWeek(),
    ),
  );
  const [reason, setReason] = useState(
    'Plan inicial según objetivos, disponibilidad y actividad existente.',
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [week, setWeek] = useState(0);
  const [versionNumber, setVersionNumber] = useState<number | null>(null);
  const editor = useRef<HTMLDetailsElement>(null);
  const [offer, setOffer] = useState(() => {
    try {
      return {
        value: parsePlanOffer(typeof window === 'undefined' ? '' : window.location.hash),
        error: '',
      };
    } catch {
      return {
        value: null,
        error: 'No se pudo leer la propuesta recibida. No se cambió ningún dato.',
      };
    }
  });
  const [reportDate, setReportDate] = useState(localDate());
  const [outcome, setOutcome] = useState<DayReport['outcome']>('done');
  const [actualMinutes, setActualMinutes] = useState(0);
  const [notes, setNotes] = useState('');
  const [observationNotes, setObservationNotes] = useState('');
  const [taskId, setTaskId] = useState(child ? 'Y07' : 'S04');
  const [side, setSide] = useState<SkillObservation['side']>('both');
  const [condition, setCondition] = useState('');
  const [attempts, setAttempts] = useState(10);
  const [successes, setSuccesses] = useState(0);
  const [comfort, setComfort] = useState<SkillObservation['comfort']>('comfortable');
  const [observationDate, setObservationDate] = useState(localDate());
  useEffect(() => {
    const readOffer = () => {
      try {
        setOffer({ value: parsePlanOffer(window.location.hash), error: '' });
      } catch {
        setOffer({
          value: null,
          error: 'No se pudo leer la propuesta recibida. No se cambió ningún dato.',
        });
      }
    };
    window.addEventListener('hashchange', readOffer);
    return () => window.removeEventListener('hashchange', readOffer);
  }, []);
  if (!participant)
    return <p>Elige un perfil para guardar un plan personal y sus resultados.</p>;
  const sessions = coachingSessions.filter((s) => sessionAudience(s) === participant.kind);
  const version = personal.versions.find((v) => v.version === versionNumber) ?? latest;
  const summary = weekSummary(slots, context);
  const issues = slots.flatMap((s) =>
    s.kind === 'session'
      ? [
          ...sessionRequirements(s.sessionId, context),
          ...(proposalUnchanged(s) ? [] : ['La sesión cambió; selecciónala de nuevo.']),
        ]
      : [],
  );
  const knownMinutes = context.availableMinutes.every((m) => m !== null);
  const setSlot = (index: number, value: WeekSlot) =>
    setSlots(slots.map((s, i) => (i === index ? value : s)));
  async function persist(
    nextPlan: PersonalPlan,
    success: string,
    reviewedContext?: PlanningContext,
  ) {
    if (!participant || !refreshParticipant || busy) return false;
    setBusy(true);
    onBusyChange(true);
    setError('');
    setMessage('');
    try {
      await saveParticipant(
        validateParticipant({
          ...participant,
          personalPlan: nextPlan,
          ...(reviewedContext
            ? {
                planning: {
                  context: reviewedContext,
                  weeks: participant.planning?.weeks ?? [],
                },
              }
            : {}),
        }),
        participant,
      );
      await refreshParticipant();
      setMessage(success);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar.');
      return false;
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }
  function useOffer() {
    const o = offer.value;
    if (!o || o.kind !== participant?.kind) return;
    try {
      const next = o.days.map((d): WeekSlot => {
        if (d.kind === 'rest') return { kind: 'rest', minutes: 0 };
        if (d.kind === 'external') return d;
        const s = sessions.find((s) => s.id === d.sessionId);
        if (!s) throw new Error('La propuesta contiene una sesión incompatible.');
        return proposalSlot(s.id);
      });
      setContext(o.context);
      setSlots(next);
      setWeeks(o.weeks ?? (child ? 8 : 2));
      setStage(o.stage ?? (child ? 'play' : 'entry'));
      if (o.reason) setReason(o.reason);
      if (editor.current) {
        editor.current.open = true;
        editor.current.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
      setMessage('Propuesta cargada para revisar. Elige el lunes de inicio y guarda el plan.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Propuesta no válida.');
    }
  }
  async function savePlan() {
    if (
      issues.length ||
      summary.overbooked.length ||
      !knownMinutes ||
      slots.some((s) => s.kind === 'unassigned')
    ) {
      setError(
        'Completa disponibilidad y actividades, y resuelve los requisitos antes de guardar.',
      );
      return;
    }
    if (summary.restDays < (child ? 2 : 1)) {
      setError(
        child
          ? 'Conserva al menos dos días de descanso del entrenamiento específico.'
          : 'Conserva al menos un día de descanso.',
      );
      return;
    }
    const saved = await persist(
      {
        ...personal,
        versions: [
          ...personal.versions,
          {
            version: personal.versions.length + 1,
            savedAt: new Date().toISOString(),
            start,
            weeks,
            stage,
            context,
            slots,
            ...(child ? { cycle: childBallCycle(slots) } : {}),
            reason,
          },
        ],
      },
      'Plan guardado. Las versiones anteriores y los resultados se conservan.',
      context,
    );
    if (saved) {
      setVersionNumber(null);
      setWeek(0);
      if (offer.value?.kind === participant?.kind) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
        setOffer({ value: null, error: '' });
      }
    }
  }
  async function saveReport() {
    if (!version || reportDate > localDate()) {
      setError('El resultado corresponde a una fecha realizada dentro del plan.');
      return;
    }
    await persist(
      {
        ...personal,
        reports: [
          ...personal.reports,
          {
            id: crypto.randomUUID(),
            recordedAt: new Date().toISOString(),
            date: reportDate,
            planVersion: version.version,
            outcome,
            minutes: outcome === 'skipped' ? 0 : actualMinutes,
            notes,
          },
        ],
      },
      'Resultado guardado como declaración de práctica; no como medición automática.',
    );
  }
  async function saveObservation() {
    if (observationDate > localDate()) {
      setError('No se puede registrar una observación futura.');
      return;
    }
    await persist(
      {
        ...personal,
        observations: [
          ...personal.observations,
          {
            id: crypto.randomUUID(),
            recordedAt: new Date().toISOString(),
            date: observationDate,
            taskId,
            side,
            condition,
            attempts,
            successes,
            comfort,
            notes: observationNotes,
          },
        ],
      },
      'Observación guardada. Compara solo la misma tarea, lado y condiciones.',
    );
  }
  return (
    <section className="panel personal-calendar" aria-labelledby="calendar-title">
      <p className="eyebrow">TU SEMANA · TUS RESULTADOS</p>
      <h2 id="calendar-title">Plan personal con fechas</h2>
      <p>
        La semana se repite para organizar la práctica. Cada dos semanas revisa recuperación,
        ejecución y resultados antes de cambiar dificultad. Llegar a una fecha no cambia tu
        nivel.
      </p>
      {offer.error && <p role="alert">{offer.error}</p>}
      {offer.value && (
        <div className="recovery-card">
          <p>
            Hay una propuesta preparada para un perfil{' '}
            {offer.value.kind === 'child' ? 'infantil' : 'adulto'}.
          </p>
          {offer.value.kind === participant.kind ? (
            <button disabled={busy} onClick={useOffer}>
              Cargar mi propuesta para revisar
            </button>
          ) : (
            <p>Elige el perfil correspondiente para cargarla.</p>
          )}
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      <p role="status">{message}</p>
      <details ref={editor} open={!latest}>
        <summary>
          {latest ? 'Ajustar el plan y guardar otra versión' : 'Preparar mi calendario'}
        </summary>
        <fieldset disabled={busy}>
          <div className="coaching-filters">
            <label>
              Lunes de inicio
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </label>
            <label>
              Semanas del calendario
              <input
                type="number"
                min="1"
                max={child ? 8 : 24}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
              />
            </label>
            <label>
              Etapa guardada
              <select value={stage} onChange={(e) => setStage(e.target.value as PlanStage)}>
                {Object.entries(planStages)
                  .filter(([key]) => stageForAudience(key, participant.kind))
                  .map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <p>
            La etapa describe la decisión registrada; no modifica por sí sola las sesiones.
            Para cambiar la dosis, elige y revisa otra sesión.
          </p>
          <button
            onClick={() => {
              setContext(participant.planning?.context ?? emptyPlanningContext());
              setSlots(
                structuredClone(participant.planning?.weeks.at(-1)?.slots ?? emptyWeek()),
              );
              setMessage('Se copió la semana guardada para revisar, sin modificarla.');
            }}
          >
            Usar mi disponibilidad y semana guardadas
          </button>
          <p className="quiet-note">
            Si falta un lugar o compañía, puedes actualizarlo en «Disponibilidad y lugares» y
            volver a copiarlo aquí.
          </p>
          <div className="week-days">
            {slots.map((s, i) => (
              <div className="calendar-day-edit" key={i}>
                <strong>{weekdays[i]}</strong>
                <label>
                  Minutos disponibles · {weekdays[i]}
                  <input
                    type="number"
                    min="0"
                    max="1440"
                    value={context.availableMinutes[i] ?? ''}
                    onChange={(e) =>
                      setContext({
                        ...context,
                        availableMinutes: context.availableMinutes.map((n, j) =>
                          j === i
                            ? e.target.value === ''
                              ? null
                              : Number(e.target.value)
                            : n,
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Actividad · {weekdays[i]}
                  <select
                    value={s.kind === 'session' ? s.sessionId : s.kind}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSlot(
                        i,
                        v === 'rest'
                          ? { kind: 'rest', minutes: 0 }
                          : v === 'unassigned'
                            ? { kind: 'unassigned', minutes: 0 }
                            : v === 'external'
                              ? { kind: 'external', label: 'Actividad existente', minutes: 60 }
                              : proposalSlot(v),
                      );
                    }}
                  >
                    <option value="unassigned">Sin asignar</option>
                    <option value="rest">Descanso</option>
                    <option value="external">Actividad existente</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                {s.kind === 'external' && (
                  <>
                    <label>
                      Nombre · {weekdays[i]}
                      <input
                        maxLength={80}
                        value={s.label}
                        onChange={(e) => setSlot(i, { ...s, label: e.target.value })}
                      />
                    </label>
                    <label>
                      Duración · {weekdays[i]}
                      <input
                        type="number"
                        min="1"
                        max="1440"
                        value={s.minutes}
                        onChange={(e) => setSlot(i, { ...s, minutes: Number(e.target.value) })}
                      />
                    </label>
                  </>
                )}
                <span>{s.minutes} min previstos</span>
              </div>
            ))}
          </div>
          <p>
            {summary.minutes} min semanales · {summary.externalMinutes} min de actividad
            existente · {summary.restDays} días de descanso.
          </p>
          {summary.overbooked.length > 0 && (
            <p role="alert">No cabe en la disponibilidad: {summary.overbooked.join(', ')}.</p>
          )}
          {!!issues.length && (
            <ul>
              {[...new Set(issues)].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          <p>
            {child
              ? 'El complemento sustituye otra práctica cuando haga falta. Tener más tiempo el día de club o gimnasio no obliga a una segunda sesión.'
              : 'Un partido sustituye una sesión exigente. Recuperación y calidad determinan los cambios, no llenar toda la hora disponible.'}
          </p>
          <label>
            Motivo y condiciones de esta versión
            <textarea
              maxLength={600}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button className="primary" onClick={() => void savePlan()}>
            Guardar plan con fechas
          </button>
        </fieldset>
      </details>
      {version && (
        <>
          <div className="coaching-filters">
            <label>
              Versión del plan
              <select
                value={version.version}
                onChange={(e) => {
                  setVersionNumber(Number(e.target.value));
                  setWeek(0);
                }}
              >
                {personal.versions.map((v) => (
                  <option key={v.version} value={v.version}>
                    Versión {v.version} · {v.start} · {planStages[v.stage]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Semana visible
              <select
                value={Math.min(week, version.weeks - 1)}
                onChange={(e) => setWeek(Number(e.target.value))}
              >
                {Array.from({ length: version.weeks }, (_, i) => (
                  <option key={i} value={i}>
                    Semana {i + 1} · {addDays(version.start, i * 7)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p>{version.reason}</p>
          {child && version.cycle && (
            <>
              <p>
                El complemento alterna conducción, gol, recepción, pase y protección sin
                choque. Conserva duración, actividad existente y descanso.
              </p>
              <p>{childReviewFocus[Math.min(3, Math.floor(week / 2))]}</p>
            </>
          )}
          {(week + 1) % 2 === 0 && (
            <div className="recovery-card">
              <strong>Semana de revisión</strong>
              <p>
                Revisa cómo se sintió, la calidad del movimiento y los resultados en
                condiciones iguales. Puedes mantener o reducir la carga. Cambia una sola
                dificultad y guarda el motivo en otra versión.
              </p>
            </div>
          )}
          <ol className="dated-days">
            {calendarSlots(version, week).map((slot, i) => {
              const date = addDays(version.start, week * 7 + i);
              const report = personal.reports
                .filter((r) => r.planVersion === version.version && r.date === date)
                .at(-1);
              return (
                <li key={date}>
                  <div>
                    <strong>
                      {weekdays[i]} · {date}
                    </strong>
                    <p>
                      {slot.kind === 'rest'
                        ? 'Descanso del entrenamiento específico'
                        : slot.kind === 'unassigned'
                          ? 'Sin asignar'
                          : slot.label}{' '}
                      {slot.minutes > 0 ? `· ${slot.minutes} min` : ''}
                    </p>
                    {report && (
                      <span className="draft-tag">
                        {report.outcome === 'done'
                          ? 'REALIZADO'
                          : report.outcome === 'partial'
                            ? 'PARCIAL'
                            : 'OMITIDO'}{' '}
                        · {report.minutes} min declarados
                      </span>
                    )}
                  </div>
                  {slot.kind === 'session' && (
                    <button
                      disabled={
                        busy ||
                        !proposalUnchanged(slot) ||
                        !!sessionRequirements(
                          slot.sessionId,
                          participant.planning?.context ?? version.context,
                        ).length
                      }
                      onClick={() => onSelect(slot.sessionId)}
                    >
                      Ver sesión y demostraciones
                    </button>
                  )}
                  {date <= localDate() && (
                    <button
                      disabled={busy}
                      onClick={() => {
                        setReportDate(date);
                        setActualMinutes(slot.minutes);
                        document
                          .getElementById('day-result')
                          ?.scrollIntoView({ block: 'start', behavior: 'instant' });
                      }}
                    >
                      Registrar resultado
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
          <details>
            <summary>Biblioteca de este plan y cobertura visual</summary>
            <ul>
              {[
                ...new Set(
                  (version.cycle?.flat() ?? version.slots).flatMap((s) =>
                    s.kind === 'session'
                      ? (coachingSessions
                          .find((c) => c.id === s.sessionId)
                          ?.blocks.map((b) => b.taskId) ?? [])
                      : [],
                  ),
                ),
              ].map((id) => (
                <li key={id}>
                  {taskById.get(id)?.name ?? id} ·{' '}
                  {taskById.has(id) ? visualCoverage(taskById.get(id)!) : 'Contenido cambió'}
                </li>
              ))}
            </ul>
          </details>
          <fieldset id="day-result" disabled={busy}>
            <legend>Resultado de un día</legend>
            <p>
              Registra lo que realmente se hizo. El reloj de la app no lo confirma
              automáticamente. Una nueva anotación conserva la anterior.
            </p>
            <div className="coaching-filters">
              <label>
                Fecha realizada
                <input
                  type="date"
                  min={version.start}
                  max={
                    addDays(version.start, version.weeks * 7 - 1) < localDate()
                      ? addDays(version.start, version.weeks * 7 - 1)
                      : localDate()
                  }
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </label>
              <label>
                Resultado
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as DayReport['outcome'])}
                >
                  <option value="done">Realizado</option>
                  <option value="partial">Parcial</option>
                  <option value="skipped">Omitido</option>
                </select>
              </label>
              <label>
                Minutos realmente practicados
                <input
                  disabled={outcome === 'skipped'}
                  type="number"
                  min="0"
                  max="1440"
                  value={outcome === 'skipped' ? 0 : actualMinutes}
                  onChange={(e) => setActualMinutes(Number(e.target.value))}
                />
              </label>
            </div>
            <label>
              Notas del día
              <textarea
                value={notes}
                maxLength={600}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <button onClick={() => void saveReport()}>Guardar resultado del día</button>
          </fieldset>
        </>
      )}
      <details className="skill-observations">
        <summary>Observar avances por ejercicio</summary>
        <p>
          Usa intentos de la práctica habitual, sin añadir una prueba máxima. Describe
          distancia, puerta, superficie y regla de acierto para poder repetirlas. El
          acompañante puede anotar lo que observa; no califiques el cuerpo del niño.
        </p>
        <fieldset disabled={busy}>
          <legend>Nueva observación</legend>
          <div className="coaching-filters">
            <label>
              Ejercicio observado
              <select
                value={taskId}
                onChange={(e) => {
                  setTaskId(e.target.value);
                  setCondition('');
                }}
              >
                {coachingTasks
                  .filter((t) => taskAudience(t) === participant.kind)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Fecha observada
              <input
                type="date"
                max={localDate()}
                value={observationDate}
                onChange={(e) => setObservationDate(e.target.value)}
              />
            </label>
            <label>
              Lado observado
              <select
                value={side}
                onChange={(e) => setSide(e.target.value as SkillObservation['side'])}
              >
                <option value="both">Ambos / no aplica</option>
                <option value="left">Izquierdo</option>
                <option value="right">Derecho</option>
              </select>
            </label>
            <label>
              Intentos observados
              <input
                type="number"
                min="1"
                max="100"
                value={attempts}
                onChange={(e) => setAttempts(Number(e.target.value))}
              />
            </label>
            <label>
              Aciertos según la misma regla
              <input
                type="number"
                min="0"
                max={attempts}
                value={successes}
                onChange={(e) => setSuccesses(Number(e.target.value))}
              />
            </label>
            <label>
              Cómo fue la práctica
              <select
                value={comfort}
                onChange={(e) => setComfort(e.target.value as SkillObservation['comfort'])}
              >
                <option value="comfortable">Cómoda y controlada</option>
                <option value="difficult">Costó mantener la calidad</option>
                <option value="stop">Se detuvo por malestar</option>
              </select>
            </label>
          </div>
          <label>
            Condiciones y qué cuenta como acierto
            <input
              maxLength={200}
              value={condition}
              placeholder="Por ejemplo: misma puerta, distancia y superficie; pase que cruza entre las marcas"
              onChange={(e) => setCondition(e.target.value)}
            />
          </label>
          <label>
            Notas de la observación
            <textarea
              maxLength={600}
              value={observationNotes}
              onChange={(e) => setObservationNotes(e.target.value)}
            />
          </label>
          <button onClick={() => void saveObservation()}>Guardar observación</button>
        </fieldset>
        <ul>
          {personal.observations
            .slice(-12)
            .reverse()
            .map((o) => {
              const comparison = observationComparison(personal.observations, o);
              return (
                <li key={o.id}>
                  <strong>
                    {o.date} · {taskById.get(o.taskId)?.name ?? o.taskId}
                  </strong>
                  <p>
                    {o.successes}/{o.attempts} aciertos ·{' '}
                    {o.side === 'left'
                      ? 'izquierda'
                      : o.side === 'right'
                        ? 'derecha'
                        : 'ambos'}{' '}
                    · {o.condition}
                  </p>
                  <p>
                    {comparison
                      ? `${comparison.change > 0 ? '+' : ''}${comparison.change} puntos porcentuales frente a ${comparison.previous.date}, en las mismas condiciones declaradas.`
                      : 'Primera referencia en estas condiciones; todavía sin comparación entre días.'}
                  </p>
                  <p>
                    {o.comfort === 'stop'
                      ? 'Detenerse y valorar el malestar antes de progresar.'
                      : o.comfort === 'difficult'
                        ? 'Mantener o simplificar la tarea; no aumentar por una cifra aislada.'
                        : 'Repetir en otro día y observar control antes de aumentar una dificultad.'}
                  </p>
                  {o.notes && <p>{o.notes}</p>}
                  <button
                    onClick={() => {
                      setTaskId(o.taskId);
                      setSide(o.side);
                      setCondition(o.condition);
                      setAttempts(o.attempts);
                      setSuccesses(0);
                      setObservationDate(localDate());
                    }}
                  >
                    Usar estas condiciones en otra observación
                  </button>
                </li>
              );
            })}
        </ul>
        <p className="quiet-note">
          Son observaciones declaradas. No certifican aprendizaje, aptitud médica ni nivel
          profesional. Descarga el respaldo completo del perfil para conservar plan y
          resultados.
        </p>
      </details>
    </section>
  );
}
