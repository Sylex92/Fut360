import { useState } from 'react';
import type { CoachingTask as Task } from '../composition/coaching-catalog';
import { spaceLabels } from '../composition/coaching-catalog';
import { ReferenceVideo } from './ReferenceVideo';
import { TaskDiagram } from './TaskDiagram';
export function TaskInstructions({ task }: { task: Task }) {
  return (
    <div className="task-instructions">
      <p className="task-purpose">{task.objective}</p>
      <div className="task-meta">
        <span>{spaceLabels[task.space] ?? task.space}</span>
        <span>
          {task.participants === 1
            ? 'Individual'
            : `${task.participants} personas como mínimo`}
        </span>
      </div>
      <h3>Antes de empezar</h3>
      <p>{task.setup}</p>
      <p className="quiet-note">Material: {task.equipment.join(' · ')}</p>
      <TaskDiagram taskId={task.id} />
      <h3>Cómo se hace</h3>
      <ol>
        {task.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="task-result">
        <strong>Qué buscar</strong>
        <p>{task.success}</p>
        <strong>Evita</strong>
        <p>{task.mistakes}</p>
      </div>
      <details>
        <summary>Ajustar dificultad y modalidad</summary>
        <p>
          <strong>Para empezar:</strong> {task.easier}
        </p>
        <p>
          <strong>Para progresar:</strong> {task.harder}
        </p>
        <p>
          <strong>FUT 5 / futsal:</strong> {task.modalities.fut5}
        </p>
        <p>
          <strong>FUT 7:</strong> {task.modalities.fut7}
        </p>
        <p>
          <strong>FUT 11:</strong> {task.modalities.fut11}
        </p>
      </details>
    </div>
  );
}
export function CoachingTaskCard({ task }: { task: Task }) {
  const [videoIndex, setVideoIndex] = useState(0);
  const video = task.videos[videoIndex] ?? task.videos[0];
  return (
    <article className="coaching-task-card">
      <p className="eyebrow">{task.category}</p>
      <h2>{task.name}</h2>
      {video ? (
        <>
          {task.videos.length > 1 && (
            <label>
              Referencia{' '}
              <select
                value={videoIndex}
                onChange={(e) => setVideoIndex(Number(e.target.value))}
              >
                {task.videos.map((v, i) => (
                  <option key={v.id} value={i}>
                    {v.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <ReferenceVideo key={video.id} segment={video} />
        </>
      ) : (
        <p className="reference-pending">
          La explicación está disponible. La demostración en video de esta variante sigue
          pendiente.
        </p>
      )}
      <TaskInstructions task={task} />
    </article>
  );
}
