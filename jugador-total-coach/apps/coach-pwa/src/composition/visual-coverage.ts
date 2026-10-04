import sources from '../../../../content/coaching/source-pages.json';
import type { CoachingTask } from './coaching-catalog';
export const sourcePages = sources.references;
export function referencesFor(task: CoachingTask) {
  return sourcePages.filter((r) => r.tasks.includes(task.id));
}
export function visualCoverage(task: CoachingTask) {
  if (task.videos.some((v) => v.match === 'demonstration')) return 'Video del gesto';
  if (task.videos.length) return 'Video de un componente';
  if (referencesFor(task).length) return 'Ejemplo relacionado en la fuente';
  return 'Demostración pendiente';
}
