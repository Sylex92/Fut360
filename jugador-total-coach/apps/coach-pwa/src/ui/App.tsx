import { useState } from 'react';
import { validateWorkoutV1 } from '@fut360/exercise-catalog';
import type { WorkoutSummary } from '@fut360/domain';
import { DemoPanel } from './DemoPanel';
import { ContactPanel } from './ContactPanel';
import { MovementLibrary } from './MovementLibrary';
import { WorkoutPanel } from './WorkoutPanel';
import { OfflinePanel } from './OfflinePanel';
import { CoachingWorkspace } from './CoachingWorkspace';

const duration = (seconds: number) =>
  Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0') +
  ':' +
  (seconds % 60).toString().padStart(2, '0');

function SessionSummary({ summary }: { summary: WorkoutSummary }) {
  return (
    <>
      <div className="metrics" aria-label="Duración calculada">
        <div>
          <span className="metric-label">Tiempo total</span>
          <strong>
            {duration(summary.totalSeconds)}
            <small> min:s</small>
          </strong>
        </div>
        <div>
          <span className="metric-label">Trabajo programado</span>
          <strong>{duration(summary.workSeconds)}</strong>
        </div>
        <div>
          <span className="metric-label">Descansos</span>
          <strong>{duration(summary.restSeconds)}</strong>
        </div>
      </div>
      <section className="panel blocks" aria-labelledby="blocks-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CONTENIDO DE REFERENCIA</p>
            <h2 id="blocks-heading">Así se distribuye la hora</h2>
          </div>
          <span className="quiet">{summary.blocks.length} bloques</span>
        </div>
        <div className="timeline" aria-hidden="true">
          {summary.blocks.map((block, index) => (
            <span
              key={block.id}
              className={'tone-' + index}
              style={{ flexGrow: block.totalSeconds }}
            />
          ))}
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Bloques del ejemplo histórico, con rondas y duración calculada
            </caption>
            <thead>
              <tr>
                <th scope="col">Bloque</th>
                <th scope="col">Rondas</th>
                <th scope="col">Duración</th>
              </tr>
            </thead>
            <tbody>
              {summary.blocks.map((block, index) => (
                <tr key={block.id}>
                  <th scope="row">
                    <span className={'block-dot tone-' + index} aria-hidden="true" />
                    {block.name}
                  </th>
                  <td>{block.rounds}</td>
                  <td className="tabular">{duration(block.totalSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          {summary.occurrences} intervalos de ejercicio · {summary.uniqueExercises}{' '}
          identificadores distintos en el archivo original.
        </p>
      </section>
    </>
  );
}

export function App({ content }: { content: unknown }) {
  const [example, setExample] = useState<
    'plan' | 'workout' | 'library' | 'avatar' | 'contact' | 'hinge'
  >('plan');
  const [sessionActive, setSessionActive] = useState(false);
  const [result, setResult] = useState(() => validateWorkoutV1(content));
  const [checks, setChecks] = useState(0);
  function recheck() {
    setResult(validateWorkoutV1(content));
    setChecks((value) => value + 1);
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Ir al contenido
      </a>
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Fut360, inicio">
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          Fut<span>360</span>
        </a>
        <span className="phase-tag">
          ENTRENA <span aria-hidden="true">/</span> OBSERVA <span aria-hidden="true">/</span>{' '}
          PROGRESA
        </span>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">TU ENTRENADOR · EN CONSTRUCCIÓN</p>
            <h1 id="page-title">
              Tu plan,
              <br />
              <em>tu siguiente paso.</em>
            </h1>
            <p className="lead">
              Aprende el gesto, entiende la tarea y llévala al juego. Tu plan reúne técnica,
              gol, defensa y fuerza, con referencias visuales junto a cada explicación.
            </p>
          </div>
          <div className="intro-aside">
            <span className="local-badge">Ejecución local</span>
            <p>
              Sin cuenta ni servicios de pago.
              <br />
              Tu progreso se guarda en este navegador.
            </p>
          </div>
        </section>
        <nav className="camera-controls" aria-label="Secciones de entrenamiento">
          <button
            type="button"
            disabled={sessionActive}
            aria-pressed={example === 'plan'}
            onClick={() => setExample('plan')}
          >
            Mi plan
          </button>
          <button
            type="button"
            disabled={sessionActive}
            aria-pressed={example === 'workout'}
            onClick={() => setExample('workout')}
          >
            Prototipo de 60 minutos
          </button>
          <button
            type="button"
            disabled={sessionActive}
            aria-pressed={example === 'library'}
            onClick={() => setExample('library')}
          >
            Biblioteca de ejercicios
          </button>
          <button
            type="button"
            disabled={sessionActive}
            aria-pressed={example === 'avatar'}
            onClick={() => setExample('avatar')}
          >
            Animaciones 3D · en revisión
          </button>
          <button
            type="button"
            aria-pressed={example === 'contact'}
            disabled={sessionActive}
            onClick={() => setExample('contact')}
          >
            Pie y balón · fase 05
          </button>
          <button
            type="button"
            aria-pressed={example === 'hinge'}
            disabled={sessionActive}
            onClick={() => setExample('hinge')}
          >
            Bisagra de cadera · fase 04
          </button>
        </nav>
        <p className="quiet-note">
          {sessionActive
            ? 'Termina la sesión para abrir otra vista.'
            : 'Consulta tu plan o abre la biblioteca para estudiar una tarea.'}
        </p>
        <details className="technical-details">
          <summary>Guardar la aplicación para uso sin conexión</summary>
          <p>
            Las fichas, el plan y los recursos propios pueden guardarse. Los videos de YouTube
            requieren Internet.
          </p>
          <OfflinePanel active={sessionActive} />
        </details>
        {example === 'plan' || example === 'library' ? (
          <CoachingWorkspace mode={example} onActiveChange={setSessionActive} />
        ) : example === 'workout' ? (
          <WorkoutPanel onActiveChange={setSessionActive} />
        ) : example === 'avatar' ? (
          <>
            <p className="reference-pending">
              La naturalidad y claridad de estos movimientos están en revisión. Usa la
              biblioteca para consultar las referencias humanas disponibles.
            </p>
            <MovementLibrary />
          </>
        ) : example === 'contact' ? (
          <ContactPanel />
        ) : (
          <DemoPanel />
        )}
        <details className="technical-details">
          <summary>Comprobaciones del archivo de referencia de 60 minutos</summary>
          <section
            className={'status-strip ' + (result.ok ? 'status-ok' : 'status-error')}
            aria-labelledby="validation-heading"
          >
            <div>
              <h2 id="validation-heading">
                {result.ok
                  ? 'Archivo de referencia válido'
                  : 'El contenido necesita correcciones'}
              </h2>
              <p>
                {result.ok
                  ? 'La estructura y la suma de tiempos pasaron la comprobación.'
                  : 'Revisa los errores antes de usar este contenido.'}
              </p>
            </div>
            <button type="button" onClick={recheck}>
              Volver a comprobar <span aria-hidden="true">↻</span>
            </button>
          </section>
          <p className="check-feedback" role="status" aria-live="polite">
            {checks > 0
              ? 'Comprobación ' +
                checks +
                ': ' +
                (result.ok
                  ? 'estructura y duración correctas.'
                  : 'persisten errores en el contenido.')
              : ''}
          </p>
          {!result.ok ? (
            <section className="panel error-list" aria-label="Errores de validación">
              <ul>
                {result.issues.map((issue, index) => (
                  <li key={index}>
                    <code>{issue.path}</code>
                    <span>{issue.message}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <>
              <div className="session-label">
                <h2>{result.workout.displayName}</h2>
                <span className="draft-tag">
                  {result.workout.reviewStatus === 'draft'
                    ? 'BORRADOR'
                    : 'REVISIÓN DECLARADA EN EL ARCHIVO'}
                </span>
              </div>
              <SessionSummary summary={result.summary} />
            </>
          )}
        </details>
        <details className="technical-details">
          <summary>Estado del prototipo y revisión de contenido</summary>
          <div className="bottom-grid">
            <section className="panel readiness" aria-labelledby="readiness-title">
              <p className="eyebrow">ESTADO DEL PROYECTO</p>
              <h2 id="readiness-title">El camino hasta entrenar</h2>
              <ol>
                <li>
                  <span className="step-number">01</span>
                  <div>
                    <strong>Base y contenido</strong>
                    <p>Comprobación del formato y de los tiempos.</p>
                  </div>
                  <span className="step-state">
                    {result.ok ? 'Comprobado' : 'Con errores'}
                  </span>
                </li>
                <li>
                  <span className="step-number">02</span>
                  <div>
                    <strong>Reloj y controles</strong>
                    <p>Pausa, continuidad y preparación automática.</p>
                  </div>
                  <span className="step-state">Comprobado</span>
                </li>
                <li>
                  <span className="step-number">03</span>
                  <div>
                    <strong>Ejercicio con avatar</strong>
                    <p>Demostración clara y revisión del movimiento.</p>
                  </div>
                  <span className="step-state pending">En revisión</span>
                </li>
              </ol>
            </section>
            <aside className="review-note">
              <span className="note-label">ANTES DE ENTRENAR</span>
              <h2>
                {result.ok ? 'El tiempo cuadra.' : 'Contenido pendiente.'}
                <br />
                La revisión continúa.
              </h2>
              <p>
                Este ejemplo histórico sirve para comprobar la aplicación. No es todavía una
                rutina aprobada para practicar.
              </p>
              <p>
                La nueva sesión reúne las demostraciones revisadas. Su dosificación y
                adecuación individual siguen en revisión.
              </p>
            </aside>
          </div>
        </details>
        <details className="technical-details">
          <summary>Ver datos del archivo de referencia</summary>
          <p>
            Versión histórica v1. La comprobación técnica no valida ejercicios, recursos 3D ni
            adecuación personal.
          </p>
          <pre>{JSON.stringify(content, null, 2)}</pre>
        </details>
      </main>
      <footer>
        <span>Fut360 · Jugador Total Coach</span>
        <span>Casa · cancha · gimnasio · referencias online opcionales</span>
      </footer>
    </div>
  );
}
