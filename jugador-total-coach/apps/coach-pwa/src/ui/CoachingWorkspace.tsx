import { useEffect, useRef, useState } from 'react';
import {
  coachingTasks,
  findTasks,
  taskById,
  taskCategories,
} from '../composition/coaching-catalog';
import {
  coachingSessions,
  coachingPlans,
  developmentStages,
} from '../composition/development-plan';
import { CoachingTaskCard } from './CoachingTask';
import { CoachingRunner, clockText } from './CoachingRunner';
import { trainingStore } from '../platform/training-store';
import { SessionEngine } from '@fut360/session-engine';
export function CoachingWorkspace({
  mode,
  onActiveChange,
}: {
  mode: 'plan' | 'library';
  onActiveChange: (v: boolean) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [place, setPlace] = useState('');
  const [videosOnly, setVideosOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState('attack-50');
  const [running, setRunning] = useState<string | null>(null);
  const [stage, setStage] = useState('prepare');
  const [pending, setPending] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    void trainingStore
      .list()
      .then((rows) => {
        const record = rows.find((r) =>
          ['running', 'paused'].includes(
            SessionEngine.fromJournal(r.record.journal).project().status,
          ),
        )?.record;
        const match =
          record &&
          coachingSessions.find(
            (s) => record.contentStamp === JSON.stringify(coachingPlans.get(s.id)),
          );
        if (mounted) setPending(match?.id ?? null);
      })
      .catch(() => {
        /* The runner reports storage errors before allowing a start. */
      });
    return () => {
      mounted = false;
    };
  }, [running]);
  const detail = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    setSelected(null);
    setRunning(null);
  }, [mode]);
  useEffect(() => {
    if (selected) {
      detail.current?.focus({ preventScroll: true });
      detail.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [selected]);
  const matches = findTasks(query, category, place, videosOnly);
  const task = selected ? taskById.get(selected) : null;
  const session = coachingSessions.find((s) => s.id === selectedSession)!;
  const currentStage = developmentStages.find((s) => s.id === stage)!;
  const runnerSession = coachingSessions.find((s) => s.id === running);
  if (runnerSession)
    return (
      <CoachingRunner
        key={runnerSession.id}
        session={runnerSession}
        onActiveChange={onActiveChange}
        onClose={() => {
          setRunning(null);
          onActiveChange(false);
        }}
      />
    );
  return (
    <section className="coaching-workspace" aria-labelledby="coaching-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {mode === 'plan' ? 'GOL · EXTREMO · MEDIOCAMPO · DEFENSA' : 'APRENDER PARA JUGAR'}
          </p>
          <h2 id="coaching-heading" ref={heading} tabIndex={-1}>
            {mode === 'plan' ? 'Mi plan de desarrollo' : 'Biblioteca de fútbol'}
          </h2>
        </div>
        <span className="draft-tag">PROPUESTA</span>
      </div>
      {pending && (
        <div className="recovery-card">
          <p>
            Tienes un recorrido sin terminar:{' '}
            {coachingSessions.find((s) => s.id === pending)!.name}.
          </p>
          <button onClick={() => setRunning(pending)}>Retomar recorrido guardado</button>
          <p className="quiet-note">
            Se recupera en pausa, sin contar el tiempo con la aplicación cerrada.
          </p>
        </div>
      )}
      {mode === 'plan' ? (
        <>
          <p className="plan-lead">
            Un primer ciclo de 24 semanas, con un horizonte de 52. La meta es mejorar tu
            rendimiento en juego: controlar, decidir, crear gol y defender. El calendario
            comienza cuando puedas retomar actividad; no promete un nivel profesional en una
            fecha.
          </p>
          <div className="plan-stage-layout">
            <div>
              <label htmlFor="plan-stage">Explorar una etapa</label>
              <select id="plan-stage" value={stage} onChange={(e) => setStage(e.target.value)}>
                {developmentStages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.weeks} · {s.label}
                  </option>
                ))}
              </select>
              <h3>{currentStage.focus}</h3>
              <p>{currentStage.criteria}</p>
              <p className="quiet-note">
                Explorar etapas no modifica tu capacidad ni te cambia de nivel. La carga de
                regreso se ajusta antes de entrenar.
              </p>
            </div>
            <aside className="plan-week">
              <strong>Una semana estable, una vez adaptado</strong>
              <p>
                Alternar técnica + fuerza, práctica de campo, recuperación y partido. Dos
                exposiciones de fuerza separadas; una prioridad ofensiva o defensiva por sesión
                de campo.
              </p>
              <p>
                Los entrenamientos sustituyen carga cuando hace falta. No se añaden todas estas
                sesiones encima de cuatro partidos.
              </p>
            </aside>
          </div>
          <h3>Sesiones que construyen el plan</h3>
          <p>
            Abre una propuesta para ver organización, series y descansos. Puedes estudiar
            cualquier ejercicio antes de recorrerla.
          </p>
          <div className="plan-session-grid">
            {coachingSessions.map((s) => (
              <button
                key={s.id}
                className="plan-session"
                aria-pressed={selectedSession === s.id}
                onClick={() => {
                  setSelectedSession(s.id);
                  setSelected(null);
                }}
              >
                <span>{clockText(coachingPlans.get(s.id)!.expectedDurationMs)} min</span>
                <strong>{s.name}</strong>
                <small>{s.place}</small>
                {currentStage.sessions.includes(s.id) && <em>Enfoque de esta etapa</em>}
              </button>
            ))}
          </div>
          <article className="panel proposed-session">
            <p className="eyebrow">
              SESIÓN PROPUESTA · {clockText(coachingPlans.get(session.id)!.expectedDurationMs)}
            </p>
            <h3>{session.name}</h3>
            <p>{session.goal}</p>
            <p>{session.context}</p>
            <ol className="plan-blocks">
              {session.blocks.map((block, i) => {
                const t = taskById.get(block.taskId)!;
                return (
                  <li key={i}>
                    <div>
                      <button className="task-link" onClick={() => setSelected(t.id)}>
                        {t.name}
                      </button>
                      <p>{block.dose}</p>
                      <small>
                        {block.rounds} {block.rounds === 1 ? 'ronda' : 'rondas'} ·{' '}
                        {block.preparation}s preparación + {block.work}s ventana + {block.rest}
                        s descanso por ronda
                      </small>
                    </div>
                    <span>
                      {clockText(
                        block.rounds * (block.preparation + block.work + block.rest) * 1000,
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="quiet-note">
              Estas dosis son una propuesta general para revisar, no la pauta individual de
              retorno. Velocidad máxima, sprints repetidos y saltos no se activan
              automáticamente por completar semanas.
            </p>
            <button
              className="primary"
              onClick={() => {
                setSelected(null);
                setRunning(session.id);
              }}
            >
              Recorrer esta propuesta
            </button>
          </article>
          <details className="plan-progress">
            <summary>Qué observar para progresar</summary>
            <ul>
              <li>
                Técnica: aciertos y pérdidas por lado en la misma tarea, y repetir otro día sin
                explicación continua.
              </li>
              <li>
                Recepción: información disponible, elección y primer toque; comparar con y sin
                presión.
              </li>
              <li>
                Gol: intentos, zona, tipo de llegada y calidad de ocasión; no solo goles.
              </li>
              <li>
                Defensa: progresión impedida, orientación y ayuda al compañero; no solo robos.
              </li>
              <li>
                Fuerza y carrera: misma variante/protocolo y respuesta posterior. El tiempo del
                reproductor no mide capacidad.
              </li>
            </ul>
            <p>
              Revisión breve cada dos semanas; balance al final de las semanas 8, 16 y 24.
              Cambiar una dificultad principal cada vez.
            </p>
          </details>
        </>
      ) : (
        <>
          <p>
            {coachingTasks.length} fichas para casa, cancha y gimnasio. Las referencias humanas
            aparecen primero; las animaciones siguen disponibles en su vista opcional.
          </p>
          <div className="coaching-filters">
            <label>
              Buscar ejercicio
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Recepción, defensa, V, gol…"
              />
            </label>
            <label>
              Objetivo
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Todos</option>
                {taskCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Lugar
              <select value={place} onChange={(e) => setPlace(e.target.value)}>
                <option value="">Todos</option>
                <option value="home">Casa</option>
                <option value="field">Fuera de casa</option>
              </select>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={videosOnly}
                onChange={(e) => setVideosOnly(e.target.checked)}
              />{' '}
              Con referencia en video
            </label>
          </div>
          <p role="status">{matches.length} fichas encontradas</p>
          <div className="coaching-task-grid">
            {matches.map((t) => (
              <button
                key={t.id}
                aria-pressed={selected === t.id}
                onClick={() => setSelected(t.id)}
              >
                <small>{t.category}</small>
                <strong>{t.name}</strong>
                <span>
                  {t.videos.length
                    ? t.videos.some((v) => v.match === 'demonstration')
                      ? 'Video del gesto'
                      : 'Video de un componente'
                    : 'Explicación · video pendiente'}
                </span>
              </button>
            ))}
          </div>
          {!matches.length && <p>Prueba otra palabra o quita un filtro.</p>}
        </>
      )}
      {task && (
        <section
          className="panel selected-task"
          ref={detail}
          tabIndex={-1}
          aria-label="Detalle del ejercicio"
        >
          <button
            onClick={() => {
              setSelected(null);
              heading.current?.focus();
            }}
          >
            Cerrar ficha
          </button>
          <CoachingTaskCard key={task.id} task={task} />
        </section>
      )}
    </section>
  );
}
