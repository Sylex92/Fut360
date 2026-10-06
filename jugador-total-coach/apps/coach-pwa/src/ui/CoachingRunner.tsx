import { useEffect, useRef, useState } from 'react';
import type { SessionAction, SessionProjection } from '@fut360/domain';
import type { CoachingSession } from '../composition/development-plan';
import { coachingPlans } from '../composition/development-plan';
import { taskById, teachingVideos } from '../composition/coaching-catalog';
import { GuidedSession } from '../composition/guided-session';
import { useTrainingHistory } from './use-training-history';
import { TrainingHistory } from './TrainingHistory';
import { downloadRecords } from '../platform/training-store';
import { TaskInstructions } from './CoachingTask';
import { ReferenceVideo } from './ReferenceVideo';
import { SourceReferences } from './SourceReferences';
import { useParticipant } from './ParticipantContext';
export const clockText = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
};
export function CoachingRunner({
  session,
  onActiveChange,
  onClose,
}: {
  session: CoachingSession;
  onActiveChange: (value: boolean) => void;
  onClose: () => void;
}) {
  const plan = coachingPlans.get(session.id)!;
  const controller = useRef<GuidedSession | null>(null);
  const [state, setState] = useState<SessionProjection | null>(null);
  const [studying, setStudying] = useState(false);
  const { participant } = useParticipant();
  const [automaticVideos, setAutomaticVideos] = useState(false);
  const [mediaReady, setMediaReady] = useState(true);
  const mediaHold = useRef(false);
  const [message, setMessage] = useState('');
  const [rate] = useState<1 | 60>(() =>
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('e2e') === '1'
      ? 60
      : 1,
  );
  const history = useTrainingHistory(controller, rate === 60, JSON.stringify(plan));
  const active = state?.status === 'running' || state?.status === 'paused';
  useEffect(() => {
    onActiveChange(active || history.finalSavePending);
  }, [active, history.finalSavePending, onActiveChange]);
  useEffect(() => {
    const next = new GuidedSession(plan, () => performance.now(), !document.hidden, rate);
    controller.current = next;
    setState(next.snapshot().session);
    const interval = setInterval(() => setState(controller.current!.sample().session), 200);
    const visibility = () => {
      controller.current?.setVisible(!document.hidden);
      setState(controller.current!.snapshot().session);
    };
    const unload = (event: BeforeUnloadEvent) => {
      if (['running', 'paused'].includes(controller.current!.snapshot().session.status))
        event.preventDefault();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('beforeunload', unload);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('beforeunload', unload);
    };
  }, [plan, rate]);
  function act(action: SessionAction) {
    const c = controller.current;
    if (!c) return;
    if (action.type === 'Pause' || action.type === 'Abort') mediaHold.current = false;
    const result = c.act(action);
    setMessage(result.accepted ? '' : (result.reason ?? 'No se pudo realizar la acción.'));
    setState(c.snapshot().session);
    void history.save(c);
  }
  async function recover() {
    if (!history.recovery) return;
    try {
      const recovered = new GuidedSession(
        plan,
        () => performance.now(),
        !document.hidden,
        rate,
        history.recovery.record.journal,
      );
      if (await history.recover()) {
        controller.current = recovered;
        setMessage('');
        setState(recovered.snapshot().session);
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'No se pudo recuperar el recorrido.',
      );
    }
  }
  const target = state?.phase === 'rest' && state.next ? state.next : state?.current;
  const task = taskById.get(target?.exerciseId ?? session.blocks[0]!.taskId)!;
  const demonstration = teachingVideos(task)[0];
  const occurrence = target?.sourceOccurrenceId ?? plan.occurrences[0]!.id;
  const blockIndex = Number(occurrence.split('/')[1]);
  const block = session.blocks[blockIndex] ?? session.blocks[0]!;
  const complete = state?.status === 'completed' || state?.status === 'aborted';
  const phase =
    state?.phase === 'work'
      ? 'Práctica'
      : state?.phase === 'rest'
        ? 'Descanso y siguiente tarea'
        : 'Preparación';
  function mediaAvailability(ready: boolean, issue?: string) {
    const c = controller.current;
    if (!c || !automaticVideos) return;
    setMediaReady(ready);
    if ((!ready || issue) && c.snapshot().session.status === 'running') {
      c.act({ type: 'Pause' });
      mediaHold.current = true;
    }
    if (issue) {
      mediaHold.current = false;
      setMessage(issue);
    } else if (
      ready &&
      mediaHold.current &&
      !document.hidden &&
      c.snapshot().session.can.resume
    ) {
      mediaHold.current = false;
      c.act({ type: 'Resume', visible: true, resourcesReady: true });
      setMessage('');
    }
    setState(c.snapshot().session);
    void history.save(c);
  }
  function showDemonstration() {
    if (automaticVideos)
      document
        .querySelector('.coaching-runner .youtube-frame, .coaching-runner .local-video-frame')
        ?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
  return (
    <section className="panel coaching-runner" aria-labelledby="runner-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            RECORRIDO DE LA PROPUESTA{rate === 60 ? ' · PRUEBA ×60' : ''}
          </p>
          <h2 id="runner-heading">{session.name}</h2>
        </div>
        <button disabled={active || history.finalSavePending} onClick={onClose}>
          Volver al plan
        </button>
      </div>
      <p>
        Las ventanas incluyen preparación y descanso. Completa las repeticiones indicadas y
        descansa si sobra tiempo; no trabajes continuamente para llenar el reloj.
      </p>
      {history.recovery && (
        <div className="recovery-card">
          <h3>Hay un recorrido guardado</h3>
          <p>
            {history.recovery.record.journal.sessionId.startsWith('guided-')
              ? 'Recupera la propuesta que habías abierto.'
              : 'Hay una sesión de la vista anterior sin cerrar.'}
          </p>
          <button onClick={() => void recover()}>Recuperar en pausa</button>
          <button onClick={() => void history.closeRecovery()}>
            Cerrar recorrido pendiente
          </button>
          <button onClick={() => downloadRecords([history.recovery!.record])}>
            Exportar pendiente
          </button>
        </div>
      )}
      {(history.error || message) && <p role="alert">{history.error || message}</p>}
      {history.unsaved && (
        <button onClick={() => downloadRecords([history.unsaved!])}>
          Exportar progreso sin guardar
        </button>
      )}
      <div className="guided-clock">
        <div>
          <span>
            {complete
              ? 'Recorrido finalizado'
              : state?.status === 'paused'
                ? 'En pausa'
                : phase}
          </span>
          <strong>{clockText(state?.phaseRemainingMs ?? 0)}</strong>
        </div>
        <p>
          Programado: {clockText(plan.expectedDurationMs)}
          <br />
          Restante base: {clockText(state?.baseRemainingMs ?? plan.expectedDurationMs)}
          <br />
          Preparación añadida: {clockText(state?.counters.preparationAddedMs ?? 0)}
        </p>
      </div>
      <div className="session-actions">
        {mediaHold.current && (
          <button
            onClick={() => {
              mediaHold.current = false;
              setMessage('Pausa manual. El recorrido no se reanudará al terminar la carga.');
              setState(controller.current!.snapshot().session);
            }}
          >
            Mantener todo en pausa
          </button>
        )}
        {!complete && (
          <button
            onClick={() => {
              if (automaticVideos) {
                mediaHold.current = false;
                setMediaReady(true);
              }
              setAutomaticVideos(!automaticVideos);
              setStudying(false);
            }}
          >
            {automaticVideos
              ? 'Desactivar videos automáticos'
              : 'Activar demostraciones automáticas'}
          </button>
        )}
        {state?.can.start && (
          <button
            className="primary"
            data-playback-toggle
            disabled={
              !history.ready ||
              Boolean(history.recovery) ||
              Boolean(history.error) ||
              (automaticVideos && !!demonstration && !mediaReady)
            }
            onClick={() => {
              showDemonstration();
              act({ type: 'Start' });
            }}
          >
            Comenzar recorrido
          </button>
        )}
        {state?.can.pause && (
          <button
            className="primary"
            data-playback-toggle
            onClick={() => act({ type: 'Pause' })}
          >
            Pausar todo
          </button>
        )}
        {state?.can.resume && (
          <button
            className="primary"
            data-playback-toggle
            disabled={automaticVideos && !!demonstration && !mediaReady}
            onClick={() => {
              setStudying(false);
              showDemonstration();
              act({ type: 'Resume', visible: !document.hidden, resourcesReady: true });
            }}
          >
            Continuar
          </button>
        )}
        {state?.can.extend && (
          <>
            <button
              onClick={() =>
                act({
                  type: 'ExtendPreparation',
                  targetOccurrenceId: state.preparationTarget!.id,
                  amountMs: 30000,
                })
              }
            >
              +30 s para prepararme
            </button>
            <button
              onClick={() =>
                act({
                  type: 'ExtendPreparation',
                  targetOccurrenceId: state.preparationTarget!.id,
                  amountMs: 60000,
                })
              }
            >
              +1 min
            </button>
          </>
        )}
        {state?.can.skip && (
          <button onClick={() => act({ type: 'SkipCurrentWork' })}>
            Omitir trabajo actual
          </button>
        )}
        {state?.can.abort && (
          <button
            onClick={() => {
              setStudying(false);
              act({ type: 'Abort' });
            }}
          >
            Terminar recorrido
          </button>
        )}
      </div>
      {!automaticVideos && participant?.kind !== 'child' && !complete && (
        <p className="quiet-note">
          Algunos ejemplos conectan con YouTube: requieren Internet y pueden mostrar anuncios.
          Los videos locales se reproducen sin conectar con servicios externos.
        </p>
      )}
      {!complete && (
        <>
          <h3 className="current-task-title">{task.name}</h3>
          <p className="hour-dose">{block.dose}</p>
          {automaticVideos && demonstration && (
            <ReferenceVideo
              key={task.id}
              segment={demonstration}
              automatic
              paused={state?.status === 'paused' && !mediaHold.current}
              onAvailability={mediaAvailability}
            />
          )}
          {automaticVideos && !demonstration && (
            <p>Esta tarea todavía no tiene video integrado. Sus instrucciones están debajo.</p>
          )}
          {!automaticVideos && demonstration && (
            <>
              <button
                onClick={() => {
                  if (state?.status === 'running') act({ type: 'Pause' });
                  setStudying((v) => !v);
                }}
              >
                {studying ? 'Cerrar ejemplo' : 'Estudiar el video · pausa el recorrido'}
              </button>
              {studying && <ReferenceVideo key={task.id} segment={demonstration} />}
            </>
          )}
          <SourceReferences
            task={task}
            onOpen={() => {
              if (state?.status === 'running') act({ type: 'Pause' });
            }}
          />
          <TaskInstructions task={task} />
        </>
      )}
      <p className="quiet-note">
        Se registra la reproducción; no se mide automáticamente la actividad física.{' '}
        {history.savedAt ? 'Progreso guardado en este navegador.' : ''}
      </p>
      <TrainingHistory
        key={state?.sessionId}
        records={history.records}
        active={active}
        finished={Boolean(
          complete && history.records.some((r) => r.record.id === state?.sessionId),
        )}
        onFeedback={(feedback) => history.save(undefined, feedback)}
        onChange={history.refresh}
      />
    </section>
  );
}
