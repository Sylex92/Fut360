import type { CoachingTask } from '../composition/coaching-catalog';
import { referencesFor } from '../composition/visual-coverage';
export function SourceReferences({
  task,
  onOpen,
}: {
  task: CoachingTask;
  onOpen?: () => void;
}) {
  const refs = referencesFor(task);
  if (!refs.length) return null;
  return (
    <aside className="source-references" aria-label="Ejemplos relacionados">
      <h3>Ver un ejemplo relacionado</h3>
      {refs.map((ref) => (
        <div key={ref.id}>
          <p>{ref.note}</p>
          <p>
            <a href={ref.url} target="_blank" rel="noopener noreferrer" onClick={onOpen}>
              Abrir {ref.title}
            </a>
          </p>
          <p className="quiet-note">
            Busca {ref.section}. Se abre la página del autor; el inicio y el final no se
            controlan desde aquí.
          </p>
        </div>
      ))}
      {task.id.startsWith('Y') && (
        <p className="quiet-note">El adulto acompaña la consulta de la página externa.</p>
      )}
    </aside>
  );
}
